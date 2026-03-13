import {
  AccionBoton,
  DatosPasos,
  ListsPasoWizard,
} from '../../models/acuicola.module';
import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';
import { ALERTA } from '@libs/shared/data-access-user/src/tramites/constantes/mensajes-error-formularios';
import { PASOS } from '../../constants/acuicola.module';
import { Tramite220403Query } from '../../estados/tramite220403.query';
import { WizardComponent } from '@ng-mf/data-access-user';

/**
 * Componente principal para el trámite acuícola.
 *
 * Este componente gestiona el flujo del wizard para el trámite zoosanitario de importación,
 * permitiendo la navegación entre los diferentes pasos y el manejo de los datos asociados.
 *
 * @export
 * @class AcuicolaComponent
 */
@Component({
  selector: 'app-acuicola',
  templateUrl: './acuicola.component.html',
  styleUrl: './acuicola.component.scss',
})
export class AcuicolaComponent implements OnDestroy {
  /**
   * Array de pasos del wizard.
   * @type {Array<ListsPasoWizard>}
   */
  pasos: ListsPasoWizard[] = PASOS;

  /**
   * El título del mensaje.
   * @type {string | null}
   */
  tituloMensaje: string | null = 'Zoosanitario para importación';

  /**
   * Referencia al componente Wizard para controlar la navegación entre pasos.
   * @type {WizardComponent}
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * El índice del paso actual.
   * @type {number}
   */
  indice: number = 1;

  /**
   * Asigna el mensaje de error a mostrar al atributo `ALERTA`.
   */
  ALERTA = ALERTA;

  /**
   * Una cadena que representa la clase CSS para una alerta de error.
   */
  infoError = 'alert-danger';

  /**
   * Indica si el formulario es válido.
   * @type {boolean}
   */
  esFormValido: boolean = true;

  /**
   * Un `Subject` utilizado para notificar la destrucción del componente.
   */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * Datos de los pasos del wizard.
   * @type {DatosPasos}
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Constructor del componente.
   * @param {Tramite220403Query} tramite220403Query - Servicio para consultar el estado del trámite acuícola.
   */
  constructor(private tramite220403Query: Tramite220403Query) {
    // Constructor vacío, se pueden inyectar servicios si es necesario.
  }

  /**
   * @method getValorIndice
   * @description Maneja la acción del botón y determina la navegación (siguiente o anterior).
   * @param {AccionBoton} e - Objeto de acción que contiene la acción y el valor a manejar.
   */
  getValorIndice(e: AccionBoton): void {
    if (e.valor > 0 && e.valor < 5) {
      if (this.indice === 1) {
        this.esFormValido = this.validarFormulario() ?? false;
      }
      if (!this.esFormValido) {
        this.datosPasos.indice = 1;
        return;
      }

      this.indice = e.valor;
      if (e.accion === 'cont') {
        this.wizardComponent.siguiente();
      } else {
        this.wizardComponent.atras();
      }
    }
  }

  /**
   * Maneja el evento de clic en el botón "Guardar".
   * @returns {void}
   */
  onBtnGuardarClicked(): void {
    if (this.indice === 1) {
      this.esFormValido = this.validarFormulario() ?? false;
    }
    if (!this.esFormValido) {
      this.datosPasos.indice = 1;
    }
  }

  /**
   * @method validarFormulario
   * @returns {boolean}
   * @description Valida el formulario del primer paso del wizard.
   */
  validarFormulario(): boolean {
    let esValido = false;
    this.tramite220403Query.selectTramite$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((tramite) => {
          if (
            tramite.datosRealizarValidada &&
            tramite.combinacionRequeridaValidada &&
            tramite.pagoDerechosValidada &&
            tramite.transporteValidada
          ) {
            esValido = true;
          } else {
            esValido = false;
          }
        })
      )
      .subscribe();
    return esValido;
  }

  /**
   * Notifica la destrucción del componente.
   * @method ngOnDestroy
   * @description Se ejecuta cuando el componente es destruido, se utiliza para limpiar suscripciones y evitar fugas de memoria.
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}