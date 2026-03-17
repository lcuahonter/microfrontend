import {
  AlertComponent,
  BtnContinuarComponent,
  CategoriaMensaje,
  DatosPasos,
  ListaPasosWizard,
  LoginQuery,
  Notificacion,
  NotificacionesComponent,
  SolicitanteQuery,
  SolicitanteState,
  Usuario,
  WizardComponent,
} from '@ng-mf/data-access-user';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

import {
  CodigoRespuesta,
  MSG_REGISTRO_EXITOSO,
  USUARIO_INFO,
} from '../../enum/enum-tramite';
import {
  Solicitud231001State,
  Tramite231001Store,
} from '../../estados/tramites/tramite231001.store';

import { Observable, Subject, catchError, map, of, takeUntil, tap } from 'rxjs';
import { AVISO } from '../../models/datos.model';
import { CommonModule } from '@angular/common';
import { GuardarService } from '../../services/guardar.service';
import { GuardarSolicitud231001Request } from '../../models/guardar-solicitud-request';
import { PASOS } from '../../enum/pasos.enum';
import { PasoTresComponent } from '../../components/paso-tres/paso-tres.component';
import { ResultadoSolicitud } from '../../models/ResultadoSolicitud';
import { SolicitanteDatosTabsComponent } from '../solicitante-datos-tabs/solicitante-datos-tabs.component';
import { Tramite231001Query } from '../../estados/queries/tramite231001.query';

/**
 * Interface representing the action of a button.
 */
interface AccionBoton {
  /**
   * The action to be performed.
   */
  accion: string;
  /**
   * The value associated with the action.
   */
  valor: number;
}

/**
 * Identificador del primer paso del wizard.
 * Usado para lógica condicional en la navegación.
 *
 */
const PASO_UNO = 1;

/** Representa la forma cruda que puede venir desde el backend */
interface ErrorModeloRaw {
  campo?: string;
  errores?: string | string[] | null | undefined;
}

/** Forma normalizada que usa el componente */
interface ErrorModelo {
  campo: string;
  errores: string[];
}

/**
 *  DatosComponent
 * app-datos
 * ./datos.component.html
 *
 * Componente Angular para manejar los datos del wizard del trámite 231001.
 * Maneja la captura de información del solicitante, envío de la solicitud al backend,
 * navegación entre pasos y la presentación de notificaciones de resultado.
 */
@Component({
  standalone: true,
  selector: 'app-datos',
  templateUrl: './datos.component.html',
  styles: ``,
  imports: [
    NotificacionesComponent,
    WizardComponent,
    SolicitanteDatosTabsComponent,
    PasoTresComponent,
    BtnContinuarComponent,
    AlertComponent,
    CommonModule,
  ],
})
export class DatosComponent implements OnInit, OnDestroy {
  /**
   * Constructor del componente.
   * @param tramite231001Query Servicio de consulta del estado del trámite.
   * @param tramite231001Store Store para actualizar el estado del trámite.
   * @param guardarService Servicio que realiza el POST para guardar la solicitud.
   */
  constructor(
    private tramite231001Query: Tramite231001Query,
    private tramite231001Store: Tramite231001Store,
    private guardarService: GuardarService,
    private solicitanteQuery: SolicitanteQuery,
    private loginQuery: LoginQuery
  ) {}

  /**
   * RFC del solicitante pasado como input.
   */
  rfcValor: string = '';

  /**
   * Tipo de trámite (id) recibido como input.
   * Usado para lógica condicional dependiendo del tipo de trámite.
   */
  @Input() idTipoTRamite!: string;

  /**
   * Clase personalizada para las alertas
   * Usada para definir el estilo de las alertas en la interfaz.
   */
  public infoAlert = 'alert-info';

  /**
   * Información del usuario que realiza la solicitud.
   * Por defecto se inicializa con la constante USUARIO_INFO.
   */
  datosUsuario: Usuario = USUARIO_INFO;

  /**
   * Textos definidos en el modelo AVISO (aviso de privacidad u otros textos).
   */
  TEXTOS = AVISO.Aviso;

  /**
   * Subject para controlar la destrucción de subscripciones (takeUntil).
   */
  private destroyed$ = new Subject<void>();
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
   * Estado local de la solicitud obtenido desde el query/store.
   */
  public solicitudState!: Solicitud231001State;

  /**
   * Folio original del trámite, obtenido desde el estado de consulta.
   */
  folioTramiteOriginal!: string;

  /**
   * Estado del solicitante.
   */
  solicitante!: SolicitanteState;

  /** Indica si el solicitante es una persona moral.
   * Se utiliza para determinar qué campos mostrar en el formulario.
   */
  esPersonaMoral: boolean = false;

  /**
   * Inicializa el componente y carga el estado inicial de la solicitud.
   */
  ngOnInit(): void {
    this.tramite231001Store.reset();
    this.obtenerEstadoSolicitud();

    this.solicitanteQuery.selectSeccionState$
      .pipe(
        takeUntil(this.destroyed$),
        map((state) => {
          this.solicitante = state as SolicitanteState;
          this.esPersonaMoral = this.solicitante.tipo_persona === 'M';
        })
      )
      .subscribe();

    this.loginQuery.selectLoginState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.rfcValor = seccionState.rfc;
        })
      )
      .subscribe();
  }

  /**
   * Se suscribe al estado de la solicitud en el query y lo asigna a `solicitudState`.
   * La suscripción se cancela automáticamente con `destroyed$`.
   */
  obtenerEstadoSolicitud(): void {
    this.tramite231001Query.selectSolicitud$
      ?.pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
  }

  /**
   * Avanza al siguiente paso del wizard y actualiza el índice local.
   */
  siguiente(): void {
    this.wizardComponent.siguiente();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }
  /**
   *  texto
   *  Texto del aviso de privacidad.
   */
  texto: string = 'Aviso de Privacidad simplificado';
  /**
   * @property pasos
   * @type {ListaPasosWizard[]}
   *  Arreglo que contiene los pasos del wizard.
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * @property aviso
   * @type {string}
   *  Texto del aviso de privacidad en formato HTML.
   */

  aviso = AVISO.Aviso;

  /**
   * @property folioTemporal
   * @type {number}
   * Identificador temporal de la solicitud asignado por el backend al guardar.
   * Usado para mostrar en notificaciones.
   */
  public folioTemporal: number = 0;

  /**
   * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
   */
  public formErrorAlert = `<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">
      Faltan campos por capturar.
    </div>
  </div>
</div>
`;

  /**
   * @property wizardComponent
   * @type {WizardComponent}
   *  Referencia al componente del wizard.
   */
  @ViewChild('wizard', { static: false }) wizardComponent!: WizardComponent;

  /**
   * @property indice
   * @type {number}
   *  El índice de la pestaña seleccionada.
   */
  indice: number = 1;

  /**
   * Referencia al componente hijo `PasoUnoComponent` para acceder a sus métodos de validación de formularios.
   */
  @ViewChild('pasoUnoRef') pasoUnoComponent!: SolicitanteDatosTabsComponent;

  /**
   * Controla la visibilidad del mensaje de error cuando la validación de formularios falla.
   * }
   */
  esFormaValido: boolean = true;

  /**
   * Datos para el wizard de pasos.
   * Contiene información sobre el número total de pasos, el paso actual y los textos de los botones.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Actualiza el valor del index basado en el evento recibido
   * @param e El AccionBoton .
   */
  public getValorIndice(e: AccionBoton): void {
    if (this.indice === PASO_UNO) {
      const FORM_VALIDO = this.pasoUnoComponent?.validarTodosLosFormularios();
      this.esFormaValido = FORM_VALIDO;
      if (!FORM_VALIDO) {
        this.datosPasos.indice = this.indice;
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
        return;
      }
      this.ejecutaPostGuardar(e);
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

  actualizarDatosPasos(): void {
    this.datosPasos = {
      nroPasos: this.pasos.length,
      indice: this.indice,
      txtBtnAnt: 'Anterior',
      txtBtnSig: 'Continuar',
    };
  }

  /**
   * Retrocede al paso anterior del wizard y actualiza el índice local.
   */
  anterior(): void {
    this.wizardComponent.atras();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }

  /**
   * Método que se ejecuta cuando cambia de tab en paso-uno.
   * Oculta el mensaje de error de validación.
   */
  alCambiarPestana(): void {
    this.esFormaValido = true;
  }

  /**
   * Envía el payload construido al servicio `guardarService.postSolicitud`.
   * Normaliza la respuesta y devuelve un Observable con ResultadoSolicitud.
   * @returns Observable<ResultadoSolicitud> con el resultado del intento de guardado.
   */
  ejecutaEnviarSolicitud(): Observable<ResultadoSolicitud> {
    const PAYLOAD: GuardarSolicitud231001Request = {
      solicitante: {
        rfc: this.solicitante.rfc_original,
        nombre: this.esPersonaMoral
          ? this.solicitante.razon_social
          : `${this.solicitante.nombre ?? ''} ${
              this.solicitante.ap_paterno ?? ''
            } ${this.solicitante.ap_materno ?? ''}`.trim(),
        es_persona_moral: this.esPersonaMoral,
        certificado_serial_number: '3082054030820428a00302010', // ejemplo
      },
      aduana_solicitud: {
        cve_aduana: this.solicitudState.aduana.padStart(3, '0'),
      },
      descripcion_generica1: this.solicitudState.descripcionGenerica1,
      id_solcitud: null,
      mercancias: this.solicitudState.mercancias.map((item) => ({
        cantidad_en_letra: item.cantidadEnLetra,
        capitulo_fraccion: item.capituloFraccion,
        cve_partida: item.clavePartida,
        cve_subpartida: item.claveSubPartida,
        desc_fraccion: item.descFraccion,
        desc_unidad_medida_comercial: item.descUnidadMedida,
        descripcion_mercancia: item.descripcionMercancia,
        generica2: item.descFraccion,
        cantidad: item.generica2,
        cve_unidad_medida_comercial: item.unidadMedidaComercialClave,
      })),
      numero_programa_immex: this.solicitudState.numeroProgramaImmex,
      numero_registro_ambiental: this.solicitudState.numeroRegistroAmbiental,
    };

    return this.guardarService.postSolicitud(PAYLOAD).pipe(
      map((response) => {
        if (
          response.codigo === CodigoRespuesta.EXITO &&
          response.datos?.id_solicitud
        ) {
          this.tramite231001Store.setIdSolicitud(response.datos.id_solicitud);
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
   * Lógica que se ejecuta después de intentar guardar la solicitud.
   * Maneja notificaciones, navegación del wizard y errores devueltos por el backend.
   * @param e Acción del botón con la dirección y valor de índice destino.
   */
  ejecutaPostGuardar(e: AccionBoton): void {
    if (this.indice === PASO_UNO) {
      this.ejecutaEnviarSolicitud()
        .pipe(
          takeUntil(this.destroyed$),
          tap((respuesta) => {
            if (!respuesta.exito) {
              const ERRORESEXTRA = (respuesta.erroresModelo || [])
                .map((err) => `${err.campo}: ${err.errores.join(', ')}`)
                .join('<br>');

              const MENSAJEFINAL = `${
                respuesta.mensaje || 'Error inesperado al enviar la solicitud.'
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
   * Cancela la suscripción a las observables al destruirse el componente.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
