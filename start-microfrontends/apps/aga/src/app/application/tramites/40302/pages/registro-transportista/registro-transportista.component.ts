import { Component, ViewChild } from '@angular/core';
import {
  DatosPasos,
  ListaPasosWizard,
} from '@ng-mf/data-access-user';
import { REGISTRO_TRANSPORTISTA } from '../../constantes/registro-transportista.enum';
import { WizardComponent } from '@libs/shared/data-access-user/src';


/**
 * ## FIRMAR_TEXTO_DE_ALERTA
 * 
 * Texto de alerta que se muestra al usuario durante el proceso de firma de una solicitud.
 * 
 * ### Descripción
 * Informa que la solicitud ha sido registrada con un número temporal, el cual no tiene validez legal hasta que se firme y se asigne un folio oficial.
 */
const FIRMAR_TEXTO_DE_ALERTA =
  'La Solicitud ha quedado registrada con el número temporal 202768281. Éste no tiene validez legal y sirve solamente para efectos de identificar tu Solicitud. Un folio oficial le será asignado a la Solicitud al momento en que ésta sea firmada';

/**
 * ## AccionBoton
 * 
 * Interfaz que define la estructura de una acción realizada sobre un botón.
 */
interface AccionBoton {
  /**
   * ## accion
   * 
   * Tipo de acción realizada (por ejemplo, 'cont' para continuar o 'atras' para retroceder).
   */
  accion: string;

  /**
   * ## valor
   * 
   * Valor numérico asociado a la acción (por ejemplo, el índice del paso).
   */
  valor: number;
}

/**
 * ## RegistroTransportistaComponent
 * 
 * Componente que gestiona el registro de un transportista, utilizando un asistente de pasos (`Wizard`).
 * 
 * ### Decorador @Component
 * 
 * Define el componente con su selector y plantilla.
 * 
 * ### Parámetros
 * - **selector**: `'app-registro-transportista'`  
 *   Identificador del componente en el HTML.
 * - **standalone**: `false`  
 *   Indica que el componente no es independiente y debe estar dentro de un módulo.
 * - **templateUrl**: `'./registro-transportista.component.html'`  
 *   Ruta a la plantilla HTML del componente.
 */
@Component({
  selector: 'app-registro-transportista',
  standalone: false,
  templateUrl: './registro-transportista.component.html',
})
export class RegistroTransportistaComponent {
  /**
   * ## TEXTO_DE_ALERTA
   * 
   * Texto de alerta que se muestra al usuario durante el proceso de registro.
   */
  TEXTO_DE_ALERTA = FIRMAR_TEXTO_DE_ALERTA;

  /**
   * ## wizardComponent
   * 
   * Referencia al componente `WizardComponent` en la plantilla.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * ## pantallasPasos
   * 
   * Lista de pasos para el registro del transportista.
   */
  pantallasPasos: ListaPasosWizard[] = REGISTRO_TRANSPORTISTA;

  /**
   * ## indice
   * 
   * Índice actual del paso en el asistente.
   */
  indice = 1;

  /**
   * ## datosPasos
   * 
   * Datos generales para la navegación entre pasos.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pantallasPasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * ## getValorIndice
   * 
   * Actualiza el índice del paso según la acción del botón.
   * 
   * ### Parámetros
   * - **e**: `AccionBoton`  
   *   Objeto que contiene la acción y el valor del botón.
   * 
   * ### Funcionalidad
   * Si el valor es válido, actualiza el índice y avanza o retrocede en el asistente según la acción.
   */
  getValorIndice(e: AccionBoton): void {
    if (e.valor > 0 && e.valor < 5) {
      this.indice = e.valor;
      if (e.accion === 'cont') {
        this.wizardComponent?.siguiente();
      } else {
        this.wizardComponent?.atras();
      }
    }
  }
}
