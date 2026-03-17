import { Component, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TercerosRelacionadosComponent } from '../../../../shared/components/terceros-fabricante/terceros-fabricante.component';
import { Tramite260505Store } from '../../../../estados/tramites/260505/tramite260505.store';

/**
 * Componente que muestra la sección de Terceros Relacionados.
 * Esta sección es común para todos los trámites.
 */
@Component({
  selector: 'app-terceros-relacionados-fabricante',
  standalone: true,
  imports: [CommonModule, TercerosRelacionadosComponent],
  templateUrl: './terceros-relacionados-fabricante.component.html',
  styleUrl: './terceros-relacionados-fabricante.component.scss',
})
export class TercerosRelacionadosFabricanteComponent {
   /** Referencia al componente 'TercerosRelacionadosComponent' en la plantilla.
   * Proporciona acceso a sus métodos y propiedades.
   */
  @ViewChild('TercerosRelacionadosComponent', { static: false }) tercerosRelacionadosComponent!: TercerosRelacionadosComponent;

  /**
   * Identificador del procedimiento que se recibe como entrada desde el componente padre.
   * Este valor se utiliza para cargar datos específicos relacionados con el procedimiento,
   * como catálogos o listas asociadas.
   */
  public idProcedimiento: number = 260505;

  /** Indica si el botón continuar ha sido activado para ejecutar las validaciones del formulario. */
  @Input() isContinuarTriggered: boolean = false;

  /** Constructor que inicializa el store del trámite 260504. */
  constructor(
    public store: Tramite260505Store,
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
