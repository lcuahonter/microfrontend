/**
 * Componente que representa la página para capturar la solicitud.
 */

import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, SolicitanteComponent } from '@ng-mf/data-access-user';
import { Subject, takeUntil } from 'rxjs';
import { DatosDelCertificadoComponent } from '../../components/datos-del-certificado/datos-del-certificado.component';
import { DatosDelDestinatarioComponent } from '../../components/datos-del-destinatario/datos-del-destinatario.component';
import { DetallesDelTransporteComponent } from '../../components/detalles-del-transporte/detalles-del-transporte.component';
import { DomicilioDelDestinatarioComponent } from '../../components/domicilio-del-destinatario/domicilio-del-destinatario.component';
import { SgpCertificadoService } from '../../services/sgp-certificado/sgp-certificado.service';
import { Tramite110209Query } from '../../estados/queries/tramite110209.query';
import { TransporteComponent } from '../../components/transporte/transporte.component';

/**
 * Componente que representa la página para capturar la solicitud.
 */

@Component({
  selector: 'app-capturar-solicitud',
  templateUrl: './capturar-solicitud.component.html'
})
/**
 * Componente que representa la página para capturar la solicitud.
 */
export class CapturarSolicitudComponent implements OnInit, OnDestroy {
  /**
   * Índice del tab seleccionado.
   */
  @Input() indice: number = 1;

  /**
   * Evento que se emite cuando se modifica la captura.
   */
  @Output() modificarEventCapturar: EventEmitter<boolean> = new EventEmitter<boolean>(true);

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /**
   * Estado actual de la consulta obtenido desde el store global.
   * Contiene la información relevante para el flujo del trámite en este paso.
   */
  public consultaState!:ConsultaioState;

  /** Subject para notificar la destrucción del componente. */
  public destroyNotifier$: Subject<void> = new Subject();
  /**
   * @property {SolicitanteComponent} solicitanteComponent
   * @description
   * Referencia al componente hijo `SolicitanteComponent` mediante ViewChild.
   * Permite acceder a los métodos y propiedades del formulario del solicitante.
   */
  @ViewChild('solicitante') solicitanteComponent!: SolicitanteComponent;

  /**
   * @property {DetallesDelTransporteComponent} detallesDelTransporteComponent
   * @description
   * Referencia al componente hijo `DetallesDelTransporteComponent` mediante ViewChild.
   * Permite acceder a los métodos y propiedades del formulario de detalles del transporte.
   */
  @ViewChild('detallesDelTransporte') detallesDelTransporteComponent!: DetallesDelTransporteComponent;

  /**
   * @property {DatosDelDestinatarioComponent} datosDelDestinatarioComponent
   * @description
   * Referencia al componente hijo `DatosDelDestinatarioComponent` mediante ViewChild.
   * Permite acceder a los métodos y propiedades del formulario de datos del destinatario.
   */
  @ViewChild('datosDelDestinatario') datosDelDestinatarioComponent!: DatosDelDestinatarioComponent;

  /**
   * @property {DomicilioDelDestinatarioComponent} domicilioDelDestinatarioComponent
   * @description
   * Referencia al componente hijo `DomicilioDelDestinatarioComponent` mediante ViewChild.
   * Permite acceder a los métodos y propiedades del formulario de domicilio del destinatario.
   */
  @ViewChild('domicilioDelDestinatario') domicilioDelDestinatarioComponent!: DomicilioDelDestinatarioComponent;

  /**
   * @property {TransporteComponent} transporteComponent
   * @description
   * Referencia al componente hijo `TransporteComponent` mediante ViewChild.
   * Permite acceder a los métodos y propiedades del formulario de transporte.
   */
  @ViewChild('transporte') transporteComponent!: TransporteComponent;

  /**
   * @property {DatosDelCertificadoComponent} datosDelCertificadoComponent
   * @description
   * Referencia al componente hijo `DatosDelCertificadoComponent` mediante ViewChild.
   * Permite acceder a los métodos y propiedades del formulario de datos del certificado.
   */
  @ViewChild('datosDelCertificado') datosDelCertificadoComponent!: DatosDelCertificadoComponent;

  /**
   * Constructor del componente.
   * @param certificadoService Servicio para la gestión de certificados SGP.
   * @param consultaQuery Servicio para consultar el estado global de la solicitud.
   */  
  constructor(
      @Inject(SgpCertificadoService)
      public certificadoService: SgpCertificadoService,
      private consultaQuery: ConsultaioQuery,
      private tramite110209Query: Tramite110209Query 
    ) {
  // Constructor vacío: La inicialización se realizará en métodos específicos según sea necesario.
    }


    /**
     * Método del ciclo de vida que se ejecuta al inicializar el componente.
     *
     * Suscribe al observable `selectConsultaioState$` para obtener el estado actual de la consulta
     * y lo asigna a la propiedad `consultaState`. Dependiendo del valor de `update` en el estado,
     * decide si debe cargar los datos del formulario o marcar que los datos de respuesta están listos.
     *
     * @returns {void}
     */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((seccionState) => {
        this.consultaState = seccionState;

        if (this.consultaState.update) {
          this.guardarDatosFormulario();
        } else {
          this.esDatosRespuesta = true;
        }
      });
  }

    /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {    
    this.tramite110209Query.selectTramite110209$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(() => {
        this.esDatosRespuesta = true;
      });
  }

  /**
   * Selecciona el tab especificado por el índice.
   * @param {number} i - El índice del tab a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }
  /**
   * @method validarFormularios
   * @description
   * Valida todos los formularios de los componentes hijos en el orden siguiente:
   * - Solicitante
   * - Detalles del transporte
   * - Datos del destinatario
   * - Domicilio del destinatario
   * - Transporte
   * - Datos del certificado
   * 
   * Para cada componente, verifica si está disponible y si su formulario es válido.
   * Si algún formulario es inválido, marca sus controles como "tocados" para mostrar los errores de validación.
   * Si algún componente no está disponible o su formulario es inválido, establece `isValid` a `false`.
   * 
   * @returns {boolean} `true` si todos los formularios son válidos, `false` si alguno no lo es o si falta algún componente.
   */
  public validarFormularios(): boolean {
    let isValid = true;

    if (this.solicitanteComponent?.form) {
      if (this.solicitanteComponent.form.invalid) {
        this.solicitanteComponent.form.markAllAsTouched();
        isValid = false;
      }
    } else {
      isValid = false;
    }

    if (this.datosDelDestinatarioComponent) {
      if (!this.datosDelDestinatarioComponent.validarFormulario()) {
        isValid = false;
      }
    } else {
      isValid = false;
    }

    if (this.domicilioDelDestinatarioComponent) {
      if (!this.domicilioDelDestinatarioComponent.validarFormulario()) {
        isValid = false;
      }
    } else {
      isValid = false;
    }

    if (this.transporteComponent) {
      if (!this.transporteComponent.validarFormulario()) {
        isValid = false;
      }
    } else {
      isValid = false;
    }

    if (this.datosDelCertificadoComponent) {
      if (!this.datosDelCertificadoComponent.validarFormulario()) {
        isValid = false;
      }
    } else {
      isValid = false;
    }

    return isValid;
  }

  /**
   * Método del ciclo de vida que se ejecuta al destruir el componente.
   * Libera las suscripciones y recursos asociados para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}