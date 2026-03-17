import { AlertComponent, AnexarDocumentosComponent, TituloComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
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
  standalone: true,
  imports: [CommonModule, AnexarDocumentosComponent, AlertComponent, TituloComponent],
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss',
})
export class PasoDosComponent {
  /**
   * @property {any} TEXTOS
   * @description
   * Contiene los textos utilizados en el componente, importados desde el módulo `@ng-mf/data-access-user`.
   * 
   * @example
   * ```typescript
   * console.log(this.TEXTOS.instruccion);
   * ```
   */
  TEXTOS = TEXTOS;
}