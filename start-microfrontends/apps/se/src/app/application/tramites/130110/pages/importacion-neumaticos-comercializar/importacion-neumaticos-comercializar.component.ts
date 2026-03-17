import { AVISO, DatosPasos, ERROR_FORMA_ALERT, JSONResponse, ListaPasosWizard, WizardComponent, esValidObject, getValidDatos } from '@libs/shared/data-access-user/src';
import { Component, EventEmitter, ViewChild } from '@angular/core';
import { Subject, take, takeUntil } from 'rxjs';
import { Tramite130110State, Tramite130110Store } from '../../../../estados/tramites/tramites130110.store';
import { AccionBoton } from '../../enums/accion-botton.enum';
import { ImportacionNeumaticosComercializarService } from '../../services/importacion-neumaticos-comercializar.service';
import { PASOS } from '../../constants/pasos.enum';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { ToastrService } from 'ngx-toastr';
import { Tramite130110Query } from '../../../../estados/queries/tramite130110.query';

@Component({
  selector: 'app-importacion-neumaticos-comercializar',
  templateUrl: './importacion-neumaticos-comercializar.component.html',
  styleUrl: './importacion-neumaticos-comercializar.component.scss',
})
export class ImportacionNeumaticosComercializarComponent {
       /**
   * @property {object} TEXTOS - Contiene constantes relacionadas con aviso y firma.
   * Se utiliza para manejar textos estáticos en la aplicación.
   */
       public TEXTOS = {
        AVISO,
      };
   /**
   * Lista de pasos del asistente (wizard) para solicitar la importación.
   * Los pasos se obtienen de la constante `PASOS_EXPORTACION`.
   */
   pasosSolicitar: ListaPasosWizard[] = PASOS;

   /**
    * Índice del paso actual en el asistente.
    * Representa el paso en el que se encuentra el usuario.
    * Valor inicial: 1.
    */
   indice: number = 1;
 
   /**
    * Índice de la pestaña activa.
    * Representa la pestaña seleccionada en el asistente.
    * Valor inicial: 1.
    */
   tabIndex: number = 1;
 
   /**
    * Referencia al componente `WizardComponent` del asistente.
    * Se utiliza para navegar entre los pasos del asistente.
    */
   @ViewChild(WizardComponent) wizardComponent!: WizardComponent;
 
   /**
    * Datos relacionados con los pasos del asistente.
    * Incluye el número total de pasos, el índice actual y los textos de los botones de navegación.
    */
   datosPasos: DatosPasos = {
     nroPasos: this.pasosSolicitar.length, // Número total de pasos
     indice: this.indice, // Índice del paso actual
     txtBtnAnt: 'Anterior', // Texto del botón "Anterior"
     txtBtnSig: 'Continuar', // Texto del botón "Continuar"
   };

  /**
  * Notificador para destruir los observables y evitar posibles fugas de memoria.
  * @private
  * @type {Subject<void>}
  */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado actual de la solicitud 110219.
   *
   * Esta propiedad mantiene la información de la solicitud en curso y
   * se sincroniza de manera reactiva con el store correspondiente.
   * Contiene los datos necesarios para representar y manipular
   * la solicitud dentro del componente.
   *
   * @type {Solicitud110219State}
   * @public
   */
  public solicitudState!: Tramite130110State;

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
   * @property {boolean} esFormaValido
   * @description
   * Indica si el formulario del paso actual es válido.
   * Se utiliza para mostrar mensajes de error o controlar la navegación en el asistente.
   */
  esFormaValido: boolean = false;

  /**
   * Contiene el mensaje HTML de error para el campo de cambio de modalidad.
   * Se utiliza para mostrar alertas de validación al usuario.
   * @type {string}
   */
  public formErrorAlert = ERROR_FORMA_ALERT;

  /**
   * Referencia al componente `PasoUnoComponent`.
   * Se utiliza para acceder a las funcionalidades del primer paso del asistente.
   */
  @ViewChild(PasoUnoComponent, { static: false }) pasoUnoComponent!: PasoUnoComponent;

  /**
   * Constructor del componente.
   */
  constructor(
    public importacionNeumaticosComercializarService: ImportacionNeumaticosComercializarService,
    private query: Tramite130110Query,
    private store: Tramite130110Store,
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
      const ISVALID = this.pasoUnoComponent?.solicitudComponent?.validarFormulario();
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
    this.importacionNeumaticosComercializarService
      .getAllState()
      .pipe(take(1))
      .subscribe((data) => {
        this.guardar(data);
      });
  }

  guardar(item: Tramite130110State): Promise<JSONResponse> {
    const PAYLOAD = {
      tipoDeSolicitud: "guardar",
      mercancia: this.importacionNeumaticosComercializarService.buildMercancia(item),
      id_solcitud:
        item.mostrarPartidas && item.mostrarPartidas.length > 0
          ? Number(item.mostrarPartidas[0].idSolicitud)
          : 0,
      cve_regimen: item.regimen,
      cve_clasificacion_regimen: item.clasificacion,
      productor: this.importacionNeumaticosComercializarService.buildProductor(),
      solicitante: this.importacionNeumaticosComercializarService.buildSolicitante(),
      representacion_federal: this.importacionNeumaticosComercializarService.buildRepresentacionFederal(item),
      entidades_federativas: this.importacionNeumaticosComercializarService.buildEntidadesFederativas(item),
      lista_paises: item.fechasSeleccionadas ?? [],
      tipo_solicitud_pexim: item.solicitud,
    };
    return new Promise((resolve, reject) => {
      this.importacionNeumaticosComercializarService.guardarDatosPost(PAYLOAD).subscribe(
        (response) => {
          if (esValidObject(response) && esValidObject(response['datos'])) {
            const DATOS = response['datos'] as { id_solicitud?: number };
            if (getValidDatos(DATOS.id_solicitud)) {
              this.store.setIdSolicitud(DATOS.id_solicitud ?? 0);
              this.pasoNavegarPor({ accion: 'cont', valor: 2 });
            } else {
              this.store.setIdSolicitud(0);
            }
          } else {
            this.toastr.error('Operación fallida. No se ha encontrado una configuracion valida del tramite.');
          }
          resolve({
            id: response['id'] ?? 0,
            descripcion: response['descripcion'] ?? '',
            codigo: response['codigo'] ?? '',
            mensaje: 'Operación exitosa.',
            data: response['data'] ?? response['datos'] ?? null,
            ...response,
          } as JSONResponse);
        },
        (error) => {
          reject(error);
          this.toastr.error('Error al buscar Mercancia');
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
