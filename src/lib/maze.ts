import { cache } from 'decorator-cache-getter';

import { Chooser } from './chooser';
import { Node } from './node';
import { ALL_DIRS, Coordinates, Dir } from './shared';
import { corrupt } from 'exhaustive';

/** A maze, represented as a undirected tree of {@link Node}s. */
export class Maze {
  /** The nodes in the tree, mapped to by {@link Node.key}. */
  readonly nodes = new Map<string, Node>();

  /** The starting node of the maze. */
  start!: Node;

  /** The ending node of the maze. */
  end!: Node;

  /**
   * The cached representation of the maze as a 2D array of nodes, if it has been calculated yet.
   */
  private nodeArray?: ReadonlyArray<readonly Node[]>;

  constructor(
    readonly size: number,
    private readonly chooser: Chooser,
  ) {
    this.init();
  }

  /** Create a maze from the provided nodes. Should only be used for testing. */
  static fromNodes(nodes: Node[], size: number, start: Node, end: Node): Maze {
    if (nodes.length !== size * size) {
      throw new Error(
        `wrong number of nodes: want ${size * size}, got ${nodes.length}`,
      );
    }
    if (!nodes.includes(start)) {
      throw new Error('start node not in provided nodes array');
    }
    if (!nodes.includes(end)) {
      throw new Error('end node not in provided nodes array');
    }
    const maze = new Maze(size, new Chooser(0));
    maze.nodes.clear();
    nodes.forEach((n) => maze.nodes.set(n.key, n));
    maze.nodeArray = undefined;
    maze.start = start;
    maze.end = end;
    return maze;
  }

  /** The possible coordinates of nodes in this maze, based on its size. */
  @cache
  private get indices(): readonly number[] {
    return new Array(this.size).fill(0).map((_, i) => i);
  }

  /**
   * Initializes the maze by randomly choosing a starting node, creating it, and then performing
   * depth-first search to fill in the node tree until all nodes have been added. Also chooses the
   * starting and ending nodes of the maze.
   */
  private init(): void {
    let node = new Node(
      this.chooser.choose(this.indices),
      this.chooser.choose(this.indices),
      this.size,
      this.chooser,
    );
    this.nodes.set(node.key, node);

    let path: Node[] = [];
    while (this.nodes.size < this.size * this.size) {
      const neighbor = node.chooseNeighbor(this.nodes);
      if (!neighbor) {
        node = path.at(-1)!;
        path = path.slice(0, -1);
      } else {
        path.push(node);
        node.neighbors.push(neighbor);
        neighbor.neighbors.push(node);
        this.nodes.set(neighbor.key, neighbor);
        node = neighbor;
      }
    }

    [this.start, this.end] = this.chooseEndpoints();
  }

  /** Chooses a starting and ending node at random. */
  private chooseEndpoints(): [Node, Node] {
    const start = this.chooseSingleEndpoint();
    let end = this.chooseSingleEndpoint();
    while (start.equals(end)) {
      end = this.chooseSingleEndpoint();
    }
    return [start, end];
  }

  /** Chooses a single node on the edge of the maze at random. */
  private chooseSingleEndpoint(): Node {
    const edge = this.chooser.choose(ALL_DIRS);
    const other = this.chooser.choose(this.indices);
    let coords: Coordinates;
    switch (edge) {
      case Dir.U:
        coords = [0, other];
        break;
      case Dir.R:
        coords = [other, this.size - 1];
        break;
      case Dir.D:
        coords = [this.size - 1, other];
        break;
      case Dir.L:
        coords = [other, 0];
        break;
      default:
        corrupt(edge);
    }
    return this.getNode(coords);
  }

  /** Returns the node with the specified coordinates. */
  getNode(coords: Coordinates): Node {
    return this.nodes.get(Node.getKey(coords))!;
  }

  /** Returns a the maze as a 2D array of nodes. */
  toArray(): ReadonlyArray<readonly Node[]> {
    if (this.nodeArray) return this.nodeArray;

    const arr: Node[][] = [];
    for (let i = 0; i < this.size; i++) {
      const row: Node[] = [];
      for (let j = 0; j < this.size; j++) {
        const node = this.getNode([i, j]);
        row.push(node);
      }
      arr.push(row);
    }

    this.nodeArray = arr;
    return arr;
  }

  /** Solves the maze and returns the path through it. */
  solve(): Node[] {
    return this.solveRecursive(this.start, new Set());
  }

  /** A recursive helper method for solving the maze using DFS. */
  private solveRecursive(node: Node, visited: Set<string>): Node[] {
    if (this.end.equals(node)) return [node];
    const unvisitedNeighbors = node.neighbors.filter(
      (n) => !visited.has(n.key),
    );
    if (unvisitedNeighbors.length === 0) return [];
    visited.add(node.key);
    for (const neighbor of unvisitedNeighbors) {
      const maybePath = this.solveRecursive(neighbor, visited);
      if (maybePath.length > 0) {
        return [node, ...maybePath];
      }
    }
    visited.delete(node.key);
    return [];
  }
}
