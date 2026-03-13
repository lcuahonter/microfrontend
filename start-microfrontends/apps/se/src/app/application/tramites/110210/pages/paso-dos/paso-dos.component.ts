import { Component } from '@angular/core';
import { TEXTOS } from '@ng-mf/data-access-user';
/**
 * Este componente se muestra en PasaDos
 */
@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss',
})
export class PasoDosComponent {
  /**
   * Obtener el valor de la instrucción e inicializar la variable
   */
  TEXTOS = TEXTOS;
}
