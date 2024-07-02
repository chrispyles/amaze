import {
  ChangeDetectionStrategy,
  Component,
  inject,
  InjectionToken,
  OnInit,
} from '@angular/core';

import { MazeComponent } from './maze/maze.component';
import { GameStateService } from './game-state.service';
import { Dir, type Maze } from '../lib';
import { LogoComponent } from './logo/logo.component';

const DARK_MODE_CLASS = 'dark-mode';

/** An injection token for the global window object, to allow overriding in tests. */
export const WINDOW_TOKEN = new InjectionToken('window', {
  factory: () => window,
});

/** The root component for the app. */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LogoComponent, MazeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  private readonly gameStateService = inject(GameStateService);

  private readonly window = inject(WINDOW_TOKEN);

  /** The size of the maze, defined as the number of rows/columns in the maze. */
  size = 20;

  ngOnInit(): void {
    // Set dark mode if user's OS is using it.
    if (
      this.window.matchMedia &&
      this.window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      document.body.classList.add(DARK_MODE_CLASS);
    }

    const url = new URL(this.window.location.toString());
    let seed: number | undefined;
    if (url.searchParams.has('seed')) {
      seed = Number(url.searchParams.get('seed'));
      this.window.history.pushState({}, '', this.window.location.origin);
    }
    this.generateNewMaze(seed);
  }

  /** The color to use for the logo in the header. */
  get logoColor() {
    return this.darkModeEnabled ? 'white' : 'black';
  }

  /** The game's maze. */
  get maze(): Maze {
    return this.gameStateService.maze;
  }

  /** Solves the maze and displays the solution. */
  solveMaze(): void {
    if (this.gameStateService.inAnimation) return;
    this.gameStateService.solve(true);
  }

  /** Generate a new maze, optionally with the specified seed. */
  generateNewMaze(seed?: number): void {
    this.gameStateService.reset(this.size, seed);
  }

  /** Whether dark mode is currently enabled. */
  get darkModeEnabled(): boolean {
    return document.body.classList.contains(DARK_MODE_CLASS);
  }

  /** The icon to use in the toggle dark mode button. */
  get themeModeIcon(): string {
    return this.darkModeEnabled ? 'light_mode' : 'dark_mode';
  }

  /** Toggles dark mode. */
  toggleDarkMode(): void {
    document.body.classList.toggle(DARK_MODE_CLASS);
  }

  /** Copies a URL to the current maze to the clipboard. */
  shareMaze(): void {
    const url = this.gameStateService.getShareUrl();
    navigator.clipboard.writeText(url);
    alert('URL copied to clipboard'); // TODO: snackbar?
  }

  /** Handles a move by the user. */
  handleMove(dir: Dir): void {
    if (this.gameStateService.inAnimation) return;
    this.gameStateService.move(dir);
  }
}
