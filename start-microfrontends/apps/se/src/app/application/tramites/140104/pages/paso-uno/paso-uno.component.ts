/**
 * @fileoverview Componente del primer paso para el trámite de ampliación de servicios IMMEX.
 *
 * Este componente maneja la lógica del primer paso del wizard de registro,
 * incluyendo la selección de pestañas, validación de formularios y gestión del estado.
 *
 * @component PasoUnoComponent
 * @selector app-paso-uno
 * @templateUrl ./paso-uno.component.html
 */

import { ConsultaioQuery, ConsultaioState, RegistroSolicitudService } from '@ng-mf/data-access-user';
import { Subject, takeUntil } from 'rxjs';
import { CancelacionDeSolicitudComponent } from '../../components/cancelacion-de-solicitud/cancelacion-de-solicitud.component';
import { Component } from '@angular/core';
import { DesistimientoStore } from '../../estados/desistimiento-de-permiso.store';
import { DetalleDelAdapter } from '../../adapters/detalle-del-permiso.adapter';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';

/**
 * Componente PasoUnoComponent.
 *
 * Este componente representa el primer paso de un flujo de trámites.
 * Contiene la lógica para manejar la selección de pestañas.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
})
export class PasoUnoComponent implements OnInit, OnDestroy {
  /**
   * Índice de la pestaña seleccionada actualmente.
   * Valor inicial: 1.
   */
  indice: number = 1;

  /**
   * Indica si los datos de respuesta están disponibles.
   * Valor inicial: false.
   */

  public esDatosRespuesta: boolean = false;

  /**
   * Referencia al componente CancelacionDeSolicitudComponent.
   *
   * Se utiliza para acceder a las propiedades y métodos del componente hijo,
   * permitiendo la validación y manipulación de sus datos desde el componente padre.
   *
   * @type {CancelacionDeSolicitudComponent | undefined}
   * @memberof PasoUnoComponent
   */
  @ViewChild('CancelacionDeSolicitudComponent', { static: false })
  CancelacionDeSolicitudComponent: CancelacionDeSolicitudComponent | undefined;

  /**
   * Estado de la consulta actual.
   *
   * Este estado se obtiene a través de ConsultaioQuery y contiene
   * información sobre el estado actual de la consulta y si requiere
   * actualización de datos.
   *
   * @property {ConsultaioState} consultaState
   */

  public consultaState!: ConsultaioState;

  /**
   * Subject para notificar la destrucción del componente.
   * Se utiliza para limpiar suscripciones y evitar fugas de memoria.
   */

  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * Cambia el índice de la pestaña seleccionada.
   *
   * @param i - El índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Constructor del componente PasoUnoComponent.
   *
   * Inicializa las dependencias necesarias para el funcionamiento del componente,
   * incluyendo servicios para consultas y manejo de datos de ampliación de servicios.
   *
   * @constructor
   * @param {ConsultaioQuery} consultaQuery - Servicio de consulta para obtener el estado actual
   * @param {ServicioDeMensajesService} ServicioDeMensajesService - Servicio para manejar mensajes
   */
  constructor(
    private consultaQuery: ConsultaioQuery,
    private registroSolicitudService: RegistroSolicitudService,
    private tramiteStore: DesistimientoStore
  ) {
    // Constructor: La inicialización se realizará en métodos específicos según sea necesario.
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   *
   * Se suscribe al estado de consulta para monitorear cambios y determinar
   * si es necesario cargar datos existentes o inicializar con datos vacíos.
   * Maneja la lógica de actualización del estado del componente.
   *
   * @method ngOnInit
   * @returns {void} Este método no retorna ningún valor
   *
   * @implements {OnInit}
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$.subscribe((seccionState) => {
      this.consultaState = seccionState;
      if (this.consultaState.update) {
        this.guardarDatosFormulario(this.consultaState?.id_solicitud);
      } else {
        this.esDatosRespuesta = true;
      }
    });
  }
  /**
   * Guarda y actualiza los datos del formulario desde el servicio.
   *
   * Obtiene los datos más recientes del servicio de ampliación de servicios
   * y actualiza el estado del formulario. Establece la bandera de datos
   * de respuesta cuando la operación es exitosa.
   *
   * @method guardarDatosFormulario
   * @returns {void} Este método no retorna ningún valor
   */
  guardarDatosFormulario(idSolicitud:string): void {
    this.registroSolicitudService.parcheOpcionesPrellenadas(140104, Number(idSolicitud)).pipe(
      takeUntil(this.destroyNotifier$)
    ).subscribe((res) => {
      if (res && res.datos) {
        DetalleDelAdapter.patchToStore(res.datos, this.tramiteStore);
        this.esDatosRespuesta = true;
      }
    });
  }

  /**
   * Valida todos los formularios del paso uno.
   *
   * Este método valida principalmente el formulario de solicitante que es el único
   * obligatorio. Los otros formularios solo se validan si están disponibles.
   *
   * @returns {boolean} `true` si todos los formularios son válidos, `false` en caso contrario.
   */
  public validarTodosLosFormularios(): boolean {
    let allFormsValid = true;
    if (this.indice === 1 && this.CancelacionDeSolicitudComponent?.cuerpoTablaCancelacion.length === 0) {
      allFormsValid = false;
    }
    if (this.indice === 2) {
      if (this.CancelacionDeSolicitudComponent?.cuerpoTablaCancelacion.length === 0) {
        allFormsValid = false;
      }
    }
    return allFormsValid;
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   *
   * Emite un valor en el observable destroyNotifier$ para notificar a todas
   * las suscripciones que deben completarse, evitando fugas de memoria.
   *
   * @method ngOnDestroy
   * @returns {void} Este método no retorna ningún valor
   *
   * @implements {OnDestroy}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
