# Autonomous Complex Networks & Percolation Simulator 🌐 🧬

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Version](https://img.shields.io/badge/Version-v5.0.0%20Ultra-00d2ff?style=for-the-badge)](https://github.com/anderdebona/autonomous-complex-network-simulator)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-Passing%20100%25-success?style=for-the-badge&logo=githubactions)](https://github.com/anderdebona/autonomous-complex-network-simulator/actions)

<br />

**PhD-Grade Complex Networks & Percolation Simulator: Louvain Hierarchical Modularity, Molloy-Reed Phase Transition, Poincaré Disk $\mathbb{H}^2$ Embeddings & Independent Cascade Models**

*Engineered with precision by **[anderdebona](https://github.com/anderdebona)***

</div>

---

## 📌 Academic Purpose & Overview

This project provides a **PhD-level network science and topological resilience simulation engine**. It models scale-free topologies ($P(k) \sim k^{-\gamma}$), Watts-Strogatz small-world clustering, multi-level **Louvain Modularity Maximization**, exact **Molloy-Reed critical percolation phase transitions** ($p_c$), Poincaré disk hyperbolic embeddings ($\mathbb{H}^2$), and targeted attack cascading failures.

---

## 🔬 Mathematical Formulations

### 1. Louvain Modularity Optimization ($Q$)
$$Q = \frac{1}{2m} \sum_{ij} \left[ A_{ij} - \gamma \frac{k_i k_j}{2m} \right] \delta(c_i, c_j)$$
Modularity gain upon moving node $i$ into community $C$:
$$\Delta Q = \left[ \frac{\sum_{in} + 2k_{i,in}}{2m} - \left( \frac{\sum_{tot} + k_i}{2m} \right)^2 \right] - \left[ \frac{\sum_{in}}{2m} - \left( \frac{\sum_{tot}}{2m} \right)^2 - \left( \frac{k_i}{2m} \right)^2 \right]$$

### 2. Molloy-Reed Critical Percolation Threshold ($p_c$)
$$p_c = \frac{\langle k \rangle}{\langle k^2 \rangle - \langle k \rangle}$$
$$\text{Susceptibility } \chi(p) = \frac{1}{N} \sum_{s < \infty} s^2 n_s(p)$$

---

## ⚡ What's New in v5.0.0

- 🧩 **`LouvainHierarchicalEngine`**: Greedy multi-phase modularity optimization with community aggregation and size distributions.
- 🔥 **`PercolationPhaseTransitionEngine`**: Numerical Giant Connected Component $S(p)$ and susceptibility $\chi(p)$ phase transition curves.
- 🌌 **Interactive Studio v5.0.0**: Real-time Poincaré hyperbolic disk visualizer with dynamic community colorings and live phase transition canvas.
- 📊 **Comprehensive Tests**: 13/13 Vitest unit tests passing 100%.

---

## 🚀 Quickstart & Interactive Studio

```bash
git clone https://github.com/anderdebona/autonomous-complex-network-simulator.git
cd autonomous-complex-network-simulator
npm install
npm test
npm run build
npm start
# Open http://localhost:3006
```

---

## 📄 License & Citation
MIT License © 2026 anderdebona. See [CITATION.cff](CITATION.cff) for academic attribution.
