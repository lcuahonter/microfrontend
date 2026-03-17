import { Component, OnInit } from '@angular/core';

import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';

import { Subject, map, takeUntil } from 'rxjs';
import { Solocitud220401Service } from '../../services/service220401.service';
/**
 * Este componente se utiliza para mostrar el subtítulo del asistente - 220401
 * Establecer el índice del subtítulo
 */ 
@Component({
  selector: 'app-pantalla-datos',
  templateUrl: './datos.component.html'
})

export class DatosComponent implements OnInit {
  public esDatosRespuesta: boolean = false;
  /**
   * @comdoc
   * Estado actual de la consulta, utilizado para controlar el flujo de datos y la visualización
   * en el componente. Se inicializa al suscribirse al estado de consulta.
   */
  /**
   * @comdoc
   * Estado actual de la consulta.
   * Se utiliza para controlar el flujo de datos y la visualización en el componente.
   */
  public consultaState!: ConsultaioState;
  /**
   * @comdoc
   * Notificador para destruir las suscripciones y evitar fugas de memoria.
   * Se utiliza en los métodos que se suscriben a observables para cancelar la suscripción
   * cuando el componente se destruye.
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * Esta variable se utiliza para almacenar el índice del subtítulo.
   */
  indice: number = 1;
  /**
   * Este método se utiliza para establecer el índice del subtítulo.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

    /**
     * Constructor de la clase DatosComponent.
     * 
     * @param solocitud220401Service Servicio para gestionar operaciones relacionadas con la solicitud 220401.
     * @param consultaQuery Servicio para realizar consultas específicas en el contexto de la aplicación.
     * 
     * La inicialización de las propiedades se realizará en métodos específicos según sea necesario.
     */
    constructor(
    private solocitud220401Service: Solocitud220401Service,
    private consultaQuery: ConsultaioQuery
  ) {
// Constructor vacío: La inicialización se realizará en métodos específicos según sea necesario.
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Se suscribe al estado de consulta y actualiza la variable local consultaState.
   * Si el estado indica que hay una actualización, guarda los datos del formulario.
   * En caso contrario, establece la bandera esDatosRespuesta en true.
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
     * @description
     * Guarda los datos del formulario obteniendo la información de toma de muestras de mercancías
     * a través del servicio `solocitud220401Service`. Si la respuesta es válida, actualiza el estado
     * del formulario y marca que se recibió una respuesta de datos.
     *
     * @comdoc
     * Guarda los datos del formulario de toma de muestras de mercancías.
     * Obtiene los datos desde el servicio y, si la respuesta es válida, actualiza el estado del formulario.
     *
     * @returns {void} No retorna ningún valor.
     */
    guardarDatosFormulario(): void {
    this.solocitud220401Service
      .getRegistroTomaMuestrasMercanciasData().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if(resp){
        this.esDatosRespuesta = true;
        this.solocitud220401Service.actualizarEstadoFormulario(resp);
        }
      });
  }
}
