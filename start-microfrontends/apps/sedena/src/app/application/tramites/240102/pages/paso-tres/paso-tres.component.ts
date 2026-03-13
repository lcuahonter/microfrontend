import { Component } from '@angular/core';
import { FirmaElectronicaComponent } from '@libs/shared/data-access-user/src';

/**
 * @title Paso Tres
 * @component
 * @description
 * Componente correspondiente al tercer paso del flujo del trámite.
 * Este paso está enfocado en capturar la firma electrónica del usuario para completar la solicitud.
 * 
 * @summary
 * Este componente encapsula el componente de firma electrónica y se considera la etapa final del proceso de solicitud.
 * 
 * @usageNotes
 * Este componente se usa normalmente dentro de un flujo de pasos o wizard de trámites.
 *
 * @example
 * <app-paso-tres></app-paso-tres>
 */
@Component({
  selector: 'app-paso-tres',
  standalone: true,
  imports: [FirmaElectronicaComponent],
  templateUrl: './paso-tres.component.html',
  styleUrl: './paso-tres.component.scss',
})
export class PasoTresComponent {}
