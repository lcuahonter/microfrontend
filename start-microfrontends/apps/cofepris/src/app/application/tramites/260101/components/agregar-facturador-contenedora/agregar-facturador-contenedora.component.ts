/**
 * @fileoverview
 * El `AgregarFacturadorContenedoraComponent` es un componente de Angular diseñado para gestionar la funcionalidad relacionada con los facturadores.
 * Este componente utiliza el componente `AgregarFacturadorComponent` y se comunica con el estado del trámite 260101 a través del store `Tramite260101Store`.
 *
 * @module AgregarFacturadorContenedoraComponent
 * @description
 * Este componente actúa como un contenedor para gestionar y actualizar los datos de la tabla de facturadores en el store del trámite.
 */

import { Component, OnInit } from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';
import {
  Tramite260101State,
  Tramite260101Store,
} from '../../estados/tramite260101Store.store';
import { ActivatedRoute } from '@angular/router';
import { AgregarFacturadorComponent } from '../../../../shared/components/agregar-facturador/agregar-facturador.component';
import { CommonModule } from '@angular/common';
import { Facturador } from '../../../../shared/models/terceros-relacionados.model';
import { Tramite260101Query } from '../../estados/tramite260101Query.query';

/**
 * @component
 * @name AgregarFacturadorContenedoraComponent
 * @description
 * Componente contenedor que utiliza el componente `AgregarFacturadorComponent`
 * para gestionar la funcionalidad relacionada con los facturadores.
 * Este componente interactúa con el estado del trámite a través del store `Tramite260101Store`.
 *
 * @selector app-agregar-facturador-contenedora
 * Define el selector del componente que se utiliza en las plantillas HTML para instanciar este componente.
 *
 * @standalone true
 * Indica que este componente es independiente y no requiere un módulo Angular para ser utilizado.
 *
 * @templateUrl ./agregar-facturador-contenedora.component.html
 * Especifica la ubicación del archivo de plantilla HTML asociado con este componente.
 *
 * @styleUrl ./agregar-facturador-contenedora.component.scss
 * Especifica la ubicación del archivo de estilos CSS asociado con este componente.
 *
 * @imports
 * - CommonModule: Proporciona directivas comunes de Angular como `ngIf` y `ngFor`.
 * - AgregarFacturadorComponent: Componente compartido para gestionar la funcionalidad de los facturadores.
 */
@Component({
  selector: 'app-agregar-facturador-contenedora',
  standalone: true,
  imports: [CommonModule, AgregarFacturadorComponent],
  templateUrl: './agregar-facturador-contenedora.component.html',
  styleUrl: './agregar-facturador-contenedora.component.scss',
})
export class AgregarFacturadorContenedoraComponent implements OnInit {
  /**
   * Notificador para la destrucción del componente.
   *
   * @type {Subject<void>}
   * @description
   * Subject utilizado como mecanismo de cancelación para observables activos.  
   * Cuando se emite un valor en `ngOnDestroy`, todas las suscripciones que usen  
   * `takeUntil(this.destroyNotifier$)` se completan automáticamente, evitando fugas de memoria.
   */
  destroyNotifier$ = new Subject<void>();

  /**
   * Estado actual del trámite 260101.
   *
   * @type {Tramite260101State}
   * @description
   * Contiene la información y valores asociados al estado del trámite en curso.  
   * Se actualiza mediante el `Store` y `Query` correspondientes.
   */
  public tramiteState!: Tramite260101State;

  /**
   * Lista de facturadores en la tabla de datos.
   *
   * @type {Facturador[]}
   * @description
   * Arreglo que almacena los registros de facturadores mostrados en la tabla.  
   * Puede ser actualizado dinámicamente a partir de interacciones del usuario
   * o de datos obtenidos desde el `Store` o un servicio.
   */
  facturadorTablaDatos: Facturador[] = [];
  /**
   * @constructor
   * @description
   * Constructor que inyecta el store `Tramite260101Store` para gestionar el estado del trámite.
   *
   * @param {Tramite260101Store} tramite260101Store - Store que administra el estado del trámite 260101.
   * @param {Tramite260101Query} tramite260101Query - Query que permite consultar datos del estado del trámite 260101.
   * @param {ActivatedRoute} route - Servicio de Angular que expone la ruta activa y sus parámetros.
   */
  constructor(
    public tramite260101Store: Tramite260101Store,
    public tramite260101Query: Tramite260101Query,
    public route: ActivatedRoute
  ) {
    this.tramite260101Query.selectTramiteState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.tramiteState = seccionState;
          this.facturadorTablaDatos = seccionState.facturadorTablaDatos;
        })
      )
      .subscribe();
  }

  /**
   * Ciclo de vida de Angular: `ngOnInit`.
   *
   * @description
   * Método ejecutado al inicializar el componente.  
   *
   * - Se suscribe a los parámetros de la ruta (`queryParams`).  
   * - Si el parámetro `update` es igual a `'false'`, se limpia la lista
   *   de facturadores (`facturadorTablaDatos`).  
   *
   * Esto permite controlar si la tabla debe mostrarse vacía o conservar
   * la información previa según el valor de la URL.
   */
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['update'] === 'false') {
        this.facturadorTablaDatos = [];
      } else if (params['update'] === 'true') {
        this.facturadorTablaDatos = this.tramiteState.facturadorTablaModificaDatos;
      }
    });
  }

  /**
   * @method updateFacturadorTablaDatos
   * @description
   * Actualiza los datos de la tabla de facturadores en el store del trámite.
   *
   * @param {Facturador[]} event - Lista de facturadores que se actualizarán en el store.
   * @returns {void} Este método no retorna ningún valor.
   *
   * @example
   * ```typescript
   * const nuevosFacturadores: Facturador[] = [
   *   { id: 1, nombre: 'Facturador 1' },
   *   { id: 2, nombre: 'Facturador 2' },
   * ];
   * this.updateFacturadorTablaDatos(nuevosFacturadores);
   * ```
   */
  updateFacturadorTablaDatos(event: Facturador[]): void {
    this.tramite260101Store.updateFacturadorTablaDatos(event);
  }
}
