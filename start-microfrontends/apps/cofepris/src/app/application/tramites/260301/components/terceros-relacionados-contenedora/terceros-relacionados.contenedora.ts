import { ChangeDetectorRef, Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Subject, map, takeUntil } from 'rxjs';

import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { TercerosRelacionadosComponent } from '../../../../shared/components/2603/terceros-relacionados/terceros-relacionados.component';
import { Tramite260301Query } from '../../estados/queries/tramite260301.query';
import { Tramite260301Store } from '../../estados/stores/tramites260301.store';

/**
 * TercerosRelacionadosContenedoraComponent es responsable de manejar el primer paso del proceso.
 * para actualizar el componente actual que se está mostrando.
 */
@Component({
  selector: 'app-terceros-relacionados-contenedora',
  standalone: true,
  imports: [CommonModule, TercerosRelacionadosComponent],
  providers: [Tramite260301Store, Tramite260301Query],
  templateUrl: './terceros-relacionados.contenedora.html',
  styleUrls: ['./terceros-relacionados.contenedora.scss'],
})
export class TercerosRelacionadosContenedoraComponent implements OnDestroy {
      @ViewChild('TercerosRelacionadosComponent', { static: false }) tercerosRelacionadosComponent!: TercerosRelacionadosComponent;
      /**
 * Indica si el formulario es de solo lectura.
 */
public idProcedimiento = 260301;
      /**
   * @property
   * @name permisoDefinitivoTitulo
   * @type {number}
   * @description Identificador único del procedimiento actual. Este valor se utiliza para asociar el componente con un trámite específico en el sistema.
   */
  permisoDefinitivoTitulo: number[] = [260301];
    /** Indica si el botón continuar ha sido activado para ejecutar las validaciones del formulario. */
  @Input() isContinuarTriggered: boolean = false;
  
  public procedureID: number = 260301;

  /**
   * @property
   * @name permisoSeccion
   * @type {number[]}
   * @description Identificador de la sección de permisos específica para este procedimiento.
   */
  permisoSeccion: number[] = [260301];
  
  /**
   * @property destroyNotifier$
   * @description Subject utilizado para cancelar observables de manera ordenada
   * cuando el componente se destruye, evitando fugas de memoria.
   * @private
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property consultaState
   * @description
   * Estado actual de la consulta gestionado por el store `ConsultaioQuery`.
   */
  @Input() public consultaState!: ConsultaioState;

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
  /** Maneja el evento de validez de tabla y actualiza el estado correspondiente en el store. */
  onTableValidEvent(event: string): void {
    if (event === 'fabricante') {
      this.store.setFormValidity('fabricanteTablaValid', true);
    }
       if (event === 'formulador') {
      this.store.setFormValidity('formuladorTablaValid', true);
    }
    if (event === 'proveedor') {
      this.store.setFormValidity('proveedorTablaValid', true);
    }
    if (event === 'otros') {
      this.store.setFormValidity('isotrosvalid', true);
    }
  
    this.validarFormulario();
  }
 /** Ejecuta la validación marcando los campos de terceros relacionados como tocados. */
  validarFormulario(): void {
    this.tercerosRelacionadosComponent.markTouched();
  }
  /**
   * Crea una instancia de TercerosRelacionadosContenedoraComponent.
   *
   * Inicializa la suscripción al estado de consulta mediante el store `ConsultaioQuery`.
   * Actualiza la bandera `esFormularioSoloLectura` y el estado `consultaState` cada vez que cambia el estado de consulta.
   *
   * @param consultaQuery Servicio para consultar el estado global de la consulta.
   * @param tramite260301Query Servicio para consultar el estado específico del trámite 260301.
   * @param tramite260301Store Store para gestionar el estado del trámite 260301.
   * @param cdr Servicio de Angular para detectar y aplicar cambios en el ciclo de vida del componente.
   *
   * La suscripción se cancela automáticamente al destruir el componente para evitar fugas de memoria.
   */
  constructor(
    private consultaQuery: ConsultaioQuery,
    private tramite260301Query: Tramite260301Query,    
    private cdr: ChangeDetectorRef,
    private store: Tramite260301Store,
  ) {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.consultaState = seccionState;
          this.cdr.detectChanges();
        })
      )
      .subscribe();
  }

  validarContenedor(): boolean {
    return (
      this.tercerosRelacionadosComponent?.formularioSolicitudValidacion() ?? false
    );
  }

    /**
   * Método del ciclo de vida de Angular que se llama justo antes de que el componente sea destruido.
   */
    ngOnDestroy(): void {
      this.destroyNotifier$.next();
      this.destroyNotifier$.complete();
    }
}
