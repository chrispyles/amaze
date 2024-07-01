import { Component, inject, OnInit } from '@angular/core';

import { MazeComponent } from './maze/maze.component';
import { GameStateService } from './game-state.service';
import { Dir, type Maze } from '../lib';
import { LogoComponent } from './logo/logo.component';

const DARK_MODE_CLASS = 'dark-mode';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LogoComponent, MazeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  readonly gameStateService = inject(GameStateService);

  size = 20;

  ngOnInit(): void {
    // Set dark mode if user's OS is using it.
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      document.body.classList.add(DARK_MODE_CLASS);
    }

    const url = new URL(window.location.toString());
    let seed: number | undefined;
    if (url.searchParams.has('seed')) {
      seed = Number(url.searchParams.get('seed'));
      window.history.pushState({}, '', window.location.origin);
    }
    this.generateNewMaze(seed);
  }

  get maze(): Maze {
    return this.gameStateService.maze;
  }

  generateNewMaze(seed?: number) {
    this.gameStateService.reset(this.size, seed);
  }

  get themeModeIcon(): string {
    return document.body.classList.contains(DARK_MODE_CLASS)
      ? 'light_mode'
      : 'dark_mode';
  }

  toggleDarkMode() {
    document.body.classList.toggle(DARK_MODE_CLASS);
  }

  shareMaze() {
    const url = this.gameStateService.getShareUrl();
    navigator.clipboard.writeText(url);
    alert('URL copied to clipboard'); // TODO: snackbar?
  }

  handleMove(dir: Dir): void {
    this.gameStateService.move(dir);
  }
}
