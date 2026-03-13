/**
 * @fileoverview
 * Este archivo define el componente `PasoDosComponent`, que representa el segundo paso
 * en el flujo de un trámite específico dentro de la aplicación. Este componente utiliza
 * varios módulos y componentes secundarios para manejar la interfaz de usuario y la lógica
 * asociada al paso dos del trámite.
 * 
 * @module PasoDosComponent
 * @description
 * Este componente Angular utiliza la constante `TEXTOS` para manejar textos relacionados
 * con la interfaz de usuario. Es parte del flujo de un trámite específico dentro de la aplicación.
 */

import { AlertComponent, TEXTOS, TituloComponent } from "@ng-mf/data-access-user";
import { AnexarDocumentosComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

/**
 * @class PasoDosComponent
 * @description
 * Componente Angular que representa el paso dos de un trámite.
 * Este componente utiliza la constante `TEXTOS` para manejar textos relacionados con la interfaz de usuario.
 */
@Component({
  selector: 'app-paso-dos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AnexarDocumentosComponent,
    TituloComponent,
    AlertComponent,
  ],
  templateUrl: './paso-dos.component.html',
})
export class PasoDosComponent {
  /**
   * Contiene los textos utilizados en el componente.
   * Los textos son importados desde la constante global `TEXTOS`.
   * @type {typeof TEXTOS}
   */
  TEXTOS = TEXTOS;
}