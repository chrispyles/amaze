import { TestBed } from '@angular/core/testing';

import { GameStateService } from './game-state.service';
import { Dir } from '../lib';

const SIZE = 4;

describe('GameStateService', () => {
  let clock: jasmine.Clock;
  let service: GameStateService;

  beforeAll(() => {
    clock = jasmine.clock();
    clock.install();
  });

  afterAll(() => {
    clock.uninstall();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameStateService);
    service.reset(SIZE, 44);
  });

  describe('reset()', () => {
    it('should create a new maze', () => {
      const maze = service.maze;
      service.reset(SIZE, 42);
      expect(service.maze).not.toBe(maze);
    });

    it('should use the specified seed if provided', () => {
      service.reset(SIZE, 42);
      expect(service.TEST_ONLY.getChooser().seed).toBe(42);
    });

    it('should set position to the starting endpoint', () => {
      expect(service.position()).toBe(service.maze.start);
    });

    it('should set path to an array containing only the starting endpoint', () => {
      expect(service.path()).toEqual([service.maze.start]);
    });

    it('should abort any in-progress animations', async () => {
      service.solve(true);

      clock.tick(10);
      expect(service.inAnimation).toBe(true);

      service.reset(SIZE, 43);
      expect(service.inAnimation).toBe(true); // still true since inAnimation isn't reset until the next frame

      clock.tick(141); // tick past the next frame
      expect(service.inAnimation).toBeFalse();
    });
  });

  describe('getShareUrl()', () => {
    it("should generate a URL containing the current maze's seed", () => {
      expect(service.getShareUrl()).toEqual(
        `${window.location.origin}${window.location.pathname}?seed=44`,
      );
    });
  });

  describe('move()', () => {
    it('should not allow invalid moves', () => {
      const pos = service.position();
      service.move(Dir.U); // there is a wall above of the starting node
      expect(service.position()).toBe(pos);
    });

    it('should update position', () => {
      service.move(Dir.L);
      expect(service.position()).toBe(service.maze.getNode([0, 2]));
    });

    it('should update path', () => {
      const pos = service.position();
      service.move(Dir.L);
      expect(service.path()).toEqual([pos, service.maze.getNode([0, 2])]);
    });
  });

  describe('solve()', () => {
    it('should solve the maze without animation', () => {
      service.solve();
      expect(service.position()).toBe(service.maze.end);
      expect(service.path()).toEqual([
        service.maze.getNode([0, 3]),
        service.maze.getNode([0, 2]),
        service.maze.getNode([1, 2]),
        service.maze.getNode([2, 2]),
        service.maze.getNode([3, 2]),
      ]);
    });

    it('should animate the maze solving if indicated', () => {
      const wantPath = [
        service.maze.getNode([0, 3]),
        service.maze.getNode([0, 2]),
        service.maze.getNode([1, 2]),
        service.maze.getNode([2, 2]),
        service.maze.getNode([3, 2]),
      ];

      service.solve(true);

      for (let i = 0; i < 5; i++) {
        expect(service.position()).toBe(wantPath[i]);
        expect(service.path()).toEqual(wantPath.slice(0, i + 1));
        clock.tick(150);
      }
      expect(service.position()).toBe(service.maze.end);
      expect(service.path()).toEqual(wantPath);
    });

    it('should set inAnimation during the animation', () => {
      service.solve(true);
      expect(service.inAnimation).toBe(true);
    });
  });
});
