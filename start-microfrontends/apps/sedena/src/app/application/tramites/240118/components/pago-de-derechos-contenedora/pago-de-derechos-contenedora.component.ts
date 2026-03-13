import { CommonModule } from '@angular/common';

import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Subject, takeUntil } from 'rxjs';

import { ConsultaioQuery } from '@libs/shared/data-access-user/src';

import { PagoDeDerechosComponent } from '../../../../shared/components/pago-de-derechos/pago-de-derechos.component';
import { PagoDerechosFormState } from '../../../../shared/models/pago-de-derechos.model';

import { ID_PROCEDIMIENTO } from '../../constants/solicitud-permiso-extraordinario-exportacion';
import { Tramite240118Query } from '../../estados/tramite240118Query.query';
import { Tramite240118Store } from '../../estados/tramite240118Store.store';


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
   * Estado actual del formulario de pago de derechos.
   * @property {PagoDerechosFormState} pagoDerechoFormState
   */
  public pagoDerechoFormState!: PagoDerechosFormState;

  /**
   * Observable para liberar suscripciones al destruir el componente.
   * @property {Subject<void>} destroyNotifier$
   */
  private destroyNotifier$ = new Subject<void>();

  /**
   * @property esFormularioSoloLectura
   * @description Indica si el formulario es de solo lectura.
   * @type {boolean}
   */
  @Input()
  esFormularioSoloLectura: boolean = false;  

  /**
   * @property {boolean} estaOculto - Indica si el elemento está oculto o visible.
   * @remarks Este valor determina la visibilidad del componente en la interfaz de usuario.
   * @command Cambiar el valor de esta propiedad para alternar la visibilidad.
   */
  public readonly idProcedimiento: number = ID_PROCEDIMIENTO;
  /**
   * @property campoObligatorio
   * @description Indica si ciertos campos del formulario son obligatorios según el procedimiento.
   * @type {boolean}
   * @default true
   */
  public campoObligatorio = false;

  /**
   * Constructor del componente.
   *
   * @method constructor
   * @param {Tramite240118Query} tramiteQuery - Query para obtener el estado actual del pago de derechos.
   * @param {Tramite240118Store} tramiteStore - Store que administra el estado del pago de derechos.
   * @param {ConsultaioQuery} consultaioQuery - Servicio para consultar el estado de la aplicación.
   * @returns {void}
   */
  constructor(
    private tramiteQuery: Tramite240118Query,
    private tramiteStore: Tramite240118Store,
    private consultaioQuery: ConsultaioQuery
  ) {
    // No hacer nada
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
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.pagoDerechoFormState = data;
      });
    this.consultaioQuery.selectConsultaioState$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((seccionState) => {
        this.esFormularioSoloLectura = seccionState.readonly;
      });      
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
  /**
   * Hook del ciclo de vida que se ejecuta al destruir el componente.
   * Libera las suscripciones para evitar fugas de memoria.
   *
   * @method ngOnDestroy
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
