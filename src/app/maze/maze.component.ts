import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';

import { GameStateService } from '../game-state.service';
import { NodeComponent } from '../node/node.component';
import { Dir, Maze, type Node } from '../../lib';

@Component({
  selector: 'amaze-maze',
  standalone: true,
  imports: [NodeComponent],
  templateUrl: './maze.component.html',
  styleUrl: './maze.component.scss',
  host: {
    '[attr.tabindex]': '0',
  },
})
export class MazeComponent implements AfterViewInit {
  readonly elementRef = inject(ElementRef);

  readonly maze = input.required<Maze>();

  readonly move = output<Dir>();

  static eventListener?: (evt: KeyboardEvent) => void;

  ngAfterViewInit(): void {
    // this.elementRef.nativeElement.focus();
    if (MazeComponent.eventListener) {
      document.body.removeEventListener('keydown', MazeComponent.eventListener);
    }
    MazeComponent.eventListener = (evt) => this.handleKeypress(evt);
    document.body.addEventListener('keydown', MazeComponent.eventListener);
  }

  handleKeypress(evt: KeyboardEvent) {
    const arrowDir = keyToDir(evt.key);
    if (arrowDir === undefined) {
      console.log(`invalid keypress: ${evt.key}`);
      return;
    }
    this.move.emit(arrowDir);
  }

  getEndpoint(node: Node) {
    if (this.maze().start.equals(node)) {
      return 'start';
    } else if (this.maze().end.equals(node)) {
      return 'end';
    }
    return undefined;
  }
}

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
