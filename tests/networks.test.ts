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

import { PageRankEngine } from '../src/networks/pagerank.js';

describe('PageRank Engine', () => {
  it('should compute PageRank scores summing to ~1', () => {
    const graph = ComplexNetworkGenerator.generateBarabasiAlbert(15, 2);
    const ranks = PageRankEngine.compute(graph);
    const totalRank = ranks.reduce((s, r) => s + r.rank, 0);
    expect(totalRank).toBeCloseTo(1.0, 1);
    expect(ranks[0].rank).toBeGreaterThanOrEqual(ranks[ranks.length - 1].rank);
  });
  it('should rank hub nodes higher', () => {
    const graph = ComplexNetworkGenerator.generateBarabasiAlbert(20, 2);
    const ranks = PageRankEngine.compute(graph);
    expect(ranks[0].rank).toBeGreaterThan(ranks[ranks.length - 1].rank);
  });
});

describe('HyperbolicGeometryGraphEmbedder (v4.0.0)', () => {
  it('should embed network into Poincare disk and calculate hyperbolic distance', async () => {
    const { HyperbolicGeometryGraphEmbedder } = await import('../src/networks/hyperbolic-embedder.js');
    const mockGraph = {
      nodes: new Map([
        ['Hub', { id: 'Hub', neighbors: ['N1', 'N2', 'N3'] }],
        ['N1', { id: 'N1', neighbors: ['Hub'] }],
        ['N2', { id: 'N2', neighbors: ['Hub'] }],
        ['N3', { id: 'N3', neighbors: ['Hub'] }],
      ]),
    };

    const coords = HyperbolicGeometryGraphEmbedder.embed(mockGraph);
    expect(coords.length).toBe(4);
    const hubCoord = coords.find(c => c.id === 'Hub')!;
    const leafCoord = coords.find(c => c.id === 'N1')!;
    expect(hubCoord.radius).toBeLessThan(leafCoord.radius);

    const dist = HyperbolicGeometryGraphEmbedder.hyperbolicDistance(hubCoord, leafCoord);
    expect(dist).toBeGreaterThan(0);
  });
});

describe('InformationCascadeSimulator (v4.0.0)', () => {
  it('should simulate viral spread across neighbors in independent cascade model', async () => {
    const { InformationCascadeSimulator } = await import('../src/networks/cascade-simulator.js');
    const mockGraph = {
      nodes: new Map([
        ['Seed', { id: 'Seed', neighbors: ['A', 'B'] }],
        ['A', { id: 'A', neighbors: ['Seed', 'C'] }],
        ['B', { id: 'B', neighbors: ['Seed'] }],
        ['C', { id: 'C', neighbors: ['A'] }],
      ]),
    };

    const sim = new InformationCascadeSimulator(1.0); // 100% propagation for deterministic test
    const steps = sim.simulateCascade(mockGraph, ['Seed'], 5);
    expect(steps.length).toBeGreaterThan(1);
    expect(steps[steps.length - 1].totalActivatedCount).toBe(4);
  });
});

describe('LouvainHierarchicalEngine (v5.0.0)', () => {
  it('should partition a 2-clique network into two distinct modular communities', async () => {
    const { LouvainHierarchicalEngine } = await import('../src/networks/louvain-hierarchical.js');
    // Community 1: A, B, C (densely connected)
    // Community 2: X, Y, Z (densely connected)
    // Bridge: C - X
    const nodes = ['A', 'B', 'C', 'X', 'Y', 'Z'];
    const edges = [
      { source: 'A', target: 'B' }, { source: 'B', target: 'C' }, { source: 'C', target: 'A' },
      { source: 'X', target: 'Y' }, { source: 'Y', target: 'Z' }, { source: 'Z', target: 'X' },
      { source: 'C', target: 'X' }
    ];

    const res = LouvainHierarchicalEngine.detectCommunities(nodes, edges);
    expect(res.modularity).toBeGreaterThan(0.2);
    expect(res.communityCount).toBe(2);
    expect(res.communities.get('A')).toBe(res.communities.get('B'));
    expect(res.communities.get('X')).toBe(res.communities.get('Y'));
    expect(res.communities.get('A')).not.toBe(res.communities.get('X'));
  });
});

describe('PercolationPhaseTransitionEngine (v5.0.0)', () => {
  it('should compute Molloy-Reed critical threshold and phase transition curve', async () => {
    const { PercolationPhaseTransitionEngine } = await import('../src/networks/percolation-phase-transition.js');
    const nodes = ['N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7', 'N8'];
    const edges = [
      { source: 'N1', target: 'N2' }, { source: 'N2', target: 'N3' },
      { source: 'N3', target: 'N4' }, { source: 'N4', target: 'N1' },
      { source: 'N5', target: 'N6' }, { source: 'N6', target: 'N7' },
      { source: 'N7', target: 'N8' }, { source: 'N8', target: 'N5' },
      { source: 'N1', target: 'N5' }, { source: 'N2', target: 'N6' },
    ];

    const analysis = PercolationPhaseTransitionEngine.analyzePhaseTransition(nodes, edges, 10);
    expect(analysis.molloyReedThreshold).toBeGreaterThan(0);
    expect(analysis.molloyReedThreshold).toBeLessThanOrEqual(1);
    expect(analysis.curve.length).toBe(10);
    expect(analysis.degreeFirstMoment).toBeGreaterThan(0);
  });
});


