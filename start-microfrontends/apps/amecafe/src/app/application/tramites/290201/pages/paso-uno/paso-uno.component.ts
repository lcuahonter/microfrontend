import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject,map, takeUntil } from 'rxjs';

import { Solicitud290201State, Solicitud290201Store } from '../../../../estados/tramites/tramites290201.store';
import { Solicitud290201Query } from '../../../../estados/queries/tramites290201.query';

import { RegistrarSolicitudService } from '../../services/registrar-solicitud.service';

/**
 * Componente que representa el primer paso del asistente (wizard).
 */
@Component({
  selector: 'paso-uno',
  templateUrl: './paso-uno.component.html',
  styles: ``,
})
export class PasoUnoComponent implements OnInit,OnDestroy{
  /**
   * Índice actual del paso seleccionado en el asistente.
   */
  indice: number = 1;

  /**
 * Indica si los datos de la respuesta están disponibles.
 */
  public esDatosRespuesta: boolean = false;

  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();

  /** Estado de la consulta que se obtiene del store. */
  public consultaState!:ConsultaioState;
  constructor(
    public solicitud290201Store: Solicitud290201Store,
    public solicitud290201Query: Solicitud290201Query,
    private registrarsolicitud: RegistrarSolicitudService,
    public consultaQuery: ConsultaioQuery,
  ) {
     
  }
  ngOnInit(): void {
   
    this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$),map((seccionState) => {
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
 * Realiza una consulta de datos utilizando el servicio `registrarsolicitud` y actualiza el estado del formulario si se obtiene una respuesta válida.
 */
  guardarDatosFormulario(): void {
    this.registrarsolicitud
      .getConsultaData().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp: Solicitud290201State) => {
        if(resp){    
        this.esDatosRespuesta = true;
        this.registrarsolicitud.actualizarEstadoFormulario(resp);
        }
      });
  }

  /**
   * Selecciona una pestaña específica en el asistente.
   * 
   * @param i Índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

/**
 * Método que se ejecuta al destruir el componente.
 * Notifica a los observables que deben finalizar suscripciones y libera recursos asociados.
 */
ngOnDestroy(): void {
  this.destroyNotifier$.next(); 
  this.destroyNotifier$.complete(); 
}
}
