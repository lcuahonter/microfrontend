import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';

/**
 * Componente Angular para el paso tres del trámite 230501.
 * Este componente se encarga de mostrar la sección de firma electrónica
 * como parte del proceso de solicitud.
 * 
 * @remarks
 * Este componente es autónomo y utiliza el módulo `CommonModule` y el componente `FirmaElectronicaComponent`.
 */
@Component({
  selector: 'app-paso-tres',
  standalone: true,
  imports: [CommonModule, FirmaElectronicaComponent],
  templateUrl: './paso-tres.component.html',
  styleUrl: './paso-tres.component.scss',
})
export class PasoTresComponent {
}