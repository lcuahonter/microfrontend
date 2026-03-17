import { Component } from '@angular/core';
import {TEXTOS } from '@libs/shared/data-access-user/src';

@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.css',

})
export class PasoDosComponent {
  /**
   * @property {any} TEXTOS - Constantes de textos utilizados en el componente.
   */
  TEXTOS = TEXTOS;
}