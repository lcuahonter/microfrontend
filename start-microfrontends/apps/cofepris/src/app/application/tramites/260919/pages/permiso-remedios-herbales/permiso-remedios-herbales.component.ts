import { AVISO } from '@libs/shared/data-access-user/src';
import { Component } from '@angular/core';
import { DatosPasos } from '@libs/shared/data-access-user/src';
import { ListaPasosWizard } from '@libs/shared/data-access-user/src';
import { PASOS } from '@libs/shared/data-access-user/src';
import { ViewChild } from '@angular/core';
import { WizardComponent } from '@libs/shared/data-access-user/src';

/**
 * Interfaz para definir las acciones de los botones en el flujo del wizard.
 * @property accion - Define la acción a realizar, como avanzar ('cont') o retroceder.
 * @property valor - El índice o paso relacionado con la acción.
 */
interface AccionBoton {
  /**
   * Define la acción a realizar, como avanzar ('cont') o retroceder.
   */
  accion: string;
  /**
   * El índice o paso relacionado con la acción.
   */
  valor: number;
}

@Component({
  selector: 'app-permiso-remedios-herbales',
  templateUrl: './permiso-remedios-herbales.component.html',
  styleUrls: ['./permiso-remedios-herbales.component.scss'],
 
})

export class PermisoRemediosHerbalesComponent {
  /**
   * Lista de pasos del wizard.
   * Utiliza la configuración predefinida en el objeto `PASOS`.
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * Índice actual del paso activo en el wizard.
   * Valor predeterminado: 1.
   */
  public indice = 1;

  /**
   * Configuración de los datos necesarios para los pasos del wizard.
   * Incluye el número de pasos, el índice actual y los textos de los botones "Anterior" y "Continuar".
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Referencia al componente hijo `WizardComponent`.
   * Se utiliza para controlar la navegación entre los pasos del wizard.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
     * 
     * Una cadena que representa la clase CSS para una alerta de información.
     * Esta clase se utiliza para aplicar estilo a los mensajes de información en el componente.
     */
    public infoAlert = 'alert-info';
  
    /**
     * Asigna el aviso de privacidad simplificado al atributo `TEXTOS`.
     */
    TEXTOS = AVISO;

  /**
   * Constructor del componente.
   * Inicializa los servicios necesarios para la funcionalidad del componente.
   */
  constructor() {
    // Constructor vacío, no requiere inicialización adicional.
  }

  /**
   * Cambia el índice actual del paso basado en la acción seleccionada.
   * Navega al paso siguiente o anterior utilizando el componente Wizard.
   * @param e - Objeto de tipo `AccionBoton` que contiene la acción ('cont' o 'atras') y el índice al que navegar.
   */
  getValorIndice(e: AccionBoton): void {
    if (e.valor > 0 && e.valor < 5) {
      this.indice = e.valor; // Actualiza el índice activo.
      if (e.accion === 'cont') {
        this.wizardComponent.siguiente(); // Navega al paso siguiente.
      } else {
        this.wizardComponent.atras(); // Regresa al paso anterior.
      }
    }
  }
}
