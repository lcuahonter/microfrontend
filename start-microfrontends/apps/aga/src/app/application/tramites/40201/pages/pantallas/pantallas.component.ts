import { LoginQuery, SolicitanteQuery, SolicitanteState } from '@ng-mf/data-access-user';

import { ERROR_AGENTE_NAVIERO } from './../../constantes/transportacion-maritima.enum';
/* eslint-disable @typescript-eslint/naming-convention */
import {
  AVISO_CONTRNIDO,
  AccionBoton,
  CategoriaMensaje,
  DatosPasos,
  ListaPasosWizard,
  Notificacion,
  WizardComponent,
} from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  MSG_REGISTRO_EXITOSO,
  PASOS,
  TRANSPORTACION_MARITIMA_PASO,
} from '../../constantes/transportacion-maritima.enum';
import { Observable, Subject, catchError, map, of, takeUntil, tap } from 'rxjs';
import {
  PersonaSolicitud,
  T40201Request,
} from './../../models/guardar-solicitud.model';
import {
  Tramite40201Store,
  TransportacionMaritima40201State,
} from '../../estados/store/tramite40201.store';
import { CodigoRespuesta, TipoPersonaAGA } from '../../../../core/enums/aga-core-enum';
import { MAPPER_TRANSPORTISA } from '../../constantes/mappers';

import { ResultadoSolicitud } from '../../../31910/models/ResultadoSolicitud';
import { Tramite40201Query } from '../../estados/query/tramite40201.query';
import { TransportacionMaritimaService } from '../../services/transportacion-maritima/transportacion-maritima.service';
/**
 * Componente principal para la gestión de pantallas en el wizard de cupos.
 */
@Component({
  selector: 'app-pantallas',
  templateUrl: './pantallas.component.html',
  styles: ``,
})
export class PantallasComponent implements OnInit, OnDestroy {
  /**
   * Lista de pasos para el wizard (configuración estática importada).
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * Estado actual de la solicitud cargado desde la tienda.
   */
  estadoSolicitud!: TransportacionMaritima40201State;

  /**
   * Folio temporal asignado por el backend tras guardar la solicitud.
   */
  folioTemporal!: number;

  /**
   * Índice que representa el primer paso del wizard.
   */
  PASO_UNO: number = 1;

  /** Indica si el RFC corresponde a un agente naviero. */
  esNaviero: boolean = true;


  /**
 * Estado del solicitante.
 */
  solicitante!: SolicitanteState;

  /** solicitante persona moral */
  esPersonaMoral: boolean = false;

  /** Rfc de la persona que inició sesión */
  rfcLogueado: string = '';

  /**
   * Constructor con las inyecciones de store, query y servicio usados por el componente.
   */
  constructor(
    private t40201Store: Tramite40201Store,
    private t40201Query: Tramite40201Query,
    private service: TransportacionMaritimaService,
    private loginQuery: LoginQuery,
    private solicitanteQuery: SolicitanteQuery,
  ) { }

  /**
   * Inicializa el componente y suscribe al estado del store del trámite.
   */
  ngOnInit(): void {
    this.t40201Query.select()
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        this.estadoSolicitud = state;
      });

    this.solicitanteQuery.selectSeccionState$
      .pipe(
        takeUntil(this.destroy$),
        map((state) => {
          this.solicitante = state as SolicitanteState;
          this.esPersonaMoral = this.solicitante.tipo_persona === TipoPersonaAGA.MORAL;
        })
      )
      .subscribe();


    this.loginQuery.select()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res.rfc) {
          this.rfcLogueado = res.rfc;
          this.verificaNaviero(res.rfc);
        }
      });
  }


  /**
   * Verifica si el RFC corresponde a un agente naviero.
   */
  verificaNaviero(rfc: string): void {
    this.service.validaAgenteNaviero(rfc).subscribe(res => {
      this.esNaviero = res.datos as boolean;
    });
  }




  /**
   * Notificación que se puede utilizar para mostrar mensajes emergentes (toastr).
   * Null cuando no hay notificación nueva.
   */
  public nuevaNotificacion: Notificacion | null = null;
  /**
   * Lista de pasos del wizard.
   * @type {ListaPasosWizard[]}
   */
  public pantallasPasos: ListaPasosWizard[] = TRANSPORTACION_MARITIMA_PASO;

  /**
   * Índice del paso actual.
   * @type {number}
   * @default 1
   */
  public indice: number = 1;

  /**
   * Referencia al componente Wizard para controlar la navegación entre pasos.
   * @type {WizardComponent}
   */
  @ViewChild(WizardComponent)
  public wizardComponent!: WizardComponent;

  /**
   * Textos estáticos relacionados con el pago de derechos.
   * @type {typeof AVISO_CONTRNIDO}
   */
  TEXTOS = AVISO_CONTRNIDO;

  /**
   * Texto de notificación usado cuando el guardado es exitoso.
   */
  notificacionGuardadoExitoso!: string;

  /**
   * Mensaje que se muestra cuando el RFC no corresponde a un agente naviero.
   */
  mensajeAgenteNaviero = ERROR_AGENTE_NAVIERO;


  /**
   *
   * Una cadena que representa la clase CSS para una alerta de información.
   * Esta clase se utiliza para aplicar estilo a los mensajes de información en el componente.
   */
  public infoAlert = 'alert-info';

  /**
   * Indica si el formulario es valido.
   */
  esFormValido: boolean = true;

  /**
   * Sujeto para manejar la destrucción del componente y evitar fugas de memoria.
   */
  destroy$: Subject<void> = new Subject<void>();

  /**
   * Datos utilizados para el control del wizard.
   * @type {DatosPasos}
   */
  public datosPasos: DatosPasos = {
    nroPasos: this.pantallasPasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Actualiza el índice del paso y maneja la navegación hacia adelante o atrás.
   *
   * @param {AccionBoton} e - Objeto que contiene el valor del paso y la acción a realizar.
   * @returns {void}
   */
  public getValorIndice(e: AccionBoton): void {
    if (this.indice === this.PASO_UNO) {
      this.esFormValido = this.puedeGuardar();
      if (!this.esFormValido) {
        this.datosPasos.indice = this.indice;
        return;
      }

      this.esFormValido = true;
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
              this.notificacionGuardadoExitoso = MSG_REGISTRO_EXITOSO(
                this.folioTemporal.toString()
              );
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
    const REQUEST = this.mapeaRequest();
    return this.service.guardarSolicitud(REQUEST).pipe(
      map((response) => {
        if (
          response.codigo === CodigoRespuesta.EXITO &&
          response.datos?.id_solicitud
        ) {
          this.t40201Store.update({
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

        const ERRORESMODELO = (response?.errores_modelo || []).map(
          (error: any) => {
            return {
              campo: error.campo || 'general',
              errores: Array.isArray(error.errores)
                ? error.errores
                : [String(error.errores)],
            };
          }
        );

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
      })
    );
  }

  /**
   * Valida si hay datos en alguna de las tablas para permitir el guardado.
   * @returns boolean Indicador de si se puede guardar o no.
   */
  puedeGuardar(): boolean {
    const {
      caatRegistradoEmpresaTabla,
      personaFisicaExtranjeraTabla,
      personaFisicaNacionalTabla,
      personaMoralExtranjeraTabla,
      personaMoralNacionalTabla,
    } = this.estadoSolicitud;

    return (
      caatRegistradoEmpresaTabla.length > 0 ||
      personaFisicaExtranjeraTabla.length > 0 ||
      personaFisicaNacionalTabla.length > 0 ||
      personaMoralExtranjeraTabla.length > 0 ||
      personaMoralNacionalTabla.length > 0
    );
  }

  /**
   * Ejecuta la lógica para avanzar o retroceder en el wizard después de guardar los datos.
   * @param e Objeto que contiene la acción y el valor del botón.
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
   * mapea el estado actual a la estructura requerida por el API para guardar la solicitud.
   * @returns Request estructurado para el API.
   */
  mapeaRequest(): T40201Request {
    const CAATS: PersonaSolicitud[] = [
      ...this.mapearPersonasFisicasNacionales(),
      ...this.mapearPersonasMoralesNacionales(),
      ...this.mapearPersonasFisicasExtranjeras(),
      ...this.mapearPersonasMoralesExtranjeras(),
    ];
    return {
      id_solicitud: this.estadoSolicitud.idSolicitud,
      solicitante: {
        rfc: this.rfcLogueado,
        nombre: 'Juan Pérez',
        es_persona_moral: true,
        certificado_serial_number: 'string',
      },
      transportistas_maritimos: CAATS,
    };
  }

  /**
   * mapea las personas físicas nacionales del estado de la solicitud al formato requerido por el API.
   * @returns PersonaSolicitud[] mapeadas.
   */
  mapearPersonasFisicasNacionales(): PersonaSolicitud[] {
    const FISICAS_NACIONALES = this.estadoSolicitud.personaFisicaNacionalTabla;

    return FISICAS_NACIONALES.map((item) =>
      MAPPER_TRANSPORTISA('FISICA_NACIONAL', item)
    );
  }

  /**
   * mapea las personas morales nacionales del estado de la solicitud al formato requerido por el API.
   * @returns PersonaSolicitud[] mapeadas.
   */
  mapearPersonasMoralesNacionales(): PersonaSolicitud[] {
    const FISICAS_MORALES = this.estadoSolicitud.personaMoralNacionalTabla;
    return FISICAS_MORALES.map((item) =>
      MAPPER_TRANSPORTISA('MORAL_NACIONAL', item)
    );
  }

  /**
   * mapea las personas físicas extranjeras del estado de la solicitud al formato requerido por el API.
   * @returns PersonaSolicitud[] mapeadas.
   */
  mapearPersonasFisicasExtranjeras(): PersonaSolicitud[] {
    const FISICAS_MORALES = this.estadoSolicitud.personaFisicaExtranjeraTabla;
    return FISICAS_MORALES.map((item) =>
      MAPPER_TRANSPORTISA('FISICA_EXTRANJERA', item)
    );
  }

  /**
   * mapea las personas morales extranjeras del estado de la solicitud al formato requerido por el API.
   * @returns PersonaSolicitud[] mapeadas.
   */
  mapearPersonasMoralesExtranjeras(): PersonaSolicitud[] {
    const FISICAS_MORALES = this.estadoSolicitud.personaMoralExtranjeraTabla;
    return FISICAS_MORALES.map((item) =>
      MAPPER_TRANSPORTISA('MORAL_EXTRANJERA', item)
    );
  }

  /**
   * Limpia el store al destruir el componente para restablecer el estado del trámite.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.t40201Store.reset();
  }
}
