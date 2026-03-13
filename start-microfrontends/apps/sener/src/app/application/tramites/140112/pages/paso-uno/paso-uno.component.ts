import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DesistimientoSolicitudPermisoComponent } from '../../component/desistimiento-solicitud-permiso/desistimiento-solicitud-permiso.component';
import { PermisosCancelarService } from '../../service/permisos-cancelar.service';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src';
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
  imports: [CommonModule, SolicitanteComponent,DesistimientoSolicitudPermisoComponent],
  standalone: true,
  providers: [PermisosCancelarService],
})
export class PasoUnoComponent implements OnInit, OnDestroy {

  indice: number = 1;

  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /** Subject para notificar la destrucción del componente */
  private destroy$ = new Subject<void>();

    /**
   * Estado actual de la consulta obtenido desde el store global.
   * Contiene la información relevante para el flujo del trámite en este paso.
   */
  public consultaState!:ConsultaioState;

      /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /**
   * Referencia al componente SolicitanteComponent para acceder a sus métodos y propiedades.
   */
  constructor(
      private PermisosCancelarService: PermisosCancelarService,
      private consultaQuery: ConsultaioQuery
) {
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
      this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroy$),map((seccionState) => {
          this.consultaState = seccionState;
      })).subscribe();
    if (this.consultaState && this.consultaState.update) {
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
    this.PermisosCancelarService
      .getPermisosCancelar().pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((resp) => {
        if(resp){
        this.esDatosRespuesta = true;
        this.PermisosCancelarService.actualizarEstadoFormulario(resp[0]);
        }else {
          this.esDatosRespuesta = false;
        }
      });
  }

  /**
   * Método del ciclo de vida que se ejecuta al destruir el componente.
   * Limpia las suscripciones activas para prevenir fugas de memoria.
   *
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}