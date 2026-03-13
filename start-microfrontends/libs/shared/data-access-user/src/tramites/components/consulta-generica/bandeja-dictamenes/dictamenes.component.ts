import { BodyTablaDictamenes, HeaderTablaDictamenes } from '../../../../core/models/shared/consulta-generica.model';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CONSULTA_DICTAMENES } from '../../../../core/enums/consulta-generica.enum';
import { CommonModule } from '@angular/common';
import { DictamenesResponse } from "../../../../core/models/shared/dictamenes-response.model";
import { DictamenesService } from '../../../../core/services/consultagenerica/dictamenes-service';
import { FolioQuery } from '../../../../core/queries/folio.query';

@Component({
  selector: 'lib-dictamenes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dictamenes.component.html',
  styleUrl: './dictamenes.component.scss',
})
export class DictamenesComponent implements OnInit, OnDestroy, OnChanges{
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
   * Datos de la tabla de dictámenes.
   * Contiene los registros que se mostrarán en la tabla.
   * @type {BodyTablaDictamenes[]}
   */
  datosTablaDictamen: BodyTablaDictamenes[] = [];

  /**
    * @property {DictamenesResponse[]} dictamenes
    * @description Dictamenes de solicitud.
  */
  @Input() dictamenes: DictamenesResponse[] = [];

  /** 
    * Evento que emite el ID del dictamen seleccionado
    * @output {number} idDictamenSeleccionado - ID del dictamen seleccionado
  */
  @Output() idDictamenSeleccionado = new EventEmitter<number>();

  /**
   * Identificador del trámite asociado a los dictámenes.
   * @type {number}
   */
  @Input() tramite!: number;

  /**
   * Constructor de la clase DictamenesComponent.
   * @param folioQuery Consulta del folio desde el store.
   * @param dictamenService Servicio para obtener los dictámenes.
   */
  constructor(private folioQuery: FolioQuery, private dictamenService: DictamenesService) {}

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Recupera el folio desde el store y obtiene los dictámenes.
   */
  ngOnInit(): void {
   /**
   * Recuperar el folio desde el store y asignarlo a la variable folio.
   */
    this.folioQuery.getFolio().pipe(takeUntil(this.unsubscribe$)).subscribe((folio) => {
      this.folio = folio || '';
    });
  }

  /**
    * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
    * Se suscribe al observable del servicio para obtener los datos.
    * @returns {void}
  */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dictamenes'] && changes['dictamenes'].currentValue?.length > 0) {
      this.getDictamenes();
    }
  }

  /**
   * Método para obtener los dictámenes desde el servicio.
   * Se suscribe al observable del servicio para obtener los datos.
   */
  getDictamenes(): void {
    this.datosTablaDictamen = this.dictamenes.map((dictamen) => ({
      id: dictamen.id_dictamen,
      fechaCreacion: dictamen.fecha_creacion,
      fechaGeneracion: dictamen.fecha_emision ?? '', 
      fechaAutorizacion: dictamen.fecha_autorizacion ?? '',
      tipo: dictamen.tipo,
      estatus: dictamen.estado_dictamen,
      sentido: dictamen.sentido_dictamen,
      urlPdf: ''
    }));
  }

  /**
   * Abre la pestaña para mostrar el detalle del dictamen.
   * @param {number} id - Es el Id del dictamen.
   * @returns {void}
   */
  verDetalle(id: number): void {
    this.idDictamenSeleccionado.emit(id);
  }

  /**
   * Obtiene el encabezado de la tabla de dictámenes.
   * @returns {HeaderTablaDictamenes[]} Encabezado de la tabla de dictámenes.
   */
  get encabezadoTablaDictamen(): HeaderTablaDictamenes[] {
    if (this.tramite.toString().startsWith('130')) {
      return CONSULTA_DICTAMENES.encabezadoTablaDictamen.filter(columna => columna.key !== 'id');
    }
    return CONSULTA_DICTAMENES.encabezadoTablaDictamen;
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