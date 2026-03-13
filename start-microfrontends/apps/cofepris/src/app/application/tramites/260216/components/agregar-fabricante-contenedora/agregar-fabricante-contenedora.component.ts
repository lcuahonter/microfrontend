/**
 * @fileoverview
 * El `AgregarFabricanteContenedoraComponent` es un componente de Angular diseñado para gestionar la funcionalidad relacionada con los fabricantes.
 * Este componente utiliza el componente `AgregarFabricanteComponent` y se comunica con el estado del trámite a través del store `Tramite260216Store`.
 * 
 * @module AgregarFabricanteContenedoraComponent
 * @description
 * Este componente actúa como un contenedor para gestionar la funcionalidad de agregar fabricantes y permite actualizar los datos en el store del trámite.
 */

import { AgregarFabricanteComponent } from '../../../../shared/components/agregar-fabricante/agregar-fabricante.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Fabricante } from '../../../../shared/models/terceros-relacionados.model';
import { Tramite260216Store } from '../../estados/tramite260216Store.store';

/**
 * @component
 * @name AgregarFabricanteContenedoraComponent
 * @description
 * Componente de Angular que actúa como un contenedor para gestionar la funcionalidad relacionada con los fabricantes.
 * Permite actualizar los datos de la tabla de fabricantes en el store del trámite 260216.
 *
 * @selector app-agregar-fabricante-contenedora
 * Define el selector del componente que se utiliza en las plantillas HTML para instanciar este componente.
 *
 * @standalone true
 * Indica que este componente es independiente y no requiere un módulo Angular para ser utilizado.
 *
 * @templateUrl ./agregar-fabricante-contenedora.component.html
 * Especifica la ubicación del archivo de plantilla HTML asociado con este componente.
 *
 * @styleUrl ./agregar-fabricante-contenedora.component.scss
 * Especifica la ubicación del archivo de estilos CSS asociado con este componente.
 *
 * @imports
 * - CommonModule: Proporciona directivas comunes de Angular como `ngIf` y `ngFor`.
 * - AgregarFabricanteComponent: Componente reutilizable para gestionar la funcionalidad de agregar fabricantes.
 */
@Component({
  selector: 'app-agregar-fabricante-contenedora',
  standalone: true,
  imports: [CommonModule, AgregarFabricanteComponent],
  templateUrl: './agregar-fabricante-contenedora.component.html',
  styleUrl: './agregar-fabricante-contenedora.component.scss',
})
export class AgregarFabricanteContenedoraComponent {
  /**
   * Constructor del componente.
   * @constructor
   * @description Constructor que inyecta el store `Tramite260216Store` para gestionar el estado del trámite.
   *
   * @param {Tramite260216Store} tramite260216Store - Store que administra el estado del trámite 260216.
   */
  constructor(public tramite260216Store: Tramite260216Store) {}

  /**
   * @method updateFabricanteTablaDatos
   * @description Actualiza los datos de la tabla de fabricantes en el store del trámite.
   *
   * @param {Fabricante[]} event - Lista de fabricantes que se actualizarán en el store.
   * @returns {void} Este método no retorna ningún valor.
   *
   * @example
   * ```typescript
   * const nuevosFabricantes: Fabricante[] = [
   *   { id: 1, nombre: 'Fabricante 1' },
   *   { id: 2, nombre: 'Fabricante 2' },
   * ];
   * this.updateFabricanteTablaDatos(nuevosFabricantes);
   * ```
   */
  updateFabricanteTablaDatos(event: Fabricante[]): void {
    this.tramite260216Store.updateFabricanteTablaDatos(event);
  }
}