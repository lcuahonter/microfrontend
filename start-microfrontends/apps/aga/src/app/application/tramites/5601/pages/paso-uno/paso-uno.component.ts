import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import {Subject,map,takeUntil } from 'rxjs';
import { Component } from '@angular/core';
import { SolicitudDespachoExportacionService } from '../../Services/solicitud-despacho-exportacion-service.service';
/**
 * Componente que representa el paso uno del formulario o proceso.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
})
export class PasoUnoComponent {

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /**
 * Índice actual del paso activo en el flujo.
 */
  indice: number = 1;

  /**
   * Subject utilizado para cancelar las suscripciones cuando el componente se destruye.
   */
  private destroy$ = new Subject<void>();

  /** Subject para notificar la destrucción del componente. */
  public consultaState!: ConsultaioState;

  constructor(private consultaQuery: ConsultaioQuery,private solicitudDespachoExportacionService: SolicitudDespachoExportacionService){
    // Se suscribe al observable del estado y actualiza la propiedad local.
   this.consultaQuery.selectConsultaioState$
     .pipe(
       takeUntil(this.destroy$),
       map((seccionState) => {
         this.consultaState = seccionState;
       })
     ) .subscribe();
     if (this.consultaState.update) {
       this.guardarDatosFormulario();
     } else {
       this.esDatosRespuesta = true;
     }
  }

  /**
   * Guarda los datos del formulario obteniéndolos del servicio y actualiza el estado del formulario.
   */
  guardarDatosFormulario(): void {
    this.solicitudDespachoExportacionService
      .obtenerDatosInicialesFormulario().pipe(
        takeUntil(this.destroy$) // Cancela la suscripción cuando el componente se destruye
      )
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          // Actualiza el estado del formulario con la respuesta recibida
          this.solicitudDespachoExportacionService.actualizarEstadoFormulario(resp);
        } else {
          this.esDatosRespuesta = false;
        }
      });
  }

  /**
   * Selecciona una pestaña específica y actualiza el índice actual.
   *
   * @param {number} i - El índice de la pestaña a seleccionar.
   * @returns {void}
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }
}
