import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DatosMercanciaComponent } from '../../../../shared/components/datos-mercancia/datos-mercancia.component';
import { MercanciaDetalle } from '../../../../shared/models/datos-del-tramite.model';
import { Tramite240101Store } from '../../estados/tramite240101Store.store';
import { NUMERO_TRAMITE } from '../../../../shared/constants/datos-solicitud.enum';

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
export class DatosMercanciaContenedoraComponent implements OnDestroy {
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
   * Observable que expone los datos de una mercancía seleccionada.
   * Emite un objeto `MercanciaDetalle` o `null` cuando no hay información disponible.
   */
  MercanciaDatos$!: Observable<MercanciaDetalle | null>;

  /**
   * Indica si el formulario debe mostrarse solo en modo de lectura.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Identificador único del procedimiento asociado al trámite.
   * 
   * @property {number} idProcedimiento
   * @remarks Este valor se utiliza para identificar el trámite específico.
   */
  idProcedimiento = NUMERO_TRAMITE.TRAMITE_240101;

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
   * @param {Tramite240101Store} tramiteStore - Store de Akita para actualizar el estado de la tabla de mercancías.
   * @param {ConsultaioQuery} consultaioQuery - Query de Akita para obtener el estado de la sección del formulario.
   * @returns {void}
   */
  constructor(private tramiteStore: Tramite240101Store, private readonly consultaioQuery: ConsultaioQuery) {

    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();
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
   * @description
   * Método del ciclo de vida de Angular que se llama justo antes de que el componente sea destruido.
   * Se utiliza para limpiar recursos, como la cancelación de suscripciones a observables, evitando así posibles fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
