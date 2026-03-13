import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { PagoDeDerechosBancoComponent } from '../../../../shared/components/pago-de-derechos-banco/pago-de-derechos-banco.component';

/**
 * Componente que muestra la sección de Pago de Derechos.
 */
@Component({
  selector: 'app-pago-de-derechos',
  standalone: true,
  imports: [
    PagoDeDerechosBancoComponent
  ],
  templateUrl: './pago-de-derechos.component.html',
  styleUrl: './pago-de-derechos.component.scss'
})
export class PagoDeDerechosComponent {
  /**
   * Identificador del procedimiento que se recibe como entrada desde el componente padre.
   * Este valor se utiliza para cargar datos específicos relacionados con el procedimiento,
   * como catálogos o listas asociadas.
   */
  public idProcedimiento: number = 260507;
   /** Referencia al componente 'PagoDeDerechosBancoComponent' en la plantilla.
     * Proporciona acceso a sus métodos y propiedades.
     */
    @ViewChild('PagoDeDerechosBancoComponent', { static: false }) pagoDeDerechosBancoComponent!: PagoDeDerechosBancoComponent;
  
    /** Indica si el botón continuar ha sido activado para ejecutar las validaciones del formulario. */
    @Input() isContinuarTriggered: boolean = false; 
     /**
     * Emite el estado de validez del formulario.
     * Se envía un valor booleano cada vez que cambia la validez del formulario.
     * Permite comunicar al componente padre si el formulario es válido o no.
     */
     @Output() formValidityChange = new EventEmitter<boolean>();
     /**
     * Actualiza el estado local de validez del formulario.
     * Este método recibe el valor emitido por el componente hijo.
     * Se utiliza para saber si el formulario es válido o no desde el componente principal.
     */
     onFormValidityChange(isValid: boolean):void {
      this.formValidityChange.emit(isValid);
    }
    
    /**
     * Marca como 'tocado' el formulario del componente PagoDeDerechosBancoComponent.
     * Se utiliza para activar la visualización de errores de validación en los campos del formulario.
     */
    markTouched(): void {  
      this.pagoDeDerechosBancoComponent.markTouched();
    }

}
