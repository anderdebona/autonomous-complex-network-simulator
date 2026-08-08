export interface NetworkNode {
  id: string;
  degree: number;
  neighbors: string[];
}

export interface NetworkGraph {
  nodes: Map<string, NetworkNode>;
  type: 'SCALE_FREE_BARABASI_ALBERT' | 'SMALL_WORLD_WATTS_STROGATZ';
}

export class ComplexNetworkGenerator {
  /**
   * Generates Barabási–Albert Scale-Free Network using Preferential Attachment
   * P(k) ~ k^(-3)
   */
  public static generateBarabasiAlbert(n: number, m: number = 2): NetworkGraph {
    const nodes = new Map<string, NetworkNode>();

    // Initial seed clique of m0 nodes
    const m0 = m + 1;
    for (let i = 0; i < m0; i++) {
      const id = `Node-${i}`;
      nodes.set(id, { id, degree: 0, neighbors: [] });
    }

    // Fully connect initial seed
    for (let i = 0; i < m0; i++) {
      for (let j = i + 1; j < m0; j++) {
        const n1 = nodes.get(`Node-${i}`)!;
        const n2 = nodes.get(`Node-${j}`)!;
        n1.neighbors.push(n2.id);
        n2.neighbors.push(n1.id);
        n1.degree++;
        n2.degree++;
      }
    }

    // Add remaining (n - m0) nodes with preferential attachment
    for (let i = m0; i < n; i++) {
      const newNodeId = `Node-${i}`;
      const newNode: NetworkNode = { id: newNodeId, degree: 0, neighbors: [] };
      nodes.set(newNodeId, newNode);

      // Preferential attachment selection based on existing node degree
      const existingNodeIds = Array.from(nodes.keys()).filter((id) => id !== newNodeId);
      const totalDegreeSum = existingNodeIds.reduce(
        (sum, id) => sum + nodes.get(id)!.degree,
        0
      );

      const selectedTargets = new Set<string>();
      while (selectedTargets.size < m && selectedTargets.size < existingNodeIds.length) {
        let rand = Math.random() * totalDegreeSum;
        let cumulative = 0;

        for (const targetId of existingNodeIds) {
          cumulative += nodes.get(targetId)!.degree;
          if (rand <= cumulative) {
            selectedTargets.add(targetId);
            break;
          }
        }
      }

      selectedTargets.forEach((targetId) => {
        const targetNode = nodes.get(targetId)!;
        newNode.neighbors.push(targetId);
        targetNode.neighbors.push(newNodeId);
        newNode.degree++;
        targetNode.degree++;
      });
    }

    return {
      nodes,
      type: 'SCALE_FREE_BARABASI_ALBERT',
    };
  }
}
