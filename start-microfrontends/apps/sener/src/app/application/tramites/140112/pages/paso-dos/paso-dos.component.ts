import { AlertComponent, TituloComponent } from '@ng-mf/data-access-user';
import { AnexarDocumentosComponent} from '@ng-mf/data-access-user';
import { Component } from '@angular/core';
import { TEXTOS } from '@ng-mf/data-access-user';

@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss',
  standalone: true,
  imports: [TituloComponent, AlertComponent, AnexarDocumentosComponent],
})
export class PasoDosComponent {
  /**
   * Objeto con los textos de los requisitos.
   * @property {object} TEXTOS_REQUISITOS
   */
  TEXTOS = TEXTOS;
  

}