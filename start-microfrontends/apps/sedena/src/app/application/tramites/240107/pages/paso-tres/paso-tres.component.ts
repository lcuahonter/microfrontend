/**
 * @component PasoTresComponent
 * @description Este componente es responsable de manejar el tercer paso del trámite.
 * Incluye la lógica para obtener la firma y navegar a la página de acuse.
 * 
 * @import { Component, Input } from '@angular/core';
 * @import { Router } from '@angular/router';
 */

import { Component } from '@angular/core';
import { TEXTOS } from '@ng-mf/data-access-user';

@Component({
  selector: 'paso-tres',
  templateUrl: './paso-tres.component.html',
  styleUrl: './paso-tres.component.scss'
})
export class PasoTresComponent {

  /**
   * Objeto con las instrucciones.
   * @property {string} TEXTOS - Instrucciones para el usuario. --220201
   */
  TEXTOS: string = TEXTOS?.INSTRUCCIONES;
}