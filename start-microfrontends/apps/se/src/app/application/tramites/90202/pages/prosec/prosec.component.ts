import { AVISO, ERROR_FORMA_ALERT, ListaPasosWizard, PASOS, esValidObject, getValidDatos} from '@libs/shared/data-access-user/src';
import { AutorizacionProsecStore, ProsecState } from '../../estados/autorizacion-prosec.store';
import { Component, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Subject, map, takeUntil } from 'rxjs';

import { DatosPasos } from '@libs/shared/data-access-user/src/core/models/shared/components.model';
import {PASOS_PROSEC_90202} from '../../constants/pasos.enum';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { ToastrService } from 'ngx-toastr';

import { AUtorizacionProsecQuery } from '../../estados/autorizacion-prosec.query';
import { GuardarMappingAdapter } from '../../adapters/guardar-mapping.adapter';
import { ProsecService } from '../../services/prosec.service';
import { RegistroSolicitudService } from '@libs/shared/data-access-user/src';

import { WizardComponent } from '@libs/shared/data-access-user/src/tramites/components/wizard/wizard.component';


/**
 * Interfaz para definir la estructura de los botones de acción.
 * Contiene la acción y el valor del botón.
 */
interface AccionBoton {
  accion: string;
  valor: number;
}

/**
 * Componente principal para la gestión de prosec.
 * Contiene la lógica y la estructura del asistente de prosec.
 */
@Component({
  selector: 'app-prosec',
  templateUrl: './prosec.component.html',
})
export class ProsecComponent implements OnInit, OnDestroy {
    private representacionFederalReady = false;
  /**
   * RFC del usuario logueado
   */
  loginRfc: string = '';
  pasos: ListaPasosWizard[] = PASOS_PROSEC_90202;
  indice: number = 1;
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

   /**
       * ID del estado de la solicitud.
       * @type {number | null}
       */
  idSolicitudState: number = 90202; 
  idSolicitud: number = 0;
  public solicitudState!: ProsecState;
  /**
       * @property {boolean} cargaEnProgreso
       * @description
       * Indica si hay una operación de carga en progreso. Utilizado para mostrar
       * indicadores de carga y prevenir acciones concurrentes durante procesos.
       * 
       * @loading_indicator Estado de carga en progreso
       * @ui_feedback Feedback visual para usuario
       * @concurrent_prevention Prevención de operaciones concurrentes
       * @default true - Inicia con carga activa
       */
  cargaEnProgreso: boolean = true;
  tramiteId: string = '90202';
  destroyNotifier$: Subject<void> = new Subject();
  TEXTOS = AVISO;
  @ViewChild('pasoUnoRef') pasoUnoComponent!: PasoUnoComponent;
  public formErrorAlert = ERROR_FORMA_ALERT;
  esFormaValido: boolean = false;
  infoError = 'alert-danger text-center';



    /**
     * Identificador del tipo de trámite.
     * @type {string}
     */
    idTipoTramite: string = '90202';
  
  
    
  
    
    /**
     * Controla la visibilidad del modal de alerta.
     * @property {boolean} mostrarAlerta
     */
  esMostrarAlerta: boolean = false;

  
      /**
     * @property {boolean} isSaltar
     * @description
     * Indica si se debe saltar al paso de firma. Controla la navegación
     * directa al paso de firma en el wizard.
     * @default false - No salta por defecto
     */
    isSaltar: boolean = false;
  

  constructor(
    private toastrService: ToastrService,
    private registroSolicitudService: RegistroSolicitudService,
    private store: AutorizacionProsecStore,
    public tramiteQuery: AUtorizacionProsecQuery,
    private prosecService: ProsecService // <-- Inject ProsecService
  ) {}

  ngOnInit(): void {
    this.tramiteQuery.selectProsec$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      ).subscribe();
  }

  getValorIndice(e: AccionBoton): void {
    if (e.accion === 'cont') {
      let isValid = true;
      if (this.indice === 1 && this.pasoUnoComponent) {
        isValid = this.pasoUnoComponent.validarFormularios();
      }
      if (!isValid) {
        this.formErrorAlert = ERROR_FORMA_ALERT;
        this.esFormaValido = true;
        this.datosPasos.indice = this.indice;
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
        return;
      }
      const PAYLOAD = GuardarMappingAdapter.toFormPayload(this.solicitudState);
      this.registroSolicitudService.postGuardarDatos(this.tramiteId, PAYLOAD).subscribe(response => {
        const SHOULD_NAVIGATE = response.codigo === '00';
        if (!SHOULD_NAVIGATE) {
          this.esFormaValido = true;
          this.indice = 1;
          this.datosPasos.indice = 1;
          this.wizardComponent.indiceActual = 1;
          setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
          return;
        }
        this.esFormaValido = false;
        if (esValidObject(response) && esValidObject(response.datos)) {
          const DATOS = response.datos as { id_solicitud?: number };
          this.idSolicitudState = getValidDatos(DATOS.id_solicitud) ? (DATOS.id_solicitud ?? 0) : 0;
          this.solicitudState.idSolicitud = this.idSolicitudState;
          this.store.setIdSolicitud(this.idSolicitudState);
        }
        this.toastrService.success(response.mensaje);
        this.indice = 2;
        this.datosPasos.indice = 2;
        this.wizardComponent.siguiente();
      });
    } else {
      this.indice = e.valor;
      this.datosPasos.indice = this.indice;
      this.wizardComponent.atras();
    }
  }


  siguiente(): void {
    this.wizardComponent.siguiente();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }

  anterior(): void {
    this.wizardComponent.atras();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }



  /**
  * @method onCargaEnProgreso
  * @description
  * Método para manejar el estado de progreso de carga de archivos.
  * Actualiza la bandera de carga en progreso para controlar UI y
  * prevenir acciones concurrentes durante procesos de carga.
  * 
  * @param {boolean} carga - Indica si hay una operación de carga en progreso
  *                         (true) o si ha terminado (false)
  * 
  * @loading_state_management
  * Controla estado de carga para:
  * - Mostrar/ocultar indicadores de progreso
  * - Habilitar/deshabilitar botones durante carga
  * - Prevenir acciones concurrentes
  * - Proporcionar feedback visual al usuario
  * 
  * @ui_feedback
  * Actualiza `cargaEnProgreso` para:
  * - Mostrar spinners o barras de progreso
  * - Deshabilitar botones durante operaciones
  * - Indicar estado de procesamiento
  * - Mejorar experiencia de usuario
  * 
  * @concurrent_operation_control
  * Previene:
  * - Múltiples cargas simultáneas
  * - Navegación durante procesos
  * - Acciones conflictivas
  * - Corrupción de datos
  * 
  * @param {boolean} carga
  * @returns {void}
  * @loading_indicator_controller
  */
 onCargaEnProgreso(carga: boolean): void {
  this.cargaEnProgreso = carga;
}


  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
