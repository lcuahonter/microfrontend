import { Component, Input, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { PermisoOrdinarioImportacionSubstanciasQuimicasService } from '../../services/permiso-ordinario-importacion-substancias-quimicas.service';
import { Tramite240305Query } from '../../estados/tramite240305Query.query';
import { Tramite240305Store } from '../../estados/tramite240305Store.store';

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
export class PasoUnoComponent implements OnInit {
  /**
   * @property indice
   * @description Indicates the index of the selected tab within the form step.
   * @type {number | undefined}
   */
  @Input() indice: number = 1;

  /**
   * @property destroyNotifier$
   * @description Observable notifier to unsubscribe active subscriptions when the component is destroyed.
   * Helps prevent memory leaks.
   * @type {Subject<void>}
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Selecciona una pestaña específica.
   * @param i - El índice de la pestaña a seleccionar.
   */
  /**
* Esta variable se utiliza para almacenar el índice del subtítulo.
*/
  public consultaState!: ConsultaioState;

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /**
 * Initializes the component with required query and store for state management.
 *
 * @param Tramite240305Query Query to access procedure state.
 * @param tramite240305Store Store to update procedure state.
 */
  constructor(
    private tramite240305Query: Tramite240305Query,
    private tramite240305Store: Tramite240305Store,
    private consultaQuery: ConsultaioQuery,
    private permisoOrdinarioImportacionSubstanciasQuimicasService: PermisoOrdinarioImportacionSubstanciasQuimicasService
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
    this.tramite240305Query.getTabSeleccionado$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((tab) => {
        this.indice = tab ?? 1;
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
    this.permisoOrdinarioImportacionSubstanciasQuimicasService
      .obtenerRegistroTomarMuestrasDatos().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.permisoOrdinarioImportacionSubstanciasQuimicasService.actualizarEstadoFormulario(resp);
        }
      });
  }

  /**
 * Actualiza la pestaña seleccionada en el estado del trámite.
 *
 * @param i Índice de la pestaña a seleccionar.
 */
  seleccionaTab(i: number): void {
    this.tramite240305Store.updateTabSeleccionado(i);
  }
}
