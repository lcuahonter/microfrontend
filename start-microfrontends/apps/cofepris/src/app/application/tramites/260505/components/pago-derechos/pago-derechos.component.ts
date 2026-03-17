import { Component, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagoDeDerechosBancoComponent } from '../../../../shared/components/pago-de-derechos-banco/pago-de-derechos-banco.component';

/**
 * Componente que muestra la sección de Pago de Derechos.
 * Esta sección es común para todos los trámites.
 */
@Component({
  selector: 'app-pago-derechos',
  standalone: true,
  imports: [CommonModule, PagoDeDerechosBancoComponent],
  templateUrl: './pago-derechos.component.html',
  styleUrl: './pago-derechos.component.scss',
})
export class PagoDerechosComponent {

  /** Referencia al componente 'PagoDeDerechosBancoComponent' en la plantilla.
   * Proporciona acceso a sus métodos y propiedades.
   */
  @ViewChild('PagoDeDerechosBancoComponent', { static: false }) pagoDeDerechosBancoComponent!: PagoDeDerechosBancoComponent;

  /** Indica si el botón continuar ha sido activado para ejecutar las validaciones del formulario. */
  @Input() isContinuarTriggered: boolean = false; 

  /**
   * Identificador del procedimiento que se recibe como entrada desde el componente padre.
   * Este valor se utiliza para cargar datos específicos relacionados con el procedimiento,
   * como catálogos o listas asociadas.
   */
  public idProcedimiento: number = 260505;

  /**
   * Marca como 'tocado' el formulario del componente PagoDeDerechosBancoComponent.
   * Se utiliza para activar la visualización de errores de validación en los campos del formulario.
   */
  markTouched(): void {
    this.pagoDeDerechosBancoComponent.markTouched();
  }
}
