import { Component } from '@angular/core';
import { TEXTOS } from '@ng-mf/data-access-user';

/**
 * @class PasoDosComponent
 * @description
 * Este componente gestiona el segundo paso de un trámite, donde se anexan documentos y se muestran alertas.
 *
 * @since 1.0.0
 * @version 1.0.0
 * @license MIT
 *
 * @selector app-paso-dos
 * @standalone true
 * @requires CommonModule
 * @requires AnexarDocumentosComponent
 * @requires AlertComponent
 * @requires TituloComponent
 *
 * @templateUrl ./paso-dos.component.html
 * @styleUrl ./paso-dos.component.scss
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