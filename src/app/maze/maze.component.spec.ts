import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MazeComponent } from './maze.component';
import { ALL_DIRS, Chooser, Dir, Maze } from '../../lib';

describe('MazeComponent', () => {
  let maze: Maze;
  let component: MazeComponent;
  let fixture: ComponentFixture<MazeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MazeComponent],
    }).compileComponents();

    maze = new Maze(20, new Chooser(42));

    fixture = TestBed.createComponent(MazeComponent);
    component = fixture.componentInstance;
    const componentRef = fixture.componentRef;
    componentRef.setInput('maze', maze);
    fixture.detectChanges();
  });

  it('should render a node component for each node in the maze', () => {});

  [
    [() => maze.start, 'start'],
    [() => maze.end, 'end'],
    [() => maze.getNode([4, 4]), undefined],
  ].forEach((getNode, endpointType) => {
    it('should pass the correct endpoint value to the node component', () => {});
  });

  describe('movements', () => {
    it('should register a keydown event listener on the body element', () => {});

    const movementKeys = {
      [Dir.U]: ['ArrowUp', 'W', 'w'],
      [Dir.R]: ['ArrowRight', 'D', 'd'],
      [Dir.D]: ['ArrowDown', 'S', 's'],
      [Dir.L]: ['ArrowLeft', 'A', 'a'],
    };
    ALL_DIRS.forEach((dir) => {
      movementKeys[dir].forEach((key) => {
        it(`should emit the direction ${dir} when the user presses ${key}`, () => {});
      });
    });

    it('should do nothing if a non-movement key is pressed', () => {});

    it('should deregister the event listener when the component is destroyed', () => {});
  });
});
