export interface PoincareNodeCoordinate {
  id: string;
  radius: number; // r in [0, 1) representing node popularity / degree hierarchy
  angle: number;  // theta in [0, 2pi) representing node similarity
  x: number;      // r * cos(theta)
  y: number;      // r * sin(theta)
}

export interface NetworkGraphInput {
  nodes: Map<string, { id: string; neighbors: string[] }>;
}

export class HyperbolicGeometryGraphEmbedder {
  /**
   * Embeds network nodes into the 2D Poincaré Disk model of hyperbolic space H^2
   * Distance: d_H(u, v) = arcosh(1 + 2 * ||u - v||^2 / ((1 - ||u||^2) * (1 - ||v||^2)))
   */
  public static embed(graph: NetworkGraphInput): PoincareNodeCoordinate[] {
    const nodes = Array.from(graph.nodes.values());
    const n = nodes.length;
    if (n === 0) return [];

    const maxDegree = Math.max(...nodes.map(node => node.neighbors.length), 1);

    const coordinates: PoincareNodeCoordinate[] = [];

    for (let i = 0; i < n; i++) {
      const node = nodes[i];
      const degree = node.neighbors.length;

      // Hubs with higher degree are placed closer to disk origin (lower radius)
      const radius = Math.min(0.95, Math.max(0.05, 1.0 - Math.log(degree + 1) / Math.log(maxDegree + 2)));
      const angle = (2 * Math.PI * i) / n;

      coordinates.push({
        id: node.id,
        radius: parseFloat(radius.toFixed(4)),
        angle: parseFloat(angle.toFixed(4)),
        x: parseFloat((radius * Math.cos(angle)).toFixed(4)),
        y: parseFloat((radius * Math.sin(angle)).toFixed(4)),
      });
    }

    return coordinates;
  }

  public static hyperbolicDistance(p1: PoincareNodeCoordinate, p2: PoincareNodeCoordinate): number {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const euclideanDistSq = dx * dx + dy * dy;

    const r1Sq = p1.x * p1.x + p1.y * p1.y;
    const r2Sq = p2.x * p2.x + p2.y * p2.y;

    const denom = (1 - r1Sq) * (1 - r2Sq);
    if (denom <= 0) return Infinity;

    const arg = 1 + (2 * euclideanDistSq) / denom;
    return parseFloat(Math.acosh(Math.max(1, arg)).toFixed(4));
  }
}
