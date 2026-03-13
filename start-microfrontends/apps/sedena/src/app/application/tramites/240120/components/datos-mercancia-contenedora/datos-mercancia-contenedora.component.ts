import { Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DatosMercanciaComponent } from '../../../../shared/components/datos-mercancia/datos-mercancia.component';
import { MercanciaDetalle } from '../../../../shared/models/datos-del-tramite.model';
import { NUMERO_TRAMITE } from '../../../../shared/constants/datos-solicitud.enum';
import { Tramite240120Query } from '../../estados/tramite240120Query.query';
import { Tramite240120Store } from '../../estados/tramite240120Store.store';

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
export class DatosMercanciaContenedoraComponent implements OnInit, OnDestroy {

  /**
   * @event cerrar
   * @description Evento emitido para indicar que se debe cerrar el componente.
   * @remarks
   * Este evento no envía ningún valor, simplemente notifica a los componentes padres que se debe realizar la acción de cierre.
   * 
   * @eventType void
   * @es
   * Evento que se dispara para cerrar el componente actual.
   */
  @Output() cerrar = new EventEmitter<void>();

  /**
   * Identificador del procedimiento asociado al trámite.
   * @type {number}
   */
  public readonly idProcedimiento: number = NUMERO_TRAMITE.TRAMITE_240120;

  /**
   * Notificador para destruir las suscripciones y evitar fugas de memoria.
   * @type {Subject<void>}
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Datos de la mercancía obtenidos del store para ser editados o visualizados.
   * @type {MercanciaDetalle | null | undefined}
   */
  public mercanciaDatos!: MercanciaDetalle | null | undefined;

 /**
   * Constructor del componente.
   *
   * @param {Tramite240120Store} tramiteStore - Store de Akita para actualizar el estado de la tabla de mercancías.
   * @param {Tramite240120Query} tramiteQuery - Query de Akita para obtener el estado de la mercancía.
   */
  constructor(private tramiteStore: Tramite240120Store,
    private tramiteQuery: Tramite240120Query,
  ) {}

/**
   * Hook de inicialización del componente.
   */
  ngOnInit(): void {
    this.getMercanciaTablaDatos();
  }
 
  /**
   * Actualiza los datos de la tabla de mercancía en el store.
   *
   * @param {MercanciaDetalle[]} event - Lista de mercancías actualizada desde el formulario.
   */
  updateMercanciaDetalle(event: MercanciaDetalle[]): void {
    this.tramiteStore.updateMercanciaTablaDatos(event);
    this.cerrar.emit();
  }

  
  /**
   * Actualiza una mercancía existente en el store.
   *
   * @param {MercanciaDetalle[]} event - Lista de mercancías modificadas.
   */
   actualizaExistenteEnDatosMercancias(event: MercanciaDetalle[]): void {
    this.tramiteStore.actualizarMercanciasdatos(event);
  }

   /**
   * Cancela la edición de la mercancía y limpia el estado correspondiente en el store.
   */
  cancelarClickeado(): void {
    this.tramiteStore.setModificarMercanciasDatos(null);
  }

  /**
   * Obtiene los datos de la mercancía a modificar desde el query y los asigna a la propiedad local.
   * Utiliza takeUntil para limpiar la suscripción al destruir el componente.
   */
  getMercanciaTablaDatos(): void {
    this.tramiteQuery.getmodificarMercanciaTablaDatos$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos) => {
        this.mercanciaDatos = datos;
      });
  }
  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Limpia las suscripciones para evitar fugas de memoria.
   *
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
