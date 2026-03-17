import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { DocumentosEspecificosResponse, RequerimientoDetalleResponse } from '../../../../core/models/shared/requerimiento-detalle-response.model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subject, forkJoin, takeUntil } from 'rxjs';
import { CatalogoSelectComponent } from '../../catalogo-select/catalogo-select.component';
import { CommonModule } from '@angular/common';
import { Observacion } from '../../../../../src/core/models/shared/Iniciar-requerimiento-response.model';
import { TablaDinamicaComponent } from './../../tabla-dinamica/tabla-dinamica.component';

import { TablaAcciones } from '../../../../../src/core/enums/tabla-seleccion.enum';

import { Catalogo } from '../../../../../src/core/models/shared/catalogos.model';
import { ConfiguracionColumna } from '../../../../../src/core/models/shared/configuracion-columna.model';

import { ConsultaCatalogoService, CveEnumeracionConfig } from '../../../../../src/core/services/shared/consulta-catalogo/consulta-catalogo.service';

import { CatalogoSelectClaveComponent } from '../../catalogo-select-clave/catalogo-select.component';
import { ISFUNDAMENTODROPDOWN } from '../../../../../src/core/enums/cofepris-core-enum';
import { formatearToDDMMYYYYHHmm } from '../../../../../src/core/utils/utilerias';

interface CatalogoResponse {
  datos: Catalogo[];
}

@Component({
  selector: 'lib-consulta-detalle-requerimiento-cofepris-501-511',
  standalone: true,
  imports: [CommonModule, CatalogoSelectComponent, ReactiveFormsModule, TablaDinamicaComponent, CatalogoSelectClaveComponent],
  templateUrl:
    './consulta-detalle-requerimiento-cofepris-501-511.component.html',
  styleUrls: ['./consulta-detalle-requerimiento-cofepris-501-511.component.scss'],
})

export class ConsultaDetalleRequerimientoCofepris501511Component implements OnInit, OnChanges, OnDestroy {

  /**
   * @property {boolean} isIniciado
   * @description Indica si el trámite ha sido iniciado.
   */
  @Input() isIniciado: boolean = false;

  @Output() observacionEvent = new EventEmitter<string>();

  @Input() tramite!: number;

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
   * Subject utilizado para manejar la cancelación de suscripciones.
   * @type {Subject<void>}
  */
  public unsubscribe$ = new Subject<void>();

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  esFormularioSoloLectura: boolean = true;


  catalogoParameter!: CveEnumeracionConfig;

  public autorizadorOpcions: Catalogo[] = [];

   /**
   * Catálogo de fundamento de requerimiento
   */
  fundamentoRequerimientoOpcions!: Catalogo[];

  public motivoOpcions: Catalogo[] = [];

  /**
   * @description Variable que almacena las observaciones del dictamen
   */
  public observaciones: Observacion[] = [];


  isFundamento:number[] = ISFUNDAMENTODROPDOWN;

  /**
   * Configuración de la tabla que se utilizará en el componente.
   * @type {any}
   */
  configuracionTabla: ConfiguracionColumna<Observacion>[] = [
    { encabezado: "Fecha de observación", clave: (e: Observacion) => e.fechaObservacion ?? e.fecha_observacion, orden: 1 },
    { encabezado: "Fecha de atención", clave: (e: Observacion) => e.fechaAtencion ?? e.fecha_atencion ?? undefined, orden: 2 },
    { encabezado: "Generada por", clave: (e: Observacion) => e.generadaPor, orden: 3 },
    { encabezado: "Estatus de la observación", clave: (e: Observacion) => e.estatusObservacion ?? e.estadoObservacion ?? e.estado_observacion, orden: 4 },
    // { encabezado: "Detalle", clave: (e: Observacion) => e.observacion, orden: 5 }
  ];

  /**
   * Encabezado de tabla para agregar documentos
   */
  encabezadoDeTablaDocumentos = [
      { encabezado: 'Tipo de documento', clave: (item: DocumentosEspecificosResponse): string => item.tipo_documento ?? '', orden: 1 },
      { encabezado: 'Nombre del archivo', clave: (item: DocumentosEspecificosResponse): string => item.estado_documento_solicitud ?? '', orden: 2 },
  ]

  /**
   * Lista de documentos
   */
  public listadoDocumentos: DocumentosEspecificosResponse[] = [];

  acciones: TablaAcciones[] = [TablaAcciones.VER];


  /**
    * Constructor para la consulta de requerimientos.
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
      estatus: [''],
      fechaCreacion: [''],
      dictaminadoPor: [''],
      fechaGeneracion: [''],
      verificadoPor: [''],
      fechaverificación: [''],
      autorizadoPor: [''],
      fechaAutorizacion: [''],
      fechaAtencion: [''],
      justificacionRequerimiento: [''],
      fundamento: [''],
      motivoDelRequerimiento: [''],
      siglasDelDictaminador: [''],
      asignarAutorizardor: [''],
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
    if (changes['requerimientoDetalle'] && changes['requerimientoDetalle'].currentValue && changes['tramite'] && changes['tramite'].currentValue) {
      this.getDetalleRequerimiento();
      this.observaciones = this.requerimientoDetalle?.observaciones ?? []; 
      // this.listadoDocumentos = this.requerimientoDetalle?.documentos_especificos ?? [];
      this.listadoDocumentos =
        (this.requerimientoDetalle?.documentos_especificos ?? []).map((doc, index) => ({
          ...doc,
          id: `${doc.id_tipo_documento}-${index}`
        }));

    }
  }

  /**
   * Método para obtener la información de la solicitud para detalle de requerimiento.
   * @returns {void}
   */
  getDetalleRequerimiento(): void {
    this.inicializarFundamentoRequerimiento();
    this.inicializarCatalogoOpciones().subscribe({
      next: ([motivoResp, autorizadorResp]) => {
        if (motivoResp) {
          this.motivoOpcions = motivoResp.datos as Catalogo[];
        }
        if (autorizadorResp) {
          this.autorizadorOpcions = autorizadorResp.datos as Catalogo[];
        }
        if (this.requerimientoDetalle) {
          const SOLICITUDDATA = this.requerimientoDetalle;
          this.detalleForm.patchValue({
            estatus: SOLICITUDDATA.estado_requerimiento,
            fechaCreacion: formatearToDDMMYYYYHHmm(SOLICITUDDATA.fecha_creacion),
            dictaminadoPor: SOLICITUDDATA.dictaminador,
            fechaGeneracion: formatearToDDMMYYYYHHmm(SOLICITUDDATA.fecha_emision),
            verificadoPor: SOLICITUDDATA.verificador,
            fechaverificación: SOLICITUDDATA.fecha_verificacion,
            autorizadoPor: SOLICITUDDATA.autorizador,
            fechaAutorizacion: formatearToDDMMYYYYHHmm(SOLICITUDDATA.fecha_autorizacion),
            fechaAtencion: formatearToDDMMYYYYHHmm(SOLICITUDDATA.fecha_atencion),
            justificacionRequerimiento: SOLICITUDDATA.justificacion,
            fundamento: SOLICITUDDATA.fundamento,
            motivoDelRequerimiento: SOLICITUDDATA.motivo,
            siglasDelDictaminador: SOLICITUDDATA.siglas_participante_externo,
            asignarAutorizardor: SOLICITUDDATA.alcance_requerimiento,
          });
          this.observaciones = (SOLICITUDDATA.observaciones || []).map((obs: Observacion) => ({
            fechaObservacion: obs.fechaObservacion ?? obs.fecha_observacion,
            fechaAtencion: obs.fechaAtencion ?? obs.fecha_atencion,
            generadaPor: `${obs.persona?.nombre} ${obs.persona?.apellidoPaterno ?? obs.persona?.apellido_paterno } ${obs.persona?.apellidoMaterno ?? obs.persona?.apellido_materno}`.trim(),
            estatusObservacion: obs.estadoObservacion ?? obs.estado_observacion,
            observacion: obs.observacion,
          }));
        }
      },
      error: (err: unknown) => {
        console.error('Error loading catalogos', err);
      },
    });
  }



  /**
   * Evalúa si se debe inicializar o cargar datos.
  */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.detalleForm.disable();
    }
  }

  inicializarCatalogoOpciones(): Observable<[CatalogoResponse, CatalogoResponse]> {
    if (!this.tramite) {
      return forkJoin([[], []]) as Observable<[CatalogoResponse, CatalogoResponse]>;
    }
    this.catalogoParameter = this.consultaCatalogoService.getCatalogoParameterConfig(this.tramite);
    const MOTIVO_REQUERIMIENTO$ = this.consultaCatalogoService.getMotivoDelRequerimiento(this.tramite, this.catalogoParameter?.ideTipoMotivo);
    const AUTORIZADOR$ = this.consultaCatalogoService.getAsignarAutorizador(this.tramite);
    return forkJoin([MOTIVO_REQUERIMIENTO$, AUTORIZADOR$]).pipe(
      takeUntil(this.unsubscribe$)
    ) as Observable<[CatalogoResponse, CatalogoResponse]>;
  }

  inicializarFundamentoRequerimiento(): void {
  if (this.isFundamento.includes(this.tramite)) {
        this.consultaCatalogoService
          .getFundamentoDelRequerimiento(this.tramite)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((response) => {
            const DATOS = response.datos as Catalogo[];
            if (response) {
              this.fundamentoRequerimientoOpcions = DATOS;
            }
          });
      }
  }

  observacionEmit(event: {row: Observacion}): void {
    if (event.row) {
      const OBSERVACION = event.row.observacion;
      this.observacionEvent.emit(OBSERVACION);
    }
    // if (event.accion === TablaAcciones.VER) { 
    //   const observacionSeleccionada = event.fila;
      // alert(`Detalle de la observación:\n\n${observacionSeleccionada.observacion}`);
    // }
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
