import { AccionBoton, DatosPasos, JSONResponse, ListaPasosWizard, PASOS, WizardComponent } from '@libs/shared/data-access-user/src';
import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { Solicitud90304State, Tramite90304Store } from '../../estados/tramite90304.store';
import { Subject, map, take, takeUntil } from 'rxjs';
import { esValidObject, getValidDatos } from '@ng-mf/data-access-user';
import { ALERTA_ERROR } from '../../constantes/prosec.enum';
import { ProsecService } from '../../services/prosec/prosec.service';
import { ToastrService } from 'ngx-toastr';
import { Tramite90304Query } from '../../estados/tramite90304.query';

/**
 * Componente principal para la gestión de pantallas en el wizard de cupos.
 */
@Component({
  selector: 'app-pantallas',
  templateUrl: './pantallas.component.html',
  styles: ``
})
export class PantallasComponent implements OnInit {
  /**
   * Lista de pasos del wizard.
   * @type {ListaPasosWizard[]}
   */
  public pantallasPasos: ListaPasosWizard[] = PASOS;

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
   * Indica si el elemento está en estado de baja.
   * @type {boolean}
   * @default true
   */
  isBaja: boolean = true;
  
  /** Asigna el mensaje de error ALERTA_PRODUCTORAS_ERROR*/
  ALERTA_PRODUCTORAS_ERROR = ALERTA_ERROR;

  /**
   * Indica si se debe mostrar un mensaje de error al agregar.
   * @type {boolean}
   */
  esFormaValido: boolean = false;

  /**
   * Una cadena que representa la clase CSS para una alerta de error.
   */
  infoError = 'alert-danger';

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
     * Indica si la sección de carga de documentos está visible.
     * @type {boolean}
     * @default false
     */
    seccionCargarDocumentos: boolean = false;
  
    /**
     * Indica si hay una carga en progreso.
     * @type {boolean}
     * @default false
     */
    cargaEnProgreso: boolean = false;
  
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
    public solicitudState!: Solicitud90304State;

    /**
     * Subject utilizado para destruir observables y evitar memory leaks.
     * @type {Subject<void>}
     */
    public destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor del componente PantallasComponent.
   * @param prosecService Servicio para gestionar el estado de baja.
   * @param store Store para manejar el estado de la solicitud 90304.
   * @param tramiteQuery Query para obtener datos del estado de la solicitud.
   * @param toastr Servicio para mostrar notificaciones toast.
   */
  constructor( private prosecService: ProsecService, private store: Tramite90304Store, private tramiteQuery: Tramite90304Query, private toastr: ToastrService) { 
    this.tramiteQuery.selectSolicitud$
            .pipe(takeUntil(this.destroyNotifier$))
            .subscribe((solicitud) => {
              this.solicitudState = solicitud;
            });
   }

  /**
   * Método de inicialización del componente.
   * Suscribe al observable isBaja$ para actualizar el estado local.
   */
  ngOnInit(): void {
    this.tramiteQuery.selectSolicitud$
          .pipe(
            takeUntil(this.destroyNotifier$),
            map((seccionState) => {
              this.solicitudState = seccionState;
            })
          )
          .subscribe();
    this.prosecService.isBaja$.subscribe(val => { this.isBaja = val; });
  }
  
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
    const ISBAJA = this.store.getValue().isBaja;
    this.esFormaValido = false;
  
    if (this.indice === 1 && e.accion === 'cont') {
      this.datosPasos.indice = 1;
  
      // const ISVALID = this.validarTodosFormulariosPasoUno();
      // if (!ISVALID) {
      //   this.esFormaValido = true;
      //   return;
      // }
  
      this.obtenerDatosDelStore();
    } else if (e.valor > 0 && e.valor <= this.pantallasPasos.length) {
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
    this.prosecService
      .getAllState()
      .pipe(take(1))
      .subscribe((data) => {
        this.guardar(data);
      });
  }

  /**
   * Guarda los datos de la solicitud utilizando el servicio.
   * @param item Estado de la solicitud 90304 a guardar.
   * @returns Promise con la respuesta JSON del servidor.
   */
  guardar(item: Solicitud90304State): Promise<JSONResponse> {
    const PAYLOAD = {
      ...item,
    };

    return new Promise((resolve, reject) => {
      this.prosecService.guardarDatosPost(PAYLOAD).subscribe(
        (response) => {
          if (esValidObject(response) && esValidObject(response['datos'])) {
            const DATOS = response['datos'] as { id_solicitud?: number };
            if (getValidDatos(DATOS.id_solicitud)) {
              this.store.setIdSolicitud(DATOS.id_solicitud ?? 0);
              this.pasoNavegarPor({ accion: 'cont', valor: 2 });
            } else {
              this.store.setIdSolicitud(0);
            }
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
            this.toastr.error('Error al guardar el certificado.');
        }
      );
    });
  }

  /**
   * Método para manejar el evento de carga de documentos.
   * Actualiza el estado del botón de carga de archivos.
   * @param carga Indica si la carga de documentos está activa o no.
   * @returns {void} No retorna ningún valor.
   */
  manejaEventoCargaDocumentos(carga: boolean): void {
    this.activarBotonCargaArchivos = carga;
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
   * Actualiza el estado de la sección de carga de documentos.
   * @param cargaRealizada Indica si la carga de documentos se realizó correctamente.
   * @returns {void} No retorna ningún valor.
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