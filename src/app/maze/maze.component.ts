import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
} from '@angular/core';

import { NodeComponent } from '../node/node.component';
import { Dir, Maze, type Node } from '../../lib';

/** A component representing the maze. */
@Component({
  selector: 'amaze-maze',
  standalone: true,
  imports: [NodeComponent],
  templateUrl: './maze.component.html',
  styleUrl: './maze.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.tabindex]': '0',
  },
})
export class MazeComponent implements AfterViewInit, OnDestroy {
  readonly elementRef = inject(ElementRef);

  /** The maze. */
  readonly maze = input.required<Maze>();

  /** Emits a direction when the user moves. */
  readonly move = output<Dir>();

  /** The last keydown event listener added to the body, for cleanup. */
  static eventListener?: (evt: KeyboardEvent) => void;

  ngAfterViewInit(): void {
    this.cleanupEventListener();
    MazeComponent.eventListener = (evt) => this.handleKeypress(evt);
    document.body.addEventListener('keydown', MazeComponent.eventListener);
  }

  ngOnDestroy(): void {
    this.cleanupEventListener();
  }

  /** Cleans up the body keydown event listener, if there is one. */
  private cleanupEventListener(): void {
    if (MazeComponent.eventListener) {
      document.body.removeEventListener('keydown', MazeComponent.eventListener);
    }
  }

  /** Handle a keydown event to move the current position. */
  handleKeypress(evt: KeyboardEvent) {
    const arrowDir = keyToDir(evt.key);
    if (arrowDir === undefined) {
      console.log(`invalid keypress: ${evt.key}`);
      return;
    }
    this.move.emit(arrowDir);
  }

  /** Returns the endpoint type of the provided node, or undefined if it is not an endpoint. */
  getEndpoint(node: Node) {
    if (this.maze().start.equals(node)) {
      return 'start';
    } else if (this.maze().end.equals(node)) {
      return 'end';
    }
    return undefined;
  }
}

/** Converts a KeyboardEvent key to a {@link Dir}. Supports arrow keys and WASD. */
function keyToDir(key: string): Dir | undefined {
  switch (key) {
    case 'ArrowUp':
    case 'W':
    case 'w':
      return Dir.U;
    case 'ArrowRight':
    case 'D':
    case 'd':
      return Dir.R;
    case 'ArrowDown':
    case 'S':
    case 's':
      return Dir.D;
    case 'ArrowLeft':
    case 'A':
    case 'a':
      return Dir.L;
    default:
      return undefined;
  }
}
