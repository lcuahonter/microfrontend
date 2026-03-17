/**
 * Componente que representa la interfaz de una cortina a la italiana.
 * Permite la navegación entre diferentes pestañas mediante un índice.
 */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, takeUntil } from 'rxjs';
import { AsignacionComponent } from '../asignacion/asignacion.component';
import { AsignacionDirectaCupoPersonasFisicasPrimeraVezService } from '../../services/asignacion-directa-cupo-personas-fisicas-primera-vez.service';
/**
 * Componente que representa la interfaz de una cortina a la italiana.
 * Permite la navegación entre diferentes pestañas mediante un índice.
 */
@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
})
export class DatosComponent implements OnInit, OnDestroy{  
  /**
  * Índice actual de la pestaña seleccionada.
  */
 indice: number = 1;

  /**   * Reference to the AsignacionComponent.
    */
   @ViewChild(AsignacionComponent, { static: false }) asignacionComponent!: AsignacionComponent;

 /**
  * Número total de pestañas disponibles.
  */
 totalPestanas: number = 5;

 /**Add commentMore actions
   * Esta variable se utiliza para almacenar el índice del subtítulo.
   */
  public consultaState!: ConsultaioState;

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @description Constructor del componente.
   * Inicializa el componente y establece el índice de la pestaña seleccionada.
   */
  formularioDeshabilitado: boolean = false;

/**
 * Servicio de consulta para obtener el estado actual de la consulta.
 * Servicio de asignación directa para gestionar la lógica de negocio relacionada con la toma de muestras de mercancías.
 */
  constructor(
    private consultaQuery: ConsultaioQuery,
    private AsignacionDirectaCupoPersonasFisicasPrimeraVezService: AsignacionDirectaCupoPersonasFisicasPrimeraVezService
  ) {}

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Se suscribe al estado de consulta y actualiza el estado del componente según sea necesario.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$.subscribe((seccionState) => {
      this.consultaState = seccionState;
      if (this.consultaState.update) {
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
    this.AsignacionDirectaCupoPersonasFisicasPrimeraVezService
      .getRegistroTomaMuestrasMercanciasData().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.AsignacionDirectaCupoPersonasFisicasPrimeraVezService.actualizarEstadoFormulario(resp);
        }
      });
  }


 /**
  * Indica si la pestaña seleccionada es la primera.
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
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Limpia las suscripciones para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
 
}