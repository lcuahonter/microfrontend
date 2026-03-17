import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ID_PROCEDIMIENTO } from '../../../constants/medicos-sin-registrar.enum';
import { PagoDeDerechosComponent } from '../../../../../shared/components/pago-de-derechos/pago-de-derechos.component';
import { PagoDerechosFormState } from '../../../../../shared/models/terceros-relacionados.model';
import { Tramite260217Query } from '../../../estados/tramite260217Query.query';
import { Tramite260217Store } from '../../../estados/tramite260217Store.store';

/**
 * @component PagoDeDerechosContenedoraComponent
 * @description Componente contenedor responsable de gestionar la lógica de negocio 
 * relacionada con el pago de derechos del trámite 260217. Este componente actúa como
 * intermediario entre el componente de presentación `PagoDeDerechosComponent` y el
 * estado de la aplicación gestionado a través del `Tramite260217Store`.
 * 
 * @features
 * - Gestión del estado del formulario de pago de derechos
 * - Control de modo solo lectura basado en el estado de consulta
 * - Comunicación bidireccional con el store del trámite
 * - Limpieza automática de suscripciones para prevenir memory leaks
 * 
 * @author Sistema VUCEM 3.0
 * @since 2025
 * @version 1.0.0
 */
@Component({
  selector: 'app-pago-de-derechos-contenedora',
  standalone: true,
  imports: [CommonModule, PagoDeDerechosComponent],
  templateUrl: './pago-de-derechos-contenedora.component.html',
  styleUrl: './pago-de-derechos-contenedora.component.scss',
})
export class PagoDeDerechosContenedoraComponent implements OnDestroy,OnInit {

  /**
   * @property {number} idProcedimiento
   * @description
   * Identificador del procedimiento actual.
   */
    idProcedimiento: number = ID_PROCEDIMIENTO;

  /**
   * @property {PagoDerechosFormState} pagoDerechos
   * @description Estado actual del formulario de pago de derechos que contiene toda la
   * información relacionada con los datos de pago del trámite. Este objeto se sincroniza
   * con el store global del trámite y se actualiza automáticamente cuando hay cambios.
   * 
   * @type {PagoDerechosFormState}
   * @access public
   * @readonly false
   * @example
   * ```typescript
   * // Acceso a los datos del pago
   * const montoPago = this.pagoDerechos.monto;
   * const metodoPago = this.pagoDerechos.metodoPago;
   * ```
   */
  public pagoDerechos!: PagoDerechosFormState;

  /**
   * @property {boolean} esFormularioSoloLectura
   * @description Bandera que determina si el formulario de pago de derechos debe
   * mostrarse en modo solo lectura. Cuando es `true`, todos los campos del formulario
   * se deshabilitan y no permiten edición. Este valor se actualiza automáticamente
   * basándose en el estado de consulta obtenido del `ConsultaioQuery`.
   * 
   * @type {boolean}
   * @default false
   * @access public
   * @readonly false
   * @example
   * ```typescript
   * // En el template
   * <app-pago-derechos [readonly]="esFormularioSoloLectura"></app-pago-derechos>
   * ```
   */
  public esFormularioSoloLectura: boolean = false;

  /**
   * @property {Subject<void>} destroyNotifier$
   * @description Subject utilizado como notificador para la gestión del ciclo de vida
   * del componente y la limpieza de suscripciones a observables. Emite una señal cuando
   * el componente es destruido, permitiendo que todas las suscripciones activas se
   * cancelen automáticamente para prevenir memory leaks.
   * 
   * @type {Subject<void>}
   * @access private
   * @readonly false
   * @pattern Unsubscribe Pattern
   * @example
   * ```typescript
   * // Uso típico con takeUntil
   * this.observable$
   *   .pipe(takeUntil(this.destroyNotifier$))
   *   .subscribe(data => { ... });
   * ```
   */
  private destroyNotifier$: Subject<void> = new Subject();

  @ViewChild(PagoDeDerechosComponent)
  pagoDeDerechosComponent!: PagoDeDerechosComponent;

  /**
   * @constructor
   * @description Constructor del componente que inicializa las dependencias necesarias
   * y configura las suscripciones a los observables del estado. Establece la configuración
   * inicial del formulario de pago de derechos y configura la escucha del estado de
   * solo lectura.
   * 
   * @param {Tramite260217Store} tramiteStore - Store principal que gestiona todo el
   * estado relacionado con el trámite 260217, incluyendo los datos de pago de derechos.
   * Este parámetro es público para permitir el acceso desde el template.
   * 
   * @param {ConsultaioQuery} consultaQuery - Query service que proporciona acceso al
   * estado de consulta de la aplicación, utilizado principalmente para determinar
   * si el formulario debe estar en modo solo lectura.
   * 
   * @throws {Error} Si no se pueden inicializar correctamente los servicios inyectados
   * 
   * @example
   * ```typescript
   * // El constructor se invoca automáticamente por Angular
   * // No se debe llamar manualmente
   * ```
   * 
   * @since 1.0.0
   */
  constructor(
    public tramiteStore: Tramite260217Store,
    private consultaQuery: ConsultaioQuery,
    private cdr: ChangeDetectorRef,
        private tramite260217Query: Tramite260217Query

  ) {
      this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.cdr.detectChanges();
        })
      )
      .subscribe();
  }
ngOnInit(): void {
        this.tramite260217Query.selectTramiteState$
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
   * @description Método responsable de actualizar el estado del formulario de pago
   * de derechos en el store global del trámite. Este método actúa como callback
   * que recibe los datos actualizados del componente hijo y los propaga al estado
   * global de la aplicación.
   * 
   * @param {PagoDerechosFormState} event - Objeto que contiene el estado actualizado
   * del formulario de pago de derechos, incluyendo todos los campos modificados
   * por el usuario en la interfaz.
   * 
   * @returns {void} Este método no retorna ningún valor, realiza una operación
   * de efectos secundarios actualizando el store.
   * 
   * @throws {Error} Puede lanzar error si el store no está disponible o si
   * los datos proporcionados no son válidos.
   * 
   * @example
   * ```typescript
   * // Llamada desde el template del componente hijo
   * <app-pago-derechos (actualizarPago)="updatePagoDerechos($event)">
   * </app-pago-derechos>
   * ```
   * 
   * @since 1.0.0
   * @access public
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
   * @method ngOnDestroy
   * @description Método del ciclo de vida de Angular que implementa la interfaz OnDestroy.
   * Se ejecuta automáticamente cuando el componente está a punto de ser destruido,
   * permitiendo realizar tareas de limpieza necesarias para prevenir memory leaks
   * y liberar recursos.
   * 
   * Este método se encarga específicamente de:
   * - Emitir una señal de destrucción a través del `destroyNotifier$`
   * - Completar el Subject para liberar todas las suscripciones activas
   * - Garantizar que no queden observables ejecutándose en segundo plano
   * 
   * @returns {void} No retorna ningún valor
   * 
   * @lifecycle Angular OnDestroy
   * @pattern Unsubscribe Pattern
   * @since 1.0.0
   * @access public
   * 
   * @example
   * ```typescript
   * // Este método se ejecuta automáticamente por Angular
   * // cuando el componente es removido del DOM
   * // No debe ser llamado manualmente
   * ```
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
