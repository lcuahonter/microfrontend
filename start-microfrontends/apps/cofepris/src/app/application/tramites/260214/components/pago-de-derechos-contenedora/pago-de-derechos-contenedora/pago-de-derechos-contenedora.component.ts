/**
 * Componente utilizado en el trámite 260214 para gestionar la funcionalidad relacionada con el pago de derechos.
 *
 * Este archivo contiene la definición del componente `PagoDeDerechosContenedoraComponent`, que utiliza el componente
 * `PagoDeDerechosComponent` para gestionar y actualizar los datos del formulario de pago de derechos.
 * También interactúa con el estado global del trámite a través del store `Tramite260214Store`.
 */

import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject,map , takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ID_PROCEDIMIENTO } from '../../../constants/medicos-uso.enum';
import { PagoDeDerechosComponent } from '../../../../../shared/components/pago-de-derechos/pago-de-derechos.component';
import { PagoDerechosFormState } from '../../../../../shared/models/terceros-relacionados.model';
import { Tramite260214Query } from '../../../estados/tramite260214Query.query';
import { Tramite260214Store } from '../../../estados/tramite260214Store.store';

/**
 * @component
 * @name PagoDeDerechosContenedoraComponent
 * @description
 * Componente contenedor que utiliza el componente `PagoDeDerechosComponent`
 * para gestionar la funcionalidad relacionada con el pago de derechos.
 * Este componente interactúa con el estado del trámite a través del store `Tramite260214Store`.
 *
 * @selector app-pago-de-derechos-contenedora
 * Define el selector del componente que se utiliza en las plantillas HTML para instanciar este componente.
 *
 * @standalone true
 * Indica que este componente es independiente y no requiere un módulo Angular para ser utilizado.
 *
 * @templateUrl ./pago-de-derechos-contenedora.component.html
 * Especifica la ubicación del archivo de plantilla HTML asociado con este componente.
 *
 * @styleUrl ./pago-de-derechos-contenedora.component.scss
 * Especifica la ubicación del archivo de estilos CSS asociado con este componente.
 *
 * @imports
 * - CommonModule: Proporciona directivas comunes de Angular como `ngIf` y `ngFor`.
 * - PagoDeDerechosComponent: Componente compartido para gestionar el formulario de pago de derechos.
 */
@Component({
  selector: 'app-pago-de-derechos-contenedora',
  standalone: true,
  imports: [CommonModule, PagoDeDerechosComponent],
  templateUrl: './pago-de-derechos-contenedora.component.html',
  styleUrl: './pago-de-derechos-contenedora.component.scss',
})
export class PagoDeDerechosContenedoraComponent implements OnInit,OnDestroy {
  /**
   * @property {boolean} formularioDeshabilitado
   * Indica si el formulario está deshabilitado.
   */
  @Input() formularioDeshabilitado: boolean = false;

  /**
   * Identificador numérico del procedimiento actual.
   * Se inicializa con el valor constante `ID_PROCEDIMIENTO`.
   */
  idProcedimiento: number = ID_PROCEDIMIENTO;

  /**
   * @property {PagoDerechosFormState} pagoDerechos
   * Estado actual del formulario de pago de derechos, obtenido del store del trámite.
   */
  public pagoDerechos!: PagoDerechosFormState;

  @ViewChild(PagoDeDerechosComponent)
  pagoDeDerechosComponent!: PagoDeDerechosComponent;
  /**
   * @property {Subject<void>} destroyNotifier$
   * Observable utilizado para notificar y cancelar suscripciones activas al destruir el componente.
   * @private
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * @constructor
   * @description
   * Constructor que inyecta el store `Tramite260214Store` para gestionar el estado del trámite.
   * Inicializa la propiedad `pagoDerechos` con el valor actual del store.
   *
   * @param {Tramite260214Store} tramiteStore - Store que administra el estado del trámite 260214.
   */
  constructor(public tramiteStore: Tramite260214Store, private tramite260214Query: Tramite260214Query) {

  }

  ngOnInit(): void {
    this.tramite260214Query.selectTramiteState$
          .pipe(
            takeUntil(this.destroyNotifier$),
            map((seccionState) => {
              this.pagoDerechos = seccionState.pagoDerechos;
            })
          )
          .subscribe();
  }

  /**
   * @method updatePagoDerechos
   * @description
   * Actualiza los datos del formulario de pago de derechos en el store del trámite.
   *
   * @param {PagoDerechosFormState} event - Estado actualizado del formulario de pago de derechos.
   * @returns {void} Este método no retorna ningún valor.
   */
  updatePagoDerechos(event: PagoDerechosFormState): void {
    this.tramiteStore.updatePagoDerechos(event);
  }

  validarContenedor(): boolean {
    return (
      this.pagoDeDerechosComponent?.formularioSolicitudValidacion() ?? false
    );
  }

  isAnyFieldFilledButNotAll(): boolean {
    return this.pagoDeDerechosComponent.isAnyFieldFilledButNotAll();
  }

  get continuarButtonClicked(): boolean {
  return this.pagoDeDerechosComponent?.continuarButtonClicked ?? false;
}

  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
