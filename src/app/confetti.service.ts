import { Injectable } from '@angular/core';
import confetti from 'canvas-confetti';

@Injectable({
  providedIn: 'root',
})
export class ConfettiService {
  /** Show the confetti animation. */
  start() {
    confetti({
      angle: 45,
      disableForReducedMotion: true,
      gravity: 0.75,
      origin: { x: -0.05, y: 0.8 },
      particleCount: 300,
      scalar: 1.5,
      spread: 80,
      startVelocity: 80,
      ticks: 1000,
    })!;
    confetti({
      angle: 135,
      disableForReducedMotion: true,
      gravity: 0.75,
      origin: { x: 1.05, y: 0.8 },
      particleCount: 300,
      scalar: 1.5,
      spread: 100,
      startVelocity: 80,
      ticks: 1000,
    })!;
  }
}
