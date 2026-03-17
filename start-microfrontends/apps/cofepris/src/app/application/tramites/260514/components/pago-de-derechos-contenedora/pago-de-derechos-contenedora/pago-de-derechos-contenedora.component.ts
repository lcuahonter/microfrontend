import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagoDeDerechosBancoComponent } from '../../../../../shared/components/pago-de-derechos-banco/pago-de-derechos-banco.component';

/**
 * @component PagoDeDerechosContenedoraComponent
 * @description Componente contenedor que utiliza el componente `PagoDeDerechosBancoComponent`
 * para gestionar la funcionalidad relacionada con el pago de derechos.
 * Este componente interactúa con el estado del trámite a través del store `Tramite260210Store`.
 */
@Component({
  selector: 'app-pago-de-derechos-contenedora',
  standalone: true,
  imports: [CommonModule, PagoDeDerechosBancoComponent],
  templateUrl: './pago-de-derechos-contenedora.component.html',
  styleUrl: './pago-de-derechos-contenedora.component.scss',
})
export class PagoDeDerechosContenedoraComponent {
  /**
   * Identificador del procedimiento que se recibe como entrada desde el componente padre.
   * Este valor se utiliza para cargar datos específicos relacionados con el procedimiento,
   * como catálogos o listas asociadas.
   */
  public idProcedimiento: number = 260514;

  @ViewChild(PagoDeDerechosBancoComponent)
  bancoComponent!: PagoDeDerechosBancoComponent;
 
  @Input() isContinuarTriggered: boolean = false; 
  
  /**
   * Marca como 'tocado' el formulario del componente PagoDeDerechosBancoComponent.
   * Se utiliza para activar la visualización de errores de validación en los campos del formulario.
   */
  markTouched(): void {
    this.bancoComponent.markTouched();
  }
  /**
   * Llama al método validarFormularios del componente banco.
   * Retorna true si el formulario es válido, false en caso contrario.
   */
  public validarFormulariosBanco(): boolean {
    return this.bancoComponent?.formularioSolicitudValidacion() ?? false;
  }
}
