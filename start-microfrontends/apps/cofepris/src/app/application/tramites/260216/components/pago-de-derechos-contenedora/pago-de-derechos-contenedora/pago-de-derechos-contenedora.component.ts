/**
 * Componente utilizado en el trámite 260216 para gestionar la funcionalidad relacionada con el pago de derechos.
 *
 * Este archivo contiene la definición del componente `PagoDeDerechosContenedoraComponent`, que utiliza el componente
 * `PagoDeDerechosComponent` para gestionar y actualizar los datos del formulario de pago de derechos.
 * También interactúa con el estado global del trámite a través del store `Tramite260216Store`.
 */

import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src/core/queries/consulta.query';
import { ID_PROCEDIMIENTO } from '../../../constants/medicos-uso.enum';
import { PagoDeDerechosComponent } from '../../../../../shared/components/pago-de-derechos/pago-de-derechos.component';
import { PagoDerechosFormState } from '../../../../../shared/models/terceros-relacionados.model';
import { Tramite260216Query } from '../../../estados/tramite260216Query.query';
import { Tramite260216Store } from '../../../estados/tramite260216Store.store';

/**
 * @component
 * @name PagoDeDerechosContenedoraComponent
 * @description
 * Componente de Angular que actúa como un contenedor para gestionar la funcionalidad relacionada con el pago de derechos.
 * Permite actualizar los datos del formulario de pago de derechos en el store del trámite 260216.
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
 * - PagoDeDerechosComponent: Componente reutilizable para gestionar el formulario de pago de derechos.
 */
@Component({
  selector: 'app-pago-de-derechos-contenedora',
  standalone: true,
  imports: [CommonModule, PagoDeDerechosComponent],
  templateUrl: './pago-de-derechos-contenedora.component.html',
  styleUrl: './pago-de-derechos-contenedora.component.scss',
})
export class PagoDeDerechosContenedoraComponent implements OnDestroy, OnInit {
  /**
   * @property {boolean} formularioDeshabilitado
   * Indica si el formulario está deshabilitado.
   * @defaultValue false
   */
  @Input() formularioDeshabilitado: boolean = false;

  @ViewChild(PagoDeDerechosComponent) pagoDeDerechosComponent!: PagoDeDerechosComponent;
  
  /**
   * @property {PagoDerechosFormState} pagoDerechos
   * Estado actual del formulario de pago de derechos, obtenido del store del trámite.
   */
  public pagoDerechos!: PagoDerechosFormState;

   /**
     * Notificador para destruir observables y evitar fugas de memoria.
     */
    private destroyNotifier$: Subject<void> = new Subject();
  
  /**
     * @property {string} idProcedimiento
     * @description Identificador del procedimiento.
     */
    public readonly idProcedimiento = ID_PROCEDIMIENTO;
  
    /**
   * que indica si el formulario está en modo solo lectura.
   * Cuando es `true`, el formulario no permite modificaciones por parte del usuario.
   *
   * @type {boolean}
   */
  esFormularioSoloLectura!: boolean;


  /**
   * @constructor
   * @description
   * Constructor que inyecta el store `Tramite260216Store` para gestionar el estado del trámite.
   * Inicializa la propiedad `pagoDerechos` con el valor actual del store.
   *
   * @param {Tramite260216Store} tramiteStore - Store que administra el estado del trámite 260216.
   */
  constructor(public tramiteStore: Tramite260216Store, private consultaQuery: ConsultaioQuery, private tramiteQuery: Tramite260216Query) {
    this.pagoDerechos = this.tramiteStore.getValue().pagoDerechos;
    this.consultaQuery.selectConsultaioState$
            .pipe(
              takeUntil(this.destroyNotifier$),
            )
            .subscribe((seccionState) => {
              if(!seccionState.create && seccionState.procedureId === '260216') {
                this.esFormularioSoloLectura = seccionState.readonly;
              } 
            });
  }

  ngOnInit():void
  {
    this.tramiteQuery.selectTramiteState$
          .pipe(takeUntil(this.destroyNotifier$))
          .subscribe((data) => {
            this.pagoDerechos = data.pagoDerechos;
          });
  }

  /**
   * @method updatePagoDerechos
   * @description
   * Actualiza los datos del formulario de pago de derechos en el store del trámite.
   *
   * @param {PagoDerechosFormState} event - Estado actualizado del formulario de pago de derechos.
   * @returns {void} Este método no retorna ningún valor.
   *
   * @example
   * ```typescript
   * const nuevoEstado: PagoDerechosFormState = { monto: 1000, referencia: 'ABC123' };
   * this.updatePagoDerechos(nuevoEstado);
   * ```
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

  /**
   * Método del ciclo de vida de Angular que se llama justo antes de que el componente sea destruido.
   *
   * Este método emite un valor a través del observable `destroyNotifier$` para notificar a los suscriptores
   * que el componente está siendo destruido, y luego completa el observable para liberar recursos.
   *
   * @returns {void} No retorna ningún valor.
   */
   ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}