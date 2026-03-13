import { ChangeDetectorRef, Component, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Subject, map, takeUntil } from 'rxjs';

import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';

import { DatosDeLaSolicitudComponent } from '../../../../shared/components/2603/datos-de-la-solicitud/datos-de-la-solicitud.component';

import { Tramite260302Query } from '../../estados/queries/tramite260302.query';
import { Tramite260302Store } from '../../estados/stores/tramites260302.store';
import { ViewChild } from '@angular/core';

/**
 * @component DatosDeLaSolicitudContenedoraComponent
 * @description Componente contenedor para el trámite 260302, encargado
 * de gestionar la lógica y presentación de datos relacionados con la
 * solicitud. Integra `DatosDeLaSolicitudComponent` para mostrar/editar
 * información específica, y sincroniza el estado global mediante
 * `Tramite260302Store`.
 **/
@Component({
  selector: 'app-datos-de-la-solicitud-contenedora',
  standalone: true,
  imports: [CommonModule, DatosDeLaSolicitudComponent],
  providers: [Tramite260302Store, Tramite260302Query],
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
 * Indica si el formulario es de solo lectura.
 */
  public idProcedimiento = 260302;

  /**
   * @property destroyNotifier$
   * @description Subject utilizado para cancelar observables de manera ordenada
   * cuando el componente se destruye, evitando fugas de memoria.
   * @private
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property consultaState
   * @description
   * Estado actual de la consulta gestionado por el store `ConsultaioQuery`.
   */
  @Input() public consultaState!: ConsultaioState;

/**
   * @property {boolean} esFormularioSoloLectura
   * @description Bandera que determina si el formulario de pago de derechos debe
   * mostrarse en modo solo lectura. Cuando es `true`, todos los campos del formulario
   * se deshabilitan y no permiten edición. Este valor se actualiza automáticamente
   * basándose en el estado de consulta obtenido del `ConsultaioQuery`.
   * 
   * @type {boolean}
   * @default false
   * @access public
   * @readonly false
   * @example
   * ```typescript
   * // En el template
   * <app-pago-derechos [readonly]="esFormularioSoloLectura"></app-pago-derechos>
   * ```
   */
  public esFormularioSoloLectura: boolean = false;

  /**
   * Crea una instancia de DatosDeLaSolicitudContenedoraComponent.
   *
   * Inicializa la suscripción al estado de consulta mediante el store `ConsultaioQuery`.
   * Actualiza la bandera `esFormularioSoloLectura` y el estado `consultaState` cada vez que cambia el estado de consulta.
   *
   * @param consultaQuery Servicio para consultar el estado global de la consulta.
   * @param tramite260302Query Servicio para consultar el estado específico del trámite 260302.
   * @param tramite260302Store Store para gestionar el estado del trámite 260302.
   * @param cdr Servicio de Angular para detectar y aplicar cambios en el ciclo de vida del componente.
   *
   * La suscripción se cancela automáticamente al destruir el componente para evitar fugas de memoria.
   */
  constructor(
    private consultaQuery: ConsultaioQuery,
    private tramite260302Query: Tramite260302Query,
    private cdr: ChangeDetectorRef,
    private store: Tramite260302Store,
  ) {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.consultaState = seccionState;
          this.cdr.detectChanges();
        })
      )
      .subscribe();
  }

  /**
   * Valida el formulario contenido en el componente hijo.
   */
  validarContenedor(): boolean {
    return this.datosDeLaSolicitudComponent.validarClickDeBoton() ? true : false;
  }
 /** Actualiza la validez del formulario de datos del establecimiento en el store. */
  public onSectionValid(event: boolean): void {
    this.store.setFormValidity('formSectionValid', event);
  }
    /** Indica si el botón continuar ha sido activado para ejecutar las validaciones del formulario. */
  @Input() isContinuarTriggered: boolean = false;
  /**
   * Método del ciclo de vida de Angular que se llama justo antes de que el componente sea destruido.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}