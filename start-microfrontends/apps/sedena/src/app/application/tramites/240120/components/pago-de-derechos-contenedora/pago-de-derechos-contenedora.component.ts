import { Component, OnDestroy,OnInit } from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { ID_PROCEDIMIENTO } from '../../constants/importacion-armas-municiones.enum';
import { PagoDeDerechosComponent } from '../../../../shared/components/pago-de-derechos/pago-de-derechos.component';
import { PagoDerechosFormState } from '../../../../shared/models/pago-de-derechos.model';
import { Tramite240120Query } from '../../estados/tramite240120Query.query';
import { Tramite240120Store } from '../../estados/tramite240120Store.store';
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
   * Observable adicional para limpieza de suscripciones.
   * @property {Subject<void>} destroy$
   */
  private destroy$ = new Subject<void>();
  /**
* Indica si el formulario debe mostrarse en modo solo lectura.
*
* @type {boolean}
* @default false
*/
  esFormularioSoloLectura: boolean = false;
  /**
   * Identificador único del procedimiento asociado al componente.
   * 
   * @constant
   * @type {number}
   * @readonly
   * 
   * @remarks
   * Este valor se utiliza para identificar el procedimiento actual en el contexto
   * de la aplicación.
   */
  public readonly idProcedimiento: number = ID_PROCEDIMIENTO;
  /**
   * Constructor del componente.
   *
   * @method constructor
   * @param {Tramite240120Query} tramiteQuery - Query para obtener el estado actual del pago de derechos.
   * @param {Tramite240120Store} tramiteStore - Store que administra el estado del pago de derechos.
   * @param {ConsultaioQuery} consultaQuery - Query para obtener el estado de la consulta.
   * @returns {void}
   */
  constructor(
    private tramiteQuery: Tramite240120Query,
    private tramiteStore: Tramite240120Store,
    private consultaQuery: ConsultaioQuery,
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
