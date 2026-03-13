import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from "@angular/forms";
import { Catalogo, CatalogoSelectComponent, ConfiguracionColumna, ConsultaCatalogoService, CveEnumeracionConfig, InputFecha, InputFechaComponent, TablaDinamicaComponent, TablaSeleccion, TituloComponent } from "@libs/shared/data-access-user/src";
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from "@angular/core";
import { GenerarDictamenResponse, HistorialObservacione } from "../../../core/models/evaluar/response/evaluar-estado-evaluacion-response.model";
import { Subject,takeUntil } from "rxjs";
import { CommonModule } from "@angular/common";
import { DictamenForm } from "../../../core/models/autorizar-dictamen/dictamen-form.model";
import { SentidosDisponiblesResponse } from "@libs/shared/data-access-user/src/core/models/shared/sentidos-disponibles.model";
import { TramiteConfigService } from "../../services/tramiteConfig.service";
import { ValidacionesFormularioService } from "@libs/shared/data-access-user/src";

import { IniciarAutorizacionResponse } from "../../../core/models/autorizar-dictamen/iniciar-autorizar-dictamen-response.model";
import { IniciarVerificarResponse } from "../../../core/models/verificar-dictamen/iniciar-verificar-dictamen-response.model";

/**
 * @component
 * @name GenerarDictamenComponent
 * @description Componente para la generación y emisión de dictámenes en el flujo de trámites.
 * 
 * Permite al usuario capturar el mensaje del dictamen y seleccionar el cumplimiento, validando el formulario antes de emitir el evento de guardado.
 * Incluye botones personalizables para guardar y cancelar, y emite eventos hacia el componente padre según la acción realizada.
 * 
 * @selector app-generar-dictamen
 * @standalone true
 * @imports
 *  - CommonModule
 *  - FormsModule
 *  - ReactiveFormsModule
 * @templateUrl ./generar-dictamen.component.html
 * @styleUrl ./generar-dictamen.component.scss
 */
@Component({
  selector: 'app-generar-dictamen-2601',
  standalone: true,
  imports: [CommonModule, CatalogoSelectComponent, FormsModule, InputFechaComponent, TablaDinamicaComponent, ReactiveFormsModule, TituloComponent],
  templateUrl: './generar-dictamen-2601.component.html',
  styleUrl: './generar-dictamen-2601.component.scss'
})
export class GenerarDictamen2601Component implements OnInit, OnChanges, OnDestroy {
 
 sampleDestinadoparaOpcions: Catalogo[] = [
  { id: 1, clave: 'CAT1', descripcion: 'Opción 1' },
  { id: 2, clave: 'CAT2', descripcion: 'Opción 2' },
  { id: 3, clave: 'CAT3', descripcion: 'Opción 3' }
];
 
 
  /**
   * @event controlDictaminador
   * @description Emite un valor booleano al componente padre indicando el estado del dictaminador.
   * Si se emite true, el dictaminador está activo; si se emite false, está inactivo.
   */
  @Output() controlDictaminador: EventEmitter<boolean> = new EventEmitter();

  /**
   * @property {boolean} sentidoInput
   * @description Indica si el input de sentido está habilitado.
   * Si es true, el input de sentido está habilitado; si es false, está deshabilitado.
   * Por defecto, el input de sentido está deshabilitado (false).
   */
  @Input() sentidoInput: boolean = false;

  @Input() procedureId:number=0;

  /**
   * Si es true, los antecedentes son editables; si es false, son de solo lectura.
   */
  @Input() public soloLectura = false;

  mostrarFecha =false;

  fechaConfig: InputFecha = {
    labelNombre: 'Fecha de fin de vigencia autorizada',
    required: false,
    habilitado: true,
  }
  /**
   * @property {FormGroup} dictamenForm
   * @description Formulario reactivo para la captura de los datos del dictamen.
   */
  public dictamenForm!: FormGroup;
  /**
   * @property {boolean} mostrarCamposFechaAc
   * @description Controla la visibilidad de los campos de fecha de vigencia autorizada.
   * Se muestra cuando el sentido del dictamen es "Aceptado" (valor '1').
   */
  public mostrarCamposFechaAc = false;
  public mostrarCamposFechaRe = false;
  public mostrarCamposFechaPl = false;
  public tablaTablaSeleccion = TablaSeleccion.CHECKBOX;
  filasSeleccionadas: number[] = [];
  esVistaPrevia: boolean = false;
  /**
   * @property {EventEmitter<{ events: string, datos: unknown }>} enviarEvento
   * @description Evento emitido al guardar o cancelar el dictamen, enviando el tipo de evento y los datos asociados.
   */
  @Output() public enviarEvento = new EventEmitter<{ events: string, datos: DictamenForm }>();
  /**
   * @property {string} botonDeCancelar
   * @description Texto personalizado para el botón de cancelar.
   */
  @Input() public botonDeCancelar = '';

  /**
  * Indica si se debe mostrar un input de justificación.
  * En unos tramites se muestra un input de justificacion.
  */
  @Input() inputSentidos!: boolean;


  /**
   * @property {IniciarDictamenResponse} dataIniciarDictamen
   * @description Datos del dictamen iniciados, utilizados para prellenar el formulario.
   * Debe ser proporcionado por el componente padre.
   */
  @Input() dataIniciarDictamen!: GenerarDictamenResponse | IniciarAutorizacionResponse | IniciarVerificarResponse;


  /**
  * @property {SentidosDisponiblesResponse} opcionesSentidosDisponibles
  * @description Datos para el llenado de los radios de los sentidos disponibles.
  */
  @Input() opcionesSentidosDisponibles: SentidosDisponiblesResponse[] = [];

  /**
   * @property {string} conformidad
   * @description Texto que representa los antecedentes del dictamen, utilizado para mostrar información relevante.
   * Por defecto, se establece en una constante definida en las constantes generales.
   */
  // @Input() public conformidad!: CriteriosResponse;

  /**
   * @property {string} botonGuardar
   * @description Texto personalizado para el botón de guardar.
   */
  @Input() public botonGuardar = '';
  /**
   * @property {boolean} mostrarTitulo
   * @description Bandera que controla la visibilidad del título "Generar Dictamen".
   * Si es true, el título se muestra; si es false, el título se oculta.
   */
  @Input() public mostrarTitulo = true;

  /**
   * Indica si el anexo 222 se encuentra seleccionado o habilitado.
   * 
   * @defaultValue true
   */
  @Input() public anexo222se = true;

  /**
   * @property {string} resultadoEvaluacion
   * @description Almacena el resultado de la evaluación del dictamen.
   */
  public resultadoEvaluacion: string = '';

  /** 
   * @property {Subject<void>} destroy$ 
   * @description Subject utilizado para manejar la destrucción del componente y evitar fugas de memoria.
   */
  private destroy$ = new Subject<void>();

  /** Datos para las observaciones de dictamen */

  public destinadoparaOpcions: Catalogo[] = [];
  
  justificacionNegativaLabel:string=''
   motivoLabel:string=''
   motivoOpcions:Catalogo[]=[];
   motivoOficioOpcions:Catalogo[]=[];
   motivoRechazoOpcions:Catalogo[]=[];

  public restriccioneOpcions: Catalogo[] = [];

  /**
 * @property {Catalogo[]} observacionesOpcions
 * @description Contiene las opciones de observaciones que se pueden seleccionar.
 */
  public observacionesOpcions:Catalogo[] = [];

  /**
 * @property {Catalogo[]} plazoOpcions
 * @description Almacena las opciones de plazos disponibles en el sistema.
 */
  public plazoOpcions: Catalogo[] = [];

  /**
 * @property {Catalogo[]} fundamentoDictamenOpciones
 * @description Almacena las opciones de fundamentos del dictamen disponibles para selección.
 */
  public fundamentoDictamenOpciones: Catalogo[] = [];

  /**
 * @property {Catalogo[]} fundamentoOficioDictamenOpciones
 * @description Contiene las opciones de fundamentos del oficio de dictamen disponibles para selección.
 */
  public fundamentoOficioDictamenOpciones: Catalogo[] = [];


  public autorizadorOpcions:Catalogo[]=[{
    id:1,
    clave:'OIGJ530820E37',
    descripcion:'OLIVARES GALVEZ JUAN CARLOS'
  }]

  @Input() public tituloComponente:string='Generar Dictamen';


  destinadoParaCatalogoParameter!:CveEnumeracionConfig;
  public evaluarObservacionesDictamen: HistorialObservacione[] = [];
  public tablaObservacionesDictamen: ConfiguracionColumna<HistorialObservacione>[] = [
      { encabezado: "Fecha de generación", clave: (e: HistorialObservacione) => e.fecha_observacion, orden: 1 },
      { encabezado: "Fecha de atención", clave: (e: HistorialObservacione) => e.fecha_atencion, orden: 2 },
      { encabezado: "Generada por", clave: (e: HistorialObservacione) => {
              const PARTES = [e.nombre, e.apellido_paterno, e.apellido_materno]
                .map(v => (v && v.trim()) ? v.trim() : '')
              .filter(v => v);
            return PARTES.length > 0 ? PARTES.join(' ') : e.cve_usuario;
          }, orden: 3 },
      { encabezado: "Estatus", clave: (e: HistorialObservacione) => e.estado_observacion, orden: 4 },
      { encabezado: "Detalle", clave: (e: HistorialObservacione) => e.observacion, orden: 5 }
    ];

  /**
   * Configuración de la tabla de observaciones del dictamen.
   *
   * Define las columnas que se mostrarán en la tabla de observaciones del dictamen,
   * incluyendo encabezado, clave de acceso a los datos y orden de despliegue.
   */

  /**
   * @constructor
   * @description Constructor del componente. Inicializa los servicios necesarios para la creación y validación del formulario de dictamen.
   * 
   * @param {FormBuilder} fb - Servicio para la creación de formularios reactivos.
   * @param {ValidacionesFormularioService} validacionesService - Servicio para validaciones personalizadas de formularios.
   */
  constructor(private fb: FormBuilder, private validacionesService: ValidacionesFormularioService,private catalogoService:ConsultaCatalogoService, private tramiteConfigService: TramiteConfigService) {
    
  }
  /**
   * @method ngOnInit
   * @description Método del ciclo de vida que se ejecuta al inicializar el componente.
   * 
   * Inicializa el formulario reactivo `dictamenForm` con los campos requeridos:
   * - cumplimiento: valor por defecto '1'.
   * - mensajeDictamen: campo obligatorio.
   * 
   * @returns {void}
   */
  ngOnInit(): void {

    this.destinadoparaOpcions = this.sampleDestinadoparaOpcions;

    this.inicializarCatalogoOpciens();
    this.InitDictamenForm();


    // Suscribirse a los cambios del campo cumplimiento para controlar la visibilidad de los campos de fecha
    this.dictamenForm.get('cumplimiento')?.valueChanges.subscribe(value => {
      this.actualizarVisibilidadCamposFecha(value);
    });

    // Establecer el estado inicial
    this.actualizarVisibilidadCamposFecha(this.dictamenForm.get('cumplimiento')?.value);

    if (this.soloLectura) {
      this.dictamenForm.disable();
    }else {
      this.dictamenForm.get('siglasDictaminador')?.enable();
    }
    if (this.inputSentidos) {
      this.dictamenForm.removeControl('cumplimiento');
    }
    this.controlDictaminador.emit(true);
  }

  InitDictamenForm():void
  {
    this.dictamenForm = this.fb.group({
      cumplimiento: ['', Validators.required],

      justificacionNegativa: ['', [
        Validators.required,
        GenerarDictamen2601Component.noSoloEspacios,
        Validators.maxLength(2000)
      ]],
      idMotivoTipoTramite: [''],

      fundamentoDelDictamen: [''],
      descripcionFundamentoDelDictamen: ['', [Validators.required,
      GenerarDictamen2601Component.noSoloEspacios,
      Validators.maxLength(2000)]],

      justificacionDelDictamen: [''],
      descripcionJustificacionDelDictamen: ['', [Validators.required,
      GenerarDictamen2601Component.noSoloEspacios,
      Validators.maxLength(2000)]],

      plazoVigencia: ['', Validators.required],
      requesitoCumplir: ['', Validators.required],
      fechaFinVigencia: ['',Validators.required],
      tipoAnalisis: ['', [GenerarDictamen2601Component.noSoloEspacios,
      Validators.maxLength(2000)]],
      numMuestras: [''],

      negativoDelDictamen: [''],
      descripcionNegativoDelDictamen: ['', [Validators.required,
      GenerarDictamen2601Component.noSoloEspacios,
      Validators.maxLength(2000)]],

      fundamentoOficioDelDictamen: [''],
      descripcionFundamentoOficioDelDictamen: ['', [Validators.required,
      GenerarDictamen2601Component.noSoloEspacios,
      Validators.maxLength(2000)]],

      siglasDictaminador: ['', Validators.required],
      numeroGenerico1: ['', Validators.required],
      
      aceptada:[false],
      mercancia_0_aceptada:['Rechazada']
    });
  }
  /**
   * @method noSoloEspacios
   * @description Validador personalizado que verifica que el campo no contenga solo espacios en blanco.
   * 
   * @param {AbstractControl} control - Control del formulario a validar.
   * @returns {ValidationErrors | null} Retorna un objeto de error si el valor es solo espacios, de lo contrario retorna null.
   */
  static noSoloEspacios(control: AbstractControl): ValidationErrors | null {
    if (control.value && typeof control.value === 'string' && control.value.trim() === '') {
      return { soloEspacios: true };
    }
    return null;
  }

  actualizarDescripcion(campo: string, catalogo: Catalogo): void {
    this.dictamenForm.patchValue({
      [campo]: catalogo.descripcion
    });
  }
  
 inicializarCatalogoOpciens(): void {
    this.catalogoService.getFundamentoDelDictamen(this.procedureId)
      .pipe(takeUntil(this.destroy$)).subscribe(
        (response) => {
          const DATOS = response.datos as Catalogo[];
          if (response) { this.fundamentoDictamenOpciones = DATOS; }
        })

         this.catalogoService.getObservaciones(this.procedureId)
        .pipe(takeUntil(this.destroy$)).subscribe(
        (response) => {
          const DATOS = response.datos as Catalogo[];
          if (response) { this.observacionesOpcions = DATOS; }
        })

        this.catalogoService.getPlazo(this.procedureId)
        .pipe(takeUntil(this.destroy$)).subscribe(
        (response) => {
          const DATOS = response.datos as Catalogo[];
          if (response) { this.plazoOpcions = DATOS; }
        })

        this.catalogoService.getRestricciones(this.procedureId)
        .pipe(takeUntil(this.destroy$)).subscribe(
        (response) => {
          const DATOS = response.datos as Catalogo[];
          if (response) { this.restriccioneOpcions = DATOS; }
        })

        this.catalogoService.getAsignarAutorizador(this.procedureId)
        .pipe(takeUntil(this.destroy$)).subscribe(
        (response) => {
          const DATOS = response.datos as Catalogo[];
          if (response) { this.autorizadorOpcions = DATOS; }
        })

        this.catalogoService.getFundamentoOficioDictamen(this.procedureId)
        .pipe(takeUntil(this.destroy$)).subscribe(
        (response) => {
          const DATOS = response.datos as Catalogo[];
          if (response) { this.fundamentoOficioDictamenOpciones = DATOS; }
        })

  }

  plazoChange(valor:Catalogo): void
  {
        if(valor.clave==='PZVI.FFV'){
          this.updateFieldValidators(['fechaFinVigencia'])
          this.mostrarFecha=true
        }
        else{
          this.mostrarFecha=false
          this.clearFieldValidators(['fechaFinVigencia'])
          this.valorCambiado('')
        }
  }

  valorCambiado(fecha:string):void{
   this.dictamenForm.patchValue({
   fechaFinVigencia:fecha
   })
  }
onAceptadaChange(event: Event) :void {
  const EVENT = event.target as HTMLInputElement;
  const ISCHECKED=EVENT.checked

  this.dictamenForm.get('mercancia_0_aceptada')
      ?.setValue(ISCHECKED ? 'Aceptada' : 'Rechazada', { emitEvent: false });
}
  /**
   * @method actualizarVisibilidadCamposFecha
   * @description Actualiza la visibilidad de los campos de fecha de vigencia autorizada
   * basado en el valor del sentido del dictamen.
   * 
   * @param {string} valorCumplimiento - El valor del campo cumplimiento ('1' para Aceptado, '2' para Rechazado)
   * @returns {void}
   */
  private actualizarVisibilidadCamposFecha(valorCumplimiento: string): void {

    if (valorCumplimiento === null || valorCumplimiento === undefined) {
      this.mostrarCamposFechaAc = false;
      this.mostrarCamposFechaRe = false;
      this.mostrarCamposFechaPl = false;
      return;
    }
    const ESDICTAMENACEPTADO = valorCumplimiento === 'SEDI.AC';
    const ESDICTAMENRECHAZADO = valorCumplimiento === 'SEDI.RZ';
    const ESDICTAMENPARCIAL = valorCumplimiento === 'SEDI.PA';

    this.mostrarCamposFechaAc = ESDICTAMENACEPTADO;
    this.mostrarCamposFechaRe = ESDICTAMENRECHAZADO;
    this.mostrarCamposFechaPl = ESDICTAMENPARCIAL;


    if (ESDICTAMENACEPTADO) {
      this.updateFieldValidators(['fundamentoDelDictamen', 'descripcionFundamentoDelDictamen', 'justificacionDelDictamen',
        'descripcionJustificacionDelDictamen', 'plazoVigencia','requesitoCumplir', 'fechaFinVigencia', 'siglasDictaminador', 'numeroGenerico1']);
    } else {
      this.clearFieldValidators(['fundamentoDelDictamen', 'descripcionFundamentoDelDictamen', 'justificacionDelDictamen',
        'descripcionJustificacionDelDictamen', 'plazoVigencia','requesitoCumplir', 'fechaFinVigencia', 'siglasDictaminador', 'numeroGenerico1' ])
    }
    if (ESDICTAMENRECHAZADO) {
      this.updateFieldValidators(['justificacionNegativa', 'idMotivoTipoTramite', 'negativoDelDictamen', 'descripcionNegativoDelDictamen', 'siglasDictaminador']);
      this.justificacionNegativaLabel='Justificación negativa del dictamen';
      this.motivoLabel='Motivo del rechazo';
      this.catalogoService.getMotivoDeRechazo(this.procedureId)
      .pipe(takeUntil(this.destroy$)).subscribe((response) => {
        const DATOS = response.datos as Catalogo[];
      if (response) { this.motivoOpcions = DATOS; }
      });
    } else {
      this.clearFieldValidators(['justificacionNegativa', 'idMotivoTipoTramite', 'negativoDelDictamen', 'descripcionNegativoDelDictamen']);
    }
    if (ESDICTAMENPARCIAL) {
      this.justificacionNegativaLabel='Justificación del oficio del dictamen';
      this.motivoLabel='Motivo del oficio';
      this.catalogoService.getMotivoDelRequerimiento(this.procedureId,'TIMTTR.DP')
        .pipe(takeUntil(this.destroy$)).subscribe((response) => {
          const DATOS = response.datos as Catalogo[];
          if (response) { this.motivoOpcions = DATOS; }
        });
      this.updateFieldValidators(['fundamentoDelDictamen', 'descripcionFundamentoDelDictamen',
        'justificacionDelDictamen', 'descripcionJustificacionDelDictamen', 'justificacionNegativa', 'idMotivoTipoTramite', 'plazoVigencia','requesitoCumplir',
      'fechaFinVigencia', 'negativoDelDictamen', 'descripcionNegativoDelDictamen', 'fundamentoOficioDelDictamen',
    'descripcionFundamentoOficioDelDictamen', 'siglasDictaminador']);
    } else {
      this.clearFieldValidators(['fundamentoOficioDelDictamen', 'descripcionFundamentoOficioDelDictamen',])
    }
  }
  private updateFieldValidators(fields: string[] = []): void {
    if (this.soloLectura) {
      return;
    }
    fields.forEach(field => {
      const CONTROL = this.dictamenForm.get(field);
      if (CONTROL) {
        CONTROL.enable();
        CONTROL.updateValueAndValidity({ onlySelf: true });
      }
    });
  }

  private clearFieldValidators(fields: string[] = []): void {
    fields.forEach(field => {
      const CONTROL = this.dictamenForm.get(field);
      if (CONTROL) {
       CONTROL.setValue('');
        CONTROL.disable({ emitEvent: false });
        CONTROL.updateValueAndValidity({ onlySelf: true });
      }
    });
  }

// eslint-disable-next-line class-methods-use-this
private markEnabledControlsAsTouched(formGroup: FormGroup): void {
  Object.values(formGroup.controls).forEach(control => {
    if (!control.disabled) {
      control.markAsTouched();
    }
  });
}

  /**
   * @method isValid
   * @description Verifica si un campo específico del formulario es válido utilizando el servicio de validaciones personalizadas.
   * 
   * @param {string} field - Nombre del campo a validar.
   * @returns {boolean} Retorna `true` si el campo es válido, de lo contrario `false`.
   */
  isValid(field: string): boolean {
    const VALIDATIONRESULT = this.validacionesService.isValid(
      this.dictamenForm,
      field
    );
    return VALIDATIONRESULT === null ? false : VALIDATIONRESULT;
  }
  
  vistaPreliminar(btnName: string): void {
    this.enviarEvento.emit({
      datos: this.dictamenForm.value as DictamenForm,
      events: btnName
    });
  }
  /**
   * @method ngOnChanges
   * @description Método del ciclo de vida que se ejecuta cuando cambian las propiedades de entrada del componente.
   * 
   * Si la propiedad `conformidad` cambia, actualiza el valor del campo `antecedentesReadonly` en el formulario.
   * 
   * @param {SimpleChanges} changes - Objeto que contiene los cambios en las propiedades de entrada.
   * @returns {void}
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataIniciarDictamen'] && changes['dataIniciarDictamen'].currentValue && this.dictamenForm) {
       GenerarDictamen2601Component.patchFormData(this.dictamenForm, this.dataIniciarDictamen);
      this.evaluarObservacionesDictamen = this.dataIniciarDictamen.historial_observaciones ?? [];

      if(this.dictamenForm.get('plazoVigencia')?.value === 'PZVI.FFV') {
          this.updateFieldValidators(['fechaFinVigencia'])
          this.mostrarFecha=true
        }
        else{
          this.mostrarFecha=false
          this.clearFieldValidators(['fechaFinVigencia'])
        }

        if(this.dataIniciarDictamen.ide_sent_dictamen){
          this.esVistaPrevia=true;
        }
        else{
          this.esVistaPrevia=false;
        }
    
    }
    if (changes['sentidoInput']) {
      this.resultadoEvaluacion = this.sentidoInput ? 'Aceptado' : 'Rechazado';
    }

    if(changes['procedureId'] && changes['procedureId'].currentValue){
      this.destinadoParaCatalogoParameter = this.catalogoService.getCatalogoParameterConfig(this.procedureId);
    }  
  }

  static patchFormData(dictamenForm: FormGroup, dataIniciarDictamen: GenerarDictamenResponse | IniciarAutorizacionResponse | IniciarVerificarResponse): void {
      dictamenForm.patchValue({
        cumplimiento: dataIniciarDictamen.ide_sent_dictamen,
        descripcionObjetoimportacion: dataIniciarDictamen.descripcionObjetoimportacion ?? dataIniciarDictamen.descripcion_objetoimportacion ?? '',
        idRestriccionTipoTramite: dataIniciarDictamen.idRestriccionTipoTramites?.[0] ?? '',
        descripcionDetalladaMercancia: dataIniciarDictamen.descripcionDetalladaMercancia ?? dataIniciarDictamen.descripcion_detallada_mercancia ?? '',
        idClasificacionToxicologicaTipoTramite:
          (dataIniciarDictamen.idClasificacionToxicologicaTipoTramite !== undefined && dataIniciarDictamen.idClasificacionToxicologicaTipoTramite !== null && dataIniciarDictamen.idClasificacionToxicologicaTipoTramite !== "")
            ? dataIniciarDictamen.idClasificacionToxicologicaTipoTramite
            : (dataIniciarDictamen.id_clasificacion_toxicologica_tipo_tramite ?? ''),
        descripcionUsoAutorizado: dataIniciarDictamen.descripcionUsoAutorizado ?? '',
        justificacion: dataIniciarDictamen.justificacion ?? '',
        idMotivoTipoTramite: dataIniciarDictamen.idMotivoTipoTramites?.[0] ?? dataIniciarDictamen.id_motivo_tipo_tramites?.[0] ?? '',
        siglasDictaminador: dataIniciarDictamen.siglasDictaminador ?? '',
        numeroGenerico1: dataIniciarDictamen.numeroGenerico1 ?? '',
        numMuestras: dataIniciarDictamen.numMuestras ?? '',
        opinion: dataIniciarDictamen.tipoAnalisis ?? '',
        justificacion_dictamen: dataIniciarDictamen.descripcionJustificacionDelDictamen ?? '',
        tipoAnalisis: dataIniciarDictamen.tipoAnalisis ?? '',
        fundamentoDelDictamen: dataIniciarDictamen.fundamentoDelDictamen ?? '',
        descripcionFundamentoDelDictamen: dataIniciarDictamen.descripcionFundamentoDelDictamen ?? '',
        justificacionDelDictamen: dataIniciarDictamen.justificacionDelDictamen ?? '',
        descripcionJustificacionDelDictamen: dataIniciarDictamen.descripcionJustificacionDelDictamen ?? '',
        plazoVigencia: dataIniciarDictamen.plazoVigencia ?? '',
      });
  }

static formatDate(dateTime: string): string {
  if(!dateTime){
    return '';
  }
  const [DATE] = dateTime.split(" ");
  const [YEAR, MONTH, DAY] = DATE.split("-");
  return `${DAY}/${MONTH}/${YEAR}`;
}

  /**
  * @method guardar
  * @description Marca todos los campos del formulario como tocados y, si el formulario es válido, emite el evento de guardado con los datos del dictamen.
  * 
  * @returns {void}
  */
  guardar(): void {
  this.markEnabledControlsAsTouched(this.dictamenForm);
    if (this.dictamenForm.valid) {
      this.enviarEvento.emit({
        datos: this.dictamenForm.value,
        events: "guardar"
      });
    }
  }

  /**
  * @method firmar
  * @description Marca todos los campos del formulario como tocados y, si el formulario es válido, emite el evento de firmado con los datos del dictamen.
  * 
  * @returns {void}
  */
  firmar(): void {
    this.markEnabledControlsAsTouched(this.dictamenForm);
    if (this.dictamenForm.valid) {
      this.enviarEvento.emit({
        datos: this.dictamenForm.value as DictamenForm,
        events: "firmar"
      });
    }
  }
  /**
   * @method guardarFirmar
   * @description Marca todos los campos del formulario como tocados y, si el formulario es válido, emite el evento de guardado con los datos del dictamen.
   * 
   * @returns {void}
   */
  guardarFirmar(): void {
    this.markEnabledControlsAsTouched(this.dictamenForm);
    if (this.dictamenForm.valid) {
      this.enviarEvento.emit({
        datos: this.dictamenForm.value as DictamenForm,
        events: "guardar"
      });
    }
  }
  /**
   * @method cancelar
   * @description Emite el evento de cancelación hacia el componente padre, enviando el tipo de evento "cancelar" y datos nulos.
   * 
   * @returns {void}
   */
  cancelar(): void {
    this.enviarEvento.emit({ events: "cancelar", datos: {} as DictamenForm });
  }

  /**
   * @method ngOnDestroy
   * @description Método del ciclo de vida que se ejecuta cuando el componente es destruido.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.controlDictaminador.emit(false);
  }
}
