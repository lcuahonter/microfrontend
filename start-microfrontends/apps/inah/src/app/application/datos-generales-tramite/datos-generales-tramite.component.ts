import { AccuseComponentes } from '@libs/shared/data-access-user/src/core/models/lista-trimites.model';
import { Component } from '@angular/core';
import { DatosGeneralesDelTramiteComponent } from '@libs/shared/data-access-user/src';
import { LISTA_TRIMITES } from '../shared/constantes/lista-trimites.enums';


@Component({
  selector: 'app-datos-generales-tramite',
  standalone: true,
  imports: [DatosGeneralesDelTramiteComponent],
  templateUrl: './datos-generales-tramite.component.html',
  styleUrl: './datos-generales-tramite.component.scss',
})
export class DatosGeneralesTramiteComponent {
  tramites: AccuseComponentes[] = LISTA_TRIMITES;
}
