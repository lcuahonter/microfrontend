import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultarFraccionesComponent } from '../consultar-fracciones/consultar-fracciones.component';
import { ResumeComponent } from '../resume/resume.component';

/**
 * Componente principal para la consulta de fracciones
 * Integra el resumen de totales y el formulario de búsqueda/listado
 */
@Component({
  selector: 'app-consulta-de-fracciones',
  standalone: true,
  imports: [CommonModule, ResumeComponent, ConsultarFraccionesComponent],
  templateUrl: './consulta-de-fracciones.component.html'
})
export class ConsultaDeFraccionesComponent {
  /**
   * Evento para cerrar el modal o cancelar la operación
   */
  @Output() cancelEmitter = new EventEmitter<void>();

  /**
   * Total de fracciones obtenidas
   */
  totalFracciones: number = 0;

  /**
   * Maneja el cambio en el total de fracciones
   */
  onTotalFraccionesChange(total: number): void {
    this.totalFracciones = total;
  }

  /**
   * Propaga el evento de cancelación
   */
  onCancel(): void {
    this.cancelEmitter.emit();
  }
}
