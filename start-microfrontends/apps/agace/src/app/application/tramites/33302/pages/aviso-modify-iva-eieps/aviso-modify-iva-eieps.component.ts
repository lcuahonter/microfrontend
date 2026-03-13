import { Component, ViewChild } from '@angular/core';
import { AccionBoton } from '@ng-mf/data-access-user';
import { BtnContinuarComponent } from "@ng-mf/data-access-user";
import { CommonModule } from '@angular/common';
import { DatosPasos } from '@ng-mf/data-access-user';
import { ListaPasosWizard } from '@ng-mf/data-access-user';
import { PASOS } from "../../constantes/importador-exportador.enum"
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { PasoTresComponent } from '../paso-tres/paso-tres.component';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { WizardComponent } from '@ng-mf/data-access-user';



@Component({
  selector: 'app-aviso-modify-iva-eieps', 
  standalone: true, 
  imports: [CommonModule, WizardComponent, PasoUnoComponent, PasoDosComponent, PasoTresComponent, BtnContinuarComponent], // Componentes importados para el wizard y botones
  templateUrl: './aviso-modify-iva-eieps.component.html', 
})
export class AvisoModifyIvaEIepsComponent {
  /** Lista de pasos para el wizard */
  pasos: ListaPasosWizard[] = PASOS;

  /** Índice actual del paso que se está visualizando */
  indice: number = 1;

  /** Datos para la navegación entre pasos, como el número total de pasos y los textos de los botones */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length, 
    indice: this.indice, 
    txtBtnAnt: 'Anterior', 
    txtBtnSig: 'Continuar', 
  };

  /** Referencia al componente Wizard, utilizado para la navegación entre pasos */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /** Método para manejar el cambio de índice según la acción del botón (anterior o siguiente) */
  getValorIndice(e: AccionBoton): void {
    
    
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

