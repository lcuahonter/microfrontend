import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TituloComponent, ValidacionesFormularioService } from '@libs/shared/data-access-user/src';
import { CAMPO_DE_DESTINATARIO } from '../../constantes/modificacion.enum';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';

/**
 * @description Componente para manejar los detalles de la mercancía.
 * Proporciona entradas para configurar un formulario y opciones para productos, fracciones y unidades.
 */
@Component({
  selector: 'app-datos-del-destinatario',
  standalone: true,
  imports: [TituloComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './datos-del-destinatario.component.html',
  styleUrl: './datos-del-destinatario.component.scss',
})
export class DatosDelDestinatarioComponent
  implements OnDestroy, OnInit, OnChanges {

  /** Indica si el botón continuar ha sido activado para ejecutar las validaciones del formulario. */
  @Input() isContinuarTriggered: boolean = false;
  /**
   * Datos del formulario para inicializar los valores
   * @type { [key: string]: unknown }
   */
  @Input() datosForm!: { [key: string]: unknown };

  /**
   * @Input
   * Identificador único del procedimiento asociado.
   * Este valor es requerido y se utiliza para determinar el procedimiento actual.
   *
   * @type {number}
   */
  @Input() idProcedimiento!: number;

  @Input() razonSocialEditable: boolean = false;
  /**
   * Constante que define los procedimientos donde el campo "Número de registro fiscal" es obligatorio.
   * @type {number[]}
   */
  NUMERO_REGISTRO_FISCAL_REQUIRED: number[] = [110205, 110207, 110208, 110212, 110211,110201,110202,110221,110222];
  /**
   * Constante que define los procedimientos donde los campos son editables.
   * @type {number[]}
   */
  EDITABLE: number[] = [110208];
  /**
   * Evento que se emite cuando cambian los datos del formulario del destinatario
   * @type {EventEmitter<undefined>}
   */
  @Output() formDatosDelDestinatarioEvent: EventEmitter<{
    formGroupName: string;
    campo: string;
    valor: undefined;
    storeStateName: string;
  }> = new EventEmitter<{
    formGroupName: string;
    campo: string;
    valor: undefined;
    storeStateName: string;
  }>();
  /**
   * Indica si el formulario debe mostrarse solo en modo de lectura.
   * @type {boolean}
   */
  @Input() esFormularioSoloLectura!: boolean;

  /**
   * FormGroup para el formulario de datos del destinatario
   * @type {FormGroup}
   */
  formDatosDelDestinatario!: FormGroup;

  /**
   * Subject para manejar la destrucción de suscripciones
   * @type {Subject<void>}
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * Emisor de eventos para indicar si el formulario es válido.
   * @type {EventEmitter<boolean>}
   */
  @Output() formaValida: EventEmitter<boolean> = new EventEmitter<boolean>(
    false
  );

  /**
   * Indica si el campo destinatario está habilitado o no.
   *
   * @type {boolean}
   */
  public campoDestinatario = false;

  /**
   * Constructor del componente
   * @param {FormBuilder} fb - Servicio para crear formularios reactivos
   */
  constructor(private fb: FormBuilder, private validacionesService: ValidacionesFormularioService) {
    this.createForm();
  }
  /**
   * @inheritdoc
   *
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Inicializa el estado del formulario llamando a `inicializarEstadoFormulario()`.
   */
  ngOnInit(): void {
    // Parcheo de valores iniciales con retraso para asegurar la renderización
    this.campoDestinatario = CAMPO_DE_DESTINATARIO.includes(
      this.idProcedimiento
    );
      if (this.idProcedimiento === 110212 || this.idProcedimiento === 110201 || this.idProcedimiento === 110202 || this.idProcedimiento === 110207 || this.idProcedimiento === 110211 || this.idProcedimiento === 110208) {
      const CONTROLS_TO_CLEAR = ['nombres', 'primerApellido', 'segundoApellido', 'razonSocial'];
      CONTROLS_TO_CLEAR.forEach(key => {
        this.formDatosDelDestinatario.get(key)?.clearValidators();
        this.formDatosDelDestinatario.get(key)?.updateValueAndValidity({ emitEvent: false });
      });
    }
    else if(this.idProcedimiento === 110222){
       const CONTROLS_TO_CLEAR = ['primerApellido', 'segundoApellido', 'razonSocial'];
      CONTROLS_TO_CLEAR.forEach(key => {
        this.formDatosDelDestinatario.get(key)?.clearValidators();
        this.formDatosDelDestinatario.get(key)?.updateValueAndValidity({ emitEvent: false });
      });
    } 
    else{
      this.applyNumeroRegistroFiscalValidation();
    }
    this.inicializarEstadoFormulario();
  }
  /**
   * Valida un campo del formulario.
   *
   * @param {FormGroup} form - El formulario reactivo.
   * @param {string} field - El nombre del campo a validar.
   * @returns {boolean} `true` si el campo es válido, de lo contrario `false`.
   */
  isValid(form: FormGroup, field: string): boolean {
    return this.validacionesService.isValid(form, field) || false;
  }
  /** Método público para marcar todos los campos como tocados y mostrar errores */
  public markAllFieldsTouched(): boolean {
    if (this.formDatosDelDestinatario.invalid) {
      this.formDatosDelDestinatario.markAllAsTouched();
      return false;
    }
    return true;
  }
  /**
   * Inicializa el formulario 'formDatosDelDestinatario' con los campos requeridos.
   *
   * @remarks
   * Este método crea un formulario reactivo utilizando FormBuilder y define los campos
   * necesarios para los datos del destinatario. Luego, llama a `inicializarEstadoFormulario`
   * para establecer el estado inicial del formulario.
   *
   * @returns {void} No retorna ningún valor.
   */
  createForm(): void {
    this.formDatosDelDestinatario = this.fb.group({
      nombres: ['', [Validators.required,Validators.maxLength(20)]],
      primerApellido: ['', [Validators.maxLength(20)]],
      segundoApellido: ['', [Validators.maxLength(20)]],
      numeroDeRegistroFiscal: ['', [Validators.maxLength(30)]],
      razonSocial: [{ value: '', disabled: this.razonSocialEditable }],
    });
    if (this.idProcedimiento === 110212) {
      const CONTROLS_TO_CLEAR = ['nombres', 'primerApellido', 'segundoApellido', 'razonSocial'];
      CONTROLS_TO_CLEAR.forEach(key => {
        this.formDatosDelDestinatario.get(key)?.clearValidators();
        this.formDatosDelDestinatario.get(key)?.updateValueAndValidity({ emitEvent: false });
      });
    }
    else if(this.idProcedimiento === 110222 || this.idProcedimiento === 110221){
       const CONTROLS_TO_CLEAR = ['primerApellido', 'segundoApellido', 'razonSocial'];
      CONTROLS_TO_CLEAR.forEach(key => {
        this.formDatosDelDestinatario.get(key)?.clearValidators();
        this.formDatosDelDestinatario.get(key)?.updateValueAndValidity({ emitEvent: false });
      });
    }
    else {
      this.updateRequiredValidators();
    }

    if (this.isContinuarTriggered) {
      Promise.resolve().then(() => {
        this.validarFormularios();
      });
    }
  }

  /**
   * Actualiza los validadores requeridos del campo 'numeroDeRegistroFiscal'
   * en el formulario 'formDatosDelDestinatario' según el procedimiento actual.
   * * @remarks
   * Este método verifica si el identificador del procedimiento (`idProcedimiento`)
   * está incluido en la lista de procedimientos que requieren el campo 'numeroDeRegistroFiscal'.
   */
  updateRequiredValidators(): void {
    if (this.NUMERO_REGISTRO_FISCAL_REQUIRED.includes(this.idProcedimiento)) {
      this.formDatosDelDestinatario.get('numeroDeRegistroFiscal')?.addValidators(Validators.required);
      this.formDatosDelDestinatario.get('numeroDeRegistroFiscal')?.updateValueAndValidity();
    } else {
      this.formDatosDelDestinatario.get('numeroDeRegistroFiscal')?.removeValidators(Validators.required);
      this.formDatosDelDestinatario.get('numeroDeRegistroFiscal')?.updateValueAndValidity();
    }

  }

  /**
   * Aplica validaciones al campo 'numeroDeRegistroFiscal' y 'primerApellido' del formulario
   * 'formDatosDelDestinatario' según el procedimiento actual.
   *  * @remarks
   * Este método establece validadores específicos para los campos 'numeroDeRegistroFiscal' y 'primerApellido'
   * basándose en el identificador del procedimiento (`idProcedimiento`).
   * * Si el procedimiento es 110205, 'numeroDeRegistroFiscal' es requerido y 'primerApellido' no lo es.
   * * En otros casos, 'numeroDeRegistroFiscal' no es requerido y 'primerApellido' es requerido.
   * * @returns {void} No retorna ningún valor.
   * */
  applyNumeroRegistroFiscalValidation(): void {
    const NUMERO_REGISTRO_FISCAL = this.formDatosDelDestinatario.get('numeroDeRegistroFiscal');
    const PRIMER_APELLIDO = this.formDatosDelDestinatario.get('primerApellido');
    const NOMBRES = this.formDatosDelDestinatario.get('nombres');

    if (!NUMERO_REGISTRO_FISCAL || !PRIMER_APELLIDO || !NOMBRES) {
      return;
    }

    if (this.idProcedimiento === 110205 || this.idProcedimiento === 110223 || this.idProcedimiento === 110221) {
      NUMERO_REGISTRO_FISCAL.setValidators([
        Validators.required,
        Validators.maxLength(30),
      ]);
      PRIMER_APELLIDO.setValidators([Validators.maxLength(20)]);
      NOMBRES.setValidators([
        Validators.required,
        Validators.maxLength(20),
      ]);
    } else if(this.idProcedimiento === 110222 ){
      NUMERO_REGISTRO_FISCAL.setValidators([
        Validators.required,
        Validators.maxLength(30),
      ]);
      
      NOMBRES.setValidators([
        Validators.required,
        Validators.maxLength(20),
      ]);
    }else {
      NUMERO_REGISTRO_FISCAL.setValidators([Validators.maxLength(30)]);
      PRIMER_APELLIDO.setValidators([
        Validators.required,
        Validators.maxLength(20),
      ]);
      NOMBRES.setValidators([Validators.maxLength(20)]);
    }

    NUMERO_REGISTRO_FISCAL.updateValueAndValidity();
    PRIMER_APELLIDO.updateValueAndValidity();
    NOMBRES.updateValueAndValidity();
  }

  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   */
   inicializarEstadoFormulario(): void {
    if (!this.formDatosDelDestinatario) {
      this.createForm();
    }    
    if (this.esFormularioSoloLectura) {
      this.formDatosDelDestinatario.disable();
    }
  }
  /**
   * @method ngOnChanges
   * @description
   * Método del ciclo de vida que se llama cuando cambia alguna propiedad enlazada por datos.
   * Específicamente, verifica si el input `datosForm` ha cambiado. Si es así, actualiza el
   * formulario `formDatosDelDestinatario` con los nuevos valores de `datosForm`. Si el formulario
   * no existe, lo crea.
   *
   * @param changes - Objeto con pares clave/valor de las propiedades que han cambiado.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['datosForm'] && this.datosForm) {
      if (this.formDatosDelDestinatario) {
        this.formDatosDelDestinatario.patchValue(this.datosForm);
        queueMicrotask(() => {
          this.formDatosDelDestinatario.updateValueAndValidity({ emitEvent: false });
          this.formaValida.emit(this.formDatosDelDestinatario.valid);
        });
      } else {
        this.createForm();
      }
    }
    if (changes?.['idProcedimiento']?.currentValue && changes?.['idProcedimiento']) {
      this.updateRequiredValidators();
    }
    if(changes?.['razonSocialEditable']){
      this.razonSocialEditable = changes?.['razonSocialEditable'].currentValue;
      if (this.razonSocialEditable) {
        this.formDatosDelDestinatario.get('razonSocial')?.disable();
      } else {
        this.formDatosDelDestinatario.get('razonSocial')?.enable();
      }
    }
  }
  /**
  /**
   * Establece valores en el store y emite eventos relacionados con el formulario.
   *
   * @param formGroupName - El nombre del grupo de formulario al que pertenece el campo.
   * @param campo - El nombre del campo cuyo valor se desea obtener y procesar.
   * @param storeStateName - El nombre del estado en el store asociado al campo.
   * 
   * @remarks
   * Este método obtiene el valor de un campo específico del formulario `formDatosDelDestinatario`,
   * emite un evento para indicar si el formulario es válido y otro evento con los datos del campo
   * y su estado asociado en el store.
   */
  setValoresStore(
    formGroupName: string,
    campo: string,
    storeStateName: string
  ): void {
    const VALOR = this.formDatosDelDestinatario.get(campo)?.getRawValue();
    this.formaValida.emit(this.formDatosDelDestinatario.valid);
    this.formDatosDelDestinatarioEvent.emit({
      formGroupName,
      campo,
      valor: VALOR,
      storeStateName,
    });
  }
  /**
   * Método del ciclo de vida ngOnDestroy. Se utiliza para cancelar las suscripciones y evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
  /**
   * @description
   * Valida el estado completo del formulario de datos del destinatario.
   * @returns {boolean} - Retorna true si el formulario es válido, false en caso contrario.
   */
  validarFormularios(): boolean {
    if (this.formDatosDelDestinatario.valid) {
      return true;
    }
    this.formDatosDelDestinatario.markAllAsTouched();
    return false;
  }
  /**
   * @description
   * Valida el estado completo del formulario de datos del certificado.
   * Si el formulario no es válido, marca todos los campos como tocados para mostrar los errores.
   *
   * @method
   * @public
   * @memberof DatosCertificadoDeComponent
   * @returns {boolean} - Retorna true si el formulario es válido, false en caso contrario
   *
   * @example
   * ```typescript
   * if (this.validarFormularios()) {
   *   // Proceder con el envío del formulario
   * } else {
   *   // Mostrar mensaje de error
   * }
   * ```
   */

/**
 * @description
 * Maneja el evento de entrada de texto en el campo 'nombres'.
 * Cuando se ingresa un nombre, deshabilita y limpia el campo 'razonSocial'.
 * Cuando el campo 'nombres' está vacío, habilita el campo 'razonSocial'.
 * Solo funciona para procedimientos editables.
 * 
 * @param {Event} event - El evento de entrada del input
 * @returns {void}
 */
  onNombreInput(event: Event): void {
    if(!this.EDITABLE.includes(this.idProcedimiento)){
      return
    }
    const NOMBRE = (event.target as HTMLInputElement).value.trim();
 
    if (NOMBRE) {
      this.formDatosDelDestinatario.patchValue(
        { razonSocial: '' },
        { emitEvent: false }
      );
      this.formDatosDelDestinatario.get('razonSocial')?.disable({ emitEvent: false });
    } else {
      this.formDatosDelDestinatario.get('razonSocial')?.enable({ emitEvent: false });
    }
  }

/** * 
 * @description
 * Maneja el evento de entrada de texto en el campo 'razonSocial'.
 * Cuando se ingresa una razón social, deshabilita y limpia los campos 'nombres', 'primerApellido' y 'segundoApellido'.     
 * Cuando el campo 'razonSocial' está vacío, habilita los campos 'nombres', 'primerApellido' y 'segundoApellido'.
 * Solo funciona para procedimientos editables.
 * 
 * @param {Event} event - El evento de entrada del input
 * @returns {void}
 */
  onRazonSocialInput(event: Event): void {
    if(!this.EDITABLE.includes(this.idProcedimiento)){
      return
    }
    const RAZONSOCIAL = (event.target as HTMLInputElement).value.trim();
    if (RAZONSOCIAL) {
      this.formDatosDelDestinatario.patchValue(
        {
          nombres: '',
          primerApellido: '',
          segundoApellido: '',
        },
        { emitEvent: false }
      );
      this.formDatosDelDestinatario.get('nombres')?.disable({ emitEvent: false });
      this.formDatosDelDestinatario.get('primerApellido')?.disable({ emitEvent: false });
      this.formDatosDelDestinatario
        .get('segundoApellido')
        ?.disable({ emitEvent: false });
    } else {
      this.formDatosDelDestinatario.get('nombres')?.enable({ emitEvent: false });
      this.formDatosDelDestinatario.get('primerApellido')?.enable({ emitEvent: false });
      this.formDatosDelDestinatario.get('segundoApellido')?.enable({ emitEvent: false });
    }
  }
  /**
   * Convierte el valor del campo 'numeroDeRegistroFiscal' a mayúsculas.
   * Se llama cuando el campo pierde el foco. 
   * @returns {void}
   */
  convertToUppercase(): void {
    const numeroControl = this.formDatosDelDestinatario.get('numeroDeRegistroFiscal');
    if (numeroControl) {
      const valorActual = numeroControl.value || '';
      const valorMayusculas = valorActual.toUpperCase();
      numeroControl.setValue(valorMayusculas);
      this.setValoresStore('formDatosDelDestinatario','numeroDeRegistroFiscal','setGrupoReceptorNumeroFiscal');
    }
  }

}
