import { Injectable, signal } from '@angular/core';

import { Chooser, Dir, Maze, Node } from '../lib';

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
  readonly position = signal<Node>(new Node(0, 0, 0, this.chooser));

  /** The path of nodes leading to the current position. */
  readonly path = signal<Node[]>([]);

  /** Generate a new maze and reset the game state. */
  reset(size: number, seed?: number): void {
    seed = seed ?? makeInsecureSeed();
    this.chooser = new Chooser(seed);
    this.mazeInternal = new Maze(size, this.chooser);
    this.position.set(this.maze.start);
    this.path.set([this.maze.start]);
  }

  /** Returns a URL that includes query parameters to re-generate the current maze. */
  getShareUrl(): string {
    return `${window.location.origin}/?seed=${this.chooser.seed}`;
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
    const coords = this.position().getNeighborCoordinates(dir);
    const newPos = this.maze.getNode(coords);
    this.path.set([...this.path(), newPos]); // TODO: should this detect when the user moves back along the path
    this.position.set(newPos);
  }

  /** Returns whether a move in the specified direction is allowed. */
  private canMove(dir: Dir): boolean {
    return !this.position().walls[dir];
  }
}

/** Creates an INSECURE PRNG seed from the current time. */
function makeInsecureSeed(): number {
  return new Date().valueOf();
}
