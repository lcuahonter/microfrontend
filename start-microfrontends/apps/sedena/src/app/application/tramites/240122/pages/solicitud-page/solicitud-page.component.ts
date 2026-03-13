import {
  AVISO,
  AccionBoton,
  AlertComponent,
  BtnContinuarComponent,
  DatosPasos,
  ListaPasosWizard,
  WizardComponent
} from '@ng-mf/data-access-user';
import { Component, ViewChild } from '@angular/core';
import { PASOS, TITULOMENSAJE } from '../../constantes/exportacion-explosivo-enum';
import { CommonModule } from '@angular/common';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { PasoTresComponent } from '../paso-tres/paso-tres.component';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';

/**
 * @component
 * @name SolicitudPageComponent
 * @description Componente que representa la página de solicitud en el flujo de trámites.
 * Este componente incluye un wizard para la navegación entre diferentes pasos del proceso.
 * 
 * @selector app-solicitud-page
 * @template ./solicitud-page.component.html
 * @style ./solicitud-page.component.scss
 * 
 * @property {string | null} tituloMensaje - Título que se muestra en la parte superior del wizard. 
 * Se actualiza dependiendo del paso seleccionado.
 * 
 * @property {ListaPasosWizard[]} pasos - Listado de pasos definidos para el wizard, incluyendo 
 * información y componentes asociados.
 * 
 * @property {number} indice - Índice del paso actual en el wizard.
 * 
 * @property {WizardComponent} wizardComponent - Referencia al componente `WizardComponent`, utilizada 
 * para invocar métodos de navegación interna como `siguiente()` y `atras()`.
 * 
 * @property {DatosPasos} datosPasos - Configuración de la barra de navegación del wizard: número de pasos, 
 * índice actual y textos de los botones.
 * 
 * @method seleccionaTab
 * @description Permite cambiar el paso actual de forma manual al hacer clic en las pestañas (tabs) del wizard.
 * @param {number} i - Índice del paso seleccionado.
 * @returns {void}
 * 
 * @method getValorIndice
 * @description Controla la navegación del wizard en función de la acción recibida (`cont` o `atras`). 
 * Actualiza el paso actual y el título mostrado, y llama a los métodos de navegación del `WizardComponent`.
 * @param {AccionBoton} e - Objeto que contiene el índice del paso y la acción a realizar.
 * @returns {void}
 * 
 * @method obtenerNombreDelTítulo
 * @description Método estático que determina el título a mostrar de acuerdo al índice del paso actual.
 * @param {number} valor - Índice del paso.
 * @returns {string} Título correspondiente al paso.
 */
@Component({
  selector: 'app-solicitud-page',
  standalone: true,
  imports: [
    AlertComponent,
    CommonModule,
    WizardComponent,
    PasoUnoComponent,
    PasoDosComponent,
    PasoTresComponent,
    BtnContinuarComponent,
  ],
  templateUrl: './solicitud-page.component.html',
  styleUrl: './solicitud-page.component.scss',
})
export class SolicitudPageComponent {
  /**
   * @property tituloMensaje
   * @description Título que se muestra en la parte superior del wizard.
   * Se actualiza dependiendo del paso seleccionado.
   * @type {string | null}
   */
  public tituloMensaje: string | null = TITULOMENSAJE;

  /**
   * @property pasos
   * @description Listado de pasos definidos para el wizard, incluyendo
   * información y componentes asociados.
   * @type {ListaPasosWizard[]}
   */
  public pasos: ListaPasosWizard[] = PASOS;

  /**
   * @property indice
   * @description Índice del paso actual en el wizard.
   * @type {number}
   */
  public indice: number = 1;

  /**
   * @property wizardComponent
   * @description Referencia al componente `WizardComponent`, utilizada
   * para invocar métodos de navegación interna como `siguiente()` y `atras()`.
   * @type {WizardComponent}
   */
  @ViewChild(WizardComponent)
  public wizardComponent!: WizardComponent;

  /**
   * @property datosPasos
   * @description Configuración de la barra de navegación del wizard:
   * número de pasos, índice actual y textos de los botones.
   * @type {DatosPasos}
   */
  public datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * @property TEXTOS
   * @description Asigna el aviso de privacidad simplificado al atributo `TEXTOS`.
   * @type {string}
   */
  public TEXTOS = AVISO.Aviso;

  /**
   * @method seleccionaTab
   * @description Permite cambiar el paso actual de forma manual
   * al hacer clic en las pestañas (tabs) del wizard.
   * @param {number} i - Índice del paso seleccionado.
   * @returns {void}
   */
  public seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * @method getValorIndice
   * @description Controla la navegación del wizard en función
   * de la acción recibida (`cont` o `atras`). Actualiza el paso
   * actual y el título mostrado, y llama a los métodos de
   * navegación del `WizardComponent`.
   * @param {AccionBoton} e - Objeto que contiene el índice del paso
   * y la acción a realizar.
   * @returns {void}
   */
  public getValorIndice(e: AccionBoton): void {
    if (e.valor > 0 && e.valor < 5) {
      this.indice = e.valor;
      this.tituloMensaje = SolicitudPageComponent.obtenerNombreDelTítulo(
        e.valor
      );

      if (e.accion === 'cont') {
        this.wizardComponent.siguiente();
      } else {
        this.wizardComponent.atras();
      }
    }
  }

  /**
   * @method obtenerNombreDelTítulo
   * @description Método estático que determina el título
   * a mostrar de acuerdo al índice del paso actual.
   * @param {number} valor - Índice del paso.
   * @returns {string} Título correspondiente al paso.
   */
  public static obtenerNombreDelTítulo(valor: number): string {
    switch (valor) {
      case 1:
        return TITULOMENSAJE;
      case 2:
        return 'Anexar requisitos';
      case 3:
        return 'Firmar';
      default:
        return TITULOMENSAJE;
    }
  }
}
