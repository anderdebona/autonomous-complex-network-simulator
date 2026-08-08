import { NetworkGraph } from './topology.js';

export interface NodeCentralityMetrics {
  nodeId: string;
  degree: number;
  clusteringCoefficient: number;
  betweennessCentralityScore: number;
  isHub: boolean;
}

export class NetworkCentralityAnalyzer {
  public static analyzeGraph(graph: NetworkGraph): NodeCentralityMetrics[] {
    const results: NodeCentralityMetrics[] = [];
    const maxDegree = Math.max(...Array.from(graph.nodes.values()).map((n) => n.degree));

    graph.nodes.forEach((node) => {
      const k = node.degree;
      let clusteringCoefficient = 0;

      if (k > 1) {
        let actualEdges = 0;
        const neighbors = node.neighbors;

        for (let i = 0; i < neighbors.length; i++) {
          for (let j = i + 1; j < neighbors.length; j++) {
            const n1 = graph.nodes.get(neighbors[i]);
            if (n1 && n1.neighbors.includes(neighbors[j])) {
              actualEdges++;
            }
          }
        }
        clusteringCoefficient = (2 * actualEdges) / (k * (k - 1));
      }

      // Normalized Betweenness proxy score
      const betweennessCentralityScore = (node.degree / maxDegree) * 0.95;
      const isHub = node.degree >= Math.floor(maxDegree * 0.6);

      results.push({
        nodeId: node.id,
        degree: node.degree,
        clusteringCoefficient,
        betweennessCentralityScore,
        isHub,
      });
    });

    return results;
  }
}
