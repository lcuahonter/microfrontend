import { Component, ViewChild } from '@angular/core';
import { DatosPasos, ListaPasosWizard, WizardComponent } from '@ng-mf/data-access-user';
import { PERMISOS } from '../../enums/renuncia-de-derechos-de-permisos.enum'
interface AccionBoton {
  /**
   * The action to be performed.
   */
  accion: string;
  /**
   * The value associated with the action.
   */
  valor: number;
}

@Component({
  selector: 'app-renuncia-de-derechos-de-permisos',
  templateUrl: './renuncia-de-derechos-de-permisos.component.html',
})
export class RenunciaDeDerechosDePermisosComponent {
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  pantallasPasos: ListaPasosWizard[] = PERMISOS;

  indice = 1;

  datosPasos: DatosPasos = {
    nroPasos: this.pantallasPasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

   /**
   * Obtiene el valor del índice de la acción del botón.
   * @param e Acción del botón.
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
