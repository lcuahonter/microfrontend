import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Catalogo } from '../../../../../src/core/models/shared/catalogos.model';

import { ConsultaCatalogoService, CveEnumeracionConfig } from '@libs/shared/data-access-user/src/core/services/shared/consulta-catalogo/consulta-catalogo.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subject, forkJoin, takeUntil } from 'rxjs';

import { BodyTablaDictamenObservaciones } from '../../../../../src/core/models/shared/consulta-generica.model';

import { HeaderTablaDictamenObservacion } from '../../../../../src/core/models/shared/consulta-generica.model';

import { formatearToDDMMYYYYHHmm } from '../../../../../src/core/utils/utilerias';

import { CONSULTA_DICTAMEN_OBSERVACIONES } from '../../../../../src/core/enums/consulta-generica.enum';

import { CatalogoSelectComponent } from '../../catalogo-select/catalogo-select.component';

/**
 * Representa una observación del dictamen COFEPRIS.
 */
interface ObservacionCofepris {
  id_observacion: number;
  fecha_observacion: string;
  fecha_atencion: string | null;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  estado_observacion: string;
}

/**
 * Respuesta de catálogo con arreglo de datos tipo Catalogo.
 */
interface CatalogoResponse {
  datos: Catalogo[];
}

/**
 * Componente para mostrar el detalle del dictamen COFEPRIS 401/402.
 */
@Component({
  selector: 'lib-consulta-detalle-dictamen-cofepris-401-402',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CatalogoSelectComponent],
  templateUrl: './consulta-detalle-dictamen-cofepris-401-402.component.html',
  styleUrl: './consulta-detalle-dictamen-cofepris-401-402.component.css',
})

export class ConsultaDetalleDictamenCofepris401402Component implements OnInit, OnChanges, OnDestroy {
    
    /** Número de trámite recibido desde el componente padre */
    @Input() tramite!: number;
  
    /** Lista de autorizadores disponibles para el trámite */
    public autorizadorOpcions: Catalogo[] = [];
  
    /** Indica si se debe mostrar la fecha en la vista */
    mostrarFecha:boolean = false;
  
    /** Lista de motivos disponibles para el trámite */
    motivoOpciones: Catalogo[] = [];
  
    /** Configuración de enumeraciones para los catálogos del trámite */
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
        estatus: [''],
        sentidoDictamen: [''],
        fechaCreacion: [''],
        dictaminadoPor: [''],
        fechaGeneracion: [''],
        verificadoPor:[''],
        fechaVerificacion:[''],
        autorizadoPor: [''],
        fechaAutorizacion: ['', ],
        justificacion: [''], 
        idMotivoTipoTramite: [''], 
        siglasDictaminador: [''], 
        numeroGenerico1: ['']
      });
    }

    /**
     * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
     */
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
      ([motivoResp, autorizadorResp]) => {
        if (motivoResp) { this.motivoOpciones = motivoResp.datos as Catalogo[]; }
        if (autorizadorResp) { this.autorizadorOpcions = autorizadorResp.datos as Catalogo[]; }
        if (this.dictamenDetalle !== null) {
          const SOLICITUDDATA = this.dictamenDetalle;
          this.detalleForm.patchValue({
            estatus: SOLICITUDDATA.estado_dictamen,
            sentidoDictamen: SOLICITUDDATA.sentido_dictamen,
            fechaCreacion: formatearToDDMMYYYYHHmm(SOLICITUDDATA.fecha_creacion),
            dictaminadoPor: SOLICITUDDATA.dictaminado,
            fechaGeneracion: formatearToDDMMYYYYHHmm(SOLICITUDDATA.fecha_emision),
            verificadoPor: (SOLICITUDDATA.verificador && SOLICITUDDATA.verificador !== '')
              ? SOLICITUDDATA.verificador
              : SOLICITUDDATA.verificado,
            fechaVerificacion: formatearToDDMMYYYYHHmm(SOLICITUDDATA.fecha_verificacion),
            autorizadoPor: SOLICITUDDATA.autorizado,
            fechaAutorizacion: SOLICITUDDATA.fecha_autorizacion,
            /* start 512-516 */
            cumplimiento: SOLICITUDDATA.ide_sent_dictamen ?? 'SEDI.PA', 
            descripcionObjetoimportacion: SOLICITUDDATA.descripcionObjetoimportacion ?? '',
            idRestriccionTipoTramite: SOLICITUDDATA.idRestriccionTipoTramites?.[0] ?? '',
            descripcionDetalladaMercancia: SOLICITUDDATA.descripcionDetalladaMercancia ?? '',
            idClasificacionToxicologicaTipoTramite: SOLICITUDDATA.idClasificacionToxicologicaTipoTramite ?? '',
            descripcionUsoAutorizado: SOLICITUDDATA.descripcionUsoAutorizado ?? '',
            justificacion: SOLICITUDDATA.justificacion ?? '',
            idMotivoTipoTramite: SOLICITUDDATA.idMotivoTipoTramites?.[0] ?? '',
            siglasDictaminador: SOLICITUDDATA.siglasDictaminador ?? '',
            numeroGenerico1: SOLICITUDDATA.numeroGenerico1 ?? '',
          });
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

    /**
     * Formatea una fecha en formato DD/MM/YYYY.
     * @param dateString Fecha en formato string.
     * @returns Fecha formateada como DD/MM/YYYY.
     */
    static formatearFecha(dateString: string): string {
      const DATE = new Date(dateString);
      const DAY = String(DATE.getDate()).padStart(2, '0');
      const MONTH = String(DATE.getMonth() + 1).padStart(2, '0');
      const YEAR = DATE.getFullYear();
      return `${DAY}/${MONTH}/${YEAR}`;
    }
  

    /**
     * Inicializa y obtiene los catálogos de motivos y autorizadores para el trámite.
     * @returns Observable con las respuestas de ambos catálogos.
     */
    inicializarCatalogoOpciones(): Observable<[CatalogoResponse, CatalogoResponse]> {
      this.catalogoParameter = this.consultaCatalogoService.getCatalogoParameterConfig(this.tramite);
      const MOTIVO$ = this.consultaCatalogoService.getMotivoDelRequerimiento(this.tramite, this.catalogoParameter.motivoDelOficio);
      const AUTORIZADOR$ = this.consultaCatalogoService.getAsignarAutorizador(this.tramite);
      return forkJoin([MOTIVO$, AUTORIZADOR$]).pipe(
        takeUntil(this.unsubscribe$)
      ) as Observable<[CatalogoResponse, CatalogoResponse]>;
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

