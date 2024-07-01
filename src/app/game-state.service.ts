import { Injectable, signal, Signal } from '@angular/core';

import { Chooser, Dir, Maze, Node } from '../lib';

const ANIMATION_FRAME_MS = 150;

/** A service for managing the game state. */
@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  // This is NOT a secure seed -- but does it matter? I think not.
  private chooser = new Chooser(makeInsecureSeed());

  /** The current maze. */
  private mazeInternal!: Maze;

  /** The node corresponding to the current position in the maze. */
  private readonly positionInternal = signal<Node>(
    new Node(0, 0, 0, this.chooser),
  );

  /** The path of nodes leading to the current position. */
  private readonly pathInternal = signal<readonly Node[]>([]);

  /** Whether an animation is currently ongoing. */
  inAnimation = false;

  /** Generate a new maze and reset the game state. */
  reset(size: number, seed?: number): void {
    seed = seed ?? makeInsecureSeed();
    this.chooser = new Chooser(seed);
    this.mazeInternal = new Maze(size, this.chooser);
    this.positionInternal.set(this.maze.start);
    this.pathInternal.set([this.maze.start]);
  }

  /** The node corresponding to the current position in the maze. */
  get position(): Signal<Node> {
    return this.positionInternal;
  }

  /** The path of nodes leading to the current position. */
  get path(): Signal<readonly Node[]> {
    return this.pathInternal;
  }

  /** Returns a URL that includes query parameters to re-generate the current maze. */
  getShareUrl(): string {
    return `${window.location.origin}${window.location.pathname}?seed=${this.chooser.seed}`;
  }

  /** The current maze. */
  get maze(): Maze {
    return this.mazeInternal;
  }

  /**
   * Move the position in the maze in the specified direction, if allowed (i.e. if there is no wall
   * in that direction).
   */
  move(dir: Dir): void {
    if (!this.canMove(dir)) {
      console.log(`invalid movement: ${dir}`);
      return;
    }
    const coords = this.positionInternal().getNeighborCoordinates(dir);
    const newPos = this.maze.getNode(coords);
    this.pathInternal.set([...this.pathInternal(), newPos]); // TODO: should this detect when the user moves back along the path
    this.positionInternal.set(newPos);
  }

  /** Returns whether a move in the specified direction is allowed. */
  private canMove(dir: Dir): boolean {
    return !this.positionInternal().walls[dir];
  }

  /** Solve the maze and update the state to reflect the solution. */
  solve(animate?: boolean): void {
    const path = this.maze.solve();
    if (!animate) {
      this.positionInternal.set(path.at(-1)!);
      this.pathInternal.set(path);
      return;
    }
    this.inAnimation = true;
    let idx = 0;
    const animateFrame = () => {
      this.positionInternal.set(path[idx]);
      this.pathInternal.set(path.slice(0, idx + 1));
      if (idx++ < path.length - 1) {
        setTimeout(animateFrame, ANIMATION_FRAME_MS);
      } else {
        this.inAnimation = false;
      }
    };
    animateFrame();
    // TODO: display the solved maze differently than the user's solution.
  }
}

/** Creates an INSECURE PRNG seed from the current time. */
function makeInsecureSeed(): number {
  return new Date().valueOf();
}
