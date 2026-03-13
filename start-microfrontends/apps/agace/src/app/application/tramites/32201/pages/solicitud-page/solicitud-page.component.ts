import { AVISO } from '@ng-mf/data-access-user';
import { AlertComponent } from '@ng-mf/data-access-user';
import { BtnContinuarComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DatosPasos } from '@ng-mf/data-access-user';
import { FormsModule } from '@angular/forms';
import { ListaPasosWizard } from '@ng-mf/data-access-user';
import { PASOS } from '@ng-mf/data-access-user';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { PasoTresComponent } from '../paso-tres/paso-tres.component';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SOLICITUD_32201_ENUM } from '../../constantes/anexo';
import { SolicitanteComponent } from '@ng-mf/data-access-user';
import { ViewChild } from '@angular/core';
import { WizardComponent } from '@ng-mf/data-access-user';

/**
 * Interfaz que define la estructura de una acción de botón.
 */
interface AccionBoton {
  /**
   * La acción que se realizará (por ejemplo, "cont" para continuar o "atras" para retroceder).
   */
  accion: string;

  /**
   * El valor asociado a la acción (por ejemplo, el índice del paso).
   */
  valor: number;
}

/**
 * Componente que representa la página de solicitud.
 * Este componente gestiona el flujo de pasos del asistente y muestra información relevante al usuario.
 */
@Component({
  templateUrl: './solicitud-page.component.html',
  styles: ``,
  standalone: true,
  imports: [
    WizardComponent,
    CommonModule,
    BtnContinuarComponent,
    FormsModule,
    PasoUnoComponent,
    SolicitanteComponent,
    PasoDosComponent,
    PasoTresComponent,
    AlertComponent,
    ReactiveFormsModule,
  ],
})
export class SolicitudPageComponent {
  /**
   * Asigna el aviso de privacidad simplificado al atributo `TEXTOS`.
   */
  TEXTO_DE_ALERTA = SOLICITUD_32201_ENUM.TEXTO_DE_ALERTA;

  /**
   * Lista de pasos del asistente.
   * Contiene la configuración de cada paso del asistente.
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * Índice del paso actual en el asistente.
   */
  indice: number = 1;

  /**
   * Referencia al componente del asistente.
   * Se utiliza para controlar el flujo de pasos (siguiente, anterior, etc.).
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Aviso de privacidad simplificado.
   * Este texto se utiliza para mostrar el aviso de privacidad al usuario.
   */
  TEXTOS = AVISO.Aviso;

  /**
   * Clase CSS para aplicar estilo a las alertas de información.
   */
  public infoAlert = 'alert-info';

  /**
   * Datos de configuración de los pasos del asistente.
   * Incluye el número de pasos, el índice actual y los textos de los botones.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Constructor del componente.
   */
  constructor() {
    // Constructor no vacío para evitar el error de ESLint.
  }

  /**
   * Selecciona una pestaña del asistente.
   * @param i Índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Obtiene el valor del índice de la acción del botón.
   * Actualiza el índice del paso actual y navega al siguiente o al anterior paso según la acción.
   *
   * @param e Acción del botón, que incluye el índice y la acción a realizar.
   */
  getValorIndice(e: AccionBoton): void {
    if (e.valor > 0 && e.valor < 5) {
      this.indice = e.valor;
      if (e.accion === 'cont') {
        this.wizardComponent.siguiente(); // Navega al siguiente paso.
      } else {
        this.wizardComponent.atras(); // Navega al paso anterior.
      }
    }
  }
}
