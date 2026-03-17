import { AVISO, DatosPasos, ListaPasosWizard, WizardComponent } from '@ng-mf/data-access-user';
import { Component, ViewChild } from '@angular/core';
import { ERROR_FORMA_ALERT, NOTIFICACION_DE_TITULO, PASOS } from "../../constantes/modificacion-aviso-seguro-global.enum";
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';

/**
 * @interface AccionBoton
 * @description Define la estructura del objeto utilizado para representar una acción de botón dentro del flujo de pasos.
 * 
 * @property accion - Acción a ejecutar ('cont' para continuar, otro valor para retroceder).
 * @property valor - Índice del paso al que se desea navegar.
 */
interface AccionBoton {
  /**
   * @property accion
   * @description
   * Define la acción a realizar al presionar el botón.
   */
  accion: string;
  /**
   * @property valor
   * @description
   * Representa el índice del paso al que se desea navegar.
   */
  valor: number;
}

@Component({
  templateUrl: './solicitud-page.component.html',
  styles: ``,
})
export class SolicitudPageComponent {

  /**
   * @property pasos
   * @type {ListaPasosWizard[]}
   * @description 
   * Contiene la lista de pasos definidos para el wizard.
   * 
   * @command Esta lista se importa desde una constante de enumeración `PASOS` y define la secuencia del flujo.
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * @property indice
   * @type {number}
   * @default 1
   * @description 
   * Representa el índice actual del paso activo en el wizard.
   * 
   * @command Se actualiza cuando el usuario navega entre pasos o pestañas.
   */
  indice: number = 1;

  /**
   * @property wizardComponent
   * @type {WizardComponent}
   * @description 
   * Referencia al componente hijo `WizardComponent` para controlar la navegación entre pasos.
   * 
   * @command Utiliza el decorador `@ViewChild` para obtener acceso directo a sus métodos `siguiente()` y `atras()`.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;



/**
 * Referencia al componente hijo `PasoUnoComponent` para acceder a sus métodos de validación de formularios.
 * const isValid = this.pasoUnoComponent.validateForms();
 * const formsValidity = this.pasoUnoComponent.getAllFormsValidity();
 */
@ViewChild('pasoUnoRef') pasoUnoComponent!: PasoUnoComponent;

/**
 * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
 */
public formErrorAlert = ERROR_FORMA_ALERT;

/**
 * Controla la visibilidad del mensaje de error cuando la validación de formularios falla.
 * }
 */
esFormaValido: boolean = false;
  /**
   * @property datosPasos
   * @type {DatosPasos}
   * @description 
   * Objeto que contiene la configuración del wizard, como el número de pasos, índice actual y texto de botones.
   * 
   * @command Este objeto es utilizado como entrada para controlar dinámicamente el flujo del wizard.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * @property infoAlert
   * @type {string}
   * @default 'alert-info'
   * @description 
   * Define el tipo de clase CSS a utilizar para mostrar mensajes de alerta informativos.
   */
  public infoAlert = 'alert-info';

  /**
   * @property TEXTOS
   * @type {any}
   * @description 
   * Contiene los textos relacionados con el módulo de pago de derechos.
   * 
   * @command Estos textos son importados desde una constante compartida y pueden ser utilizados en la plantilla.
   */
  TEXTOS = AVISO;

  /**
   * @property NOTIFICACION_DE_TITULO
   * @description
   * Propiedad de instancia que hace referencia a la constante global `NOTIFICACION_DE_TITULO`.
   * Esto permite utilizar el mensaje de advertencia directamente en el template HTML.
   */
  NOTIFICACION_DE_TITULO: string = NOTIFICACION_DE_TITULO;

  /**
   * @method seleccionaTab
   * @description 
   * Cambia el valor del índice actual según la pestaña seleccionada por el usuario.
   * 
   * @param indice - Número de índice correspondiente a la pestaña seleccionada.
   * 
   * @command Actualiza la propiedad `indice` para reflejar la pestaña activa en el flujo del componente.
   * 
   * @example
   * this.seleccionaTab(3); // Cambia a la tercera pestaña.
   */
  seleccionaTab(indice: number): void {
    this.indice = indice;
  }

  /**
   * Determina la acción a realizar (avanzar o retroceder) y actualiza el índice del paso actual.
   * Objeto de tipo `AccionBoton` que contiene la acción (`'cont'` o `'atras'`) y el valor del nuevo índice.
   * 
   * Este método valida que el nuevo índice esté dentro de un rango válido (1 a 4), luego ejecuta el método correspondiente del componente `WizardComponent`.
   * 
   * Si la acción es `'cont'`, se avanza al siguiente paso llamando `siguiente()` del `wizardComponent`.
   * Si la acción es distinta, se retrocede llamando `atras()` del `wizardComponent`.
   * this.getValorIndice({ accion: 'cont', valor: 2 }); // Avanza al paso 2.
   */
 getValorIndice(e: AccionBoton): void {
  this.esFormaValido = false;
  
  // Validar formularios antes de continuar desde el paso uno
  if (this.indice === 1 && e.accion === 'cont') {
    const ISVALID = this.validarTodosFormulariosPasoUno();
    if (!ISVALID) {
      this.esFormaValido = true;
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
 * Valida todos los formularios del primer paso antes de permitir continuar al siguiente paso.
 */
private validarTodosFormulariosPasoUno(): boolean {
  if (!this.pasoUnoComponent) {
    return true;
  }

  // Primero llamar validarFormularios para marcar los campos inválidos como tocados
  const ISFORM_VALID_TOUCHED = this.pasoUnoComponent.validarFormularios();
  
  if (!ISFORM_VALID_TOUCHED) {
    return false;
  }

  // Luego verificar la validez general
  const FORMS_VALIDITY = this.pasoUnoComponent.obtenerValidacionTotalFormularios();
  const CURRENT_TAB_INDEX = this.pasoUnoComponent.indice;
  
  // Validar según la pestaña activa
  if (CURRENT_TAB_INDEX === 1 && !FORMS_VALIDITY.tab1Valid) {
    return false;
  }
  
  if (CURRENT_TAB_INDEX === 2 && !FORMS_VALIDITY.tab2Valid) {
    return false;
  }

  return true;
}


}
