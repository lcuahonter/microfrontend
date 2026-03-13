import { AccionBoton } from '@libs/shared/data-access-user/src';
import { Component } from '@angular/core';
import { DatosPasos } from '@libs/shared/data-access-user/src';
import { ListaPasosWizard } from '@libs/shared/data-access-user/src';
import { OnDestroy } from '@angular/core';
import { PANTA_PASOS } from '../../services/registros-de-comercio-exterior.enum';
import { Subject } from 'rxjs';
import { TITULO_PASO_DOS } from '../../services/registros-de-comercio-exterior.enum';
import { TITULO_PASO_TRES } from '../../services/registros-de-comercio-exterior.enum';
import { TITULO_PASO_UNO } from '../../services/registros-de-comercio-exterior.enum';
import { ViewChild } from '@angular/core';
import { WizardComponent } from '@libs/shared/data-access-user/src';

/**
 * Componente que representa la página "Todos Pasos".
 *
 * Este componente gestiona los pasos en un proceso tipo asistente, incluyendo la navegación entre pasos,
 * la actualización del título basado en el paso actual y el manejo de eventos del ciclo de vida.
 */
@Component({
  selector: 'app-todos-pasos',
  templateUrl: './todos-pasos.component.html',
})
export class TodosPasosComponent implements OnDestroy {
  /**
   * Esta variable se utiliza para almacenar la lista de pasos.
   */
  pantallasPasos: ListaPasosWizard[] = PANTA_PASOS;
  /**
   * Esta variable se utiliza para almacenar el índice del paso.
   */
  indice: number = 1;
  /**
   * Representa el título del paso actual en el proceso.
   * Este valor se inicializa con una constante que representa el título del primer paso.
   */
  public titulo: string = TITULO_PASO_UNO;

  /**
   * Notificador para destruir observables activos.
   */
  private destroyed$ = new Subject<void>();

  /**
   * Esta variable se utiliza para almacenar el componente wizard.
   * @param wizardComponent - El componente wizard.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Represents the data for the steps in the process.
   */
  public datosPasos: DatosPasos = {
    nroPasos: this.pantallasPasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Este método se utiliza para inicializar el componente.
   */
  public getValorIndice(e: AccionBoton): void {
    if (e.valor > 0 && e.valor < 5) {
      this.indice = e.valor;
      if (this.indice === 2) {
        this.titulo = TITULO_PASO_DOS;
      } else if (this.indice === 3) {
        this.titulo = TITULO_PASO_TRES;
      } else {
        this.titulo = TITULO_PASO_UNO;
      }
      if (e.accion === 'cont') {
        this.wizardComponent.siguiente();
      } else {
        this.wizardComponent.atras();
      }
    }
  }

  /**
   * Método del ciclo de vida de Angular que se llama cuando el componente se destruye.
   * Este método completa el observable destroyNotifier$ para cancelar las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
