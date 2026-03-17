

/**
 * compo doc
 * @component PasoDosComponent
 * @description
*/
import { Component } from '@angular/core';
import { TEXTOS } from '@libs/shared/data-access-user/src';

/**
 * @nombre PasoDosComponent
 * @descripcion Componente que representa el segundo paso de un proceso.
 * Este componente es independiente (standalone) y utiliza varios componentes compartidos.
 */
@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html', 
})
export class PasoDosComponent {
 
  /**
   * @propiedad TEXTOS
   * @descripcion Referencia a los textos compartidos utilizados en el componente.
   */
  TEXTOS = TEXTOS;
}
