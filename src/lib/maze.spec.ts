import { Maze } from './maze';
import { makeMaze, TestingChooser } from '../testing';
import { Node } from './node';
import { Chooser } from './chooser';

describe('Maze', () => {
  let chooser: TestingChooser;
  let maze: Maze;

  beforeEach(() => {
    chooser = new TestingChooser();
    maze = makeMaze(chooser);
  });

  describe('constructor', () => {
    it('should populate nodes', () => {
      const maze = new Maze(4, chooser);
      expect(maze.nodes.size).toBe(16);
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          expect(maze.nodes.get(Node.getKey([i, j]))).toEqual(
            jasmine.any(Node),
          );
        }
      }
    });

    it(`should set a valid start node`, () => {
      // Test with several seeds to ensure that it does not pick a node not on the edge of the maze.
      for (let s = 0; s < 1000; s++) {
        const maze = new Maze(4, new Chooser(s));
        expect(maze.start).toEqual(jasmine.any(Node));
        const n = maze.start;
        expect(n.i === 0 || n.i === 3 || n.j === 0 || n.j === 3)
          .withContext(`seed ${s}`)
          .toBeTrue();
      }
    });

    it('should set a valid end node', () => {
      // Test with several seeds to ensure that it does not pick a node not on the edge of the maze.
      for (let s = 0; s < 1000; s++) {
        const maze = new Maze(4, new Chooser(s));
        expect(maze.end).toEqual(jasmine.any(Node));
        const n = maze.end;
        expect(n.i === 0 || n.i === 3 || n.j === 0 || n.j === 3)
          .withContext(`seed ${s}`)
          .toBeTrue();
      }
    });

    it('should populate the neighbors of each node', () => {
      const maze = new Maze(4, chooser);
      for (const node of maze.nodes.values()) {
        expect(node.neighbors.length)
          .withContext(`node ${node.key}`)
          .toBeGreaterThan(0);
      }
      expect(maze.getNode([0, 0]).neighbors).toEqual([
        maze.getNode([0, 1]),
        maze.getNode([1, 0]),
      ]);
      expect(maze.getNode([0, 1]).neighbors).toEqual([maze.getNode([0, 0])]);
    });
  });

  describe('fromNodes()', () => {
    let nodes: Node[];

    beforeEach(() => {
      nodes = [
        new Node(0, 0, 2, chooser),
        new Node(0, 1, 2, chooser),
        new Node(1, 0, 2, chooser),
        new Node(1, 1, 2, chooser),
      ];
      maze = Maze.fromNodes(nodes, 2, nodes[0], nodes[3]);
    });

    it('should correctly populate nodes', () => {
      expect(maze.nodes).toEqual(
        new Map([
          [nodes[0].key, nodes[0]],
          [nodes[1].key, nodes[1]],
          [nodes[2].key, nodes[2]],
          [nodes[3].key, nodes[3]],
        ]),
      );
    });

    it('should set the start node', () => {
      expect(maze.start).toBe(nodes[0]);
    });

    it('should set the end node', () => {
      expect(maze.end).toBe(nodes[3]);
    });

    it('should throw an error if nodes and size are incompatible', () => {
      expect(() =>
        Maze.fromNodes(nodes.slice(1), 2, nodes[1], nodes[3]),
      ).toThrow();
    });

    it('should throw an error if the start node is not in nodes', () => {
      expect(() =>
        Maze.fromNodes(nodes, 2, new Node(0, 0, 2, chooser), nodes[3]),
      ).toThrow();
    });

    it('should throw an error if the end node is not in nodes', () => {
      expect(() =>
        Maze.fromNodes(nodes, 2, nodes[0], new Node(0, 0, 2, chooser)),
      ).toThrow();
    });
  });

  describe('getNode()', () => {
    it('should return the node with the provided coordinates', () => {
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          const node = maze.getNode([i, j]);
          expect(node).toEqual(jasmine.any(Node));
          expect(node.i).toBe(i);
          expect(node.j).toBe(j);
        }
      }
    });
  });

  describe('toArray()', () => {
    it('should return correct the 2D node array', () => {
      const want: Node[][] = [];
      for (let i = 0; i < 4; i++) {
        const row: Node[] = [];
        for (let j = 0; j < 4; j++) {
          row.push(maze.getNode([i, j]));
        }
        want.push(row);
      }
      expect(maze.toArray()).toEqual(want);
      // Test twice to check cached version.
      expect(maze.toArray()).toEqual(want);
    });
  });

  describe('solve()', () => {
    it('should return the path through the maze', () => {
      const want = [
        maze.getNode([0, 0]),
        maze.getNode([1, 0]),
        maze.getNode([1, 1]),
        maze.getNode([0, 1]),
        maze.getNode([0, 2]),
        maze.getNode([1, 2]),
        maze.getNode([2, 2]),
        maze.getNode([2, 3]),
        maze.getNode([1, 3]),
        maze.getNode([0, 3]),
      ];
      expect(maze.solve()).toEqual(want);
    });
  });
});
