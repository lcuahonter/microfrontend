import { Component, Input, ViewChild } from '@angular/core';
import { DatosDelTramiteFormState, MERCANCIA_ENCABEZADO_DE_TABLA } from '../../../../shared/models/datos-del-tramite.model';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConfiguracionColumna } from '@libs/shared/data-access-user/src';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DatosDelTramiteComponent } from '../../../../shared/components/datos-del-tramite/datos-del-tramite.component';
import { DatosMercanciaContenedoraComponent } from '../datos-mercancia-contenedora/datos-mercancia-contenedora.component';
import { ID_PROCEDIMIENTO } from '../../constants/exportacion-sustancias-quimicas.enum';
import { MercanciaDetalle } from '../../../../shared/models/datos-del-tramite.model';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Tramite240123Query } from '../../estados/tramite240123Query.query';
import { Tramite240123Store } from '../../estados/tramite240123Store.store';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';

/**
 * @title Datos del Trámite Contenedora
 * @description Componente contenedor que se encarga de enlazar el estado del trámite con el componente de datos del trámite.
 * @summary Maneja la suscripción al estado y propaga los cambios a través del store.
 */
@Component({
  selector: 'app-datos-del-tramite-contenedora',
  standalone: true,
  imports: [CommonModule, DatosDelTramiteComponent, ModalComponent],
  templateUrl: './datos-del-tramite-contenedora.component.html',
  styleUrl: './datos-del-tramite-contenedora.component.scss',
})
export class DatosDelTramiteContenedoraComponent implements OnInit, OnDestroy {
    @ViewChild('modal', { static: false }) modalComponent!: ModalComponent;
   /**
     * @property esFormularioSoloLectura
     * @description Indica si el formulario es de solo lectura.
     * @type {boolean}
     */
    @Input()
    esFormularioSoloLectura: boolean = false;

  /**
   * @property
   * @name idProcedimiento
   * @type {number}
   * @description Identificador único del procedimiento actual. Este valor se utiliza para asociar el componente con un trámite específico en el sistema.
   */
  idProcedimiento = ID_PROCEDIMIENTO;

  /**
   * Observable para limpiar suscripciones activas al destruir el componente.
   * @property {Subject<void>} unsubscribe$
   */
  private unsubscribe$ = new Subject<void>();

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

  /**
   * @property
   * @name selectedColumns
   * @type {string[]}
   * @description Arreglo que contiene los encabezados de las columnas seleccionadas para la tabla de mercancías.
   * Este valor se utiliza para filtrar y mostrar únicamente las columnas especificadas en la tabla dinámica.
   */
  public selectedColumns: string[] = [
    'Fracción arancelaria',
    'Descripción de la fracción',
    'Unidad de medida de tarifa (UMT)',
    'Cantidad en UMT',
    'Valor comercial',
    'Tipo moneda'
  ];
  
  /**
   * @property
   * @name configuracionTablaFiltrada
   * @type {ConfiguracionColumna<MercanciaDetalle>[]}
   * @description Configuración filtrada de las columnas de la tabla de mercancías.
   * Este arreglo contiene únicamente las columnas seleccionadas para ser mostradas en la tabla dinámica.
   */
  public configuracionTablaFiltrada: ConfiguracionColumna<MercanciaDetalle>[] = [];

  /**
   * Constructor del componente.
   *
   * @method constructor
   * @param {Tramite240123Query} tramiteQuery - Query de Akita para obtener el estado actual del trámite.
   * @param {Tramite240123Store} tramiteStore - Store de Akita para actualizar el estado del trámite.
   * @returns {void}
   */
  constructor(
    private tramiteQuery: Tramite240123Query,
    private tramiteStore: Tramite240123Store,
    public activatedRoute: ActivatedRoute,
    private consultaQuery: ConsultaioQuery,
  ) {
     this.consultaQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.unsubscribe$),
      map((seccionState) => {
        this.esFormularioSoloLectura = seccionState.readonly;
      })
    )
    .subscribe();
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
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.datosMercanciaTabla = data;
      });

    this.tramiteQuery.getDatosDelTramite$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.datosDelTramiteFormState = data;
      });

    this.configuracionTablaFiltrada = MERCANCIA_ENCABEZADO_DE_TABLA.filter((col) => {
      return this.selectedColumns.includes(col.encabezado)
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
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
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