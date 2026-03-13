import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';

import { map, takeUntil } from 'rxjs/operators';

import {
  ConsultaioQuery,
  ConsultaioState,
  PersonaTerceros,
} from '@ng-mf/data-access-user';

import { SeccionLibStore } from '@libs/shared/data-access-user/src';

import { ConsultaDatosService } from '../../servicios/consulta-datos.servicio';

import { DatosSolicitudService } from '../../../../shared/services/datos-solicitud.service';
import { Tramite240118Query } from '../../estados/tramite240118Query.query';
import { Tramite240118Store } from '../../estados/tramite240118Store.store';


/**
 * @title Paso Uno
 * @description Componente que representa el primer paso del flujo de solicitud. Contiene los datos del solicitante, datos del trámite, terceros relacionados y pago de derechos.
 * @summary Agrupa los subcomponentes necesarios para capturar la información inicial del trámite.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
})
export class PasoUnoComponent implements OnDestroy, OnInit {
  /**
   * Indica si existen datos de respuesta para mostrar en el formulario.
   * @type {boolean}
   */
  public esDatosRespuesta: boolean = false;

  /**
   * @property {ConsultaioState} consultaState - Estado actual relacionado con la consulta.
   */
  public consultaState!: ConsultaioState;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Lista de personas relacionadas con el trámite.
   * @type {PersonaTerceros[]}
   */
  public personas: PersonaTerceros[] = [];

  /**
   * @description Constructor del componente.
   * Inicializa el componente y establece el índice de la pestaña seleccionada.
   */
  formularioDeshabilitado: boolean = false;

  /**
   * @property indice
   * @description Indica el índice de la pestaña seleccionada dentro del paso del formulario.
   * @type {number | undefined}
   */
  public indice: number | undefined = 1;

  /**
   * @property destroyNotifier$
   * @description Notificador observable para cancelar las suscripciones activas cuando se destruye el componente.
   * Ayuda a prevenir fugas de memoria.
   * @type {Subject<void>}
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Inicializa el componente con los servicios requeridos para la gestión de estado y manejo de datos.
   *
   * @param route - Servicio ActivatedRoute para acceder a parámetros de ruta y parámetros de consulta
   * @param seccionStore - SeccionLibStore para gestionar actualizaciones de estado relacionadas con secciones
   * @param consultaDatosService - Servicio para consulta de datos y gestión de estado del formulario
   * @param consultaQuery - ConsultaioQuery para acceder a observables de estado de consulta
   * @param tramite240118Query - Tramite240118Query para acceder al estado específico del procedimiento
   * @param tramite240118Store - Tramite240118Store para actualizar el estado específico del procedimiento
   * @param datosSolicitudService - Servicio para obtener y gestionar datos de solicitud
   * 
   * @description
   * Este constructor inyecta los servicios necesarios para gestionar el estado del procedimiento y consulta.
   * Establece las dependencias requeridas para la gestión de formularios, recuperación de datos y sincronización de estado.
   */
  constructor(
    private route: ActivatedRoute,
    private seccionStore: SeccionLibStore,
    private consultaDatosService: ConsultaDatosService,
    private consultaQuery: ConsultaioQuery,
    public tramite240118Query: Tramite240118Query,
    private tramite240118Store: Tramite240118Store,
    private datosSolicitudService: DatosSolicitudService
  ) {
    this.tramite240118Store = tramite240118Store;
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Configura las suscripciones para el estado de consulta y los parámetros de ruta.
   * Gestiona el estado del formulario basado en los permisos de consulta y carga datos cuando es apropiado.
   *
   * @returns {void}
   */
  ngOnInit(): void {
        this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
          this.esFormularioSoloLectura = seccionState.readonly;
          if (this.consultaState.update) {
            this.guardarDatosFormulario();
          } else {
            this.esDatosRespuesta = true;
          }
        })
      )
      .subscribe();

    this.route.queryParams
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((tab) => {
        this.indice = Number(tab['indice'] || 1);
      });
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
          if (this.consultaState.update) {
            this.guardarDatosFormulario();
            this.formularioDeshabilitado = false;
          } else if (this.consultaState.readonly) {
            this.formularioDeshabilitado = true;
          }
        })
      )
      .subscribe();
  }
  /**
   * Guarda los datos del formulario obtenidos del servicio.
   * Este método se suscribe al servicio para obtener los datos de la solicitud
   * y actualiza el estado del formulario con la información recibida.
   * @method guardarDatosFormulario
   */
  guardarDatosFormulario(): void {
    this.consultaDatosService
      .getDatosDeLaSolicitudData()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.personas =
            (resp as { personas?: PersonaTerceros[] }).personas || [];
          this.consultaDatosService.actualizarEstadoFormulario(resp);
        }
      });
  }
  /**
   * Evento emitido al cambiar de pestaña.
   * @event tabChanged
   * @type {EventEmitter<number>}
   */
  @Output() tabChanged = new EventEmitter<number>();

  /**
   * Cambia el índice de la pestaña seleccionada.
   * @method seleccionaTab
   * @param {number} i - El índice de la pestaña a seleccionar.
   */
  public seleccionaTab(i: number): void {
    this.indice = i;
    this.tabChanged.emit(i);
  }

  /**
   * Maneja la limpieza de recursos antes de destruir el componente.
   * Completa el Subject `destroyNotifier$` para evitar fugas de memoria.
   * @method ngOnDestroy
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
