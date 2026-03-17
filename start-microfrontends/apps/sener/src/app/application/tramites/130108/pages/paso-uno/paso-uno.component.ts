import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { ExportacionMineralesDeHierroService } from '../../services/exportacion-minerales-de-hierro.service';
import { Solocitud130108Service } from '../../services/service130108.service';
/**
 * @description Componente que gestiona el primer paso de un proceso multi-etapa.
 * Este componente controla la visualización y navegación entre pestañas dentro del paso uno.
 * 
 * @usageNotes
 * Para utilizar este componente:
 * ```html
 * <app-paso-uno></app-paso-uno>
 * ```
 * 
 * Este componente típicamente forma parte de un flujo de wizard o un proceso por pasos,
 * representando específicamente el primer paso de dicho flujo.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
})
export class PasoUnoComponent implements OnInit, OnDestroy {
  /**
   * @description Índice que indica la pestaña actualmente seleccionada dentro del componente.
   * Por defecto comienza con la pestaña 1 seleccionada.
   */
  indice: number = 1;

   /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
    public esDatosRespuesta: boolean = false;

   /** Subject para notificar la destrucción del componente. */
    private destroyNotifier$: Subject<void> = new Subject();  

    /**
   * Estado actual de la consulta obtenido desde el store.
   *
   * Esta propiedad almacena el estado completo de la consulta (`ConsultaioState`), 
   * el cual es actualizado mediante la suscripción al observable `selectConsultaioState$`
   * del servicio `ConsultaioQuery`. Se utiliza para determinar si se deben cargar datos
   * adicionales o mostrar información de respuesta en el formulario.
   *
   * @type {ConsultaioState}
   * @memberof PasoUnoComponent
   */
    public consultaState!: ConsultaioState;  


  /**
   * @description Método que actualiza el índice de la pestaña seleccionada cuando el usuario
   * cambia entre las diferentes pestañas disponibles en el componente.
   * 
   * @param i - Número entero que representa el índice de la pestaña seleccionada.
   * 
   * @example
   * // Para seleccionar la segunda pestaña:
   * seleccionaTab(2);
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

    /**
   * Constructor del componente PasoUnoComponent.
   *
   * Inyecta los servicios necesarios para la gestión de permisos de hidrocarburos, 
   * la manipulación de datos del trámite y la consulta del estado desde el store.
   * La inicialización específica se realiza en los métodos del ciclo de vida del componente.
   *
   * @param {ExportacionMineralesDeHierroService} ExportacionPetroliferosServiceSvc Servicio para operaciones de permisos de hidrocarburos.
   * @param {solocitud130108Service} solocitud130108Service Servicio para manipulación de datos del trámite 130121.
   * @param {ConsultaioQuery} consultaQuery Servicio para consultar el estado de la solicitud desde el store.
   * @memberof PasoUnoComponent
   */
    constructor(
      public ExportacionPetroliferosServiceSvc: ExportacionMineralesDeHierroService,
      private solocitud130108Service: Solocitud130108Service,
      private consultaQuery: ConsultaioQuery
    ) { }

     /**
     * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
     *
     * Se suscribe al observable `selectConsultaioState$` del servicio `ConsultaioQuery` para obtener el estado actual de la consulta
     * y actualizar la propiedad `consultaState`. Dependiendo del valor de `update` en el estado, decide si cargar los datos del formulario
     * o mostrar la información de respuesta.
     *
     * @memberof PasoUnoComponent
     */
      ngOnInit(): void {
        this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$), map((seccionState) => {
          this.consultaState = seccionState;
        })).subscribe();
        if (this.consultaState.update) {
          this.guardarDatosFormulario();
        } else {
          this.esDatosRespuesta = true;
        }
      }

      /**
       * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
       * Luego reinicializa el formulario con los valores actualizados desde el store.
       */
      guardarDatosFormulario(): void {
        this.solocitud130108Service
          .getRegistroTomaMuestrasMercanciasData().pipe(
            takeUntil(this.destroyNotifier$)
          )
          .subscribe((resp) => {
            if (resp) {
              this.esDatosRespuesta = true;
              this.solocitud130108Service.actualizarEstadoFormulario(resp);
            }
          });
      }

      /**
       * @description
       * Método del ciclo de vida de Angular que se ejecuta cuando el componente es destruido.
       * Se utiliza para liberar recursos y evitar fugas de memoria, completando el Subject destroyNotifier$.
       * Esto asegura que todas las suscripciones que dependen de este Subject se cancelen correctamente.
       */
      ngOnDestroy(): void {
        this.destroyNotifier$.next();
        this.destroyNotifier$.complete();
      }
}