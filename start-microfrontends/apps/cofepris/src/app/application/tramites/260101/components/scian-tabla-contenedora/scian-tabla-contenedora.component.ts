/**
 * Componente utilizado en el trámite 260101 para gestionar la funcionalidad relacionada con la tabla SCIAN.
 *
 * Este archivo contiene la definición del componente `ScianTablaContenedoraComponent`, que utiliza el componente
 * `ScianTablaComponent` para mostrar y gestionar los datos de la tabla SCIAN. También interactúa con el estado
 * global del trámite a través del store `Tramite260101Store`.
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ID_PROCEDIMIENTO } from '../../constants/medicos-uso.enum';
import { ScianTablaComponent } from '../../../../shared/components/scian-tabla/scian-tabla.component';
import { TablaScianConfig } from '../../../../shared/models/datos-solicitud.model';
import { Tramite260101Store } from '../../estados/tramite260101Store.store';

/**
 * @component
 * @name ScianTablaContenedoraComponent
 * @description
 * Componente contenedor que utiliza el componente `ScianTablaComponent` para gestionar la funcionalidad
 * relacionada con la tabla SCIAN. Este componente interactúa con el estado del trámite a través del store `Tramite260101Store`.
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
 * - ScianTablaComponent: Componente compartido para mostrar y gestionar la tabla SCIAN.
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
   * Identificador del procedimiento actual.
   *
   * Se inicializa con la constante `ID_PROCEDIMIENTO` y se utiliza
   * para controlar la lógica del componente en función del
   * procedimiento en ejecución.
   */
  idProcedimiento: number = ID_PROCEDIMIENTO;

  /**
   * @property {TablaScianConfig} scianSeleccionado
   * Objeto que contiene los datos seleccionados de la tabla SCIAN.
   */
  public scianSeleccionado!: TablaScianConfig;

  /**
   * @constructor
   * @description
   * Constructor que inyecta el store `Tramite260101Store` para gestionar el estado del trámite.
   *
   * @param {Tramite260101Store} tramite260101Store - Store que administra el estado del trámite 260101.
   */
  constructor(private tramite260101Store: Tramite260101Store) {}

  /**
   * @method obtenerSeleccionado
   * @description
   * Método que actualiza el estado del store con la configuración seleccionada de la tabla SCIAN.
   *
   * @param {TablaScianConfig} event - Objeto que contiene los datos seleccionados de la tabla SCIAN.
   * @returns {void} Este método no retorna ningún valor.
   */
  obtenerSeleccionado(event: TablaScianConfig): void {
    this.tramite260101Store.update((state) => ({
      ...state,
      scianConfigDatos: [event],
    }));
  }
}