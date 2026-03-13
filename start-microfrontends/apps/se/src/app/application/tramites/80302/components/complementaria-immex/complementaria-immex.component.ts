/**
 * @fileoverview Componente para gestión de información complementaria IMMEX
 * @description Este archivo contiene el componente Angular que maneja la información
 * complementaria del programa IMMEX en el trámite 80302, organizando datos en pestañas
 * que incluyen montos, factores, datos complementarios y anexos
 * @author Sistema VUCEM
 * @version 1.0.0
 * @since 2024
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DatosAnexosComponent } from '../datos-anexos/datos-anexos.component';
import { DatosComplimentariaComponent } from '../datos-complimentaria/datos-complimentaria.component';
import { MontoFactorComponent } from '../monto-factor/monto-factor.component';

/**
 * Componente de información complementaria para el programa IMMEX
 * @component ComplementariaImmexComponent
 * @description Componente standalone de Angular que organiza y gestiona la información
 * complementaria requerida para las modificaciones al programa IMMEX en el trámite 80302.
 * Utiliza un sistema de pestañas para organizar diferentes tipos de datos como montos,
 * factores de amplificación, datos complementarios de socios y anexos de productos
 * @example
 * ```html
 * <app-complementaria-immex></app-complementaria-immex>
 * ```
 * @see {@link MontoFactorComponent} Para gestión de montos y factores
 * @see {@link DatosComplimentariaComponent} Para datos de socios y accionistas
 * @see {@link DatosAnexosComponent} Para gestión de anexos de productos
 */
@Component({
  selector: 'app-complementaria-immex',
  templateUrl: './complementaria-immex.component.html',
  styleUrls: ['./complementaria-immex.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MontoFactorComponent,
    DatosComplimentariaComponent,
    DatosAnexosComponent,
  ],
})
export class ComplementariaImmexComponent {
  /**
   * Índice de la pestaña activa en el componente de información complementaria
   * @type {number}
   * @description Controla qué pestaña está actualmente visible en la interfaz del usuario.
   * Las pestañas organizan diferentes tipos de información complementaria del programa IMMEX:
   * - 1: Monto y factor de amplificación
   * - 2: Datos complementarios de socios y accionistas
   * - 3: Anexos de productos de exportación e importación
   * @default 1
   * @example
   * ```typescript
   * // Pestaña inicial (Monto y Factor)
   * this.indice = 1;
   * 
   * // Cambiar a datos complementarios
   * this.indice = 2;
   * 
   * // Mostrar anexos
   * this.indice = 3;
   * ```
   * @public
   */
  indice: number = 1;

  /**
   * Selecciona una pestaña específica del componente
   * @method seleccionaTab
   * @description Actualiza el índice de la pestaña activa para mostrar el contenido
   * correspondiente. Permite la navegación entre las diferentes secciones de
   * información complementaria del programa IMMEX
   * @param {number} i - Índice de la pestaña que se desea activar
   * @returns {void}
   * @example
   * ```typescript
   * // Seleccionar pestaña de monto y factor
   * this.seleccionaTab(1);
   * 
   * // Cambiar a datos complementarios
   * this.seleccionaTab(2);
   * 
   * // Mostrar anexos de productos
   * this.seleccionaTab(3);
   * ```
   * @see {@link indice} Para el estado actual de la pestaña
   * @public
   */
  seleccionaTab(i: number): void {
    this.indice = i; // Actualiza el índice de la pestaña seleccionada.
  }
}
