
import { Component, ViewChild } from '@angular/core';

import { AccionBoton, DatosPasos, ListaPasosWizard, WizardComponent } from '@libs/shared/data-access-user/src';
import { PASOS } from '../../constantes/sanidad-acuicola-importacion.enum';

/**
 * @componente
 * @nombre SanidadAcuicolaImportacionComponent
 * @descripcion
 * Componente que gestiona el flujo del trámite de sanidad acuícola e importación.
 * Implementa un asistente (wizard) para guiar al usuario a través de los diferentes
 * pasos del proceso de solicitud.
 */
@Component({
  selector: 'app-sanidad-acuicola-importacion',
  standalone: false,
  templateUrl: './sanidad-acuicola-importacion.component.html',
})
export class SanidadAcuicolaImportacionComponent {

  
 /**
   * Reference to the WizardComponent.
   */
 @ViewChild(WizardComponent) wizardComponent!: WizardComponent;
 /**
  * Lista de pasos para el asistente (wizard) de asignación directa.
  */
 pantallasPasos: ListaPasosWizard[] = PASOS;

 /**
  * Índice actual del paso en el asistente.
  */
 indice: number = 1;

 /**
  * Clase CSS para aplicar estilos específicos a los elementos de la interfaz.
  */
 class: string = 'alert-danger';

   /**
  * The data for the steps in the wizard.
  */
   datosPasos: DatosPasos = {
     nroPasos: this.pantallasPasos.length,
     indice: this.indice,
     txtBtnAnt: 'Anterior',
     txtBtnSig: 'Continuar',
   };

 /**
  * Updates the index value based on the action button event.
  * @param e The action button event containing the action and value.
  */
 public getValorIndice(e: AccionBoton): void {
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
