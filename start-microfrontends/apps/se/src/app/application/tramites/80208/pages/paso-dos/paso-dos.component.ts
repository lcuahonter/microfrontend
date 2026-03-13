import { Component } from '@angular/core';
import { TEXTOS_REQUISITOS } from '../../constantes/texto.enum';

/**
 * @component PasoDosComponent
 * @description
 * Componente para mostrar el subtítulo del asistente.
 * @component PasoDosComponent
 * @selector app-paso-dos
 * @templateUrl ./paso-dos.component.html
 * @styleUrls ./paso-dos.component.scss
 */
@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
  styleUrls: ['./paso-dos.component.scss']
})
export class PasoDosComponent {

  /**
   * @property {object} TEXTOS
   * @description Objeto con los textos de los requisitos del certificado zoosanitario.
   */
  TEXTOS = TEXTOS_REQUISITOS;

}