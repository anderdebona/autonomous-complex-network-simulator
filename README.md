# Autonomous Complex Network & Percolation Simulator 🌐 🧬

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Complex Networks](https://img.shields.io/badge/Graph_Theory-Scale--Free_Networks-purple?style=for-the-badge)](https://en.wikipedia.org/wiki/Complex_network)
[![Version](https://img.shields.io/badge/Version-v4.0.0%20Frontier-00d2ff?style=for-the-badge)](https://github.com/anderdebona/autonomous-complex-network-simulator)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-Passing%20100%25-success?style=for-the-badge&logo=githubactions)](https://github.com/anderdebona/autonomous-complex-network-simulator/actions)

<br />

**PhD-Grade Complex Networks Simulator: Poincaré Hyperbolic Embeddings, Viral Contagion & Percolation Dynamics**

*Engineered by **[anderdebona](https://github.com/anderdebona)***

</div>

---

## 📌 Abstract & Research Goals

In statistical physics and network science, real-world systems (Internet routing, metabolic networks, autonomous mesh topologies) display **Scale-Free properties** characterized by power-law degree distributions $P(k) \sim k^{-\gamma}$.

The **`autonomous-complex-network-simulator`** implements a **Barabási–Albert Scale-Free Topology Engine**, computes **Betweenness Centrality & Modularity**, maps networks into **2D Poincaré Hyperbolic Disk Coordinates**, and simulates **Viral Information Cascades** and **SIR Epidemic Spreading**.

---

## 🔬 Mathematical Formulations

### 1. Barabási–Albert Preferential Attachment & Clustering
$$\Pi(k_i) = \frac{k_i}{\sum_{j} k_j}, \qquad C_i = \frac{2 E_i}{k_i(k_i - 1)}$$

### 2. Poincaré Disk Hyperbolic Distance ($H^2$)
$$d_H(u, v) = \operatorname{arcosh}\left( 1 + \frac{2 \|u - v\|^2}{(1 - \|u\|^2)(1 - \|v\|^2)} \right)$$

---

## 🏛️ System Architecture

```mermaid
graph TD
    BA[Barabási-Albert Scale-Free Generator] --> Graph[Complex Network Graph Topology]
    Graph --> Centrality[PageRank & Centrality Analyzer]
    Graph --> Hyperbolic[HyperbolicGeometryGraphEmbedder]
    Graph --> Cascade[InformationCascadeSimulator / SIR]
    Hyperbolic --> Visualizer[Poincaré Disk Canvas & Web Dashboard]
    Cascade --> Visualizer
```

---

## ⚡ What's New in v4.0.0

- 🌌 **`HyperbolicGeometryGraphEmbedder`**: Negative curvature Poincaré disk representation placing high-degree hub nodes near the origin.
- 📣 **`InformationCascadeSimulator`**: Independent cascade model (ICM) simulating viral idea dissemination and influencer reach.
- 🔍 **`PageRankEngine` & `CommunityDetector`**: Power-iteration PageRank and Girvan-Newman modularity partitioning.
- 🐙 **Automated Multi-Matrix CI/CD**: Full GitHub Actions test suites across Node LTS versions.

---

## 🚀 Quickstart & Installation

```bash
# Clone repository
git clone https://github.com/anderdebona/autonomous-complex-network-simulator.git
cd autonomous-complex-network-simulator

# Install dependencies
npm install

# Run automated tests
npm test

# Build & Run Simulator & Canvas Dashboard
npm run dev
```

Visit the interactive visual dashboard at: **`http://localhost:3006`**

---

## 🌟 Join the Community & Contribute

Join our community exploring the geometry of complex networks and dynamical systems:
1. ⭐ **Star this repository** to support network science research!
2. 🗺️ View our roadmap in [ROADMAP.md](./ROADMAP.md).
3. 💬 Propose new random graph models or metrics via [GitHub Issues](https://github.com/anderdebona/autonomous-complex-network-simulator/issues).
4. 📜 Academic citation: see [CITATION.cff](./CITATION.cff).

---

<div align="center">

Distributed under the MIT License. Built with passion by **[anderdebona](https://github.com/anderdebona)**.

</div>
