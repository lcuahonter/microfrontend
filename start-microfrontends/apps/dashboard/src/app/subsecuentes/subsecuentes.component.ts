import { AcusesYResolucionesBusquedaFolioComponent } from "../acuses-y-resoluciones-busqueda-folio/acuses-y-resoluciones-busqueda-folio.component";
import { AcusesYResolucionesFolioDelTramiteBusquedaComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TituloComponent } from '@ng-mf/data-access-user';

/**
 * @component SubsecuentesComponent
 * @description
 * Componente encargado de gestionar la consulta de trámites subsecuentes.
 * Permite la búsqueda por folio del trámite y por rangos de fechas.
 *
 * @example
 * <ng-mf-subsecuentes></ng-mf-subsecuentes>
 */
@Component({
  selector: 'ng-mf-subsecuentes',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    ReactiveFormsModule,
    AcusesYResolucionesFolioDelTramiteBusquedaComponent,
    AcusesYResolucionesBusquedaFolioComponent
],
  templateUrl: './subsecuentes.component.html',
  styleUrl: './subsecuentes.component.css',
})
export class SubsecuentesComponent {
  /**
   * @property procedureUrl
   * @description
   * URL base del procedimiento subsecuente.
   *
   * @type {string}
   */
  public procedureUrl = '/aga/subsecuentes';

  /**
   * @property busquedaForm
   * @description
   * Formulario reactivo para capturar criterios de búsqueda de trámites subsecuentes.
   * Incluye:
   * - folioDelTramite
   * - fechaInicial
   * - fechaFinal
   *
   * @type {FormGroup}
   */
  public busquedaForm: FormGroup;

  /**
   * @constructor
   * @param {FormBuilder} fb - Servicio de Angular para crear formularios reactivos.
   */
  constructor(private fb: FormBuilder) {
    this.busquedaForm = this.fb.group({
      /** Folio del trámite a consultar. */
      folioDelTramite: [''],

      /** Fecha inicial del rango de búsqueda. */
      fechaInicial: [''],

      /** Fecha final del rango de búsqueda. */
      fechaFinal: [''],
    });
  }
}
