import { AVISO, AccionBoton } from '@ng-mf/data-access-user';
import { Component } from '@angular/core';
import { DatosPasos } from '@ng-mf/data-access-user';
import { ListaPasosWizard } from '@ng-mf/data-access-user';
import { PASOS } from '../../constants/solicitud-permiso-extraordinario-exportacion';
import { TITULOMENSAJE } from '../../constants/solicitud-permiso-extraordinario-exportacion';
import { ViewChild } from '@angular/core';
import { WizardComponent } from '@ng-mf/data-access-user';

/**
 * @title Página de Solicitud
 * @description Componente principal que contiene el flujo del trámite a través de un wizard dividido en pasos.
 * @summary Administra la navegación entre pasos del trámite y organiza los componentes visuales del flujo.
 */
@Component({
  selector: 'app-solicitud-page',
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
 * @property TEXTOS
 * @description
 * Contiene el texto del aviso de privacidad que se mostrará en la página de solicitud.
 * El valor se obtiene de la constante `AVISO_PRIVACIDAD.Aviso_Privacidad`.
 * @type {string}
 */
  TEXTOS: string = AVISO.Aviso;

    /**
   *
   * Una cadena que representa la clase CSS para una alerta de información.
   * Esta clase se utiliza para aplicar estilo a los mensajes de información en el componente.
   */
  public infoAlert = 'alert-info';
  
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
