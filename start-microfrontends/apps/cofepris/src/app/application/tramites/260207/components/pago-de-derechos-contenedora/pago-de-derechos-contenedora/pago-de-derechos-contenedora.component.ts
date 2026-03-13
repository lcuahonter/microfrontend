import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ID_PROCEDIMIENTO } from '../../../constants/tratamientos-especiales.enum';
import { PagoDeDerechosComponent } from '../../../../../shared/components/pago-de-derechos/pago-de-derechos.component';
import { PagoDerechosFormState } from '../../../../../shared/models/terceros-relacionados.model';
import { Tramite260207Query } from '../../../estados/tramite260207Query.query';
import { Tramite260207Store } from '../../../estados/tramite260207Store.store';

/**
 * @component PagoDeDerechosContenedoraComponent
 * @description Componente contenedor que utiliza el componente `PagoDeDerechosComponent`
 * para gestionar la funcionalidad relacionada con el pago de derechos.
 * Este componente interactúa con el estado del trámite a través del store `Tramite260207Store`.
 */
@Component({
  selector: 'app-pago-de-derechos-contenedora',
  standalone: true,
  imports: [CommonModule, PagoDeDerechosComponent],
  templateUrl: './pago-de-derechos-contenedora.component.html',
  styleUrl: './pago-de-derechos-contenedora.component.scss',
})
export class PagoDeDerechosContenedoraComponent implements OnDestroy, OnInit{
  /**
   * @property {PagoDeDerechosComponent} pagoDeDerechosComponent
   * @description
   * Referencia al componente hijo `PagoDeDerechosComponent` obtenida
   * mediante el decorador `@ViewChild`.
   */
  @ViewChild(PagoDeDerechosComponent)
  pagoDeDerechosComponent!: PagoDeDerechosComponent;

  /**
   * @property {PagoDerechosFormState} pagoDerechos
   * @description Estado actual del formulario de pago de derechos, obtenido del store del trámite.
   */

  public pagoDerechos: PagoDerechosFormState;
      
    
  /**
   * @constructor
   * @description Constructor que inyecta el store `Tramite260207Store` para gestionar el estado del trámite.
   * Inicializa la propiedad `pagoDerechos` con el valor actual del store.
   *
   * @param tramiteStore - Store que administra el estado del trámite 260207.
   */

  /**
   * @property {string} idProcedimiento
   * @description
   * Identificador del procedimiento.
   */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  public esFormularioSoloLectura: boolean = false; 

  /**
   * Notificador utilizado para manejar la destrucción o desuscripción de observables.
   * Se usa comúnmente para limpiar suscripciones cuando el componente es destruido.
   * @property {Subject<void>} destroyNotifier$
   */
   private destroyNotifier$: Subject<void> = new Subject();

   /**
   * @constructor
   * @description Constructor que inyecta el store `Tramite260207Store` para gestionar el estado del trámite.
   * Inicializa la propiedad `pagoDerechos` con el valor actual del store.
   * @param tramiteStore - Store que administra el estado del trámite 260207.
   * @param consultaQuery - Query que proporciona el estado de la consulta actual.
   */
  constructor(
    public tramiteStore: Tramite260207Store, 
    public consultaQuery: ConsultaioQuery,
    private tramiteQuery:Tramite260207Query,
  ) {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();
    this.pagoDerechos = this.tramiteStore.getValue().pagoDerechos;
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
   * @description Actualiza los datos del formulario de pago de derechos en el store del trámite.
   *
   * @param {PagoDerechosFormState} event - Estado actualizado del formulario de pago de derechos.
   * @returns {void} Este método no retorna ningún valor.
   */
  updatePagoDerechos(event: PagoDerechosFormState): void {
    this.tramiteStore.updatePagoDerechos(event);
  }

  /**
   * @method validarContenedor
   * @description
   * Valida el contenedor delegando la validación al componente hijo.
   * @returns {boolean} True si la validación es exitosa, false en caso contrario.
   */
  validarContenedor(): boolean {
    return (
      this.pagoDeDerechosComponent?.formularioSolicitudValidacion() ?? false
    );
  }
/**
 * Verifica si al menos uno de los campos ha sido llenado, pero no todos.
 *
 * @returns {boolean} `true` si al menos un campo está lleno pero no todos; de lo contrario, `false`.
 */
 isAnyFieldFilledButNotAll(): boolean {
    return this.pagoDeDerechosComponent.isAnyFieldFilledButNotAll();
  }
    /**
     * @description
     * Devuelve el estado del botón "Continuar" del componente `pagoDeDerechosComponent`.
     * Si el componente no está definido, retorna `false` por defecto.
     * 
     * @returns {boolean} `true` si el botón "Continuar" ha sido presionado, de lo contrario `false`.
     */
    get continuarButtonClicked(): boolean {
  return this.pagoDeDerechosComponent?.continuarButtonClicked ?? false;
}
    /**
   * @method ngOnDestroy
   * @description Método del ciclo de vida de Angular que se ejecuta cuando el componente es destruido.
   * Se utiliza para limpiar las suscripciones activas y evitar fugas de memoria.
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}