import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AcusesYResolucionesFolioDelTramiteBusquedaComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

/**
 * Componente para gestionar la búsqueda de acuses y resoluciones del trámite 11106.
 */
@Component({
  selector: 'pagina-uno-acuses-y-resoluciones-busqueda',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AcusesYResolucionesFolioDelTramiteBusquedaComponent,
  ],
  templateUrl: './pagina-uno-acuses-y-resoluciones-busqueda.component.html',
  styleUrl: './pagina-uno-acuses-y-resoluciones-busqueda.component.scss',
})
export class PaginaUnoAcusesYResolucionesBusquedaComponent {
  /**
   * Constructor de la clase.
   * @param formBuilder Servicio para construir formularios reactivos.
   */
  public constructor(protected readonly formBuilder: FormBuilder) {
    // El constructor se utiliza para la inyección de dependencias.
  }
}