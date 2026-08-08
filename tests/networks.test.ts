import { describe, it, expect } from 'vitest';
import { ComplexNetworkGenerator } from '../src/networks/topology.js';
import { NetworkCentralityAnalyzer } from '../src/networks/centrality.js';
import { PercolationCascadeEngine } from '../src/networks/percolation.js';

describe('Autonomous Complex Network Engine Tests', () => {
  it('should generate Barabási-Albert Scale-Free network with preferential attachment', () => {
    const graph = ComplexNetworkGenerator.generateBarabasiAlbert(20, 2);
    expect(graph.nodes.size).toBe(20);

    const metrics = NetworkCentralityAnalyzer.analyzeGraph(graph);
    const hubs = metrics.filter((m) => m.isHub);
    expect(hubs.length).toBeGreaterThan(0); // Hubs exist in scale-free topology
  });

  it('should simulate cascade failure and re-wire orphaned nodes upon percolation collapse', () => {
    const graph = ComplexNetworkGenerator.generateBarabasiAlbert(15, 2);
    const result = PercolationCascadeEngine.simulateCascadeFailure(graph, 'Node-0');

    expect(result.removedNodeId).toBe('Node-0');
    expect(result.giantComponentFraction).toBeGreaterThan(0);
  });
});
