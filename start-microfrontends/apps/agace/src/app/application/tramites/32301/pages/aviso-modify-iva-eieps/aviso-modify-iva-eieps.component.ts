import {
  AccionBoton,
  DatosPasos,
  ListaPasosWizard,
  WizardComponent,
  Usuario,
  PasoFirmaComponent
} from '@ng-mf/data-access-user';
import { Component, ViewChild ,EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PASOS } from "../../constantes/importador-exportador.enum";
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { USUARIO_INFO } from '../../enums/enum-32301.enum';
import { Tramite32301Store } from '../../estados/tramite32301.store';

// Componente principal para el aviso de modificación de IVA y EI/EPs
@Component({
  selector: 'app-aviso-modify-iva-eieps', // Selector del componente
  standalone: true, // El componente es independiente, sin necesidad de un módulo externo
  imports: [CommonModule, WizardComponent, PasoUnoComponent, PasoDosComponent, PasoFirmaComponent], // Componentes importados para el wizard y botones
  templateUrl: './aviso-modify-iva-eieps.component.html', // Ruta al archivo HTML
})
export class AvisoModifyIvaEIepsComponent {
  /** Lista de pasos para el wizard */
  pasos: ListaPasosWizard[] = PASOS;

  /** Índice actual del paso que se está visualizando */
  indice: number = 1;
  currentPasoUnoTab: number = 0;
  /** Datos para la navegación entre pasos, como el número total de pasos y los textos de los botones */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length, // Número total de pasos
    indice: this.indice, // Índice del paso actual
    txtBtnAnt: 'Anterior', // Texto para el botón de "anterior"
    txtBtnSig: 'Continuar', // Texto para el botón de "continuar"
  };

  datosUsuario: Usuario = USUARIO_INFO;
  cargarArchivosEvento = new EventEmitter<void>();
  seccionCargarDocumentos: boolean = true;
  activarBotonCargaArchivos: boolean = false;

   /**
   * Representa el identificador único para la solicitud.
   * Esta propiedad se utiliza para almacenar y gestionar el número de solicitud
   * asociado con el proceso zoosanitario actual.
   */
  numeroSolicitud: string = '';

   constructor(
      private Tramite32301Store: Tramite32301Store
    ) { }


  /** Referencia al componente Wizard, utilizado para la navegación entre pasos */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /** Método para manejar el cambio de índice según la acción del botón (anterior o siguiente) */
  getValorIndice(e: AccionBoton): void {
      this.numeroSolicitud = this.Tramite32301Store.getIdSolicitud();
    // Validación de valor y acción para actualizar el índice
    if (e.valor > 0 && e.valor < 5) {
      this.indice = e.valor;
      
      // Acción de continuar
      if (e.accion === 'cont') {
        this.wizardComponent.siguiente(); // Avanzar al siguiente paso
      } else {
        this.wizardComponent.atras(); // Volver al paso anterior
      }
    }
  }
  handleTabSelected(index: number):void {
  this.currentPasoUnoTab = index;
  }

  manejaEventoCargaDocumentos(carga: boolean): void {
    this.activarBotonCargaArchivos = carga;
  }
  cargaRealizada(cargaRealizada: boolean): void {
    this.seccionCargarDocumentos = cargaRealizada ? false : true;
  }

}

