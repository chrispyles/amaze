import {
  RandomGenerator,
  unsafeUniformIntDistribution,
  xoroshiro128plus,
} from 'pure-rand';

export class Chooser {
  private readonly prng: RandomGenerator;

  constructor(seed: number) {
    this.prng = xoroshiro128plus(seed);
  }

  /** Returns a randomly-selected element from the provided array. */
  choose<T>(arr: readonly T[]): T {
    const idx = unsafeUniformIntDistribution(0, arr.length - 1, this.prng);
    return arr[idx];
  }
}
