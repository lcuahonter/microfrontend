import { BodyTablaDictamenObservaciones, HeaderTablaDictamenObservacion } from '../../../../core/models/shared/consulta-generica.model';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, Subject, forkJoin, takeUntil } from 'rxjs';

import { CONSULTA_DICTAMEN_OBSERVACIONES } from '../../../../core/enums/consulta-generica.enum';
import { CatalogoSelectComponent } from '../../catalogo-select/catalogo-select.component';
import { CommonModule } from '@angular/common';

import { ConsultaCatalogoService, CveEnumeracionConfig } from '../../../../core/services/shared/consulta-catalogo/consulta-catalogo.service';
import { Catalogo } from '../../../../core/models/shared/catalogos.model';

interface ObservacionCofepris {
  id_observacion: number;
  fecha_observacion: string;
  fecha_atencion: string | null;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  estado_observacion: string;
}

interface CatalogoResponse {
  datos: Catalogo[];
}

@Component({
  selector: 'lib-detalle-dictamen-cofepris-26030',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,CatalogoSelectComponent],
  templateUrl: './consulta-detalle-dictamen-cofepris.component.html',
  styleUrl: './consulta-detalle-dictamen-cofepris.component.scss',
})
export class ConsultaDetalleDictamenCofepris26030Component implements OnInit, OnChanges, OnDestroy {

@Input() tramite!: number;

  public plazoOpcions: Catalogo[] = [];

  public autorizadorOpcions: Catalogo[] = [{
    id: 1,
    clave: 'OIGJ530820E37',
    descripcion: 'OLIVARES GALVEZ JUAN CARLOS'
  }]

  
  mostrarFecha:boolean=false;

  motivoOpcions: string = '';
  motivoPracialOptcions: Catalogo[] = [];
  motivoRechazoOpcions: Catalogo[] = []

  catalogoParameter!:CveEnumeracionConfig;
  
  /**
    * Recibe los datos del dictamen desde el componente padre 
  */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() dictamenDetalle!: any;

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
    * Constructor para la consulta de opiniones.
    * @param fb FormBuilder para crear formularios reactivos.
  */
  constructor(
    private fb: FormBuilder,
    private consultaCatalogoService: ConsultaCatalogoService,
  ) {
     /** 
     * Formulario reactivo para detalle.
     */
    this.detalleForm = this.fb.group({
      estatus: ['', Validators.required],
      sentidoDictamen: ['', Validators.required],
      fechaCreacion: ['', Validators.required],
      dictaminadoPor: ['', Validators.required],
      fechaGeneracion: ['', Validators.required],
      verificadoPor:['',Validators.required],
      fechaVerificacion:['', Validators.required],
      autorizadoPor: ['', Validators.required],
      fechaAutorizacion: ['', ],
      justificacion: ['', ],
      descripcionUsoAutorizado: ['', ],
      opinion: ['', ],
      plazoVigencia: ['', ],
      fechaFinVigencia:[''],
      justificacionNegativa: ['', ],
      idMotivoTipoTramite: ['', ],
      siglasDictaminador: ['', ],
      numeroGenerico1: ['', ]
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
   * Método para obtener la información de la solicitud para detalle de dictamen.
   * @returns {void}
   */
  getDetalleDictamen(): void {
    
  this.inicializarCatalogoOpciones().subscribe(
    ([plazoResp, motivoRechazoResp, motivoParcialResp, autorizadorResp]) => {
      if (plazoResp) { this.plazoOpcions = plazoResp.datos as Catalogo[]; }
      if (motivoRechazoResp) { this.motivoRechazoOpcions = motivoRechazoResp.datos as Catalogo[]; }
      if (motivoParcialResp) { this.motivoPracialOptcions = motivoParcialResp.datos as Catalogo[]; }
      if (autorizadorResp) { this.autorizadorOpcions = autorizadorResp.datos as Catalogo[]; }
      if (this.dictamenDetalle !== null) {
        const SOLICITUDDATA = this.dictamenDetalle;
        if (SOLICITUDDATA.sentido_dictamen.toLowerCase() === 'rechazado') {
          const MOTIVO = this.motivoRechazoOpcions.find(res => res.clave === SOLICITUDDATA.idMotivoTipoTramites[0].toString());
          this.motivoOpcions = MOTIVO ? MOTIVO.descripcion : '';
        } else if (SOLICITUDDATA.sentido_dictamen.toLowerCase() === 'parcial') {
          const MOTIVO = this.motivoPracialOptcions.find(res => res.clave === SOLICITUDDATA.idMotivoTipoTramites[0].toString());
          this.motivoOpcions = MOTIVO ? MOTIVO.descripcion : '';
        }
        this.detalleForm.patchValue({
          estatus: SOLICITUDDATA.estado_dictamen,
          sentidoDictamen: SOLICITUDDATA.sentido_dictamen,
          fechaCreacion: SOLICITUDDATA.fecha_creacion,
          dictaminadoPor: SOLICITUDDATA.dictaminado,
          fechaGeneracion: SOLICITUDDATA.fecha_emision,
          verificadoPor: SOLICITUDDATA.fecha_emision,
          fechaVerificacion: SOLICITUDDATA.fecha_verificacion,
          autorizadoPor: SOLICITUDDATA.autorizado,
          fechaAutorizacion: SOLICITUDDATA.fecha_autorizacion,
          justificacionNegativa: SOLICITUDDATA.justificacionNegativa,
          idMotivoTipoTramite: this.motivoOpcions,
          siglasDictaminador: SOLICITUDDATA.siglasDictaminador,
          numeroGenerico1: SOLICITUDDATA.numeroGenerico1,
          justificacion: SOLICITUDDATA.justificacion,
          descripcionUsoAutorizado: SOLICITUDDATA.descripcionUsoAutorizado,
          opinion: SOLICITUDDATA.opinion,
          plazoVigencia: SOLICITUDDATA.plazoVigencia,
          fechaFinVigencia: ConsultaDetalleDictamenCofepris26030Component.formatearFecha(SOLICITUDDATA.fecha_fin_vigencia)
        });
        this.mostrarFecha = this.detalleForm?.get('plazoVigencia')?.value === 'PZVI.FFV';
        this.datosTablaObservaciones = (SOLICITUDDATA.observaciones || []).map((obs: ObservacionCofepris) => ({
        id: obs.id_observacion,
        fechaObservacion: obs.fecha_observacion,
        fechaAtencion: obs.fecha_atencion ?? '',
        generadaPor: `${obs.nombre} ${obs.apellido_paterno} ${obs.apellido_materno}`.trim(),
        estatusObservacion: obs.estado_observacion
      }));

      }
    },
    (err: unknown) => {
      console.error('Error loading catalogos', err);
    }
  );
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

  static formatearFecha(dateString: string): string {
  const DATE = new Date(dateString);
  const DAY = String(DATE.getDate()).padStart(2, '0');
  const MONTH = String(DATE.getMonth() + 1).padStart(2, '0');
  const YEAR = DATE.getFullYear();

  return `${DAY}/${MONTH}/${YEAR}`;
}


  inicializarCatalogoOpciones(): Observable<[CatalogoResponse, CatalogoResponse, CatalogoResponse, CatalogoResponse]> {
    this.catalogoParameter = this.consultaCatalogoService.getCatalogoParameterConfig(this.tramite);
    const PLAZO$ = this.consultaCatalogoService.getPlazo(this.tramite);
    const MOTIVO_RECHAZO$ = this.consultaCatalogoService.getMotivoDeRechazo(this.tramite);
    const MOTIVO_PARCIAL$ = this.consultaCatalogoService.getMotivoDelRequerimiento(this.tramite, this.catalogoParameter?.motivoDelOficio);
    const AUTORIZADOR$ = this.consultaCatalogoService.getAsignarAutorizador(this.tramite);
    return forkJoin([PLAZO$, MOTIVO_RECHAZO$, MOTIVO_PARCIAL$, AUTORIZADOR$]).pipe(
      takeUntil(this.unsubscribe$)
    ) as Observable<[CatalogoResponse, CatalogoResponse, CatalogoResponse, CatalogoResponse]>;
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