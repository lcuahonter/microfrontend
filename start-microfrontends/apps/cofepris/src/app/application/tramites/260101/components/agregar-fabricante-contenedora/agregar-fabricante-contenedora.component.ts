/**
 * @fileoverview
 * El `AgregarFabricanteContenedoraComponent` es un componente de Angular diseñado para gestionar la funcionalidad relacionada con los fabricantes.
 * Este componente utiliza el componente `AgregarFabricanteComponent` y se comunica con el estado del trámite 260101 a través del store `Tramite260101Store`.
 *
 * @module AgregarFabricanteContenedoraComponent
 * @description
 * Este componente actúa como un contenedor para gestionar y actualizar los datos de la tabla de fabricantes en el store del trámite.
 */

import { Component, OnInit} from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';
import {
  Tramite260101State,
  Tramite260101Store,
} from '../../estados/tramite260101Store.store';
import { ActivatedRoute } from '@angular/router';
import { AgregarFabricanteComponent } from '../../../../shared/components/agregar-fabricante/agregar-fabricante.component';
import { CommonModule } from '@angular/common';
import { Fabricante } from '../../../../shared/models/terceros-relacionados.model';
import { ID_PROCEDIMIENTO } from '../../constants/medicos-uso.enum';
import { Tramite260101Query } from '../../estados/tramite260101Query.query';

/**
 * @component
 * @name AgregarFabricanteContenedoraComponent
 * @description
 * Componente contenedor que utiliza el componente `AgregarFabricanteComponent`
 * para gestionar la funcionalidad relacionada con los fabricantes.
 * Este componente interactúa con el estado del trámite a través del store `Tramite260101Store`.
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
 * - AgregarFabricanteComponent: Componente compartido para gestionar la funcionalidad de los fabricantes.
 */
@Component({
  selector: 'app-agregar-fabricante-contenedora',
  standalone: true,
  imports: [CommonModule, AgregarFabricanteComponent],
  templateUrl: './agregar-fabricante-contenedora.component.html',
  styleUrl: './agregar-fabricante-contenedora.component.scss',
})
export class AgregarFabricanteContenedoraComponent implements OnInit {
  /**
   * @constructor
   * @description
   * Constructor que inyecta el store `Tramite260101Store` para gestionar el estado del trámite.
   *
   * @param {Tramite260101Store} tramite260101Store - Store que administra el estado del trámite 260101.
   */

  idProcedimiento: number = ID_PROCEDIMIENTO;

  /**
   * Notificador para la destrucción del componente.
   *
   * @type {Subject<void>}
   * @description
   * Subject que se utiliza como mecanismo de cancelación para observables.  
   * Al emitir un valor en `ngOnDestroy`, todas las suscripciones
   * que usen `takeUntil(this.destroyNotifier$)` se completan, 
   * evitando fugas de memoria.
   */
  destroyNotifier$ = new Subject<void>();

  /**
   * Estado actual del trámite 260101.
   *
   * @type {Tramite260101State}
   * @description
   * Contiene la información y valores del estado del trámite en curso.  
   * Se inicializa mediante datos externos o servicios que gestionan
   * el flujo de la aplicación.
   */
  public tramiteState!: Tramite260101State;

  /**
   * Lista de fabricantes en la tabla de datos.
   *
   * @type {Fabricante[]}
   * @description
   * Arreglo que almacena los registros de fabricantes mostrados en la tabla.  
   * Se actualiza dinámicamente a partir de la interacción del usuario
   * o de llamadas a servicios.
   */
  fabricanteTablaDatos: Fabricante[] = [];

  /**
   * Constructor del componente.
   *
   * @param {Tramite260101Store} tramite260101Store - Store encargado de manejar las acciones y actualizaciones del estado del trámite 260101.
   * @param {Tramite260101Query} tramite260101Query - Query que expone observables y selectores del estado del trámite 260101.
   * @param {ActivatedRoute} route - Servicio de Angular que permite acceder a información de la ruta activa, incluyendo parámetros y queryParams.
   *
   * @description
   * - Inyecta las dependencias necesarias para el manejo del estado (`Store` y `Query`) y la navegación (`ActivatedRoute`).  
   * - Se suscribe al observable `selectTramiteState$` proveniente de `tramite260101Query`.  
   * - Mediante `takeUntil(this.destroyNotifier$)`, asegura la correcta liberación de la suscripción en `ngOnDestroy`.  
   * - Con `map`, actualiza la propiedad local `tramiteState` y la lista `fabricanteTablaDatos`
   *   en función de los valores del estado (`seccionState`).  
   */
  constructor(
    public tramite260101Store: Tramite260101Store,
    public tramite260101Query: Tramite260101Query,
    private route: ActivatedRoute
  ) {
    this.tramite260101Query.selectTramiteState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.tramiteState = seccionState;
          this.fabricanteTablaDatos = seccionState.fabricanteTablaDatos;
        })
      )
      .subscribe();
  }

  /**
   * Ciclo de vida de Angular: `ngAfterViewInit`.
   *
   * @description
   * Se ejecuta después de que la vista del componente ha sido inicializada.  
   *
   * - Se suscribe a los parámetros de la ruta (`queryParams`).  
   * - Si el parámetro `update` es igual a `'false'`, se limpia la lista
   *   de fabricantes (`fabricanteTablaDatos`).  
   *
   * Esto permite resetear los datos de la tabla de fabricantes
   * en función de los parámetros recibidos en la URL tras la carga de la vista.
   */
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['update'] === 'false') {
        this.fabricanteTablaDatos = [];
      }else if (params['update'] === 'true') {
        this.fabricanteTablaDatos = this.tramiteState.fabricanteTablaModificaDatos;
      }
    });
  }

  /**
   * @method updateFabricanteTablaDatos
   * @description
   * Actualiza los datos de la tabla de fabricantes en el store del trámite.
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
    this.tramite260101Store.updateFabricanteTablaDatos(event);
  }
}