import { Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';

import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

import { DatosDeLaSolicitudComponent } from '../../../../shared/components/2603/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { ID_PROCEDIMIENTO } from '../../../../shared/constantes/shared2603/certificados-licencias-permisos.enum';
import { TipoDeProducto } from '../../../../shared/components/2603/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { Tramite260304Query } from '../../estados/queries/tramite260304.query';
import { Tramite260304Store } from '../../estados/stores/tramite260304.store';

/**
 * @component DatosDeLaSolicitudContenedoraComponent
 * @description Componente contenedor para el trámite 260304, encargado
 * de gestionar la lógica y presentación de datos relacionados con la
 * solicitud. Integra `DatosDeLaSolicitudComponent` para mostrar/editar
 * información específica, y sincroniza el estado global mediante
 * `Tramite260304Store`.
 **/
@Component({
  selector: 'app-datos-de-la-solicitud-contenedora',
  standalone: true,
  imports: [CommonModule, DatosDeLaSolicitudComponent],
  templateUrl: './datos-de-la-solicitud.contenedora.html',
  styleUrls: ['./datos-de-la-solicitud.contenedora.scss'],
})
export class DatosDeLaSolicitudContenedoraComponent implements OnDestroy {
  
  /**
   * @property {DatosDeLaSolicitudComponent} datosDeLaSolicitudComponent
   * @description
   * Referencia al componente hijo `DatosDeLaSolicitudComponent` obtenida
   * mediante el decorador `@ViewChild`.
   */
  @ViewChild(DatosDeLaSolicitudComponent) datosDeLaSolicitudComponent!: DatosDeLaSolicitudComponent;

  /**
   * @property destroyNotifier$
   * @description Subject utilizado para cancelar observables de manera ordenada
   * cuando el componente se destruye, evitando fugas de memoria.
   * @private
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property {string} idProcedimiento
   * @description Identificador del procedimiento.
   */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;

  /**
   * @property {boolean} formularioDeshabilitado
   * @description Indica si el formulario está deshabilitado.
   */
  formularioDeshabilitado: boolean = false;

  /**
   * @property consultaState
   * @description Estado actual de la consulta para el componente 260304.
   */
  @Input() public consultaState!: ConsultaioState;
  
  /**
   * Crea una instancia de DatosDeLaSolicitudContenedoraComponent.
   *
   * @param tramite260304Query Query para acceder al estado del trámite.
   * @param tramite260304Store Store para gestionar el estado del trámite.
   * @param consultaQuery Servicio para consultar el estado global de la consulta.
   * @param cdr Servicio para detectar y aplicar cambios en el ciclo de vida del componente.
   */
  constructor(
    private tramite260304Query: Tramite260304Query,
    private tramite260304Store: Tramite260304Store,
    private consultaQuery: ConsultaioQuery
  ) {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => { 
          this.formularioDeshabilitado = seccionState.readonly;
          this.consultaState = seccionState;
        })
      )
      .subscribe();
  }
  
  /**
   * Maneja el evento de cambio de selección del componente 2603.
   */
  onSelectionChange(event: TipoDeProducto): void {
    this.tramite260304Store.setTipoDeProducto(event as unknown as string);
  }

  /**
   * @method datasolicitudActualizar
   * @description
   * Actualiza el estado del formulario de datos de la solicitud en el store.
   *
   * @param {DatosSolicitudFormState} event - Nuevo estado del formulario.
   */
  datasolicitudActualizar(event: any): void {
    this.tramite260304Store.updateDatosSolicitudFormState(event);
  }

  /**
   * Valida el formulario contenido en el componente hijo.
   */
  validarContenedor(): boolean {
    return this.datosDeLaSolicitudComponent ? true : false;
  }
  
  /**
   * Método del ciclo de vida de Angular que se llama justo antes de que el componente sea destruido.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}