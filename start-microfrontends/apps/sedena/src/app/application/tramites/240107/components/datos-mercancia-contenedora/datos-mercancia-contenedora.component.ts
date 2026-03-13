import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatosMercanciaComponent } from '../../../../shared/components/datos-mercancia/datos-mercancia.component';
import { ID_PROCEDIMIENTO } from '../../constantes/sustancias-quimicas.enum';
import { MercanciaDetalle } from '../../../../shared/models/datos-del-tramite.model';
import { Tramite240107Store } from '../../estados/tramite240107Store.store';
import { map, Observable, Subject } from 'rxjs';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { Tramite240107Query } from '../../estados/tramite240107Query.query';

/**
 * @title Datos de la Mercancía Contenedora
 * @description Componente contenedor encargado de recibir los datos de mercancía y actualizar el estado global del trámite.
 * @summary Actúa como puente entre el componente de datos de mercancía y el store de Akita.
 */

@Component({
  selector: 'app-datos-mercancia-contenedora',
  standalone: true,
  imports: [CommonModule, DatosMercanciaComponent],
  templateUrl: './datos-mercancia-contenedora.component.html',
  styleUrl: './datos-mercancia-contenedora.component.scss',
})
export class DatosMercanciaContenedoraComponent {
  MercanciaDatos$!: Observable<MercanciaDetalle | null>;
  
    /**
   * Evento que se emite para notificar el cierre del componente.
   * Los componentes padres pueden suscribirse a este evento para ejecutar acciones al cerrar.
   *
   * @type {EventEmitter<void>}
   * @memberof AgregarDestinatarioFinalContenedoraComponent
   */
    /**
   * @output cerrar
   * Evento emitido cuando se solicita cerrar el componente.
   */
   @Output() cerrar = new EventEmitter<void>();
     /**
   * Indica si el formulario debe mostrarse solo en modo de lectura.
   */
  esFormularioSoloLectura: boolean = false

    /**
   * Identificador del procedimiento.
   * @property {number} idProcedimiento
   */
    public readonly idProcedimiento = ID_PROCEDIMIENTO;

     /**
   * Observable para limpiar suscripciones activas al destruir el componente.
   * 
   * @property {Subject<void>} destroyNotifier$
   */
  private destroyNotifier$ = new Subject<void>();

  /**
   * Constructor del componente.
   *
   * @method constructor
   * @param {Tramite240107Store} tramiteStore - Store de Akita para actualizar el estado de la tabla de mercancías.
   * @returns {void}
   */

  constructor(private tramiteStore: Tramite240107Store, private consultaioQuery: ConsultaioQuery, public tramiteQuery: Tramite240107Query) {
    // Se puede agregar aquí la lógica del constructor si es necesario
  }

  /**
   * Actualiza los datos de la tabla de mercancía en el store.
   *
   * @method updateMercanciaDetalle
   * @param {MercanciaDetalle[]} event - Lista de mercancías actualizada desde el formulario.
   * @returns {void}
   */
  updateMercanciaDetalle(event: MercanciaDetalle[]): void {
    this.tramiteStore.updateMercanciaTablaDatos(event);
    this.cerrar.emit();
  }

 /**
   * Inicializa el componente.
   * 
   * Se suscribe al Observable `getMercanciaTablaDatos$` del store `tramiteQuery`
   * y expone el primer elemento de la lista como `MercanciaDatos$`.
   * Si la lista está vacía o indefinida, se emite `null`.
   */
  ngOnInit(): void {
    this.MercanciaDatos$ = this.tramiteQuery.getMercanciaTablaDatos$.pipe(
      map(list => list?.[0] ?? null)
    );
  }

  /**
   * @description
   * Método del ciclo de vida de Angular que se llama justo antes de que el componente sea destruido.
   * Se utiliza para limpiar recursos, como la cancelación de suscripciones a observables, evitando así posibles fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
