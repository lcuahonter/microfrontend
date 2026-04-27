import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'vuc-alert',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    @if (visible) {
      <div class="vuc-alert" [class]="'vuc-alert--' + type">
        <i class="bi" [class]="iconMap[type]" class="vuc-alert__icon"></i>
        <div class="vuc-alert__content">
          <strong *ngIf="title" class="vuc-alert__title">{{ title }}</strong>
          <span class="vuc-alert__msg"><ng-content></ng-content></span>
        </div>
        @if (closable) {
          <button class="btn btn-sm btn-link p-0 vuc-alert__close" (click)="close()">
            <i class="bi bi-x-circle"></i>
          </button>
        }
      </div>
    }
  `,
  styles: [`
    .vuc-alert {
      display: flex; align-items: flex-start; gap: 12px;
      padding: 12px 16px; border-radius: 8px; margin-bottom: 16px;
    }
    .vuc-alert--info    { background: #dff0d8; color: #31708f; border-left: 4px solid #2c7be5; }
    .vuc-alert--success { background: #dff0d8; color: #3c763d; border-left: 4px solid #2e7d32; }
    .vuc-alert--warning { background: #fcf8e3; color: #8a6d3b; border-left: 4px solid #e65100; }
    .vuc-alert--error   { background: #f2dede; color: #a94442; border-left: 4px solid #a94442; }
    .vuc-alert__icon { margin-top: 2px; font-size: 18px; }
    .vuc-alert__content { flex: 1; }
    .vuc-alert__title { display: block; font-weight: 600; margin-bottom: 4px; }
    .vuc-alert__close { margin-left: auto; }
  `],
})
export class AlertComponent {
  @Input() type: 'info' | 'success' | 'warning' | 'error' = 'info';
  @Input() title = '';
  @Input() closable = false;
  @Output() closed = new EventEmitter<void>();

  visible = true;

  readonly iconMap = {
    info: 'bi-info-circle',
    success: 'bi-check-circle',
    warning: 'bi-exclamation-triangle',
    error: 'bi-x-circle',
  };

  close() {
    this.visible = false;
    this.closed.emit();
  }
}
