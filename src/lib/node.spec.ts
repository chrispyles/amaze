import { TestingChooser } from '../testing';
import { Chooser } from './chooser';
import { Node } from './node';
import { ALL_DIRS, Dir } from './shared';

describe('Node', () => {
  let chooser: TestingChooser;
  let node: Node;

  beforeEach(() => {
    chooser = new TestingChooser();
    node = new Node(1, 2, 4, chooser);
  });

  describe('getKey()', () => {
    it('should return the node key with the provided coordinates', () => {
      expect(Node.getKey([2, 3])).toBe('2~3');
    });

    it('should return the node key with the provided i and j indices', () => {
      expect(Node.getKey(2, 3)).toBe('2~3');
    });
  });

  describe('key', () => {
    it('should return the node key', () => {
      expect(node.key).toBe('1~2');
    });
  });

  describe('equals()', () => {
    it('should return true if the object is a node with the same coordinates', () => {
      // different size and chooser, but still "equal" (behavior when comparing nodes of different sizes is undefined)
      const n2 = new Node(1, 2, 5, new Chooser(42));
      expect(node.equals(n2)).toBeTrue();
    });

    it('should return false if the object is a node with different coordinates', () => {
      const n2 = new Node(1, 3, 4, new Chooser(42));
      expect(node.equals(n2)).toBeFalse();
    });

    it('should return true if the object is a tuple with the correct coordinates', () => {
      expect(node.equals([1, 2])).toBe(true);
    });

    it('should return false if the object is an array with the wrong number of elements', () => {
      expect(node.equals([1])).toBeFalse();
      expect(node.equals([1, 2, 3])).toBeFalse();
    });

    it('should return false otherwise', () => {
      expect(node.equals({})).toBeFalse();
    });
  });

  describe('getNeighborCoordinates()', () => {
    [
      { dir: Dir.U, want: [0, 2] },
      { dir: Dir.R, want: [1, 3] },
      { dir: Dir.D, want: [2, 2] },
      { dir: Dir.L, want: [1, 1] },
    ].forEach(({ dir, want }) => {
      it(`should return the correct coordinates for ${dir}`, () => {
        expect(node.getNeighborCoordinates(dir)).toEqual(want);
      });
    });
  });

  describe('chooseNeighbor()', () => {
    it('should return a random nonexistent neighbor node', () => {
      const nodes = new Map<string, Node>();
      const n2 = node.chooseNeighbor(nodes)!;
      expect(n2).toEqual(new Node(0, 2, 4, chooser));
      nodes.set(n2.key, n2);
      // The next node after the one in the Dir.U direction (which already exists in the nodes map)
      // and the TestingChooser's index is now 1, so it will select the Dir.D direction node (which
      // will be the second node in the array after filtering out the Dir.U direction node).
      expect(node.chooseNeighbor(nodes)).toEqual(new Node(2, 2, 4, chooser));
    });

    it('should not return a node with invalid coordinates', () => {
      const node = new Node(0, 0, 4, chooser);
      // The Dir.U direction node would normally be chosen, but there is a wall above node [0, 0],
      // so the next candidate neighbor is node [0, 1].
      expect(node.chooseNeighbor(new Map())).toEqual(
        new Node(0, 1, 4, chooser),
      );
    });

    it('should return undefined if each neighbor node already exists', () => {
      const nodes = [
        new Node(0, 2, 4, chooser),
        new Node(1, 3, 4, chooser),
        new Node(2, 2, 4, chooser),
        new Node(1, 1, 4, chooser),
      ].reduce((m, n) => m.set(n.key, n), new Map());
      expect(node.chooseNeighbor(nodes)).toBeUndefined();
    });
  });

  describe('walls', () => {
    beforeEach(() => {
      node.neighbors.push(
        new Node(1, 1, 4, chooser),
        new Node(0, 2, 4, chooser),
      );
    });

    it('should return an array of booleans indicating each direction with a wall', () => {
      expect(node.walls).toEqual([false, true, true, false]);
    });

    [
      { coords: [0, 0], edges: [Dir.U, Dir.L] },
      { coords: [0, 3], edges: [Dir.U, Dir.R] },
      { coords: [3, 3], edges: [Dir.R, Dir.D] },
      { coords: [3, 0], edges: [Dir.D, Dir.L] },
      { coords: [0, 1], edges: [Dir.U] },
      { coords: [1, 3], edges: [Dir.R] },
      { coords: [3, 1], edges: [Dir.D] },
      { coords: [1, 0], edges: [Dir.L] },
    ].forEach(({ coords, edges }) =>
      it(`should ensure a wall is present when a node is on along an edge for node ${coords}`, () => {
        const node = new Node(coords[0], coords[1], 4, chooser);
        // Add a neighbor in every direction so all walls are created by maze edges.
        for (const dir of ALL_DIRS) {
          node.neighbors.push(
            new Node(...node.getNeighborCoordinates(dir), 4, chooser),
          );
        }
        for (const dir of ALL_DIRS) {
          expect(node.walls[dir])
            .withContext(`dir ${dir}`)
            .toBe(edges.includes(dir));
        }
      }),
    );
  });
});
