import {AVISO, DatosPasos, ListaPasosWizard, WizardComponent} from '@libs/shared/data-access-user/src';
import { Component, ViewChild } from '@angular/core';
import { AccionBoton } from '../../enums/accionbotton.enum';
import { PASOS_EXPORTACION } from '../../constants/equipo-e-instrumentos-musicales-pasos.enum';



/**
 * Componente para la importación de vehículos usados.
 * Este componente gestiona el flujo de pasos en un asistente (wizard) para la importación de vehículos usados.
 */
@Component({
  selector: 'app-equipo-e-instrumentos-musicales',
  templateUrl: './equipo-e-instrumentos-musicales.component.html',
})
export class EquipoEInstrumentosMusicalesComponent {
  /**
   * Lista de pasos del asistente (wizard) para solicitar la importación.
   * Los pasos se obtienen de la constante `PASOS_EXPORTACION`.
   */
  pasosSolicitar: ListaPasosWizard[] = PASOS_EXPORTACION;

    /**
   * Mensaje de información para la alerta.
   */
    public infoAlert = 'alert-info';

    /**
   * Textos de aviso utilizados en el componente.
   */
    TEXTOS = AVISO.Aviso;

  /**
   * Índice del paso actual en el asistente.
   * Representa el paso en el que se encuentra el usuario.
   * Valor inicial: 1.
   */
  indice: number = 1;

  /**
   * Índice de la pestaña activa.
   * Representa la pestaña seleccionada en el asistente.
   * Valor inicial: 1.
   */
  tabIndex: number = 1;

  /**
   * Referencia al componente `WizardComponent` del asistente.
   * Se utiliza para navegar entre los pasos del asistente.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Datos relacionados con los pasos del asistente.
   * Incluye el número total de pasos, el índice actual y los textos de los botones de navegación.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasosSolicitar.length, // Número total de pasos
    indice: this.indice, // Índice del paso actual
    txtBtnAnt: 'Anterior', // Texto del botón "Anterior"
    txtBtnSig: 'Continuar', // Texto del botón "Continuar"
  };

  /**
   * Método para actualizar el índice del paso actual en el asistente.
   * También navega al siguiente o al paso anterior según la acción especificada.
   *
   * Objeto de tipo `AccionBoton` que contiene:
   *  - `valor`: El nuevo índice del paso.
   *  - `accion`: La acción a realizar ('cont' para continuar o 'ant' para retroceder).
   */
  getValorIndice(e: AccionBoton): void {
    if (e.valor > 0 && e.valor < 5) {
      this.indice = e.valor; // Actualiza el índice del paso actual
      if (e.accion === 'cont') {
        this.wizardComponent.siguiente(); // Navega al siguiente paso
      } else {
        this.wizardComponent.atras(); // Navega al paso anterior
      }
    }
  }
}