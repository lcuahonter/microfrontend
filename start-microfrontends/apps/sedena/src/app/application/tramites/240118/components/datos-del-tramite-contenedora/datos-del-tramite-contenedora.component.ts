/**
 * @fileoverview Componente contenedor para los datos del trámite 240118.
 * @description Gestiona la integración entre el formulario de datos del trámite y el estado global,
 * incluyendo la gestión de mercancías y la navegación entre modalos.
 * @author VUCEM Development Team
 * @since 1.0.0
 * @version 1.0.0
 */

import { ActivatedRoute, Router } from '@angular/router';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DatosDelTramiteComponent } from '../../../../shared/components/datos-del-tramite/datos-del-tramite.component';
import { DatosDelTramiteFormState } from '../../../../shared/models/datos-del-tramite.model';
import { DatosMercanciaContenedoraComponent } from '../datos-mercancia-contenedora/datos-mercancia-contenedora.component';
import { ID_PROCEDIMIENTO } from '../../../240118/constants/solicitud-permiso-extraordinario-exportacion';
import { MercanciaDetalle } from '../../../../shared/models/datos-del-tramite.model';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { Tramite240118Query } from '../../estados/tramite240118Query.query';
import { Tramite240118Store } from '../../estados/tramite240118Store.store';

/**
 * @class DatosDelTramiteContenedoraComponent
 * @implements {OnInit, OnDestroy}
 * @description Componente contenedor que gestiona los datos principales del trámite 240118.
 * Actúa como intermediario entre el componente de datos del trámite reutilizable y el
 * estado específico del trámite, manejando también la gestión de mercancías y navegación.
 * 
 * Este componente centraliza:
 * - La gestión del estado del formulario de datos del trámite
 * - El manejo de mercancías asociadas al trámite
 * - La navegación entre diferentes secciones del proceso
 * - La integración con modales para acciones específicas
 * 
 * @example
 * ```html
 * <app-datos-del-tramite-contenedora
 *   [esFormularioSoloLectura]="modoConsulta">
 * </app-datos-del-tramite-contenedora>
 * ```
 * 
 * @standalone
 * @selector app-datos-del-tramite-contenedora
 * @templateUrl ./datos-del-tramite-contenedora.component.html
 * @styleUrl ./datos-del-tramite-contenedora.component.scss
 * @since 1.0.0
 * @author VUCEM Development Team
 * @version 1.0.0
 */

@Component({
  selector: 'app-datos-del-tramite-contenedora',
  standalone: true,
  imports: [CommonModule, DatosDelTramiteComponent, ModalComponent],
  templateUrl: './datos-del-tramite-contenedora.component.html',
  styleUrl: './datos-del-tramite-contenedora.component.scss',
})
export class DatosDelTramiteContenedoraComponent implements OnInit, OnDestroy {
  /**
   * @property modalComponent
   * @description Referencia al componente modal utilizado para mostrar información adicional.
   * @type {ModalComponent}
   */
  @ViewChild('modal', { static: false }) modalComponent!: ModalComponent;
  /**
   * @property esFormularioSoloLectura
   * @description Indica si el formulario es de solo lectura.
   * @type {boolean}
   */
  @Input()
  esFormularioSoloLectura: boolean = false;
  /**
   * @constant {number} ID_PROCEDIMIENTO
   * @property {number} idProcedimiento - Indica si el elemento está oculto o visible.
   * @remarks Este valor determina la visibilidad del componente en la interfaz de usuario.
   * @command Cambiar el valor de esta propiedad para alternar la visibilidad.
   */
  public readonly idProcedimiento: number = ID_PROCEDIMIENTO;

  /**
   * Datos de la tabla de mercancías que se muestran en el formulario.
   * @property {MercanciaDetalle[]} datosMercanciaTabla
   */
  public datosMercanciaTabla: MercanciaDetalle[] = [];

  /**
   * Estado actual del formulario de datos del trámite.
   * @property {DatosDelTramiteFormState} datosDelTramiteFormState
   */
  public datosDelTramiteFormState!: DatosDelTramiteFormState;

  /** @private Sujeto para manejar la destrucción de suscripciones y evitar fugas de memoria. */
  private destroy$ = new Subject<void>();

  /**
   * Constructor del componente.
   *
   * @method constructor
   * @param {Tramite240118Query} tramiteQuery - Query de Akita para obtener el estado actual del trámite.
   * @param {Tramite240118Store} tramiteStore - Store de Akita para actualizar el estado del trámite.
   *  @param {Router} router - Servicio de Angular Router para navegar entre rutas.
   * @param {ActivatedRoute} activatedRoute - Servicio de Angular ActivatedRoute para obtener información
   * @returns {void}
   */
  constructor(
    private tramiteQuery: Tramite240118Query,
    private tramiteStore: Tramite240118Store,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    // No hacer nada
  }

  /**
   * Hook del ciclo de vida que se ejecuta al inicializar el componente.
   * Suscribe a los observables del estado para mostrar los datos en la vista.
   *
   * @method ngOnInit
   * @returns {void}
   */
  ngOnInit(): void {
    this.tramiteQuery.getMercanciaTablaDatos$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        let necesitaActualizar = false;
        const DATOS_ACTUALIZADOS = data.map((item, index) => {
          if (Object.prototype.hasOwnProperty.call(item, 'tableIndex')) {
            return item;
          }
          necesitaActualizar = true;
          return {
            ...item,
            tableIndex: index,
          };
        });
        this.datosMercanciaTabla = DATOS_ACTUALIZADOS;
        if (necesitaActualizar) {
          this.tramiteStore.setMercanciasDatosTabla(DATOS_ACTUALIZADOS);
        }
      });

    this.tramiteQuery.getDatosDelTramite$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.datosDelTramiteFormState = data;
      });
  }

  /**
   * Actualiza la lista de destinatarios finales en el store del trámite.
   *
   * @method modificarMercanciasDatos
   * @param {MercanciaDetalle[]} event - Lista de destinatarios finales actualizada.
   * @returns {void}
   */
  modificarMercanciasDatos(datos: MercanciaDetalle): void {
    this.tramiteStore.actualizarMercancias(datos);
    this.irAAcciones();
  }

  /**
   * Elimina los datos de una mercancía específica del trámite actual.
   *
   * @param datos - Objeto de tipo `MercanciaDetalle` que contiene la información de la mercancía a eliminar.
   *
   * @remarks
   * Este método verifica si el objeto `datos` es válido y, en caso afirmativo,
   * llama al método `eliminarMercancias` del store para eliminar la mercancía correspondiente.
   *
   * @see TramiteStore.eliminarMercancias
   */
  eliminarMercanciasDatos(datos: MercanciaDetalle): void {
    if (datos) {
      this.tramiteStore.eliminarMercancias(datos);
    }
  }

  /**
   * Navega a una ruta relativa dentro del flujo actual.
   * @method irAAcciones
   * @param {string} accionesPath - Ruta relativa a la que se desea navegar.
   * @returns {void}
   */
  irAAcciones(): void {
    this.router.navigate(['../agregar-datos-mercancia'], {
      relativeTo: this.activatedRoute,
    });
  }

  /**
   * Hook del ciclo de vida que se ejecuta al destruir el componente.
   * Libera las suscripciones activas para evitar fugas de memoria.
   *
   * @method ngOnDestroy
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Actualiza el estado del formulario de datos del trámite en el store.
   *
   * @method updateDatosDelTramiteFormulario
   * @param {DatosDelTramiteFormState} event - Estado actualizado del formulario.
   * @returns {void}
   */
  updateDatosDelTramiteFormulario(event: DatosDelTramiteFormState): void {
    this.tramiteStore.updateDatosDelTramiteFormState(event);
  }
  /**
   * Abre el modal correspondiente según el nombre del evento recibido.
   *
   * Si el evento es `'Datosmercancia'`, se carga el componente `DatosMercanciaContenedoraComponent`
   * dentro del modal y se le pasa una función de cierre como input.
   *
   * @method openModal
   * @param {string} event - Nombre del evento que indica qué componente se debe mostrar en el modal.
   * @returns {void}
   */
  openModal(event: string): void {
    if (event === 'Datosmercancia') {
      this.modalComponent.abrir(DatosMercanciaContenedoraComponent, {
        cerrarModal: this.cerrarModal.bind(this),
      });
    }
  }

  /**
   * Cierra el modal dinámico actualmente abierto utilizando el método del componente modal.
   *
   * @method cerrarModal
   * @returns {void}
   */
  cerrarModal(): void {
    this.modalComponent.cerrar();
  }
}
