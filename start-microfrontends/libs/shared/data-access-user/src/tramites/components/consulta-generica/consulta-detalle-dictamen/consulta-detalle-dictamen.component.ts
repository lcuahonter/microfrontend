import { BodyTablaDictamenObservaciones, HeaderTablaDictamenObservacion } from '../../../../core/models/shared/consulta-generica.model';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

import { CONSULTA_DICTAMEN_OBSERVACIONES } from '../../../../core/enums/consulta-generica.enum';
import { CommonModule } from '@angular/common';
import { DictamenDetalleResponse } from '../../../../core/models/shared/dictamen-detalle-response.model';
import { formatFechaServicioToDDMMYYYY } from '@libs/shared/data-access-user/src/core/utils/utilerias';

@Component({
  selector: 'lib-detalle-dictamen',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './consulta-detalle-dictamen.component.html',
  styleUrl: './consulta-detalle-dictamen.component.scss',
})
export class ConsultaDetalleDictamenComponent implements OnInit, OnChanges, OnDestroy {

  /**
    * Recibe los datos del dictamen desde el componente padre 
  */
  @Input() dictamenDetalle!: DictamenDetalleResponse;

  /**
   * Formulario reactivo para dictamen.
   * @type {FormGroup}
  */
  public detalleForm!: FormGroup;

  /**
   * Subject utilizado para manejar la cancelación de suscripciones.
   * @type {Subject<void>}
  */
  public unsubscribe$ = new Subject<void>();

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  esFormularioSoloLectura: boolean = true;


  /**
   * Encabezado de la tabla de observaciones.
   * Contiene las columnas que se mostrarán en la tabla.
   * @type {HeaderTablaDictamenObservacion[]}
  */
  readonly encabezadoTablaObservaciones: HeaderTablaDictamenObservacion[] = CONSULTA_DICTAMEN_OBSERVACIONES.encabezadoDictamenObservaciones;

   /**
     * Datos de la tabla de observaciones.
     * Contiene los registros que se mostrarán en la tabla.
     * @type {BodyTablaDictamenObservaciones[]}
     */
    public datosTablaObservaciones: BodyTablaDictamenObservaciones[] = [];

  /** 
   * Evento que emite el ID de observacion seleccionado
   * @output {number} idObservacionSeleccionado - ID de la observacion seleccionado
  */
  @Output() idObservacionSeleccionado = new EventEmitter<number>();

  /**
  * @property {boolean} isFechasDetalleDictamenes
  * @description Indica si se deben mostrar las fechas en el detalle de los dictámenes.
  */
    @Input() isFechasDetalleDictamenes!: boolean;
  
  /**
    * Constructor para la consulta de opiniones.
    * @param fb FormBuilder para crear formularios reactivos.
  */
  constructor(
    private fb: FormBuilder
  ) {
     /** 
     * Formulario reactivo para detalle.
     */
    this.detalleForm = this.fb.group({
      estatus: ['', Validators.required],
      sentidoDictamen: ['', Validators.required],
      fechaCreacion: ['', Validators.required],
      tipoDictamen: ['', Validators.required],
      dictaminadoPor: ['', Validators.required],
      fechaGeneracion: ['', Validators.required],
      autorizadoPor: ['', Validators.required],
      fechaAutorizacion: ['', Validators.required],
      justificacionDictamen: ['', Validators.required],
      fechaInicioVigencia: [''],
      fechaFinVigencia: [''],
      fundamentoLegalDictamen: [''],
    });
  }
  
  ngOnInit(): void {
    this.inicializarEstadoFormulario(); 
  }

  /**
   * Ciclo de vida: ngOnChanges
   * Reacciona a cambios en las propiedades de entrada del componente.
   * @param changes Objeto que contiene los cambios en las propiedades (@Input)
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dictamenDetalle'] && changes['dictamenDetalle'].currentValue) {
        this.getDetalleDictamen();
      }
  }

  /**
   * Formatea una fecha en formato string reemplazando los guiones por barras.
   * @param fecha Fecha en formato string que se desea formatear.
   * @returns Fecha formateada con los guiones reemplazados por barras.
   */
  static formatoFecha(fecha: string): string {
    if (!fecha) {
      return '';
    }
    const FECHANORMALIZADA = fecha.replace(' ', 'T');
    const [FECHA, HORA] = FECHANORMALIZADA.split('T');
    const [ANIO, MES, DIA] = FECHA.split('-');

  if (HORA) {
    const [HORAS, MINUTOS] = HORA.split(':');
    return `${DIA}/${MES}/${ANIO} ${HORAS}:${MINUTOS}`;
  }

  return `${DIA}/${MES}/${ANIO}`;
  }

  /**
   * Método para obtener la información de la solicitud para detalle de dictamen.
   * @returns {void}
   */
  getDetalleDictamen(): void {
    /** 
     * Verifica si hay datos y actualiza el formulario.
     */
    if (this.dictamenDetalle !== null) {
      const SOLICITUDDATA = this.dictamenDetalle;

      this.detalleForm.patchValue({
        estatus: SOLICITUDDATA.estado_dictamen,
        sentidoDictamen: SOLICITUDDATA.sentido_dictamen,
        fechaCreacion: ConsultaDetalleDictamenComponent.formatoFecha(SOLICITUDDATA.fecha_creacion),
        tipoDictamen: SOLICITUDDATA.tipo_dictamen,
        dictaminadoPor: SOLICITUDDATA.dictaminado,
        fechaGeneracion: ConsultaDetalleDictamenComponent.formatoFecha(SOLICITUDDATA.fecha_emision),
        autorizadoPor: SOLICITUDDATA.autorizado,
        fechaAutorizacion: ConsultaDetalleDictamenComponent.formatoFecha(SOLICITUDDATA.fecha_autorizacion),
        justificacionDictamen: SOLICITUDDATA.justificacion,
        fechaInicioVigencia: formatFechaServicioToDDMMYYYY(SOLICITUDDATA.fecha_inicio_vigencia),
        fechaFinVigencia: formatFechaServicioToDDMMYYYY(SOLICITUDDATA.fecha_fin_vigencia),
        fundamentoLegalDictamen: SOLICITUDDATA.texto_dictamen
      });
      
      this.datosTablaObservaciones = (SOLICITUDDATA.observaciones || []).map((obs) => ({
        id: obs.id_observacion,
        fechaObservacion: obs.fecha_observacion,
        fechaAtencion: obs.fecha_atencion,
        generadaPor: `${obs.nombre} ${obs.apellido_paterno} ${obs.apellido_materno}`.trim(),
        estatusObservacion: obs.estado_observacion
      }));

    } 
  }

  /**
   * Evalúa si se debe inicializar o cargar datos.
  */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.detalleForm.disable();
    } 
  }

  /**
   * Abre la pestaña para mostrar el detalle del dictamen.
   * @param {number} id - Es el Id del dictamen.
   * @returns {void}
   */
  verDetalle(id: number): void {
    this.idObservacionSeleccionado.emit(id);
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