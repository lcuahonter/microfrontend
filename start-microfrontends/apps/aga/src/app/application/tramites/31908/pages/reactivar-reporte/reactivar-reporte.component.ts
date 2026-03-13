import {
  AVISO_CONTRNIDO,
  AccionBoton,
  AlertComponent,
  BtnContinuarComponent,
  CategoriaMensaje,
  DatosPasos,
  ErrorModelo,
  ListaPasosWizard,
  Notificacion,
  NotificacionesComponent,
  WizardComponent,
} from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LoginQuery, SubsecuenteIoQuery } from '@ng-mf/data-access-user';
import { Observable, Subject, catchError, map, of, takeUntil, tap } from 'rxjs';
import { CodigoRespuesta } from '../../../../core/enums/aga-core-enum';
import { CommonModule } from '@angular/common';
import { EstadoSolicitud31908 } from '../../models/estado-solicitud-31908';
import { GuardarServiceT31908 } from '../../services/guardar.service';
import { GuardarSolicitud31908Request } from '../../models/guardar-solicitud-request';
import { MSG_REGISTRO_EXITOSO } from '../../../319/constantes/operaciones-de-comercio-exterior.enum';
import { PASOS } from '../../constantes/reactivar-reporte-const';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { ResultadoSolicitud } from '../../models/ResultadoSolicitud';
import { Tramite31908Query } from '../../estados/query/tramite31908.query';
import { Tramite31908Store } from '../../estados/store/tramite31908.store';

/** Representa la forma cruda que puede venir desde el backend */
interface ErrorModeloRaw {
  campo?: string;
  errores?: string | string[] | null | undefined;
}
/**
 * Componente encargado de gestionar el flujo de cancelación de reporte para el trámite 31907.
 *
 * Provee la lógica de navegación entre pasos (wizard), suscripciones al estado del trámite,
 * y manejo de notificaciones/alertas. No modifica la lógica existente; sólo añade documentación.
 */
@Component({
  selector: 'app-cancelar-reporte',
  standalone: true,
  imports: [
    NotificacionesComponent,
    WizardComponent,
    BtnContinuarComponent,
    CommonModule,
    PasoUnoComponent,
    AlertComponent,
    PasoDosComponent,
  ],
  templateUrl: './reactivar-reporte-mensual.component.html',
})
export class ReactivarReporteComponent implements OnInit, OnDestroy {
  /**
   * Índice actual del paso mostrado en el wizard (1-based).
   */
  indice: number = 1;

  /**
   * Indica si la forma/validación del paso actual es válida.
   */
  esFormaValido: boolean = false;

  /**
   * Texto que representa el error del formulario, si existe.
   */
  formErrorAlert: string = '';

  /**
   * Alerta de notificación actualmente mostrada (estructura de Notificacion).
   */
  alertaNotificacion!: Notificacion;

  /**
   * Lista de pasos que alimentan el componente Wizard.
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * Constante que representa el primer paso del wizard.
   */
  PASO_UNO: number = 1;

  /**
   * Referencia al componente Wizard para controlar navegación programática.
   */
  @ViewChild('wizard', { static: false })
  wizardComponent!: WizardComponent;

  /**
   * Datos derivados para el componente de pasos (número de pasos, índice, labels de botones).
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Estado actual de la solicitud/trámite 31907 (se inyecta desde el query de Akita).
   */
  estadoSolicitud!: EstadoSolicitud31908;

  /**
   * Subject usado para completar las suscripciones y evitar fugas de memoria.
   * Es privado; no exponemos el Subject fuera del componente.
   */
  private destroy$ = new Subject<void>();
  /**
   * Textos estáticos relacionados con el pago de derechos.
   * @type {typeof PAGO_DE_DERECHOS}
   */
  TEXTOS = AVISO_CONTRNIDO;
  /**
   * Clase CSS para estilizar alertas informativas.
   * @type {string}
   */
  public infoAlert = 'alert-info';

  /**
   * Folio temporal asignado a la solicitud tras el registro exitoso.
   * @type {number}
   */
  folioTemporal: number = 0;

  /**
   * Notificación que se puede utilizar para mostrar mensajes emergentes (toastr).
   * Null cuando no hay notificación nueva.
   */
  public nuevaNotificacion: Notificacion | null = null;

  /**
   * Folio del trámite obtenido de la ruta.
   * se obtiene por ruta para probar funcionalidad
   * Será reemplazado por akita una vez implementada la lógica completa.
   * @type {string}
   */
  folioTramite: string = '';
  /**
  * RFC del usuario logueado.
  * Se obtiene del estado de login.
  * @type {string}
  */
  rfcLogueado: string = '';

  /**
   * Constructor del componente.
   * @param tramite31908Query Inyección de dependencia para acceder al estado del trámite 31907.
   */
  constructor(
    private tramite31908Query: Tramite31908Query,
    private store: Tramite31908Store,
    private guardarService: GuardarServiceT31908,
    private subsecuenteQuery: SubsecuenteIoQuery,
    private loginQuery: LoginQuery
  ) { }

  /**
   * Inicializa el componente.
   * Obtiene el estado de la solicitud y el folio del trámite desde la ruta.
   */
  ngOnInit(): void {
    this.loginQuery.select().subscribe(res => {
      this.rfcLogueado = res.rfc || '';
    });
    this.obtenerEstadoSolicitud();
  }


  /**
   * Maneja el evento de emisión del folio del trámite padre desde el componente hijo PasoUno.
   * @param folio folio del trámite padre emitido.
   */
  manejarFolioPadre(folio: string): void {
    this.folioTramite = folio;
  }

  /**
   * Obtiene el estado de la solicitud desde el estado global.
   * Se suscribe a los cambios y actualiza la propiedad estadoSolicitud.
   */
  obtenerEstadoSolicitud(): void {
    this.tramite31908Query
      .select()
      .pipe(takeUntil(this.destroy$))
      .subscribe((estado) => {
        this.estadoSolicitud = estado;
      });
  }

  /**
   * Obtiene el estado subsecuente desde el store de SubsecuenteIo.
   * Actualiza el estado del store de Tramite31907 con el folio del trámite obtenido.
   */
  obtenerEstadoSubsecuente(): void {
    this.subsecuenteQuery
      .select((state) => state.folioTramite)
      .pipe(takeUntil(this.destroy$))
      .subscribe((folio) => {
        this.folioTramite = folio || '';
      });
  }

  /**
   * Maneja la navegación entre pasos del wizard.
   * @param e Objeto con información de la acción del botón
   */
  getValorIndice(e: AccionBoton): void {
    if (this.indice === this.PASO_UNO) {
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
   * Lógica que se ejecuta después de intentar guardar la solicitud.
   * Maneja notificaciones, navegación del wizard y errores devueltos por el backend.
   * @param e Acción del botón con la dirección y valor de índice destino.
   */
  ejecutarPostGuardar(e: AccionBoton): void {
    if (this.indice === this.PASO_UNO) {
      this.ejecutaEnviarSolicitud()
        .pipe(
          takeUntil(this.destroy$),
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
    const PAYLOAD: GuardarSolicitud31908Request = {
      numero_folio_tramite_original: this.folioTramite,
      id_solicitud: null,
      solicitante: {
        rfc: this.rfcLogueado,
        nombre: 'IGNACIO EDUARDO',
        es_persona_moral: true,
        certificado_serial_number: '3082054030820428a00302010',
      },
    };
    return this.guardarService.postSolicitud(PAYLOAD).pipe(
      map((response) => {
        if (
          response.codigo === CodigoRespuesta.EXITO &&
          response.datos?.id_solicitud
        ) {
          this.store.setIdSolicitud(response.datos.id_solicitud);
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
      takeUntil(this.destroy$)
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
   * Limpia los recursos al destruir el componente.
   * Se utiliza para evitar fugas de memoria cancelando suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
