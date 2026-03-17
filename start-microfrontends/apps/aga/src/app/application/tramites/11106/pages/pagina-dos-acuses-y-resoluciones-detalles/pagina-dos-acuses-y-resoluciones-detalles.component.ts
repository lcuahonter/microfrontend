import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AcusesYResolucionesFolioDelTramiteDetallesComponent } from '@libs/shared/data-access-user/src/tramites/components/acuses-y-resoluciones-folio-del-tramite-detalles/acuses-y-resoluciones-folio-del-tramite-detalles.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

/**
 * Componente para gestionar los detalles de acuses y resoluciones del trámite 11106.
 */
@Component({
  selector: 'pagina-dos-acuses-y-resoluciones-detalles',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AcusesYResolucionesFolioDelTramiteDetallesComponent,
  ],
  templateUrl: './pagina-dos-acuses-y-resoluciones-detalles.component.html',
  styleUrl: './pagina-dos-acuses-y-resoluciones-detalles.component.scss',
})
export class PaginaDosAcusesYResolucionesDetallesComponent {
  /**
   * Constructor de la clase.
   * @param formBuilder Servicio para construir formularios reactivos.
   */
  public constructor(public formBuilder: FormBuilder) {
    // El constructor se utiliza para la inyección de dependencias.
  }
}