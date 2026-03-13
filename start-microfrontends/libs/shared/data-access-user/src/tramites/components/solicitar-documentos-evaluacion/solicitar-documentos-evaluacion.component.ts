import { Catalogo, CatalogoTipoDocumento } from '../../../core/models/shared/catalogos.model';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SolicitudDocumentosState, SolicitudDocumentosStore } from '../../../core/estados/solicitud-documentos.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CONFIGURACION_ENCABEZADO_DOCUMENTOS } from '../../../core/enums/solicitud-documentos.enum';
import { CommonModule } from '@angular/common';

import { Notificacion, NotificacionesComponent } from '../notificaciones/notificaciones.component';
import { SolicitudDocumentosQuery } from '../../../core/queries/solicitud-documentos.query';
import { TablaDinamicaComponent } from '../tabla-dinamica/tabla-dinamica.component';
import { TablaSeleccion } from '../../../core/enums/tabla-seleccion.enum';

import { Documentos, IniciarRequerimientoResponse } from '../../../core/models/shared/Iniciar-requerimiento-response.model';
import { DocumentosEspecificosResponse } from '../../../core/models/shared/documentos-especificos.model';
import { DocumentosTabsService } from '../../../core/services/shared/documentosTabs.service';
import { manejarPdf } from '../../../core/utils/utilerias';

@Component({
  selector: 'app-solicitar-documentos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TablaDinamicaComponent, NotificacionesComponent],
  templateUrl: './solicitar-documentos-evaluacion.component.html',
  styleUrl: './solicitar-documentos-evaluacion.component.scss',
})
export class SolicitarDocumentosEvaluacionComponent implements OnInit, OnChanges, OnDestroy {

  /**
   * Indica si el componente está en modo evaluación.
   * Si es true, se habilitan las funcionalidades de evaluación.
   */
  @Input() isEvaluar: boolean = true;

  @Input() enableMode: boolean = true;

  /**
  * Declaración de variable para el formulario
  */
  formSolicitudDocumentos!: FormGroup;
  /**
   * Catálogo documento requerido
   */
  catTipoDocumento: Catalogo[] = [];

  /**
   * Lista de documentos
   */
  public listadoDocumentos: CatalogoTipoDocumento[] = [];
  /**
   * Lista de documentos agregados a la tabla
   */
  public documentosSeleccionados: CatalogoTipoDocumento[] = [];

  /** Lista de documentos específicos generados para el requerimiento */
   @Input() documentosEspecificos : DocumentosEspecificosResponse [] = [];

  /** Lista de documentos guardados previamente en el requerimiento */
   @Input () documentosIniciales : CatalogoTipoDocumento [] = [];

  /** Datos de respuesta de la inicialización del requerimiento */
  @Input() iniciarResponse!: IniciarRequerimientoResponse;

  /** Evento que notifica cuando los documentos han sido actualizados */
  @Output() documentosActualizados = new EventEmitter<{ id: number }[]>();

  /** Evento que emite los documentos requeridos */
  @Output() documentosRequeridosActualizados = new EventEmitter<Documentos[]>();

  /**
 * Variable para identificar el Id del tipo de documento
 */
  tipoDocumentoId!: number;
  /**
 * Variable para enviar el nombre del campo 
 */
  valor!: string;

  /** Indica si se debe mostrar la segunda tabla */
  @Input() isSegundaTabla? : boolean = true;

  /**
   * Notificador para destruir las suscripciones.
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
     * Estado de la documentación.
     */
  public solicitudDocumentosState!: SolicitudDocumentosState;
  /**
   * Selecciona el tipo de documento que obtiene del catálogo documentos
   */
  selectedOption: Catalogo | undefined;
  /**
   * Obtiene el nombre de la opcion seleccionada del documento
   */
  description: string | undefined;

  /** Notificación a mostrar al usuario */
  public nuevaNotificacion!: Notificacion;

  /** Enum para la selección en la tabla */
  tablaSeleccion = TablaSeleccion;

  /** Mensaje de validacion se documentos */
  @Input() validacion? : boolean = false;

  @Input() tramite: number = 0;

  @Input() idSolicitud:string = '' ;

  @Input() triggerGuardar: boolean = false;

  /**
   * Encabezado de tabla para agregar documentos
   */
  encabezadoDeTablaDocumentos = CONFIGURACION_ENCABEZADO_DOCUMENTOS;
  
  constructor(private fb: FormBuilder,
    private documentosStates: SolicitudDocumentosStore,
    private solicitudRequerimientoQuery: SolicitudDocumentosQuery,
    private documentosTabsService: DocumentosTabsService
  ) {
    // do nothing.
  }
  /**
   * Método que se ejecuta al inicializar el componente.
   */
  ngOnInit(): void {
    this.solicitudRequerimientoQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudDocumentosState = seccionState;
          this.listadoDocumentos = this.solicitudDocumentosState.listaDocumentos;
          this.documentosTabsService.documentosTabValida = this.isSolicitarTablaValid();
        })
      )
      .subscribe();
    this.crearFormDocumentos();
    this.obtenerDocumentosEspecificos();
  }

  obtenerDocumentosEspecificos(): void {
    if (this.tramite !== 0) {
      this.documentosTabsService.getDocumentosEspecificos(this.tramite?.toString(), this.idSolicitud?.toString())
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (response) => {
          if (response && response.datos && this.documentosEspecificos.length === 0) {
            this.documentosEspecificos = Array.isArray(response.datos) ? response.datos : [response.datos];
          }
        },
      });
    }
  }

  /** Método que se ejecuta cuando hay cambios en las propiedades de entrada del componente.
   * @param changes - Objeto que contiene los cambios en las propiedades de entrada.
   */
   ngOnChanges(changes: SimpleChanges): void {
    if (changes['documentosIniciales'] && this.documentosIniciales?.length > 0) {
      this.listadoDocumentos = [...this.documentosIniciales];
      this.documentosActualizados.emit(this.listadoDocumentos);
    } else if (changes['iniciarResponse'] && changes['iniciarResponse'].currentValue.documentos_especificos?.length > 0) {
      const TIPO_DOCUMENTOS = changes['iniciarResponse'].currentValue.documentos_especificos.map((doc: Documentos) => ({
        id: doc.id_tipo_documento,
        description: doc.tipo_documento || '',
      }));
      this.documentosStates.setSolicitudDocumentos(TIPO_DOCUMENTOS);
      this.documentosActualizados.emit(TIPO_DOCUMENTOS);
    }
  }

  /**
   * Método para crear el formulario para la solicitud de documentos
   */
  crearFormDocumentos(): void {
    this.formSolicitudDocumentos = this.fb.group({
      tipoDocumento: ['', [Validators.required]],
    });
    this.documentosSeleccionados = this.solicitudDocumentosState.listaDocumentos;
  }

/**
  * Metodo para agregar documento seleccionado a la tabla 
*/
 agregarDocumento(): void {
  if (this.formSolicitudDocumentos.invalid) {
    this.formSolicitudDocumentos.markAllAsTouched();
    this.nuevaNotificacion = {
       tipoNotificacion: 'alert',
       categoria: 'error',
       modo: 'action',        
       titulo: 'Error',
        mensaje: 'Debe seleccionar al menos una opción.',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    return;    
  }
   this.tipoDocumentoId = this.formSolicitudDocumentos.get('tipoDocumento')?.value;
   if (!this.tipoDocumentoId || isNaN(this.tipoDocumentoId)) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'error',
        modo: 'action',
       titulo: 'Error',
       mensaje: 'Debe seleccionar al menos una opciÃ³n.',
       cerrar: true,
               txtBtnAceptar: 'Aceptar',
       txtBtnCancelar: '',
     };
     return;
   }
   const TIPO_DOCUMENTO_OBJ = this.documentosEspecificos.find(dep => dep.id_tipo_documento === Number(this.tipoDocumentoId));
   const NUEVA_TABLA_LISTA_DOCUMENTOS = [...this.listadoDocumentos]
   NUEVA_TABLA_LISTA_DOCUMENTOS.push({
     id: this.tipoDocumentoId,      
     description: TIPO_DOCUMENTO_OBJ?.documento || '',
   })    
   if (this.listadoDocumentos.length === 0) {
     this.listadoDocumentos = [];    
    }
   this.listadoDocumentos = NUEVA_TABLA_LISTA_DOCUMENTOS;
    this.documentosStates.setSolicitudDocumentos(this.listadoDocumentos);
    this.documentosActualizados.emit(this.listadoDocumentos);
    this.limpiarFormulario();

}

  limpiarFormulario(): void {
    this.formSolicitudDocumentos.reset({
      tipoDocumento: ''
    });
  }

  /**
   * Método para eliminar el documento de la tabla 
   */
  eliminarDocumento(): void {
     if (this.documentosSeleccionados.length === 0) {
     this.nuevaNotificacion = {
              tipoNotificacion: 'alert',
        categoria: 'warning',
       modo: 'action',
       titulo: 'Advertencia',
              mensaje: 'No hay documentos para eliminar.',
       cerrar: true,
       txtBtnAceptar: 'Aceptar',
       txtBtnCancelar: '',
     };
           return;
   }
    const IDS_TO_DELETE = this.documentosSeleccionados.map(documento => documento.id);
   this.listadoDocumentos = this.listadoDocumentos.filter(documento => !IDS_TO_DELETE.includes(documento.id));
    this.documentosStates.setSolicitudDocumentos(this.listadoDocumentos);
    this.documentosSeleccionados = [];

    this.documentosActualizados.emit(this.listadoDocumentos);
  }

  /**
   * Establece los valores en el store de tramite5701.
   *
   * @param {FormGroup} form - El formulario del cual se obtiene el valor.
   * @param {string} campo - El nombre del campo del formulario cuyo valor se va a obtener.
   * @param {string} metodoNombre - El nombre del método en el store que se va a invocar con el valor del campo.
   * @returns {void}
   */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof SolicitudDocumentosStore): void {
    this.valor = form.get(campo)?.value;
    (this.documentosStates[metodoNombre] as (value: string) => void)(this.valor);
  }

  /** Método que se ejecuta cuando cambia el estado del checkbox de requerido.
   * @param documento - El documento cuyo estado de requerido ha cambiado.
   * @param event - El evento del cambio del checkbox.
   */
  onRequeridoChange(documento: Documentos, event: Event): void {
    const TARGET = event.target as HTMLInputElement;
    documento.requerido = TARGET.checked;
    this.emitirDocumentosRequeridos();
  }

  /** Emite la lista de documentos requeridos actualizados. */
  emitirDocumentosRequeridos(): void {
    const DOCUMENTOSMARCADOS = this.iniciarResponse.documentos
      .filter(doc => doc.requerido === true);

    this.documentosRequeridosActualizados.emit(DOCUMENTOSMARCADOS);
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
   * Valida si no hay documentos requeridos y la tabla de documentos está vacía.
   */
  public get validarTablaLength(): boolean {
    return (
      this.iniciarResponse?.documentos?.every(doc => doc.requerido === false) &&
      (this.listadoDocumentos?.length === 0));
  }

  /**
   * Valida si no hay documentos requeridos y la tabla de documentos está vacía.
   */
  public isSolicitarTablaValid(): boolean {
    return (
      ((this.iniciarResponse?.documentos?.length > 0 ? this.iniciarResponse?.documentos?.some(doc => doc.requerido === true) : false) ||
      (this.listadoDocumentos?.length !== 0))
    );
  }


  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

}
