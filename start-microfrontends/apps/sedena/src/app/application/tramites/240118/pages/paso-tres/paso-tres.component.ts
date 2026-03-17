import { Component } from '@angular/core';

@Component({
  selector: 'app-paso-tres',
  templateUrl: './paso-tres.component.html',
  styleUrl: './paso-tres.component.scss',
})

/**
 * Componente correspondiente al tercer paso del trámite. Contiene la sección de firma electrónica.
 * Encapsula el componente de firma electrónica como parte final del flujo de solicitud.
 * 
 * @description Componente Angular que representa el tercer y último paso del trámite 240118.
 * Este componente encapsula la funcionalidad de firma electrónica, permitiendo al usuario
 * completar el proceso de solicitud del permiso extraordinario para la exportación de sustancias químicas.
 * 
 * @example
 * ```typescript
 * // Uso en el template padre
 * <app-paso-tres></app-paso-tres>
 * ```
 * 
 * @since 1.0.0
 * @author VUCEM Development Team
 * @version 1.0.0
 */
export class PasoTresComponent {
  /**
   * Título del paso mostrado en la interfaz de usuario.
   * @readonly solo lectura
   */
  readonly titulo = 'Firmar solicitud';
}
