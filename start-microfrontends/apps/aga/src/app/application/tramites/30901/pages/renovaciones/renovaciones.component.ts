import { AlertComponent, BtnContinuarComponent, DatosPasos, ListaPasosWizard, WizardComponent } from '@ng-mf/data-access-user';
import { Component, ViewChild } from '@angular/core';
import { ERROR_DE_CAMPO, ERROR_VERIFICAR, SIGUIENTES_ERRORES } from '../../constantes/constantes';
import { CommonModule } from '@angular/common';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { PasoTresComponent } from '../paso-tres/paso-tres.component';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { RENOVACIONES_PASOS } from '../../enums/renovaciones-muestras-mercancias.enum';



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
 * Componente de renovaciones.
 *
 * Este componente maneja el flujo de pasos para el proceso de renovaciones.
 *
 * @selector 'app-renovaciones'
 * @templateUrl './renovaciones.component.html'
 * @styleUrl './renovaciones.component.scss'
 */
@Component({
  selector: 'app-renovaciones',
  standalone: true,
  imports: [
    WizardComponent,
    PasoUnoComponent,
    PasoDosComponent,
    PasoTresComponent,
    BtnContinuarComponent,
    AlertComponent,
    CommonModule,
  ],
  templateUrl: './renovaciones.component.html',
  styleUrl: './renovaciones.component.scss',
})
export class RenovacionesComponent {
  /**
   * Mensaje de error a mostrar.
   */
  esValido = true;

  mensajeError: string = '';

  /*
   * Esta variable se utiliza para almacenar la lista de pasos.
   */
  pasos: ListaPasosWizard[] = RENOVACIONES_PASOS;

  /**
   * Esta variable se utiliza para almacenar el índice del paso actual.
   */
  indice: number = 1;

  /**
   * Referencia al componente hijo WizardComponent utilizando @ViewChild.
   * Se utiliza para acceder a las propiedades y métodos públicos del componente wizard desde el componente padre.
   * El operador `!` indica que la variable será inicializada por Angular después de la creación del componente.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Referencia al componente de solicitud.

   */
  @ViewChild('pasoUno') pasoUnoComponent!: PasoUnoComponent;

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
   * Maneja la navegación entre los pasos del asistente según las acciones de los botones.
   * @param e - La acción del botón que contiene el tipo de acción y el valor del índice.
   */
  getValorIndice(evento: AccionBoton): void {
    if (evento.valor > 0 && evento.valor < 5) {
      if (this.indice === 1 && this.pasoUnoComponent.indice === 2) {
        const SOLICITUD_COMPONENT =
          this.pasoUnoComponent
            ?.registroRenovacionesMuestrasMercanciasComponent;
        this.esValido = SOLICITUD_COMPONENT?.validarFormulario() ?? false;
        this.mensajeError = ERROR_DE_CAMPO;
      }

      if (this.indice === 1 && this.pasoUnoComponent.indice === 4) {
        const SOLICITUD_COMPONENT =
          this.pasoUnoComponent?.pagoLineaDeCapturaComponent;
        this.esValido = SOLICITUD_COMPONENT?.validarFormulario() ?? false;
        this.mensajeError = SIGUIENTES_ERRORES;
        setTimeout(() => {
          this.mensajeError = ERROR_VERIFICAR;
        }, 1500);
      }

      if (!this.esValido) {
        this.datosPasos.indice = 1;
        return;
      }

      this.indice = evento.valor;
      if (evento.accion === 'cont') {
        this.wizardComponent.siguiente();
      } else {
        this.wizardComponent.atras();
      }
    }
  }
}
