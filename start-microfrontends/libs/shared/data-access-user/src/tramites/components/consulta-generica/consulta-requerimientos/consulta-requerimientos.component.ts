import {
  BodyTablaRequerimiento,
  HeaderTablaRequerimientos,
} from '../../../../core/models/shared/consulta-generica.model';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subject} from 'rxjs';

import { CONSULTA_REQUERIMIENTOS } from '../../../../core/enums/consulta-generica.enum';
import { CommonModule } from '@angular/common';
import { FolioQuery } from '../../../../core/queries/folio.query';
import { RequerimientosResponse } from "../../../../core/models/shared/requerimientos-response.model";
import { RequerimientosService } from '../../../../core/services/consultagenerica/requerimiento-service';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-consultarequerimientos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './consulta-requerimientos.component.html',
  styleUrl: './consulta-requerimientos.component.scss',
})
export class ConsultarequerimientosComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * Variable para almacenar el folio recuperado desde el store.
   * @type {string}
   */
  public folio!: string;

  /**
   * Subject utilizado para manejar la cancelación de suscripciones.
   * @type {Subject<void>}
   */
  public unsubscribe$ = new Subject<void>();

  /**
   * Encabezado de la tabla de requerimientos.
   * Contiene las columnas que se mostrarán en la tabla.
   * @type {HeaderTablaRequerimientos[]}
   */
  readonly encabezadoTablaRequerimiento: HeaderTablaRequerimientos[] = CONSULTA_REQUERIMIENTOS.encabezadoTablaRequerimiento;

  /**
   * Datos de la tabla de requerimientos.
   * Contiene los registros que se mostrarán en la tabla.
   * @type {BodyTablaRequerimiento[]}
   */
  public datosTablaRequerimientos: BodyTablaRequerimiento[] = [];

  /**
    * @property {RequerimientosResponse[]} requerimientos
    * @description Requerimientos de solicitud.
  */
  @Input() requerimientos: RequerimientosResponse[] = [];

  /** 
    * Evento que emite el ID del requerimiento seleccionado
    * @output {number} idRequerimientoSeleccionado - ID del requerimiento seleccionado
  */
  @Output() idRequerimientoSeleccionado = new EventEmitter<number>();

  /**
   * Constructor de la clase ConsultarequerimientosComponent.
   * @param router Router para navegar a la vista de detalle de requerimiento.
   * @param folioQuery Consulta del folio desde el store.
   * @param requerimientoService Servicio para obtener los requerimientos.
   */
  constructor(
    private router: Router,
    private folioQuery: FolioQuery,
    private requerimientoService: RequerimientosService
  ) {}

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Recupera el folio desde el store y obtiene los requerimientos desde el servicio.
   */
  ngOnInit(): void {
    /** 
     * Recuperar el folio desde el store.
     */
    this.folioQuery.getFolio().subscribe((folio) => {
      this.folio = folio || '';
    });
  }

  /**
    * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
    * Se suscribe al observable del servicio para obtener los datos.
    * @returns {void}
  */
   ngOnChanges(changes: SimpleChanges): void {
     if (changes['requerimientos'] && changes['requerimientos'].currentValue?.length > 0) {
       this.getRequerimientos();
     }
   }

  /**
   * Abre una nueva pestaña con los detalles del requerimiento.
   * @param {number} id - El id del requerimiento para visualizar el detalle.
   * @returns {void}
   */
   verDetalleRequerimiento(id: number): void {
    this.idRequerimientoSeleccionado.emit(id);
  }

  /**
   * Método para obtener los requerimientos desde el servicio.
   * Se suscribe al observable del servicio para obtener los datos.
   * @returns {void}
   */
  getRequerimientos(): void {
    this.datosTablaRequerimientos = this.requerimientos.map((req) => ({
      id: req.id_requeriminento,
      fechaCreacion: req.fecha_creacion,
      fechaGeneracion: req.fecha_emision,
      fechaAtencion: req.fecha_atencion,
      estatus: req.estado_requerimiento ?? '', 
      urlPdf: '' 
    }));
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente se destruye.
   * Cancela todas las suscripciones activas para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
