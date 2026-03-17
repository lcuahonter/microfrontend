import { Component, EventEmitter, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DatosMercanciaComponent } from '../../../../shared/components/datos-mercancia/datos-mercancia.component';
import { MercanciaDetalle } from '../../../../shared/models/datos-del-tramite.model';
import { NUMERO_TRAMITE } from '../../../../shared/constants/datos-solicitud.enum';
import { OnDestroy } from '@angular/core';
import { Tramite240118Query } from '../../estados/tramite240118Query.query';
import { Tramite240118Store } from '../../estados/tramite240118Store.store';

/**
 * @title DatosMercanciaContenedoraComponent
 * @description Componente contenedor encargado de gestionar la edición y actualización de los datos de mercancía en el trámite 240118.
 * @summary Actúa como intermediario entre el componente de datos de mercancía y el store de Akita, permitiendo actualizar, modificar y cancelar la edición de mercancías.
 *
 * Este componente:
 * - Recibe y expone los datos de mercancía para su edición.
 * - Actualiza el estado global del trámite con los cambios realizados en la mercancía.
 * - Permite cancelar la edición y limpiar el estado correspondiente.
 * - Se asegura de limpiar las suscripciones al destruirse para evitar fugas de memoria.
 *
 * @component
 */
@Component({
  selector: 'app-datos-mercancia-contenedora',
  standalone: true,
  imports: [CommonModule, DatosMercanciaComponent],
  templateUrl: './datos-mercancia-contenedora.component.html',
  styleUrl: './datos-mercancia-contenedora.component.scss',
})
export class DatosMercanciaContenedoraComponent implements OnDestroy {
  /**
   * Evento emitido al cerrar el componente, utilizado para notificar al componente padre que se debe cerrar.
   * @type {EventEmitter<void>}
   */
  @Output() cerrar = new EventEmitter<void>();
  /**
   * Identificador del procedimiento asociado al trámite.
   * @type {number}
   */
  public readonly idProcedimiento: number = NUMERO_TRAMITE.TRAMITE_240118;

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
   * Inyecta el store y el query para gestionar el estado de la mercancía.
   *
   * @param tramiteStore Store de Akita para actualizar el estado de la tabla de mercancías.
   * @param tramiteQuery Query de Akita para consultar el estado de la mercancía.
   */
  constructor(
    private tramiteStore: Tramite240118Store,
    private tramiteQuery: Tramite240118Query
  ) {
    this.getMercanciaTablaDatos();
  }

  /**
   * Actualiza los datos de la tabla de mercancía en el store.
   *
   * @param event Lista de mercancías actualizada desde el formulario.
   */
  updateMercanciaDetalle(event: MercanciaDetalle[]): void {
    this.tramiteStore.updateMercanciaTablaDatos(event);
    this.cerrar.emit();
  }

  /**
   * Actualiza una mercancía existente en el store.
   *
   * @param event Lista de mercancías modificadas.
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
   * Emite y completa el observable `destroyNotifier$` para limpiar suscripciones activas
   * y prevenir fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
