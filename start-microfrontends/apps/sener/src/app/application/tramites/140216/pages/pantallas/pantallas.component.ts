import { AccionBoton, DatosPasos, ListaPasosWizard, PASOS, WizardComponent } from '@libs/shared/data-access-user/src';
import { Component, ViewChild } from '@angular/core';
import { DatosComponent } from '../datos/datos.component';
import { ERROR_ALERTA } from '@libs/shared/data-access-user/src/tramites/constantes/mensajes-error-formularios';

/**
 * Componente principal para la gestión de pantallas en el wizard de cupos.
 */
@Component({
  selector: 'app-pantallas',
  templateUrl: './pantallas.component.html',
  styles: ``
})
export class PantallasComponent {
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
   * Referencia al componente de datos para validar el formulario.
   * @type {DatosComponent}
   */
  @ViewChild('datos') datos!: DatosComponent;

  /**
   * Mensaje de error a mostrar.
   */
  esValido = true;

  /**
   * Una cadena que representa la clase CSS para una alerta de error.
   */
  infoError = 'alert-danger';

  /**
   * Asigna el mensaje de error a mostrar al atributo `ERROR_ALERTA`.
   */
  ALERTA = ERROR_ALERTA;

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
    if (e.valor > 0 && e.valor <= this.pantallasPasos.length) {
      if (this.indice === 1) {
        const BUSQUEDA_PERMISOS = this.datos?.busquedaPermisosComponent;
        this.esValido = BUSQUEDA_PERMISOS?.validarFormulario() ?? false;
      }

      if (!this.esValido) {
        this.datosPasos.indice = 1;
        return;
      }

      this.indice = e.valor;
      this.datosPasos.indice = e.valor;

      if (e.accion === 'cont') {
        this.wizardComponent.siguiente();
      } else {
        this.wizardComponent.atras();
      }
    }
  }
}