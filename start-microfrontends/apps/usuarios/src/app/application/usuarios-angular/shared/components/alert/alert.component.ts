import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'vuc-alert',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    @if (visible) {
      <div class="vuc-alert" [class]="'vuc-alert--' + type">
        <mat-icon class="vuc-alert__icon">{{ iconMap[type] }}</mat-icon>
        <div class="vuc-alert__content">
          <strong *ngIf="title" class="vuc-alert__title">{{ title }}</strong>
          <span class="vuc-alert__msg"><ng-content></ng-content></span>
        </div>
        @if (closable) {
          <button mat-icon-button class="vuc-alert__close" (click)="close()">
            <mat-icon>close</mat-icon>
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
    .vuc-alert--info    { background: #e3f2fd; color: #1565c0; border-left: 4px solid #1976d2; }
    .vuc-alert--success { background: #e8f5e9; color: #2e7d32; border-left: 4px solid #43a047; }
    .vuc-alert--warning { background: #fff8e1; color: #e65100; border-left: 4px solid #fb8c00; }
    .vuc-alert--error   { background: #ffebee; color: #b71c1c; border-left: 4px solid #e53935; }
    .vuc-alert__icon { margin-top: 2px; }
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
    info: 'info',
    success: 'check_circle',
    warning: 'warning',
    error: 'error',
  };

  close() {
    this.visible = false;
    this.closed.emit();
  }
}
