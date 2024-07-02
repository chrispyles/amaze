import { Chooser } from '../lib';

/** A {@link Chooser} for use in testing that chooses items in an easily-predictable order. */
export class TestingChooser extends Chooser {
  idx = 0;

  constructor() {
    super(0);
  }

  override choose<T>(arr: T[]): T {
    if (arr.length === 0) throw new Error('cannot choose from empty array');
    return arr[this.idx++ % arr.length];
  }
}
