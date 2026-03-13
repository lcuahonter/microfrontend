import { Component } from '@angular/core';

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
 * Este componente encapsula la funcionalidad de la firma electrónica, que es el paso final del flujo de solicitud.
 * Utiliza una plantilla HTML y un archivo CSS para su presentación.
 * 
 * @selector app-paso-tres
 * @template ./paso-tres.component.html
 * @style ./paso-tres.component.scss
 * 
 * @remarks
 * Este componente es independiente y utiliza el componente `FirmaElectronicaComponent` para gestionar
 * la firma electrónica del usuario.
 */
@Component({
  selector: 'app-paso-tres',

  templateUrl: './paso-tres.component.html',
  styleUrl: './paso-tres.component.scss',
})
export class PasoTresComponent {}
