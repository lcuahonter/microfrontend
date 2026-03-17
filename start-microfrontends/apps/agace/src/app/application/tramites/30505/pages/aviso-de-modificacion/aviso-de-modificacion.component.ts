import { Component } from '@angular/core';
import { DatosPasos } from '@ng-mf/data-access-user';
import { ListaPasosWizard } from '@ng-mf/data-access-user';
import { PASOS } from '@libs/shared/data-access-user/src/tramites/constantes/303/pasos.enums';
import { ViewChild } from '@angular/core';
import { WizardComponent } from '@ng-mf/data-access-user';

/**
 * Interfaz que define la estructura de un objeto que representa una acción de botón en el wizard.
 * 
 * @interface AccionBoton
 * @property {string} accion - Acción a realizar ('cont' para continuar, otro valor para retroceder).
 * @property {number} valor - Valor del índice del paso actual.
 */
interface AccionBoton {
  accion: string;
  valor: number;
}

/**
 * Componente encargado de gestionar el flujo del wizard para el aviso de modificación.
 * 
 * @component
 * @selector app-aviso-modificacion
 * @templateUrl ./aviso-de-modificacion.component.html
 * 
 * @property {ListaPasosWizard[]} pasos - Lista de pasos del wizard.
 * @property {number} indice - Índice actual del paso en el wizard.
 * @property {WizardComponent} wizardComponent - Referencia al componente del wizard.
 * @property {DatosPasos} datosPasos - Datos de configuración para los pasos del wizard.
 * 
 * @method getValorIndice - Actualiza el índice del paso y navega al siguiente o anterior paso según la acción recibida.
 * @param {AccionBoton} evento - Evento que contiene la acción ('cont' para continuar, otro valor para retroceder) y el valor del índice.
 */
@Component({
  selector: 'app-aviso-modificacion',
  templateUrl: './aviso-de-modificacion.component.html',
})
export class AvisoDeModificacionComponent {

  /**
   * Arreglo que contiene la lista de pasos para el asistente (wizard).
   * Cada elemento representa un paso en el flujo del trámite.
   * 
   * @type {ListaPasosWizard[]}
   * @see PASOS - Constante que define los pasos del asistente.
   */
  public pasos: ListaPasosWizard[] = PASOS;
 
  /**
   * Índice actual utilizado para controlar la posición o el paso activo en el componente.
   * @default 1
   */
  public indice: number = 1;

  /**
   * Referencia al componente `WizardComponent` dentro de la vista.
   * 
   * Esta propiedad permite acceder y manipular el componente wizard desde el código TypeScript,
   * facilitando la interacción con sus métodos y propiedades.
   * 
   * @see WizardComponent
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Objeto que contiene la información relevante para el control de los pasos en un proceso.
   *
   * @property nroPasos - Número total de pasos en el proceso.
   * @property indice - Índice actual del paso en el que se encuentra el usuario.
   * @property txtBtnAnt - Texto que se muestra en el botón para retroceder al paso anterior.
   * @property txtBtnSig - Texto que se muestra en el botón para avanzar al siguiente paso.
   */
  public datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Actualiza el valor del índice basado en el evento recibido y navega al siguiente o anterior paso del wizard.
   *
   * @param evento Objeto de tipo `AccionBoton` que contiene la acción ('cont' para continuar o cualquier otro valor para retroceder) y el valor del índice a establecer.
   */
  getValorIndice(evento: AccionBoton): void {
    this.indice = evento.valor;
    this.wizardComponent[evento.accion === 'cont' ? 'siguiente' : 'atras']();
  }
}