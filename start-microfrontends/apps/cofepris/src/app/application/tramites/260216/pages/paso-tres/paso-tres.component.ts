import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FirmaElectronicaComponent } from '@libs/shared/data-access-user/src';

/**
 * @component
 * @name PasoTresComponent
 * @description
 * Componente Angular que representa el tercer paso de un trámite en la aplicación.
 * Este componente utiliza `CommonModule` y `FirmaElectronicaComponent` como dependencias
 * y está diseñado para ser autónomo (`standalone`).
 * 
 * @selector app-paso-tres
 * @template ./paso-tres.component.html
 * @style ./paso-tres.component.css
 * 
 * @usage
 * Este componente se utiliza como parte de un flujo de pasos en un trámite.
 */
@Component({
  selector: 'app-paso-tres',
  standalone: true,
  imports: [CommonModule,FirmaElectronicaComponent],
  templateUrl: './paso-tres.component.html',
  styleUrl: './paso-tres.component.css',
})
export class PasoTresComponent {}
