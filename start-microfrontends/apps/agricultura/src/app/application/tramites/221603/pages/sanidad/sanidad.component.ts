import { Component, ViewChild } from '@angular/core';
import { DatosPasos, PASOS_REGISTRO } from '@libs/shared/data-access-user/src';
import { ALERTA_COM } from '@libs/shared/data-access-user/src/tramites/constantes/110208/certificado.enum';
import{AccionBoton} from '@libs/shared/data-access-user/src/core/models/140103/cancelacion.model';
import { ListaPasosWizard } from '@libs/shared/data-access-user/src';
import { WizardComponent } from '@libs/shared/data-access-user/src';

@Component({
  selector: 'app-sanidad', 
  templateUrl: './sanidad.component.html',
})
/**
 * Componente que gestiona la sección de sanidad en el trámite.
 * Permite navegar entre los pasos del asistente (wizard) y gestionar las acciones relacionadas con cada paso.
 */
export class SanidadComponent {

  /**
   * Array que almacena los pasos del asistente (wizard).
   * Define las pantallas que se mostrarán en el flujo del trámite.
   */
  pantallasPasos: ListaPasosWizard[] = PASOS_REGISTRO;

  /**
   * Constante que contiene los textos de alerta utilizados en el componente.
   */
  TEXTOS = ALERTA_COM;

  /**
   * Índice actual del paso en el asistente.
   * Representa el paso activo en el flujo del trámite.
   */
  indice: number = 1;

  /**
   * Referencia al componente WizardComponent para interactuar con el asistente.
   * Permite avanzar o retroceder entre los pasos del asistente.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Objeto que contiene los datos relacionados con los pasos del asistente.
   * Incluye el número total de pasos, el índice actual y los textos de los botones de navegación.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pantallasPasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Actualiza el índice actual del paso en el asistente según el valor proporcionado.
   * Si el valor está dentro del rango permitido, actualiza el índice y navega hacia adelante o atrás
   * en el asistente según la acción especificada.
   *
   * e Objeto que contiene el valor del índice y la acción a realizar ('cont' para continuar o 'atras' para retroceder).
   */
  getValorIndice(e: AccionBoton): void {
    if (e.valor > 0 && e.valor < 5) {
      this.indice = e.valor;
      if (e.accion === 'cont') {
        this.wizardComponent.siguiente();
      } else {
        this.wizardComponent.atras();
      }
    }
  }
}