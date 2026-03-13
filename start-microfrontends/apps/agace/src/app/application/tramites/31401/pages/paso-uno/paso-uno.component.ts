
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { CancelacionGarantiaService } from '../../services/cancelacion-garantia/cancelacion-garantia.service';
/**
  * @Component
  * @selector paso-uno
  * @description
  * Componente `PasoUnoComponent` que representa el primer paso del flujo de pantallas del trámite.
  * 
  * Detalles:
  * - Utiliza el decorador `@Component` para definir las propiedades del componente.
  * - Renderiza la plantilla HTML asociada para mostrar el contenido del primer paso del trámite.
  * 
  * Propiedades:
  * - `selector`: Define el nombre del selector del componente como `paso-uno`.
  * - `templateUrl`: Ruta al archivo de plantilla HTML del componente.
  * 
  * @example
  * <paso-uno></paso-uno>
  */
@Component({
  selector: 'paso-uno',
  templateUrl: './paso-uno.component.html',
})
export class PasoUnoComponent implements OnInit, OnDestroy {

  /**
  * @property consultaState
  * @description
  * Estado actual de la consulta gestionado por el store `ConsultaioQuery`.
  */
  public consultaState!: ConsultaioState;

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();
  
  /**
   * compo doc
   * Índice del subtítulo seleccionado.
   * Se utiliza para determinar qué sección de datos se muestra.
   * Inicialmente, el valor es 1.
   */
  public indice: number = 1;

  /**
     * @constructor
     * @description
     * Este constructor inicializa el componente `DatosDeLaSolicitudComponent` e inyecta los servicios necesarios
     * para gestionar los datos y validaciones del formulario.
     *
     * Servicios inyectados:
     * - `CancelacionGarantiaService`: Servicio utilizado para obtener datos relacionados con monedas y fracciones arancelarias.
     *
     * @param {CancelacionGarantiaService} cancelacionGarantiaService - Servicio para gestionar datos de exportación.
     */
    constructor(
      public cancelacionGarantiaService: CancelacionGarantiaService,
      private consultaQuery: ConsultaioQuery
        ) {
      //
    }

   /**
   * @method ngOnInit
   * @description
   * Método de inicialización del componente `DatosComponent`.
   * 
   * Detalles:
   * - Se suscribe al observable `selectConsultaioState$` del store `ConsultaioQuery` para obtener el estado actual de la consulta.
   * - Utiliza `takeUntil` para cancelar la suscripción cuando el componente se destruye, evitando fugas de memoria.
   * - Actualiza la propiedad `consultaState` con el estado recibido.
   * - Si la propiedad `update` del estado es verdadera, llama al método `guardarDatosFormulario()`.
   * - Si no, establece la bandera `esDatosRespuesta` en `true` para indicar que se deben mostrar los datos de respuesta.
   * 
   * @example
   * this.ngOnInit();
   * // Inicializa el componente y gestiona el flujo de datos según el estado de la consulta.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
        .pipe(
          takeUntil(this.destroyNotifier$),
          map((seccionState) => {
            this.consultaState = seccionState;
            if(this.consultaState?.update) {
              this.guardarDatosFormulario();
            } else {
              this.esDatosRespuesta = true;
            }
          })
        ).subscribe();
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.cancelacionGarantiaService
      .getCancelacionGarantiaData().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          Object.entries(resp).forEach(([key, value]) => {
            this.cancelacionGarantiaService.actualizarEstadoFormulario(key, value);
          });
        }
      });
  }

  /**
   * compo doc
   * Método para cambiar el índice del subtítulo seleccionado.
   *
   * @param i - Índice del nuevo subtítulo seleccionado.
   * @returns {void}
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * @method ngOnDestroy
   * @description
   * Método del ciclo de vida de Angular que se llama justo antes de que el componente sea destruido.
   * 
   * Detalles:
   * - Emite un valor a través del observable `destroyNotifier$` para notificar a los suscriptores que el componente está siendo destruido.
   * - Completa el observable para liberar recursos y evitar fugas de memoria.
   * 
   * @returns {void} No retorna ningún valor.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
