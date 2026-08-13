import { NetworkGraphInput } from './hyperbolic-embedder.js';

export interface CascadeStep {
  step: number;
  newlyActivated: string[];
  totalActivatedCount: number;
  activeRatio: number;
}

export class InformationCascadeSimulator {
  private propagationProb: number;

  constructor(propagationProb: number = 0.3) {
    this.propagationProb = propagationProb;
  }

  /**
   * Simulates viral idea diffusion using the Independent Cascade Model (ICM)
   */
  public simulateCascade(
    graph: NetworkGraphInput,
    seedNodeIds: string[],
    maxSteps: number = 20
  ): CascadeStep[] {
    const totalNodes = graph.nodes.size;
    const activated = new Set<string>(seedNodeIds);
    let frontier = new Set<string>(seedNodeIds);

    const history: CascadeStep[] = [
      {
        step: 0,
        newlyActivated: [...seedNodeIds],
        totalActivatedCount: activated.size,
        activeRatio: totalNodes > 0 ? activated.size / totalNodes : 0,
      },
    ];

    for (let step = 1; step <= maxSteps; step++) {
      if (frontier.size === 0) break;

      const nextFrontier = new Set<string>();

      for (const activeId of frontier) {
        const node = graph.nodes.get(activeId);
        if (!node) continue;

        for (const neighborId of node.neighbors) {
          if (!activated.has(neighborId)) {
            if (Math.random() < this.propagationProb) {
              activated.add(neighborId);
              nextFrontier.add(neighborId);
            }
          }
        }
      }

      frontier = nextFrontier;

      history.push({
        step,
        newlyActivated: Array.from(nextFrontier),
        totalActivatedCount: activated.size,
        activeRatio: totalNodes > 0 ? parseFloat((activated.size / totalNodes).toFixed(4)) : 0,
      });
    }

    return history;
  }
}
