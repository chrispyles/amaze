import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, WritableSignal } from '@angular/core';
import { By } from '@angular/platform-browser';

import { AppComponent, WINDOW_TOKEN } from './app.component';
import { GameStateService } from './game-state.service';
import { Chooser, Dir, Maze, Node } from '../lib';
import { LogoComponent } from './logo/logo.component';
import { MazeComponent } from './maze/maze.component';
import { ConfettiService } from './confetti.service';

describe('AppComponent', () => {
  let positionSignal: WritableSignal<Node>;
  let gameStateService: jasmine.SpyObj<GameStateService>;
  let windowSpy: jasmine.SpyObj<Window>;
  let clipboardWriteSpy: jasmine.Spy;
  let confettiStartSpy: jasmine.Spy;
  let createComponent = true;
  let testBed: TestBed;
  let fixture: ComponentFixture<AppComponent>;

  const setInAnimation = () => {
    (
      Object.getOwnPropertyDescriptor(gameStateService, 'inAnimation')
        ?.get as jasmine.Spy
    ).and.returnValue(true);
  };

  beforeAll(() => {
    jasmine.clock().install();
  });

  afterAll(() => {
    jasmine.clock().uninstall();
  });

  beforeEach(async () => {
    const maze = new Maze(4, new Chooser(42));
    positionSignal = signal(maze.getNode([0, 0]));
    gameStateService = jasmine.createSpyObj<GameStateService>(
      'GameStateService',
      ['getShareUrl', 'move', 'reset', 'solve'],
      {
        inAnimation: false,
        maze,
        position: positionSignal,
        path: signal([maze.getNode([0, 0])]),
      },
    );
    gameStateService.getShareUrl.and.returnValue(
      'http://example.com/?seed=321',
    );

    windowSpy = jasmine.createSpyObj(
      'Window',
      ['addEventListener', 'matchMedia'],
      {
        history: { pushState: jasmine.createSpy() },
        innerHeight: 850,
        innerWidth: 1000,
        location: {
          origin: 'http://example.com',
          toString: () => 'http://example.com/?seed=123',
        },
      },
    );
    windowSpy.matchMedia.and.returnValue({ matches: false } as MediaQueryList);

    clipboardWriteSpy = spyOn(navigator.clipboard, 'writeText');

    testBed = TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: GameStateService, useValue: gameStateService },
        {
          provide: WINDOW_TOKEN,
          useValue: windowSpy,
        },
      ],
    });

    confettiStartSpy = spyOn(TestBed.inject(ConfettiService), 'start');

    if (createComponent) {
      await testBed.compileComponents();
      fixture = TestBed.createComponent(AppComponent);
    }
  });

  afterEach(() => {
    document.body.classList.remove('dark-mode');
  });

  describe('URL seeding', () => {
    it('should apply the seed in the URL', () => {
      fixture.detectChanges();
      expect(gameStateService.reset).toHaveBeenCalledWith(20, 123);
    });

    it('should update the browser history to remove the seed param', () => {
      fixture.detectChanges();
      expect(windowSpy.history.pushState).toHaveBeenCalledWith(
        {},
        '',
        'http://example.com',
      );
    });

    it('should not provide a seed if no seed is in the URL', () => {
      windowSpy.location.toString = () => 'http://example.com/';
      fixture.detectChanges();
      expect(gameStateService.reset).toHaveBeenCalledWith(20, undefined);
    });
  });

  describe('dark mode', () => {
    [true, false].forEach((prefersDarkMode) => {
      describe(`prefersDarkMode = ${prefersDarkMode}`, () => {
        beforeEach(() => {
          windowSpy.matchMedia.and.returnValue({
            matches: prefersDarkMode,
          } as MediaQueryList);
          fixture.detectChanges();
        });

        it(`should set the dark mode class correctly`, () => {
          expect(document.body.classList.contains('dark-mode')).toBe(
            prefersDarkMode,
          );
        });

        it(`should set the logo color correctly`, () => {
          const dbgEl = fixture.debugElement.query(By.directive(LogoComponent));
          expect(dbgEl.componentInstance.color).toBe(
            prefersDarkMode ? 'white' : 'black',
          );
        });
      });
    });
  });

  describe('move handling', () => {
    it('should use the GameStateService to perform the move', () => {
      fixture.detectChanges();
      fixture.debugElement
        .query(By.directive(MazeComponent))
        .componentInstance.move.emit(Dir.U);
      expect(gameStateService.move).toHaveBeenCalledWith(Dir.U);
    });

    it('should not move if the GameStatService is in an animation', () => {
      setInAnimation();
      fixture.detectChanges();
      fixture.debugElement
        .query(By.directive(MazeComponent))
        .componentInstance.move.emit(Dir.U);
      expect(gameStateService.move).not.toHaveBeenCalled();
    });

    it('should show confetti when the endpoint is reached', () => {
      positionSignal.set(gameStateService.maze.end);
      fixture.detectChanges();
      expect(confettiStartSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('solve maze button', () => {
    it('should use the GameStateService to solve the maze with an animation', () => {
      fixture.debugElement
        .query(By.css('[data-test-id="solve-maze-button"]'))
        .nativeElement.click();
      expect(gameStateService.solve).toHaveBeenCalledWith(true);
    });

    it('should do nothing if the GameStateService is in an animation', () => {
      setInAnimation();
      fixture.debugElement
        .query(By.css('[data-test-id="solve-maze-button"]'))
        .nativeElement.click();
      expect(gameStateService.solve).not.toHaveBeenCalled();
    });
  });

  describe('generate maze button', () => {
    it('should reset the GameStateService', () => {
      fixture.debugElement
        .query(By.css('[data-test-id="generate-maze-button"]'))
        .nativeElement.click();
      expect(gameStateService.reset).toHaveBeenCalledWith(20, undefined);
    });
  });

  describe('toggle dark mode button', () => {
    it('should toggle dark mode', () => {
      const clickButton = () =>
        fixture.debugElement
          .query(By.css('[data-test-id="toggle-dark-mode-button"]'))
          .nativeElement.click();
      // Check that dark mode is initially off.
      expect(document.body.classList.contains('dark-mode')).toBeFalse();
      clickButton();
      expect(document.body.classList.contains('dark-mode')).toBeTrue();
      clickButton();
      expect(document.body.classList.contains('dark-mode')).toBeFalse();
    });
  });

  describe('share maze button', () => {
    it('should generate a URL with the GameStateService', () => {
      fixture.debugElement
        .query(By.css('[data-test-id="share-maze-button"]'))
        .nativeElement.click();
      expect(gameStateService.getShareUrl).toHaveBeenCalledWith();
    });

    it('should copy the URL to the clipboard', () => {
      fixture.debugElement
        .query(By.css('[data-test-id="share-maze-button"]'))
        .nativeElement.click();
      expect(clipboardWriteSpy).toHaveBeenCalledWith(
        'http://example.com/?seed=321',
      );
    });

    it('should show a snack bar confirming that the URL was copied', (done) => {
      fixture.debugElement
        .query(By.css('[data-test-id="share-maze-button"]'))
        .nativeElement.click();
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector('.snack-bar').textContent.trim(),
      ).toBe('URL copied to clipboard');
      expect(
        fixture.nativeElement
          .querySelector('.snack-bar')
          .classList.contains('visible'),
      ).toBeTrue();

      // check that the snackbar is hidden after 2s and emptied after 3s

      jasmine.clock().tick(2000);
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector('.snack-bar').style.opacity,
      ).toBe('0');

      jasmine.clock().tick(1000);
      fixture.detectChanges();
      expect(
        fixture.nativeElement
          .querySelector('.snack-bar')
          .classList.contains('visible'),
      ).toBeFalse();
      done();
    });
  });

  describe('viewport size error', () => {
    beforeAll(() => {
      createComponent = false;
    });

    afterAll(() => {
      createComponent = true;
    });

    it('should display a message if the viewport is too short', async () => {
      (
        Object.getOwnPropertyDescriptor(windowSpy, 'innerHeight')
          ?.get as jasmine.Spy
      ).and.returnValue(849);

      await testBed.compileComponents();
      fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();

      expect(
        document
          .querySelector('[data-test-id="viewport-size-error"]')
          ?.textContent?.trim(),
      ).toBe(
        "This browser's dimensions are too small for this application. Please view it in a desktop browser.",
      );
      expect(document.querySelector('amaze-maze')).toBeNull();
    });

    it('should display a message if the viewport is too narrow', async () => {
      (
        Object.getOwnPropertyDescriptor(windowSpy, 'innerWidth')
          ?.get as jasmine.Spy
      ).and.returnValue(999);

      await testBed.compileComponents();
      fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();

      expect(
        document
          .querySelector('[data-test-id="viewport-size-error"]')
          ?.textContent?.trim(),
      ).toBe(
        "This browser's dimensions are too small for this application. Please view it in a desktop browser.",
      );
      expect(document.querySelector('amaze-maze')).toBeNull();
    });
  });
});
