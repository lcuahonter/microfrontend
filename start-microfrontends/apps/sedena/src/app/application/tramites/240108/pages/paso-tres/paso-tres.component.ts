import { Component } from '@angular/core';

/**
 * @title Paso Tres
 * @component PasoTresComponent
 * @description
 * Componente correspondiente al tercer paso del trámite.
 * Este paso encapsula el componente de **firma electrónica**, representando la etapa final del proceso de solicitud.
 *
 * @summary
 * Este componente actúa como contenedor visual para la sección final del trámite donde se realiza la firma digital del usuario.
 *
 * @usageNotes
 * Este componente es simple y no contiene lógica interna en su clase TypeScript.
 * Se espera que la lógica de firma electrónica esté implementada en un componente hijo, como `FirmaElectronicaComponent`.
 *
 * @example
 * ```html
 * <app-paso-tres></app-paso-tres>
 * ```
 */
@Component({
  selector: 'app-paso-tres',
  templateUrl: './paso-tres.component.html',
  styleUrl: './paso-tres.component.scss',
})
export class PasoTresComponent {}
