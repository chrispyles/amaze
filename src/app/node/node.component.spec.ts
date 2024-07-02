import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeComponent } from './node.component';
import { Chooser, Coordinates, Node } from '../../lib';
import { By } from '@angular/platform-browser';
import { GameStateService } from '../game-state.service';
import { signal } from '@angular/core';

describe('NodeComponent', () => {
  let component: NodeComponent;
  let fixture: ComponentFixture<NodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NodeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NodeComponent);
    component = fixture.componentInstance;
  });

  (
    [
      [
        makeNode({
          coords: [0, 0],
          neighbors: [
            [1, 0],
            [0, 1],
          ],
        }),
        ['up', 'left'], // upper left corner, two neighbors
      ],
      [
        makeNode({
          coords: [0, 3],
          size: 4,
          neighbors: [
            [1, 3],
            [0, 2],
          ],
        }),
        ['up', 'right'], // upper right corner, two neighbors
      ],
      [
        makeNode({
          coords: [3, 0],
          size: 4,
          neighbors: [
            [2, 0],
            [3, 1],
          ],
        }),
        ['down', 'left'], // lower ,eft corner, two neighbors
      ],
      [
        makeNode({
          coords: [3, 3],
          size: 4,
          neighbors: [
            [2, 3],
            [3, 2],
          ],
        }),
        ['right', 'down'], // lower right corner, two neighbors
      ],
      [makeNode({ coords: [2, 2] }), ['up', 'right', 'down', 'left']], // no neighbors
      [
        makeNode({
          coords: [2, 2],
          neighbors: [
            [1, 2],
            [2, 1],
          ],
        }),
        ['right', 'down'], // two neighbors, two walls
      ],
    ] as [Node, string[]][]
  ).forEach(([node, classes]) => {
    it('should apply the correct wall classes to the host element', () => {
      fixture.componentRef.setInput('node', node);
      fixture.detectChanges();

      const unwantedClasses = ['up', 'right', 'down', 'left'].filter(
        (c) => !classes.includes(c),
      );

      classes.forEach((c) =>
        expect(
          fixture.debugElement.nativeElement.classList.contains(c),
        ).toBeTrue(),
      );
      unwantedClasses.forEach((c) =>
        expect(
          fixture.debugElement.nativeElement.classList.contains(c),
        ).toBeFalse(),
      );
    });
  });

  describe('endpoint', () => {
    ['start', 'end'].forEach((endpoint) => {
      it('should apply the correct endpoint wall classes to the host element', () => {
        fixture.componentRef.setInput('node', makeNode());
        fixture.componentRef.setInput('endpoint', endpoint);
        fixture.detectChanges();

        expect(
          fixture.debugElement.nativeElement.classList.contains(endpoint),
        ).toBeTrue();
      });
    });

    (
      [
        // tuple of [node coords, endpoint type, want icon]
        [[0, 0], 'start', 'arrow_downward'],
        [[1, 0], 'start', 'arrow_forward'],
        [[0, 1], 'start', 'arrow_downward'],
        [[1, 3], 'start', 'arrow_back'],
        [[3, 1], 'start', 'arrow_upward'],
        [[0, 0], 'end', 'arrow_upward'],
        [[1, 0], 'end', 'arrow_back'],
        [[0, 1], 'end', 'arrow_upward'],
        [[1, 3], 'end', 'arrow_forward'],
        [[3, 1], 'end', 'arrow_downward'],
      ] as [Coordinates, string, string][]
    ).forEach(([coords, endpointType, wantIcon]) => {
      it(`should show the correct icon for ${coords}, ${endpointType}`, () => {
        fixture.componentRef.setInput('node', makeNode({ coords, size: 4 }));
        fixture.componentRef.setInput('endpoint', endpointType);
        fixture.detectChanges();

        expect(
          fixture.debugElement.query(By.css('span')).nativeElement.textContent,
        ).toBe(wantIcon);
      });
    });
  });

  describe('position and path', () => {
    let path: Node[];

    beforeEach(() => {
      path = [
        makeNode({ coords: [0, 0] }),
        makeNode({ coords: [0, 1] }),
        makeNode({ coords: [1, 1] }),
      ];
      const service = TestBed.inject(GameStateService);
      spyOnProperty(service, 'position').and.returnValue(signal(path[2]));
      spyOnProperty(service, 'path').and.returnValue(signal(path));
    });

    it('should show a dot if the node is the current position', () => {
      fixture.componentRef.setInput('node', path[2]);
      fixture.detectChanges();

      expect(
        fixture.debugElement.query(By.css('.current-position')),
      ).toBeTruthy();
    });

    it('should show a dot if the node is in the path', () => {
      fixture.componentRef.setInput('node', path[1]);
      fixture.detectChanges();

      expect(
        fixture.debugElement.query(By.css('.historical-position')),
      ).toBeTruthy();
    });

    it('should show not a dot if the node is not the current position or in the path', () => {
      fixture.componentRef.setInput('node', makeNode({ coords: [2, 2] }));
      fixture.detectChanges();

      expect(fixture.debugElement.queryAll(By.css('span')).length).toBe(1);
    });
  });
});

interface NodeArgs {
  coords?: Coordinates;
  size?: number;
  chooser?: Chooser;
  neighbors?: Coordinates[];
}

function makeNode(args?: NodeArgs): Node {
  const defaults: NodeArgs = {
    coords: [0, 0],
    size: 20,
    chooser: new Chooser(42),
    neighbors: [],
  };
  const finalArgs = { ...defaults, ...(args ?? {}) };
  const node = new Node(
    ...finalArgs.coords!,
    finalArgs.size!,
    finalArgs.chooser!,
  );
  node.neighbors = finalArgs.neighbors!.map((coords) =>
    makeNode({ ...args, coords, neighbors: [] }),
  );
  return node;
}
