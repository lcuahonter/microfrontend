import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, DatosPasos, ListaPasosWizard, PASOS, TituloComponent, WizardComponent } from '@ng-mf/data-access-user';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { PasoTresComponent } from '../paso-tres/paso-tres.component';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';

/**
 * Texto de alerta para terceros.
 * @type {string}
 */
const TERCEROS_TEXTO_DE_ALERTA: string = 'La solicitud ha quedado registrada con el número temporal 202757598 Éste no tiene validez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado a la solicitud al momento en que ésta sea firmada.';

/**
 * Interfaz que define la estructura de una acción de botón.
 */
interface AccionBoton {
  /**
   * La acción que se realizará.
   * @type {string}
   */
  accion: string;

  /**
   * El valor asociado a la acción.
   * @type {number}
   */
  valor: number;
}

/**
 * Componente que representa la página de solicitud con un asistente de pasos.
 */
@Component({
  templateUrl: './solicitud-page.component.html',
  styles: ``,
  standalone: true,
  imports: [
    AlertComponent,
    AnexarDocumentosComponent,
    BtnContinuarComponent,
    CommonModule,
    FormsModule,
    PasoDosComponent,
    PasoTresComponent,
    PasoUnoComponent,
    ReactiveFormsModule,
    TituloComponent,
    WizardComponent
  ]
})
export class SolicitudPageComponent {
  /**
   * Texto informativo mostrado en la alerta para solicitudes de terceros.
   * @type {string}
   */
  TEXTO_DE_ALERTA: string = TERCEROS_TEXTO_DE_ALERTA;

  /**
   * Lista de pasos que conforman el asistente.
   * @type {ListaPasosWizard[]}
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * Índice del paso actual en el asistente.
   * @type {number}
   */
  indice: number = 1;

  /**
   * Referencia al componente del asistente.
   * @type {WizardComponent}
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Datos generales del asistente, como número de pasos y etiquetas de botones.
   * @type {DatosPasos}
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar'
  };

  /**
   * Cambia el índice del paso seleccionado.
   * @param i Índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Procesa la acción realizada desde un botón (continuar o regresar) y cambia el paso en el asistente.
   * @param e Objeto que contiene la acción y el índice asociado.
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
