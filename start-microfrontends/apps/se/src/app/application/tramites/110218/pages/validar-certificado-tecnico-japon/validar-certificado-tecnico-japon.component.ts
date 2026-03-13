import { Component, ViewChild } from '@angular/core';
import {
  DatosPasos,
  ListaPasosWizard,
  PASOS,
  WizardComponent,
} from '@libs/shared/data-access-user/src';
import {
  Solicitud110218State,
  Tramite110218Store,
} from '../../estados/tramites/tramite110218.store';
import { Subject, takeUntil } from 'rxjs';
import { Tramite110218Query } from '../../estados/queries/tramite110218.query';

/**
 * Interfaz para definir la estructura de una acción de botón dentro del asistente.
 */
interface AccionBoton {
  /**
   * Tipo de acción del botón (por ejemplo, 'cont' para continuar, 'ant' para anterior).
   */
  accion: string;

  /**
   * Valor asociado a la acción del botón (por ejemplo, el índice del paso).
   */
  valor: number;
}

/**
 * Componente para validar el certificado técnico de Japón.
 * Este componente implementa un asistente (wizard) que guía al usuario en el proceso
 * de validación del certificado.
 *
 */
@Component({
  selector: 'app-validar-certificado-tecnico-japon',
  templateUrl: './validar-certificado-tecnico-japon.component.html',
})
export class ValidarCertificadoTecnicoJaponComponent {
  /**
   * Referencia al componente de pestañas del solicitante.
   */
  @ViewChild('solicitanteTabs') solicitanteTabsComponent:
    | { validarCamposObligatorios: () => boolean }
    | undefined;

  /**
   * Lista de pasos del asistente para la validación del certificado.
   */
  pasosSolicitar: ListaPasosWizard[] = PASOS;

  /**
   * Índice del paso actual en el asistente.
   */
  indice: number = 1;

  /**
   * Índice de la pestaña activa.
   */
  tabIndex: number = 1;

  /**
   * Referencia al componente del asistente (WizardComponent).
   * Permite la navegación entre los pasos del asistente.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Configuración de los pasos del asistente.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasosSolicitar.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Indica si se muestra el formulario de mercancía.
   */
  showMercanciaForm: boolean = true;

  /**
   * Captura el índice de la pestaña seleccionada.
   */
  capturarTapIndice: number = 1;

  /**
   * Notificador para destruir los observables y evitar posibles fugas de memoria.
   * @private
   * @type {Subject<void>}
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado actual de la solicitud 110218.
   *
   * Esta propiedad mantiene la información de la solicitud en curso y
   * se sincroniza de manera reactiva con el store correspondiente.
   * Contiene los datos necesarios para representar y manipular
   * la solicitud dentro del componente.
   *
   * @type {Solicitud110218State}
   * @public
   */
  solicitudState!: Solicitud110218State;

  /**
   * Identificador numérico de la solicitud actual.
   * Se inicializa en 0 y se actualiza cuando se captura una nueva solicitud.
   */
  idSolicitud: number = 0;

  /**
   * Constructor del componente.
   *
   * Inyecta los servicios necesarios para gestionar y consultar el estado
   * de la solicitud **110218**.
   * Al inicializarse, se suscribe al observable `selectTramite110218State$`
   * expuesto por el `Tramite110218Query`, de manera que la propiedad
   * `solicitudState` se mantenga sincronizada con el estado del store.
   *
   * @param {Tramite110218Store} tramite110218Store - Servicio `Store` encargado
   *                                                  de gestionar el estado global
   *                                                  de la solicitud 110218.
   * @param {Tramite110218Query} tramite110218Query - Servicio `Query` que expone
   *                                                  observables y selectores para
   *                                                  consultar el estado reactivo.
   */
  constructor(
    private tramite110218Store: Tramite110218Store,
    private tramite110218Query: Tramite110218Query
  ) {
    this.tramite110218Query.selectTramite110218State$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((solicitud) => {
        this.solicitudState = solicitud;
      });
  }

  /**
   * Obtiene el valor del índice y realiza la acción correspondiente en el asistente.
   *
   */
  getValorIndice(e: AccionBoton): void {
    if (e.accion === 'cont' && this.solicitanteTabsComponent) {
      if (!this.solicitanteTabsComponent.validarCamposObligatorios()) {
        return;
      }
    }
    if (e.valor > 0 && e.valor < 5) {
      this.indice = e.valor;
      if (e.accion === 'cont') {
        this.wizardComponent.siguiente();
      } else {
        this.wizardComponent.atras();
      }
    }
  }

  /**
   * Controla la visibilidad del formulario de mercancía y almacena el índice de la pestaña activa.
   *
   */
  isModificar($event: boolean, tapIndex: number): void {
    this.showMercanciaForm = $event;
    this.capturarTapIndice = tapIndex;
  }
}
