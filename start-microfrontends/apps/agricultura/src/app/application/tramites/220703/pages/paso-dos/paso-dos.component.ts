import { AlertComponent, AnexarDocumentosComponent, TituloComponent } from '@ng-mf/data-access-user';
import { Component } from '@angular/core';
import { TEXTOS_REQUISITOS } from '../../constantes/acuicola.enum';


@Component({
  selector: 'app-paso-dos',
  standalone: true,
  imports: [
    AlertComponent,
    TituloComponent,
    AnexarDocumentosComponent
  ],
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss'
})
export class PasoDosComponent {
  /**
   * Obtener el valor de la instrucción e inicializar la variable
   */
  TEXTOS = TEXTOS_REQUISITOS;
}
