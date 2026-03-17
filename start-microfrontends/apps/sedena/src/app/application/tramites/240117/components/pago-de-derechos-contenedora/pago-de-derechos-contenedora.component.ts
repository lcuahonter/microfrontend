import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { PagoDeDerechosComponent } from '../../../../shared/components/pago-de-derechos/pago-de-derechos.component';
import { PagoDerechosFormState } from '../../../../shared/models/pago-de-derechos.model';
import { Tramite240117Query } from '../../estados/tramite240117Query.query';
import { Tramite240117Store } from '../../estados/tramite240117Store.store';

/**
 * @component
 * @name PagoDeDerechosContenedoraComponent
 * @description
 * Componente contenedor para la gestión del formulario de pago de derechos.
 * Este componente es responsable de suscribirse a los cambios en el estado del formulario
 * y actualizar el store correspondiente. También maneja la liberación de recursos al destruirse.
 *
 * @selector app-pago-de-derechos-contenedora
 * @standalone true
 * @imports [CommonModule, PagoDeDerechosComponent]
 * @templateUrl ./pago-de-derechos-contenedora.component.html
 * @styleUrl ./pago-de-derechos-contenedora.component.css
 *
 * @example
 * <app-pago-de-derechos-contenedora></app-pago-de-derechos-contenedora>
 */
@Component({
  selector: 'app-pago-de-derechos-contenedora',
  standalone: true,
  imports: [CommonModule, PagoDeDerechosComponent],
  templateUrl: './pago-de-derechos-contenedora.component.html',
  styleUrl: './pago-de-derechos-contenedora.component.css',
})
export class PagoDeDerechosContenedoraComponent implements OnInit, OnDestroy {
  /**
   * @property esFormularioSoloLectura
   * @description Indica si el formulario es de solo lectura.
   * @type {boolean}
   */
  @Input() esFormularioSoloLectura: boolean = false;

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
   * Constructor del componente.
   *
   * @method constructor
   * @param {Tramite240117Query} tramiteQuery - Query para obtener el estado actual del pago de derechos.
   * @param {Tramite240117Store} tramiteStore - Store que administra el estado del pago de derechos.
   * @param {ConsultaioQuery} consultaQuery - Query para obtener el estado de la consulta del usuario.
   * @returns {void}
   */
  constructor(
    private tramiteQuery: Tramite240117Query,
    private tramiteStore: Tramite240117Store,
    private consultaQuery: ConsultaioQuery
  ) { }

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
