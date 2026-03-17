import { Component, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatosDeLaComponent } from '../../../../shared/components/datos-solicitud/datos-solicitud.component';
import { Tramite260504Store } from '../../../../estados/tramites/260504/tramite260504.store';

/**
 * Componente `DatosSolicitudComponent`
 *
 * Este componente es responsable de gestionar y mostrar las secciones relacionadas con los datos de la solicitud
 * en el trámite correspondiente. Es un componente independiente (standalone) que utiliza otros módulos y componentes
 * compartidos para su funcionalidad.
 */
@Component({
  selector: 'app-datos-solicitud',
  standalone: true,
  imports: [CommonModule, DatosDeLaComponent],
  templateUrl: './datos-solicitud.component.html',
  styleUrl: './datos-solicitud.component.scss',
})
export class DatosSolicitudComponent {

  /** Indica si el botón continuar ha sido activado para ejecutar las validaciones del formulario. */
  @Input() isContinuarTriggered: boolean = false;

   /** Referencia al componente 'CertificadoOrigenComponent' en la plantilla.
   * Proporciona acceso a sus métodos y propiedades.
   */
  @ViewChild('DatosDeLaComponent', { static: false }) datosDeLaComponent!: DatosDeLaComponent;

  /**
   * Indica si se debe mostrar la sección de Aviso de Licencia
   */
  isAvisoLicenciaVisible: boolean = true;

  /**
   * Indica si se debe mostrar la sección de Aduanas de Entrada
   */
  isAduanasEntradaVisible: boolean = true;

  /**
     * Indica si el campo esPaginacionVisible es visible.
     */
    esPaginacionVisible: boolean = true;

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

  /** Actualiza la validez del formulario de datos del establecimiento en el store. */
  datosEstabelicimientoFormValidityChange(event: boolean): void {
    this.store.setFormValidity('datosEstablecimiento', event);
  }

  /** Actualiza la validez del formulario de domicilio del establecimiento en el store. */
  domicilioFormValidityChange(event: boolean): void {
    this.store.setFormValidity('domicilioEstablecimiento', event);
  }

  /** Actualiza la validez del formulario de manifiestos en el store. */
  manifiestosFormValidityChange(event: boolean): void {
    this.store.setFormValidity('manifiestos', event);
  }

  /** Actualiza la validez del formulario de representante legal en el store. */
  representanteLegalFormValidityChange(event: boolean): void {
    this.store.setFormValidity('representanteLegal', event);
  }

  /** Ejecuta la validación del formulario desde el componente de datos. */
  validarFormulario(): void {
    this.datosDeLaComponent?.validarClickDeBoton();
  }
}
