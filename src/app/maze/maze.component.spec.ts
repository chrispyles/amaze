import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MazeComponent } from './maze.component';
import { ALL_DIRS, Chooser, Dir, Maze, Node } from '../../lib';
import { makeMaze } from '../../testing';
import { By } from '@angular/platform-browser';
import { NodeComponent } from '../node/node.component';

describe('MazeComponent', () => {
  let maze: Maze;
  let bodyAddEventListenerSpy: jasmine.Spy;
  let component: MazeComponent;
  let fixture: ComponentFixture<MazeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MazeComponent],
    }).compileComponents();

    maze = makeMaze(new Chooser(42));

    bodyAddEventListenerSpy = spyOn(document.body, 'addEventListener');

    fixture = TestBed.createComponent(MazeComponent);
    component = fixture.componentInstance;
    const componentRef = fixture.componentRef;
    componentRef.setInput('maze', maze);
    fixture.detectChanges();
  });

  it('should render a node component for each node in the maze', () => {
    const renderedNodeKeys = new Set<string>();
    fixture.debugElement
      .queryAll(By.directive(NodeComponent))
      .forEach((dbgEl) =>
        renderedNodeKeys.add(dbgEl.componentInstance.node().key),
      );
    expect(renderedNodeKeys.size).toEqual(maze.nodes.size);
    for (const node of maze.nodes.values()) {
      expect(renderedNodeKeys.has(node.key)).toBeTrue();
    }
  });

  let t: [() => Node, string | undefined][] = [
    [() => maze.start, 'start'],
    [() => maze.end, 'end'],
    [() => maze.getNode([2, 2]), undefined],
  ];
  t.forEach(([getNode, wantEndpoint]) => {
    it('should pass the correct endpoint value to the node component', () => {
      const node = getNode();
      const dbgEl = fixture.debugElement.query(
        By.css(
          `div:nth-of-type(${node.i + 1}) > amaze-node:nth-of-type(${node.j + 1})`,
        ),
      );
      expect(dbgEl.componentInstance.endpoint()).toEqual(wantEndpoint);
    });
  });

  describe('movements', () => {
    it('should register a keydown event listener on the body element', () => {
      expect(bodyAddEventListenerSpy).toHaveBeenCalledWith(
        'keydown',
        jasmine.any(Function),
      );
    });

    const movementKeys = {
      [Dir.U]: ['ArrowUp', 'W', 'w'],
      [Dir.R]: ['ArrowRight', 'D', 'd'],
      [Dir.D]: ['ArrowDown', 'S', 's'],
      [Dir.L]: ['ArrowLeft', 'A', 'a'],
    };
    ALL_DIRS.forEach((wantDir) => {
      movementKeys[wantDir].forEach((key) => {
        it(`should emit the direction ${wantDir} when the user presses ${key}`, () => {
          const callback: (evt: { key: string }) => void =
            bodyAddEventListenerSpy.calls.argsFor(0)[1];

          let dir: Dir | undefined;
          component.move.subscribe((d) => (dir = d));

          callback({ key });

          expect(dir).toBe(wantDir);
        });
      });
    });

    it('should do nothing if a non-movement key is pressed', () => {
      const callback: (evt: { key: string }) => void =
        bodyAddEventListenerSpy.calls.argsFor(0)[1];

      let dir: Dir | undefined;
      component.move.subscribe((d) => (dir = d));

      callback({ key: 'f' });

      expect(dir).toBeUndefined();
    });

    it('should deregister the event listener when the component is destroyed', () => {
      const callback: (evt: { key: string }) => void =
        bodyAddEventListenerSpy.calls.argsFor(0)[1];

      const spy = spyOn(document.body, 'removeEventListener');

      fixture.destroy();

      expect(spy).toHaveBeenCalledWith('keydown', callback);
    });
  });
});
