import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject,map, takeUntil } from 'rxjs';

import { Solicitud230101State, Solicitud230101Store } from '../../estados/tramites/tramites230101.store';
import { Solicitud230101Query } from '../../estados/queries/tramites230101.query';

import { MediodetransporteService } from '../../services/medio-de-transporte.service';

/**
 * Componente para la vista de la paso-uno de la sección de "220402".
 */

@Component({
  selector: 'paso-uno',
  templateUrl: './paso-uno.component.html',
  styles: ``
})
export class PasoUnoComponent implements OnInit,OnDestroy{
  
  /**
   * @property {number} indice - Índice actual del paso.
   */
  indice: number = 1;

  /**
   * @property {boolean} esDatosRespuesta - Indica si los datos de respuesta están disponibles.
   * Inicialmente se establece en false.
   */
  public esDatosRespuesta: boolean = false;

  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();

  /** Estado de la consulta que se obtiene del store. */
  public consultaState!:ConsultaioState;

  constructor(
    public solicitud230101Store: Solicitud230101Store,
    public solicitud230101Query: Solicitud230101Query,
    private mediodetransporteService: MediodetransporteService,
     public consultaQuery: ConsultaioQuery,
  ) {
     
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Suscribe al observable de estado de consulta y actualiza la variable consultaState.
   * Si el estado de consulta tiene la propiedad update, llama a guardarDatosFormulario.
   * De lo contrario, establece esDatosRespuesta en true.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$), map((seccionState) => {
          this.consultaState = seccionState;
      })).subscribe();
    if(this.consultaState.update) {
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }
  }

  /**
   * Método para guardar los datos del formulario.
   * Obtiene los datos de consulta desde el servicio y actualiza el estado del formulario.
   */
  guardarDatosFormulario(): void {
    this.mediodetransporteService
      .getConsultaData().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp: Solicitud230101State) => {
        if(resp){    
        this.esDatosRespuesta = true;
        this.mediodetransporteService.actualizarEstadoFormulario(resp);
        }
      });
  }

  /**
   * @method seleccionaTab
   * @description Selecciona una pestaña específica estableciendo el índice correspondiente.
   * @param {number} i - El índice de la pestaña a seleccionar.
   * @returns {void}
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }
  
   /**
   * @method ngOnDestroy
   * @description Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Utiliza un Subject para notificar la destrucción y completar el observable.
   */
  ngOnDestroy(): void {
     this.destroyNotifier$.next(); 
     this.destroyNotifier$.complete(); 
   }
}
