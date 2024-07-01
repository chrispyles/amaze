import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeComponent } from './node.component';
import { Chooser, Coordinates, Node } from '../../lib';

describe('NodeComponent', () => {
  let component: NodeComponent;
  let fixture: ComponentFixture<NodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NodeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NodeComponent);
    component = fixture.componentInstance;
    const componentRef = fixture.componentRef;
    componentRef.setInput('node', new Node(0, 0, 20, new Chooser(42)));
    fixture.detectChanges();
  });

  [
    [new Node(0, 0, 20, new Chooser(42)), ['up', 'down']], // TODO: make stub
  ].forEach((node) => {
    it('should apply the correct wall classes to the host element', () => {});
  });

  describe('endpoint', () => {
    it('should apply the correct endpoint wall classes to the host element', () => {});

    // TODO: parametrize
    [
      // tuple of [node coords, endpoint type, want icon]
      [[0, 0], 'start', 'arrow_downward'],
    ].forEach(([coords, endpointType, wantIcon]) => {
      it(`should show the correct icon for ${coords}, ${endpointType}`, () => {});
    });
  });

  it('should show a dot if the node is the current position', () => {});

  it('should show a dot if the node is in the path', () => {});
});

interface NodeArgs {
  coords?: Coordinates;
  size?: number;
  chooser?: Chooser;
  neighbors?: Coordinates[];
}

function makeNode(args: NodeArgs): Node {
  const defaults: NodeArgs = {
    coords: [0, 0],
    size: 20,
    chooser: new Chooser(42),
    neighbors: [],
  };
  const finalArgs = { ...defaults, ...args };
  const node = new Node(
    ...finalArgs.coords!,
    finalArgs.size!,
    finalArgs.chooser!,
  );
  node.neighbors = finalArgs.neighbors!.map((coords) =>
    makeNode({ ...args, coords }),
  );
  return node;
}
