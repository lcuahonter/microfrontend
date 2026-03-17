/**
 * @fileoverview
 * El `PasoUnoComponent` es un componente de Angular diseñado para gestionar la funcionalidad del primer paso del trámite.
 * Proporciona la lógica para cambiar entre pestañas y notificar al servicio sobre el estado actual.
 * 
 * @module PasoUnoComponent
 * @description
 * Este componente permite la navegación entre pestañas y utiliza el servicio `AmpliacionServiciosService` para gestionar 
 * la visibilidad de ciertos elementos en función de la pestaña seleccionada.
 */
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, takeUntil } from 'rxjs';
import { AmpliacionServiciosService } from '../../services/ampliacion-servicios.service';
import { Component } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
})
export class PasoUnoComponent implements OnInit, OnDestroy {

   /**
   * Indica si los datos de respuesta están disponibles.
   * Valor inicial: false.
   */

   public esDatosRespuesta: boolean = false;

   /**
    * Estado de la consulta actual.
    * Este estado se obtiene a través de ConsultaioQuery.
    */
 
   public consultaState!: ConsultaioState;
 
   /**
    * Subject para notificar la destrucción del componente.
    * Se utiliza para limpiar suscripciones y evitar fugas de memoria.
    */
 
   public destroyNotifier$: Subject<void> = new Subject();


  /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  esFormularioSoloLectura: boolean = false;

  /**
   * Índice de la pestaña seleccionada.
   * @property {number} indice
   */
  indice: number = 1;

  /**
   * Constructor del componente.
   * @constructor
   * @param {AmpliacionServiciosService} ampliacionServiciosService - Servicio para gestionar la visibilidad de elementos.
   * @param {ConsultaioQuery} consultaQuery - Consulta para obtener el estado actual de la consulta.
   */
  constructor(private ampliacionServiciosService: AmpliacionServiciosService,private consultaQuery: ConsultaioQuery) {
    // No se necesita lógica de inicialización adicional.
  }

  /**
   * Cambia la pestaña seleccionada y notifica al servicio si la pestaña es la 1 o la 2.
   * @method seleccionaTab
   * @param {number} i - Índice de la pestaña seleccionada.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }
   /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Se suscribe al estado de consulta y actualiza el estado del componente según sea necesario.
   */
   ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$.subscribe((seccionState) => {
      this.consultaState = seccionState;
      if (this.consultaState.update) {
        this.esFormularioSoloLectura = true;
        this.guardarDatosFormulario();
      } else {
        this.esDatosRespuesta = true;
      }
    });
  }
  /**
   * Guarda los datos del formulario utilizando el servicio de ampliación de servicios.
   */
  guardarDatosFormulario(): void {
    this.ampliacionServiciosService
    .getServiciosData().pipe(
      takeUntil(this.destroyNotifier$)
    )
    .subscribe((resp) => {
      if(resp) {
       this.esDatosRespuesta = true;
       this.ampliacionServiciosService.actualizarEstadoFormulario(resp);

      }
    });
}

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Limpia las suscripciones para evitar fugas de memoria.
   */
ngOnDestroy(): void {
  this.destroyNotifier$.next();
  this.destroyNotifier$.complete();
}
}