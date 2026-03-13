import { Component,OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import {Subject,map,takeUntil } from 'rxjs';
import { Solocitud221601Service } from '../../service/service221601.service';

/**
 * compo doc
 * @selector app-datos-90305
 */
@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html'
})
/** Componente encargado de gestionar y mostrar los datos del formulario  
 *  dentro del flujo del trámite 221601. */
export class DatosComponent implements OnInit {
  /**
  * Índice actual del subtítulo seleccionado en la interfaz.
  */
 indice: number = 1;

 /**
  * Método para actualizar el índice del subtítulo seleksccionado.
  * 
  * @param i - Índice de la pestaña seleccionada.
  */
 seleccionaTab(i: number): void {
   this.indice = i;
 }
/** Bandera que indica si los datos de respuesta están disponibles o han sido cargados.  
 *  Se utiliza para controlar la lógica de visualización o validación en el componente. */
   public esDatosRespuesta: boolean = false;
   /** Almacena el estado actual de la consulta relacionada con el trámite.  
 *  Contiene información necesaria para mostrar o procesar datos en el componente. */
   public consultaState!:ConsultaioState;
   /** Notificador utilizado para cancelar suscripciones al destruir el componente.  
 *  Ayuda a prevenir fugas de memoria en flujos observables. */
   private destroyNotifier$: Subject<void> = new Subject();
   /** Constructor que inyecta el servicio del trámite 221601 y el query de consulta.  
 *  Permite acceder a los datos y lógica necesaria para el componente. */
       constructor(
    private solocitud221601Service: Solocitud221601Service,
    private consultaQuery: ConsultaioQuery
  ) {
// Constructor vacío: La inicialización se realizará en métodos específicos según sea necesario.
  }
  /** Inicializa el componente suscribiéndose al estado de consulta.  a
 *  Ejecuta lógica según si se requiere actualización o solo visualización. */
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
/** Obtiene los datos del formulario desde un JSON simulado y actualiza el store.  
 *  Marca la bandera de respuesta si la información es válida. */
     guardarDatosFormulario(): void {
    this.solocitud221601Service
      .getRegistroTomaMuestrasMercanciasData().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if(resp){
        this.esDatosRespuesta = true;
        this.solocitud221601Service.actualizarEstadoFormulario(resp);
        }
      });
  }
}
