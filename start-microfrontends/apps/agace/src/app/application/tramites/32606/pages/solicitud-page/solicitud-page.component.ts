import { Component, ViewChild } from '@angular/core';
import { DatosPasos } from '@ng-mf/data-access-user';
import { ListaPasosWizard } from '@ng-mf/data-access-user';
import { PASOS } from '@ng-mf/data-access-user';
import { WizardComponent } from '@ng-mf/data-access-user';

/** Texto de alerta para terceros. */
const TERCEROS_TEXTO_DE_ALERTA =
  'La solicitud ha quedado registrada con el número temporal 202757598 Éste no tiene validez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado a la solicitud al momento en que ésta sea firmada.';

/** Interfaz que define la estructura de una acción de botón. */
interface AccionBoton {
  /** La acción que se realizará. */
  accion: string;
  /** El valor asociado a la acción. */
  valor: number;
}

/** Componente que representa la página de solicitud. */
@Component({
  templateUrl: './solicitud-page.component.html',
  styles: ``,
})
export class SolicitudPageComponent {
  /** Texto de alerta que se muestra en la página. */
  TEXTO_DE_ALERTA: string = TERCEROS_TEXTO_DE_ALERTA;
  /** Lista de pasos del asistente. */
  pasos: ListaPasosWizard[] = PASOS;
  /** Índice del paso actual del asistente. */
  indice: number = 1;
  /** Referencia al componente del asistente wizard. */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;
  /** Datos de los pasos del asistente. */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /** Selecciona una pestaña del asistente según el índice. */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /** Obtiene el valor del índice de la acción del botón y navega en el wizard. */
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