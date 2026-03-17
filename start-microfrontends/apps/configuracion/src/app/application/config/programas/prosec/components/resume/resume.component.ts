import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente para mostrar el resumen de fracciones
 */
@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resume.component.html'
})
export class ResumeComponent {
  /**
   * Total de fracciones a mostrar
   */
  @Input() totalFracciones: number = 0;
}
