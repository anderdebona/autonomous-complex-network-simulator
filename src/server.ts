import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { ComplexNetworkGenerator } from './networks/topology.js';
import { NetworkCentralityAnalyzer } from './networks/centrality.js';
import { PercolationCascadeEngine } from './networks/percolation.js';
import { HyperbolicGeometryGraphEmbedder } from './networks/hyperbolic-embedder.js';
import { InformationCascadeSimulator } from './networks/cascade-simulator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3006;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

let activeNetwork = ComplexNetworkGenerator.generateBarabasiAlbert(25, 2);

app.post('/api/network/generate', (req, res) => {
  const { n = 25, m = 2 } = req.body;
  activeNetwork = ComplexNetworkGenerator.generateBarabasiAlbert(n, m);
  const metrics = NetworkCentralityAnalyzer.analyzeGraph(activeNetwork);
  const hyperbolicCoords = HyperbolicGeometryGraphEmbedder.embed(activeNetwork);

  const nodes = Array.from(activeNetwork.nodes.values());
  res.json({
    type: activeNetwork.type,
    nodeCount: nodes.length,
    nodes,
    metrics,
    hyperbolicCoords,
  });
});

app.post('/api/network/cascade', (req, res) => {
  const { targetHubId = 'Node-0' } = req.body;
  const result = PercolationCascadeEngine.simulateCascadeFailure(activeNetwork, targetHubId);
  res.json(result);
});

app.post('/api/network/viral-cascade', (req, res) => {
  const { seedNodes = ['Node-0'], propProb = 0.4 } = req.body;
  const simulator = new InformationCascadeSimulator(propProb);
  const cascadeSteps = simulator.simulateCascade(activeNetwork, seedNodes, 15);
  res.json({ cascadeSteps });
});

app.listen(PORT, () => {
  console.log(`🚀 Complex Network & Percolation Simulator Turbocharged on http://localhost:${PORT}`);
});
