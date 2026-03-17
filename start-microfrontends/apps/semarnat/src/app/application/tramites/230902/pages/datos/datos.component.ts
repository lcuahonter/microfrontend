import { Component, ViewChild } from '@angular/core';
import { AVISO} from '@ng-mf/data-access-user';
import { DatosPasos} from '@ng-mf/data-access-user';
import { ERROR_FORMA_ALERT } from '../../enum/permiso-cites.enum';
import { ListaPasosWizard } from '@ng-mf/data-access-user';
import { PASOS_REGISTRO } from '@ng-mf/data-access-user';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { WizardComponent } from '@ng-mf/data-access-user';


/**
 * Interfaz que representa la acción de un botón.
 */
interface AccionBoton {
  /**
   * La acción que se va a realizar.
   */
  accion: string;
  /**
   * El valor asociado a la acción.
   */
  valor: number;
}

/**
 * Componente que representa los pasos de datos en un proceso de múltiples pasos.
 */
@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
})
export class DatosComponent {
  /**
   * Lista de pasos en el asistente.
   */
  pasos: ListaPasosWizard[] = PASOS_REGISTRO;

  /**
   * Referencia al componente WizardComponent.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Variable utilizada para almacenar la lista de pasos.
   */
  pantallasPasos: ListaPasosWizard[] = PASOS_REGISTRO;

  /**
   * Variable utilizada para almacenar el índice del paso actual.
   */
  indice: number = 1;

  /**
   * Mensaje de alerta utilizado en el componente.
   * Puede ser asignado a cualquiera de las claves definidas en TEXTOS.
   */
  public alert_message: string = AVISO.Aviso;

  /**
   * Datos para los pasos en el asistente.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

    /**
   * @property {PasoUnoComponent} pasoUnoComponent
   * @description
   * Referencia al componente hijo `PasoUnoComponent` mediante ViewChild.
   * Permite acceder a los métodos y propiedades del formulario del primer paso del asistente,
   * especialmente para validar todos sus formularios antes de avanzar al siguiente paso.
   */
  @ViewChild('pasoUno') pasoUnoComponent!: PasoUnoComponent;

  /**
   * @property {boolean} esFormaValido
   * @description
   * Indica si hay errores de validación en los formularios que se deben mostrar.
   * Se establece a `true` cuando se intenta avanzar al siguiente paso con formularios inválidos,
   * lo que activa la visualización de mensajes de error en la interfaz.
   */
  esFormaValido: boolean = false;

  /**
   * @property {Object} formErrorAlert
   * @description
   * Objeto que contiene la configuración del mensaje de error para formularios inválidos.
   * Utiliza la constante `ERROR_FORMA_ALERT` definida en las enumeraciones del trámite.
   * Define el título, mensaje y opciones de visualización para la alerta de error de validación de formularios.
   */
  public formErrorAlert = ERROR_FORMA_ALERT;

  /**
   * Actualiza el valor del índice según el evento del botón de acción.
   * @param e El evento del botón de acción que contiene la acción y el valor.
   */
  public getValorIndice(e: AccionBoton): void {
    this.esFormaValido = false;
    // Validar formularios antes de continuar desde el paso uno
    if (this.indice === 1 && e.accion === 'cont') {
      const ISVALID = this.validarTodosFormulariosPasoUno();
      if (!ISVALID) {
        this.esFormaValido = true;
        return; // Detener ejecución si los formularios son inválidos
      }
    }

    let indiceActualizado = e.valor;
    if (e.accion === 'cont') {
      indiceActualizado = e.valor + 1;
    } else if (e.accion === 'ant') {
      indiceActualizado = e.valor - 1;
    }

    // Validar que el nuevo índice esté dentro de los límites permitidos
    if (indiceActualizado > 0 && indiceActualizado <= this.pasos.length) {

      // Actualizar el índice y datosPasos
      this.indice = indiceActualizado;
      this.datosPasos.indice = indiceActualizado;

      if (e.accion === 'cont') {
        this.wizardComponent.siguiente();
      } else if (e.accion === 'ant') {
        this.wizardComponent.atras();
      }
    }
  }
  /**
   * @method validarTodosFormulariosPasoUno
   * @description
   * Valida todos los formularios del componente `PasoUnoComponent`.
   * Si la referencia al componente no existe, retorna `true` para permitir la navegación.
   * Llama al método `validarFormularios()` del componente hijo para verificar la validez de todos sus formularios.
   * Si algún formulario es inválido, retorna `false` para impedir el avance al siguiente paso.
   * 
   * @returns {boolean} `true` si todos los formularios son válidos o si el componente no existe, `false` si algún formulario es inválido.
   * @private
   */
  private validarTodosFormulariosPasoUno(): boolean {
    if (!this.pasoUnoComponent) {
      return true;
    }
    const ISFORM_VALID_TOUCHED = this.pasoUnoComponent.validarFormularios();
    if (!ISFORM_VALID_TOUCHED) {
      return false;
    }
    return true;
  }
}
