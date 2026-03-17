import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FirmaElectronicaComponent } from '@libs/shared/data-access-user/src';

/**
 * @title Paso Tres
 * @description Componente correspondiente al tercer paso del trámite. Contiene la sección de firma electrónica.
 * @summary Encapsula el componente de firma electrónica como parte final del flujo de solicitud.
 */

/**
 * @component
 * @name PasoTresComponent
 * @description
 * Componente correspondiente al paso tres de un trámite específico en la aplicación.
 * Este componente utiliza una plantilla HTML y un archivo CSS para su presentación.
 * 
 * @selector app-paso-tres
 * @template ./paso-tres.component.html
 * @style ./paso-tres.component.scss
 */
@Component({
  selector: 'app-paso-tres',
  standalone: true,
  imports:[CommonModule ,FirmaElectronicaComponent],
  templateUrl: './paso-tres.component.html',
  styleUrl: './paso-tres.component.scss',
})
export class PasoTresComponent {}
