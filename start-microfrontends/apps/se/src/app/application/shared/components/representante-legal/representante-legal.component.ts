import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CAMPO_DE_DESTINATARIO } from '../../constantes/modificacion.enum';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { TituloComponent } from '@libs/shared/data-access-user/src';

@Component({
  selector: 'app-representante-legal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TituloComponent],
  templateUrl: './representante-legal.component.html',
  styleUrl: './representante-legal.component.scss',
})
export class RepresentanteLegalComponent implements OnInit, OnDestroy {

  /**
   * 
   * @type {number}
   * @remarks
   * Este identificador se utiliza para enlazar el componente con un procedimiento específico.
   */
  @Input() idProcedimiento!: number;

  /**
   * Datos del formulario para inicializar los valores
   * @type {{ [key: string]: unknown }}
   */
  @Input() datosForm!: { [key: string]: unknown };

  /**
* Indica si el formulario debe mostrarse solo en modo de lectura.
* @type {boolean}
*/
  @Input() esFormularioSoloLectura!: boolean;

  /**
   * Emisor de eventos para manejar cambios en el formulario exportador.
   * 
   * @type {EventEmitter<{ formGroupName: string; campo: string; valor: undefined; storeStateName: string }>}
   * @remarks
   * Este EventEmitter emite un objeto que contiene el nombre del grupo de formulario,
   * el campo modificado, su valor y el nombre del estado en el store asociado.
   */
  @Output() formExportorEvent: EventEmitter<{ formGroupName: string; campo: string; valor: undefined; storeStateName: string }> = new EventEmitter<{ formGroupName: string; campo: string; valor: undefined; storeStateName: string }>();


  /**
   * FormGroup para el formulario de exportador
   * @type {FormGroup}
   */
  formExportor!: FormGroup;

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
   * @description Indica si el campo relacionado con el destinatario está habilitado o no.
   * @type {boolean}
   * @memberof RepresentanteLegalComponent
   */
  campoDestinatario = false;

  /**
   * Constructor del componente
   * @param {FormBuilder} fb - Servicio para crear formularios reactivos
   */
  constructor(private fb: FormBuilder) {


    // Parcheo de valores iniciales con retraso para asegurar la renderización
    setTimeout(() => {
      if (this.datosForm) {
        this.formExportor.patchValue(this.datosForm);
      }
    }, 100);
  }

  /**
   * @override
   * @method ngOnInit
   * @description Método de ciclo de vida de Angular que se ejecuta después de que Angular inicializa el componente.
   * Aquí se inicializa el formulario de acciones llamando al método `initActionFormBuilder`.
   * @see https://angular.io/guide/lifecycle-hooks#oninit
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
    this.campoDestinatario = CAMPO_DE_DESTINATARIO.includes(this.idProcedimiento);
  }
  /**
* Evalúa si se debe inicializar o cargar datos en el formulario.
*/
  inicializarEstadoFormulario(): void {
    if (!this.formExportor) {
      this.initActionFormBuilder();
    }
    if (this.esFormularioSoloLectura) {
      this.formExportor.disable();
    }
  }

  /**
   * Inicializa el formulario reactivo para el componente.
   * 
   * @remarks
   * Este método configura los controles del formulario `formExportor` con sus validaciones
   * correspondientes. Es llamado durante el ciclo de vida `ngOnInit` del componente.
   */
  initActionFormBuilder(): void {
    this.formExportor = this.fb.group({
      lugar: ['', Validators.required],
      exportador: ['', Validators.required],
      empresa: ['', Validators.required],
      cargo: ['', Validators.required],
      lada: ['', Validators.required],
      telfono: ['', Validators.required],
      fax: ['', Validators.required],
      correo: ['', Validators.required],
      numeroDeRegistroFiscal: [''],
    });
  }

  /**
   * @descripcion
   * Cambia las validaciones del campo `numeroDeRegistroFiscal` en función del estado de `campoDestinatario`.
   * 
   * @remarks
   * Si `campoDestinatario` es verdadero, se establece la validación como requerida para el campo `numeroDeRegistroFiscal`.
   * Si es falso, se eliminan las validaciones del campo.
   * Finalmente, se actualiza el estado y la validez del campo.
   */
  campoObligatorioChange(): void {
    const NUMERODEREGISTROFISCAL = this.formExportor.get('numerodeRegistroFiscal');
    if (this.campoDestinatario) {
      NUMERODEREGISTROFISCAL?.setValidators([Validators.required]);
    }
    else {
      NUMERODEREGISTROFISCAL?.clearValidators();
    }
    NUMERODEREGISTROFISCAL?.updateValueAndValidity();
  }

  /**
   * Establece valores en el store y emite eventos relacionados con el formulario.
   *
   * @param formGroupName - El nombre del grupo de formulario al que pertenece el campo.
   * @param campo - El nombre del campo cuyo valor se desea obtener y procesar.
   * @param storeStateName - El nombre del estado en el store asociado al campo.
   * 
   * @remarks
   * Este método obtiene el valor de un campo específico del formulario `formExportor`,
   * emite un evento para indicar si el formulario es válido y otro evento con los datos del campo
   * y su estado asociado en el store.
   */
  setValoresStore(formGroupName: string, campo: string, storeStateName: string): void {
    const VALOR = this.formExportor.get(campo)?.value;
    this.formaValida.emit(this.formExportor.valid);
    this.formExportorEvent.emit({ formGroupName, campo, valor: VALOR, storeStateName });
  }

  /**
  * Método del ciclo de vida ngOnDestroy. Se utiliza para cancelar las suscripciones y evitar fugas de memoria.
  */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
