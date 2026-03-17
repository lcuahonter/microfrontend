import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ID_PROCEDIMIENTO } from '../../../constants/medicos-uso.enum';
import { PagoDeDerechosComponent } from '../../../../../shared/components/pago-de-derechos/pago-de-derechos.component';
import { PagoDerechosFormState } from '../../../../../shared/models/terceros-relacionados.model';
import { Tramite260212Query } from '../../../estados/tramite260212.query';
import { Tramite260212Store } from '../../../estados/tramite260212.store';
import { ViewChild } from '@angular/core';

/**
 * @component PagoDeDerechosContenedoraComponent
 * @description Componente contenedor que utiliza el componente `PagoDeDerechosComponent`
 * para gestionar la funcionalidad relacionada con el pago de derechos.
 * Este componente interactúa con el estado del trámite a través del store `Tramite260212Store`.
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
   * @property {boolean} formularioDeshabilitado
   * @description
   * Indica si el formulario está deshabilitado. Por defecto es `false`.
   */
  @Input()
  formularioDeshabilitado: boolean = false;
  /**
   * Referencia al componente hijo `PagoDeDerechosComponent`.
   * Permite acceder a las propiedades y métodos del componente hijo desde este componente contenedor.
   *
   */
  @ViewChild(PagoDeDerechosComponent)
  pagoDeDerechosComponent!: PagoDeDerechosComponent;
  /**
   * Representa el estado actual del formulario de pago de derechos.
   * Contiene los valores y configuraciones asociados al formulario.
   *
   * @type {PagoDerechosFormState}
   */
  public pagoDerechos: PagoDerechosFormState;

  /**
   * Observable que indica si el formulario está en modo solo lectura.
   * Cuando es `true`, el formulario no permite modificaciones por parte del usuario.
   *
   * @type {Observable<boolean>}
   */
  esFormularioSoloLectura!: Observable<boolean>;

  /**
   * Notificador para destruir las suscripciones y evitar fugas de memoria.
   * Se utiliza en combinación con el operador `takeUntil` de RxJS.
   *
   * @private
   * @type {Subject<void>}
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * @property {number} idProcedimiento
   * @description Identificador del procedimiento.
   */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;

  /**
   * Constructor de la clase que inicializa el estado del trámite y determina si el formulario es de solo lectura.
   *
   * @param {Tramite260212Store} tramiteStore - Store que contiene el estado del trámite 260212.
   * @param {ConsultaioQuery} consultaQuery - Query para obtener el estado de la sección de consulta.
   */
  constructor(
    public tramiteStore: Tramite260212Store,
    private consultaQuery: ConsultaioQuery,
    private tramiteQuery: Tramite260212Query
  ) {
    this.pagoDerechos = this.tramiteStore.getValue().pagoDerechos;
    this.esFormularioSoloLectura =
      this.consultaQuery.selectConsultaioState$.pipe(
        map((seccionState) => {
          if (!seccionState.create && seccionState.procedureId === '260212') {
            return seccionState.readonly;
          }
          return false;
        })
      );
  }

  /**
   * @inheritdoc
   * @description
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   * 
   * Subscribes to the `selectTramiteState$` observable from `tramiteQuery` and updates the `pagoDerechos` property
   * with the latest value from the state. The subscription is automatically unsubscribed when the `destroyNotifier$`
   * emits, preventing memory leaks.
   *
   * @see https://angular.io/api/core/OnInit
   * @memberof PagoDeDerechosContenedoraComponent
   * @returns {void}
   */
  ngOnInit(): void {
    this.tramiteQuery.selectTramiteState$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.pagoDerechos = data.pagoDerechos;
      });
  }
  /**
   * Actualiza la información de pago de derechos en el store del trámite.
   *
   * Este método toma un objeto `PagoDerechosFormState` que contiene los datos actualizados
   * del formulario de pago de derechos y llama al método `updatePagoDerechos` del `tramiteStore`
   * para persistir los cambios.
   *
   * @param event Un objeto `PagoDerechosFormState` con los datos actualizados del formulario de pago.
   * @returns void.
   *
   * @example
   * ```typescript
   * const pagoActualizado: PagoDerechosFormState = {
   * // ... datos del formulario
   * };
   * this.updatePagoDerechos(pagoActualizado);
   * ```
   */
  updatePagoDerechos(event: PagoDerechosFormState): void {
    this.tramiteStore.updatePagoDerechos(event);
  }
  /**
   *  Valida el formulario de pago de derechos en el componente hijo.
   *  Retorna `true` si el formulario es válido, de lo contrario `false`.
   */
  validarContenedor(): boolean {
    return (
      this.pagoDeDerechosComponent?.formularioSolicitudValidacion() ?? false
    );
  }

  /**
   * @inheritdoc
   * @description
   * Lifecycle hook that is called when the component is destroyed.
   * 
   * Emits a value to the `destroyNotifier$` subject and completes it to clean up subscriptions,
   * preventing memory leaks.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
