import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { ConsultaCatalogoService, ValidacionesFormularioService } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { DictamenForm } from '../../../core/models/autorizar-dictamen/dictamen-form.model';
import { GenerarDictamenResponse } from '../../../core/models/evaluar/response/evaluar-estado-evaluacion-response.model';
import { IniciarAutorizacionResponse } from '../../../core/models/autorizar-dictamen/iniciar-autorizar-dictamen-response.model';
import { IniciarVerificarResponse } from '../../../core/models/verificar-dictamen/iniciar-verificar-dictamen-response.model';
import { SentidosDisponiblesResponse } from "@libs/shared/data-access-user/src/core/models/shared/sentidos-disponibles.model";
import { Subject } from 'rxjs';
import { TramiteConfigService } from '../../services/tramiteConfig.service';

@Component({
  selector: 'app-generar-dictamen-2617',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './generar-dictamen-261701.component.html',
  styleUrl: './generar-dictamen-261701.component.scss',
})
export class GenerarDictamen261701Component implements OnInit, OnChanges , OnDestroy {
   /**
   * @property {boolean} mostrarTitulo
   * @description Bandera que controla la visibilidad del título "Generar Dictamen".
   * Si es true, el título se muestra; si es false, el título se oculta.
   */
  @Input() public mostrarTitulo = true;
  
  /** 
   * @property {Subject<void>} destroy$ 
   * @description Subject utilizado para manejar la destrucción del componente y evitar fugas de memoria.
   */
  private destroy$ = new Subject<void>();
   /**
   * @property {FormGroup} dictamenForm
   * @description Formulario reactivo para la captura de los datos del dictamen.
   */
  public dictamenForm!: FormGroup;
    /**
  * Indica si se debe mostrar un input de justificación.
  * En unos tramites se muestra un input de justificacion.
  */
  @Input() inputSentidos!: boolean;
   /**
   * Si es true, los antecedentes son editables; si es false, son de solo lectura.
   */
  @Input() public soloLectura = false;
    /**
   * @event controlDictaminador
   * @description Emite un valor booleano al componente padre indicando el estado del dictaminador.
   * Si se emite true, el dictaminador está activo; si se emite false, está inactivo.
   */
  @Output() controlDictaminador: EventEmitter<boolean> = new EventEmitter();
   /**
   * @property {EventEmitter<{ events: string, datos: unknown }>} enviarEvento
   * @description Evento emitido al guardar o cancelar el dictamen, enviando el tipo de evento y los datos asociados.
   */
  @Output() public enviarEvento = new EventEmitter<{ events: string, datos: DictamenForm }>();
  @Input() procedureId:number=0;

  /**
   * @property {string} resultadoEvaluacion
   * @description Almacena el resultado de la evaluación del dictamen.
   */
  public resultadoEvaluacion: string = '';
   /**
   * @property {boolean} sentidoInput
   * @description Indica si el input de sentido está habilitado.
   * Si es true, el input de sentido está habilitado; si es false, está deshabilitado.
   * Por defecto, el input de sentido está deshabilitado (false).
   */
  @Input() sentidoInput: boolean = false;
    /**
     * @property {string} tituloComponente
     * @description Título del componente que se muestra en la interfaz de usuario.
     * Por defecto, el título es "Generar Dictamen".
     */
  @Input() public tituloComponente:string='Generar Dictamen';

  
  /**
   * @property {IniciarDictamenResponse} dataIniciarDictamen
   * @description Datos del dictamen iniciados, utilizados para prellenar el formulario.
   * Debe ser proporcionado por el componente padre.
   */
  @Input() dataIniciarDictamen!: GenerarDictamenResponse | IniciarAutorizacionResponse | IniciarVerificarResponse;
  private pendingDataIniciarDictamen: boolean=true;  
  
  /**
  * @property {SentidosDisponiblesResponse} opcionesSentidosDisponibles
  * @description Datos para el llenado de los radios de los sentidos disponibles.
  */
  @Input() opcionesSentidosDisponibles: SentidosDisponiblesResponse[] = [];

  /**
   * @property {boolean} esVistaPrevia
   * @description Indica si el componente se está mostrando en modo de vista previa.
   * Si es true, el componente está en modo vista previa; si es false, está en modo normal.
   */
  esVistaPrevia: boolean = false;
  /**
   * @constructor
   * @description Constructor del componente. Inicializa los servicios necesarios para la creación y validación del formulario de dictamen.
   * 
   * @param {FormBuilder} fb - Servicio para la creación de formularios reactivos.
   * @param {ValidacionesFormularioService} validacionesService - Servicio para validaciones personalizadas de formularios.
   */
  constructor(private fb: FormBuilder, 
    private validacionesService: ValidacionesFormularioService,
    private catalogoService:ConsultaCatalogoService, 
    private tramiteConfigService: TramiteConfigService) {
    
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
     this.InitDictamenForm();
      if (this.soloLectura) {
      this.dictamenForm.disable();
    }
    if (this.inputSentidos) {
      this.dictamenForm.removeControl('cumplimiento');
    }
    this.controlDictaminador.emit(true);
     if(this.dataIniciarDictamen && this.dictamenForm && this.pendingDataIniciarDictamen)
    {
       GenerarDictamen261701Component.patchFormData(this.dictamenForm, this.dataIniciarDictamen);
        if(this.dataIniciarDictamen.ide_sent_dictamen){
          this.esVistaPrevia=true;
        }
        else{
          this.esVistaPrevia=false;
        }
    }
     
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
          GenerarDictamen261701Component.patchFormData(this.dictamenForm, this.dataIniciarDictamen);
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
  }

  static patchFormData(dictamenForm: FormGroup, dataIniciarDictamen: GenerarDictamenResponse | IniciarAutorizacionResponse | IniciarVerificarResponse): void {
      dictamenForm.patchValue({
        cumplimiento: dataIniciarDictamen.ide_sent_dictamen,
        justificacion: dataIniciarDictamen.justificacion ?? '',
      });
  }
  
  InitDictamenForm():void
  {
    this.dictamenForm = this.fb.group({
      cumplimiento: ['', Validators.required],

      justificacion: ['', [Validators.required,
      GenerarDictamen261701Component.noSoloEspacios,
      Validators.maxLength(2000)]],
      
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
   * @method cancelar
   * @description Emite el evento de cancelación hacia el componente padre, enviando el tipo de evento "cancelar" y datos nulos.
   * 
   * @returns {void}
   */
  cancelar(): void {
    this.enviarEvento.emit({ events: "cancelar", datos: {} as DictamenForm });
  }
  // eslint-disable-next-line class-methods-use-this
private markEnabledControlsAsTouched(formGroup: FormGroup): void {
  Object.values(formGroup.controls).forEach(control => {
    if (!control.disabled) {
      control.markAsTouched();
    }
  });
}
 
  vistaPreliminar(btnName: string): void {
    this.enviarEvento.emit({
      datos: this.dictamenForm.value as DictamenForm,
      events: btnName
    });
  }
  /**
   * @method ngOnDestroy
   * @description Método del ciclo de vida que se ejecuta cuando el componente es destruido.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
