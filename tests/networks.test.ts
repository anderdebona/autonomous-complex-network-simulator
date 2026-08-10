import { describe, it, expect } from 'vitest';
import { ComplexNetworkGenerator } from '../src/networks/topology.js';
import { NetworkCentralityAnalyzer } from '../src/networks/centrality.js';
import { CommunityDetector } from '../src/networks/community-detection.js';
import { SIREpidemicSimulator } from '../src/networks/epidemic-spreading.js';

describe('Network Topology', () => {
  it('should generate Barabási-Albert scale-free network', () => {
    const graph = ComplexNetworkGenerator.generateBarabasiAlbert(20, 2);
    expect(graph.nodes.size).toBe(20);
  });
});

describe('Centrality Analysis', () => {
  it('should identify hub nodes', () => {
    const graph = ComplexNetworkGenerator.generateBarabasiAlbert(20, 2);
    const metrics = NetworkCentralityAnalyzer.analyzeGraph(graph);
    expect(metrics.length).toBe(20);
    expect(metrics.some((m) => m.isHub)).toBe(true);
  });
});

describe('Community Detection', () => {
  it('should detect communities in a graph', () => {
    const graph = ComplexNetworkGenerator.generateBarabasiAlbert(30, 2);
    const result = CommunityDetector.detect(graph);
    expect(result.communities.length).toBe(30);
    expect(result.numCommunities).toBeGreaterThanOrEqual(1);
  });

  it('should compute modularity score', () => {
    const graph = ComplexNetworkGenerator.generateBarabasiAlbert(20, 2);
    const result = CommunityDetector.detect(graph);
    expect(typeof result.modularity).toBe('number');
  });
});

describe('SIR Epidemic Spreading', () => {
  it('should simulate epidemic spreading from patient zero', () => {
    const graph = ComplexNetworkGenerator.generateBarabasiAlbert(30, 2);
    const simulator = new SIREpidemicSimulator(0.5, 0.2);
    const firstNode = Array.from(graph.nodes.keys())[0];
    const timeline = simulator.simulate(graph, firstNode, 20);
    expect(timeline.length).toBeGreaterThan(0);
    expect(timeline[0].infected).toBe(1);
    expect(timeline[0].susceptible).toBe(29);
  });

  it('should compute R0 reproduction number', () => {
    const sim = new SIREpidemicSimulator(0.3, 0.1);
    expect(sim.getR0()).toBeCloseTo(3.0, 5);
  });

  it('should eventually have zero infected (epidemic ends)', () => {
    const graph = ComplexNetworkGenerator.generateBarabasiAlbert(15, 2);
    const sim = new SIREpidemicSimulator(0.8, 0.5);
    const firstNode = Array.from(graph.nodes.keys())[0];
    const timeline = sim.simulate(graph, firstNode, 100);
    const lastStep = timeline[timeline.length - 1];
    expect(lastStep.infected).toBe(0);
  });
});
