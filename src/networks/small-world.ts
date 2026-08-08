import { NetworkGraph, NetworkNode } from './topology.js';

export class WattsStrogatzSmallWorldGenerator {
  public static generateSmallWorld(n: number, k: number = 4, beta: number = 0.1): NetworkGraph {
    const nodes = new Map<string, NetworkNode>();

    for (let i = 0; i < n; i++) {
      const id = `Node-${i}`;
      nodes.set(id, { id, degree: 0, neighbors: [] });
    }

    // Connect each node to k/2 neighbors on each side (ring lattice)
    const halfK = Math.floor(k / 2);
    for (let i = 0; i < n; i++) {
      const curr = nodes.get(`Node-${i}`)!;
      for (let j = 1; j <= halfK; j++) {
        const nbrIdx = (i + j) % n;
        const nbrId = `Node-${nbrIdx}`;
        curr.neighbors.push(nbrId);
        curr.degree++;
      }
    }

    return {
      nodes,
      type: 'SMALL_WORLD_WATTS_STROGATZ',
    };
  }
}
