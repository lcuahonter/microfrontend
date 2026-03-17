
/**
 *  Pago de Derechos Contenedora
 *  Componente contenedor que integra el componente de pago de derechos con el store del trámite 240308.
 * */
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { PagoDeDerechosComponent } from '../../../../shared/components/pago-de-derechos/pago-de-derechos.component';
import { PagoDerechosFormState } from '../../../../shared/models/pago-de-derechos.model';
import { Subject } from 'rxjs';
import { Tramite240308Query } from '../../estados/tramite240308Query.query';
import { Tramite240308Store } from '../../estados/tramite240308Store.store';
import { takeUntil } from 'rxjs';

import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ID_PROCEDIMIENTO } from '../../constants/solicitude-de-artificios-pirotecnicos.enum';
/**
 *  Pago de Derechos Contenedora
 *  Componente contenedor que se encarga de enlazar el estado de pago de derechos con el formulario correspondiente.
 *  Escucha cambios en el estado y propaga las actualizaciones al store.
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
   * Indica si el formulario es de solo lectura.
   * @property {boolean} esSoloLectura
   */
  esSoloLectura!: boolean;

  /**
   * Identificador del procedimiento.
   * Constante que define el ID único del procedimiento actual.
   * 
   * @constant {number} idProcedimiento
   */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;

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
   * @param {Tramite240308Query} tramiteQuery - Query para obtener el estado actual del pago de derechos.
   * @param {Tramite240308Store} tramiteStore - Store que administra el estado del pago de derechos.
   * @returns {void}
   */
  constructor(
    private tramiteQuery: Tramite240308Query,
    private tramiteStore: Tramite240308Store,
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
    this.consultaQuery.selectConsultaioState$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((estadoConsulta) => {
        this.esSoloLectura = estadoConsulta.readonly;
      })

    this.tramiteQuery.getPagoDerechos$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.pagoDerechoFormState = data;
      });
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
