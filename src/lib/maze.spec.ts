import { Chooser } from './chooser';
import { Maze } from './maze';
import { Node } from './node';
import { Coordinates } from './shared';

describe('Maze', () => {
  let chooser: Chooser;
  let maze: Maze;

  beforeEach(() => {
    chooser = new Chooser(42);
    maze = makeMaze(chooser);
  });

  describe('constructor', () => {
    it('should populate nodes', () => {});

    it('should set the start node', () => {});

    it('should set the end node', () => {});

    it('should populate the neighbors of each node', () => {});
  });

  describe('fromNodes()', () => {
    it('should correctly populate nodes', () => {});

    it('should set the start node', () => {});

    it('should set the end node', () => {});

    it('should throw an error if nodes and size are incompatible', () => {});

    it('should throw an error if the start node is not in nodes', () => {});

    it('should throw an error if the end node is not in nodes', () => {});
  });

  describe('getNode()', () => {
    it('should return the node with the provided coordinates', () => {});
  });

  describe('toArray()', () => {
    it('should return correct the 2D node array', () => {});
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

// Creates a maze that looks like this:
//
// start: (0, 0), end: (0, 3)
//    0 1 2 3
//   ┌ ┬───┬─┐
// 0 │ │   │
// 1 │___│ │ │
// 2 │   │   │
// 3 │ │   │ │
//   └─┴───┴─┘
function makeMaze(chooser: Chooser): Maze {
  const size = 4;
  const nodes: Node[] = [];
  let start!: Node;
  let end!: Node;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      nodes.push(new Node(i, j, size, chooser));
      if (i === 0 && j === 0) start = nodes.at(-1)!;
      if (i === 0 && j === 3) end = nodes.at(-1)!;
    }
  }
  const maze = Maze.fromNodes(nodes, size, start, end);
  const neighborPairs: [Coordinates, Coordinates][] = [
    [
      [0, 0],
      [1, 0],
    ],
    [
      [1, 0],
      [1, 1],
    ],
    [
      [1, 1],
      [0, 1],
    ],
    [
      [0, 1],
      [0, 2],
    ],
    [
      [0, 2],
      [1, 2],
    ],
    [
      [1, 2],
      [2, 2],
    ],
    [
      [2, 2],
      [3, 2],
    ],
    [
      [3, 2],
      [3, 1],
    ],
    [
      [3, 1],
      [2, 1],
    ],
    [
      [2, 1],
      [2, 0],
    ],
    [
      [2, 0],
      [3, 0],
    ],
    [
      [2, 2],
      [2, 3],
    ],
    [
      [2, 3],
      [1, 3],
    ],
    [
      [1, 3],
      [0, 3],
    ],
    [
      [2, 3],
      [3, 3],
    ],
  ];
  for (const pair of neighborPairs) {
    const n1 = maze.getNode(pair[0]);
    const n2 = maze.getNode(pair[1]);
    n1.neighbors.push(n2);
    n2.neighbors.push(n1);
  }
  return maze;
}
