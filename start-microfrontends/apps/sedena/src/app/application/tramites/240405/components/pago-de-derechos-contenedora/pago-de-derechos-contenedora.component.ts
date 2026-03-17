import { Subject, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { PagoDeDerechosComponent } from '../../../../shared/components/pago-de-derechos/pago-de-derechos.component';
import { PagoDerechosFormState } from '../../../../shared/models/pago-de-derechos.model';
import { Tramite240405Query } from '../../estados/tramite240405Query.query';
import { Tramite240405Store } from '../../estados/tramite240405Store.store';
import { takeUntil } from 'rxjs';
/**
 * @title Pago de Derechos Contenedora
 * @description Componente contenedor que se encarga de enlazar el estado de pago de derechos con el formulario correspondiente.
 * @summary Escucha cambios en el estado y propaga las actualizaciones al store.
 */

@Component({
  selector: 'app-pago-de-derechos-contenedora',
  standalone: true,
  imports: [CommonModule, PagoDeDerechosComponent],
  templateUrl: './pago-de-derechos-contenedora.component.html',
  styleUrl: './pago-de-derechos-contenedora.component.scss',
})
export class PagoDeDerechosContenedoraComponent implements OnInit, OnDestroy {
  /**
   * Observable para liberar suscripciones al destruir el componente.
   * @property {Subject<void>} unsubscribe$
   */
  private unsubscribe$ = new Subject<void>();

  /**
   * Estado actual del formulario de pago de derechos.
   * @property {PagoDerechosFormState} pagoDerechoFormState
   */
  public pagoDerechoFormState!: PagoDerechosFormState;
/**
   * Indica si el formulario está en modo solo lectura.
   * @property {boolean} esFormularioSoloLectura
   */
  esFormularioSoloLectura: boolean = false;
  /**
   * Constructor del componente.
   *
   * @method constructor
   * @param {Tramite240405Query} tramiteQuery - Query para obtener el estado actual del pago de derechos.
   * @param {Tramite240405Store} tramiteStore - Store que administra el estado del pago de derechos.
   * @returns {void}
   */
  constructor(
    private tramiteQuery: Tramite240405Query,
    private tramiteStore: Tramite240405Store,
     private consultaQuery: ConsultaioQuery 
  ) {
    // 
  }

  /**
   * Hook del ciclo de vida que se ejecuta al inicializar el componente.
   * Suscribe a los observables del query para reflejar los datos en la vista.
   *
   * @method ngOnInit
   * @returns {void}
   */
  ngOnInit(): void {
    this.tramiteQuery.getPagoDerechos$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.pagoDerechoFormState = data;
      });
        this.consultaQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.unsubscribe$),
      map((seccionState) => {
        this.esFormularioSoloLectura = seccionState.readonly;
      })
    )
    .subscribe();
  }

  /**
   * Hook del ciclo de vida que se ejecuta al destruir el componente.
   * Libera las suscripciones para evitar fugas de memoria.
   *
   * @method ngOnDestroy
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * Actualiza el estado del formulario de pago de derechos en el store.
   *
   * @method updatePagoDerechos
   * @param {PagoDerechosFormState} event - Estado actualizado del formulario.
   * @returns {void}
   */
  updatePagoDerechos(event: PagoDerechosFormState): void {
    this.tramiteStore.updatePagoDerechosFormState(event);
  }
}
