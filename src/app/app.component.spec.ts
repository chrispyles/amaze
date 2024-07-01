import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  it('should apply the seed in the URL', () => {});

  it('should not provide a seed if no seed is in the URL', () => {});

  describe('dark mode', () => {
    it('should set the dark mode class correctly', () => {});

    it('should set the logo color correctly', () => {});
  });

  describe('move handling', () => {
    it('should use the GameStateService to perform the move', () => {});

    it('should not move if the GameStatService is in an animation', () => {});
  });

  describe('solve maze button', () => {
    it('should use the GameStateService to solve the maze with an animation', () => {});

    it('should do nothing if the GameStateService is in an animation', () => {});
  });

  describe('generate maze button', () => {
    it('should reset the GameStateService', () => {});
  });

  describe('toggle dark mode button', () => {
    it('should toggle dark mode', () => {});
  });

  describe('share maze button', () => {
    it('should generate a URL with the GameStateService', () => {});

    it('should copy the URL to the clipboard', () => {});
  });
});
