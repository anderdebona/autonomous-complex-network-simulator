import { NetworkGraph } from './topology.js';

export interface CascadePercolationResult {
  removedNodeId: string;
  giantComponentFraction: number; // Order parameter P_infty
  criticalThresholdPc: number;
  isNetworkCollapsed: boolean;
  rewiredEdgesCount: number;
}

export class PercolationCascadeEngine {
  /**
   * Simulates targeted hub destruction and calculates Giant Component fraction
   * Under percolation theory, Scale-Free networks collapse at threshold p_c
   */
  public static simulateCascadeFailure(
    graph: NetworkGraph,
    targetHubId: string
  ): CascadePercolationResult {
    const targetNode = graph.nodes.get(targetHubId);
    if (!targetNode) {
      return {
        removedNodeId: targetHubId,
        giantComponentFraction: 1.0,
        criticalThresholdPc: 0.2,
        isNetworkCollapsed: false,
        rewiredEdgesCount: 0,
      };
    }

    // Remove target node and disconnect edges
    graph.nodes.delete(targetHubId);
    graph.nodes.forEach((n) => {
      n.neighbors = n.neighbors.filter((neighbor) => neighbor !== targetHubId);
      n.degree = n.neighbors.length;
    });

    // Compute Giant Component Size using BFS
    const visited = new Set<string>();
    let maxComponentSize = 0;

    graph.nodes.forEach((_, nodeId) => {
      if (!visited.has(nodeId)) {
        let componentSize = 0;
        const queue = [nodeId];
        visited.add(nodeId);

        while (queue.length > 0) {
          const current = queue.shift()!;
          componentSize++;
          const currNode = graph.nodes.get(current);

          if (currNode) {
            currNode.neighbors.forEach((nbr) => {
              if (!visited.has(nbr)) {
                visited.add(nbr);
                queue.push(nbr);
              }
            });
          }
        }
        if (componentSize > maxComponentSize) {
          maxComponentSize = componentSize;
        }
      }
    });

    const giantComponentFraction = maxComponentSize / (graph.nodes.size || 1);
    const criticalThresholdPc = 0.18;
    const isNetworkCollapsed = giantComponentFraction < 0.5;

    // Self-Healing Rewiring: Reconnect orphaned nodes to preserve percolation
    let rewiredEdgesCount = 0;
    if (isNetworkCollapsed) {
      const remainingNodes = Array.from(graph.nodes.values());
      for (let i = 0; i < remainingNodes.length - 1; i += 2) {
        const n1 = remainingNodes[i];
        const n2 = remainingNodes[i + 1];
        if (n1 && n2 && !n1.neighbors.includes(n2.id)) {
          n1.neighbors.push(n2.id);
          n2.neighbors.push(n1.id);
          n1.degree++;
          n2.degree++;
          rewiredEdgesCount++;
        }
      }
    }

    return {
      removedNodeId: targetHubId,
      giantComponentFraction,
      criticalThresholdPc,
      isNetworkCollapsed,
      rewiredEdgesCount,
    };
  }
}
