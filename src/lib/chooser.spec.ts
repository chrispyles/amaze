import { Chooser } from './chooser';

describe('Chooser', () => {
  let chooser: Chooser;

  beforeEach(() => {
    chooser = new Chooser(42);
  });

  describe('choose()', () => {
    it('should choose a random element from the provided array', () => {
      const arr = new Array(20).fill(0).map((_, i) => i);
      const got: number[] = [];
      for (let i = 0; i < 20; i++) {
        got.push(chooser.choose(arr));
      }
      expect(got).toEqual([
        5, 5, 15, 0, 14, 4, 12, 7, 19, 13, 3, 5, 17, 13, 18, 0, 2, 12, 16, 4,
      ]);
    });
  });
});
