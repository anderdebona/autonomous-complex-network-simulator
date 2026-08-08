#!/usr/bin/env node
import { ComplexNetworkGenerator } from './networks/topology.js';
import { NetworkCentralityAnalyzer } from './networks/centrality.js';
import { PercolationCascadeEngine } from './networks/percolation.js';

console.log(`
===========================================================
  🌐 AUTONOMOUS COMPLEX NETWORK SIMULATOR CLI [v1.0.0]
  Author: anderdebona
===========================================================
`);

console.log('⚡ Generating Barabási-Albert Scale-Free Network P(k) ~ k^-3 (N=25, m=2)...');
const graph = ComplexNetworkGenerator.generateBarabasiAlbert(25, 2);
const metrics = NetworkCentralityAnalyzer.analyzeGraph(graph);

console.log('\n📊 Top Network Hubs identified by Betweenness Centrality:');
console.log(JSON.stringify(metrics.filter((m) => m.isHub), null, 2));

console.log('\n💥 Simulating Targeted Hub Attack & Cascade Failure...');
const cascadeRes = PercolationCascadeEngine.simulateCascadeFailure(graph, 'Node-0');
console.log(JSON.stringify(cascadeRes, null, 2));
