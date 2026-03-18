import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export interface WizardStep {
  label: string;
  icon?: string;
  completado?: boolean;
}

@Component({
  selector: 'vuc-stepper',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="vuc-stepper">
      <!-- Barra de progreso -->
      <div class="vuc-stepper__progress">
        <div class="vuc-stepper__progress-bar"
             [style.width.%]="((pasoActual + 1) / pasos.length) * 100">
        </div>
      </div>

      <!-- Pasos -->
      <div class="vuc-stepper__steps">
        @for (paso of pasos; track paso.label; let i = $index) {
          <div class="vuc-stepper__step"
               [class.active]="i === pasoActual"
               [class.completed]="i < pasoActual || paso.completado"
               [class.clickable]="i < pasoActual"
               (click)="onStepClick(i)">
            <div class="vuc-stepper__step-circle">
              @if (i < pasoActual || paso.completado) {
                <mat-icon>check</mat-icon>
              } @else {
                <span>{{ i + 1 }}</span>
              }
            </div>
            <span class="vuc-stepper__step-label">{{ paso.label }}</span>
          </div>
          @if (i < pasos.length - 1) {
            <div class="vuc-stepper__connector" [class.active]="i < pasoActual"></div>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    .vuc-stepper { margin-bottom: 32px; }
    .vuc-stepper__progress { height: 4px; background: #e0e0e0; border-radius: 2px; margin-bottom: 24px; }
    .vuc-stepper__progress-bar { height: 100%; background: #006847; border-radius: 2px; transition: width 0.4s ease; }
    .vuc-stepper__steps { display: flex; align-items: center; }
    .vuc-stepper__step { display: flex; flex-direction: column; align-items: center; gap: 8px; flex: 0 0 auto; }
    .vuc-stepper__step-circle {
      width: 36px; height: 36px; border-radius: 50%; border: 2px solid #bdbdbd;
      display: flex; align-items: center; justify-content: center;
      font-weight: 600; color: #bdbdbd; background: white; transition: all 0.3s;
    }
    .vuc-stepper__step.active .vuc-stepper__step-circle { border-color: #006847; color: #006847; }
    .vuc-stepper__step.completed .vuc-stepper__step-circle { border-color: #006847; background: #006847; color: white; }
    .vuc-stepper__step-label { font-size: 12px; color: #757575; text-align: center; max-width: 80px; }
    .vuc-stepper__step.active .vuc-stepper__step-label { color: #006847; font-weight: 600; }
    .vuc-stepper__connector { flex: 1; height: 2px; background: #e0e0e0; margin: 0 8px; margin-bottom: 24px; }
    .vuc-stepper__connector.active { background: #006847; }
    .vuc-stepper__step.clickable { cursor: pointer; }
  `],
})
export class StepperComponent {
  @Input() pasos: WizardStep[] = [];
  @Input() pasoActual = 0;
  @Output() pasoClick = new EventEmitter<number>();

  onStepClick(index: number) {
    if (index < this.pasoActual) {
      this.pasoClick.emit(index);
    }
  }
}
