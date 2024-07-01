import { cache } from 'decorator-cache-getter';
import { corrupt } from 'exhaustive';

import { ALL_DIRS, Dir } from './shared';
import { type Chooser } from './chooser';

/** The coordinates of a node (indices into a 2D array). */
export type Coordinates = [number, number];

/** A node in a maze graph. */
export class Node {
  /** Neighbors to this node that share an edge with it. */
  neighbors: Node[] = [];

  constructor(
    readonly i: number,
    readonly j: number,
    readonly size: number,
    private readonly chooser: Chooser,
  ) {}

  /** Returns the node key for the provided node coordinates. */
  static getKey(coords: Coordinates): string;
  static getKey(i: number, j: number): string;
  static getKey(i: number | Coordinates, j?: number): string {
    let ci: number;
    let cj: number;
    if (typeof i === 'number' && typeof j === 'number') {
      ci = i;
      cj = j;
    } else if (i instanceof Array) {
      ci = i[0];
      cj = i[1];
    } else {
      throw new Error(`invalid arguments: ${i} ${j}`);
    }
    return `${ci}~${cj}`;
  }

  /** Returns the node key of this node. */
  get key(): string {
    return Node.getKey(this.i, this.j);
  }

  /**
   * Returns true if the provided object is either (a) another node with the same coordinators, or
   * (b) a 2-element array representing the coordinates of this node.
   */
  equals(o: any): boolean {
    if (o instanceof Node) {
      return this.i === o.i && this.j === o.j;
    } else if (o instanceof Array) {
      return o.length === 2 && this.i === o[0] && this.j === o[1];
    }
    return false;
  }

  /**
   * Returns the coordinates of the neighbor to this node in the provided direction. Note that
   * this method does not check that the returned coordinates are valid (i.e. it may return an out-
   * of-bounds coordinate).
   */
  getNeighborCoordinates(dir: Dir): Coordinates {
    switch (dir) {
      case Dir.U:
        return [this.i - 1, this.j];
      case Dir.R:
        return [this.i, this.j + 1];
      case Dir.D:
        return [this.i + 1, this.j];
      case Dir.L:
        return [this.i, this.j - 1];
      default:
        corrupt(dir);
    }
  }

  /**
   * Creates a neighbor node by choosing from among the possible (valid) neighbors that do not
   * exist in the provided map. If no such neighbors exist, returns undefined.
   */
  chooseNeighbor(nodes: Map<string, Node>): Node | undefined {
    const possibleNeighbors: Coordinates[] = [];
    for (const dir of ALL_DIRS) {
      const coords = this.getNeighborCoordinates(dir);
      if (validCoords(coords, this.size) && !nodes.has(Node.getKey(coords))) {
        possibleNeighbors.push(coords);
      }
    }
    if (possibleNeighbors.length === 0) {
      return undefined;
    }
    return new Node(
      ...this.chooser.choose(possibleNeighbors),
      this.size,
      this.chooser,
    );
  }

  /**
   * Returns whether the provided coordinates correspond to a neighbor sharing an edge with this
   * node.
   */
  private hasNeighbor(coords: Coordinates): boolean {
    const coordsKey = Node.getKey(coords);
    return this.neighbors.some((n) => n.key === coordsKey);
  }

  /**
   * A tuple indicating whether a wall exists between this node and its neighbor in the
   * corresponding direction. The ordering of the tuple reflects the ordering of {@link ALL_DIRS}.
   */
  @cache
  get walls(): readonly boolean[] {
    const walls = [];
    for (const dir of ALL_DIRS) {
      const neighbor = this.getNeighborCoordinates(dir);
      walls.push(!this.hasNeighbor(neighbor));
    }
    if (this.i === 0) walls[Dir.U] = true;
    if (this.i === this.size - 1) walls[Dir.D] = true;
    if (this.j === 0) walls[Dir.L] = true;
    if (this.j === this.size - 1) walls[Dir.R] = true;
    return walls;
  }
}

/** Returns whether the provided coordinates are valid in a grid of the specified size. */
function validCoords([i, j]: Coordinates, size: number): boolean {
  return i >= 0 && i < size && j >= 0 && j < size;
}
