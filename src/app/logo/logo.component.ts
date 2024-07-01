import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'amaze-logo',
  standalone: true,
  template: `
    <svg
      [attr.width]="sizePx"
      [attr.height]="sizePx"
      viewBox="0 0 565 566"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="482"
        y1="3"
        x2="482"
        y2="83"
        [attr.stroke]="color"
        stroke-width="6"
      />
      <line
        x1="403"
        y1="3"
        x2="403"
        y2="83"
        [attr.stroke]="color"
        stroke-width="6"
      />
      <line
        x1="323"
        y1="3"
        x2="323"
        y2="83"
        [attr.stroke]="color"
        stroke-width="6"
      />
      <path d="M480 3L400 3" [attr.stroke]="color" stroke-width="6" />
      <path d="M320 3L240 3" [attr.stroke]="color" stroke-width="6" />
      <path d="M400 3L320 3" [attr.stroke]="color" stroke-width="6" />
      <line
        x1="3"
        y1="163"
        x2="3"
        y2="243"
        [attr.stroke]="color"
        stroke-width="6"
      />
      <path d="M240 163L160 163" [attr.stroke]="color" stroke-width="6" />
      <path d="M160 163L80 163" [attr.stroke]="color" stroke-width="6" />
      <line
        x1="83"
        y1="83"
        x2="83"
        y2="163"
        [attr.stroke]="color"
        stroke-width="6"
      />
      <line
        x1="3"
        y1="83"
        x2="3"
        y2="163"
        [attr.stroke]="color"
        stroke-width="6"
      />
      <path d="M245 83L165 83" [attr.stroke]="color" stroke-width="6" />
      <line
        x1="83"
        y1="3"
        x2="83"
        y2="83"
        [attr.stroke]="color"
        stroke-width="6"
      />
      <line x1="3" x2="3" y2="83" [attr.stroke]="color" stroke-width="6" />
      <path d="M240 3L160 3" [attr.stroke]="color" stroke-width="6" />
      <path d="M160 3L80 3" [attr.stroke]="color" stroke-width="6" />
      <path d="M485 403L404 403" [attr.stroke]="color" stroke-width="6" />
      <line
        x1="482"
        y1="403"
        x2="482"
        y2="483"
        [attr.stroke]="color"
        stroke-width="6"
      />
      <line
        x1="562"
        y1="83"
        x2="562"
        y2="163"
        [attr.stroke]="color"
        stroke-width="6"
      />
      <path d="M480 323L400 323" [attr.stroke]="color" stroke-width="6" />
      <line
        x1="562"
        y1="163"
        x2="562"
        y2="243"
        [attr.stroke]="color"
        stroke-width="6"
      />
      <line
        x1="562"
        y1="3"
        x2="562"
        y2="83"
        [attr.stroke]="color"
        stroke-width="6"
      />
      <path d="M565 3L480 3" [attr.stroke]="color" stroke-width="6" />
      <line
        x1="83"
        y1="403"
        x2="83"
        y2="483"
        [attr.stroke]="color"
        stroke-width="6"
      />
      <line
        x1="3"
        y1="403"
        x2="3"
        y2="483"
        [attr.stroke]="color"
        stroke-width="6"
      />
      <path d="M160 403L80 403" [attr.stroke]="color" stroke-width="6" />
      <line
        x1="3"
        y1="323"
        x2="3"
        y2="403"
        [attr.stroke]="color"
        stroke-width="6"
      />
      <path d="M160 323L80 323" [attr.stroke]="color" stroke-width="6" />
      <line
        x1="83"
        y1="243"
        x2="83"
        y2="323"
        [attr.stroke]="color"
        stroke-width="6"
      />
      <line
        x1="3"
        y1="243"
        x2="3"
        y2="323"
        [attr.stroke]="color"
        stroke-width="6"
      />
      <path d="M245 243L165 243" [attr.stroke]="color" stroke-width="6" />
      <path d="M165 243L80 243" [attr.stroke]="color" stroke-width="6" />
      <path d="M485 243L404 243" [attr.stroke]="color" stroke-width="6" />
      <line
        x1="323"
        y1="162"
        x2="323"
        y2="243"
        [attr.stroke]="color"
        stroke-width="6"
      />
      <path d="M485 163L404 163" [attr.stroke]="color" stroke-width="6" />
      <path d="M326 163L240 163" [attr.stroke]="color" stroke-width="6" />
      <line
        x1="482"
        y1="83"
        x2="482"
        y2="163"
        [attr.stroke]="color"
        stroke-width="6"
      />
      <path d="M326 83L245 83" [attr.stroke]="color" stroke-width="6" />
      <line
        x1="562"
        y1="243"
        x2="562"
        y2="323"
        [attr.stroke]="color"
        stroke-width="6"
      />
      <path d="M485 323L404 323" [attr.stroke]="color" stroke-width="6" />
      <path d="M400 323L320 323" [attr.stroke]="color" stroke-width="6" />
      <line
        x1="482"
        y1="243"
        x2="482"
        y2="323"
        [attr.stroke]="color"
        stroke-width="6"
      />
      <line
        x1="323"
        y1="243"
        x2="323"
        y2="323"
        [attr.stroke]="color"
        stroke-width="6"
      />
      <line
        x1="562"
        y1="323"
        x2="562"
        y2="403"
        [attr.stroke]="color"
        stroke-width="6"
      />
      <path d="M320 483L240 483" [attr.stroke]="color" stroke-width="6" />
      <path d="M400 483L320 483" [attr.stroke]="color" stroke-width="6" />
      <line
        x1="562"
        y1="483"
        x2="562"
        y2="566"
        [attr.stroke]="color"
        stroke-width="6"
      />
      <path d="M324 403L240 403" [attr.stroke]="color" stroke-width="6" />
      <path d="M404 403L324 403" [attr.stroke]="color" stroke-width="6" />
      <line
        x1="562"
        y1="403"
        x2="562"
        y2="483"
        [attr.stroke]="color"
        stroke-width="6"
      />
      <line
        x1="243"
        y1="243"
        x2="243"
        y2="323"
        [attr.stroke]="color"
        stroke-width="6"
      />
      <line
        x1="243"
        y1="323"
        x2="243"
        y2="403"
        [attr.stroke]="color"
        stroke-width="6"
      />
      <path d="M485 563L399 563" [attr.stroke]="color" stroke-width="6" />
      <line
        x1="482"
        y1="483"
        x2="482"
        y2="563"
        [attr.stroke]="color"
        stroke-width="6"
      />
      <line
        x1="163"
        y1="483"
        x2="163"
        y2="563"
        [attr.stroke]="color"
        stroke-width="6"
      />
      <line
        x1="83"
        y1="483"
        x2="83"
        y2="563"
        [attr.stroke]="color"
        stroke-width="6"
      />
      <line
        x1="3"
        y1="483"
        x2="3"
        y2="563"
        [attr.stroke]="color"
        stroke-width="6"
      />
      <path d="M320 563L240 563" [attr.stroke]="color" stroke-width="6" />
      <path d="M400 563L320 563" [attr.stroke]="color" stroke-width="6" />
      <path d="M240 563L160 563" [attr.stroke]="color" stroke-width="6" />
      <path d="M80 563L0 563" [attr.stroke]="color" stroke-width="6" />
      <path d="M160 563L80 563" [attr.stroke]="color" stroke-width="6" />
      <line
        x1="243"
        y1="483"
        x2="243"
        y2="563"
        [attr.stroke]="color"
        stroke-width="6"
      />
      <path d="M400 323L320 323" [attr.stroke]="color" stroke-width="6" />
    </svg>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.height]': "sizePx + 'px'",
  },
})
export class LogoComponent {
  @Input({ required: true }) sizePx!: number;

  @Input() color = 'black';
}
