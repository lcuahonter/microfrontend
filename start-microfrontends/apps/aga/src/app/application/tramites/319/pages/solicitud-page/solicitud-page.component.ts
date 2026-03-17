import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  ERROR_PERIODO_ALERT,
  MSG_REGISTRO_EXITOSO,
  PASOS,
} from '../../constantes/operaciones-de-comercio-exterior.enum';

import { Observable, Subject, catchError, map, of, takeUntil, tap } from 'rxjs';

import {
  AVISO_CONTRNIDO,
  AccionBoton,
  AlertComponent,
  BtnContinuarComponent,
  CategoriaMensaje,
  DatosPasos,
  ERROR_FORMA_ALERT,
  ErrorModelo,
  LoginQuery,
  Notificacion,
  NotificacionesComponent,
  SeccionLibState,
  SeccionLibStore
} from '@ng-mf/data-access-user';
import { CodigoRespuesta } from '../../../../core/enums/aga-core-enum';
import { CommonModule } from '@angular/common';
import { FinalDataToSend } from '../../models/tramite319-state.model';
import { GuardarSolicitudT319 } from '../../models/guardar-solicitud.model';
import { ListaPasosWizard } from '@libs/shared/data-access-user/src/core/models/shared/datos-generales.model';
import { OperacionService } from '../../services/operacion.service';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { ResultadoSolicitud } from '../../models/ResultadoSolicitud';
import { Tramite319Query } from '../../estados/tramite319Query.query';
import { Tramite319Store } from '../../estados/tramite319Store.store';
import { WizardComponent } from '@libs/shared/data-access-user/src/tramites/components/wizard/wizard.component';

/** Representa la forma cruda que puede venir desde el backend */
interface ErrorModeloRaw {
  campo?: string;
  errores?: string | string[] | null | undefined;
}

@Component({
  standalone: true,
  selector: 'app-solicitud-page',
  templateUrl: './solicitud-page.component.html',
  styleUrl: './solicitud-page.component.scss',
  imports: [
    CommonModule,
    WizardComponent,
    PasoUnoComponent,
    PasoDosComponent,
    BtnContinuarComponent,
    NotificacionesComponent,
    AlertComponent,
  ],
})
/**
 * @component
 * @name SolicitudPageComponent
 * @description
 * Componente encargado de gestionar la lógica y el estado de la página de solicitud dentro del flujo de un wizard.
 * Este componente interactúa con un store y un query para manejar el estado de la sección, y controla la navegación
 * entre los pasos del wizard.
 *
 * @usageNotes
 * Este componente utiliza un `WizardComponent` para la navegación entre pasos y un `SeccionLibQuery` junto con un
 * `SeccionLibStore` para manejar el estado de la sección.
 *
 * @example
 * <app-solicitud-page></app-solicitud-page>
 *
 * @property {ListaPasosWizard[]} pasos - Lista de pasos del wizard.
 * @property {number} indice - Índice del paso actual.
 * @property {SeccionLibState | undefined} seccion - Estado de la sección.
 * @property {Subject<void>} destroyNotifier$ - Notificador para destruir observables.
 * @property {WizardComponent} wizardComponent - Referencia al componente del wizard.
 * @property {DatosPasos} datosPasos - Datos de configuración de los pasos del wizard.
 *
 * @method ngOnInit
 * Inicializa el componente y suscripciones necesarias para manejar el estado de la sección.
 *
 * @method seleccionaTab
 * Cambia el índice del paso actual del wizard.
 * @param {number} i - Índice de la pestaña a seleccionar.
 *
 * @method getValorIndice
 * Actualiza el índice del paso actual basado en el evento recibido y navega al paso correspondiente.
 * @param {AccionBoton} e - Evento con la acción y el valor del índice.
 *
 * @method destroyNotifier$
 * Método para limpiar las suscripciones al destruir el componente.
 *
 * @method datosPasos
 * Configura los textos y el número de pasos del wizard.
 *
 * @constructor
 * @param {SeccionLibQuery} seccionQuery - Consulta de la sección.
 * @param {SeccionLibStore} seccionStore - Almacenamiento de la sección.
 */
export class SolicitudPageComponent implements OnInit, OnDestroy {
  /**
   * Textos estáticos relacionados con el pago de derechos.
   * @type {typeof PAGO_DE_DERECHOS}
   */
  TEXTOS = AVISO_CONTRNIDO;

  /**
   * Indica si el formulario es válido.
   * @type {boolean}
   */
  esFormValido = true;

  /**
 * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
 */
  public formErrorAlert = ERROR_FORMA_ALERT;


  public periodoAlert = ERROR_PERIODO_ALERT;

  /**
   * Clase CSS para estilizar alertas informativas.
   * @type {string}
   */
  public infoAlert = 'alert-info';
  /**
   * Notificación tipo banner que se muestra tras operaciones exitosas.
   */
  public alertaNotificacion!: Notificacion;
  /**
   * Notificación que se puede utilizar para mostrar mensajes emergentes (toastr).
   * Null cuando no hay notificación nueva.
   */
  public nuevaNotificacion: Notificacion | null = null;
  /**
   * Constante que almacena el folio temporal generado al enviar la solicitud.
   */
  folioTemporal: string = '';
  /**
   * Constante que indica si el formulario es válido.
   */
  PASO_UNO: number = 1;
  /**
   * Lista de pasos del wizard.
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * Índice del paso actual.
   */
  indice: number = 1;

  /**
   * Estado de la sección.
   */
  public seccion: SeccionLibState | undefined;

  /**
   * Notificador para destruir observables.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Referencia al componente del wizard.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  @ViewChild(PasoUnoComponent, { static: false })
  pasoUnoComponent!: PasoUnoComponent;

  /**
   * Estado de la solicitud.
   * @type {FinalDataToSend}
   */
  estadoSolicitud!: FinalDataToSend;

  /**
   * Datos de los pasos del wizard.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * RFC del usuario logueado.
   * @type {string}
   */
  rfcLogueado: string = '';

  /**
   * Constructor del componente.
   * @param seccionQuery Consulta de la sección.
   * @param seccionStore Almacenamiento de la sección.
   */
  constructor(
    private tramiteStore: Tramite319Store,
    private seccionStore: SeccionLibStore,
    private tramite319Query: Tramite319Query,
    private guardarService: OperacionService,
    private loginQuery: LoginQuery
  ) { }

  /**
   * Inicializa el componente.
   */
  ngOnInit(): void {
    this.obtenerEstadoSolicitud();
    this.obtenerRfcLogueado();
  }

  /**
   * Obtiene el RFC del usuario logueado.
   * @return void
   */
  obtenerRfcLogueado(): void {
    this.loginQuery.selectLoginState$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((loginState) => {
        this.rfcLogueado = loginState.rfc;
      });
  }

  /**
   * Selecciona una pestaña del wizard.
   * @param {number} i - Índice de la pestaña.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Obtiene el valor del índice del evento.
   * @param {AccionBoton} e - Evento con la acción y el valor.
   */
  getValorIndice(e: AccionBoton): void {
    if (this.indice === this.PASO_UNO) {
      this.esFormValido = this.pasoUnoComponent.esFormValido();
      if (!this.esFormValido) {
        this.datosPasos.indice = this.indice;
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
        return;
      }
      this.esFormValido = this.pasoUnoComponent.esTablaValida();
      if (!this.esFormValido) {
        this.datosPasos.indice = this.indice;
        this.formErrorAlert = ERROR_PERIODO_ALERT;
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
        return;
      }
      this.ejecutarPostGuardar(e);
    } else {
      if (e.valor > 0 && e.valor < 5) {
        this.indice = e.valor;
        this.actualizarDatosPasos();
        if (e.accion === 'cont') {
          this.wizardComponent.siguiente();
        } else {
          this.wizardComponent.atras();
        }
      }
    }
  }

  /**
   * Obtiene el estado de la solicitud.
   */
  obtenerEstadoSolicitud(): void {
    this.tramite319Query
      .select()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((estado) => {
        this.estadoSolicitud = estado;
      });
  }

  /**
   * Lógica que se ejecuta después de intentar guardar la solicitud.
   * Maneja notificaciones, navegación del wizard y errores devueltos por el backend.
   * @param e Acción del botón con la dirección y valor de índice destino.
   */
  ejecutarPostGuardar(e: AccionBoton): void {
    if (this.indice === this.PASO_UNO) {
      this.ejecutaEnviarSolicitud()
        .pipe(
          takeUntil(this.destroyNotifier$),
          tap((respuesta) => {
            if (!respuesta.exito) {
              const ERRORESEXTRA = (respuesta.erroresModelo || [])
                .map((err) => `${err.campo}: ${err.errores.join(', ')}`)
                .join('<br>');

              const MENSAJEFINAL = `${respuesta.mensaje || 'Error inesperado al enviar la solicitud.'
                }${ERRORESEXTRA}`;

              this.nuevaNotificacion = {
                tipoNotificacion: 'toastr',
                categoria: CategoriaMensaje.ERROR,
                modo: 'action',
                titulo: 'Error',
                mensaje:
                  MENSAJEFINAL || 'Error inesperado al enviar la solicitud.',
                cerrar: false,
                txtBtnAceptar: '',
                txtBtnCancelar: '',
              };

              setTimeout(
                () => window.scrollTo({ top: 0, behavior: 'smooth' }),
                0
              );
              this.indice = 1;
              this.wizardComponent.indiceActual = 1;
              this.actualizarDatosPasos();
              return;
            }

            if (e.valor > 0 && e.valor < 5) {
              this.alertaNotificacion = {
                tipoNotificacion: 'banner',
                categoria: 'success',
                modo: 'action',
                titulo: '',
                mensaje: MSG_REGISTRO_EXITOSO(String(this.folioTemporal)),
                cerrar: true,
                txtBtnAceptar: '',
                txtBtnCancelar: '',
              };
              this.indice = e.valor;
              this.actualizarDatosPasos();
              if (e.accion === 'cont') {
                this.wizardComponent.siguiente();
              } else {
                this.wizardComponent.atras();
              }
            }
          }),
          catchError((err) => {
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: '',
              mensaje:
                err?.mensaje || 'Error inesperado al enviar la solicitud.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
            setTimeout(
              () => window.scrollTo({ top: 0, behavior: 'smooth' }),
              0
            );
            return of(false);
          })
        )
        .subscribe();
    } else {
      if (e.valor > 0 && e.valor < 5) {
        this.indice = e.valor;
        this.actualizarDatosPasos();
        if (e.accion === 'cont') {
          this.wizardComponent.siguiente();
        } else {
          this.wizardComponent.atras();
        }
      }
    }
  }

  /**
   * Envía el payload construido al servicio `guardarService.postSolicitud`.
   * Normaliza la respuesta y devuelve un Observable con ResultadoSolicitud.
   * @returns Observable<ResultadoSolicitud> con el resultado del intento de guardado.
   */
  ejecutaEnviarSolicitud(): Observable<ResultadoSolicitud> {
    const PAYLOAD = this.generarRequestGuardarSolicitud();
    return this.guardarService.postSolicitud(PAYLOAD).pipe(
      map((response) => {
        if (
          response.codigo === CodigoRespuesta.EXITO &&
          response.datos?.id_solicitud
        ) {
          this.tramiteStore.actualizarCampo(
            'idSolicitud',
            response.datos.id_solicitud
          );
          this.folioTemporal = response.datos.id_solicitud;
          return { exito: true };
        }

        const MENSAJE =
          response?.error ||
          response?.mensaje ||
          response?.causa ||
          'Ocurrió un error al guardar la solicitud.';

        const ERRORESMODELO: ErrorModelo[] = (
          (response?.errores_modelo ?? []) as ErrorModeloRaw[]
        ).map((err) => {
          const CAMPO = typeof err?.campo === 'string' ? err.campo : 'general';
          const RAW_ERRORES = err?.errores;
          const ERRORES = Array.isArray(RAW_ERRORES)
            ? RAW_ERRORES.map(String)
            : RAW_ERRORES === null
              ? [String(RAW_ERRORES)]
              : [];
          return { campo: CAMPO, errores: ERRORES };
        });

        return {
          exito: false,
          MENSAJE,
          erroresModelo: ERRORESMODELO,
        } as ResultadoSolicitud;
      }),
      catchError((error) => {
        const MENSAJE =
          error?.error?.error ||
          error?.message ||
          'Error inesperado al guardar la solicitud.';

        return of({
          exito: false,
          MENSAJE,
          erroresModelo: error?.error?.errores_modelo || [],
        });
      }),
      takeUntil(this.destroyNotifier$)
    );
  }

  /**
   * Actualiza los datos del componente de pasos con el índice actual y el número total de pasos.
   */
  actualizarDatosPasos(): void {
    this.datosPasos = {
      nroPasos: this.pasos.length,
      indice: this.indice,
      txtBtnAnt: 'Anterior',
      txtBtnSig: 'Continuar',
    };
  }

  /**
   * Genera el request para guardar la solicitud basado en el estado actual.
   * Se setean los datos del solicitante de forma estática para pruebas.
   * @returns GuardarSolicitudT319 Objeto con la estructura necesaria para guardar la solicitud.
   */
  generarRequestGuardarSolicitud(): GuardarSolicitudT319 {
    return {
      idSolicitud: null,
      solicitante: {
        rfc: this.rfcLogueado,
        nombre: 'IGNACIO EDUARDO',
        certificado_serial_number: '3082054030820428a00302010',
        es_persona_moral: true,
      },
      cve_rol_capturista: 'PersonaMoral',
      cve_usuario_capturista: this.rfcLogueado,
      periodo: this.estadoSolicitud,
    };
  }

  /**
   * @override
   * @method ngOnDestroy
   * @description Este método se ejecuta automáticamente cuando el componente se destruye.
   * Emite un valor en el observable `destroyNotifier$` para notificar a los suscriptores que deben limpiar recursos
   * y luego completa el observable para liberar memoria.
   *
   */
  ngOnDestroy(): void {
    this.tramiteStore.reset();
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
