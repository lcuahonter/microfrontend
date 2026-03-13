import { Component, ViewChild } from '@angular/core';
import {
  DatosPasos,
  ListaPasosWizard,
  WizardComponent
} from '@libs/shared/data-access-user/src';
import { ALERTA_COM } from '@libs/shared/data-access-user/src/tramites/constantes/110208/certificado.enum';
import { FLORA_FAUNA } from '../../constantes/flora-fauna.enum';

/**
 * Interfaz que define la estructura de una acción de botón, con su tipo de acción
 * y el valor asociado al mismo.
 */
interface AccionBoton {
  /** Tipo de acción a realizar (por ejemplo, "cont" o "atras"). */
  accion: string;
  /** Valor asociado a la acción (generalmente usado para el índice). */
  valor: number;
}

/**
 * Constante con el mensaje de alerta para el proceso de Flora y Fauna.
 * Informa al usuario que la solicitud ha sido registrada de manera temporal.
 */
const FLORA_FAUNA_ALERT =
  'La solicitud ha quedado registrada con el número temporal 202768122. Éste no tiene validez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado a la solicitud al momento en que ésta sea firmada';

/**
 * Componente de Angular encargado de gestionar el proceso de Flora y Fauna
 * con un wizard para navegar entre pasos y mostrar alertas relacionadas.
 */
@Component({
  selector: 'app-flora-fauna',
  templateUrl: './flora-fauna.component.html',
})
export class FloraFaunaComponent {
  /**
   * Referencia al componente Wizard, utilizado para gestionar los pasos del proceso.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Lista de los pasos del wizard obtenidos de la constante FLORA_FAUNA.
   * Representa las distintas pantallas que se muestran al usuario en el flujo.
   */
  pantallasPasos: ListaPasosWizard[] = FLORA_FAUNA;

  /** Mensaje de alerta que se muestra al usuario sobre la solicitud registrada. */
  TEXTO_FLORA_FAUNA_ALERT = FLORA_FAUNA_ALERT;

  /** Constantes relacionadas con las alertas, importadas desde ALERTA_COM. */
  TEXTOS = ALERTA_COM;

  /** Índice del paso actual en el wizard. */
  indice = 1;

  /**
   * Datos relacionados con los pasos del wizard, como el número total de pasos y los textos
   * para los botones de navegación (anterior y siguiente).
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pantallasPasos.length, // Número total de pasos
    indice: this.indice, // Índice del paso actual
    txtBtnAnt: 'Anterior', // Texto para el botón "Anterior"
    txtBtnSig: 'Continuar', // Texto para el botón "Continuar"
  };

  /**
   * Método para gestionar el valor del índice según la acción realizada por el usuario.
   * Si la acción es "cont", avanza al siguiente paso, y si es "atras", retrocede al paso anterior.
   *
   * @param e Acción realizada con el valor asociado (número de paso).
   */
  getValorIndice(e: AccionBoton): void {
    if (e.valor > 0 && e.valor < 5) {
      this.indice = e.valor;
      if (e.accion === 'cont') {
        this.wizardComponent.siguiente(); // Avanza al siguiente paso
      } else {
        this.wizardComponent.atras(); // Retrocede al paso anterior
      }
    }
  }
}
