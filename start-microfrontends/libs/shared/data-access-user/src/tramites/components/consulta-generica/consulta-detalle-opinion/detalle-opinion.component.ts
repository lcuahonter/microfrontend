import { BodyTablaOpinion, HeaderTablaOpinion, OpinionDetalleOpinion } from '../../../../core/models/shared/consulta-generica.model';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CONSULTA_DETALLEOPINIONES } from '../../../../core/enums/consulta-generica.enum';
import { CommonModule } from '@angular/common';
import { DetallesOpinionService } from '../../../../core/services/consultagenerica/detalles-opinion-service';
import { FolioQuery } from '../../../../core/queries/folio.query';
import { OpinionDetalleResponse } from '../../../../core/models/shared/opinion-detalle-response.model';

@Component({
  selector: 'lib-detalle-opinion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './detalle-opinion.component.html',
  styleUrl: './detalle-opinion.component.scss',
})
export class DetalleOpinionComponent implements OnInit, OnChanges, OnDestroy {

  /** Recibe los datos de la opinión desde el componente padre */
  @Input() solicitud!: OpinionDetalleResponse;

  @Input() tramiteId!: number;

  /**
   * Variable para almacenar el folio.
   * @type {string}
   */
  public folio!: string;

  /**
   * Variable para almacenar el Id de la opinión.
   * @type {number}
   */
  public id!: number;

  /**
   * Formulario reactivo para la solicitud de opinión.
   * @type {FormGroup}
   */
  public solicitudForm!: FormGroup;

  /**
   * Formulario reactivo para la opinión.
   * @type {FormGroup}
   */
  public opinionForm!: FormGroup;

  public opinion130Form!: FormGroup;

  /**
   * Variable para almacenar los datos de la opinión.
   * @type {OpinionDetalleOpinion | null}
   */
  public opinion!: OpinionDetalleOpinion | null;

  /**
   * Subject utilizado para manejar la cancelación de suscripciones.
   * @type {Subject<void>}
   */
  public unsubscribe$ = new Subject<void>();

  /**
   * Encabezado de la tabla de opiniones.
   * Contiene las columnas que se mostrarán en la tabla.
   * @type {HeaderTablaOpinion[]}
   */
  readonly encabezadoTablaOpiones: HeaderTablaOpinion[] = CONSULTA_DETALLEOPINIONES.encabezadoTablaOpinion;

  /**
   * Datos de la tabla de opiniones.
   * Contiene los registros que se mostrarán en la tabla.
   * @type {BodyTablaOpinion[]}
   */
  public datosTablaOpiniones: BodyTablaOpinion[] = [];

  /**
   * Método para descargar el PDF de la opinión.
   */
  public descargarPdfOpinion = DetalleOpinionComponent.descargarPdfOpinion;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  esFormularioSoloLectura: boolean = true;

  /**
   * Constructor para la consulta de opiniones.
   * @param fb FormBuilder para crear formularios reactivos.
   * @param route ActivatedRoute para acceder a los parámetros de la ruta.
   * @param detallesService Servicio para obtener datos de la solicitud y opinión.
   * @param folioQuery Consulta del folio desde el store.
   */
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private detallesService: DetallesOpinionService,
    private folioQuery: FolioQuery
  ) {
    /** 
     * Formulario reactivo para la solicitud de opinión.
     */
    this.solicitudForm = this.fb.group({
      areaSolicitante: ['', Validators.required],
      estatus: ['', Validators.required],
      fechaCreacion: ['', Validators.required],
      fechaSolicitud: ['', Validators.required],
      justificacionOpinion: ['', Validators.required],
    });

    /** 
     * Formulario reactivo para la opinión.
     */
    this.opinionForm = this.fb.group({
      areaResponsable: ['', Validators.required],
      sentido: ['', Validators.required],
      generadoPor: ['', Validators.required],
      fechaGeneracion: ['', Validators.required],
      opinion: ['', Validators.required],
    });

    this.opinion130Form = this.fb.group({
      dependencia: ['', Validators.required], 
      sentido: ['', Validators.required],
      opinion: ['', Validators.required],
      fechaAtencion: ['', Validators.required],
    })
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Configura los formularios reactivos, recupera el folio y los datos de la solicitud y opinión.
   */
  ngOnInit(): void {
    /** 
     * Obtener el parámetro 'id' de la URL.
     */
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    /** 
     * Recuperar el folio desde el store.
     */
    this.folioQuery
      .getFolio()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((folio) => {
        this.folio = folio || '';
      });
    this.inicializarEstadoFormulario();    
  }

  /**
   * Ciclo de vida: ngOnChanges
   * Reacciona a cambios en las propiedades de entrada del componente.
   * @param changes Objeto que contiene los cambios en las propiedades (@Input)
 */
  ngOnChanges(changes: SimpleChanges): void {
      if (changes['solicitud'] && changes['solicitud'].currentValue) {
        this.getSolicitud();
      }
  }

   /**
   * Evalúa si se debe inicializar o cargar datos.
   * Además, obtiene la información del catálogo de mercancía.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.solicitudForm.disable();
      this.opinionForm.disable();
      this.opinion130Form.disable();
    } 
  }

  /**
   * Método para obtener la información de la solicitud para la opinión.
   * @returns {void}
   */
  getSolicitud(): void {
    /** 
     * Verifica si hay datos y actualiza el formulario.
     */
    if (this.solicitud !== null) {
      const SOLICITUDDATA = this.solicitud;
      this.solicitudForm.patchValue({
        areaSolicitante: SOLICITUDDATA.area_solicitante,
        estatus: SOLICITUDDATA.estado_opinion,
        fechaCreacion: SOLICITUDDATA.fecha_generacion,
        fechaSolicitud: SOLICITUDDATA.fecha_solicitud,
        justificacionOpinion: SOLICITUDDATA.justificacion,
       });

      this.opinion130Form.patchValue({
        dependencia: SOLICITUDDATA.dependencia || '',
        sentido: SOLICITUDDATA.sentido_opinion,
        opinion: SOLICITUDDATA.descripcion_opinion,
        fechaAtencion: SOLICITUDDATA.fecha_atencion
      });

      this.opinionForm.patchValue({
        areaResponsable: SOLICITUDDATA.area_responsable,
        sentido: SOLICITUDDATA.sentido_opinion,
        generadoPor: SOLICITUDDATA.emisor_opinion,
        fechaGeneracion: SOLICITUDDATA.fecha_generacion,
        opinion: SOLICITUDDATA.descripcion_opinion,
      });

      this.datosTablaOpiniones = (SOLICITUDDATA.documento_opinion || []).map((doc, index) => ({
        id: index,
        documento:'',
        descripcion_solicitante: doc.descripcion_solicitante,
        nombre_archivo: doc.nombre_archivo,
        urlPdf: doc.e_document ?? ''
      }));
    }
  }

  /**
   * Método para obtener la información de la opinión de la solicitud.
   * @returns {void}
   */
  getOpinion(): void {
    this.detallesService
      .getOpinionDetalleOpinion()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.opinion = data;

        /** 
         * Verifica si hay datos y actualiza el formulario.
         */
        if (this.opinion !== null) {
          const OPINIONDATA = this.opinion;
          this.opinionForm.patchValue({
            areaResponsable: OPINIONDATA.areaResponsable,
            sentido: OPINIONDATA.sentido,
            generadoPor: OPINIONDATA.generadoPor,
            fechaGeneracion: OPINIONDATA.fechaGeneracion,
            opinion: OPINIONDATA.opinion,
          });
        }
      });
  }

  /**
   * Método para obtener los documentos de la opinión desde el servicio.
   * @returns {void}
   */
  getDocumentosOpinion(): void {
    this.detallesService
      .getDocumentosDetalleOpinion()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.datosTablaOpiniones = data;
      });
  }

  /**
   * Abre un archivo PDF en una nueva pestaña del navegador.
   * @param {string} url - La URL del archivo PDF que se va a abrir.
   * @returns {void}
   */
  static descargarPdfOpinion(url: string): void {
    window.open(url, '_blank');
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