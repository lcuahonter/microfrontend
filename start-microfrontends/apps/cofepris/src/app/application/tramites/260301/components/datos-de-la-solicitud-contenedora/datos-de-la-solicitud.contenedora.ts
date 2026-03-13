import { ChangeDetectorRef, Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Subject, map, takeUntil } from 'rxjs';

import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';

import { DatosDeLaSolicitudComponent } from '../../../../shared/components/2603/datos-de-la-solicitud/datos-de-la-solicitud.component';

import { Tramite260301Query } from '../../estados/queries/tramite260301.query';
import { TramiteProc260301Store } from '../../estados/stores/tramite260301.store';
import {Tramite260301Store} from '../../estados/stores/tramites260301.store';
import { DatosSolicitudFormState } from '../../../../shared/models/datos-solicitud.model';
import { DatosSolicitudService } from '../../../../shared/services/shared2603/datos-solicitud.service';
import { TipoDeProducto } from '../../../../shared/components/2603/datos-de-la-solicitud/datos-de-la-solicitud.component';

/**
 * @component DatosDeLaSolicitudContenedoraComponent
 * @description Componente contenedor para el trámite 260301, encargado
 * de gestionar la lógica y presentación de datos relacionados con la
 * solicitud. Integra `DatosDeLaSolicitudComponent` para mostrar/editar
 * información específica, y sincroniza el estado global mediante
 * `Tramite260301Store`.
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
  @ViewChild('DatosDeLaSolicitudComponent', { static: false }) datosDeLaSolicitudComponent!: DatosDeLaSolicitudComponent;

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
  public readonly idProcedimiento = 260301;

      /** Indica si el botón continuar ha sido activado para ejecutar las validaciones del formulario. */
      @Input() isContinuarTriggered: boolean = false;

  /**
   * @property {boolean} formularioDeshabilitado
   * @description Indica si el formulario está deshabilitado.
   */
  formularioDeshabilitado: boolean = false;

  /**
   * @property consultaState
   * @description Estado actual de la consulta para el componente 2603.
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
    private tramite260301Query: Tramite260301Query,
    private tramite260301Store: TramiteProc260301Store ,
    private store :Tramite260301Store,
    private consultaQuery: ConsultaioQuery,
    private cdr: ChangeDetectorRef
  ) {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => { 
          this.formularioDeshabilitado = seccionState.readonly;
          this.consultaState = seccionState;
          this.cdr.detectChanges();
        })
      )
      .subscribe();
  }
  

  /**
   * Maneja el evento de cambio de selección del componente 2603.
   */
  onSelectionChange(event: TipoDeProducto): void {
    this.tramite260301Store.setTipoDeProducto(event as unknown as string);
  }




  /** Actualiza la validez del formulario de datos del establecimiento en el store. */
  public onSectionValid(event: boolean): void {
    this.store.setFormValidity('formSectionValid', event);
  }

  /**
   * Valida el formulario contenido en el componente hijo.
   */
  validarContenedor(): boolean {
    return this.datosDeLaSolicitudComponent.validarClickDeBoton() ? true : false;
  }
  
  /**
   * Método del ciclo de vida de Angular que se llama justo antes de que el componente sea destruido.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  private flattenAndSet(obj: any): void {
    Object.keys(obj).forEach(key => {
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        this.flattenAndSet(obj[key]);
      } else {
        this.tramite260301Store.setDynamicFieldValue(key, obj[key]);
      }
    });
  }

  public updateDatosSolicitud(event: DatosSolicitudFormState): void {
    this.flattenAndSet(event);
  }
}