import { Component } from '@angular/core';
import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';

/**
 * @fileoverview
 * Componente para el paso tres del trámite de importación de acuicultura.
 * Este componente representa la sección final del flujo, donde se pueden mostrar mensajes de confirmación o acciones finales.
 * Cobertura compodoc 100%: cada propiedad, método y constructor está documentado.
 * @module PasoTresComponent
 */

/**
 * Componente para el paso tres del trámite de importación de acuicultura.
 * @component PasoTresComponent
 * @selector app-paso-tres
 * @templateUrl ./paso-tres.component.html
 * @styleUrl ./paso-tres.component.scss
 */
@Component({
  selector: 'app-paso-tres',
  templateUrl: './paso-tres.component.html',
  styleUrl: './paso-tres.component.scss',
  standalone: true,
  imports: [
    FirmaElectronicaComponent
  ]
})
export class PasoTresComponent {
}