import { NetworkGraph } from './topology.js';

/**
 * SIR compartment states
 */
export type SIRState = 'S' | 'I' | 'R';

export interface SIRTimeStep {
  step: number;
  susceptible: number;
  infected: number;
  recovered: number;
}

/**
 * SIR Epidemic Spreading Model on Complex Networks.
 *
 * Reference: Pastor-Satorras & Vespignani, "Epidemic Spreading in Scale-Free Networks" (PRL, 2001)
 */
export class SIREpidemicSimulator {
  private beta: number;
  private gamma: number;

  constructor(beta: number = 0.3, gamma: number = 0.1) {
    this.beta = beta;
    this.gamma = gamma;
  }

  public simulate(graph: NetworkGraph, patientZero: string, maxSteps: number = 50): SIRTimeStep[] {
    const states = new Map<string, SIRState>();
    for (const nodeId of graph.nodes.keys()) {
      states.set(nodeId, 'S');
    }
    states.set(patientZero, 'I');

    const timeline: SIRTimeStep[] = [];

    for (let step = 0; step < maxSteps; step++) {
      const counts = { S: 0, I: 0, R: 0 };
      states.forEach((s) => counts[s]++);
      timeline.push({ step, susceptible: counts.S, infected: counts.I, recovered: counts.R });

      if (counts.I === 0) break;

      const nextStates = new Map(states);
      for (const [nodeId, state] of states) {
        if (state === 'I') {
          const node = graph.nodes.get(nodeId)!;
          for (const neighbor of node.neighbors) {
            if (states.get(neighbor) === 'S' && Math.random() < this.beta) {
              nextStates.set(neighbor, 'I');
            }
          }
          if (Math.random() < this.gamma) {
            nextStates.set(nodeId, 'R');
          }
        }
      }

      for (const [k, v] of nextStates) states.set(k, v);
    }

    return timeline;
  }

  public getR0(): number {
    return this.beta / this.gamma;
  }
}
