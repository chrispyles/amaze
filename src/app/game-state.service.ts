import { Injectable, signal } from '@angular/core';

import { Chooser, Dir, Maze, Node } from '../lib';

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  // This is NOT a secure seed -- but does it matter? I think not.
  private chooserSeed = makeInsecureSeed();
  private chooser = new Chooser(this.chooserSeed);

  private mazeInternal!: Maze;

  readonly position = signal<Node>(new Node(0, 0, 0, this.chooser));

  readonly path = signal<Node[]>([]);

  reset(size: number, seed?: number): void {
    seed = seed ?? makeInsecureSeed();
    this.chooserSeed = seed;
    this.chooser = new Chooser(seed);
    this.mazeInternal = new Maze(size, this.chooser);
    this.position.set(this.maze.start);
    this.path.set([this.maze.start]);
  }

  getShareUrl(): string {
    return `${window.location.origin}/?seed=${this.chooserSeed}`;
  }

  get maze(): Maze {
    return this.mazeInternal;
  }

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

  private canMove(dir: Dir): boolean {
    return !this.position().walls[dir];
  }
}

function makeInsecureSeed(): number {
  return new Date().valueOf();
}
