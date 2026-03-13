import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, QueryList, SimpleChanges, ViewChildren } from "@angular/core";
import { Subject, takeUntil } from "rxjs";

import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { Catalogo, CatalogoSelectComponent, ConsultaCatalogoService, CrossListLable, CrosslistComponent, CveEnumeracionConfig, InputFecha, InputFechaComponent, TablaSeleccion } from "@libs/shared/data-access-user/src";


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
 * Permite al usuario capturar el mensaje del dictamen y seleccionar el sentidoDictamen, validando el formulario antes de emitir el evento de guardado.
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
  selector: 'app-generar-dictamen-26050',
  standalone: true,
  imports: [CommonModule, CatalogoSelectComponent, FormsModule, ReactiveFormsModule, InputFechaComponent, CrosslistComponent],
  templateUrl: './generar-dictamen.component.html',
  styleUrl: './generar-dictamen.component.scss',
})
export class GenerarDictamen260501Component implements OnInit, OnChanges, OnDestroy {

  /**
   * Referencias a los componentes de listas cruzadas.
   */
  @ViewChildren(CrosslistComponent) crossList!: QueryList<CrosslistComponent>;

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
  /**
   * @property {string} nombreAccion
   * @description Nombre de la acción que se realizará, por ejemplo: 'autorizarDictamen' o 'verificarDictamen'.
   */
  @Input() public nombreAccion: string = '';

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
    fechaConfig: InputFecha = {
      labelNombre: 'Fecha de fin de vigencia autorizada',
      required: false,
      habilitado: false,
    }
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
  @Input() dataIniciarDictamen!: GenerarDictamenResponse | IniciarVerificarResponse | IniciarAutorizacionResponse;


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
   * @property {boolean} mostrarPaisFabrica
   * @description Bandera que indica si se debe mostrar el campo de país donde se fabrica el ingrediente activo.
   * Si es true, el campo se muestra; si es false, se oculta.
   */
  @Input() mostrarPaisFabrica:boolean = false;

  /**
   * @property {boolean} mostrarPaisElabora
   * @description Bandera que indica si se debe mostrar el campo de país donde se elabora el producto.
   * Si es true, el campo se muestra; si es false, se oculta.
   */
  @Input() mostrarPaisElabora:boolean = false;

  /** Indica si se deben mostrar los países seleccionados en la lista cruzada. */
  @Input() mostrarPaisesSeleccionados:boolean = false;

  /** Indica si se deben mostrar los países de origen en la lista cruzada. */
  @Input() public isFechaFinVigencia: boolean = true;

  @Input() isAsignarAutorizador: boolean = true;

  /** @property {string} titulo
   * @description Título del componente, por defecto es 'Generar Dictamen'.
   */
  @Input() public titulo = 'Generar Dictamen';

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
  
  /**
   * Etiqueta que representa el motivo asociado a la acción o dictamen generado.
   * Se utiliza para mostrar información descriptiva al usuario.
   */
   motivoLabel: string = '';

  /**
   * Arreglo que contiene las opciones del catálogo de motivos.
   * Cada elemento es de tipo `Catalogo`.
   * Se utiliza para poblar listas desplegables o seleccionar motivos en el componente.
   */
   motivoOpcions:Catalogo[]=[];

  /**
   * Arreglo que contiene las opciones del catálogo para el motivo parcial.
   * Cada elemento es de tipo `Catalogo` y representa una opción seleccionable en el componente.
   */
   motivoPracialOptcions:Catalogo[]=[];

  /**
   * Lista de opciones de motivos de rechazo disponibles para seleccionar.
   * Cada elemento es un objeto del catálogo que representa un motivo específico de rechazo.
   */
   motivoRechazoOpcions:Catalogo[]=[];

  /**
   * Arreglo que contiene las opciones del catálogo de restricciones disponibles.
   * Cada elemento es de tipo `Catalogo`, representando una restricción posible para seleccionar.
   */
   public restriccioneOpcions: Catalogo[] = [];

  /**
   * Arreglo que contiene las opciones de observaciones, representadas por objetos del tipo `Catalogo`.
   * Este arreglo se utiliza para mostrar y seleccionar diferentes observaciones disponibles en el componente.
   */
  public observacionesOpcions:Catalogo[] = [];

  /**
   * Lista de opciones para la clasificación toxicológica.
   * Cada elemento representa un catálogo disponible para seleccionar la clasificación correspondiente.
   */
   public clasificacionToxicologicaOpcions: Catalogo[] = [];

  /**
   * Lista de opciones disponibles para el autorizador.
   * Cada elemento de la lista es un objeto de tipo `Catalogo`.
   * Esta propiedad se utiliza para poblar selectores o listas desplegables
   * relacionadas con la selección de un autorizador en el componente.
   */
  public autorizadorOpcions:Catalogo [] = []

  /**
   * Arreglo que contiene los países y bloques disponibles.
   * Cada elemento es de tipo `Catalogo`, representando un país o bloque específico.
   * Utilizado para poblar listas desplegables o seleccionar países/bloques en el componente.
   */
  public paisesBloques: Catalogo[] = [];

  /**
   * Arreglo que contiene las descripciones de los países o bloques seleccionados.
   * 
   * Este arreglo se utiliza para almacenar las descripciones asociadas a los países o bloques
   * que forman parte del dictamen generado en el componente.
   */
  public paisesBloquesDescripcion: string[] = [];


  /**
   * Parámetro que representa la configuración de enumeración para el campo "destinado para catálogo".
   * Utiliza la interfaz CveEnumeracionConfig para definir las opciones disponibles.
   */
  destinadoParaCatalogoParameter!:CveEnumeracionConfig;

  /**
   * Almacena el valor seleccionado para el sentido del dictamen.
   * 
   * Este valor representa la opción elegida por el usuario en el componente relacionado
   * con la generación del dictamen. Se espera que sea una cadena de texto que identifique
   * el sentido del dictamen (por ejemplo, "aprobado", "rechazado", etc.).
   */
  sentidoDictamenValues: string ='';

  /**
   * @property {string[]} seleccionadasPaisFabricaDatos
   * Lista de países seleccionados como origen.
   */
  public seleccionadasPaisFabricaDatos: string[] = [];

  /**
   * @property {string[]} seleccionadasPaisElaboraDatos
   * Lista de países seleccionados como origen.
   */
  public seleccionadasPaisElaboraDatos: string[] = [];

  /** Etiquetas personalizadas para los crosslists */
  public paisFabricaLabel: CrossListLable = {
    tituluDeLaIzquierda: 'País donde se fabrica el ingrediente activo (TÉCNICO)',
    derecha: 'País(es) seleccionado(s)',
  };

  /** Etiquetas personalizadas para los crosslists */
  public paisElaboraLabel: CrossListLable = {
    tituluDeLaIzquierda: 'País donde se elabora el producto (FORMULADO)',
    derecha: 'País(es) seleccionado(s)',
  };

  /** 
   * Indica si ha habido un cambio en el sentido del dictamen mediante checkbox 
   */
  public seentidoChangeCheckbox:boolean = false;

  /**
   * Botones de acción para gestionar listas de forma farmacéutica.
   */
  get botonesFabrica(): { btnNombre: string; class: string; funcion: () => void }[] {
    return this.getCrossListBtn(0);
  }

  /**
   * Botones de acción para gestionar listas de forma farmacéutica.
   */
  get botonesElabora(): { btnNombre: string; class: string; funcion: () => void }[] {
    return this.getCrossListBtn(1);
  }

  /**
   * Genera una lista de configuraciones de botones para operaciones de listas cruzadas.
   * Cada configuración de botón incluye un nombre, una clase CSS y una función
   * para realizar una acción específica en la lista cruzada.
   *
   * @param index Índice del crosslist component (0: forma farmacéutica, 1: país origen, 2: uso específico)
   * @returns Un arreglo de objetos de configuración de botones, donde cada objeto contiene:
   * - `btnNombre`: El nombre que se mostrará en el botón.
   * - `class`: La clase CSS para estilizar el botón.
   * - `funcion`: Una función de callback para ejecutar la acción correspondiente.
   *
   * Las acciones disponibles son:
   * - "Agregar todos": Agrega todos los elementos a la lista cruzada.
   * - "Agregar selección": Agrega los elementos seleccionados a la lista cruzada.
   * - "Restar selección": Elimina los elementos seleccionados de la lista cruzada.
   * - "Restar todos": Elimina todos los elementos de la lista cruzada.
   */
  public getCrossListBtn(index: number = 0): { btnNombre: string; class: string; funcion: () => void }[] {
    return [
      { 
        btnNombre: 'Agregar', 
        class: 'btn-default', 
        funcion: (): void => {
          if (this.crossList && this.crossList.toArray()[index]) {
            this.crossList.toArray()[index].agregar('');
          }
        }
      },
      { 
        btnNombre: 'Agregar todos', 
        class: 'btn-primary', 
        funcion: (): void => {
          if (this.crossList && this.crossList.toArray()[index]) {
            this.crossList.toArray()[index].agregar('t');
          }
        }
      },
      { 
        btnNombre: 'Eliminar', 
        class: 'btn-danger', 
        funcion: (): void => {
          if (this.crossList && this.crossList.toArray()[index]) {
            this.crossList.toArray()[index].quitar('');
          }
        }
      },
      { 
        btnNombre: 'Eliminar todos', 
        class: 'btn-default', 
        funcion: (): void => {
          if (this.crossList && this.crossList.toArray()[index]) {
            this.crossList.toArray()[index].quitar('t');
          }
        }
      },
    ];
  }

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
    this.InitDictamenForm();
  }
  /**
   * @method ngOnInit
   * @description Método del ciclo de vida que se ejecuta al inicializar el componente.
   * 
   * Inicializa el formulario reactivo `dictamenForm` con los campos requeridos:
   * - sentidoDictamen: valor por defecto '1'.
   * - mensajeDictamen: campo obligatorio.
   * 
   * @returns {void}
   */
  ngOnInit(): void {

    this.aceptadoOpciones();

    // Suscribirse a los cambios del campo sentidoDictamen para controlar la visibilidad de los campos de fecha
    this.dictamenForm.get('sentidoDictamen')?.valueChanges.subscribe(value => {
      this.onSentidoChange(value);
      // this.actualizarVisibilidadCamposFecha(value);
    });

    // Establecer el estado inicial
    // this.actualizarVisibilidadCamposFecha(this.dictamenForm.get('sentidoDictamen')?.value);

    if (this.soloLectura) {
      this.dictamenForm.disable();
      this.dictamenForm.get('decripcionObjetoimportacion')?.disable();
      this.fechaConfig={...this.fechaConfig, required:true,habilitado:!this.soloLectura}
    }
    if (this.inputSentidos) {
      this.dictamenForm.removeControl('sentidoDictamen');
    }
    this.controlDictaminador.emit(true);

    if(!this.isFechaFinVigencia) {
      this.dictamenForm.get('fechaFinVigencia')?.clearValidators();
      this.dictamenForm.get('fechaFinVigencia')?.updateValueAndValidity();
    }
    if(this.procedureId === 260507 || this.procedureId === 260510) {
      this.dictamenForm.get('blnGenerico1')?.clearValidators();
      this.dictamenForm.get('fechaFinVigencia')?.clearValidators();
      this.dictamenForm.get('blnGenerico1')?.updateValueAndValidity();
      this.dictamenForm.get('fechaFinVigencia')?.updateValueAndValidity();
    }
  }

  /**
   * Inicializa el formulario reactivo para la captura de datos del dictamen.
   */
  InitDictamenForm():void {
    this.dictamenForm = this.fb.group({
      /** Sentido del dictamen (Aceptado, Rechazado, Parcial) */
      sentidoDictamen: ['', Validators.required],
      /** Descripción del objeto de importación */
      decripcionObjetoimportacion: ['', [Validators.required, GenerarDictamen260501Component.noSoloEspacios, Validators.maxLength(400)]], 
      /** Restricción del tipo de trámite */
      idRestriccionTipoTramite: ['', Validators.required], 
      /** Justificación del dictamen */
      justificacion: ['', [Validators.required, GenerarDictamen260501Component.noSoloEspacios]], 
      /** Motivo del tipo de trámite */
      idMotivoTipoTramite: ['', Validators.required], 
      /** Siglas del dictaminador */
      siglasDictaminador: ['', this.seentidoChangeCheckbox ? [Validators.required,GenerarDictamen260501Component.noSoloEspacios, Validators.maxLength(20)] : []], 
      /** Número genérico asociado al trámite */
      numeroGenerico1: ['', Validators.required],
      /** Bandera para activar campo genérico */
      blnGenerico1: [''],
      /** Fecha de fin de vigencia autorizada */
      fechaFinVigencia: ['',Validators.required],
      /** Lista de países donde se fabrica el ingrediente activo */
      paisFabricaDatos: [],
      /** Lista de países donde se elabora el producto */
      paisElaboraDatos: [],
      /** Claves de países donde se fabrica el ingrediente activo */
      paisFabricaIdDatos: [],
      /** Claves de países donde se elabora el producto */
      paisElaboraIdDatos: [],
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
   * Maneja el cambio de sentido del dictamen y actualiza las opciones y visibilidad de campos según el valor seleccionado.
   */
  onSentidoChange(SELECTEDVALUE: string): void {
    if (SELECTEDVALUE === null || SELECTEDVALUE === undefined) {
      this.seentidoChangeCheckbox = false;
      return;
    }
    if (SELECTEDVALUE === 'SEDI.RZ') {
      this.seentidoChangeCheckbox = true;
      this.dictamenForm.get('siglasDictaminador')?.setValidators([Validators.required,GenerarDictamen260501Component.noSoloEspacios, Validators.maxLength(20)]);
      this.dictamenForm.get('siglasDictaminador')?.updateValueAndValidity();
      this.catalogoService.getMotivoDeRechazoReqParam(
        this.procedureId,
        this.destinadoParaCatalogoParameter?.motivoDeRechazo ?? ''
      )
        .pipe(takeUntil(this.destroy$)).subscribe(
        (response) => {
          const DATOS = response.datos as Catalogo[];
          if (response) { 
            this.motivoRechazoOpcions = DATOS;
            this.actualizarVisibilidadCamposFecha(SELECTEDVALUE);
              this.dictamenForm.patchValue({
              idMotivoTipoTramite: this.dataIniciarDictamen.idMotivoTipoTramites?.[0] || this.dataIniciarDictamen.id_motivo_tipo_tramites?.[0]
            });
            
           }
        })
    }

    if (SELECTEDVALUE === 'SEDI.PA') {
      this.seentidoChangeCheckbox = true;
      this.dictamenForm.get('siglasDictaminador')?.setValidators([Validators.required,GenerarDictamen260501Component.noSoloEspacios, Validators.maxLength(20)]);
      this.dictamenForm.get('siglasDictaminador')?.updateValueAndValidity();
      this.obtenerPaisBloques();
      this.catalogoService.getMotivoDelRequerimiento(this.procedureId, this.destinadoParaCatalogoParameter?.motivoDelOficio)
      .pipe(takeUntil(this.destroy$)).subscribe(
      (response) => {
        const DATOS = response.datos as Catalogo[];
        if (response) { 
          this.motivoPracialOptcions = DATOS;
          this.actualizarVisibilidadCamposFecha(SELECTEDVALUE);
            this.dictamenForm.patchValue({
            idMotivoTipoTramite: this.dataIniciarDictamen.idMotivoTipoTramites?.[0] || this.dataIniciarDictamen.id_motivo_tipo_tramites?.[0]
          });
         }
      })
    }

    if (SELECTEDVALUE === 'SEDI.AC') {
      this.seentidoChangeCheckbox = true;
      this.dictamenForm.get('siglasDictaminador')?.setValidators([Validators.required,GenerarDictamen260501Component.noSoloEspacios, Validators.maxLength(20)]);
      this.dictamenForm.get('siglasDictaminador')?.updateValueAndValidity();
      this.aceptadoOpciones();
      this.actualizarVisibilidadCamposFecha(SELECTEDVALUE);
    }
  }

  /**
   * Obtiene y actualiza las opciones relacionadas con el sentido 'Aceptado' del dictamen, incluyendo restricciones, autorizadores y países.
   */
  aceptadoOpciones(): void {
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

        this.obtenerPaisBloques();
        
  }

  /**
   * Obtiene los países por bloques y actualiza las listas de países seleccionados.
   */
  obtenerPaisBloques(): void {
    this.catalogoService.getPaisBloques(this.procedureId)
        .pipe(takeUntil(this.destroy$)).subscribe(
        (response) => {
          const DATOS = response.datos as Catalogo[];
          if (response) {
            this.paisesBloques = DATOS;
            this.paisesBloquesDescripcion = (response.datos as Catalogo[]).map(item => item.descripcion);

            const PAISES_FACTURADOR = this.dataIniciarDictamen?.paisesFacturador ?? [];
            if (PAISES_FACTURADOR?.length > 0) {
              this.seleccionadasPaisFabricaDatos = DATOS
                .filter(pais => pais.clave !== undefined && PAISES_FACTURADOR.includes(pais.clave))
                .map(pais => pais.descripcion);
            }

            const PAISES_FORMULA = this.dataIniciarDictamen?.paisesFormula ?? [];
            if (PAISES_FORMULA?.length > 0) {
              this.seleccionadasPaisElaboraDatos = DATOS
                .filter(pais => pais.clave !== undefined && PAISES_FORMULA.includes(pais.clave))
                .map(pais => pais.descripcion);
            }
          }
        })
  }



  /**
   * @method actualizarVisibilidadCamposFecha
   * @description Actualiza la visibilidad de los campos de fecha de vigencia autorizada
   * basado en el valor del sentido del dictamen.
   * 
   * @param {string} valorsentidoDictamen - El valor del campo sentidoDictamen ('1' para Aceptado, '2' para Rechazado)
   * @returns {void}
   */
  private actualizarVisibilidadCamposFecha(valorsentidoDictamen: string): void {

    if (valorsentidoDictamen === null || valorsentidoDictamen === undefined || valorsentidoDictamen === '') {
      this.mostrarCamposFechaAc = false;
      this.mostrarCamposFechaRe = false;
      this.mostrarCamposFechaPl = false;
      return;
    }
    const ESDICTAMENACEPTADO = valorsentidoDictamen === 'SEDI.AC';
    const ESDICTAMENRECHAZADO = valorsentidoDictamen === 'SEDI.RZ';
    const ESDICTAMENPARCIAL = valorsentidoDictamen === 'SEDI.PA';

    this.mostrarCamposFechaAc = ESDICTAMENACEPTADO;
    this.mostrarCamposFechaRe = ESDICTAMENRECHAZADO;
    this.mostrarCamposFechaPl = ESDICTAMENPARCIAL;


    if (!ESDICTAMENPARCIAL) {
      if (ESDICTAMENACEPTADO) {
      this.updateFieldValidators(['decripcionObjetoimportacion', 'idRestriccionTipoTramite',
         'blnGenerico1','fechaFinVigencia']);
    } else {
        this.clearFieldValidators(['decripcionObjetoimportacion', 'idRestriccionTipoTramite','blnGenerico1','fechaFinVigencia'])
      }
    }
    
    if (!ESDICTAMENPARCIAL) {
      if (ESDICTAMENRECHAZADO) {
      this.updateFieldValidators(['justificacion', 'idMotivoTipoTramite']);
      this.motivoLabel='Motivo del rechazo';
      this.motivoOpcions = [];
      this.motivoOpcions=this.motivoRechazoOpcions;
      } else {
        this.clearFieldValidators(['justificacion', 'idMotivoTipoTramite']);
      }
    }
    
    if (ESDICTAMENPARCIAL) {
      this.motivoLabel='Motivo del oficio';
      this.motivoOpcions = [];
      this.motivoOpcions=this.motivoPracialOptcions;
      this.clearFieldValidators(['idMotivoTipoTramite', 'idRestriccionTipoTramite']);
      this.updateFieldValidators(['decripcionObjetoimportacion', 'idRestriccionTipoTramite',
        'justificacion', 'idMotivoTipoTramite','blnGenerico1','fechaFinVigencia']);
    }
  }
  
  /**
   * Habilita y actualiza la validez de los campos indicados en el formulario, excepto si está en modo solo lectura.
   */
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

  /**
   * Limpia, deshabilita y actualiza la validez de los campos indicados en el formulario.
   */
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

    /**
     * Marca como tocados todos los controles habilitados del formulario.
     */
    static markEnabledControlsAsTouched(formGroup: FormGroup): void {
      Object.values(formGroup.controls).forEach(control => {
        if (!control.disabled) {
          control.markAsTouched();
        }
      });
    }

  /**
   * Maneja el cambio del campo blnGenerico1, habilitando o deshabilitando la fecha de vigencia según el estado del checkbox.
   */
  blnChange(event:Event): void {
    if (this.soloLectura) {
      return;
    }
    const CHECK = (event.target as HTMLInputElement).checked;
    this.dictamenForm.patchValue({
      blnGenerico1: CHECK
    });
    if(CHECK){
      this.updateFieldValidators(['fechaFinVigencia'])
      this.fechaConfig={...this.fechaConfig, required:true,habilitado:true}
    }
    else{
      this.clearFieldValidators(['fechaFinVigencia'])
      this.valorCambiado('')
      this.fechaConfig={...this.fechaConfig, required:false,habilitado:false}
    }
  }


  /**
   * Actualiza el campo fechaFinVigencia en el formulario con la fecha proporcionada.
   */
  valorCambiado(fecha:string):void{
   this.dictamenForm.patchValue({
   fechaFinVigencia:fecha
   })
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
  
  /**
   * Emite un evento para mostrar la vista preliminar del dictamen con los datos actuales del formulario.
   */
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
      this.patchValues(changes['dataIniciarDictamen'].currentValue);

      if(this.dataIniciarDictamen.ide_sent_dictamen){
        this.esVistaPrevia=true;
      }
      else{
        this.esVistaPrevia=false;
      }
      this.blnChange({target:{checked:this.dataIniciarDictamen.blnGenerico1}} as unknown as Event);
    }
    if (changes['sentidoInput']) {
      this.resultadoEvaluacion = this.sentidoInput ? 'Aceptado' : 'Rechazado';
    }

    if(changes['procedureId'] && changes['procedureId'].currentValue){
      this.destinadoParaCatalogoParameter = this.catalogoService.getCatalogoParameterConfig(this.procedureId);
    }  
  }

  /**
   * Actualiza los valores del formulario dictamenForm con los datos recibidos del dictamen o verificación.
   */
  patchValues(data: GenerarDictamenResponse | IniciarVerificarResponse | IniciarAutorizacionResponse): void {
    this.sentidoDictamenValues = data.ide_sent_dictamen || '';
    this.dictamenForm.patchValue({
      descripcionObjetoimportacion: data.descripcionObjetoimportacion || data.descripcionObjetoImportacion || '',
      decripcionObjetoimportacion: data.descripcionObjetoimportacion || data.descripcionObjetoImportacion || '',
      idRestriccionTipoTramite: data.idRestriccionTipoTramites?.[0] ,
      justificacion: data.justificacion ?? '',
      idMotivoTipoTramite: data.idMotivoTipoTramites?.[0] || data.id_motivo_tipo_tramites?.[0],
      siglasDictaminador: data.siglasDictaminador ?? '',
      numeroGenerico1: data.numeroGenerico1 ?? '',
      blnGenerico1: data.blnGenerico1 ?? false,
      fechaFinVigencia: GenerarDictamen260501Component.formatearFecha(data.fecha_fin_vigencia || '') || '',
      sentidoDictamen: data.ide_sent_dictamen ?? '',
    });

    if (this.soloLectura) {
      this.dictamenForm.get('decripcionObjetoimportacion')?.disable({ emitEvent: false });
    }
  }

  /**
   * Formatea una cadena de fecha en el formato DD/MM/YYYY.
   */
  static formatearFecha(dateString: string): string {
    if (dateString === '') {
      return '';
    }
    const DATE = new Date(dateString);
    const DAY = String(DATE.getDate()).padStart(2, '0');
    const MONTH = String(DATE.getMonth() + 1).padStart(2, '0');
    const YEAR = DATE.getFullYear();
    return `${DAY}/${MONTH}/${YEAR}`;
  }


  /**
  * @method guardar
  * @description Marca todos los campos del formulario como tocados y, si el formulario es válido, emite el evento de guardado con los datos del dictamen.
  * 
  * @returns {void}
  */
  guardar(): void {
    GenerarDictamen260501Component.markEnabledControlsAsTouched(this.dictamenForm);
    if (this.dictamenForm.valid) {
      this.enviarEvento.emit({
        datos: this.dictamenForm.value,
        events: "guardar"
      });
    } else {
      this.dictamenForm.markAllAsTouched();
    }
  }

  /**
  * @method firmar
  * @description Marca todos los campos del formulario como tocados y, si el formulario es válido, emite el evento de firmado con los datos del dictamen.
  * 
  * @returns {void}
  */
  firmar(): void {
    GenerarDictamen260501Component.markEnabledControlsAsTouched(this.dictamenForm);
    if (this.dictamenForm.valid) {
      this.enviarEvento.emit({
        datos: this.dictamenForm.value as DictamenForm,
        events: "firmar"
      });
    } else {
      this.dictamenForm.markAllAsTouched();
    }
  }
  /**
   * @method guardarFirmar
   * @description Marca todos los campos del formulario como tocados y, si el formulario es válido, emite el evento de guardado con los datos del dictamen.
   * 
   * @returns {void}
   */
  guardarFirmar(): void {
    GenerarDictamen260501Component.markEnabledControlsAsTouched(this.dictamenForm);
    if (this.dictamenForm.valid) {
      this.enviarEvento.emit({
        datos: this.dictamenForm.value as DictamenForm,
        events: "guardar"
      });
    } else {
      this.dictamenForm.markAllAsTouched();
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
   * Método que se ejecuta cuando cambia la selección de países de origen.
   * Actualiza la lista de países seleccionados y sincroniza el formulario de mercancía
   * con los datos seleccionados.
   *
   * @param events - Arreglo de cadenas que representa los países seleccionados.
   */
  paisFabricaSeleccionadasChange(events: string[]): void {
    this.seleccionadasPaisFabricaDatos = events;
    const CLAVES_SELECCIONADAS: string[] = events
    .map(item =>
      this.paisesBloques.find(p => p.descripcion === item)?.clave
    )
    .filter((clave): clave is string => Boolean(clave));
    this.dictamenForm.patchValue({
      paisFabricaDatos: events,
      paisFabricaIdDatos: CLAVES_SELECCIONADAS,
    });
  }

  /**
   * Método que se ejecuta cuando cambia la selección de países de origen.
   * Actualiza la lista de países seleccionados y sincroniza el formulario de mercancía
   * con los datos seleccionados.
   *
   * @param events - Arreglo de cadenas que representa los países seleccionados.
   */
  paisElaboraSeleccionadasChange(events: string[]): void {
    this.seleccionadasPaisElaboraDatos = events;
    const CLAVES_SELECCIONADAS: string[] = events
    .map(item =>
      this.paisesBloques.find(p => p.descripcion === item)?.clave
    )
    .filter((clave): clave is string => Boolean(clave));
    this.dictamenForm.patchValue({
      paisElaboraDatos: events,
      paisElaboraIdDatos: CLAVES_SELECCIONADAS,
    });
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
