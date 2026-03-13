/**
 * @fileoverview
 * El `PasoTresComponent` es un componente de Angular que representa el tercer paso del flujo del trámite 260219.
 * Este componente se utiliza para gestionar y mostrar la información correspondiente al tercer paso del trámite.
 *
 * @module PasoTresComponent
 * @description
 * Este componente forma parte del flujo de pasos del trámite 260219 y se encarga de manejar la lógica y la vista
 * asociadas al tercer paso del proceso.
 */

import { Component } from '@angular/core';

/**
 * @component
 * @name PasoTresComponent
 * @description
 * Componente que representa el tercer paso del flujo del trámite 260219.
 * Este componente se utiliza para mostrar y gestionar la información y acciones relacionadas con este paso.
 *
 * @selector app-paso-tres
 * Define el selector del componente que se utiliza en las plantillas HTML para instanciar este componente.
 *
 * @templateUrl ./paso-tres.component.html
 * Especifica la ubicación del archivo de plantilla HTML asociado con este componente.
 *
 * @styleUrl ./paso-tres.component.scss
 * Especifica la ubicación del archivo de estilos CSS asociado con este componente.
 */
@Component({
  selector: 'app-paso-tres',
  templateUrl: './paso-tres.component.html',
  styleUrl: './paso-tres.component.scss',
})
export class PasoTresComponent {}