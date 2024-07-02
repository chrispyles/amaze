import { Chooser, Coordinates, Maze, Node } from '../lib';

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
export function makeMaze(chooser: Chooser): Maze {
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
