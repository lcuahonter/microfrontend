/**
 * @fileoverview
 * Este archivo define el componente `PasoUnoComponent`, que gestiona la lógica y la interfaz
 * del primer paso del trámite 33302. Incluye la interacción con el store, servicios, y componentes
 * secundarios como `PagoDerechosComponent` y `TipoDeAvisoComponent`.
 * 
 * @module PasoUnoComponent
 * @description
 * Este archivo contiene la implementación del componente `PasoUnoComponent`, que permite
 * gestionar los datos del formulario, manejar eventos de usuario y actualizar el estado
 * del trámite en el store.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PagoDerechosComponent } from '../../components/pago-derechos/pago-derechos.component';
import { SolicitanteComponent } from '@ng-mf/data-access-user';
import { Solicitud32301Service } from '../../services/solicitud.service';
import { TipoDeAvisoComponent } from '../../components/tipoDeAviso/tipoDeAviso.component';
import { Tramite33302Query } from '../../estados/tramite33302.query';

/**
 * @interface TipoDevAviso
 * @description
 * Representa las propiedades relacionadas con los tipos de aviso seleccionados en el formulario.
 * Cada propiedad indica si un tipo específico de aviso ha sido seleccionado por el usuario.
 */
export interface TipoDevAviso {
  /**
   * Indica si se selecciona el tipo 'Clientes/proveedores extranjeros'.
   * @type {boolean}
   */
  foreignClientsSuppliers: boolean;

  /**
   * Indica si se selecciona el tipo 'Proveedores nacionales'.
   * @type {boolean}
   */
  nationalSuppliers: boolean;

  /**
   * Indica si se selecciona 'Modificaciones de miembros'.
   * @type {boolean}
   */
  modificationsMembers: boolean;

  /**
   * Indica si se seleccionan 'Cambios a documentos legales'.
   * @type {boolean}
   */
  changesToLegalDocuments: boolean;

  /**
   * Indica si se selecciona 'Aviso de fusión o escisión'.
   * @type {boolean}
   */
  mergerOrSplitNotice: boolean;

  /**
   * Indica si se selecciona 'Adición de fracciones'.
   * @type {boolean}
   */
  additionFractions: boolean;

  /**
   * Indica si se selecciona 'Presenten'.
   * @type {boolean}
   */
  presenten: boolean;

  /**
   * Indica si se selecciona 'Contratados'.
   * @type {boolean}
   */
  contratados: boolean;

  /**
   * Indica si se selecciona 'Expirado'.
   * @type {boolean}
   */
  expirado: boolean;

  /**
   * Indica si se selecciona 'Derechos'.
   * @type {boolean}
   */
  derechos: boolean;
}

/**
 * @class PasoUnoComponent
 * @description
 * Componente que gestiona la lógica y la interfaz del primer paso del trámite 33302.
 * Permite la interacción con el formulario, la actualización del estado en el store,
 * y la comunicación con servicios para obtener y guardar datos.
 */
@Component({
  selector: 'app-paso-uno',
  standalone: true,
  imports: [
    CommonModule,
    PagoDerechosComponent,
    SolicitanteComponent,
    TipoDeAvisoComponent,
  ],
  templateUrl: './paso-uno.component.html',
})
export class PasoUnoComponent implements OnInit, OnDestroy {
  /**
   * Índice de la pestaña activa en el formulario.
   * @type {number}
   */
  indice: number = 1;

  /**
 * @property {TipoDevAviso} datosInputCheck
 * @description
 * Objeto que contiene los datos relacionados con los tipos de aviso seleccionados en el formulario.
 * Cada propiedad representa una opción seleccionada por el usuario en el formulario.
 */
datosInputCheck: TipoDevAviso = {
  /**
   * Indica si se selecciona el tipo 'Clientes/proveedores extranjeros'.
   * @type {boolean}
   */
  foreignClientsSuppliers: false,

  /**
   * Indica si se selecciona el tipo 'Proveedores nacionales'.
   * @type {boolean}
   */
  nationalSuppliers: false,

  /**
   * Indica si se selecciona 'Modificaciones de miembros'.
   * @type {boolean}
   */
  modificationsMembers: false,

  /**
   * Indica si se seleccionan 'Cambios a documentos legales'.
   * @type {boolean}
   */
  changesToLegalDocuments: false,

  /**
   * Indica si se selecciona 'Aviso de fusión o escisión'.
   * @type {boolean}
   */
  mergerOrSplitNotice: false,

  /**
   * Indica si se selecciona 'Adición de fracciones'.
   * @type {boolean}
   */
  additionFractions: false,

  /**
   * Indica si se selecciona 'Presenten'.
   * @type {boolean}
   */
  presenten: false,

  /**
   * Indica si se selecciona 'Contratados'.
   * @type {boolean}
   */
  contratados: false,

  /**
   * Indica si se selecciona 'Expirado'.
   * @type {boolean}
   */
  expirado: false,

  /**
   * Indica si se selecciona 'Derechos'.
   * @type {boolean}
   */
  derechos: false,
};
  /**
   * Estado actual de la consulta para el componente.
   * @type {ConsultaioState}
   */
  public consultaState!: ConsultaioState;

  /**
   * Indica si los datos de respuesta están disponibles.
   * @type {boolean}
   */
  public esDatosRespuesta: boolean = false;

  /**
   * Indica si el formulario está deshabilitado.
   * @type {boolean}
   */
  formularioDeshabilitado: boolean = false;

  /**
   * Sujeto utilizado para notificar la destrucción del componente.
   * Se emplea en combinación con `takeUntil` para cancelar suscripciones activas
   * y evitar fugas de memoria cuando el componente se destruye.
   * @private
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor del componente.
   * 
   * @param {ConsultaioQuery} consultaQuery - Servicio para obtener el estado de la consulta.
   * @param {Solicitud32301Service} solicitudService - Servicio para gestionar los datos del trámite.
   * @param {Tramite33302Query} Tramite33302Query - Servicio para obtener el estado del trámite.
   */
  constructor(
    private consultaQuery: ConsultaioQuery,
    private solicitudService: Solicitud32301Service,
    private Tramite33302Query: Tramite33302Query,
  ) {}

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * 
   * - Se suscribe al observable `selectConsultaioState$` para obtener el estado actual de la consulta.
   * - Si el estado indica que se debe actualizar (`update` es verdadero), se llama a `guardarDatosFormulario()`.
   * - En caso contrario, se activa la bandera `esDatosRespuesta`.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
        })
      )
      .subscribe();

    if (this.consultaState.update) {
      this.formularioDeshabilitado = this.consultaState.readonly;
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }

    this.Tramite33302Query.select()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((state) => {
        this.datosInputCheck = state as unknown as TipoDevAviso;
      });
  }

  /**
   * Guarda los datos del formulario obteniendo la información de los productores.
   * 
   * Realiza una solicitud al servicio `Solicitud32301Service` para obtener los datos
   * y actualiza el estado del store con la respuesta.
   */
  guardarDatosFormulario(): void {
    this.solicitudService
      .getRegistroTomaMuestrasMercanciasData()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.solicitudService.actualizarEstadoFormulario(resp);
        }
      });
  }

  /**
   * Método que selecciona la pestaña activa basada en el índice proporcionado.
   * @param {number} i - El índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Método que actualiza los valores de `datosInputCheck` cuando se seleccionan diferentes opciones en el formulario.
   * @param {TipoDevAviso} event - Los valores seleccionados por el usuario para los tipos de aviso.
   */
  getValoreEnable(event: TipoDevAviso): void {
    this.datosInputCheck = event;
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente es destruido.
   * Emite una notificación y completa el observable `destroyNotifier$` para limpiar suscripciones y evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}