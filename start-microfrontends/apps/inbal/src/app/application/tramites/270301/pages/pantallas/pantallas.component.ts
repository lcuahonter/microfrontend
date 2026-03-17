import { Component, ViewChild } from '@angular/core';
import { DatosPasos, ListaPasosWizard, WizardComponent } from '@libs/shared/data-access-user/src';
import { AccionBoton } from '@ng-mf/data-access-user';

import { AVISO_SIGLOS } from '../../constantes/aviso-siglos.enum';

/**
 * @component PantallasComponent
 * @description
 * Componente principal para gestionar el flujo de pasos en el wizard del trámite 260514.
 * Permite la navegación entre diferentes pantallas/pasos utilizando el componente Wizard.
 * Controla el índice del paso actual y los datos necesarios para la navegación.
 * 
 * @selector app-pantallas
 * @templateUrl ./pantallas.component.html
 * @styleUrl ./pantallas.component.scss
 */
@Component({
  selector: 'pantallas',
  standalone: false,
  templateUrl: './pantallas.component.html',
  
})
export class PantallasComponent {

  /**
   * @property pantallasPasos
   * @type {ListaPasosWizard[]}
   * @description
   * Lista de pasos del wizard, obtenida desde una constante.
   */
  public pantallasPasos: ListaPasosWizard[] = AVISO_SIGLOS;
 
  /**
   * @property indice
   * @type {number}
   * @default 1
   * @description
   * Índice del paso actual en el wizard.
   */
  public indice: number = 1;
 
  /**
   * @property wizardComponent
   * @type {WizardComponent}
   * @description
   * Referencia al componente Wizard para controlar la navegación entre pasos.
   */
  @ViewChild(WizardComponent)
  public wizardComponent!: WizardComponent;
 
  /**
   * @property datosPasos
   * @type {DatosPasos}
   * @description
   * Datos utilizados para el control del wizard, como el número de pasos, el índice actual y los textos de los botones.
   */
  public datosPasos: DatosPasos = {
    nroPasos: this.pantallasPasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };
 
  /**
   * @method getValorIndice
   * @description
   * Actualiza el índice del paso y maneja la navegación hacia adelante o atrás en el wizard.
   * Si la acción es 'cont', avanza al siguiente paso; en caso contrario, retrocede.
   * Solo actualiza si el valor está dentro del rango de pasos válidos.
   * 
   * @param {AccionBoton} e - Objeto que contiene el valor del paso y la acción a realizar.
   * @returns {void}
   */
  public getValorIndice(e: AccionBoton): void {
    if (e && e.valor > 0 && e.valor <= this.pantallasPasos.length) {
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
