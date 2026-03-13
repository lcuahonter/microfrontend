import {
  AVISO_CONTRNIDO,
  CategoriaMensaje,
  ERROR_FORMA_ALERT,
  PasoFirmaComponent,
  Usuario,
} from '@ng-mf/data-access-user';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  ERROR_DOMICILIOS_ALERT,
  MSG_AVISO_DOCUMENTACION,
  MSG_REGISTRO_EXITOSO,
  PASOS,
  TIPO_MANUAL,
} from '../../constants/aviso.enum';
import {
  GuardarResponse,
  ResultadoSolicitud,
  T32504State,
} from './../../models/aviso.model';
import { Observable, Subject, catchError, map, of, takeUntil, tap } from 'rxjs';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AccionBoton } from '@ng-mf/data-access-user';
import { AlertComponent } from '@libs/shared/data-access-user/src';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { BtnContinuarComponent } from '@ng-mf/data-access-user';
import { CodigoRespuesta } from '../../../../core/enums/notificacion.enum';
import { CommonModule } from '@angular/common';
import { DatosPasos } from '@ng-mf/data-access-user';
import { GuardarServiceT32504 } from '../../services/guardar-t32504.service';
import { ListaPasosWizard } from '@ng-mf/data-access-user';
import { Notificacion } from '@libs/shared/data-access-user/src/tramites/components/notificaciones/notificaciones.component';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { Tramite32504Query } from '../../estados/tramite32504.query';
import { Tramite32504Store } from '../../estados/tramite32504.store';
import { USUARIO_INFO } from '@libs/shared/data-access-user/src/core/enums/usuario-info.enum';
import { WizardComponent } from '@ng-mf/data-access-user';

/** Representa la forma cruda que puede venir desde el backend */
interface ErrorModeloRaw {
  campo?: string;
  errores?: string | string[] | null | undefined;
}
@Component({
  selector: 'app-intro-aviso',
  templateUrl: './intro-aviso.component.html',
  styleUrl: './intro-aviso.component.scss',
  imports: [
    CommonModule,
    WizardComponent,
    PasoUnoComponent,
    PasoDosComponent,
    BtnContinuarComponent,
    ToastrModule,
    AlertComponent,
    PasoFirmaComponent,
  ],
  providers: [ToastrService],
  standalone: true,
})
export class IntroAvisoComponent implements OnInit, OnDestroy {
  /**
   * Constructor del componente.
   * @param tramite32504Query Instancia para consultar el estado del trámite.
   * @param tramite32504Store Instancia para actualizar el store del trámite.
   * @param guardarService Servicio para persistir la solicitud.
   */
  constructor(
    private tramite32504Query: Tramite32504Query,
    private tramite32504Store: Tramite32504Store,
    private guardarService: GuardarServiceT32504
  ) {}

  /**
   * Evento que se emite para cargar archivos.
   * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de
   */
  cargarArchivosEvento = new EventEmitter<void>();

  /**
   * estado de la solicitud
   */
  estadoSolicitud!: T32504State;
  /**
   * Subject para notificar la destrucción del componente y cancelar suscripciones.
   * Se utiliza para evitar fugas de memoria al destruir el componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Indica si el botón para cargar archivos está habilitado.
   */
  activarBotonCargaArchivos: boolean = false;

  /**
   * Indica si la sección de carga de documentos está activa.
   * Se inicializa en true para mostrar la sección de carga de documentos al inicio.
   */
  seccionCargarDocumentos: boolean = true;

  /** Carga de progreso del archivo */
  cargaEnProgreso: boolean = true;

  /**
   * Indica si el formulario es válido.
   */
  esFormValido: boolean = true;

  /**
   * Configuración de alertas para errores de formulario.
   */
  public formErrorAlert = ERROR_FORMA_ALERT;

  /**
   * Mensajes de aviso relativos a la documentación requerida.
   */
  avisosDocumentacion = MSG_AVISO_DOCUMENTACION;

  /**
   * Mensaje de alerta para errores en domicilios.
   */
  public periodoAlert = ERROR_DOMICILIOS_ALERT;

  /**
   * Folio temporal devuelto por el backend tras guardar la solicitud.
   */
  folioTemporal: number = 0;

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
   * Texto de notificación usado cuando el guardado es exitoso.
   */
  notificacionGuardadoExitoso!: string;

  /**
   * Información del usuario actual.
   */
  datosUsuario: Usuario = USUARIO_INFO;
  /**
   * Índice actual del wizard (valor 1-based para presentación al usuario).
   */
  indice = 1;
  /**
   * Lista de pasos para el wizard (configuración estática importada).
   */
  pasos: ListaPasosWizard[] = PASOS;
  /**
   * Mensaje/aviso de contenido utilizado en la interfaz.
   */
  AVISO = AVISO_CONTRNIDO;
  /**
   * Referencia al `WizardComponent` usado para controlar la navegación del wizard.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Referencia al componente del primer paso para validaciones y lectura de datos.
   */
  @ViewChild('pasoUno', { static: false }) pasoUnoComponent!: PasoUnoComponent;

  /**
   * Constante que representa el índice del primer paso (1).
   */
  readonly PASO_UNO = 1;

  /**
   * Datos que describen la navegación del wizard (número de pasos, índice y textos de botones).
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Método de inicialización del componente.
   * Obtiene el estado de la solicitud al iniciar el componente.
   */
  ngOnInit(): void {
    this.obtenerEstadoSolicitud();
    this.postGuardarMasivo().subscribe((response) => {
      if (
        response.codigo === CodigoRespuesta.EXITO &&
        response.datos?.id_solicitud
      ) {
        this.tramite32504Store.update({
          idSolicitud: response.datos.id_solicitud,
        });
        this.folioTemporal = response.datos.id_solicitud;
        this.notificacionGuardadoExitoso = MSG_REGISTRO_EXITOSO(
          this.folioTemporal.toString()
        );
      }
    });
  }

  /**
   * Obtiene el estado actual de la solicitud desde el store y lo asigna a la variable estadoSolicitud.
   */
  obtenerEstadoSolicitud(): void {
    this.tramite32504Query
      .select()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((res) => (this.estadoSolicitud = res));
  }

  /**
   * Obtiene el valor del índice del paso actual en el wizard.
   * @param e la acción del botón que contiene el valor del índice.
   */
  getValorIndice(e: AccionBoton): void {
    if (this.indice === this.PASO_UNO) {
      this.esFormValido = this.pasoUnoComponent.validarFormulario();
      if (!this.esFormValido) {
        this.marcarError();
        return;
      }
      const ES_TABLA_VALIDA = this.pasoUnoComponent.validarTabla();
      if (!ES_TABLA_VALIDA) {
        this.esFormValido = false;
        this.formErrorAlert = ERROR_DOMICILIOS_ALERT;
        this.marcarError();
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
          takeUntil(this.destroyNotifier$),
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
    const MASIVO = this.estadoSolicitud.datosEmpresa.tipo_carga !== TIPO_MANUAL;
    const REQUEST = MASIVO
      ? this.postGuardarMasivo()
      : this.postGuardarManual();
    return REQUEST.pipe(
      map((response) => {
        if (
          response.codigo === CodigoRespuesta.EXITO &&
          response.datos?.id_solicitud
        ) {
          this.tramite32504Store.update({
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

        const ERRORESMODELO: ErrorModeloRaw[] = (
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
   * Marca el paso actual como erróneo y desplaza la vista al inicio.
   * {void} No retorna ningún valor.
   */
  marcarError(): void {
    this.datosPasos.indice = this.indice;

    // Garantiza el scroll en el siguiente ciclo del DOM
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 0);
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
   * Método para manejar el evento de carga de documentos.
   * Actualiza el estado del botón de carga de archivos.
   *  carga - Indica si la carga de documentos está activa o no.
   * {void} No retorna ningún valor.
   */
  manejaEventoCargaDocumentos(carga: boolean): void {
    this.activarBotonCargaArchivos = carga;
  }

  /**
   * Método para manejar el evento de carga de documentos.
   * Actualiza el estado de la sección de carga de documentos.
   *  cargaRealizada - Indica si la carga de documentos se realizó correctamente.
   * {void} No retorna ningún valor.
   */
  cargaRealizada(cargaRealizada: boolean): void {
    this.seccionCargarDocumentos = cargaRealizada ? false : true;
  }

  /**
   * Emite un evento para cargar archivos.
   * {void} No retorna ningún valor.
   */
  onClickCargaArchivos(): void {
    this.cargarArchivosEvento.emit();
  }

  /**
   * Método para navegar a la siguiente sección del wizard.
   * Realiza la validación de los documentos cargados y actualiza el índice y el estado de los pasos.
   * {void} No retorna ningún valor.
   */
  siguiente(): void {
    // Aqui se hara la validacion de los documentos cargdados
    this.wizardComponent.siguiente();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }

  /**
   * Método para navegar a la sección anterior del wizard.
   * Actualiza el índice y el estado de los pasos.
   * {void} No retorna ningún valor.
   */
  anterior(): void {
    this.wizardComponent.atras();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }

  /**
   * Guarda la solicitud de manera manual.
   * @returns Observable con la respuesta de la operación de guardado.
   */
  postGuardarManual(): Observable<BaseResponse<GuardarResponse>> {
    const PAYLOAD = {
      id_solicitud: this.estadoSolicitud.idSolicitud || null,
      direcciones: this.estadoSolicitud.direcciones,
      solicitante: {
        rfc: 'AAL0409235E6',
        nombre: 'Juan Pérez',
        es_persona_moral: true,
        certificado_serial_number: 'string',
      },
      cve_rol_capturista: 'PersonaMoral',
      cve_usuario_capturista: 'AAL981209G67',
      boolean_generico: '',
      descripcion_generica3: '',
      numero_programa_immex:
        this.estadoSolicitud.datosEmpresa.numero_programa_immex,
      clave_permiso_sedena:
        this.estadoSolicitud.datosEmpresa.clave_permiso_sedena,
      ide_generica2: this.estadoSolicitud.datosEmpresa.ide_generica2,
      ide_generica3: this.estadoSolicitud.datosEmpresa.ide_generica3,
      clave_tipo_carga_masiva: this.estadoSolicitud.datosEmpresa.tipo_carga,
      adace: this.estadoSolicitud.adace,
      tipo_carga: this.estadoSolicitud.datosEmpresa.tipo_carga,
      representacion_federal: {
        cve_unidad_administrativa: '9915',
      },
    };
    return this.guardarService.postSolicitud(PAYLOAD);
  }

  /**
   * Guarda la solicitud de manera masiva.
   * @returns Observable con la respuesta de la operación de guardado.
   */
  postGuardarMasivo(): Observable<BaseResponse<GuardarResponse>> {
    const PAYLOAD = {
      id_solicitud: this.estadoSolicitud.idSolicitud || null,
      solicitante: {
        rfc: 'AAL0409235E6',
        nombre: 'Juan Pérez',
        es_persona_moral: true,
        certificado_serial_number: 'string',
      },
      cve_rol_capturista: 'PersonaMoral',
      cve_usuario_capturista: 'AAL981209G67',
      boolean_generico: '',
      descripcion_generica3: '',
      numero_programa_immex:
        this.estadoSolicitud.datosEmpresa.numero_programa_immex,
      clave_permiso_sedena:
        this.estadoSolicitud.datosEmpresa.clave_permiso_sedena,
      ide_generica2: this.estadoSolicitud.datosEmpresa.ide_generica2,
      ide_generica3: this.estadoSolicitud.datosEmpresa.ide_generica3,
      clave_tipo_carga_masiva: this.estadoSolicitud.datosEmpresa.tipo_carga,
      adace: this.estadoSolicitud.adace,
      tipo_llenado: '1',
      tipo_carga: this.estadoSolicitud.datosEmpresa.tipo_carga,
      representacion_federal: {
        cve_unidad_administrativa: '9915',
      },
    };

    return this.guardarService.postGuardarMasivo(PAYLOAD);
  }

  /**
   * Maneja el evento de carga en progreso emitido por un componente hijo.
   * Actualiza el estado de cargaEnProgreso según el valor recibido.
   * @param cargando Valor booleano que indica si la carga está en progreso.
   */
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  onCargaEnProgresoPadre(cargando: boolean) {
    this.cargaEnProgreso = cargando;
  }

  /**
   * Limpia el estado del store cuando el componente se destruye.
   */
  ngOnDestroy(): void {
    this.tramite32504Store.reset();
  }
}
