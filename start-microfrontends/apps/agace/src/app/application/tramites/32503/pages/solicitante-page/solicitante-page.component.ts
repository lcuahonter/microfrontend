import { AVISO, DatosPasos } from '@ng-mf/data-access-user';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AccionBoton } from '../../models/aviso-traslado.model';
import { ListaPasosWizard } from '@ng-mf/data-access-user';
import { PASOS } from '../../constants/aviso-traslado.enum';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { Subject } from 'rxjs';
import { TEXTOS } from '../../constants/aviso-traslado.enum';
import { Tramite32503Query } from '../../../../estados/queries/tramite32503.query';
import { Tramite32503State } from '../../../../estados/tramites/tramite32503.store';
import { Tramite32503Store } from '../../../../estados/tramites/tramite32503.store';
import { WizardComponent } from '@libs/shared/data-access-user/src';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';


/**
 * Componente para gestionar la página del solicitante.
 * 
 * Este componente permite al usuario navegar entre los pasos del wizard y gestionar
 * las acciones relacionadas con el trámite, como avanzar o retroceder entre los pasos.
 */
@Component({
  selector: 'app-solicitante-page',
  templateUrl: './solicitante-page.component.html',
  styleUrl: './solicitante-page.component.scss',
})
export class SolicitantePageComponent implements OnInit, OnDestroy {
  /**
    * Lista de pasos del wizard.
    * 
    * Esta propiedad contiene un array de objetos `ListaPasosWizard` que representan
    * los pasos del wizard.
    */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * Índice del paso activo en el wizard.
   * 
   * Esta propiedad indica el paso actual en el wizard, comenzando desde 1.
   */
  indice: number = 1;

  /**
   * Textos utilizados en el componente.
   * 
   * Esta propiedad contiene textos como instrucciones o mensajes que se muestran
   * en la interfaz del usuario.
   */
  TEXTOS = TEXTOS;

  /**
   * @property {any} AVISO
   * @description Constante que contiene información o configuraciones relacionadas con el aviso de traslado.
   * 
   * Esta propiedad se utiliza para acceder a valores predefinidos o configuraciones específicas
   * relacionadas con el aviso dentro del componente.
   * 
   * @example
   * // Uso de la constante AVISO
   */
  AVISO = AVISO;

  /**
   * @property {boolean} showValidationAlert
   * @description Indica si se debe mostrar la alerta de validación cuando faltan campos por capturar.
   * @default false
   */
  showValidationAlert: boolean = false;

  /**
   * Notificador para destruir las suscripciones y evitar fugas de memoria.
   * 
   * Este `Subject` se utiliza para cancelar las suscripciones activas cuando
   * el componente se destruye.
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado actual del trámite.
   * 
   * Esta propiedad almacena el estado del trámite obtenido desde el store.
   */
  public tramiteState!: Tramite32503State;

  /**
   * Referencia al componente `WizardComponent`.
   * 
   * Esta propiedad utiliza `@ViewChild` para obtener una referencia al componente
   * del wizard dentro de la plantilla.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Referencia al componente `PasoUnoComponent`.
   * 
   * Esta propiedad utiliza `@ViewChild` para obtener una referencia al componente
   * del paso uno dentro de la plantilla.
   */
  @ViewChild(PasoUnoComponent) pasoUnoComponent!: PasoUnoComponent;

  /**
   * Datos relacionados con los pasos del wizard.
   * 
   * Esta propiedad contiene información como el número total de pasos, el índice
   * del paso actual y los textos de los botones "Anterior" y "Continuar".
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Constructor del componente.
   * 
   * @param {Tramite32503Store} store - Store para gestionar el estado del trámite.
   * @param {Tramite32503Query} tramiteQuery - Query para obtener el estado del trámite.
   */
  constructor(
    public store: Tramite32503Store,
    public tramiteQuery: Tramite32503Query
  ) {
    // El constructor se utiliza para la inyección de dependencias.
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * 
   * Este método suscribe al estado del trámite y actualiza la propiedad `tramiteState`
   * con los datos obtenidos.
   */
  ngOnInit(): void {
    // Inicializar el estado de los pasos
    this.updateStepsActiveStatus();
    
    this.tramiteQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.tramiteState = seccionState;
        })
      )
      .subscribe();
  }
  /**
     * Método para manejar las acciones de los botones del wizard.
     * 
     * Este método actualiza el índice del paso activo y avanza o retrocede en el wizard
     * dependiendo de la acción recibida. Incluye validación de formularios antes de continuar.
     * 
     * @param {AccionBoton} e - Objeto que contiene la acción (`cont` o `atras`) y el valor del índice.
     */
  getValorIndice(e: AccionBoton): void {
    // Si la acción es continuar desde el paso 1, validar formularios
    if (e.accion === 'cont' && this.indice === 1) {
      if (!this.validateCurrentStep()) {
        this.showValidationAlert = true;
        return; // No continuar si hay errores de validación
      }
    }

    // Ocultar alerta de validación si se puede continuar
    this.showValidationAlert = false;

    // Calcular el nuevo índice basado en la acción
    let newIndex = this.indice;
    if (e.accion === 'cont' && this.indice < this.pasos.length) {
      newIndex = this.indice + 1;
    } else if (e.accion === 'ant' && this.indice > 1) {
      newIndex = this.indice - 1;
    }

    // Verifica si el valor está en el rango adecuado
    if (newIndex > 0 && newIndex <= this.pasos.length) {
      // Actualiza el índice del paso
      this.indice = newIndex;
      
      // Actualiza datosPasos para sincronizar con el botón
      this.datosPasos.indice = this.indice;
      
      // Actualiza el estado activo de los pasos
      this.updateStepsActiveStatus();

      // Dependiendo de la acción, avanza o retrocede en el wizard
      if (e.accion === 'cont') {
        // Si la acción es 'cont', avanza al siguiente paso
        this.wizardComponent.siguiente();
      } else if (e.accion === 'ant') {
        // Si la acción es 'ant', retrocede al paso anterior
        this.wizardComponent.atras();
      }

      // Actualiza el paso activo en el store
      this.store.setPasoActivo(this.indice);
    }
  }

  /**
   * @method validateCurrentStep
   * @description Valida los formularios del paso actual.
   * @returns {boolean} true si todos los formularios son válidos, false en caso contrario.
   */
  private validateCurrentStep(): boolean {
    // Obtener el estado actual del formulario desde el store
    const AVISO_FORMULARIO = this.tramiteState?.avisoFormulario;
    
    // Lista de campos requeridos en el formulario de aviso
    const REQUIRED_FIELDS = [
      'valorProgramaImmex',
      'valorAnioProgramaImmex', 
      'tipoAviso',
      'motivoProrroga',
      'fechaTranslado',
      'claveEntidadFederativa',
      'claveDelegacionMunicipio',
      'claveColonia',
      'calle',
      'numeroExterior',
      'codigoPostal',
      'tipoCarga'
    ];

    // Verificar si algún campo requerido está vacío
    for (const FIELD of REQUIRED_FIELDS) {
      const VALUE = AVISO_FORMULARIO?.[FIELD as keyof typeof AVISO_FORMULARIO];
      if (!VALUE || (typeof VALUE === 'string' && VALUE.trim() === '')) {
        // Activar validación visual en los componentes
        if (this.pasoUnoComponent) {
          this.pasoUnoComponent.triggerValidation();
        }
        return false;
      }
    }

    return true;
  }

  /**
   * @method closeValidationAlert
   * @description Cierra la alerta de validación.
   */
  closeValidationAlert(): void {
    this.showValidationAlert = false;
  }

  /**
   * @method updateStepsActiveStatus
   * @description Actualiza el estado activo de todos los pasos basado en el índice actual.
   */
  private updateStepsActiveStatus(): void {
    this.pasos.forEach(step => {
      step.activo = step.indice === this.indice;
    });
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * 
   * Este método emite un valor al `destroyNotifier$` y lo completa para cancelar
   * todas las suscripciones activas y evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

}
