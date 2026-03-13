import {
  AlertComponent,
  BtnContinuarComponent,
  DatosPasos,
  ListaPasosWizard,
  WizardComponent
} from '@ng-mf/data-access-user';
import { Component, ViewChild } from '@angular/core';
import { AVISO } from '@libs/shared/data-access-user/src/core/enums/constantes-alertas.enum';
import { CommonModule } from '@angular/common';
import { PASOS } from '../../constants/pasos.enum';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { PasoTresComponent } from '../paso-tres/paso-tres.component';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { ReactiveFormsModule } from '@angular/forms';

/**
 * Interfaz para definir la estructura de una acción de botón.
 */
interface AccionBoton {
  /**
   * Acción a realizar (e.g., 'cont' para continuar, 'ant' para retroceder).
   */
  accion: string;

  /**
   * Valor del índice asociado a la acción.
   */
  valor: number;
}

/**
 * Componente para gestionar la página del solicitante.
 */
@Component({
  selector: 'app-solicitante-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    WizardComponent,
    PasoUnoComponent,
    PasoDosComponent,
    PasoTresComponent,
    BtnContinuarComponent,
    AlertComponent,
  ],
  templateUrl: './solicitante-page.component.html',
  styleUrl: './solicitante-page.component.scss',
})
export class SolicitantePageComponent {
  infoAlert = 'alert-info';

  TEXTO_DE_ALERTA: string =
    'La solicitud ha quedado registrada con el número temporal 202768251 Éste no tiene validez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado a la solicitud al momento en que ésta sea firmada.';
  /**
   * Lista de pasos del wizard.
   */
  pasos: Array<ListaPasosWizard> = PASOS;

  /**
   * Índice del paso actual.
   */
  indice: number = 1;

  /**
   * Referencia al componente del wizard.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Datos de los pasos del wizard.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };  

  /**
   * @var {typeof AVISO.Aviso} TEXTOS
   * @description Contiene los textos utilizados en el componente, provenientes de la constante `AVISO.Aviso`.
   * @see AVISO.Aviso
   */
  TEXTOS = AVISO.Alerta;

  /**
   * Constructor de la clase.
   */
  constructor() {
    // El constructor se utiliza para la inyección de dependencias.
  }

  /**
   * Selecciona una pestaña del wizard.
   * @param i - Índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Obtiene el valor del índice del evento de acción del botón.
   * Navega hacia adelante o hacia atrás en el wizard según la acción especificada.
   * @param e - Evento de acción del botón.
   */
  getValorIndice(e: AccionBoton): void {
    if (e.valor > 0 && e.valor < 6) {
      this.indice = e.valor;
      this.datosPasos.indice = this.indice;
      if (e.accion === 'cont') {
        this.wizardComponent.siguiente();
      } else {
        this.wizardComponent.atras();
      }
    }
  }

  /**
   * Método para continuar al siguiente paso en el wizard.
   */
  continuar(): void {
    this.getValorIndice({ accion: 'cont', valor: this.indice + 1 });
  }
}
