import { Component, Input, ViewChild } from '@angular/core';

import { DatosDeLaComponent } from '../../../../shared/components/datos-solicitud/datos-solicitud.component';
import { Tramite260507Store } from '../../../../estados/tramites/260507/tramite260507.store';

/**
 * Componente que muestra la sección de Datos de la Solicitud.
 */
@Component({
  selector: 'app-datos-de-la-solicitud',
  standalone: true,
  imports: [
    DatosDeLaComponent
  ],
  templateUrl: './datos-de-la-solicitud.component.html',
  styleUrl: './datos-de-la-solicitud.component.scss'
})
export class DatosDeLaSolicitudComponent {

  /** Indica si el botón continuar ha sido activado para ejecutar las validaciones del formulario. */
    @Input() isContinuarTriggered: boolean = false; 
    
   /** Referencia al componente 'CertificadoOrigenComponent' en la plantilla.
   * Proporciona acceso a sus métodos y propiedades.
   */
  @ViewChild('DatosDeLaComponent', { static: false }) datosDeLaComponent!: DatosDeLaComponent;

  /**
   * Indica si se debe mostrar la sección de Aviso de Licencia
   */
  isAvisoLicenciaVisible: boolean = false;

  /**
   * Indica si se debe mostrar la sección de Aduanas de Entrada
   */
  isAduanasEntradaVisible: boolean = true;
  /**
   * Identificador del procedimiento que se recibe como entrada desde el componente padre.
   * Este valor se utiliza para cargar datos específicos relacionados con el procedimiento,
   * como catálogos o listas asociadas.
   */
  public idProcedimiento: number = 260507;

  /** Constructor que inicializa el store del trámite 260507. */
  constructor(
    public store: Tramite260507Store,
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
