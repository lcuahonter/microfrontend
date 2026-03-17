import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';

import { Subject, map, takeUntil } from 'rxjs';

import {Solocitud250102Service} from '../../services/service250102.service';

/**
 * Componente que maneja los datos del trámite 250101.
 */
@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
})
export class DatosComponent implements OnInit, OnDestroy {
  
   /**
   * Indica si se han recibido correctamente los datos desde el servidor.
   */
  public esDatosRespuesta: boolean = false;

   /**
   * Subject utilizado para cancelar suscripciones y evitar fugas de memoria al destruir el componente.
   * Se emite un valor y se completa cuando el componente se destruye.
   * @private
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado actual de la consulta obtenido desde el store.
   */
  public consultaState!: ConsultaioState;

  /**
   * Constructor del componente.
   * @param consultaQuery Consulta de estado de solo lectura.
   * @param solocitud250102Service Servicio para obtener y actualizar datos del formulario.
   */
  constructor(
    private consultaQuery: ConsultaioQuery,
    private solocitud250102Service: Solocitud250102Service,
  ) {}


  /**
   * Hook del ciclo de vida de Angular.
   * Se ejecuta al inicializar el componente y se suscribe al estado del store.
   * Si el estado indica actualización, solicita los datos del formulario.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
        })
      )
      .subscribe();

    if (this.consultaState.update) {
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }
  }

  /**
   * Solicita los datos del[] formulario al servicio y actualiza el store si la respuesta es válida.
   * Marca la bandera de datos recibidos si la respuesta es exitosa.
   */
  guardarDatosFormulario(): void {
    this.solocitud250102Service
      .getRegistroTomaMuestrasMercanciasData()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.solocitud250102Service.actualizarEstadoFormulario(resp);
        }
      });
  }


 
  /**
   * Índice actual del tab seleccionado.
   */
  indice = 1;

  /**
   * Cambia el índice del tab seleccionado.
   * @param i Número del tab a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

      /**
   * Hook del ciclo de vida Angular que se ejecuta al destruir el componente.
   * Libera recursos cancelando todas las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
