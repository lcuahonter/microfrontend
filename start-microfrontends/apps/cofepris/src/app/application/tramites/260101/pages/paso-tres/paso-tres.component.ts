import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FirmaElectronicaComponent } from '@libs/shared/data-access-user/src';

/**
 * @component PasoTresComponent
 * @description
 * Componente que representa el tercer paso del flujo del trámite.
 * Este componente incluye la funcionalidad de firma electrónica y utiliza el componente `FirmaElectronicaComponent`.
 * 
 * @selector app-paso-tres
 * @standalone true
 * @imports
 * - CommonModule: Proporciona directivas comunes de Angular como `ngIf` y `ngFor`.
 * - FirmaElectronicaComponent: Componente reutilizable para la funcionalidad de firma electrónica.
 * 
 * @templateUrl ./paso-tres.component.html
 * Archivo HTML que define la estructura visual del componente.
 * 
 * @styleUrl ./paso-tres.component.css
 * Archivo CSS que define los estilos específicos del componente.
 */
@Component({
  selector: 'app-paso-tres',
  standalone: true,
  imports: [CommonModule, FirmaElectronicaComponent],
  templateUrl: './paso-tres.component.html',
  styleUrl: './paso-tres.component.css',
})
export class PasoTresComponent {}