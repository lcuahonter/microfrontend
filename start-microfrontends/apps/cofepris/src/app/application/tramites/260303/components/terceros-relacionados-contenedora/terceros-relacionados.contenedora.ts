import { ChangeDetectorRef, Component, Input, OnDestroy, ViewChild} from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TercerosRelacionadosComponent } from '../../../../shared/components/2603/terceros-relacionados/terceros-relacionados.component';
import { Tramite260303Query } from '../../Estados/tramite260303.query';
import { Tramite260303Store } from '../../Estados/tramite260303.store';

/**
 * TercerosRelacionadosContenedoraComponent es responsable de manejar el primer paso del proceso.
 * para actualizar el componente actual que se está mostrando.
 */
@Component({
  selector: 'app-terceros-relacionados-contenedora',
  standalone: true,
  imports: [CommonModule, TercerosRelacionadosComponent],
  providers: [Tramite260303Store],
  templateUrl: './terceros-relacionados.contenedora.html',
  styleUrls: ['./terceros-relacionados.contenedora.scss'],
})
export class TercerosRelacionadosContenedoraComponent implements OnDestroy {
  
  /** Identificadores de permisos para el título definitivo. */
  permisoDefinitivoTitulo: number[] = [260303];

  /** Indica si el botón continuar ha sido activado para ejecutar las validaciones del formulario. */
  @Input() isContinuarTriggered: boolean = false;

  /** Identificador del procedimiento actual. */
  public procedureID: number = 260303;

  /** Identificador del procedimiento actual. */
  idProcedimiento: number = 260303;

  /** Identificadores de permisos para la sección. */
  permisoSeccion: number[] = [260303];

  /** Subject para notificar la destrucción del componente y cancelar suscripciones. */
  private destroyNotifier$: Subject<void> = new Subject();

  /** Estado actual de la consulta. */
  consultaState!: ConsultaioState;

  /** Indica si el formulario está en modo solo lectura. */
  public esFormularioSoloLectura: boolean = false;

  /** Referencia al componente TercerosRelacionadosComponent hijo. */
  @ViewChild('TercerosRelacionadosComponent', { static: false })
  tercerosRelacionadosComponent!: TercerosRelacionadosComponent;

  /**
   * Crea una instancia de TercerosRelacionadosContenedoraComponent.
   *
   * Inicializa la suscripción al estado de consulta mediante el store `ConsultaioQuery`.
   * Actualiza la bandera `esFormularioSoloLectura` y el estado `consultaState` cada vez que cambia el estado de consulta.
   *
   * @param consultaQuery Servicio para consultar el estado global de la consulta.
   * @param tramite260303Query Servicio para consultar el estado específico del trámite 260303.
   * @param tramite260303Store Store para gestionar el estado del trámite 260303.
   * @param cdr Servicio de Angular para detectar y aplicar cambios en el ciclo de vida del componente.
   *
   * La suscripción se cancela automáticamente al destruir el componente para evitar fugas de memoria.
   */
  constructor(
    private consultaQuery: ConsultaioQuery,
    private tramite260303Query: Tramite260303Query,
    private tramite260303Store: Tramite260303Store,
    private cdr: ChangeDetectorRef
  ) {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.consultaState = seccionState;
        })
      )
      .subscribe();
  }

  /** Maneja el evento de validez de tabla y actualiza el estado correspondiente en el store. */
  onTableValidEvent(event: string): void {
    if (event === 'fabricante') {
      this.tramite260303Store.setFormValidity('fabricanteTablaValid', true);
    }
    if (event === 'formulador') {
      this.tramite260303Store.setFormValidity('formuladorTablaValid', true);
    }
    if (event === 'proveedor') {
      this.tramite260303Store.setFormValidity('proveedorTablaValid', true);
    }
    if (event === 'otros') {
      this.tramite260303Store.setFormValidity('isotrosvalid', true);
    }

    this.validarFormulario();
  }

  /** Ejecuta la validación marcando los campos de terceros relacionados como tocados. */
  validarFormulario(): void {
    this.tercerosRelacionadosComponent.markTouched();
  }
validarContenedor(): boolean {
    
    return true;
}
  /**
   * Método del ciclo de vida de Angular que se llama justo antes de que el componente sea destruido.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
