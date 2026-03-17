import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, takeUntil } from 'rxjs';
import { DatosDelTramiteService } from '../../services/datos-del-tramite.service';
/**
 * # Documentación - PasoUnoComponent
 *
 * ## Descripción del componente
 * `PasoUnoComponent` es un componente de Angular diseñado para gestionar la lógica de selección de pestañas en la aplicación.
 *
 * ### Selector
 * - **Selector del componente**: `app-paso-uno`
 * - **standalone**: `false`
 * - **templateUrl**: `./paso-uno.component.html`
 */
@Component({
  selector: 'app-paso-uno',
  standalone: false,
  templateUrl: './paso-uno.component.html',
})
export class PasoUnoComponent implements OnInit, OnDestroy {
  
 /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();

  /** Propiedad que almacena el estado actual de la consulta IO.  
 * Se inicializa posteriormente con datos del store o de un observable. */
   public consultaState!:ConsultaioState;

  /**
   * ## Propiedad: indice
   * Define el índice actualmente seleccionado. Se inicializa con el valor `1`.
   */
  public indice:number = 1;

  /**
   * ## Método: seleccionaTab
   * Este método actualiza el índice en función del número proporcionado como argumento.
   *
   * #### Parámetros
   * - **i**: Número que representa el índice de la pestaña seleccionada.
   *
   * #### Implementación
   * ```typescript
   * seleccionaTab(i: number): void {
   *   this.indice = i;
   * }
   * ```
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }
  
/**
 * Constructor del componente.
 * Inyecta los servicios necesarios para obtener datos del trámite y realizar consultas.
 */
  constructor(private datosDelTramiteService: DatosDelTramiteService,private consultaQuery: ConsultaioQuery) 
  {
  // Constructor vacío: La inicialización se realizará en métodos específicos según sea necesario.
  }

  /**
 * Inicializa la suscripción al estado de la consulta y actualiza el formulario
 * según el valor de `update`. Utiliza `takeUntil` para gestionar la cancelación
 * de la suscripción al destruir el componente.
 */
    ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$))
        .subscribe((seccionState) => {
          this.consultaState = seccionState;
          if (this.consultaState.update) {
             this.guardarDatosFormulario();
             } else {
              this.esDatosRespuesta = true;
            }
        })
  }

  
    /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  private guardarDatosFormulario(): void {
    this.datosDelTramiteService
      .getRegistroTomaMuestrasMercanciasData().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if(resp){
        this.esDatosRespuesta = true;
        this.datosDelTramiteService.actualizarEstadoFormulario(resp);
        }
      });
  }

    /**
   * Método del ciclo de vida de Angular que se ejecuta justo antes de destruir el componente.
   * 
   * Este método se utiliza para limpiar recursos, específicamente para completar
   * el `Subject` `destroyNotifier$`, el cual es usado en combinación con el operador `takeUntil`
   * para cancelar automáticamente las suscripciones a observables y evitar fugas de memoria.
   * 
   */
    ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
