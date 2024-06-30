import { Injectable } from '@angular/core';

import { Maze } from '../lib';

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  private mazeInternal!: Maze;

  reset(size: number): void {
    this.mazeInternal = new Maze(size);
  }

  get maze(): Maze {
    return this.mazeInternal;
  }
}
