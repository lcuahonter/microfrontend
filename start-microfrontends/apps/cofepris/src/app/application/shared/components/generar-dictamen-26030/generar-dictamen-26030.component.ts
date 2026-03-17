/* eslint-disable complexity */
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from "@angular/forms";
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from "@angular/core";
import { Subject, takeUntil } from "rxjs";
import { CommonModule } from "@angular/common";

import { 
  Catalogo, 
  CatalogoSelectComponent, 
  CategoriaMensaje, 
  ConfiguracionColumna, 
  ConsultaCatalogoService, 
  CveEnumeracionConfig, 
  InputFecha, 
  InputFechaComponent, 
  Notificacion, 
  NotificacionesComponent, 
  TablaDinamicaComponent, 
  TituloComponent 
} from "@libs/shared/data-access-user/src";

import { GenerarDictamenResponse, HistorialObservacione } from "../../../core/models/evaluar/response/evaluar-estado-evaluacion-response.model";
import { DictamenForm } from "../../../core/models/autorizar-dictamen/dictamen-form.model";
import { IniciarAutorizacionResponse } from "../../../core/models/autorizar-dictamen/iniciar-autorizar-dictamen-response.model";
import { IniciarVerificarResponse } from "../../../core/models/verificar-dictamen/iniciar-verificar-dictamen-response.model";
import { SentidosDisponiblesResponse } from "@libs/shared/data-access-user/src/core/models/shared/sentidos-disponibles.model";
import { TramiteConfigService } from "../../services/tramiteConfig.service";
import { ValidacionesFormularioService } from "@libs/shared/data-access-user/src";


// Constants
const SENTIDO_DICTAMEN = {
  ACEPTADO: 'SEDI.AC',
  RECHAZADO: 'SEDI.RZ',
  PARCIAL: 'SEDI.PA'
} as const;

const EVENT_TYPE = {
  GUARDAR: 'guardar',
  FIRMAR: 'firmar',
  CANCELAR: 'cancelar',
  VISTA_PRELIMINAR_ACEPTADO: 'VistaPreliminarAceptado',
  VISTA_PRELIMINAR_RECHAZADO: 'VistaPreliminarRechazado',
  VISTA_PRELIMINAR_OFICIO: 'VistaPreliminardelOficio'
} as const;

const MIN_MERCANCIAS_REQUIRED = 1;



@Component({
  selector: 'app-generar-dictamen-26030',
  standalone: true,
  imports: [
    CommonModule, 
    CatalogoSelectComponent, 
    FormsModule, 
    InputFechaComponent, 
    TablaDinamicaComponent, 
    ReactiveFormsModule, 
    TituloComponent,
    NotificacionesComponent
  ],
  templateUrl: './generar-dictamen-26030.component.html',
  styleUrl: './generar-dictamen-26030.component.scss',
})
export class GenerarDictamen26030Component implements OnInit, OnChanges, OnDestroy {
  catalogoParameter!: CveEnumeracionConfig;
  
  // Inputs
  @Input() tituloComponente = 'Generar Dictamen';
  @Input() modo: 'GENERAR' | 'VERIFICAR' = 'GENERAR';
  @Input() sentidoInput = false;
  @Input() procedureId = 0;
  @Input() soloLectura = false;
  @Input() mostrarTitulo = true; 
  @Input() anexo222se = true;
  @Input() botonDeCancelar = '';
  @Input() botonGuardar = '';
  @Input() inputSentidos!: boolean;
  @Input() dataIniciarDictamen!: GenerarDictamenResponse | IniciarVerificarResponse | IniciarAutorizacionResponse;
  @Input() opcionesSentidosDisponibles: SentidosDisponiblesResponse[] = [];

  // Outputs
  @Output() controlDictaminador = new EventEmitter<boolean>();
  @Output() enviarEvento = new EventEmitter<{ events: string; datos:DictamenForm }>();

  // Public properties
  dictamenForm!: FormGroup;
  mostrarCamposFechaAc = false;
  mostrarCamposFechaRe = false;
  mostrarCamposFechaPl = false;
  esVistaPrevia = false;
  resultadoEvaluacion = '';
  
  fundamentoNegativeDictamenLabel = 'Fundamento negativo del dictamen';
  justificacionNegativaLabel = 'Justificación del Rechazo';
  motivoLabel = 'Motivo del rechazo';

  fundamentoDictamenOpcions: Catalogo[] = [];
  fundamentoNegativoDictamenOpcions: Catalogo[] = [];
  fundamentoOficioDictamenOpcions: Catalogo[] = [];
  motivoRechazoOpcions: Catalogo[] = [];
  motivoOficioOpcions: Catalogo[] = [];
  
  // Table configuration
  evaluarObservacionesDictamen: HistorialObservacione[] = [];
  tablaObservacionesDictamen: ConfiguracionColumna<HistorialObservacione>[] = [
    { encabezado: "Fecha de generación", clave: (e) => e.fecha_observacion, orden: 1 },
    { encabezado: "Fecha de atención", clave: (e) => e.fecha_atencion, orden: 2 },
    { encabezado: "Generada por", clave: (e) => this.formatNombreCompleto(e), orden: 3 },
    { encabezado: "Estatus", clave: (e) => e.estado_observacion, orden: 4 },
    { encabezado: "Detalle", clave: (e) => e.observacion, orden: 5 }
  ];

  fechaConfig: InputFecha = {
    labelNombre: 'Fecha de fin de vigencia autorizada',
    required: false,
    habilitado: true,
  };
  
  fechaConfigInicio: InputFecha = {
    labelNombre: 'Fecha de inicio de vigencia autorizada',
    required: false,
    habilitado: true,
  };

  destinadoParaCatalogoParameter!: CveEnumeracionConfig;
  private readonly destroy$ = new Subject<void>();
  nuevaNotificacion!: Notificacion;

  constructor(
    private readonly fb: FormBuilder,
    private readonly validacionesService: ValidacionesFormularioService,
    private readonly catalogoService: ConsultaCatalogoService,
    private readonly tramiteConfigService: TramiteConfigService,
    private consultaCatalogoService: ConsultaCatalogoService,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.inicializarCatalogoOpciens();
    this.setupFormSubscriptions();
    this.controlDictaminador.emit(true);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['soloLectura']) {
      this.handleReadOnlyChanges(changes);
    }
    this.handleDataChanges(changes);
    this.handleSentidoInputChanges(changes);
    this.handleProcedureIdChanges(changes);
    
    if (this.soloLectura && this.dictamenForm) {
      this.dictamenForm.disable({ emitEvent: false });
      this.updateFechaConfigs();
    }
  }

  /**
   * Initialize form with fields mapped to API payload
   */
  private initializeForm(): void {
    this.dictamenForm = this.fb.group({
      // Common
      cumplimiento: ['', Validators.required],
      siglasDictaminador: ['', [Validators.required, this.noSoloEspaciosValidator, Validators.maxLength(25)]],
      
      // Fundamento del dictamen (Aceptado) -> fundamentosDictamen[]
      fundamentoDictamen: [''],
      descripcionFundamentoDictamen: ['', [this.noSoloEspaciosValidator, Validators.maxLength(2000)]],
      
      // Fundamento negativo del dictamen (Rechazado) -> fundamentosDictamen[]
      fundamentoNegativoDictamen: [''],
      descripcionFundamentoNegativoDictamen: ['', [this.noSoloEspaciosValidator, Validators.maxLength(2000)]],
      
      // Fundamento del oficio del dictamen (Parcial) -> fundamentosDictamen[]
      fundamentoOficioDictamen: [''],
      descripcionFundamentoOficioDictamen: ['', [this.noSoloEspaciosValidator, Validators.maxLength(2000)]],
      
      // Número de Permiso -> numeroFolioExterno
      numeroFolioExterno: ['',Validators.maxLength(20)],
      
      // Mercancía input field
      nombreMercancia: ['', [this.noSoloEspaciosValidator, Validators.maxLength(200)]],
      descripcionDetalladaElaboracion:['',[Validators.maxLength(1000)]],
      
      // Mercancías table -> observaciones[]
      observaciones: this.fb.array([]),
      
      // Cantidad de Sal -> cantidadSal
      cantidadSal: [''],
      
      // Cantidad de Base -> cantidadBase
      cantidadBase: [''],
      
      // Número de Permiso de Importación -> numeroPermisoImportacion
      numeroPermisoImportacion: [''],
      
      // Fecha de inicio de vigencia autorizada -> fechaInicioVigencia
      fechaInicioVigencia: [''],
      
      // Fecha de fin de vigencia autorizada -> fechaFinVigencia
      fechaFinVigencia: [''],
      
      // Expedido por -> organismoExpedicionPermiso
      organismoExpedicionPermiso: [''],
      
      // Justificación del oficio del dictamen (Parcial) -> justificacionDictamen
      justificacionDictamen: ['', [this.noSoloEspaciosValidator, Validators.maxLength(2000)]],
      
      // Motivo del oficio / Motivo del rechazo -> idMotivoTipoTramite
      idMotivoTipoTramite: [''],

      idMotivoTipoTramiteOficio:[''],
      
      // Justificación del Rechazo (Rechazado) -> justificacion
      justificacion: ['', [this.noSoloEspaciosValidator, Validators.maxLength(2000)]],
      
      // For checkbox selection in table
      aceptada: [false]
    });
    
    this.dictamenForm.get('siglasDictaminador')?.disable();
  }

  private setupFormSubscriptions(): void {
    this.dictamenForm.get('cumplimiento')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => this.actualizarVisibilidadCamposFecha(value));

    this.dictamenForm.get('cantidadSal')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.validateCantidadFields());

    this.dictamenForm.get('cantidadBase')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.validateCantidadFields());

    this.dictamenForm.get('observaciones')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.validateMercancias());
  }

  private validateCantidadFields(): void {
    const cumplimiento = this.dictamenForm.get('cumplimiento')?.value;
    if (cumplimiento !== SENTIDO_DICTAMEN.ACEPTADO && cumplimiento !== SENTIDO_DICTAMEN.PARCIAL) return;

    const cantidadSal = this.dictamenForm.get('cantidadSal')?.value?.trim();
    const cantidadBase = this.dictamenForm.get('cantidadBase')?.value?.trim();
    
    if (!cantidadSal && !cantidadBase) {
      this.dictamenForm.get('cantidadSal')?.setErrors({ atLeastOneRequired: true });
      this.dictamenForm.get('cantidadBase')?.setErrors({ atLeastOneRequired: true });
    } else {
      this.clearSpecificError('cantidadSal', 'atLeastOneRequired');
      this.clearSpecificError('cantidadBase', 'atLeastOneRequired');
    }
  }

  private clearSpecificError(fieldName: string, errorKey: string): void {
    const control = this.dictamenForm.get(fieldName);
    if (control?.hasError(errorKey)) {
      const errors = { ...control.errors };
      delete errors[errorKey];
      control.setErrors(Object.keys(errors).length > 0 ? errors : null);
    }
  }

  private validateMercancias(): void {
    const cumplimiento = this.dictamenForm.get('cumplimiento')?.value;
    if (cumplimiento !== SENTIDO_DICTAMEN.ACEPTADO && cumplimiento !== SENTIDO_DICTAMEN.PARCIAL) return;

    const observaciones = this.dictamenForm.get('observaciones') as FormArray;
    if (observaciones && observaciones.length >= MIN_MERCANCIAS_REQUIRED) {
      this.clearSpecificError('nombreMercancia', 'mercanciaRequired');
    }
  }

  private handleDataChanges(changes: SimpleChanges): void {
    if (changes['dataIniciarDictamen']?.currentValue && this.dictamenForm) {
      const data = changes['dataIniciarDictamen'].currentValue;
      this.patchFormData(data);
      this.actualizarVisibilidadCamposFecha(data.ide_sent_dictamen || data.cumplimiento);
      this.esVistaPrevia = !!(data.ide_sent_dictamen || data.cumplimiento);
      
      if (this.soloLectura) {
        this.dictamenForm.disable({ emitEvent: false });
      }
    }
  }

  private handleReadOnlyChanges(changes: SimpleChanges): void {
    if (changes['soloLectura'] && this.dictamenForm) {
      if (this.soloLectura) {
        this.dictamenForm.disable({ emitEvent: false });
        this.clearAllValidators();
        this.updateFechaConfigs();
      } else {
        this.dictamenForm.enable({ emitEvent: false });
        this.dictamenForm.get('siglasDictaminador')?.disable({ emitEvent: false });
        this.restoreValidators();
        this.updateFechaConfigs();
      }
    }
  }

  private handleSentidoInputChanges(changes: SimpleChanges): void {
    if (changes['sentidoInput']) {
      this.resultadoEvaluacion = this.sentidoInput ? 'Aceptado' : 'Rechazado';
    }
  }

  private handleProcedureIdChanges(changes: SimpleChanges): void {
    if (changes['procedureId']?.currentValue) {
      this.destinadoParaCatalogoParameter = this.catalogoService.getCatalogoParameterConfig(this.procedureId);
    }
  }

  private updateFechaConfigs(): void {
    this.fechaConfig = { ...this.fechaConfig, habilitado: !this.soloLectura };
    this.fechaConfigInicio = { ...this.fechaConfigInicio, habilitado: !this.soloLectura };
  }

  /**
   * Patch form data from API response
   */
 private patchFormData(data: any): void {
  const cumplimiento = data.ide_sent_dictamen || data.cumplimiento || '';
       let observacionesArray: string[] = [];
    if (data.observaciones && Array.isArray(data.observaciones)) {
      observacionesArray = data.observaciones;
    }
    if(observacionesArray.length > 0){
    observacionesArray.forEach((item: any) => {
      const nombre = typeof item === 'string' ? item : (item.nombre || item);
      this.mercanciasFormArray.push(this.fb.group({
        nombre: [nombre, Validators.required],
        aceptada: [typeof item === 'object' && item.aceptada !== undefined ? item.aceptada : false]
      }));
    });
  }
  
  // Common fields for all sentidos
  this.dictamenForm.patchValue({
    cumplimiento: cumplimiento,
    siglasDictaminador: data.siglasDictaminador || '',
  });

  // Patch fields based on cumplimiento
  if (cumplimiento === SENTIDO_DICTAMEN.ACEPTADO) {
    this.patchAceptadoFields(data);
  } else if (cumplimiento === SENTIDO_DICTAMEN.RECHAZADO) {
    this.patchRechazadoFields(data);
  } else if (cumplimiento === SENTIDO_DICTAMEN.PARCIAL) {
    this.patchParcialFields(data);
  }

  // Load observaciones for ACEPTADO and PARCIAL
  if (cumplimiento === SENTIDO_DICTAMEN.ACEPTADO || cumplimiento === SENTIDO_DICTAMEN.PARCIAL) {
    this.patchObservaciones(data);
  }

  this.evaluarObservacionesDictamen = data.historial_observaciones ?? [];
}

/**
 * Patch fields for ACEPTADO (SEDI.AC)
 */
private patchAceptadoFields(data: any): void {
  // Fundamento del dictamen
  if (data.fundamentosDictamen?.length > 0) {
    this.dictamenForm.patchValue({
      fundamentoDictamen: data.fundamentosDictamen[0].idFundamentoTipoTramite || '',
    });
    
    this.loadFundamentoDictamenDescripcion(data, 0, SENTIDO_DICTAMEN.ACEPTADO);
  }
  if(this.procedureId === 260301){
this.dictamenForm.patchValue({
      descripcionDetalladaElaboracion: data.descripcionDetalladaElaboracion ||'',
    });
  }

  // Other ACEPTADO fields
  this.dictamenForm.patchValue({
    numeroFolioExterno: data.numero_folio_externo || '',
    cantidadSal: data.cantidadSal || '',
    cantidadBase: data.cantidadBase || '',
    numeroPermisoImportacion: data.numeroPermisoImportacion || '',
    organismoExpedicionPermiso: data.organismoExpedicionPermiso || '',
    fechaInicioVigencia: data.fecha_creacion ? GenerarDictamen26030Component.toDDMMYYYY(data.fecha_creacion) : '',
    fechaFinVigencia: data.fecha_fin_vigencia ? GenerarDictamen26030Component.toDDMMYYYY(data.fecha_fin_vigencia) : '',
  });
}

/**
 * Patch fields for RECHAZADO (SEDI.RZ)
 */
private patchRechazadoFields(data: any): void {
  // Fundamento negativo del dictamen
  if (data.fundamentosDictamen?.length > 0) {
    this.dictamenForm.patchValue({
      fundamentoNegativoDictamen: data.fundamentosDictamen[0].idFundamentoTipoTramite || '',
    });
    
    this.loadFundamentoNegativoDescripcion(data, 0);
  }

  this.dictamenForm.patchValue({
    justificacion: data.justificacion || '',
    idMotivoTipoTramite: Array.isArray(data.idMotivoTipoTramites) 
      ? data.idMotivoTipoTramites[0] || '' 
      : data.idMotivoTipoTramites || '',
  });
}

/**
 * Patch fields for PARCIAL (SEDI.PA)
 */
private patchParcialFields(data: any): void {
  // Fundamento del dictamen (Datos de Autorización)
  if (data.fundamentosDictamen?.length > 0) {
    this.dictamenForm.patchValue({
      fundamentoDictamen: data.fundamentosDictamen[0].idFundamentoTipoTramite || '',
    });
    
    this.loadFundamentoDictamenDescripcion(data, 0, SENTIDO_DICTAMEN.PARCIAL);
  }
    if(this.procedureId === 260301){
this.dictamenForm.patchValue({
      descripcionDetalladaElaboracion: data.descripcionDetalladaElaboracion ||'',
    });
  }

  // Fundamento del oficio del dictamen (Datos del Oficio)
  if (data.fundamentosDictamen?.length > 1) {
    this.dictamenForm.patchValue({
      fundamentoOficioDictamen: data.fundamentosDictamen[1].idFundamentoTipoTramite || '',
    });
    
    this.loadFundamentoOficioDescripcion(data, 1);
  }

  // Datos de Autorización fields
  this.dictamenForm.patchValue({
    numeroFolioExterno: data.numero_folio_externo || '',
    cantidadSal: data.cantidadSal || '',
    cantidadBase: data.cantidadBase || '',
    numeroPermisoImportacion: data.numeroPermisoImportacion || '',
    organismoExpedicionPermiso: data.organismoExpedicionPermiso || '',
    fechaInicioVigencia: data.fecha_creacion ? GenerarDictamen26030Component.toDDMMYYYY(data.fecha_creacion) : '',
    fechaFinVigencia: data.fecha_fin_vigencia ? GenerarDictamen26030Component.toDDMMYYYY(data.fecha_fin_vigencia) : '',
  });

  // Datos del Oficio fields
  this.dictamenForm.patchValue({
    justificacionDictamen: data.justificacion || '',
    idMotivoTipoTramiteOficio: Array.isArray(data.idMotivoTipoTramites) 
      ? data.idMotivoTipoTramites[0] || '' 
      : data.idMotivoTipoTramites || '',
  });
}

/**
 * Patch observaciones (Mercancías) for ACEPTADO and PARCIAL
 */
private patchObservaciones(data: any): void {
  // Clear existing observaciones
  while (this.mercanciasFormArray.length !== 0) {
    this.mercanciasFormArray.removeAt(0);
  }

  if (data.observaciones && Array.isArray(data.observaciones)) {
    data.observaciones.forEach((item: any) => {
      const nombre = typeof item === 'string' ? item : (item.nombre || item);
      this.mercanciasFormArray.push(this.fb.group({
        nombre: [nombre, Validators.required],
        aceptada: [typeof item === 'object' && item.aceptada !== undefined ? item.aceptada : false]
      }));
    });
  }
}

/**
 * Load descripcion for Fundamento del dictamen (ACEPTADO/PARCIAL)
 */
private loadFundamentoDictamenDescripcion(data: any, index: number, sentido: string): void {
  setTimeout(() => {
    if (data.fundamentosDictamen[index]?.descripcion === null) {
      const foundCatalog = this.fundamentoDictamenOpcions.find(
        catalog => catalog.clave === data.fundamentosDictamen[index].idFundamentoTipoTramite?.toString()
      );
      if (foundCatalog) {
        this.actualizarDescripcionFundamentoDictamen(foundCatalog);
      }
    } else {
      this.dictamenForm.patchValue({
        descripcionFundamentoDictamen: data.fundamentosDictamen[index].descripcion || ''
      });
    }
  }, 100);
}

/**
 * Load descripcion for Fundamento negativo del dictamen (RECHAZADO)
 */
private loadFundamentoNegativoDescripcion(data: any, index: number): void {
  setTimeout(() => {
    if (data.fundamentosDictamen[index]?.descripcion === null) {
      const foundCatalog = this.fundamentoNegativoDictamenOpcions.find(
        catalog => catalog.clave === data.fundamentosDictamen[index].idFundamentoTipoTramite?.toString()
      );
      if (foundCatalog) {
        this.actualizarDescripcionFundamentoNegativo(foundCatalog);
      }
    } else {
      this.dictamenForm.patchValue({
        descripcionFundamentoNegativoDictamen: data.fundamentosDictamen[index].descripcion || ''
      });
    }
  }, 100);
}

/**
 * Load descripcion for Fundamento del oficio del dictamen (PARCIAL)
 */
private loadFundamentoOficioDescripcion(data: any, index: number): void {
  setTimeout(() => {
    if (data.fundamentosDictamen[index]?.descripcion === null) {
      const foundCatalog = this.fundamentoOficioDictamenOpcions.find(
        catalog => catalog.clave === data.fundamentosDictamen[index].idFundamentoTipoTramite?.toString()
      );
      if (foundCatalog) {
        this.actualizarDescripcionFundamentoOficio(foundCatalog);
      }
    } else {
      this.dictamenForm.patchValue({
        descripcionFundamentoOficioDictamen: data.fundamentosDictamen[index].descripcion || ''
      });
    }
  }, 100);
}

  private actualizarVisibilidadCamposFecha(valorCumplimiento: string): void {
    if (!valorCumplimiento) {
      this.resetAllFieldVisibility();
      this.clearAllFieldValidators();
      return;
    }
    
    if (!this.soloLectura) {
      this.dictamenForm.get('siglasDictaminador')?.enable();
    }

    this.mostrarCamposFechaAc = valorCumplimiento === SENTIDO_DICTAMEN.ACEPTADO;
    this.mostrarCamposFechaRe = valorCumplimiento === SENTIDO_DICTAMEN.RECHAZADO;
    this.mostrarCamposFechaPl = valorCumplimiento === SENTIDO_DICTAMEN.PARCIAL;

    this.clearAllFieldValidators();

    if (this.mostrarCamposFechaAc) {
      this.applyAceptadoValidations();
    } else if (this.mostrarCamposFechaRe) {
      this.applyRechazadoValidations();
    } else if (this.mostrarCamposFechaPl) {
      this.applyParcialValidations();
    }
    
    if (this.soloLectura) {
      this.dictamenForm.disable({ emitEvent: false });
    }
  }

  private applyAceptadoValidations(): void {
    if (this.soloLectura) return;
    this.setFieldValidators('fundamentoDictamen', [Validators.required]);
    this.setFieldValidators('descripcionFundamentoDictamen', [Validators.required, this.noSoloEspaciosValidator, Validators.maxLength(2000)]);
    this.setFieldValidators('numeroFolioExterno', [Validators.required]);
    this.setFieldValidators('siglasDictaminador', [Validators.required, this.noSoloEspaciosValidator, Validators.maxLength(25)]);
    this.setFieldValidators('nombreMercancia', [ Validators.maxLength(200)]);
    this.setFieldValidators('numeroFolioExterno', [Validators.required, this.noSoloEspaciosValidator, Validators.maxLength(20)]);
    if (this.procedureId === 260301) {
    this.setFieldValidators('descripcionDetalladaElaboracion', [Validators.required, this.noSoloEspaciosValidator, Validators.maxLength(2000)]);
  } else {
    this.validateCantidadFields();
  }
  }

  private applyRechazadoValidations(): void {
    if (this.soloLectura) return;
    this.setFieldValidators('fundamentoNegativoDictamen', [Validators.required]);
    this.setFieldValidators('descripcionFundamentoNegativoDictamen', [Validators.required, this.noSoloEspaciosValidator, Validators.maxLength(2000)]);
    this.setFieldValidators('justificacion', [Validators.required, this.noSoloEspaciosValidator, Validators.maxLength(2000)]);
    this.setFieldValidators('idMotivoTipoTramite', [Validators.required]);
    this.setFieldValidators('siglasDictaminador', [Validators.required, this.noSoloEspaciosValidator, Validators.maxLength(25)]);
  }

  private applyParcialValidations(): void {
    if (this.soloLectura) return;
    // Datos de Autorización
    this.setFieldValidators('fundamentoDictamen', [Validators.required]);
    this.setFieldValidators('descripcionFundamentoDictamen', [Validators.required, this.noSoloEspaciosValidator, Validators.maxLength(2000)]);
        this.setFieldValidators('nombreMercancia', [ Validators.maxLength(200)]);
    this.setFieldValidators('numeroFolioExterno', [Validators.required, this.noSoloEspaciosValidator, Validators.maxLength(20)]);
    // Datos del Oficio
    this.setFieldValidators('fundamentoOficioDictamen', [Validators.required]);
    this.setFieldValidators('descripcionFundamentoOficioDictamen', [Validators.required, this.noSoloEspaciosValidator, Validators.maxLength(2000)]);
    this.setFieldValidators('justificacionDictamen', [Validators.required, this.noSoloEspaciosValidator, Validators.maxLength(2000)]);
    this.setFieldValidators('idMotivoTipoTramite', [Validators.required]);
    // Common
    this.setFieldValidators('siglasDictaminador', [Validators.required, this.noSoloEspaciosValidator, Validators.maxLength(25)]);
    if (this.procedureId === 260301) {
    this.setFieldValidators('descripcionDetalladaElaboracion', [Validators.required, this.noSoloEspaciosValidator, Validators.maxLength(1000)]);
  } else {
    this.validateCantidadFields();
  }
  }

  private setFieldValidators(fieldName: string, validators: any[]): void {
    const control = this.dictamenForm.get(fieldName);
    if (control && !control.disabled) {
      control.setValidators(validators);
      control.updateValueAndValidity({ onlySelf: true, emitEvent: false });
    }
  }

  private resetAllFieldVisibility(): void {
    this.mostrarCamposFechaAc = false;
    this.mostrarCamposFechaRe = false;
    this.mostrarCamposFechaPl = false;
  }

  private clearAllFieldValidators(): void {
    const allFields = [
      'fundamentoDictamen', 'descripcionFundamentoDictamen',
      'fundamentoNegativoDictamen', 'descripcionFundamentoNegativoDictamen',
      'fundamentoOficioDictamen', 'descripcionFundamentoOficioDictamen',
      'numeroFolioExterno', 'nombreMercancia', 'cantidadSal', 'cantidadBase',
      'justificacionDictamen', 'idMotivoTipoTramite', 'justificacion', 'siglasDictaminador'
    ];
    
    allFields.forEach(field => {
      const control = this.dictamenForm.get(field);
      if (control) {
        control.clearValidators();
        control.setErrors(null);
        control.updateValueAndValidity({ onlySelf: true, emitEvent: false });
      }
    });
  }

  private clearAllValidators(): void {
    Object.keys(this.dictamenForm.controls).forEach(key => {
      const control = this.dictamenForm.get(key);
      if (control) {
        control.clearValidators();
        control.updateValueAndValidity({ emitEvent: false });
      }
    });
  }

  private restoreValidators(): void {
    const cumplimiento = this.dictamenForm.get('cumplimiento')?.value;
    if (cumplimiento) {
      this.actualizarVisibilidadCamposFecha(cumplimiento);
    }
  }

  // Public methods
  actualizarDescripcionFundamentoDictamen(catalogo: Catalogo): void {
    this.dictamenForm.patchValue({ descripcionFundamentoDictamen: catalogo.descripcion });
  }

  actualizarDescripcionFundamentoNegativo(catalogo: Catalogo): void {
    this.dictamenForm.patchValue({ descripcionFundamentoNegativoDictamen: catalogo.descripcion });
  }

  actualizarDescripcionFundamentoOficio(catalogo: Catalogo): void {
    this.dictamenForm.patchValue({ descripcionFundamentoOficioDictamen: catalogo.descripcion });
  }

  valorCambiado(fecha: string): void {
    this.dictamenForm.patchValue({ fechaFinVigencia: fecha });
  }
  
  valorCambiadoIndoc(fecha: string): void {
    this.dictamenForm.patchValue({ fechaInicioVigencia: fecha });
  }

  onAceptadaChangeMercancia(event: Event, index: number): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.mercanciasFormArray.at(index).get('aceptada')?.setValue(checked);
  }

  agregarMercancia(): void {
    const control = this.dictamenForm.get('nombreMercancia');
    const valor = control?.value?.trim();
    console.log(valor,control);
    this.nuevaNotificacion={} as Notificacion; 
    if (!valor) {
    this.nuevaNotificacion = {
    tipoNotificacion: 'alert',
    categoria: CategoriaMensaje.ALERTA,
    modo: '',
    titulo: '',
    mensaje:'Seleccione al menos un nombre de mercancía.',
    cerrar: true,
    txtBtnAceptar: 'Aceptar',
    txtBtnCancelar:'',
    tamanioModal: 'modal-md',
    alineacionBtonoCerrar: 'center',
    alineacionTexto: 'text-center'
  };
        control?.markAsTouched();
        return;
  }

    this.mercanciasFormArray.push(this.createMercancia(valor));
    control?.reset();
    this.validateMercancias();
  }

  eliminarMercanciasSeleccionadas(): void {
        this.nuevaNotificacion={} as Notificacion;
 const haySeleccionadas = this.hayMercanciasSeleccionadas();
 
   this.nuevaNotificacion = {
    tipoNotificacion: 'alert',
    categoria: CategoriaMensaje.ALERTA,
    modo: '',
    titulo: '',
    mensaje: haySeleccionadas
      ? '¿Estás seguro que deseas eliminar los registros marcados?'
      : 'Selecciona un registro.',
    cerrar: true,
    txtBtnAceptar: 'Aceptar',
    txtBtnCancelar: haySeleccionadas ? 'Cancelar' : '',
    tamanioModal: 'modal-md',
    alineacionBtonoCerrar: 'center',
    alineacionTexto: 'text-center'
  };
    this.validateMercancias();
  }

  vistaPreliminar(btnName: string): void {
    this.enviarEvento.emit({ datos: this.dictamenForm.getRawValue(), events: btnName });
  }


  

  private isFormValidForSubmission(): boolean {
    const formValue = this.dictamenForm.getRawValue();
    const cumplimiento = formValue.cumplimiento;
    
    if (!cumplimiento || !formValue.siglasDictaminador?.trim()) return false;

    if (cumplimiento === SENTIDO_DICTAMEN.ACEPTADO) {
      return this.validateAceptadoFields(formValue);
    } else if (cumplimiento === SENTIDO_DICTAMEN.RECHAZADO) {
      return this.validateRechazadoFields(formValue);
    } else if (cumplimiento === SENTIDO_DICTAMEN.PARCIAL) {
      return this.validateParcialFields(formValue);
    }
    return false;
  }

  private validateAceptadoFields(formValue: any): boolean {
    if (!formValue.fundamentoDictamen) return false;
    if (!formValue.descripcionFundamentoDictamen?.trim()) return false;
    if (!formValue.numeroFolioExterno?.trim()) return false;
    if (!formValue.observaciones || formValue.observaciones.length < MIN_MERCANCIAS_REQUIRED) return false;
      if (this.procedureId === 260301) {
    if (!formValue.descripcionDetalladaElaboracion?.trim()) return false;
  } else {
    if (!formValue.cantidadSal?.trim() && !formValue.cantidadBase?.trim()) return false;
  }
    return true;
  }

  private validateRechazadoFields(formValue: any): boolean {
    if (!formValue.fundamentoNegativoDictamen) return false;
    if (!formValue.descripcionFundamentoNegativoDictamen?.trim()) return false;
    if (!formValue.justificacion?.trim()) return false;
    if (!formValue.idMotivoTipoTramite) return false;
    return true;
  }

  private validateParcialFields(formValue: any): boolean {
    if (!formValue.fundamentoDictamen) return false;
    if (!formValue.descripcionFundamentoDictamen?.trim()) return false;
    if (!formValue.numeroFolioExterno?.trim()) return false;
    if (!formValue.observaciones || formValue.observaciones.length < MIN_MERCANCIAS_REQUIRED) return false;
     if (this.procedureId === 260301) {
    if (!formValue.descripcionDetalladaElaboracion?.trim()) return false;
  } else {
    if (!formValue.cantidadSal?.trim() && !formValue.cantidadBase?.trim()) return false;
  }
    if (!formValue.fundamentoOficioDictamen) return false;
    if (!formValue.descripcionFundamentoOficioDictamen?.trim()) return false;
    if (!formValue.justificacionDictamen?.trim()) return false;
    if (!formValue.idMotivoTipoTramiteOficio) return false;
    return true;
  }

  guardar(): void {
    this.markEnabledControlsAsTouched(this.dictamenForm);
    const cumplimiento = this.dictamenForm.get('cumplimiento')?.value;
    if (cumplimiento === SENTIDO_DICTAMEN.ACEPTADO || cumplimiento === SENTIDO_DICTAMEN.PARCIAL) {
      if (this.mercanciasFormArray.length < MIN_MERCANCIAS_REQUIRED) {
        this.dictamenForm.get('nombreMercancia')?.setErrors({ mercanciaRequired: true });
        this.dictamenForm.get('nombreMercancia')?.markAsTouched();
      }
      this.validateCantidadFields();
    }
    
    if (this.isFormValidForSubmission()) {
      this.enviarEvento.emit({ datos: this.dictamenForm.getRawValue(), events: EVENT_TYPE.GUARDAR });
    }
  }

  firmar(): void {
    this.markEnabledControlsAsTouched(this.dictamenForm);
    
    const cumplimiento = this.dictamenForm.get('cumplimiento')?.value;
    if (cumplimiento === SENTIDO_DICTAMEN.ACEPTADO || cumplimiento === SENTIDO_DICTAMEN.PARCIAL) {
      if (this.mercanciasFormArray.length < MIN_MERCANCIAS_REQUIRED) {
        this.dictamenForm.get('nombreMercancia')?.setErrors({ mercanciaRequired: true });
        this.dictamenForm.get('nombreMercancia')?.markAsTouched();
      }
      this.validateCantidadFields();
    }

    if (this.isFormValidForSubmission()) {
      this.enviarEvento.emit({ datos: this.dictamenForm.getRawValue(), events: EVENT_TYPE.FIRMAR });
    }
  }

  cancelar(): void {
    this.enviarEvento.emit({ events: EVENT_TYPE.CANCELAR, datos: {} as DictamenForm });
  }

  isValid(field: string): boolean {
    return this.validacionesService.isValid(this.dictamenForm, field) ?? false;
  }

  get mercanciasFormArray(): FormArray {
    return this.dictamenForm.get('observaciones') as FormArray;
  }

  private createMercancia(nombre: string): FormGroup {
    return this.fb.group({
      nombre: [nombre, Validators.required],
      aceptada: [false]
    });
  }

  private markEnabledControlsAsTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      if (!control.disabled) control.markAsTouched();
    });
  }

  private formatNombreCompleto(e: HistorialObservacione): string {
    const partes = [e.nombre, e.apellido_paterno, e.apellido_materno]
      .map(v => (v && v.trim()) ? v.trim() : '')
      .filter(v => v);
    return partes.length > 0 ? partes.join(' ') : e.cve_usuario;
  }

  private noSoloEspaciosValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value && typeof control.value === 'string' && control.value.trim() === '') {
      return { soloEspacios: true };
    }
    return null;
  }

  inicializarCatalogoOpciens(): void {
    this.catalogoParameter = this.consultaCatalogoService.getCatalogoParameterConfig(this.procedureId);
    
    this.catalogoService.getFundamentoDelRequerimiento(this.procedureId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        if (response) this.fundamentoDictamenOpcions = response.datos as Catalogo[];
      });
      
    this.catalogoService.getFundamentoNegativoDictamen(this.procedureId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        if (response) this.fundamentoNegativoDictamenOpcions = response.datos as Catalogo[];
      });
      
    this.catalogoService.getFundamentoDeOficioDictamen(this.procedureId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        if (response) this.fundamentoOficioDictamenOpcions = response.datos as Catalogo[];
      });
      
    this.catalogoService.getMotivoDelRequerimiento(this.procedureId, this.catalogoParameter?.motivoDelOficio)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        if (response) this.motivoOficioOpcions = response.datos as Catalogo[];
      });
      
    this.catalogoService.getMotivoDeRechazo(this.procedureId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        if (response) this.motivoRechazoOpcions = response.datos as Catalogo[];
      });
  }
  private static toDDMMYYYY(value?: string | null): string | null {
  if (!value) return null;
  const [datePart] = value.split(' ');
  const [year, month, day] = datePart.split('-');
  return `${day}/${month}/${year}`;
}
onConfirmacionModal(event: boolean): void {
  if (!event) {
    return;
  }
  for (let i = this.mercanciasFormArray.length - 1; i >= 0; i--) {
    if (this.mercanciasFormArray.at(i).get('aceptada')?.value) {
      this.mercanciasFormArray.removeAt(i);
    }
  }

  this.validateMercancias();
}

private hayMercanciasSeleccionadas(): boolean {
  return this.mercanciasFormArray.controls.some(
    control => control.get('aceptada')?.value
  );
}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.controlDictaminador.emit(false);
  }
}