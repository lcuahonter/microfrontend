/**
 * @fileoverview
 * El `PasoTresComponent` es un componente de Angular diseñado para gestionar la funcionalidad del tercer paso en el flujo del trámite.
 * Este componente utiliza el componente `FirmaElectronicaComponent` para gestionar la firma electrónica requerida en este paso.
 * 
 * @module PasoTresComponent
 * @description
 * Este componente actúa como un paso dentro del flujo del trámite 260213, donde se realiza la firma electrónica.
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FirmaElectronicaComponent } from '@libs/shared/data-access-user/src';

/**
 * @component
 * @name PasoTresComponent
 * @description
 * Componente que representa el tercer paso del flujo del trámite 260213. 
 * Este paso incluye la funcionalidad para realizar la firma electrónica utilizando el componente `FirmaElectronicaComponent`.
 *
 * @selector app-paso-tres
 * Define el selector del componente que se utiliza en las plantillas HTML para instanciar este componente.
 *
 * @standalone true
 * Indica que este componente es independiente y no requiere un módulo Angular para ser utilizado.
 *
 * @templateUrl ./paso-tres.component.html
 * Especifica la ubicación del archivo de plantilla HTML asociado con este componente.
 *
 * @styleUrl ./paso-tres.component.css
 * Especifica la ubicación del archivo de estilos CSS asociado con este componente.
 *
 * @imports
 * - CommonModule: Proporciona directivas comunes de Angular como `ngIf` y `ngFor`.
 * - FirmaElectronicaComponent: Componente compartido para gestionar la funcionalidad de la firma electrónica.
 */
@Component({
  selector: 'app-paso-tres',
  standalone: true,
  imports: [CommonModule, FirmaElectronicaComponent],
  templateUrl: './paso-tres.component.html',
  styleUrl: './paso-tres.component.css',
})
export class PasoTresComponent {}