import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, takeUntil } from 'rxjs';
import { FloraFaunaService } from '../../services/flora-fauna.service';
/**
 * Componente que maneja los datos del trámite 250101.
 */
@Component({
  selector: 'app-datos-250101',
  templateUrl: './datos-250101.component.html',
})
export class Datos250101Component implements OnInit, OnDestroy {

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();

    /** Propiedad que almacena el estado actual de la consulta IO.  
 * Se inicializa posteriormente con datos del store o de un observable. */
  private consultaState!:ConsultaioState;

  /**
   * Índice actual del tab seleccionado.
   */
  public indice:number = 1;

  /**
   * Cambia el índice del tab seleccionado.
   * @param i Número del tab a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /** Inyecta servicios para gestión de solicitudes y consultas.  
 * La inicialización se delega a métodos específicos del componente. */
  constructor(
    private consultaQuery: ConsultaioQuery,
    private floraFaunaService: FloraFaunaService
  )
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
  guardarDatosFormulario(): void {
    this.floraFaunaService
      .getRegistroTomaMuestrasMercanciasData().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if(resp){
        this.esDatosRespuesta = true;
        this.floraFaunaService.actualizarEstadoFormulario(resp);
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
