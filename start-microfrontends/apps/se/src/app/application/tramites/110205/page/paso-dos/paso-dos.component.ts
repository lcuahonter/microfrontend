/**
 * @component
 * @description
 * Componente PasoDosComponent para el segundo paso del trámite 110205.
 * Este componente representa la vista y lógica asociada al paso dos del flujo del trámite.
 *
 * @selector app-paso-dos
 * @template ./paso-dos.component.html
 * @style ./paso-dos.component.scss
 */
import { Component } from '@angular/core';

/**
 * @fileoverview Componente para mostrar el subtítulo y la sección de firma electrónica en el paso dos del asistente.
 * Este componente integra el formulario de firma electrónica para finalizar el trámite.
 * @module PasoDosComponent
 */

/**
 * Componente para mostrar el subtítulo del asistente y la sección de firma electrónica en el paso tres.
 * @component PasoDosComponent
 * @selector app-paso-dos
 * @templateUrl ./paso-dos.component.html
 * @styleUrls ./paso-dos.component.scss --90101
 */

@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss',
})
export class PasoDosComponent {}