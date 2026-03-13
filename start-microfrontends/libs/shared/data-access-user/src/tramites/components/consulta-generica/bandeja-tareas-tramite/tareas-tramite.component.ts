import {
  BodyTablaTareasTramite,
  BodyTablaTareasTramiteByAtenderReq,
  HeaderTablaTareasTramite,
  HeaderTablaTareasTramiteByAtenderReq,
} from '../../../../core/models/shared/consulta-generica.model';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CONSULTA_TAREASTRAMITE } from '../../../../core/enums/consulta-generica.enum';
import { CommonModule } from '@angular/common';
import { FolioQuery } from '../../../../core/queries/folio.query';


import { TareasSolicitud } from '../../../../core/models/shared/consulta-tareas-response.model';
import { TareasTramiteService } from '../../../../core/services/consultagenerica/tareas-tramite-service';


@Component({
  selector: 'lib-tareas-tramite',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tareas-tramite.component.html',
  styleUrl: './tareas-tramite.component.scss',
})
export class TareasTramiteComponent implements OnInit, OnDestroy, OnChanges {

  /**
   * @property {boolean} isAtenderRequerimiento
   * @description Indica si se está atendiendo un requerimiento.
   */
  @Input() isAtenderRequerimiento: boolean = false;
  /**
   * Variable para almacenar el folio
   */
  public folio!: string;
  /**
   * Subject utilizado para manejar la cancelación de suscripciones.
   * @type {Subject<void>}
   */
  public unsubscribe$ = new Subject<void>();
  /**
   * Encabezado de la tabla de tareas de trámite.
   * Contiene las columnas que se mostrarán en la tabla.
   * @type {HeaderTablaTareasTramite[]}
   */
  readonly encabezadoTablaTareasTramite: HeaderTablaTareasTramite[] =
    CONSULTA_TAREASTRAMITE.encabezadoTablaTareasTramite;

  readonly encabezadoTablaTareasTramiteByAtenderReq: HeaderTablaTareasTramiteByAtenderReq[] =
    CONSULTA_TAREASTRAMITE.encabezadoTablaTareasTramiteByAtenderReq;

  /**
   * Datos de la tabla de tareas de trámite.
   * Contiene los registros que se mostrarán en la tabla.
   * @type {BodyTablaTareasTramite[]}
   */
  datosTablaTareasTramite: BodyTablaTareasTramite[] = [];

  /**
   * Datos de la tabla de tareas de trámite al atender requerimiento.
   */
  datosTablaTareasTramiteByAtenderReq: BodyTablaTareasTramiteByAtenderReq[] = [];

  /**
   * @property {TareasSolicitud[]} tareasSolicitud
   * @description Tareas de solicitud.
  */
  @Input() tareasSolicitud: TareasSolicitud[] = [];

  /**
   * Constructor para la bandeja de tareas de trámite.
   * @param folioQuery Consulta del folio desde el store.
   * @param tareasTramiteService Servicio para obtener las tareas de trámite.
   */
  constructor(
    private folioQuery: FolioQuery,
    private tareasTramiteService: TareasTramiteService
  ) {}
  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Recupera el folio desde el store y obtiene las tareas de trámite.
   */
  ngOnInit(): void {
    /**
     * Recuperar el folio desde el store
     */
    this.folioQuery
      .getFolio()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((folio) => {
        this.folio = folio || '';
      });
  }

   ngOnChanges(changes: SimpleChanges): void {
    if (changes['tareasSolicitud'] && changes['tareasSolicitud'].currentValue?.length > 0) {
      this.getTareas();
    }
  }

  /**
   * Método para obtener los requerimientos desde el servicio.
   * unsubscribe$ - Subject para manejar la cancelación de suscripciones.
   * suscribe - Se suscribe al observable del servicio para obtener los datos.
   */
  getTareas(): void {
    if(!this.isAtenderRequerimiento){
      this.datosTablaTareasTramite = this.tareasSolicitud
        .map((doc => ({
          id: doc.id_bitacora,
          nombreTarea: doc.tarea,
          nombreUsuarioAsignado: doc.nombre_usuario,
          claveUsuarioAsignado: doc.id_usuario,
          fechaAsignacion: doc.fecha_evento_inicio,
          fechaAtencion: doc.fecha_evento_fin
        })));
    }else{
       this.datosTablaTareasTramiteByAtenderReq = this.tareasSolicitud
        .map((doc => ({
          id: doc.id_bitacora,
          nombreTarea: doc.tarea,
          fechaAsignacion: doc.fecha_evento_inicio,
          fechaAtencion: doc.fecha_evento_fin
        })));
    }
  }
  /**
   * Método `ngOnDestroy()`.
   * Este método se ejecuta cuando el componente se destruye y realiza las siguientes acciones:
   * - Desuscribe la suscripción a los cambios en el formulario reactivo.
   *
   * @memberof DetalleOpinionComponent
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}