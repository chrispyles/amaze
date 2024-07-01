import { TestBed } from '@angular/core/testing';

import { GameStateService } from './game-state.service';

describe('GameStateService', () => {
  let service: GameStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameStateService);
  });

  describe('reset()', () => {
    it('should create a new maze', () => {});

    it('should use the specified seed if provided', () => {});

    it('should set position to the starting endpoint', () => {});

    it('should set path to an array containing only the starting endpoint', () => {});

    it('should abort any in-progress animations', () => {});
  });

  describe('getShareUrl()', () => {
    it("should generate a URL containing the current maze's seed", () => {});
  });

  describe('move()', () => {
    it('should not allow invalid moves', () => {});

    it('should update position', () => {});

    it('should update path', () => {});
  });

  describe('solve()', () => {
    it('should solve the maze without animation', () => {});

    it('should animate the maze solving if indicated', () => {});

    it('should set inAnimation during the animation', () => {});
  });
});
