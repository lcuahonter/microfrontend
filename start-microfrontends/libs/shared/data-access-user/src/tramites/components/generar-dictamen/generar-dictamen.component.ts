import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from "@angular/core";

import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ConfiguracionColumna } from "../../../core/models/shared/configuracion-columna.model";

import { HistorialObservacione, IniciarDictamenResponse } from "../../../core/models/shared/iniciar-dictamen-response.model";
import { SentidosDisponiblesResponse } from "../../../core/models/shared/sentidos-disponibles.model";
import { ValidacionesFormularioService } from "../../../core/services/shared/validaciones-formulario/validaciones-formulario.service";

import { CriteriosResponse } from "../../../core/models/shared/criterios-response.model";
import { DictamenForm } from "../../../core/models/shared/dictamen-form.model";
import { IniciarAutorizacionResponse } from "../../../core/models/shared/iniciar-autorizar-dictamen-response.model";
import { Subject } from "rxjs";
import { TablaDinamicaComponent } from "../tabla-dinamica/tabla-dinamica.component";
import { TituloComponent } from "../titulo/titulo.component";



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
  selector: 'app-generar-dictamen',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TablaDinamicaComponent, TituloComponent],
  templateUrl: './generar-dictamen.component.html',
  styleUrl: './generar-dictamen.component.scss',
})
export class GenerarDictamenComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * @event controlDictaminador
   * @description Emite un valor booleano al componente padre indicando el estado del dictaminador.
   * Si se emite true, el dictaminador está activo; si se emite false, está inactivo.
   */
  @Output() controlDictaminador: EventEmitter<boolean> = new EventEmitter();

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
   * @property {boolean} mostrarCamposFecha
   * @description Controla la visibilidad de los campos de fecha de vigencia autorizada.
   * Se muestra cuando el sentido del dictamen es "Aceptado" (valor '1').
   */
  public mostrarCamposFecha = false;

  /**
   * @property {boolean} habilitarFechasPorAceptacion
   * @description Controla si los campos de fecha de vigencia autorizada deben mostrarse solo cuando el dictamen es aceptado.
   */
  @Input() habilitarFechasPorAceptacion: boolean = false;

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
   * @property {boolean} isAntecedentes
   * @description Bandera que indica si los antecedentes son editables o no.
   * Si es true, los antecedentes son editables; si es false, son de solo lectura.
   */
  @Input() public isAntecedentes = true;

  /**
   * @property {IniciarDictamenResponse} dataIniciarDictamen
   * @description Datos del dictamen iniciados, utilizados para prellenar el formulario.
   * Debe ser proporcionado por el componente padre.
   */
  @Input() dataIniciarDictamen!: IniciarDictamenResponse;

  /**
   * @property {IniciarAutorizacionResponse} dataIniciarDictamenAutorizar
   * @description Datos del dictamen de autorización iniciados, utilizados para prellenar el formulario.
   * Debe ser proporcionado por el componente padre.
   */
  @Input() dataIniciarDictamenAutorizar!: IniciarAutorizacionResponse;

   /**
   * @property {SentidosDisponiblesResponse} opcionesSentidosDisponibles
   * @description Datos para el llenado de los radios de los sentidos disponibles.
   */
  @Input() opcionesSentidosDisponibles : SentidosDisponiblesResponse[] = [];

  /**
   * @property {string} conformidad
   * @description Texto que representa los antecedentes del dictamen, utilizado para mostrar información relevante.
   * Por defecto, se establece en una constante definida en las constantes generales.
   */
  @Input() public conformidad!: CriteriosResponse;

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
  public evaluarObservacionesDictamen: HistorialObservacione[] = [];

  /**
   * @property {unknown} sentidoInput
   * @description Permite recibir un valor externo para el input de sentido, utilizado para controlar el estado del input desde el componente padre.
   */
  @Input() sentidoInput: unknown;

  /**
   * Configuración de la tabla de observaciones del dictamen.
   *
   * Define las columnas que se mostrarán en la tabla de observaciones del dictamen,
   * incluyendo encabezado, clave de acceso a los datos y orden de despliegue.
   */
  public tablaObservacionesDictamen: ConfiguracionColumna<HistorialObservacione>[] = [
    { encabezado: "Fecha de generación", clave: (e: HistorialObservacione) => e.fecha_observacion, orden: 1 },
    { encabezado: "Fecha de atención", clave: (e: HistorialObservacione) => e.fecha_atencion, orden: 2 },
    { encabezado: "Generada por", clave: (e: HistorialObservacione) => e.cve_usuario, orden: 3 },
    { encabezado: "Estatus", clave: (e: HistorialObservacione) => e.estado_observacion, orden: 4 },
    { encabezado: "Detalle", clave: (e: HistorialObservacione) => e.observacion, orden: 5 }
  ];
  
  /**
   * @constructor
   * @description Constructor del componente. Inicializa los servicios necesarios para la creación y validación del formulario de dictamen.
   * 
   * @param {FormBuilder} fb - Servicio para la creación de formularios reactivos.
   * @param {ValidacionesFormularioService} validacionesService - Servicio para validaciones personalizadas de formularios.
   */
  constructor(private fb: FormBuilder, private validacionesService: ValidacionesFormularioService,) {
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
    this.dictamenForm = this.fb.group({
      cumplimiento: ['', [Validators.required]],
      mensajeDictamen: ['', [
        Validators.required,
        GenerarDictamenComponent.noSoloEspacios,
        Validators.maxLength(10000)
      ]],
      antecedentesEditables: ['', [
        Validators.required,
        GenerarDictamenComponent.noSoloEspacios,
        Validators.maxLength(2000)
      ]],
      antecedentesReadonly: [{
        value: 'Fracción I numeral 2 del Anexo 2.2.2 del Acuerdo por el que la Secretaría de Economía emite reglas y criterios de carácter general en materia de Comercio Exterior, publicado en el Diario Oficial de la Federación el 6 de julio de 2007 y sus modificaciones.',
        disabled: true
      }],
      fechaInicioVigenciaAutorizada: [{ value: '', disabled: true }],
      fechaFinVigenciaAutorizada: [{ value: '', disabled: true }]
    });

    // Si hay antecedentes de conformidad, se establece en el campo de solo lectura
    if (this.conformidad) {
      this.dictamenForm.get('antecedentesReadonly')?.setValue(this.conformidad.texto_dictamen);
    }

    // Si los antecedentes no son editables, se elimina el control de antecedentesEditables
    if (!this.isAntecedentes) {
      this.dictamenForm.removeControl('antecedentesEditables');
    }

    // Suscribirse a los cambios del campo cumplimiento para controlar la visibilidad de los campos de fecha
    this.dictamenForm.get('cumplimiento')?.valueChanges.subscribe(value => {
      this.actualizarVisibilidadCamposFecha(value);
    });

    // Establecer el estado inicial
    this.actualizarVisibilidadCamposFecha(this.dictamenForm.get('cumplimiento')?.value);

    if(this.soloLectura){
      this.dictamenForm.disable();
    }
   
     this.controlDictaminador.emit(true); 
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
   * @method actualizarVisibilidadCamposFecha
   * @description Actualiza la visibilidad de los campos de fecha de vigencia autorizada
   * basado en el valor del sentido del dictamen.
   * 
   * @param {string} valorCumplimiento - El valor del campo cumplimiento ('1' para Aceptado, '2' para Rechazado)
   * @returns {void}
   */
  private actualizarVisibilidadCamposFecha(valorCumplimiento: string): void {
    const ESDICTAMENACEPTADO = valorCumplimiento === 'SEDI.AC';

    this.mostrarCamposFecha = this.habilitarFechasPorAceptacion && ESDICTAMENACEPTADO;
    
    // Actualizar validadores según la visibilidad
    const FECHAINICIOCONTROL = this.dictamenForm.get('fechaInicioVigenciaAutorizada');
    const FECHAFINCONTROL = this.dictamenForm.get('fechaFinVigenciaAutorizada');

    if (ESDICTAMENACEPTADO) {
      // Si el dictamen es aceptado, los campos de fecha son obligatorios
      FECHAINICIOCONTROL?.setValidators([Validators.required]);
      FECHAFINCONTROL?.setValidators([Validators.required]);
    } else {
      // Si el dictamen es rechazado, remover validadores y limpiar valores
      FECHAINICIOCONTROL?.clearValidators();
      FECHAFINCONTROL?.clearValidators();
    }

    // Actualizar el estado de validación
    FECHAINICIOCONTROL?.updateValueAndValidity();
    FECHAFINCONTROL?.updateValueAndValidity();
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
   * @method ngOnChanges
   * @description Método del ciclo de vida que se ejecuta cuando cambian las propiedades de entrada del componente.
   * 
   * Si la propiedad `conformidad` cambia, actualiza el valor del campo `antecedentesReadonly` en el formulario.
   * 
   * @param {SimpleChanges} changes - Objeto que contiene los cambios en las propiedades de entrada.
   * @returns {void}
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['conformidad'] && this.dictamenForm) {
      this.dictamenForm.get('antecedentesReadonly')?.setValue(this.conformidad.texto_dictamen);
      this.dictamenForm.patchValue({
        fechaInicioVigenciaAutorizada: this.conformidad.fecha_inicio,
        fechaFinVigenciaAutorizada: this.conformidad.fecha_fin_vigencia,
      });
    }
    if (changes['dataIniciarDictamen'] && changes['dataIniciarDictamen'].currentValue && this.dictamenForm) {
      this.dictamenForm.patchValue({
        cumplimiento: this.dataIniciarDictamen.ide_sent_dictamen,
        mensajeDictamen: this.dataIniciarDictamen.justificacion,
        fechaInicioVigenciaAutorizada: this.dataIniciarDictamen.fecha_inicio_vigencia,
        fechaFinVigenciaAutorizada: this.dataIniciarDictamen.fecha_fin_vigencia,
      });
      if(this.dataIniciarDictamen.texto_dictamen){
        this.dictamenForm.get('antecedentesEditables')?.setValue(this.dataIniciarDictamen.texto_dictamen);
      }
      this.evaluarObservacionesDictamen = this.dataIniciarDictamen.historial_observaciones || [];
    }

     if (changes['dataIniciarDictamenAutorizar'] && changes['dataIniciarDictamenAutorizar'].currentValue) {
      this.dictamenForm.get('antecedentesReadonly')?.setValue(this.dataIniciarDictamenAutorizar.texto_dictamen);
      this.dictamenForm.patchValue({
        cumplimiento: this.dataIniciarDictamenAutorizar.ide_sent_dictamen,
        mensajeDictamen: this.dataIniciarDictamenAutorizar.justificacion,
        fechaInicioVigenciaAutorizada: this.dataIniciarDictamenAutorizar.fecha_inicio_vigencia,
        fechaFinVigenciaAutorizada: this.dataIniciarDictamenAutorizar.fecha_fin_vigencia,
      });
      this.evaluarObservacionesDictamen = this.dataIniciarDictamenAutorizar.historial_observaciones || [];
    }

  }

  /**
  * @method guardar
  * @description Marca todos los campos del formulario como tocados y, si el formulario es válido, emite el evento de guardado con los datos del dictamen.
  * 
  * @returns {void}
  */
  guardar(): void {
    this.dictamenForm.markAllAsTouched();
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
    this.dictamenForm.markAllAsTouched();
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
    this.dictamenForm.markAllAsTouched();
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
