import { ALL_DIRS } from './shared';

describe('Node', () => {
  describe('getKey()', () => {
    it('should return the node key with the provided coordinates', () => {});

    it('should return the node key with the provided i and j indices', () => {});
  });

  describe('key', () => {
    it('should return the node key', () => {});
  });

  describe('equals()', () => {
    it('should return true if the object is a node with the same coordinates', () => {});

    it('should return true if the object is a tuple with the correct coordinates', () => {});

    it('should return false if the object is an array with the wrong number of elements', () => {});

    it('should return false otherwise', () => {});
  });

  describe('getNeighborCoordinates()', () => {
    ALL_DIRS.forEach((dir) => {
      it(`should return the correct coordinates for ${dir}`, () => {});
    });
  });

  describe('chooseNeighbor()', () => {
    it('should return a random nonexistent neighbor node', () => {});

    it('should not return a node with invalid coordinates', () => {});

    it('should return undefined if each neighbor node already exists', () => {});
  });

  describe('walls', () => {
    it('should return an array of booleans indicating each direction with a wall', () => {});

    it('should return an array that can be indexed correctly with the Dir enum', () => {});

    // TODO: parametrize
    it('should ensure a wall is present when a node is on along an edge', () => {});
  });
});
