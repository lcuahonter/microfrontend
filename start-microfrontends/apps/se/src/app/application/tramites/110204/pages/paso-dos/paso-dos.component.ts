import { Component } from '@angular/core';
import { TEXTOS } from '@ng-mf/data-access-user';

/**
 * Este componente se muestra en el paso dos del asistente.
 * En este paso se inicializan y muestran los textos necesarios.
 */
@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss',
})
export class PasoDosComponent {
  
  /**
   * Variable que almacena los textos utilizados en el componente.
   * Se inicializa con los textos provenientes de la constante TEXTOS importada.
   */
  TEXTOS = TEXTOS;
}
