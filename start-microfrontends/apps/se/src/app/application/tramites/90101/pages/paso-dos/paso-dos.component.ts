/**
 * @component PasoDosComponent
 * @description Este componente es responsable de manejar el segundo paso del trámite.
 * 
 * @import { Component } from '@angular/core';
 * @import { TEXTOS } from '../../../../shared/constantes/servicios-extraordinarios.enum';
 */

import { Component } from '@angular/core';
import { TEXTOS_REQUISITOS } from '../../constantes/prosec.module';

/**
 * @fileoverview Componente para mostrar el subtítulo y los requisitos del asistente en el paso dos del trámite.
 * Incluye la visualización de textos de ayuda y el componente para anexar documentos.
 * @module PasoDosComponent
 */

/**
 * Componente para mostrar el subtítulo del asistente y los requisitos en el paso dos.
 * @component PasoDosComponent
 * @selector app-paso-dos
 * @templateUrl ./paso-dos.component.html
 * @styleUrls ./paso-dos.component.scss
 */

@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss'
})
export class PasoDosComponent {

/**
 * @property {any} TEXTOS
 * @description
 * Constantes de textos utilizados en el componente para mostrar los requisitos y mensajes de ayuda en el paso dos del trámite PROSEC.
 * Estos textos se obtienen desde el archivo de constantes y son utilizados en la plantilla para la visualización dinámica de la información.
 */
TEXTOS = TEXTOS_REQUISITOS;

}