import { AfterViewInit, Component } from '@angular/core';
import { Subject,map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { PagoDeDerechosComponent } from '../../../../shared/components/pago-de-derechos/pago-de-derechos.component';
import { PagoDerechosFormState } from '../../../../shared/models/pago-de-derechos.model';
import { Tramite240321Query } from '../../estados/tramite240321Query.query';
import { Tramite240321Store } from '../../estados/tramite240321Store.store';
import { takeUntil } from 'rxjs';
/**
 * @title Pago de Derechos Contenedora
 * @description Container component responsible for linking the payment rights state with the corresponding form.
 * @summary Listens for state changes and propagates updates to the store.
 */

@Component({
  selector: 'app-pago-de-derechos-contenedora',
  standalone: true,
  imports: [CommonModule, PagoDeDerechosComponent],
  templateUrl: './pago-de-derechos-contenedora.component.html',
  styleUrl: './pago-de-derechos-contenedora.component.scss',
})
export class PagoDeDerechosContenedoraComponent implements OnInit, OnDestroy,AfterViewInit {
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
   * Indica si el formulario debe mostrarse en modo solo lectura.
   *
   * @type {boolean}
   * @memberof AgregarDestinatarioFinalContenedoraComponent
   * @see https://compodoc.app/
   */
  esFormularioSoloLectura:boolean=false;

  /**
   * Constructor del componente.
   *
   * @method constructor
   * @param {Tramite240321Query} tramiteQuery - Query para obtener el estado actual del pago de derechos.
   * @param {Tramite240321Store} tramiteStore - Store que administra el estado del pago de derechos.
   * @param {ConsultaioQuery} consultaioQuery - Query para acceder al estado de la consulta.
   * @returns {void}
   */
  constructor(
    private tramiteQuery: Tramite240321Query,
    private tramiteStore: Tramite240321Store,
    private readonly consultaioQuery:ConsultaioQuery
  ) {
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
  }

  /**
   * @inheritdoc
   * @description
   * Método del ciclo de vida de Angular que se ejecuta después de que la vista del componente ha sido inicializada.
   * 
   * Suscribe al observable `selectConsultaioState$` para escuchar cambios en el estado de la sección y actualizar
   * la propiedad `esFormularioSoloLectura` según el valor de `readonly` en el estado.
   * 
   * La suscripción se mantiene activa hasta que se emite un valor en `unsubscribe$`, lo que previene fugas de memoria.
   * 
   * @see https://angular.io/api/core/AfterViewInit
   */
  ngAfterViewInit(): void {
        this.consultaioQuery.selectConsultaioState$
                                  .pipe(
                                    takeUntil(this.unsubscribe$),
                                    map((seccionState)=>{
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
