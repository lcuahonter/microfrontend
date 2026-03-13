import { Component } from '@angular/core';
import { TEXTOS } from '@ng-mf/data-access-user';

/**
 * Componente Angular para el paso tres del trámite 80101.
 * Este componente se encarga de mostrar las instrucciones del trámite.
 *
 * @remarks
 * Este componente es autónomo y utiliza el módulo `CommonModule`.
 */
@Component({
  selector: 'app-paso-tres',
  templateUrl: './paso-tres.component.html',
})
export class PasoTresComponent {

  /**
   * Objeto con las instrucciones.
   * @property {string} TEXTOS
   */
  TEXTOS: string = TEXTOS?.INSTRUCCIONES;
}
