export interface PercolationCurvePoint {
  p: number; // occupation probability
  giantComponentFraction: number; // S(p)
  susceptibility: number; // chi(p)
  averageClusterSize: number;
}

export interface PhaseTransitionAnalysis {
  molloyReedThreshold: number; // theoretical p_c
  empiricalCriticalPoint: number; // argmax(chi)
  isResilient: boolean;
  curve: PercolationCurvePoint[];
  degreeFirstMoment: number;
  degreeSecondMoment: number;
}

export class PercolationPhaseTransitionEngine {
  /**
   * Computes the complete percolation phase transition curve and Molloy-Reed critical threshold
   */
  public static analyzePhaseTransition(
    nodes: string[],
    edges: Array<{ source: string; target: string }>,
    steps: number = 20
  ): PhaseTransitionAnalysis {
    const N = nodes.length;
    if (N === 0) {
      return {
        molloyReedThreshold: 1,
        empiricalCriticalPoint: 1,
        isResilient: false,
        curve: [],
        degreeFirstMoment: 0,
        degreeSecondMoment: 0
      };
    }

    const degrees = new Map<string, number>();
    nodes.forEach(n => degrees.set(n, 0));
    edges.forEach(e => {
      degrees.set(e.source, (degrees.get(e.source) || 0) + 1);
      degrees.set(e.target, (degrees.get(e.target) || 0) + 1);
    });

    let sumK = 0;
    let sumK2 = 0;
    degrees.forEach(k => {
      sumK += k;
      sumK2 += k * k;
    });

    const k1 = sumK / N; // <k>
    const k2 = sumK2 / N; // <k^2>

    // Molloy-Reed criterion: kappa = <k^2>/<k> > 2 for GCC to exist.
    // Critical threshold p_c = <k> / (<k^2> - <k>)
    const denom = k2 - k1;
    const molloyReedThreshold = denom > 0 ? Math.min(1, Math.max(0, k1 / denom)) : 1;

    const curve: PercolationCurvePoint[] = [];
    let maxSusceptibility = -1;
    let empiricalCriticalPoint = molloyReedThreshold;

    for (let s = 1; s <= steps; s++) {
      const p = s / steps;
      const point = this.simulatePercolationPoint(nodes, edges, p);
      curve.push(point);

      if (point.susceptibility > maxSusceptibility) {
        maxSusceptibility = point.susceptibility;
        empiricalCriticalPoint = p;
      }
    }

    return {
      molloyReedThreshold: Math.round(molloyReedThreshold * 1000) / 1000,
      empiricalCriticalPoint: Math.round(empiricalCriticalPoint * 1000) / 1000,
      isResilient: molloyReedThreshold < 0.5,
      curve,
      degreeFirstMoment: Math.round(k1 * 100) / 100,
      degreeSecondMoment: Math.round(k2 * 100) / 100
    };
  }

  private static simulatePercolationPoint(
    nodes: string[],
    edges: Array<{ source: string; target: string }>,
    p: number
  ): PercolationCurvePoint {
    const N = nodes.length;
    // Retain each edge with probability p
    const retainedEdges = edges.filter(() => Math.random() < p);

    // BFS to find connected components
    const adj = new Map<string, string[]>();
    nodes.forEach(n => adj.set(n, []));
    retainedEdges.forEach(e => {
      adj.get(e.source)?.push(e.target);
      adj.get(e.target)?.push(e.source);
    });

    const visited = new Set<string>();
    const componentSizes: number[] = [];

    for (const node of nodes) {
      if (!visited.has(node)) {
        let size = 0;
        const queue = [node];
        visited.add(node);

        while (queue.length > 0) {
          const curr = queue.shift()!;
          size++;
          const neighbors = adj.get(curr) || [];
          for (const nb of neighbors) {
            if (!visited.has(nb)) {
              visited.add(nb);
              queue.push(nb);
            }
          }
        }
        componentSizes.push(size);
      }
    }

    componentSizes.sort((a, b) => b - a);
    const giantSize = componentSizes[0] || 0;
    const finiteSizes = componentSizes.slice(1);

    // Susceptibility chi = sum(s^2 * n_s) / N for finite clusters
    let finiteSumS2 = 0;
    let finiteSumS = 0;
    finiteSizes.forEach(s => {
      finiteSumS2 += s * s;
      finiteSumS += s;
    });

    const susceptibility = finiteSizes.length > 0 ? finiteSumS2 / N : 0;
    const avgClusterSize = finiteSizes.length > 0 ? finiteSumS / finiteSizes.length : 0;

    return {
      p: Math.round(p * 100) / 100,
      giantComponentFraction: Math.round((giantSize / N) * 1000) / 1000,
      susceptibility: Math.round(susceptibility * 1000) / 1000,
      averageClusterSize: Math.round(avgClusterSize * 100) / 100
    };
  }
}
