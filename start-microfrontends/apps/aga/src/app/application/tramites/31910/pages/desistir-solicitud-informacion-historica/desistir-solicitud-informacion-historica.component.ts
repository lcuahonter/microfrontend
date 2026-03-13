import {
  AlertComponent,
  BtnContinuarComponent,
  CategoriaMensaje,
  DatosPasos,
  ERROR_FORMA_ALERT,
  ErrorModelo,
  ListaPasosWizard,
  Notificacion,
  NotificacionesComponent,
  PAGO_DE_DERECHOS,
  PASOS2,
  WizardComponent,
} from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LoginQuery, SubsecuenteIoQuery } from '@ng-mf/data-access-user';
import {
  MSG_REGISTRO_EXITOSO,
  PASOS_EXPORTACION,
} from '../../constants/solicitud-modificacion-permiso-salida-territorio.enum';
import { Observable, Subject, catchError, map, of, takeUntil, tap } from 'rxjs';
import {
  Solicitud31910State,
  Tramite31910Store,
} from '../../estados/stores/tramite31910.store';
import { AVISO } from '@libs/shared/data-access-user/src';
import { AccionBoton } from '../../enums/accion-botton.enum';
import { CodigoRespuesta } from '../../../../core/enums/aga-core-enum';
import { CommonModule } from '@angular/common';
import { GuardarServiceT31910 } from '../../services/guardar.service';
import { GuardarT31910Request } from '../../models/guardar-t31910.request';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { ResultadoSolicitud } from '../../models/ResultadoSolicitud';
import { Tramite31910Query } from '../../estados/queries/tramite31910.query';

/** Representa la forma cruda que puede venir desde el backend */
interface ErrorModeloRaw {
  campo?: string;
  errores?: string | string[] | null | undefined;
}

/**
 * DesistirSolicitudInformacionHistoricaComponent
 * Este componente gestiona el asistente (wizard) para la solicitud de modificación de permisos.
 * Permite navegar entre los pasos del asistente y gestionar los datos relacionados con cada paso.
 */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    BtnContinuarComponent,
    PasoDosComponent,
    PasoUnoComponent,
    WizardComponent,
    AlertComponent,
    NotificacionesComponent,
  ],
  selector: 'app-desistir-solicitud-informacion-historica',
  templateUrl: './desistir-solicitud-informacion-historica.component.html',
})
export class DesistirSolicitudInformacionHistoricaComponent
  implements OnInit, OnDestroy {
  /**
   * Folio temporal asignado a la solicitud.
   */
  public folioTemporal: number = 0;

  /**
   * Estado actual de la solicitud.
   */
  private destroyed$ = new Subject<void>();
  /**
   * Referencia al componente del primer paso para validar formularios.
   */
  @ViewChild(PasoUnoComponent) pasoUno!: PasoUnoComponent;
  /**
   * Lista de pasos configurados para el wizard.
   * @type {ListaPasosWizard[]}
   */
  pasos: ListaPasosWizard[] = PASOS2;
  /**
   * Clase CSS para estilizar alertas informativas.
   * @type {string}
   */
  public infoAlert = 'alert-info';
  /**
   * Textos estáticos relacionados con el pago de derechos.
   * @type {typeof PAGO_DE_DERECHOS}
   */
  TEXTOS = PAGO_DE_DERECHOS;
  /**
   * Notificación que se puede utilizar para mostrar mensajes emergentes (toastr).
   * Null cuando no hay notificación nueva.
   */
  public nuevaNotificacion: Notificacion | null = null;
  /**
   * Notificación tipo banner que se muestra tras operaciones exitosas.
   */
  public alertaNotificacion!: Notificacion;
  /**
   * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
   */
  public formErrorAlert = ERROR_FORMA_ALERT;

  /**
   * Indica si el formulario actual es válido.
   */
  esFormaValido: boolean = true;
  /**
   * Lista de pasos del asistente para la solicitud de modificación de permiso.
   */
  pasosSolicitar: ListaPasosWizard[] = PASOS_EXPORTACION;

  /**
   * Índice del paso actual en el asistente.
   */
  indice: number = 1;

  /**
   * Índice de la pestaña seleccionada.
   */
  tabIndex: number = 1;

  /**
   * Referencia al componente del asistente (wizard).
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Mensaje de alerta utilizado en el componente.
   * Puede ser asignado a cualquiera de las claves definidas en TEXTOS.
   */
  public alert_message: string = AVISO.Aviso;

  /**
   * Datos relacionados con los pasos del asistente.
   * Incluye el número total de pasos, el índice actual y los textos de los botones.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasosSolicitar.length,
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
   * Estado de la solicitud actual.
   * @type {Solicitud31910State}
   */
  estadoSolicitud!: Solicitud31910State;

  /**
   * FolioTramite a desistir
   */
  folioTramite: string = '';
  constructor(
    private guardarService: GuardarServiceT31910,
    private store: Tramite31910Store,
    private query: Tramite31910Query,
    private loginQuery: LoginQuery,
    private subsecuenteQuery: SubsecuenteIoQuery
  ) { }

  /**
   * Inicializa el componente y suscribe al estado del usuario logueado para obtener el RFC.
   * Este método se ejecuta una vez que el componente ha sido inicializado.
   */
  ngOnInit(): void {
    this.store.reset();
    this.loginQuery
      .select()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((res) => (this.rfcLogueado = res.rfc));
    this.obtenerEstadoSolicitud();
  }


  /**
   * Obtiene el estado actual de la solicitud desde el store.
   * Actualiza la propiedad `estadoSolicitud` con los datos obtenidos.
   */
  obtenerEstadoSolicitud(): void {
    this.query
      .select()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((res) => {
        this.estadoSolicitud = res;
      });
  }

  /**
 * Maneja el evento de emisión del folio del trámite padre desde el componente hijo PasoUno.
 * @param folio folio del trámite padre emitido.
 */
  manejarFolioPadre(folio: string): void {
    this.folioTramite = folio;
  }

  /**
   * Cambia el índice del paso actual en el asistente.
   * Si la acción es "cont", avanza al siguiente paso.
   * Si la acción no es "cont", retrocede al paso anterior.
   * Objeto que contiene la acción y el valor del índice.
   */
  getValorIndice(e: AccionBoton): void {
    if (this.indice === 1) {
      const FORM_VALIDO = this.pasoUno?.validarTodosLosFormularios();
      this.esFormaValido = FORM_VALIDO;
      if (!FORM_VALIDO) {
        this.datosPasos.indice = this.indice;
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
   * Lógica que se ejecuta después de intentar guardar la solicitud.
   * Maneja notificaciones, navegación del wizard y errores devueltos por el backend.
   * @param e Acción del botón con la dirección y valor de índice destino.
   */
  ejecutarPostGuardar(e: AccionBoton): void {
    if (this.indice === 1) {
      this.ejecutaEnviarSolicitud()
        .pipe(
          takeUntil(this.destroyed$),
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
    const JUSTIFICACION = this.estadoSolicitud.justificacion;
    const PAYLOAD: GuardarT31910Request = {
      justificacion_tecnica: JUSTIFICACION,
      numero_folio_tramite_original: this.estadoSolicitud.folioTramite || '',
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
          this.store.actualizarEstado({
            idSolicitud: response.datos.id_solicitud,
          });
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
      takeUntil(this.destroyed$)
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

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.store.reset();
  }
}
