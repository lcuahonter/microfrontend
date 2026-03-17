import {
  AccionBoton,
  BtnContinuarComponent,
  DatosPasos,
  JSONResponse,
  ListaPasosWizard,
  Notificacion,
  NotificacionesComponent,
  PasoCargaDocumentoComponent,
  PasoFirmaComponent,
  WizardComponent,
  WizardService,
  doDeepCopy,
  esValidObject,
  getValidDatos,
} from '@libs/shared/data-access-user/src';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { MSG_REGISTRO_EXITOSO, REGEX_COMAS_FINALES } from '../../constantes/modificacion.enum';
import { Observable, Subject, map, switchMap, take, takeUntil } from 'rxjs';
import {
  Solicitud80301State,
  Tramite80301Store,
} from '../../estados/tramite80301.store';
import { CommonModule } from '@angular/common';
import { ComplementariaImmexComponent } from '../../components/complementaria-immex/complementaria-immex.component';
import { PASOS_EXPORTACION } from '../../constantes/modificacion.enum';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { SolicitudService } from '../../services/solicitud.service';
import { Tramite80301Query } from '../../estados/tramite80301.query';
import { buildGuardarPayload } from '../../mappers/guardar.mapper';

/**
 * Componente para gestionar la página de registro y modificación.
 * Este componente utiliza un asistente (wizard) para guiar al usuario a través de los pasos necesarios.
 */
@Component({
  selector: 'app-registro-modificacion-page',
  templateUrl: './registro-modificacion-page.component.html',
  standalone: true,
  imports: [
    CommonModule,
    WizardComponent,
    PasoUnoComponent,
    BtnContinuarComponent,
    PasoFirmaComponent,
    PasoCargaDocumentoComponent,
    NotificacionesComponent,
    ComplementariaImmexComponent,
  ],
})
/**
 * Clase que representa la página de registro y modificación.
 * @class RegistroModificacionPageComponent
 */
export class RegistroModificacionPageComponent implements OnInit, OnDestroy {
  /**
   * Lista de pasos que se deben completar en el asistente.
   * Se obtiene de una constante predefinida.
   */
  pasosSolicitar: ListaPasosWizard[] = PASOS_EXPORTACION;

  /**
   * Servicio para gestión del wizard
   * @type {WizardService}
   * @description Servicio inyectado para manejar la lógica y el estado del componente wizard
   * @readonly
   */
  wizardService = inject(WizardService);

  /**
   * Índice del paso actual en el asistente.
   * Este índice se utiliza para rastrear el progreso del usuario.
   */
  indice: number = 1;

  /**
   * Referencia al componente del asistente (wizard).
   * Permite interactuar directamente con el asistente para avanzar o retroceder pasos.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Objeto que contiene información sobre el número total de pasos y los textos de los botones.
   * Este objeto se utiliza para configurar dinámicamente el asistente.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasosSolicitar.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * ID de la solicitud actual.
   * Se utiliza para identificar de manera única la solicitud en el sistema.
   * @type {number}
   */
  idSolicitud: number = 0;

  /**
   * Estado de la solicitud actual.
   * Se utiliza para almacenar y gestionar la información relacionada con la solicitud.
   * @type {Solicitud80301State}
   */
  solicitudState!: Solicitud80301State;

  /**
   * Evento que se emite cuando se deben cargar archivos.
   * Este evento notifica a los componentes hijos que deben iniciar el proceso de carga de archivos.
   * @type {EventEmitter<void>}
   */
  cargarArchivosEvento = new EventEmitter<void>();

  /**
   * Evento que se emite para regresar a la sección de carga de documentos.
   * Este evento se utiliza para notificar a otros componentes que se debe regresar a la sección de carga de documentos.
   */
  regresarSeccionCargarDocumentoEvento = new EventEmitter<void>();

  /**
   * Indica si el botón para cargar archivos está habilitado.
   */
  activarBotonCargaArchivos: boolean = false;

  /**
   * Indica si la sección de carga de documentos está activa.
   * Se inicializa en true para mostrar la sección de carga de documentos al inicio.
   */
  seccionCargarDocumentos: boolean = true;

  /**
   * Indica si la carga de archivos está en progreso.
   */
  cargaEnProgreso: boolean = true;

  /**
   * Folio temporal de la solicitud.
   * Se utiliza para mostrar el folio en la notificación de éxito.
   */
  public alertaNotificacion!: Notificacion;

  /**
   * Estado actual de la consulta para el componente.
   * @type {ConsultaioState}
   */
  public consultaState!: ConsultaioState;

  /**
   * Subject utilizado para notificar cuando se debe completar y limpiar las suscripciones activas.
   * Esto evita fugas de memoria al completar las suscripciones cuando el componente es destruido.
   * @type {Subject<void>}
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor para inicializar el componente.
   * @param tramite80301Store tienda de estado para el trámite 80301.
   * @param tramite80301Query consulta para el trámite 80301.
   * @param solicitudService servicio para manejar las solicitudes.
   * @param consultaQuery Servicio de consulta para realizar operaciones de consulta.
   */
  constructor(
    public tramite80301Store: Tramite80301Store,
    public tramite80301Query: Tramite80301Query,
    public solicitudService: SolicitudService,
    private consultaQuery: ConsultaioQuery
  ) {
    this.tramite80301Query.selectSolicitud$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((solicitud) => {
        this.solicitudState = solicitud;
      });
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * Carga el ID de la solicitud.
   * @returns {void}
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

    this.buscarIdSolicitud();
  }

  /**
   * Método para buscar el ID de la solicitud.
   * Realiza una llamada al servicio para obtener el ID de la solicitud y lo almacena en el estado del trámite.
   * @returns {void}
   */
  buscarIdSolicitud(): void {
    const PAYLOAD = {
      idPrograma: this.solicitudState.selectedIdPrograma || '',
      tipoPrograma: this.solicitudState.selectedTipoPrograma || ''
    };

    this.solicitudService
      .buscarIdSolicitud(PAYLOAD)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((respuesta) => {
        this.tramite80301Store.setBuscarIdSolicitud(
          respuesta.datos?.buscaIdSolicitud.replace(REGEX_COMAS_FINALES, '').split(',') || []
        );
      });
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
   * Actualiza el estado de la carga en progreso.
   * @param carga Indica si la carga está en progreso o no.
   * {void} No retorna ningún valor.
   */
  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
  }

  /**
   * Método para navegar a la siguiente sección del wizard.
   * Realiza la validación de los documentos cargados y actualiza el índice y el estado de los pasos.
   * {void} No retorna ningún valor.
   */
  siguiente(): void {
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
   * Obtiene el valor del índice de la acción del botón.
   * @param e Acción del botón.
   * {void} No retorna ningún valor.
   */
  getValorIndice(e: AccionBoton): void {
    if (e.valor > 0 && e.valor <= this.pasosSolicitar.length) {
      const NEXT_INDEX =
        e.accion === 'cont'
          ? e.valor + 1
          : e.accion === 'ant'
          ? e.valor - 1
          : e.valor;
      if (!this.consultaState.readonly && e.accion === 'cont') {
        this.shouldNavigate$().subscribe((shouldNavigate) => {
          if (shouldNavigate) {
            this.indice = NEXT_INDEX;
            this.datosPasos.indice = NEXT_INDEX;
            this.wizardService.cambio_indice(NEXT_INDEX);
            this.wizardComponent.siguiente();
            this.mostrarPlantilla();
          } else {
            this.indice = e.valor;
            this.datosPasos.indice = e.valor;
          }
        });
      } else if (e.accion === 'cont') {
        this.shouldNavigate$().subscribe((shouldNavigate) => {
          if (shouldNavigate) {
            this.indice = NEXT_INDEX;
            this.datosPasos.indice = NEXT_INDEX;
            this.wizardService.cambio_indice(NEXT_INDEX);
            this.wizardComponent.siguiente();
            this.mostrarPlantilla();
          } else {
            this.indice = e.valor;
            this.datosPasos.indice = e.valor;
          }
        });
      } else {
        this.indice = NEXT_INDEX;
        this.datosPasos.indice = NEXT_INDEX;
        this.wizardComponent.atras();
      }
    }
  }

  /**
   * Método que determina si se debe navegar al siguiente paso.
   * Realiza la operación de guardado y retorna un observable que indica si se debe navegar.
   * @returns {Observable<boolean>} Observable que indica si se debe navegar al siguiente paso.
   */
  private shouldNavigate$(): Observable<boolean> {
    return this.solicitudService.getAllState().pipe(
      take(1),
      switchMap((data) => this.guardar(data)),
      map(() => {
        return true;
      })
    );
  }

  /**
   * Método para guardar los datos de la solicitud.
   * Realiza una llamada al servicio para guardar los datos y actualiza el ID de la solicitud en el estado del trámite.
   * @param item Datos de la solicitud a guardar.
   * @returns {Promise<JSONResponse>} Promesa que resuelve la respuesta del servicio de guardado.
   */
  guardar(item: Solicitud80301State): Promise<JSONResponse> {
    const PAYLOAD = buildGuardarPayload(item);

    return new Promise((resolve, reject) => {
      this.solicitudService
        .postGuardarDatos(PAYLOAD)
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe(
          (response) => {
            const API_RESPONSE = doDeepCopy(response);
            if (
              esValidObject(API_RESPONSE) &&
              esValidObject(API_RESPONSE.datos)
            ) {
              if (getValidDatos(API_RESPONSE.datos.id_solicitud)) {
                this.idSolicitud = API_RESPONSE.datos.id_solicitud ?? 0;
                this.tramite80301Store.setIdSolicitud(
                  API_RESPONSE.datos.id_solicitud ?? 0
                );
              }
            }
            resolve(response);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  /**
   * Muestra una plantilla de notificación de éxito.
   * {void} No retorna ningún valor.
   */
  mostrarPlantilla(): void {
    this.alertaNotificacion = {
      tipoNotificacion: 'banner',
      categoria: 'success',
      modo: 'action',
      titulo: '',
      mensaje: MSG_REGISTRO_EXITOSO(String(this.idSolicitud)),
      cerrar: true,
      txtBtnAceptar: '',
      txtBtnCancelar: '',
    };
  }

  /**
   * Método que se ejecuta cuando el componente es destruido.
   * Notifica a todos los observables que deben completarse y cancela las suscripciones activas.
   * Esto asegura que no haya fugas de memoria.
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}