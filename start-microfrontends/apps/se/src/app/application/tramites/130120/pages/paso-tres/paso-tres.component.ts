import { AlertComponent } from "@ng-mf/data-access-user";
import { AnexarDocumentosComponent } from "@ng-mf/data-access-user";
import { CommonModule } from "@angular/common";
import { Component } from '@angular/core';
import { TEXTOS } from '../../constants/permiso-importacion-modification.enum';
import { TituloComponent } from "@ng-mf/data-access-user";

/**
 * Componente para el paso tres del trámite 130120.
 * Se encarga de mostrar las instrucciones y el módulo de anexar documentos.
 *
 * @export
 * @class PasoTresComponent
 */
@Component({
  selector: 'app-paso-tres',
  templateUrl: './paso-tres.component.html',
  styleUrl: './paso-tres.component.scss',
  standalone: true,
  imports: [CommonModule, TituloComponent, AlertComponent, AnexarDocumentosComponent],
})
export class PasoTresComponent {

  /**
   * Texto de instrucciones para el usuario.
   * @type {string}
   */
  TEXTOS: string = TEXTOS?.INSTRUCCIONES;

}