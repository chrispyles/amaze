import {
  RandomGenerator,
  unsafeUniformIntDistribution,
  xoroshiro128plus,
} from 'pure-rand';

/**
 * A class that uses a seeded PRNG to choose items from arrays. Note that the provided seed is only
 * used once to initialize the PRNG, so subsequent calls to {@link choose} will return different
 * results as the PRNG's state is updated
 */
export class Chooser {
  private readonly prng: RandomGenerator;

  constructor(readonly seed: number) {
    this.prng = xoroshiro128plus(seed);
  }

  /** Returns a randomly-selected element from the provided array. */
  choose<T>(arr: readonly T[]): T {
    const idx = unsafeUniformIntDistribution(0, arr.length - 1, this.prng);
    return arr[idx];
  }
}
