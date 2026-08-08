# Autonomous Complex Network & Percolation Simulator 🌐 🧬

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Complex Networks](https://img.shields.io/badge/Graph_Theory-Scale--Free_Networks-purple)](https://en.wikipedia.org/wiki/Complex_network)

**Author:** anderdebona

---

## 📌 Abstract & Research Goals

In statistical physics and network science, real-world systems (Internet routing, metabolic networks, autonomous mesh topologies) display **Scale-Free properties** characterized by power-law degree distributions $P(k) \sim k^{-\gamma}$.

The **`autonomous-complex-network-simulator`** implements a **Barabási–Albert Scale-Free Topology Engine**, computes **Betweenness Centrality & Clustering Coefficients**, models **Cascade Failure Percolation Thresholds ($p_c$)**, and performs **Self-Healing Edge Rewiring** in real-time.

---

## 🔬 Mathematical Formulations

### 1. Barabási–Albert Preferential Attachment
Probability $\Pi(k_i)$ of attaching a new edge to node $i$ with degree $k_i$:

$$\Pi(k_i) = \frac{k_i}{\sum_{j} k_j}$$

### 2. Clustering Coefficient ($C_i$)
For a node $i$ with degree $k_i$ and $E_i$ edges between its neighbors:

$$C_i = \frac{2 E_i}{k_i(k_i - 1)}$$

---

## 🏛️ System Architecture

```mermaid
graph TD
    BA[Barabási-Albert Engine P(k) ~ k^-3] --> Graph[Complex Network Graph]
    Graph --> Centrality[Betweenness Centrality & Clustering Analyzer]
    Graph --> Cascade[Percolation & Cascade Failure Simulator]
    Cascade -->|p_c Threshold Collapse| SelfHealing[Autonomous Topological Rewiring]
    Graph --> Canvas[Interactive 3D/Canvas Visualizer]
```

---

## 🚀 Quickstart & Installation

```bash
# Clone repository
git clone https://github.com/anderdebona/autonomous-complex-network-simulator.git
cd autonomous-complex-network-simulator

# Install dependencies
npm install

# Build & Run Simulator & Canvas Dashboard
npm run dev
```

Visit the interactive visual dashboard at: **`http://localhost:3006`**

---

## 🧪 Automated Unit Testing

```bash
npm test
```

---

## 📜 Citation & License

```bibtex
@software{anderdebona2026networks,
  author = {anderdebona},
  title = {Autonomous Complex Network \& Percolation Simulator},
  year = {2026},
  publisher = {GitHub},
  journal = {GitHub Repository},
  howpublished = {\url{https://github.com/anderdebona/autonomous-complex-network-simulator}}
}
```

Licensed under the MIT License.
