import { CategoriaMensaje, DatosPasos, Notificacion, TipoNotificacionEnum } from '@ng-mf/data-access-user';
import { Component } from '@angular/core';
import { ListaPasosWizard } from '@ng-mf/data-access-user';
import { PASOS } from '@ng-mf/data-access-user';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { ViewChild } from '@angular/core';
import { WizardComponent } from '@ng-mf/data-access-user';

/**
 * Interfaz que representa el botón de acción.
 */
interface AccionBoton {
  /**
   * La acción a realizar.
   */
  accion: string;
  /**
   * El valor asociado con la acción.
   */
  valor: number;
}

/**
 * Componente de oea-textil-registro.
 *
 * Este componente maneja el flujo de pasos para el proceso de oea-textil-registro.
 *
 * @selector 'app-oea-textil-registro'
 * @templateUrl './oea-textil-registro.component.html'
 * @styleUrl './oea-textil-registro.component.scss'
 */
@Component({
  selector: 'app-oea-textil-registro',
  templateUrl: './oea-textil-registro.component.html',
  styleUrl: './oea-textil-registro.component.scss',
})
export class OeaTextilRegistroComponent {
  /**
   * Esta variable se utiliza para almacenar la lista de pasos.
   */
  pasos: ListaPasosWizard[] = PASOS;
  /**
   * Esta variable se utiliza para almacenar el índice del paso actual.
   */
  indice: number = 1;

  /**
 * Referencia al componente `WizardComponent` dentro de la plantilla.
 * 
 * @viewChild wizardComponent - Utiliza el decorador `@ViewChild` para acceder al componente `WizardComponent`.
 * Permite interactuar con sus propiedades y métodos en el código del componente principal.
 */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
 * Referencia al componente hijo `PasoUnoComponent` para acceder a sus métodos de validación de formularios.
 * const isValid = this.pasoUnoComponent.validateForms();
 * const formsValidity = this.pasoUnoComponent.getAllFormsValidity();
 */
  @ViewChild('pasoUnoRef') pasoUnoComponent!: PasoUnoComponent;

   /**
 * Controla la visibilidad del mensaje de error cuando la validación de formularios falla.
 * }
 */
  esFormaValido: boolean = false;
   /**
     * Configuración de notificación actual para mostrar al usuario.
     *
     * @description
     * Almacena la configuración de la notificación que se mostrará
     * en modales de confirmación, error o información.
     *
     */
  public nuevaNotificacion!: Notificacion;
  /**
   * Indica si se debe mostrar el botón de continuar.
   */
  btnContinuar: boolean = false;

  /**
   * Datos relacionados con los pasos.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Selecciona una pestaña del asistente.
   * Índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  
  /**
   * Obtiene el valor del índice de la acción del botón.
   * Acción del botón.
   */
  getValorIndice(e: AccionBoton): void {
  this.esFormaValido = false;
  
  // Validar formularios antes de continuar desde el paso uno
  if (this.indice === 1 && e.accion === 'cont') {
    const ES_VALIDO = this.validarTodosFormulariosPasoUno();
    if (!ES_VALIDO) {
      this.esFormaValido = true;
      this.mostrarNotificacionError();
      return; // Detener ejecución si los formularios son inválidos
    }
  }

  // Calcular el nuevo índice basado en la acción
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
   * Muestra una notificación cuando el RFC tiene un formato incorrecto.
   * El mensaje alerta al usuario sobre un error en el formato ingresado.
   */
  mostrarNotificacionError(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ERROR,
      modo: 'modal-md',
      titulo: '',
      mensaje: 'Existen requisitos obligatorios en blanco o con errores.',
      cerrar: false,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
    this.btnContinuar = true;
  }

      /**
     * Maneja la confirmación del modal de notificación.
     */
    btnContinuarNotificacion(): void {
      this.btnContinuar = false;
    }

/**
 * Valida todos los formularios del primer paso antes de permitir continuar al siguiente paso.
 */
  validarTodosFormulariosPasoUno(): boolean {
    if (!this.pasoUnoComponent) {
      return true;
    }
    const ISFORM_VALID_TOUCHED = this.pasoUnoComponent.validarFormularios();
    return ISFORM_VALID_TOUCHED;
    
  }
}
