import { Component } from '@angular/core';

import { AccuseComponentes } from '@libs/shared/data-access-user/src/core/models/lista-trimites.model';
import { DatosGeneralesDelTramiteComponent } from '@ng-mf/data-access-user';
import { LISTA_TRIMITES } from '../shared/constants/lista-trimites.enums';


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
