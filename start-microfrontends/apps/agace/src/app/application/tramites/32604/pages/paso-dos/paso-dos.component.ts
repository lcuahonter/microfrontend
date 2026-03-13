import { Component } from '@angular/core';
import { TEXTOS_REQUISITOS } from '../../constants/empresas-comercializadoras.enum';

@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss'
})
export class PasoDosComponent {
  /**
   * Obtener el valor de la instrucción e inicializar la variable
   */
  TEXTOS = TEXTOS_REQUISITOS;
}
