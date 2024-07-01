import { Component, computed, inject, input } from '@angular/core';
import { corrupt } from 'exhaustive';

import { type Node, Dir, ALL_DIRS } from '../../lib';
import { GameStateService } from '../game-state.service';

/** A component representing a node in the maze. */
@Component({
  selector: 'amaze-node',
  standalone: true,
  imports: [],
  template: `
    <span>{{ icon() }}</span>
    @if (node().equals(gameStateService.position())) {
      <span class="current-position"></span>
    } @else if (inPath()) {
      <span class="historical-position"></span>
    }
  `,
  styleUrl: './node.component.scss',
  host: {
    '[class]': 'classes()',
    '[class.material-symbols]': 'true',
  },
})
export class NodeComponent {
  readonly gameStateService = inject(GameStateService);

  /** The node. */
  readonly node = input.required<Node>();

  /** The endpoint type, if this node is an endpoint. */
  readonly endpoint = input<'start' | 'end' | undefined>(undefined);

  /** Whether this node is in the game's path. */
  readonly inPath = computed(() =>
    this.gameStateService.path().includes(this.node()),
  );

  /** Classes for the host component. */
  readonly classes = computed(() => {
    const node = this.node();
    let cs = [];
    for (const dir of ALL_DIRS) {
      if (node.walls[dir]) cs.push(wallClass(dir));
    }
    const endpoint = this.endpoint();
    if (endpoint) {
      const edgeWallClass = wallClass(getMazeEdge(node));
      cs = cs.filter((c) => c !== edgeWallClass);
      cs.push('endpoint', `endpoint-edge-${edgeWallClass}`, endpoint);
    }
    return cs.join(' ');
  });

  /** Icon text to display inside the component, if it is an endpoint. */
  readonly icon = computed(() => {
    if (!this.endpoint()) return '';
    const edge = getMazeEdge(this.node());
    const start = this.endpoint() === 'start';
    switch (edge) {
      case Dir.U:
        return start ? 'arrow_downward' : 'arrow_upward';
      case Dir.R:
        return start ? 'arrow_back' : 'arrow_forward';
      case Dir.D:
        return start ? 'arrow_upward' : 'arrow_downward';
      case Dir.L:
        return start ? 'arrow_forward' : 'arrow_back';
      default:
        corrupt(edge);
    }
  });
}

/** Converts a {@link Dir} to a CSS class. */
function wallClass(dir: Dir): string {
  switch (dir) {
    case Dir.U:
      return 'up';
    case Dir.R:
      return 'right';
    case Dir.D:
      return 'down';
    case Dir.L:
      return 'left';
    default:
      corrupt(dir);
  }
}

/**
 * Returns the {@link Dir} corresponding to which edge of the maze the provided node is on. If it is
 * not on an edge, an error is thrown.
 */
function getMazeEdge(node: Node): Dir {
  if (node.i === 0) return Dir.U;
  else if (node.j === node.size - 1) return Dir.R;
  else if (node.i === node.size - 1) return Dir.D;
  else if (node.j === 0) return Dir.L;
  throw new Error(`node is not attached to maze edge: ${node}`);
}
