/**
 * @description
 * Componente que representa el segundo paso de un proceso.
 * Este componente es independiente (standalone) y utiliza varios componentes compartidos
 * para mostrar información y permitir la interacción del usuario.
 */
import { Component } from '@angular/core';
import { TEXTOS } from '@libs/shared/data-access-user/src';

/**
 * @nombre PasoDosComponent
 * @descripcion
 * Componente que representa el segundo paso de un proceso.
 * Este componente utiliza componentes compartidos como `TituloComponent`, 
 * `AnexarDocumentosComponent` y `AlertComponent` para mostrar información y manejar documentos.
 */
@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html', 
})
export class PasoDosComponent {
  /**
   * @description
   * Constante que contiene textos utilizados en la interfaz de usuario.
   * Estos textos son cargados desde un archivo compartido para mantener consistencia.
   */
  TEXTOS = TEXTOS;
}
