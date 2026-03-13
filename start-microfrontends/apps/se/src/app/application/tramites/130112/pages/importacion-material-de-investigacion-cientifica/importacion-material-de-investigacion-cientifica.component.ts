import {
  AVISO,
  DatosPasos,
  ERROR_FORMA_ALERT,
  JSONResponse,
  ListaPasosWizard,
  WizardComponent,
  esValidObject,
  getValidDatos,
} from '@libs/shared/data-access-user/src';
import { Component, EventEmitter, ViewChild } from '@angular/core';
import { Subject, take, takeUntil } from 'rxjs';
import {
  Tramite130112State,
  Tramite130112Store,
} from '../../estados/tramites/tramites130112.store';
import { AccionBoton } from '../../enums/accion-botton.enum';
import { ImportacionMaterialDeInvestigacionCientificaService } from '../../services/importacion-material-de-investigacion-cientifica.service';
import {
  MENSAJE_CORREGIR_ERRORES,
  PASOS_IMPORTACION,
} from '../../constants/importacion-material-de-investigacion-cientifica-pasos.enum';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { ToastrService } from 'ngx-toastr';
import { Tramite130112Query } from '../../estados/queries/tramite130112.query';

/**
 * @descripcion
 * Componente que representa la página principal del trámite de importación de material de investigación científica.
 * Este componente gestiona la lógica del asistente (wizard) para navegar entre los pasos del trámite.
 *
 * @selector app-importacion-material-de-investigacion-cientifica
 * @templateUrl ./importacion-material-de-investigacion-cientifica.component.html
 */
@Component({
  selector: 'app-importacion-material-de-investigacion-cientifica',
  templateUrl:
    './importacion-material-de-investigacion-cientifica.component.html',
})
export class ImportacionMaterialDeInvestigacionCientificaComponent {
  /**
   * @property {object} TEXTOS - Contiene constantes relacionadas con aviso y firma.
   * Se utiliza para manejar textos estáticos en la aplicación.
   */
  public TEXTOS = {
    AVISO,
  };
  /**
   * @descripcion
   * Lista de pasos del asistente para el trámite.
   * @type {ListaPasosWizard[]}
   */
  pasosSolicitar: ListaPasosWizard[] = PASOS_IMPORTACION;

  /**
   * Indica si el formulario actual es válido.
   */
  esFormaValido: boolean = false;

  /**
   * Notificador para destruir los observables y evitar posibles fugas de memoria.
   * @private
   * @type {Subject<void>}
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado actual de la solicitud 130112.
   *
   * Esta propiedad mantiene la información de la solicitud en curso y
   * se sincroniza de manera reactiva con el store correspondiente.
   * Contiene los datos necesarios para representar y manipular
   * la solicitud dentro del componente.
   *
   * @type {Tramite130112State}
   * @public
   */
  public solicitudState!: Tramite130112State;

  /**
   * Evento que se emite para cargar archivos.
   * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de
   */
  cargarArchivosEvento = new EventEmitter<void>();

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
   * Indica si la carga de datos está en progreso.
   * Se utiliza para mostrar indicadores de carga o deshabilitar acciones mientras se realiza una operación asíncrona.
   */
  cargaEnProgreso: boolean = true;

  /**
   * jest.spyOnIdentificador del procedimiento actual.
   * @type {number}
   */
  idProcedimiento: number = Number(130112);

  /**
   * Referencia al componente del primer paso para validar formularios.
   */
  @ViewChild(PasoUnoComponent) pasoUno!: PasoUnoComponent;

  /**
   * @descripcion
   * Índice del paso actual en el asistente.
   * @type {number}
   */
  indice: number = 1;

  /**
   * @descripcion
   * Índice de la pestaña seleccionada actualmente.
   * @type {number}
   */
  tabIndex: number = 1;

  /**
   * @descripcion
   * Referencia al componente del asistente (wizard).
   * @type {WizardComponent}
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * @descripcion
   * Datos de configuración del asistente, como el número de pasos y los textos de los botones.
   * @type {DatosPasos}
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasosSolicitar.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Contiene el mensaje HTML de error para el campo de cambio de modalidad.
   * Se utiliza para mostrar alertas de validación al usuario.
   * @type {string}
   */
  public formErrorAlert = ERROR_FORMA_ALERT;

  /**
   * Folio temporal asignado a la solicitud.
   * Se utiliza para identificar la solicitud durante el proceso de llenado del formulario.
   * @type {number}
   */
  folioTemporal: number = 0;

  /**
   * Referencia a la función generadora de mensajes de error relacionados
   * con el proceso de cálculo.
   */
  public MENSAJE_CORREGIR_ERRORES = MENSAJE_CORREGIR_ERRORES;

  /**
   * Constructor del componente.
   */
  constructor(
    public importacionMaterialDeInvestigacionCientificaService: ImportacionMaterialDeInvestigacionCientificaService,
    private query: Tramite130112Query,
    private store: Tramite130112Store,
    private toastr: ToastrService
  ) {
    this.query.selectSolicitud$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((solicitud) => {
        this.solicitudState = solicitud;
      });
  }

  /**
   * Método para actualizar el índice del paso actual en el asistente.
   * También navega al siguiente o al paso anterior según la acción especificada.
   *
   * Objeto de tipo `AccionBoton` que contiene:
   *  - `valor`: El nuevo índice del paso.
   *  - `accion`: La acción a realizar ('cont' para continuar o 'ant' para retroceder).
   */
  getValorIndice(e: AccionBoton): void {
    this.esFormaValido = false;
    if (this.indice === 1 && e.accion === 'cont') {
      this.datosPasos.indice = 1;
      const ISVALID = this.pasoUno?.solicitudComponent?.validarFormulario();
      if (!ISVALID) {
        this.esFormaValido = true;
        return;
      }
      this.obtenerDatosDelStore();
    } else if (e.valor > 0 && e.valor <= this.pasosSolicitar.length) {
      this.pasoNavegarPor(e);
    }
  }

  /**
   * Navega a través de los pasos del asistente según la acción del botón.
   * @param e Objeto que contiene la acción y el valor del índice al que se desea navegar.
   */
  pasoNavegarPor(e: AccionBoton): void {
    this.indice = e.valor;
    this.datosPasos.indice = e.valor;
    if (e.valor > 0 && e.valor < 5) {
      if (e.accion === 'cont') {
        this.wizardComponent.siguiente();
      } else {
        this.wizardComponent.atras();
      }
    }
  }

  /**
   * Obtiene los datos del store y los guarda utilizando el servicio.
   */
  obtenerDatosDelStore(): void {
    this.importacionMaterialDeInvestigacionCientificaService
      .getAllState()
      .pipe(take(1))
      .subscribe((data) => {
        this.guardar(data);
      });
  }

  /**
   * Guarda los datos del trámite en el backend.
   * @param item - Estado actual del trámite a guardar.
   * @returns Una promesa que resuelve la respuesta JSON del backend.
   */
  guardar(item: Tramite130112State): Promise<JSONResponse> {
    const PAYLOAD = {
      tipoDeSolicitud: 'guardar',
      tipo_solicitud_pexim: item.defaultSelect,
      mercancia:
        this.importacionMaterialDeInvestigacionCientificaService.buildMercancia(
          item
        ),
      id_solcitud: item.idSolicitud || 0,
      idTipoTramite: this.idProcedimiento,
      cve_regimen: item.regimen,
      cve_clasificacion_regimen: item.clasificacion,
      productor:
        this.importacionMaterialDeInvestigacionCientificaService.buildProductor(),
      solicitante:
        this.importacionMaterialDeInvestigacionCientificaService.buildSolicitante(),
      representacion_federal:
        this.importacionMaterialDeInvestigacionCientificaService.buildRepresentacionFederal(
          item
        ),
      entidades_federativas:
        this.importacionMaterialDeInvestigacionCientificaService.buildEntidadesFederativas(
          item
        ),
      lista_paises: item.fechasSeleccionadas ?? [],
    };
    return new Promise((resolve, reject) => {
      let shouldNavigate = false;
      this.importacionMaterialDeInvestigacionCientificaService
        .guardarDatosPost(PAYLOAD)
        .subscribe(
          (response) => {
            this.esFormaValido = false;

            if (response.codigo === '3' || response.codigo === 'APP-S001') {
              this.esFormaValido = true;
              this.formErrorAlert = this.MENSAJE_CORREGIR_ERRORES(
                (response as unknown as { error: string })['error'] || ''
              );
            }

            shouldNavigate = response.codigo === '00';
            if (shouldNavigate) {
              if (esValidObject(response) && esValidObject(response['datos'])) {
                const DATOS = response['datos'] as { id_solicitud?: number };
                if (getValidDatos(DATOS.id_solicitud)) {
                  this.folioTemporal = DATOS.id_solicitud ?? 0;
                  this.store.setIdSolicitud(DATOS.id_solicitud ?? 0);
                  this.pasoNavegarPor({ accion: 'cont', valor: 2 });
                } else {
                  this.store.setIdSolicitud(0);
                }
              }
            }
            this.toastr.success(response.mensaje);
            resolve(response);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  /**
   * Emite un evento para cargar archivos.
   * {void} No retorna ningún valor.
   */
  onClickCargaArchivos(): void {
    this.cargarArchivosEvento.emit();
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
   * Actualiza el estado de la carga en progreso.
   *
   * @param carga - Indica si la carga está en progreso (`true`) o no (`false`).
   */
  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
  }
}
