export interface LouvainResult {
  modularity: number;
  communities: Map<string, number>;
  communityCount: number;
  levels: number;
  modularityHistory: number[];
  communitySizes: { [communityId: number]: number };
}

export class LouvainHierarchicalEngine {
  /**
   * Runs the Louvain modularity maximization algorithm
   */
  public static detectCommunities(
    nodes: string[],
    edges: Array<{ source: string; target: string; weight?: number }>,
    resolution: number = 1.0
  ): LouvainResult {
    const adj = new Map<string, Map<string, number>>();
    nodes.forEach(n => adj.set(n, new Map()));

    let totalWeight = 0;
    edges.forEach(e => {
      const w = e.weight || 1;
      adj.get(e.source)?.set(e.target, (adj.get(e.source)?.get(e.target) || 0) + w);
      adj.get(e.target)?.set(e.source, (adj.get(e.target)?.get(e.source) || 0) + w);
      totalWeight += w;
    });

    if (totalWeight === 0) {
      const trivial = new Map<string, number>();
      nodes.forEach((n, i) => trivial.set(n, i));
      return {
        modularity: 0,
        communities: trivial,
        communityCount: nodes.length,
        levels: 1,
        modularityHistory: [0],
        communitySizes: {}
      };
    }

    const nodeDegrees = new Map<string, number>();
    nodes.forEach(n => {
      let deg = 0;
      adj.get(n)?.forEach(w => (deg += w));
      nodeDegrees.set(n, deg);
    });

    // Initial partition: each node in its own community
    let communityOf = new Map<string, number>();
    nodes.forEach((n, i) => communityOf.set(n, i));

    const modularityHistory: number[] = [];
    let currentModularity = this.computeModularity(adj, communityOf, nodeDegrees, totalWeight, resolution);
    modularityHistory.push(currentModularity);

    let improved = true;
    let iterations = 0;
    const maxIterations = 20;

    while (improved && iterations < maxIterations) {
      improved = false;
      iterations++;

      for (const node of nodes) {
        const currentComm = communityOf.get(node)!;
        const neighbors = adj.get(node) || new Map();
        const neighborCommunities = new Set<number>();
        neighbors.forEach((_, neighbor) => neighborCommunities.add(communityOf.get(neighbor)!));
        neighborCommunities.add(currentComm);

        let bestComm = currentComm;
        let bestGain = 0;

        for (const candidateComm of neighborCommunities) {
          if (candidateComm === currentComm) continue;

          // Compute modularity gain Delta Q
          const gain = this.computeModularityGain(
            node,
            candidateComm,
            currentComm,
            adj,
            communityOf,
            nodeDegrees,
            totalWeight,
            resolution
          );

          if (gain > bestGain) {
            bestGain = gain;
            bestComm = candidateComm;
          }
        }

        if (bestGain > 1e-6 && bestComm !== currentComm) {
          communityOf.set(node, bestComm);
          improved = true;
        }
      }

      currentModularity = this.computeModularity(adj, communityOf, nodeDegrees, totalWeight, resolution);
      modularityHistory.push(currentModularity);
    }

    // Remap community IDs to 0, 1, 2...
    const uniqueComms = Array.from(new Set(communityOf.values()));
    const remapped = new Map<string, number>();
    const sizes: { [id: number]: number } = {};

    nodes.forEach(n => {
      const idx = uniqueComms.indexOf(communityOf.get(n)!);
      remapped.set(n, idx);
      sizes[idx] = (sizes[idx] || 0) + 1;
    });

    return {
      modularity: Math.round(currentModularity * 10000) / 10000,
      communities: remapped,
      communityCount: uniqueComms.length,
      levels: iterations,
      modularityHistory: modularityHistory.map(m => Math.round(m * 10000) / 10000),
      communitySizes: sizes
    };
  }

  private static computeModularity(
    adj: Map<string, Map<string, number>>,
    communities: Map<string, number>,
    degrees: Map<string, number>,
    totalWeight: number,
    resolution: number
  ): number {
    const m2 = 2 * totalWeight;
    let q = 0;

    adj.forEach((neighbors, u) => {
      const cu = communities.get(u)!;
      const du = degrees.get(u) || 0;

      neighbors.forEach((w, v) => {
        const cv = communities.get(v)!;
        const dv = degrees.get(v) || 0;

        if (cu === cv) {
          q += w - resolution * ((du * dv) / m2);
        }
      });
    });

    return q / m2;
  }

  private static computeModularityGain(
    node: string,
    targetComm: number,
    currentComm: number,
    adj: Map<string, Map<string, number>>,
    communities: Map<string, number>,
    degrees: Map<string, number>,
    totalWeight: number,
    resolution: number
  ): number {
    const m2 = 2 * totalWeight;
    const ki = degrees.get(node) || 0;

    let kiInTarget = 0;
    let kiInCurrent = 0;
    let sumTotTarget = 0;
    let sumTotCurrent = 0;

    communities.forEach((c, n) => {
      const deg = degrees.get(n) || 0;
      if (c === targetComm) sumTotTarget += deg;
      if (c === currentComm && n !== node) sumTotCurrent += deg;
    });

    adj.get(node)?.forEach((w, neighbor) => {
      const c = communities.get(neighbor);
      if (c === targetComm) kiInTarget += w;
      if (c === currentComm && neighbor !== node) kiInCurrent += w;
    });

    const gainTarget = (kiInTarget / m2) - resolution * ((sumTotTarget * ki) / (m2 * m2));
    const lossCurrent = (kiInCurrent / m2) - resolution * ((sumTotCurrent * ki) / (m2 * m2));

    return gainTarget - lossCurrent;
  }
}
