import { NetworkGraph } from './topology.js';
export interface PageRankResult { nodeId: string; rank: number; }
export class PageRankEngine {
  public static compute(graph: NetworkGraph, dampingFactor: number = 0.85, iterations: number = 20): PageRankResult[] {
    const nodes = Array.from(graph.nodes.keys());
    const N = nodes.length;
    const ranks = new Map<string, number>();
    nodes.forEach(n => ranks.set(n, 1 / N));
    for (let iter = 0; iter < iterations; iter++) {
      const newRanks = new Map<string, number>();
      for (const nodeId of nodes) {
        let incomingRank = 0;
        for (const [otherId, otherNode] of graph.nodes) {
          if (otherNode.neighbors.includes(nodeId)) incomingRank += (ranks.get(otherId) || 0) / otherNode.degree;
        }
        newRanks.set(nodeId, (1 - dampingFactor) / N + dampingFactor * incomingRank);
      }
      for (const [k, v] of newRanks) ranks.set(k, v);
    }
    return nodes.map(n => ({ nodeId: n, rank: ranks.get(n) || 0 })).sort((a, b) => b.rank - a.rank);
  }
}
