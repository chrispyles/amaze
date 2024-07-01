/** The possible directions of movement. */
export enum Dir {
  U = 0,
  R = 1,
  D = 2,
  L = 3,
}

/** All elements of {@link Dir}, in order. */
export const ALL_DIRS: readonly Dir[] = [Dir.U, Dir.R, Dir.D, Dir.L];
