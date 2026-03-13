import { ChangeDetectorRef, Component, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Subject, map, takeUntil } from 'rxjs';

import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';

import { DatosDeLaSolicitudComponent } from '../../../../shared/components/2614/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { Tramite2614Query } from '../../../../estados/queries/tramite2614.query';
import { Tramite2614Store } from '../../../../estados/tramites/tramite2614.store';

/**
 * @component DatosDeLaSolicitudContenedoraComponent
 * @description Componente contenedor para el trámite 261401, encargado
 * de gestionar la lógica y presentación de datos relacionados con la
 * solicitud. Integra `DatosDeLaSolicitudComponent` para mostrar/editar
 * información específica, y sincroniza el estado global mediante
 * `Tramite2614Store`.
 **/
@Component({
  selector: 'app-datos-de-la-solicitud-contenedora',
  standalone: true,
  imports: [CommonModule, DatosDeLaSolicitudComponent],
  providers: [Tramite2614Store, Tramite2614Query],
  templateUrl: './datos-de-la-solicitud-contenedora.component.html',
  styleUrls: ['./datos-de-la-solicitud-contenedora.component.scss'],
})
export class DatosDeLaSolicitudContenedoraComponent implements OnDestroy {
      /**
   * @property
   * @name permisoDefinitivoTitulo
   * @type {number}
   * @description Identificador único del procedimiento actual. Este valor se utiliza para asociar el componente con un trámite específico en el sistema.
   */
  permisoDefinitivoTitulo: number = 261402;

    /**
   * @property
   * @name idProcedimiento
   * @type {number}
   * @description Identificador único del procedimiento actual. Este valor se utiliza para asociar el componente con un trámite específico en el sistema.
   */
  idProcedimiento: number = 261402;

  /**
   * @property
   * @name permisoSeccion
   * @type {number[]}
   * @description Identificador de la sección de permisos específica para este procedimiento.
   */
  permisoSeccion: number = 261402;

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
   * @param Tramite2614Query Servicio para consultar el estado específico del trámite 261401.
   * @param Tramite2614Store Store para gestionar el estado del trámite 261401.
   * @param cdr Servicio de Angular para detectar y aplicar cambios en el ciclo de vida del componente.
   *
   * La suscripción se cancela automáticamente al destruir el componente para evitar fugas de memoria.
   */
  constructor(
    private consultaQuery: ConsultaioQuery,
    private Tramite2614Query: Tramite2614Query,
    private Tramite2614Store: Tramite2614Store,
    private cdr: ChangeDetectorRef
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
   * Método del ciclo de vida de Angular que se llama justo antes de que el componente sea destruido.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}