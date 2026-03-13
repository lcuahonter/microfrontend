import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from "@angular/core";
import { Subject, takeUntil } from "rxjs";

import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { Catalogo, CatalogoSelectComponent, ConsultaCatalogoService, CveEnumeracionConfig, TablaSeleccion } from "@libs/shared/data-access-user/src";


import { SentidosDisponiblesResponse } from "@libs/shared/data-access-user/src/core/models/shared/sentidos-disponibles.model";

import { ValidacionesFormularioService } from "@libs/shared/data-access-user/src";

//import { CriteriosResponse } from "@libs/shared/data-access-user/src/core/models/shared/criterios-response.model";
import { DictamenForm } from "../../../core/models/autorizar-dictamen/dictamen-form.model";
import { GenerarDictamenResponse } from "../../../core/models/evaluar/response/evaluar-estado-evaluacion-response.model";
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
  selector: 'app-generar-dictamen-26051',
  standalone: true,
  imports: [CommonModule, CatalogoSelectComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './generar-dictamen.component.html',
  styleUrl: './generar-dictamen.component.scss',
})
export class GenerarDictamen260514Component implements OnInit, OnChanges, OnDestroy {
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
  @Input() public tituloComponente:string='Generar Dictamen';
  /**
   * Si es true, los antecedentes son editables; si es false, son de solo lectura.
   */
  @Input() public soloLectura = false;

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
  @Input() public mostrarTitulo = false;

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
  private pendingDataIniciarDictamen: boolean=true;
   motivoLabel:string=''
   motivoOpcions:Catalogo[]=[];
   motivoPracialOptcions:Catalogo[]=[];
   motivoRechazoOpcions:Catalogo[]=[];

   public restriccioneOpcions: Catalogo[] = [];

  public observacionesOpcions:Catalogo[] = [];

   public clasificacionToxicologicaOpcions: Catalogo[] = [];

  public autorizadorOpcions:Catalogo[]=[{
    id:1,
    clave:'OIGJ530820E37',
    descripcion:'OLIVARES GALVEZ JUAN CARLOS'
  }]


  destinadoParaCatalogoParameter!:CveEnumeracionConfig;

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
  constructor(private fb: FormBuilder, private validacionesService: ValidacionesFormularioService,private catalogoService:ConsultaCatalogoService) {
    
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
    this.inicializarCatalogoOpciens();
    this.InitDictamenForm();

    // Suscribirse a los cambios del campo cumplimiento para controlar la visibilidad de los campos de fecha
    this.dictamenForm.get('cumplimiento')?.valueChanges.subscribe(value => {
      this.actualizarVisibilidadCamposFecha(value);
    });

    // Establecer el estado inicial
    this.actualizarVisibilidadCamposFecha(this.dictamenForm.get('cumplimiento')?.value);

    if (this.inputSentidos) {
      this.dictamenForm.removeControl('cumplimiento');
    }
    // Ensure form is disabled after all logic if soloLectura is true
    if (this.soloLectura) {
      this.dictamenForm.disable();
    }
    this.controlDictaminador.emit(true);
    if(this.dataIniciarDictamen && this.dictamenForm && this.pendingDataIniciarDictamen)
    {
       GenerarDictamen260514Component.patchFormData(this.dictamenForm, this.dataIniciarDictamen);
        if(this.dataIniciarDictamen.ide_sent_dictamen){
          this.esVistaPrevia=true;
        }
        else{
          this.esVistaPrevia=false;
        }
    }
  }

  InitDictamenForm():void
  {
    this.dictamenForm = this.fb.group({
      cumplimiento: ['', Validators.required],
      descripcionObjetoimportacion: ['', [Validators.required, GenerarDictamen260514Component.noSoloEspacios, Validators.maxLength(400)]], 
      idRestriccionTipoTramite: ['', Validators.required], 
      descripcionDetalladaMercancia: ['',[GenerarDictamen260514Component.noSoloEspacios, Validators.maxLength(100)]], 
      idClasificacionToxicologicaTipoTramite: ['', Validators.required], 
      descripcionUsoAutorizado: ['', [Validators.required, GenerarDictamen260514Component.noSoloEspacios, Validators.maxLength(200)]], 
      justificacion: ['', [Validators.required, GenerarDictamen260514Component.noSoloEspacios, Validators.maxLength(2000)]], 
      idMotivoTipoTramite: ['', Validators.required], 
      siglasDictaminador: ['', [Validators.required,GenerarDictamen260514Component.noSoloEspacios, Validators.maxLength(20)]], 
      numeroGenerico1: ['', Validators.required],
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

  
  /**
   * @method inicializarCatalogoOpciens
   * @description Inicializa los catálogos necesarios para el formulario de dictamen, obteniendo las opciones de restricciones, clasificación toxicológica, autorizadores y motivos desde los servicios de catálogo según el procedimiento actual.
   * Llama a los servicios de catálogo y asigna los resultados a las propiedades correspondientes del componente.
   * @returns {void}
   */
  inicializarCatalogoOpciens(): void {

         this.catalogoService.getRestricciones(this.procedureId)
        .pipe(takeUntil(this.destroy$)).subscribe(
        (response) => {
          const DATOS = response.datos as Catalogo[];
          if (response) { this.restriccioneOpcions = DATOS; }
        })

        this.catalogoService.getClasificacionToxicologica(this.procedureId)
        .pipe(takeUntil(this.destroy$)).subscribe(
        (response) => {
          const DATOS = response.datos as Catalogo[];
          if (response) { this.clasificacionToxicologicaOpcions = DATOS; }
        })

        this.catalogoService.getAsignarAutorizador(this.procedureId)
        .pipe(takeUntil(this.destroy$)).subscribe(
        (response) => {
          const DATOS = response.datos as Catalogo[];
          if (response) { this.autorizadorOpcions = DATOS; }
        })

        this.catalogoService.getMotivoDeRechazo(this.procedureId)
        .pipe(takeUntil(this.destroy$)).subscribe(
        (response) => {
          const DATOS = response.datos as Catalogo[];
          if (response) { this.motivoRechazoOpcions = DATOS; }
        })

        this.catalogoService.getMotivoDelRequerimiento(this.procedureId, this.destinadoParaCatalogoParameter?.motivoDelOficio)
        .pipe(takeUntil(this.destroy$)).subscribe(
        (response) => {
          const DATOS = response.datos as Catalogo[];
          if (response) { this.motivoPracialOptcions = DATOS; }
        })

  }
 

  /**
   * @method actualizarVisibilidadCamposFecha
   * @description Actualiza la visibilidad de los campos de fecha de vigencia autorizada
   * basado en el valor del sentido del dictamen.
   * 
   * @param {string} valorcumplimiento - El valor del campo cumplimiento ('1' para Aceptado, '2' para Rechazado)
   * @returns {void}
   */
  private actualizarVisibilidadCamposFecha(valorcumplimiento: string): void {

    if (valorcumplimiento === null || valorcumplimiento === undefined) {
      this.mostrarCamposFechaAc = false;
      this.mostrarCamposFechaRe = false;
      this.mostrarCamposFechaPl = false;
      return;
    }
    const ESDICTAMENACEPTADO = valorcumplimiento === 'SEDI.AC';
    const ESDICTAMENRECHAZADO = valorcumplimiento === 'SEDI.RZ';
    const ESDICTAMENPARCIAL = valorcumplimiento === 'SEDI.PA';

    this.mostrarCamposFechaAc = ESDICTAMENACEPTADO;
    this.mostrarCamposFechaRe = ESDICTAMENRECHAZADO;
    this.mostrarCamposFechaPl = ESDICTAMENPARCIAL;


    if (ESDICTAMENACEPTADO) {
      this.updateFieldValidators(['descripcionObjetoimportacion', 'idRestriccionTipoTramite', '',
        'descripcionDetalladaMercancia', 'idClasificacionToxicologicaTipoTramite', 'descripcionUsoAutorizado']);
    } else {
      this.clearFieldValidators(['descripcionObjetoimportacion', 'idRestriccionTipoTramite', '',
        'descripcionDetalladaMercancia', 'idClasificacionToxicologicaTipoTramite', 'descripcionUsoAutorizado'])
    }
    if (ESDICTAMENRECHAZADO) {
      this.updateFieldValidators(['justificacion', 'idMotivoTipoTramite']);
      this.motivoLabel='Motivo de rechazo';
        this.motivoOpcions=this.motivoRechazoOpcions;
    } else {
      this.clearFieldValidators(['justificacion', 'idMotivoTipoTramite']);
    }
    if (ESDICTAMENPARCIAL) {
      this.motivoLabel='Motivo del oficio';
        this.motivoOpcions = this.motivoPracialOptcions;
      this.updateFieldValidators(['descripcionObjetoimportacion', 'idRestriccionTipoTramite', '',
        'descripcionDetalladaMercancia', 'idClasificacionToxicologicaTipoTramite', 'descripcionUsoAutorizado',
        'justificacion', 'idMotivoTipoTramite']);
    }
  }
  private updateFieldValidators(fields: string[] = []): void {
    // Prevent enabling fields if soloLectura is true
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
    if (this.soloLectura) {
      return;
    }
    fields.forEach(field => {
      const CONTROL = this.dictamenForm.get(field);
      if (CONTROL) {
        CONTROL.disable({ emitEvent: false });
        CONTROL.updateValueAndValidity({ onlySelf: true });
      }
    });
  }


static markEnabledControlsAsTouched(formGroup: FormGroup): void {
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
        // this.dataVerificarDictamen = resp.datos ?? {} as IniciarVerificarResponse;
          GenerarDictamen260514Component.patchFormData(this.dictamenForm, this.dataIniciarDictamen);
         this.pendingDataIniciarDictamen=false
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
      });
  }

  /**
  * @method guardar
  * @description Marca todos los campos del formulario como tocados y, si el formulario es válido, emite el evento de guardado con los datos del dictamen.
  * 
  * @returns {void}
  */
  guardar(): void {
  GenerarDictamen260514Component.markEnabledControlsAsTouched(this.dictamenForm);
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
    GenerarDictamen260514Component.markEnabledControlsAsTouched(this.dictamenForm);
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
    GenerarDictamen260514Component.markEnabledControlsAsTouched(this.dictamenForm);
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
