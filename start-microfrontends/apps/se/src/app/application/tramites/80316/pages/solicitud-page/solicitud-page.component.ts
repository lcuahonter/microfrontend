import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, DatosPasos, ERROR_FORMA_ALERT, ListaPasosWizard,PASOS, PasoCargaDocumentoComponent,PasoFirmaComponent,TituloComponent, WizardComponent, WizardService } from '@ng-mf/data-access-user';
import { Component, EventEmitter, OnDestroy,OnInit, ViewChild,inject,} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { Solicitud80316State, Tramite80316Store } from '../../estados/tramite80316.store';
import { doDeepCopy,esValidObject, getValidDatos } from '@ng-mf/data-access-user';
import { switchMap, take } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { PasoTresComponent } from '../paso-tres/paso-tres.component';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { REGEX_COMAS_FINALES } from '../../constantes/modificacion.enum';
import { SolicitudService } from '../../services/solicitud.service';
import { ToastrService } from 'ngx-toastr';
import { Tramite80316Query } from '../../estados/tramite80316.query';

/**
 * Texto de alerta para terceros.
 * Este texto se muestra cuando se registra una solicitud de manera temporal.
 */
const TERCEROS_TEXTO_DE_ALERTA = 'La solicitud ha quedado registrada con el número temporal 202757598 Éste no tiene validez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado a la solicitud al momento en que ésta sea firmada.';

/**
 * Interfaz que define la estructura de una acción de botón.
 */
interface AccionBoton {
  /**
   * La acción que se realizará (por ejemplo, avanzar o retroceder en el asistente).
   */
  accion: string;

  /**
   * El valor asociado a la acción (por ejemplo, el índice del paso al que se desea ir).
   */
  valor: number;
}

/**
 * Componente que representa la página de solicitud.
 * Este componente utiliza un asistente (wizard) para guiar al usuario a través de los pasos necesarios para completar una solicitud.
 */
@Component({
  templateUrl: './solicitud-page.component.html',
  styles: ``,
  standalone: true,
  imports: [
    AlertComponent,
    AnexarDocumentosComponent,
    BtnContinuarComponent,
    CommonModule,
    FormsModule,
    PasoDosComponent,
    PasoTresComponent,
    PasoUnoComponent,
    ReactiveFormsModule,
    TituloComponent,
    WizardComponent,
    PasoCargaDocumentoComponent,
    PasoFirmaComponent
  ],
})
export class SolicitudPageComponent implements OnInit, OnDestroy {
  /**
   * Texto de alerta mostrado al registrar una solicitud temporal.
   */
  TEXTO_DE_ALERTA: string = TERCEROS_TEXTO_DE_ALERTA;

  /**
   * Lista de pasos del asistente.
   * Define los pasos que el usuario debe completar en el asistente.
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
  * @property wizardService
  * @description
  * Inyección del servicio `WizardService` para gestionar la lógica y el estado del componente wizard.
  * @type {WizardService}
  */
  wizardService = inject(WizardService);

  /**
   * Índice del paso actual en el asistente.
   * Este índice se utiliza para determinar qué paso está activo.
   */
  indice: number = 1;

  /**
   * Referencia al componente del asistente (wizard).
   * Permite interactuar con el asistente, como avanzar o retroceder entre los pasos.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
    * Texto plano para la alerta de error del formulario.
    */
  public formErrorAlert = ERROR_FORMA_ALERT;
  /**
   * Indica si el formulario de modificación es válido.
   */
  public esModificacionValida: boolean = false;

  /**
 * Indica si la opción de peligro está activada.
 * Cuando es verdadero, representa que la condición de peligro está presente.
 */
  public isPeligro: boolean = false;

  /** Indica si el botón continuar ha sido activado para ejecutar las validaciones del formulario. */
  public isContinuarTriggered: boolean = false;
  /**
   * Datos de los pasos del asistente.
   * Incluye información como el número total de pasos, el índice actual y los textos de los botones.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /** Estado actual del trámite 120404 que contiene toda la información de la solicitud. */
  public solicitudState!: Solicitud80316State;
  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();
  /** Identificador único del procedimiento administrativo asociado al trámite de asignación directa. */
  private idProcedimiento: number = 80316;
  /**
   * Identificador de la solicitud guardada.
   * Se utiliza para almacenar el ID de la solicitud después de guardarla.
   */
  public guardarIdSolicitud: number = 0;
  /**
   * Constructor del componente.
   * @param store 
   * @param query 
   * @param servicio 
   */
  constructor(private store: Tramite80316Store, private query: Tramite80316Query, private servicio: SolicitudService,
    private toastrService: ToastrService,
    public solicitudService: SolicitudService
  ) { }

  /**
   * Método del ciclo de vida de Angular que se llama cuando el componente es inicializado.
   * Aquí se suscribe al estado de la solicitud para obtener los datos actuales.
   */
  ngOnInit(): void {
    this.query.selectSolicitud$.pipe(
      takeUntil(this.destroyNotifier$),
      map((data) => {
        this.solicitudState = data;
      })
    ).subscribe();

     this.buscarIdSolicitud();
  }

  /**
     * Método para buscar el ID de la solicitud.
     * Realiza una llamada al servicio para obtener el ID de la solicitud y lo almacena en el estado del trámite.
     * @returns {void}
     */
    buscarIdSolicitud(): void {
      const PAYLOAD = {
        idPrograma: this.solicitudState.selectedIdPrograma,
        tipoPrograma: this.solicitudState.selectedTipoPrograma
      };
  
      this.solicitudService
        .buscarIdSolicitud(PAYLOAD)
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((respuesta) => { 
          this.store.setBuscarIdSolicitud(
            respuesta.datos?.buscaIdSolicitud.replace(REGEX_COMAS_FINALES, '').split(',') || []
          );
        });
    }
  /**
   * Selecciona una pestaña del asistente.
   * Cambia el índice del paso activo en el asistente.
   * 
   * @param i Índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }
  
  /**
   * Maneja la validez del formulario de modificación.
   * @param valid 
   */
  onModificacionValidity(valid: boolean): void {
    this.esModificacionValida = valid;
  }
  /**
   * Obtiene el valor del índice de la acción del botón.
   * Cambia el paso activo en el asistente según la acción del botón (avanzar o retroceder).
   * 
   * @param e Acción del botón.
   */
  getValorIndice(e: AccionBoton): void {
    const NEXT_INDEX =
      e.accion === 'cont' ? e.valor + 1 :
        e.accion === 'ant' ? e.valor - 1 :
          e.valor;

    if (this.indice === 1 && e.accion === 'cont') {
      this.store.setContinuarTriggered(true);
      const ES_VALIDO = this.validarFormulariosPasoActual();
      if (!ES_VALIDO) {
        this.isPeligro = true;
        return;
      }
      this.isPeligro = false;
    }

    if (e.valor > 0 && e.valor < this.pasos.length) {
      if (e.accion === 'cont') {
        if (this.indice === 1) {
          this.shouldNavigate$()
            .subscribe((shouldNavigate) => {
              if (shouldNavigate) {
                this.indice = NEXT_INDEX;
                this.datosPasos.indice = NEXT_INDEX;
                this.wizardService.cambio_indice(NEXT_INDEX);
                this.wizardComponent.siguiente();
              } else {
                this.indice = e.valor;
                this.datosPasos.indice = e.valor;
              }
            });
        } else {
          this.indice = NEXT_INDEX;
          this.datosPasos.indice = NEXT_INDEX;
          this.wizardService.cambio_indice(NEXT_INDEX);
          this.wizardComponent.siguiente();
        }
      } else {
        this.indice = NEXT_INDEX;
        this.datosPasos.indice = NEXT_INDEX;
        this.wizardComponent.atras();
      }
    }
  }
  /**
  * Valida los formularios del paso actual antes de permitir continuar.
  * @returns {boolean} - `true` si los formularios son válidos, `false` en caso contrario.
  */
  validarFormulariosPasoActual(): boolean {
    return this.esModificacionValida;
  }

  /**
        * Verifica si se debe navegar al siguiente paso.
        * Realiza una llamada para guardar los datos actuales y determina si la navegación es posible.
        * @return {Observable<boolean>} Un observable que emite true si se puede navegar, false en caso contrario.
        */
  private shouldNavigate$(): Observable<boolean> {
    return this.solicitudService.getAllState().pipe(
      take(1),
      switchMap(data => this.guardar(data)),
      map((response) => {
        const API_DATOS = doDeepCopy(response)
        const OK = API_DATOS.codigo === '00';
        if (OK) {
          this.toastrService.success(API_DATOS.mensaje);
        } else {
          this.toastrService.error(API_DATOS.mensaje);
        }
        return OK;
      })
    );
  }

  /**
       * Guarda los datos proporcionados mediante una solicitud HTTP POST.
       * @param data - Los datos que se desean guardar.
       * @returns {Promise<unknown>} Una promesa que se resuelve con la respuesta de la solicitud POST.
       */
  public guardar(data: Record<string, unknown>): Promise<unknown> {
    const PAYLOAD = this.solicitudService.buildPayload(data);
    return new Promise((resolve, reject) => {
      this.solicitudService.guardarDatosPost(this.idProcedimiento.toString(), PAYLOAD).subscribe({
        next: (response) => {
          const RESPONSE = doDeepCopy(response);
          if (esValidObject(RESPONSE) && esValidObject(RESPONSE['datos'])) {
            const DATOS = RESPONSE['datos'] as { id_solicitud?: number };
            if (getValidDatos(DATOS.id_solicitud)) {
              this.guardarIdSolicitud = DATOS.id_solicitud ?? 0;
              this.store.setIdSolicitud(DATOS.id_solicitud ?? 0);
            } else {
              this.store.setIdSolicitud(0);
            }
          }
          resolve(response);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }

/** Carga-documentos validation start */
/**
     * Evento que se emite para cargar archivos.
     * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de
     */
  cargarArchivosEvento = new EventEmitter<void>();

  /**
* Emite un evento para cargar archivos.
* {void} No retorna ningún valor.
*/
  onClickCargaArchivos(): void {
    this.cargarArchivosEvento.emit();
  }

   /**
 * Indica si se debe omitir o saltar un paso en el flujo del trámite.
 * Se utiliza para controlar la navegación condicional en el proceso.
 */
  isSaltar: boolean = false;

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


  /** Actualiza el estado de carga en progreso. */
  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
  }

  /**
 * Maneja el estado de si un campo obligatorio está en blanco.
 * Actualiza `isSaltar` para determinar si se debe omitir o saltar un paso en el flujo.
 */
  /**
   * Maneja el estado de si un campo obligatorio está en blanco.
   * @param enBlanco Indica si el campo obligatorio está en blanco.
   */
  onBlancoObligatoria(enBlanco: boolean): void {
    this.isSaltar = enBlanco;
  }

 /**
   * Navega al paso anterior del wizard
   * @method anterior
   * @description Retrocede un paso en el wizard y actualiza los índices correspondientes
   * @returns {void}
   */
  anterior(): void {
    this.wizardComponent.atras();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }

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
   * Indica si el botón para cargar archivos está habilitado.
   */
  activarBotonCargaArchivos: boolean = false;

/**
   * Navega al siguiente paso con validación de documentos
   * @method siguiente
   * @description Ejecuta la navegación al siguiente paso del wizard después de validar
   * que todos los documentos requeridos hayan sido cargados correctamente
   * @returns {void}
   */
  siguiente(): void {
    // Aqui se hara la validacion de los documentos cargdados
    this.wizardComponent.siguiente();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }
/** carga-documentos validation end */

  /**
   * Método del ciclo de vida de Angular que se llama justo antes de que el componente sea destruido.
   *
   * Este método emite un valor a través del observable `destroyNotifier$` para notificar a los suscriptores
   * que el componente está siendo destruido, y luego completa el observable para liberar recursos.
   *
   * @returns {void} No retorna ningún valor.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
