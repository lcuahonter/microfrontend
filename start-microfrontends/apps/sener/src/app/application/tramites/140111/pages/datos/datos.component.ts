/**
 * Componente que representa la interfaz de una cortina a la italiana.
 * Permite la navegación entre diferentes pestañas mediante un índice.
 */
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { RenunciaDeDerechosAlServicio } from '../../services/renuncia-de-derechos-al.service';
/**
 * Componente que representa la interfaz de una cortina a la italiana.
 * Permite la navegación entre diferentes pestañas mediante un índice.
 */
@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
})
export class DatosComponent implements OnInit , OnDestroy {  
  /**
  * Índice actual de la pestaña seleccionada.
  */
 indice = 1;

 /**
  * Número total de pestañas disponibles.
  */
 totalPestanas = 5;

 /**
  * Indica si la pestaña seleccionada es la primera.
  */

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /** Subject para notificar la destrucción del componente. */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado actual de la consulta obtenido desde el store global.
   * Contiene la información relevante para el flujo del trámite en este paso.
   */
  public consultaState!:ConsultaioState;

  /**
   * Constructor del componente.
   * @param servicio Servicio para la gestión de renuncia de derechos.
   * @param consultaQuery Servicio para consultar el estado global.
   */
  constructor(
      @Inject(RenunciaDeDerechosAlServicio)
      public servicio: RenunciaDeDerechosAlServicio,
      private consultaQuery: ConsultaioQuery
    ) {
  // Constructor vacío: La inicialización se realizará en métodos específicos según sea necesario.
    }

  /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   *
   * Suscribe al observable `selectConsultaioState$` para obtener el estado actual de la consulta
   * y lo asigna a la propiedad `consultaState`. Dependiendo del valor de `update` en el estado,
   * decide si debe cargar los datos del formulario o marcar que los datos de respuesta están listos.
   *
   * @returns {void}
   */
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
     * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
     * Luego reinicializa el formulario con los valores actualizados desde el store.
     */
    guardarDatosFormulario(): void {
      this.servicio
        .getRegistroTomaMuestrasMercanciasData().pipe(
          takeUntil(this.destroyNotifier$)
        )
        .subscribe((resp) => {
          if(resp){
          this.esDatosRespuesta = true;
          this.servicio.actualizarEstadoFormulario(resp);
          }else {
            this.esDatosRespuesta = false;
          }
        });
    }

  /**
   * Indica si la pestaña actual es la primera.
   * Útil para desactivar botones de navegación hacia atrás.
   */  
 get esPrimeraPestana(): boolean {
   return this.indice === 1;
 }

 /**
  * Indica si la pestaña seleccionada es la última.
  */
 get esUltimaPestana(): boolean {
   return this.indice === this.totalPestanas;
 }

 /**
  * Cambia la pestaña activa según el índice proporcionado.
  * @param i Número de la pestaña a seleccionar.
  */
 seleccionaTab(i: number): void {
   if (i >= 1 && i <= this.totalPestanas) {
     this.indice = i;
   }
 }

 /**
  * Avanza a la siguiente pestaña si no es la última.
  */
 avanzarTab(): void {
   if (!this.esUltimaPestana) {
     this.indice++;
   }
 }

 /**
  * Retrocede a la pestaña anterior si no es la primera.
  */
 retrocederTab(): void {
   if (!this.esPrimeraPestana) {
     this.indice--;
   }
 }

 /**
  * Reinicia la selección de pestañas al valor inicial.
  */
 resetTabs(): void {
   this.indice = 1;
 }

  /**
     * Método de limpieza al destruir el componente.
     */
    ngOnDestroy(): void {
      this.destroyNotifier$.next();
      this.destroyNotifier$.complete();
    }
}