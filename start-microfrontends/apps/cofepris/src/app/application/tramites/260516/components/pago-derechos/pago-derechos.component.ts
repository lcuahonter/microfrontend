import { Component, ViewChild,OnInit,OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagoDeDerechosComponent } from '../../../../shared/components/pago-de-derechos/pago-de-derechos.component';
import { PagoDerechosFormState } from '../../../../shared/models/terceros-relacionados.model';
import { PagoDerechosQuery } from 'apps/cofepris/src/app/application/shared/estados/queries/pago-derechos.query';
import { Subject,takeUntil } from 'rxjs';
@Component({
  selector: 'app-pago-derechos',
  standalone: true,
  imports: [CommonModule, PagoDeDerechosComponent],
  templateUrl: './pago-derechos.component.html',
  styleUrl: './pago-derechos.component.scss',
})
export class PagoDerechosComponent implements OnInit, OnDestroy {
  idProcedimiento:number = 260516;
    /**
   * @property {Subject<void>} destroyNotifier$
   * @description Notificador utilizado para manejar la destrucción o desuscripción de observables.
   * Se usa comúnmente para limpiar suscripciones cuando el componente es destruido,
   * evitando así fugas de memoria y comportamientos inesperados.
   * Este Subject emite un valor cuando el componente va a ser destruido.
   *
   * @private
   * @type {Subject<void>}
   * @memberof PagoDeDerechosContenedoraComponent
   */
  private destroyNotifier$: Subject<void> = new Subject();
   constructor(
   private pagoDrenchosQuery: PagoDerechosQuery,   
    ) {}

    ngOnInit(): void {
    this.pagoDrenchosQuery.selectSolicitud$
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe(state => {
      this.pagoDerechos = state;
    });
  }
      @ViewChild(PagoDeDerechosComponent) pagoDeDerechosComponent!: PagoDeDerechosComponent;
        /**
         * @property {PagoDerechosFormState} pagoDerechos
         * @description Estado actual del formulario de pago de derechos, obtenido del store del trámite.
         */
        public pagoDerechos!: PagoDerechosFormState;
    
        formularioDeshabilitado: boolean = true;
  
          /**
           * Validates the "pago de derechos" form when a button is clicked.
           *
           * Calls the pagoDeDerechosComponent.formularioSolicitudValidacion() helper
           * and returns true when that helper indicates the form is valid.
           *
           * @returns {boolean} True if the form is valid; otherwise false.
           *
           * @public
           * @compodoc
           *
           * @example
           * if (this.validOnButtonClick()) {
           *   // proceed with submission
           * } else {
           *   // handle validation errors
           * }
           */
          validOnButtonClick(): boolean {
            return (
            this.pagoDeDerechosComponent?.formularioSolicitudValidacion() ?? false
          );
          }
  /**
   * @method ngOnDestroy
   * @description Método del ciclo de vida de Angular que se ejecuta cuando el componente es destruido.
   * Se utiliza para limpiar las suscripciones activas y evitar fugas de memoria.
   *
   * Este método es crucial para el manejo adecuado de recursos y memoria en la aplicación.
   * Al ejecutarse cuando el componente va a ser destruido, se encarga de:
   * 1. Emitir una señal a través del `destroyNotifier$` para notificar a todas las suscripciones activas
   * 2. Completar el Subject `destroyNotifier$` para liberar todos los recursos asociados
   *
   * Esto es especialmente importante en aplicaciones Angular para prevenir:
   * - Fugas de memoria por suscripciones no cerradas
   * - Comportamientos inesperados por observables que continúan ejecutándose
   * - Problemas de rendimiento por acumulación de suscripciones
   *
   * @implements {OnDestroy}
   * @returns {void} Este método no retorna ningún valor.
   *
   * @memberof PagoDeDerechosContenedoraComponent
   */
    ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
