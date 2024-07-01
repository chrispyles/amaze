import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MazeComponent } from './maze.component';
import { Chooser, Maze } from '../../lib';

describe('MazeComponent', () => {
  let component: MazeComponent;
  let fixture: ComponentFixture<MazeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MazeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MazeComponent);
    component = fixture.componentInstance;
    const componentRef = fixture.componentRef;
    componentRef.setInput('maze', new Maze(20, new Chooser(42)));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
