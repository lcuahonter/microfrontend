import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ID_PROCEDIMIENTO } from '../../constants/importacion-armas-municiones.enum';
import { PagoDeDerechosComponent } from '../../../../shared/components/pago-de-derechos/pago-de-derechos.component';
import { PagoDerechosFormState } from '../../../../shared/models/pago-de-derechos.model';
import { Tramite240105Query } from '../../estados/tramite240105Query.query';
import { Tramite240105Store } from '../../estados/tramite240105Store.store';

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
   * @var {number} idProcedimiento
   * @description Identificador único del procedimiento asociado.
   * @access Público
   * @readonly
   * @since Versión 1.0.0
   */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;

  /**
   * Estado actual del formulario de pago de derechos.
   * @property {PagoDerechosFormState} pagoDerechoFormState
   */
  public pagoDerechoFormState!: PagoDerechosFormState;

  /**
   * Observable adicional para limpieza de suscripciones.
   * @property {Subject<void>} destroy$
   */
  private destroy$ = new Subject<void>();

  /**
   * Indica si el formulario está en modo solo lectura.
   * @property {boolean} esFormularioSoloLectura
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Constructor del componente.
   *
   * @param {Tramite240105Query} tramiteQuery - Servicio para consultar el estado actual del trámite de pago de derechos.
   * @param {Tramite240105Store} tramiteStore - Store encargado de gestionar el estado del pago de derechos.
   * @param {ConsultaioQuery} consultaQuery - Servicio para realizar consultas adicionales relacionadas.
   */
  constructor(
    private tramiteQuery: Tramite240105Query,
    private tramiteStore: Tramite240105Store,
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
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.pagoDerechoFormState = data;
      });
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();
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
    this.destroy$.next();
    this.destroy$.complete();
  }
}
