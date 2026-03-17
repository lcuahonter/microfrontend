import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { AvisoImportacionSustanciasQuimicasService } from '../../services/aviso-importacion-sustancias-quimicas.service';
import { Tramite240106Query } from '../../estados/tramite240106Query.query';
import { Tramite240106Store } from '../../estados/tramite240106Store.store';

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
   * @property indice
   * @description Indica el índice de la pestaña seleccionada dentro del paso del formulario.
   * @type {number | undefined}
   */
  public indice: number | undefined = 1;

  /**
   * Variable utilizada para almacenar el estado de la consulta del usuario.
   */
  public consultaState!: ConsultaioState;

  /** Indica si los datos de respuesta del servidor se han utilizado para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;
 
  /**
   * Emite una notificación para señalar la destrucción del componente.
   * Se utiliza para cancelar la suscripción a los observables y prevenir fugas de memoria.
   * Debe activarse en el ciclo de vida `ngOnDestroy` del componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Inicializa el componente con las dependencias necesarias para la gestión de estado.
   *
   * @param tramite240106Query Consulta el estado del trámite.
   * @param tramite240106Store Permite actualizar el estado del trámite.
   * @param consultaQuery Consulta el estado de usuario.
   * @param AvisoImportacionSustanciasQuimicasService Servicio para obtener y actualizar datos.
   */
  constructor(
    private tramite240106Query: Tramite240106Query,
    private tramite240106Store: Tramite240106Store,
    public consultaQuery: ConsultaioQuery,
    public AvisoImportacionSustanciasQuimicasService: AvisoImportacionSustanciasQuimicasService

  ) { }

  /**
   * Método del ciclo de vida de Angular que se ejecuta en la inicialización del componente.
   * Se suscribe al estado de la pestaña seleccionada y actualiza `indice`.
   *
   * @returns {void}
   */
  ngOnInit(): void {
    this.tramite240106Query.getTabSeleccionado$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((tab) => {
        this.indice = tab;
      });
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
          if (this.consultaState.update) {
            this.guardarDatosFormulario();
          } else {
            this.esDatosRespuesta = true;
          }
        })
      )
      .subscribe();
  }

  /**
* Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
* Luego reinicializa el formulario con los valores actualizados desde el store.
*/
  guardarDatosFormulario(): void {
    this.AvisoImportacionSustanciasQuimicasService
      .obtenerRegistroTomarMuestrasDatos().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.AvisoImportacionSustanciasQuimicasService.actualizarEstadoFormulario(resp);
        }
      });
  }

  /**
   * Actualiza el índice de la pestaña seleccionada en el store.
   *
   * @param i Índice de la pestaña seleccionada.
   * @returns {void}
   */
  public seleccionaTab(i: number): void {
    this.tramite240106Store.updateTabSeleccionado(i);
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta justo antes de que el componente sea destruido.
   * Emite y completa el `destroyNotifier$` para cancelar las suscripciones a los observables.
   *
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
