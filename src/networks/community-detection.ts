import { NetworkGraph } from './topology.js';

/**
 * Community assignment result
 */
export interface CommunityResult {
  nodeId: string;
  communityId: number;
}

/**
 * Community Detection using the Louvain algorithm (greedy modularity optimization).
 *
 * Modularity Q measures the quality of a community partition:
 * ```
 *   Q = (1/2m) Σᵢⱼ [Aᵢⱼ - (kᵢkⱼ/2m)] δ(cᵢ, cⱼ)
 * ```
 *
 * Reference: Blondel et al., "Fast unfolding of communities in large networks" (2008)
 */
export class CommunityDetector {
  /**
   * Detects communities in a NetworkGraph using greedy modularity.
   */
  public static detect(
    graph: NetworkGraph
  ): { communities: CommunityResult[]; modularity: number; numCommunities: number } {
    const nodes = Array.from(graph.nodes.keys());
    const communityMap = new Map<string, number>();
    nodes.forEach((n, i) => communityMap.set(n, i));

    const totalEdges = Array.from(graph.nodes.values()).reduce((s, n) => s + n.degree, 0) / 2;
    const m2 = totalEdges * 2 || 1;

    // Greedy phase: move each node to the community that maximizes ΔQ
    let improved = true;
    let iterations = 0;
    while (improved && iterations < 50) {
      improved = false;
      iterations++;
      for (const nodeId of nodes) {
        const node = graph.nodes.get(nodeId)!;
        const currentCommunity = communityMap.get(nodeId)!;

        const communityEdges = new Map<number, number>();
        for (const neighbor of node.neighbors) {
          const nc = communityMap.get(neighbor)!;
          communityEdges.set(nc, (communityEdges.get(nc) || 0) + 1);
        }

        let bestCommunity = currentCommunity;
        let bestDelta = 0;
        for (const [comm, edgesIn] of communityEdges) {
          const delta = edgesIn / m2;
          if (delta > bestDelta) {
            bestDelta = delta;
            bestCommunity = comm;
          }
        }

        if (bestCommunity !== currentCommunity) {
          communityMap.set(nodeId, bestCommunity);
          improved = true;
        }
      }
    }

    // Compute modularity Q
    let Q = 0;
    for (const [nodeId, node] of graph.nodes) {
      const ki = node.degree;
      const ci = communityMap.get(nodeId)!;
      for (const neighbor of node.neighbors) {
        const kj = graph.nodes.get(neighbor)!.degree;
        const cj = communityMap.get(neighbor)!;
        if (ci === cj) {
          Q += 1 - (ki * kj) / m2;
        }
      }
    }
    Q /= m2;

    const communities = nodes.map((n) => ({ nodeId: n, communityId: communityMap.get(n)! }));
    const uniqueCommunities = new Set(communities.map((c) => c.communityId));

    return { communities, modularity: Q, numCommunities: uniqueCommunities.size };
  }
}
