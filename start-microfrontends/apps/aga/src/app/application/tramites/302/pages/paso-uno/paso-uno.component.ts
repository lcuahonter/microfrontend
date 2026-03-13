import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { Solicitud302Service } from '../../services/service302.service';


/**
 * Componente PasoUnoComponent.
 * Este componente representa el primer paso de un trámite.
 * Permite seleccionar un subtítulo mediante pestañas.
 */
@Component({
  selector: 'paso-uno',
  templateUrl: './paso-uno.component.html',
  styles: ``
})
export class PasoUnoComponent implements OnInit, OnDestroy {
  /**
   * Variable que almacena el índice del subtítulo seleccionado.
   * Por defecto, el índice inicial es 1.
   */
  public indice: number = 1;

   /**
   * Estado actual de la consulta para el componente.
   * 
   * @type {ConsultaioState}
   * @public
   */
  public consultaState!:ConsultaioState;

  /**
   * Notificador utilizado para gestionar la destrucción de suscripciones en el componente.
   * 
   * Este Subject emite un valor cuando el componente se destruye, permitiendo cancelar
   * suscripciones a observables y evitar fugas de memoria.
   * 
   * @private
   */
  private destroyNotifier$: Subject<void> = new Subject();


  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;


   /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  public esFormularioSoloLectura: boolean = false; 


/**
 * Constructor de la clase DatosComponent.
 * 
 * @param consultaQuery Servicio para realizar consultas relacionadas con el trámite.
 * @param productoresService Servicio para la expansión y gestión de productores.
 * @param tramiteStore Almacén específico para el manejo del estado del trámite 120204.
 * 
 * Al inicializar el componente, se establece la consulta inicial en el store de consultas
 * con los parámetros correspondientes al trámite 120204.
 */
  constructor(private consultaQuery: ConsultaioQuery,private solicitudService: Solicitud302Service) {
    // Inicializa el estado de la consulta
  }

   /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * 
   * - Suscribe al observable `selectConsultaioState$` para obtener el estado de la consulta y actualizar la propiedad `consultaState`.
   * - Dependiendo del valor de `consultaState.update`, decide si guardar los datos del formulario o mostrar los datos de respuesta.
   * 
   * @returns {void}
   */
   ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$),map((seccionState) => {
          this.consultaState = seccionState;
          this.esFormularioSoloLectura = seccionState.readonly;
          if(this.consultaState.update) {
            this.guardarDatosFormulario();
            } else {
            this.esDatosRespuesta = true;
            }

      })).subscribe();
    
  }

  /**
   * Guarda los datos del formulario obteniendo la información de los productores.
   * 
   * Este método realiza una solicitud al servicio `productoresService` para obtener
   * los datos de expansión de productores. Si la respuesta es válida, actualiza
   * el estado interno del componente y almacena los datos relevantes en el store
   * de trámites.
   * 
   * @remarks
   * Utiliza el operador `takeUntil` para cancelar la suscripción cuando el componente
   * se destruye, evitando fugas de memoria.
   * 
   * @returns {void} No retorna ningún valor.
   */
  guardarDatosFormulario(): void {
    this.solicitudService
      .getCertiRegistroDatos().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if(resp){
        this.esDatosRespuesta = true;
        this.solicitudService.actualizarEstadoFormulario(resp);
        }
      });
  }

  /**
   * Método para establecer el índice del subtítulo seleccionado.
   * @param i - Índice del subtítulo que se desea seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

   /**
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente es destruido.
   * Emite una notificación y completa el observable `destroyNotifier$` para limpiar suscripciones y evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
