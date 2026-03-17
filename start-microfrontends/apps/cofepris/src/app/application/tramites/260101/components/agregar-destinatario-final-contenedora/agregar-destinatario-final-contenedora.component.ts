/**
 * @fileoverview
 * El `AgregarDestinatarioFinalContenedoraComponent` es un componente de Angular diseñado para gestionar la funcionalidad relacionada con los destinatarios finales.
 * Este componente utiliza el componente `AgregarDestinatarioFinalComponent` y se comunica con el estado del trámite 260101 a través del store `Tramite260101Store`.
 *
 * @module AgregarDestinatarioFinalContenedoraComponent
 * @description
 * Este componente actúa como un contenedor para gestionar y actualizar los datos de la tabla de destinatarios finales en el store del trámite.
 */

import { Component, OnInit } from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';
import {
  Tramite260101State,
  Tramite260101Store,
} from '../../estados/tramite260101Store.store';
import { ActivatedRoute } from '@angular/router';
import { AgregarDestinatarioFinalComponent } from '../../../../shared/components/agregar-destinatario-final/agregar-destinatario-final.component';
import { CommonModule } from '@angular/common';
import { Destinatario } from '../../../../shared/models/terceros-relacionados.model';
import { ID_PROCEDIMIENTO } from '../../constants/medicos-uso.enum';
import { Tramite260101Query } from '../../estados/tramite260101Query.query';

/**
 * @component
 * @name AgregarDestinatarioFinalContenedoraComponent
 * @description
 * Componente contenedor que utiliza el componente `AgregarDestinatarioFinalComponent`
 * para gestionar la funcionalidad relacionada con los destinatarios finales.
 * Este componente interactúa con el estado del trámite a través del store `Tramite260101Store`.
 *
 * @selector app-agregar-destinatario-final-contenedora
 * Define el selector del componente que se utiliza en las plantillas HTML para instanciar este componente.
 *
 * @standalone true
 * Indica que este componente es independiente y no requiere un módulo Angular para ser utilizado.
 *
 * @templateUrl ./agregar-destinatario-final-contenedora.component.html
 * Especifica la ubicación del archivo de plantilla HTML asociado con este componente.
 *
 * @styleUrl ./agregar-destinatario-final-contenedora.component.scss
 * Especifica la ubicación del archivo de estilos CSS asociado con este componente.
 *
 * @imports
 * - CommonModule: Proporciona directivas comunes de Angular como `ngIf` y `ngFor`.
 * - AgregarDestinatarioFinalComponent: Componente compartido para gestionar la funcionalidad de los destinatarios finales.
 */
@Component({
  selector: 'app-agregar-destinatario-final-contenedora',
  standalone: true,
  imports: [CommonModule, AgregarDestinatarioFinalComponent],
  templateUrl: './agregar-destinatario-final-contenedora.component.html',
  styleUrl: './agregar-destinatario-final-contenedora.component.scss',
})
export class AgregarDestinatarioFinalContenedoraComponent implements OnInit {
  /**
   * Identificador numérico del procedimiento actual.
   *
   * @type {number}
   * @default ID_PROCEDIMIENTO
   *
   * ### Descripción:
   * - Almacena el valor del procedimiento que se está ejecutando.
   * - Se inicializa con la constante `ID_PROCEDIMIENTO`.
   */
  idProcedimiento: number = ID_PROCEDIMIENTO;

  /**
   * Notificador para la destrucción del componente.
   *
   * @type {Subject<void>}
   * @description
   * Se utiliza como mecanismo de cancelación para observables activos.
   * Al emitir un valor en este subject dentro de `ngOnDestroy`,
   * se asegura que todas las suscripciones se liberen correctamente,
   * evitando fugas de memoria.
   */
  destroyNotifier$ = new Subject<void>();

  /**
   * Estado actual del trámite 260101.
   *
   * @type {Tramite260101State}
   * @description
   * Contiene la información del estado del trámite en curso.
   * Se inicializa mediante inyección de datos o servicios
   * y se utiliza para controlar la lógica del componente.
   */
  public tramiteState!: Tramite260101State;

  /**
   * Lista de destinatarios finales en la tabla de datos.
   *
   * @type {Destinatario[]}
   * @description
   * Arreglo que almacena los registros de destinatarios finales
   * mostrados en la tabla. Se actualiza dinámicamente a partir de la
   * interacción del usuario o llamadas a servicios.
   */
  destinatarioFinalTablaDatos: Destinatario[] = [];

  /**
   * Constructor del componente.
   *
   * Inyecta los servicios necesarios para gestionar el estado del trámite,
   * realizar consultas relacionadas y acceder a los parámetros de la ruta activa.
   *
   * @param tramiteStore - Store encargado de manejar el estado del trámite 260101.
   * @param tramite260101Query - Query para consultar información del estado del trámite 260101.
   * @param route - Proporciona acceso a la información de la ruta activa y sus parámetros.
   */
  constructor(
    public tramiteStore: Tramite260101Store,
    public tramite260101Query: Tramite260101Query,
    private route: ActivatedRoute
  ) {
    this.tramite260101Query.selectTramiteState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.tramiteState = seccionState;
          this.destinatarioFinalTablaDatos =
            seccionState.destinatarioFinalTablaDatos;
        })
      )
      .subscribe();
  }

  /**
   * Ciclo de vida de Angular: `ngOnInit`.
   *
   * @description
   * Se ejecuta al inicializar el componente.
   *
   * - Se suscribe a los parámetros de la ruta (`queryParams`).
   * - Si el parámetro `update` es igual a `'false'`, se limpia la lista
   *   de destinatarios finales (`destinatarioFinalTablaDatos`).
   *
   * Esto permite controlar el estado inicial de la tabla de destinatarios
   * dependiendo de la navegación y parámetros enviados en la URL.
   */
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['update'] === 'false') {
        this.destinatarioFinalTablaDatos = [];
      } else if (params['update'] === 'true') {
        this.destinatarioFinalTablaDatos =
          this.tramiteState.destinatarioFinalTablaModificaDatos;
      }
    });
  }

  /**
   * @method updateDestinatarioFinalTablaDatos
   * @description
   * Actualiza los datos de la tabla de destinatarios finales en el store del trámite.
   *
   * @param {Destinatario[]} event - Lista de destinatarios finales que se actualizarán en el store.
   * @returns {void} Este método no retorna ningún valor.
   *
   * @example
   * ```typescript
   * const nuevosDestinatarios: Destinatario[] = [
   *   { id: 1, nombre: 'Destinatario 1' },
   *   { id: 2, nombre: 'Destinatario 2' },
   * ];
   * this.updateDestinatarioFinalTablaDatos(nuevosDestinatarios);
   * ```
   */
  updateDestinatarioFinalTablaDatos(event: Destinatario[]): void {
    this.tramiteStore.updateDestinatarioFinalTablaDatos(event);
  }
}
