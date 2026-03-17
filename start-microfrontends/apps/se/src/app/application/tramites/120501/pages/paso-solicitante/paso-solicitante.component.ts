import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { map, takeUntil } from 'rxjs';
import { LicitacionesDisponiblesService } from '../../services/licitaciones-disponibles.service';
import { LicitacionesVigentesComponent } from '../../component/licitaciones-vigentes/licitaciones-vigentes.component';
import { Subject } from 'rxjs';
import { Tramite120501Store } from '../../estados/tramites/tramite120501.store';
/**
 * 
 *  app-paso-solicitante
 *  ./paso-solicitante.component.html
 *  Componente para manejar el paso del solicitante en el proceso de transferencia de cupos.
 */
@Component({
  selector: 'app-paso-solicitante',
  templateUrl: './paso-solicitante.component.html',
})
export class PasoSolicitanteComponent implements OnInit, OnDestroy{
  /**
   * {number} indice
   *  Índice actual del tab seleccionado.
   */
  indice: number = 1;
  /**
 * Subject utilizado para gestionar la destrucción de suscripciones y evitar fugas de memoria
 * cuando el componente se destruye.
 */
private destroyed$ = new Subject<void>();

/**
 * Indica si se ha recibido una respuesta con datos.
 * Se utiliza para mostrar u ocultar información en la interfaz según el estado de la respuesta.
 */
public esDatosRespuesta: boolean = false;

/**
 * Estado actual de la consulta, obtenido desde el store.
 * Almacena la información relevante para el paso del solicitante.
 */
public consultaState!: ConsultaioState;

/**
 * Bandera que indica si se debe actualizar la información.
 * Por defecto está en true.
 */
update = true;

@ViewChild(LicitacionesVigentesComponent,{ static: false }) LicitacionesVigentesComponent!: LicitacionesVigentesComponent;
/**
 * Constructor del componente.
 * Inyecta los servicios necesarios para la gestión de licitaciones y la consulta del estado.
 */
constructor(
  private service: LicitacionesDisponiblesService,
  private consultaQuery: ConsultaioQuery,
  private tramite120501Store: Tramite120501Store
) {
  // constructor
}
  /**
   *  seleccionaTab
   *  Método para seleccionar un tab específico.
   *  {number} i - Índice del tab a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }
  /**
 * Método del ciclo de vida que se ejecuta al inicializar el componente.
 *
 * Se suscribe al observable `selectConsultaioState$` para obtener el estado actual de la consulta
 * y lo asigna a la propiedad `consultaState`. Dependiendo del valor de `update` en el estado,
 * decide si debe llamar a `guardarDatosFormulario()` para obtener y actualizar los datos,
 * o simplemente mostrar la información existente.
 */
  ngOnInit(): void {
   this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyed$),map((seccionState) => {
          this.consultaState = seccionState;
      })).subscribe();
  
    if(this.consultaState.update) {
      this.getMostrarDatos(Number(this.consultaState?.id_solicitud));
      this.tramite120501Store.actualizarEstado({idSolicitud: Number(this.consultaState?.id_solicitud)});
    } else {
      this.esDatosRespuesta = true;
    }
  }
  
/**
 * Obtiene los datos vigentes de licitaciones mediante el servicio y actualiza el estado del formulario.
 *
 * Se suscribe al observable que retorna el servicio `getMostrarDatos()`. Si la respuesta es válida,
 * actualiza la bandera `esDatosRespuesta` y llama al método del servicio para actualizar el estado del formulario.
 */
  getMostrarDatos(solicitudId: number): void {
    this.service.getMostrarDatos(solicitudId).pipe(
      takeUntil(this.destroyed$)).subscribe((resp) => {
      if(resp.codigo === '00'){
      this.service.actualizarEstadoFormulario(resp.datos as unknown as Record<string, unknown[]>);
      }
    });
  }

/**
 * Método del ciclo de vida que se ejecuta al destruir el componente.
 *
 * Emite y completa el subject `destroyed$` para cancelar todas las suscripciones activas,
 * evitando fugas de memoria.
 */
  ngOnDestroy(): void {
  this.destroyed$.next();
  this.destroyed$.complete();
}
}