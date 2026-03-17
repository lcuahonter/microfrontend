import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { DetalleRequerimiento, DocumentosEspecificosResponse, RequerimientoDetalleResponse } from '../../../../core/models/shared/requerimiento-detalle-response.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observacion } from '../../../../../src/core/models/shared/Iniciar-requerimiento-response.model';
import { Subject } from 'rxjs';

import { manejarPdf } from '../../../../../src/core/utils/utilerias';

import { TablaAcciones } from '../../../../../src/core/enums/tabla-seleccion.enum';

import { TablaDinamicaComponent } from '../../tabla-dinamica/tabla-dinamica.component';

import { DocumentosTabsService } from '../../../../../src/core/services/shared/documentosTabs.service';


@Component({
  selector: 'lib-consulta-detalle-requerimiento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,TablaDinamicaComponent],
  templateUrl: './consulta-detalle-requerimiento.component.html',
  styleUrl: './consulta-detalle-requerimiento.component.scss',
})
export class ConsultaDetalleRequerimientoComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * Formulario reactivo para requerimiento.
   * @type {FormGroup}
  */
  public detalleForm!: FormGroup;

  /**
    * Recibe los datos del requerimiento desde el componente padre 
  */
  @Input() requerimientoDetalle!: RequerimientoDetalleResponse;
  /** 
   * Evento que emite el ID de observacion seleccionado
   * @output {string} observacionEvent - ID de la observacion seleccionado
  */
  @Output() observacionEvent = new EventEmitter<string>();
  /**
   * Subject utilizado para manejar la cancelación de suscripciones.
   * @type {Subject<void>}
  */
  public unsubscribe$ = new Subject<void>();
    /**
     * Encabezado de la tabla de observaciones.
     * Contiene las columnas que se mostrarán en la tabla.
     * @type {HeaderTablaDictamenObservacion[]}
    */

  /**
   * @description Variable que almacena las observaciones del dictamen
   */
  public observaciones: Observacion[] = [];
  
    /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  esFormularioSoloLectura: boolean = true;

  accionesDetalle:TablaAcciones[] = [TablaAcciones.VER];


  /**
    * Encabezado de tabla para agregar documentos
    */
  encabezadoDeTablaDocumentos = [
    { encabezado: 'Tipo de documento', clave: (item: DocumentosEspecificosResponse): string => item.tipo_documento ?? '', orden: 1 },
    { encabezado: 'Nombre del archivo', clave: (item: DocumentosEspecificosResponse): string => item.nombre ?? '', orden: 2 },
  ]
  /**
   * Identificadores de tipos de trámite que requieren atención especial en campos.
   * @type {number[]}
   */
  private detalleRequerimientoCampos: Record<number, DetalleRequerimiento> = {
    130107: { atencionRequerimiento: true, detalleTableRequerimiento: true },
    130113: { atencionRequerimiento: true, detalleTableRequerimiento: true },
    130109: { atencionRequerimiento: true, detalleTableRequerimiento: true }
  };

  /** 
   * 
   */
  @Input() tramite!: number;

  /**
 * Lista de documentos
 */
  public listadoDocumentos: DocumentosEspecificosResponse[] = [];

  /**
   * Configuración de detalle de requerimiento
   */
  config!:DetalleRequerimiento;

  /**
    * Constructor para la consulta de requerimientos.
    * @param fb FormBuilder para crear formularios reactivos.
  */
  constructor(
    private fb: FormBuilder,
     private documentosTabsService: DocumentosTabsService
  ) {
    /** 
    * Formulario reactivo para detalle.
    */
    this.detalleForm = this.fb.group({
      estatus: ['', Validators.required],
      fechaCreacion: ['', Validators.required],
      dictaminadoPor: ['', Validators.required],
      fechaGeneracion: ['', Validators.required],
      verificadoPor: ['', Validators.required],
      fechaverificación: ['', Validators.required],
      autorizadoPor: ['', Validators.required],
      fechaAutorizacion: ['', Validators.required],
      fechaAtencion: ['', Validators.required],
      justificacionRequerimiento: ['', Validators.required],
      atencionRequerimiento: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.inicializarEstadoFormulario();
    this.config = this.getDetalleRequerimientoCampos(this.tramite);
  }

   /**
   * Obtiene la configuración de atención de requerimientos por campo para un trámite.
   * @param tramiteId tramite Identificador del trámite
   * @returns 
   */
  getDetalleRequerimientoCampos(tramiteId: number): DetalleRequerimiento {
    return this.detalleRequerimientoCampos[tramiteId] ?? {
      atencionRequerimiento: false,
      detalleTableRequerimiento: false
    };
  }

  /**
  * Ciclo de vida: ngOnChanges
  * Reacciona a cambios en las propiedades de entrada del componente.
  * @param changes Objeto que contiene los cambios en las propiedades (@Input)
  */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['requerimientoDetalle'] && changes['requerimientoDetalle'].currentValue) {
      this.getDetalleRequerimiento();
      this.observaciones = this.requerimientoDetalle?.observaciones ?? []; 
      this.listadoDocumentos =
        (this.requerimientoDetalle?.documentos_especificos ?? []).map((doc, index) => ({
          ...doc,
          id: `${doc.id_tipo_documento}-${index}`
        }));
    }
    if(changes['tramite'] && changes['tramite'].currentValue){
      this.config = this.getDetalleRequerimientoCampos(this.tramite);
    }
  }

  /**
   * Método para obtener la información de la solicitud para detalle de requerimiento.
   * @returns {void}
   */
  getDetalleRequerimiento(): void {
    /** 
     * Verifica si hay datos y actualiza el formulario.
     */
    if (this.requerimientoDetalle !== null) {
      const SOLICITUDDATA = this.requerimientoDetalle;

      this.detalleForm.patchValue({
        estatus: SOLICITUDDATA.estado_requerimiento,
        fechaCreacion: SOLICITUDDATA.fecha_creacion,
        dictaminadoPor: SOLICITUDDATA.dictaminador,
        fechaGeneracion: SOLICITUDDATA.fecha_emision,
        verificadoPor: SOLICITUDDATA.verificador,
        fechaverificación: SOLICITUDDATA.fecha_verificacion,
        autorizadoPor: SOLICITUDDATA.autorizador,
        fechaAutorizacion: SOLICITUDDATA.fecha_autorizacion,
        fechaAtencion: SOLICITUDDATA.fecha_atencion,
        justificacionRequerimiento: SOLICITUDDATA.justificacion,
        atencionRequerimiento: SOLICITUDDATA.desc_atencion_requerimiento
      });

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

  detalleAlternarValor(event: { row: DocumentosEspecificosResponse; column: string }): void {
     if (event.row) {
      const OBSERVACION = event.row.nombre;
      this.observacionEvent.emit(OBSERVACION);
    }
  }

    /**
* Abre el detalle de un acuse en una nueva pestaña.
* @param {string} url - La URL (UUID) del archivo PDF del acuse.
* @returns {void}
* @example
* // Abre el detalle de acuse
* verDetalleAcuse('a1b2c3d4-e5f6-7890-abcd-ef1234567890');
*/
  verDetalleAcuse(url: string, nombre: string): void {
    this.base64Archivos(url, 'abrir', nombre);
  }


    /**
* Obtiene el contenido base64 de un archivo y realiza la acción especificada.
* @param {string} uuid - Identificador único del archivo a obtener.
* @param {'abrir' | 'descargar'} accion - Acción a realizar con el archivo.
* @returns {void}
* @example
* // Abre el archivo en una nueva pestaña
* base64Archivos('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'abrir');
* 
* // Descarga el archivo
* base64Archivos('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'descargar');
*/
  base64Archivos(uuid: string, accion: 'abrir' | 'descargar', nombre: string): void {
    this.documentosTabsService.getDescargarDoc(uuid).subscribe({
      next: (data) => {
        if (data?.codigo === "UPSER00" && data?.datos?.content) {
          manejarPdf(
            data.datos.content,
            nombre,
            accion
          );
        }
      },
    });
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
