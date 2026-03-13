import { Component, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TABLA_ORDEN } from '../../constantes/permiso-sujetos.enum';
import { TercerosRelacionadosComponent } from '../../../../shared/components/terceros-fabricante/terceros-fabricante.component';
import { Tramite260504Store } from '../../../../estados/tramites/260504/tramite260504.store';

/**
 * Componente `TercerosRelacionadosFabricanteComponent`
 *
 * Este componente es responsable de gestionar la interfaz de usuario para mostrar y manejar
 * los datos relacionados con los terceros fabricantes asociados a un trámite.
 *
 * Es un componente independiente (`standalone`) que utiliza el módulo común de Angular (`CommonModule`)
 * y el componente `TercerosRelacionadosComponent` para mostrar información específica de los terceros.
 */
@Component({
  selector: 'app-terceros-relacionados-fabricante',
  standalone: true,
  imports: [CommonModule, TercerosRelacionadosComponent],
  templateUrl: './terceros-relacionados-fabricante.component.html',
  styleUrl: './terceros-relacionados-fabricante.component.scss',
})
export class TercerosRelacionadosFabricanteComponent {

  /** Indica si el botón continuar ha sido activado para ejecutar las validaciones del formulario. */
  @Input() isContinuarTriggered: boolean = false;

  /** Referencia al componente 'TercerosRelacionadosComponent' en la plantilla.
   * Proporciona acceso a sus métodos y propiedades.
   */
  @ViewChild('TercerosRelacionadosComponent', { static: false }) tercerosRelacionadosComponent!: TercerosRelacionadosComponent;


  // Propiedad que almacena la constante TABLA_ORDEN para definir el orden de la tabla.
  tablaOrden = TABLA_ORDEN;
  
  /**
   * Identificador del procedimiento que se recibe como entrada desde el componente padre.
   * Este valor se utiliza para cargar datos específicos relacionados con el procedimiento,
   * como catálogos o listas asociadas.
   */
  public idProcedimiento: number = 260504;

  /** Constructor que inicializa el store del trámite 260504. */
  constructor(
    public store: Tramite260504Store,
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
