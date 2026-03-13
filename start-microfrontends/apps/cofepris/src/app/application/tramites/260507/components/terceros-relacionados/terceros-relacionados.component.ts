import { Component, Input, ViewChild } from '@angular/core';

import { TABLA_ORDEN } from '../../constantes/importacion-plafest.enum';
import { TercerosRelacionadosComponent } from '../../../../shared/components/terceros-fabricante/terceros-fabricante.component';
import { Tramite260507Store } from '../../../../estados/tramites/260507/tramite260507.store';

/**
 * Componente que muestra la sección de Terceros Relacionados.
 * Esta sección es común para todos los trámites.
 */
@Component({
  selector: 'app-terceros-relacionados',
  standalone: true,
  imports: [
    TercerosRelacionadosComponent
  ],
  templateUrl: './terceros-relacionados.component.html',
  styleUrl: './terceros-relacionados.component.scss'
})
export class TercerosRelacionados260507Component {

  /** Indica si el botón continuar ha sido activado para ejecutar las validaciones del formulario. */
    @Input() isContinuarTriggered: boolean = false; 
 
  /** Referencia al componente 'TercerosRelacionadosComponent' en la plantilla.
   * Proporciona acceso a sus métodos y propiedades.
   */
  @ViewChild('TercerosRelacionadosComponent', { static: false }) tercerosRelacionadosComponent!: TercerosRelacionadosComponent;

  /**
   * Constante que define el orden de la tabla para los terceros relacionados.
   * Se utiliza para mostrar la tabla en el componente TercerosRelacionadosComponent.
   */
  tablaOrden = TABLA_ORDEN;
  /**
   * Identificador del procedimiento que se recibe como entrada desde el componente padre.
   * Este valor se utiliza para cargar datos específicos relacionados con el procedimiento,
   * como catálogos o listas asociadas.
   */
  public idProcedimiento: number = 260507;

  /** Constructor que inicializa el store del trámite 2605047. */
    constructor(
      public store: Tramite260507Store,
    ) {
      //
    }

  /** Maneja el evento de validez de tabla y actualiza el estado correspondiente en el store. */
  onTableValidEvent(event: string): void {
    if (event === 'fabricante') {
      this.store.setFormValidity('fabricanteTablaValid', true);
    }
    if (event === 'formulador') {
      this.store.setFormValidity('formuladorTablaValid', true);
    }
    if (event === 'proveedor') {
      this.store.setFormValidity('proveedorTablaValid', true);
    }
    this.validarFormulario();
  }

  /** Ejecuta la validación marcando los campos de terceros relacionados como tocados. */
  validarFormulario(): void {
    this.tercerosRelacionadosComponent.markTouched();
}
}
