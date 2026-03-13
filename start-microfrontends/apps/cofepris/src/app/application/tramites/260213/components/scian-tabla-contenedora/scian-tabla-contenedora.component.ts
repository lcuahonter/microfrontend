/**
 * @fileoverview
 * El `ScianTablaContenedoraComponent` es un componente de Angular diseñado para gestionar la funcionalidad relacionada con la tabla SCIAN.
 * Este componente utiliza el componente `ScianTablaComponent` y se comunica con el estado del trámite 260213 a través del store `Tramite260213Store`.
 * 
 * @module ScianTablaContenedoraComponent
 * @description
 * Este componente actúa como un contenedor para gestionar y actualizar los datos seleccionados de la tabla SCIAN en el flujo del trámite 260213.
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ID_PROCEDIMIENTO } from '../../constants/medicos-uso.enum';
import { ScianTablaComponent } from '../../../../shared/components/scian-tabla/scian-tabla.component';
import { TablaScianConfig } from '../../../../shared/models/datos-solicitud.model';
import { Tramite260213Store } from '../../estados/tramite260213Store.store';

/**
 * @component
 * @name ScianTablaContenedoraComponent
 * @description
 * Componente contenedor que utiliza el componente `ScianTablaComponent` 
 * para gestionar la funcionalidad relacionada con la tabla SCIAN. 
 * Este componente interactúa con el estado del trámite a través del store `Tramite260213Store`.
 *
 * @selector app-scian-tabla-contenedora
 * Define el selector del componente que se utiliza en las plantillas HTML para instanciar este componente.
 *
 * @standalone true
 * Indica que este componente es independiente y no requiere un módulo Angular para ser utilizado.
 *
 * @templateUrl ./scian-tabla-contenedora.component.html
 * Especifica la ubicación del archivo de plantilla HTML asociado con este componente.
 *
 * @styleUrl ./scian-tabla-contenedora.component.scss
 * Especifica la ubicación del archivo de estilos CSS asociado con este componente.
 *
 * @imports
 * - CommonModule: Proporciona directivas comunes de Angular como `ngIf` y `ngFor`.
 * - ScianTablaComponent: Componente compartido para gestionar los datos de la tabla SCIAN.
 */
@Component({
  selector: 'app-scian-tabla-contenedora',
  standalone: true,
  imports: [CommonModule, ScianTablaComponent],
  templateUrl: './scian-tabla-contenedora.component.html',
  styleUrl: './scian-tabla-contenedora.component.scss',
})
export class ScianTablaContenedoraComponent {
    
    /**
     * @property {number} idProcedimiento
     * @description Identificador del procedimiento.
     */
    public readonly idProcedimiento = ID_PROCEDIMIENTO;
  /**
   * @property {TablaScianConfig} scianSeleccionado
   * Contiene la configuración seleccionada de la tabla SCIAN.
   * Este objeto es utilizado para almacenar la información de la selección actual en la tabla.
   */
  public scianSeleccionado!: TablaScianConfig[];

  /**
   * @constructor
   * @description
   * Constructor que inyecta el servicio `Tramite260213Store` para actualizar el estado del store
   * con los datos seleccionados de la tabla SCIAN.
   * 
   * @param {Tramite260213Store} Tramite260213Store - Store que maneja el estado de la información del trámite.
   */
  constructor(private Tramite260213Store: Tramite260213Store) {}

  /**
   * @method obtenerSeleccionado
   * @description
   * Este método se llama cuando se selecciona un nuevo elemento en la tabla SCIAN.
   * Actualiza el estado del store con la configuración seleccionada de la tabla SCIAN.
   * 
   * @param {TablaScianConfig} event - Objeto que contiene los datos seleccionados de la tabla SCIAN.
   * El objeto `event` es de tipo `TablaScianConfig` y contiene la configuración actual seleccionada.
   *
   * @returns {void} Este método no retorna ningún valor.
   *
   * @example
   * ```typescript
   * const seleccion = { id: 1, descripcion: 'Actividad económica' };
   * this.obtenerSeleccionado(seleccion);
   * ```
   */
  obtenerSeleccionado(event: TablaScianConfig | TablaScianConfig[]): void {
    const DATOS = Array.isArray(event) ? event : [event];
     this.Tramite260213Store.update((state) => ({
      ...state,
      scianConfigDatos: DATOS
    }))
  }
}