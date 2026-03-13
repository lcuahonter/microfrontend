import { Component, type OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertComponent } from '@libs/shared/data-access-user/src/tramites/components/alert/alert.component';
import { TituloComponent } from '@libs/shared/data-access-user/src/tramites/components/titulo/titulo.component';

import { map, takeUntil } from 'rxjs/operators';
import { ProcesoSolicitado } from '../../models/response/validar-fraccion-response.model';
import { Solicitante110101Query } from '../../estados/queries/solicitante110101.query';

import { Solicitante110101State, Tramite110101Store } from '../../estados/tramites/solicitante110101.store';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-procesos',
  standalone: true,
  imports: [
    TituloComponent,
    AlertComponent,
    CommonModule
  ],
  templateUrl: './procesos.component.html',
  styleUrls: ['./procesos.component.scss']
})
export class ProcesosComponent implements OnInit {

  /** Un array de objetos `procesosSolicitado` que representa los datos para la tabla de solicitudes.*/
  public procesosTablaDatos: ProcesoSolicitado[] = [];


   /** Un array de objetos `procesosSolicitado` que representa los datos actualizados que seleccionaste.*/
  public procesosTablaDatosActualizados: ProcesoSolicitado[] = [];
  /**
  * **Subject utilizado para manejar la destrucción de suscripciones**
  * 
  * Este `Subject` se emite en `ngOnDestroy` para notificar y completar todas las
  * suscripciones activas, evitando posibles fugas de memoria en el componente.
  */
  private destroy$ = new Subject<void>();

  /**
   * Representa el estado actual del solicitante (Solicitante) para el trámite 110101.
   * Esta propiedad contiene toda la información relevante sobre los datos y el estado
   * del solicitante dentro del contexto del trámite.
   */
  public solicitudeState!: Solicitante110101State;

  /** Almacena las filas seleccionadas de la tabla */
  public procesoSeleccionado: ProcesoSolicitado[] = [];

  /** Almacena id para seleccion de tablas en inicio */
  public idsProcesosSeleccionados: number[] = [];

  /**
   * Inicializa el ProcesosComponent.
   */
  constructor(
    private solicitanteQuery: Solicitante110101Query,
    private tramite110101Store: Tramite110101Store
  ){
    
  }
  /**
   * Método que se ejecuta al iniciar el componente. 
   * @returns void
   */
  ngOnInit(): void { 
    this.solicitanteQuery.selectSolicitante$.pipe(takeUntil(this.destroy$),map((seccionState) => {
      this.solicitudeState = seccionState;
    })).subscribe();
    if (this.solicitudeState.proceso_seleccionado.length) {
      this.procesosTablaDatos = this.solicitudeState.proceso_seleccionado;
      this.procesoSeleccionado = this.solicitudeState.proceso_seleccionado.filter(p => p.cumple_proceso === true);
      
    }else{
      this.procesosTablaDatos = this.solicitudeState.validacionFraccionArancelaria.mercancia.procesos_solicitados || [];
      this.tramite110101Store.clearProcesoSolicitado(); 
      this.tramite110101Store.addProcesoSolicitado(this.procesosTablaDatos);
    }
     this.tramite110101Store.setValor('descripcion_alterna_modificada', this.solicitudeState.descripcion_alterna_modificada_response);
  }

  /**
   * Maneja el cambio de selección en la tabla procesos.
   * @param procesoSeleccionado - Array de registros seleccionados en la tabla.
   */
  onSeleccionChange(procesoSeleccionado: ProcesoSolicitado[]) :void{
    const IDSELECCIONADOS = new Set(
      procesoSeleccionado
        .filter(p => p.id_proceso_ceror !== null)
        .map(p => p.id_proceso_ceror)
    );

    this.procesosTablaDatosActualizados = this.procesosTablaDatos.map(p => ({
      ...p,
      cumple_proceso: IDSELECCIONADOS.has(p.id_proceso_ceror) ? true : false
    }));

    this.tramite110101Store.clearProcesoSolicitado();
    this.tramite110101Store.addProcesoSolicitado(this.procesosTablaDatosActualizados); 
  }

  /**
   * Alterna la selección de todas las filas de la tabla simultáneamente.
   * Marca o desmarca todos los checkboxes basado en el estado del checkbox "seleccionar todo".
   * 
   * @param event - Evento del DOM proveniente del checkbox "seleccionar todo"
   * @returns void
   * 
  */
  alternarSeleccionTodo(event: Event): void {
    const CHECKED = (event.target as HTMLInputElement).checked;
    this.procesosTablaDatos.forEach(f => {f.cumple_proceso = CHECKED;});
    this.actualizarSeleccion();
  }

  /**
   * Actualiza la lista interna de filas seleccionadas filtrando las filas
   * que tienen la propiedad `selected` en `true`.
   * Método privado utilizado internamente después de cambios en la selección.
   * 
   * @returns void
   * @private
   */
  private actualizarSeleccion(): void {
    this.procesoSeleccionado = this.procesosTablaDatos.filter(f => f.cumple_proceso);
  }

  /**
   * Verifica si todas las filas de la tabla están actualmente seleccionadas.
   * 
   * @returns `true` si hay al menos una fila en la tabla y todas están seleccionadas,
   *          `false` en caso contrario
   * 
   */
  todoSeleccionado(): boolean {
    return (
      this.procesosTablaDatos.length > 0 &&
      this.procesosTablaDatos.every(f => f.cumple_proceso)
    );
  }

  /**
   * Alterna el estado de selección de una fila específica en la tabla.
   * Actualiza la lista de filas seleccionadas después del cambio.
   * @param fila - Objeto de datos de la mercancía que se va a seleccionar/deseleccionar
   * @param event - Evento del DOM proveniente del checkbox de selección
   */
  alternarFila(fila: ProcesoSolicitado, event: Event): void {
  const CHECKED = (event.target as HTMLInputElement).checked;
  fila.cumple_proceso = CHECKED;

  this.actualizarSeleccion();
  }
}
