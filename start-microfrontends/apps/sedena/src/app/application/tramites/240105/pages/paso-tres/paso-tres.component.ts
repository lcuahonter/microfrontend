import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FirmaElectronicaComponent } from '@libs/shared/data-access-user/src';

/**
 * PasoTresComponent es un componente independiente de Angular que representa el tercer paso en un proceso.
 * 
 * @selector app-paso-tres
 * @description Muestra la interfaz para el tercer paso, incluyendo la funcionalidad de firma electrónica.
 * @imports CommonModule, FirmaElectronicaComponent
 * @template ./paso-tres.component.html
 * @style ./paso-tres.component.scss
 */
@Component({
  selector: 'app-paso-tres',
  standalone: true,
  imports: [CommonModule, FirmaElectronicaComponent],
  templateUrl: './paso-tres.component.html',
  styleUrl: './paso-tres.component.scss',
})
export class PasoTresComponent {}
