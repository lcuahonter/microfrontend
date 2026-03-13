import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { ID_PROCEDIMIENTO } from '../../constantes/exportacion-armas-explosivo.enum';
import { PermisoOrdinarioExportacionExplosivoService } from '../../services/permiso-ordinario-exportacion-explosivo.service';
import { Tramite240121Query } from '../../estados/tramite240121Query.query';
import { Tramite240121Store } from '../../estados/tramite240121Store.store';

/**
 * @component PasoUnoComponent
 * @description
 * Componente encargado de mostrar y gestionar la información correspondiente al paso uno del flujo del trámite
 * de exportación de explosivos. Administra el estado del formulario, controla las pestañas activas y
 * sincroniza los datos con el store y servicios relacionados.
 */
@Component({
  selector: 'paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
})
export class PasoUnoComponent implements OnInit, OnDestroy {
  /**
   * @property indice
   * @description Indicates the index of the selected tab within the form step.
   * @type {number | undefined}
   */
  @Input() indice: number = 1;

  /**
   * @property subIndice
   * @description Indicates the index of the selected tab within the form step.
   * @type {number | undefined}
   */
  public subIndice: number = 1;

  /**
   * Observable de notificación para cancelar suscripciones activas al destruir el componente.
   * @private
   * @type {Subject<void>}
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado de la sección de consulta proveniente del store global.
   * @type {ConsultaioState}
   */
  public consultaState!: ConsultaioState;

  /**
   * Indica si los datos del formulario han sido obtenidos exitosamente y pueden mostrarse.
   * @type {boolean}
   */
  public esDatosRespuesta: boolean = false;

  /**
   * Constructor que inyecta dependencias necesarias para la gestión de estado, consulta y servicios de negocio.
   *
   * @param tramite240121Query Query para acceder al estado del trámite.
   * @param tramite240121Store Store para modificar el estado del trámite.
   * @param consultaQuery Query para acceder al estado de la sección de consulta.
   * @param permisoOrdinarioExportacionExplosivoService Servicio para manejar la lógica de permisos de exportación de explosivos.
   */
  constructor(
    private tramite240121Query: Tramite240121Query,
    private tramite240121Store: Tramite240121Store,
    public consultaQuery: ConsultaioQuery,
    public permisoOrdinarioExportacionExplosivoService: PermisoOrdinarioExportacionExplosivoService
  ) { }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Se suscribe a los observables del store para obtener el índice de pestaña seleccionado
   * y los datos de consulta. Si se requiere actualización, invoca la carga de datos del formulario.
   */
  ngOnInit(): void {
    this.tramite240121Query.getTabSeleccionado$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((tab) => {
        this.indice = tab ?? 1;
      });

    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
        })
      )
      .subscribe();

    if (
      this.consultaState &&
      this.consultaState.procedureId === ID_PROCEDIMIENTO.toString() &&
      this.consultaState.update
    ) {
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }
  }

  /**
   * Carga datos desde el backend a través del servicio y actualiza el store con la respuesta.
   * Marca el estado como listo para mostrar.
   *
   * @method guardarDatosFormulario
   */
  guardarDatosFormulario(): void {
    this.permisoOrdinarioExportacionExplosivoService
      .obtenerRegistroTomarMuestrasDatos()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.permisoOrdinarioExportacionExplosivoService.actualizarEstadoFormulario(resp);
        }
      });
  }

  /**
   * Actualiza el índice de la pestaña seleccionada en el store.
   *
   * @param i Índice de la pestaña seleccionada.
   */
  public seleccionaTab(i: number): void {
    this.tramite240121Store.updateTabSeleccionado(i);
  }

  /**
   * Método del ciclo de vida que se ejecuta justo antes de que el componente sea destruido.
   * Cancela las suscripciones activas para prevenir fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
