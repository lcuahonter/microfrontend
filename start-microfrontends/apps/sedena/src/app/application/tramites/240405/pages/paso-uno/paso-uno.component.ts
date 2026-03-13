import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState} from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { PermisoOrdinarioImportacionSustanciasQuimicasService } from '../../services/permiso-ordinario-importacion-sustancias-quimicas.service';
import { Tramite240405Query } from '../../estados/tramite240405Query.query';
import { Tramite240405Store } from '../../estados/tramite240405Store.store';


/**
 * @title Paso Uno
 * @description Componente que representa el primer paso del flujo de solicitud. Contiene los datos del solicitante, datos del trámite, terceros relacionados y pago de derechos.
 * @summary Agrupa los subcomponentes necesarios para capturar la información inicial del trámite.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
})
export class PasoUnoComponent implements OnDestroy, OnInit {
   /**
   * Índice utilizado para identificar la posición actual en un proceso o lista.
   * @type {number}
   */
   public indice: number | undefined = 1;
 /**
   * @property destroyNotifier$
   * @description Observable notifier to unsubscribe active subscriptions when the component is destroyed.
   * Helps prevent memory leaks.
   * @type {Subject<void>}
   */
  private destroyNotifier$: Subject<void> = new Subject();

   /**
   * Esta variable se utiliza para almacenar el índice del subtítulo.
   */
  public consultaState!: ConsultaioState;

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;


  /**
   * Initializes the component with required query and store for state management.
   *
   * @param Tramite240405Query Query to access procedure state.
   * @param tramite240405Store Store to update procedure state.
   */
    constructor(
    private tramite240405Query: Tramite240405Query,
    private tramite240405Store: Tramite240405Store,
    private consultaQuery: ConsultaioQuery,
    private permisoOrdinarioImportacionService: PermisoOrdinarioImportacionSustanciasQuimicasService
  ) {
     this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$), map((seccionState) => {
      this.consultaState = seccionState;
    })).subscribe();
  }
    /**
   * Angular lifecycle method that runs on component initialization.
   * Subscribes to the selected tab from state and updates `indice`.
   *
   * @returns {void}
   */
  ngOnInit(): void {
    this.tramite240405Query.getTabSeleccionado$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((tab) => {
        this.indice = tab;
      });
    if (this.consultaState.update) {
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }
  }

    /**
   * Guarda los datos del formulario obtenidos del servicio.
   */
  guardarDatosFormulario(): void {
    this.permisoOrdinarioImportacionService
      .obtenerRegistroTomarMuestrasDatos().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if(resp) {
          this.esDatosRespuesta = true;
          this.permisoOrdinarioImportacionService.actualizarEstadoFormulario(resp);
        }
      });
  }
    /**
   * Updates the selected tab index in the store.
   *
   * @param i Index of the selected tab.
   * @returns {void}
   */
  public seleccionaTab(i: number): void {
    this.tramite240405Store.updateTabSeleccionado(i);
  }

  /**
   * Angular lifecycle method that runs just before the component is destroyed.
   * Emits and completes the `destroyNotifier$` to unsubscribe observables.
   *
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
