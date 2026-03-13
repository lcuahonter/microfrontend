/** Importaciones necesarias desde Angular y otros módulos para el componente */
import { BtnContinuarComponent } from "@ng-mf/data-access-user";
import { Component } from '@angular/core';
import { DatosPasos} from "@ng-mf/data-access-user";
import { ListaPasosWizard } from '@ng-mf/data-access-user';
import { PASOS } from '../../constants/permiso-importacion-modification.enum';
import { PasoCuatroComponent } from "../paso-cuatro/paso-cuatro.component";
import { PasoDosComponent } from "../paso-dos/paso-dos.component";
import { PasoTresComponent } from "../paso-tres/paso-tres.component";
import { PasoUnoComponent } from "../paso-uno/paso-uno.component";
import { ViewChild } from '@angular/core';
import { WizardComponent } from "@ng-mf/data-access-user";
/** Interfaz para definir la estructura del objeto de acción del botón */
interface AccionBoton {
  accion: string; 
  valor: number;  
}
@Component({
  selector: 'app-permiso-de-retiro', 
  templateUrl: './permiso-de-retiro.component.html', 
  styleUrl: './permiso-de-retiro.component.scss',    
  imports: [WizardComponent, BtnContinuarComponent, PasoUnoComponent, PasoDosComponent, PasoTresComponent, PasoCuatroComponent],
  standalone: true, 

})
export class PermisoDeRetiroComponent {
  /** Variable que almacena el índice actual del paso */
  indice = 1;

  /** Lista de pasos para el asistente, obtenida de una constante */
  pasos: ListaPasosWizard[] = PASOS;

  /** Decorador para obtener una referencia del componente WizardComponent */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /** Objeto que contiene datos de los pasos para configurar el componente */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length, 
    indice: this.indice,        
    txtBtnAnt: 'Anterior',      
    txtBtnSig: 'Continuar',     
  };
  /** Método para actualizar el índice según el evento del botón */
  getValorIndice(e: AccionBoton): void {
    /** Valida que el valor esté en el rango permitido */
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

