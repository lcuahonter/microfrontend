import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RequerimientosStates, SolicitudRequerimientosState } from '../../../core/estados/requerimientos.store';
import { Subject, map, takeUntil } from 'rxjs';
import { Catalogo } from '../../../core/models/shared/catalogos.model';
import { CatalogoSelectClaveComponent } from '../catalogo-select-clave/catalogo-select.component';
import { CommonModule } from '@angular/common';
import { SolicitudRequerimientoQuery } from '../../../core/queries/requerimientos.query';
import data from '@libs/shared/theme/assets/json/funcionario/cat-tipo-requerimiento.json';

import { IniciarRequerimientoResponse } from '../../../core/models/shared/Iniciar-requerimiento-response.model';

@Component({
  selector: 'app-capturar-requerimiento',
  standalone: true,
  imports: [CommonModule, CatalogoSelectClaveComponent, ReactiveFormsModule],
  templateUrl: './capturar-requerimiento.component.html',
  styleUrl: './capturar-requerimiento.component.scss',
})
export class CapturarRequerimientoComponent implements OnInit, OnDestroy, OnChanges {
  /**
   * Declaración de variable para el formulario
   */
  formRequerimiento!: FormGroup;
  /**
    * Catálogo de tipo de requerimiento
    */
  catTipoRequerimiento!: Catalogo[];
  /**
   * Notificador para destruir las suscripciones.
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
    * Estado de la solicitud.
    */
  public solicitudRequerimientosState!: SolicitudRequerimientosState;
  /**
   * Límite máximo de caracteres para el campo de justificación
   */
  readonly MAX_CHARS = 10000;

  /** Indica si se debe mostrar el tipo de requerimiento */
  @Input() isTipoRequerimiento: boolean = true;

  /** Indica si se debe mostrar el área solicitante */
  @Input() isAreaSolicitante: boolean = true;

  /** Indica si se debe mostrar la justificación del requerimiento */
  @Input() isJustificacionRequerimiento: boolean = true;

  /** Datos de respuesta de la inicialización del requerimiento */
  @Input() iniciarResponse!: IniciarRequerimientoResponse;

  /**
   * Indica si se debe mostrar el contador de caracteres
   */
  @Input() mostrarContadorCaracteres?: boolean = true;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Output() formChanged = new EventEmitter<any>();

  /** Mensaje de validacion de justificacion */
  @Input() validacion? : boolean = false;

  /**
   * Flag para mostrar mensaje de límite de caracteres alcanzado
   */
  public showCharLimitMessage = false;

  constructor(
    private fb: FormBuilder,
    private requerimientosStates: RequerimientosStates,
    private solicitudRequerimientoQuery: SolicitudRequerimientoQuery,
  ) {

  }
  /**
  * Método que se ejecuta al inicializar el componente.
  */
  ngOnInit(): void {
    this.solicitudRequerimientoQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map(state => (this.solicitudRequerimientosState = state))
      )
      .subscribe();
    this.crearFormRequerimiento();

    this.catTipoRequerimiento = this.iniciarResponse?.alcances_requerimiento ?
      this.iniciarResponse.alcances_requerimiento as Catalogo[] : [];
    this.isTipoRequerimiento = this.catTipoRequerimiento.length > 0;

    this.formRequerimiento.valueChanges.subscribe(() => {
      this.formChanged.emit(this.formRequerimiento.value);
    });

    if (this.validacion) {
      this.formRequerimiento.markAllAsTouched();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['iniciarResponse'] && changes['iniciarResponse'].currentValue) {
      if (this.formRequerimiento) {
        this.formRequerimiento.patchValue({
          tipoRequerimiento: 'INFREQ.D',
          areaSolicitante: '',
          justificacionRequerimiento: this.iniciarResponse.justificacion
        });
      }
      this.catTipoRequerimiento = this.iniciarResponse?.alcances_requerimiento ?
        this.iniciarResponse.alcances_requerimiento as Catalogo[] : [];
      this.isTipoRequerimiento = this.catTipoRequerimiento.length > 0;
    }
   
  if (changes['validacion'] && changes['validacion'].currentValue === true) {
    if (this.formRequerimiento) {
      this.formRequerimiento.markAllAsTouched();
    }
  }

  }

  /**
   * Se ejecuta al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
  /**
   * Método para crear el formulario de la captura de requerimiento
   */
  crearFormRequerimiento(): void {
    this.formRequerimiento = this.fb.group({
      tipoRequerimiento: [
        this.solicitudRequerimientosState?.idTipoRequerimiento || 'INFREQ.D',
        this.isTipoRequerimiento ? [Validators.required] : []
      ],
      areaSolicitante: [
        this.solicitudRequerimientosState?.areaSolicitante || '',
        this.isAreaSolicitante ? [Validators.required, Validators.maxLength(this.MAX_CHARS)] : []
      ],
      justificacionRequerimiento: [
        this.solicitudRequerimientosState?.justificacionRequerimiento || '',
        this.isJustificacionRequerimiento ? [Validators.required, Validators.maxLength(this.MAX_CHARS)] : []
      ]
    });
  }

  /**
   * Método para establecer el tipo de requerimiento seleccionado 
    * De acuerdo al tipo de requerimiento el observable activa o desactiva el Tab para el requrimiento de documentación
    *@param {FormGroup} form - El formulario del cual se obtiene el valor.
    * @param {string} campo - El nombre del campo del formulario cuyo valor se va a obtener.
    * @param {string} metodoNombre - El nombre del método en el store que se va a invocar con el valor del campo.
   */
  tipoRequerimientoSeleccionado(form: FormGroup, campo: string, metodoNombre: keyof RequerimientosStates): void {
    this.setValoresStore(form, campo, metodoNombre);
  }
  /**
    * Establece los valores en el store de tramite5701.
    *
    * @param {FormGroup} form - El formulario del cual se obtiene el valor.
    * @param {string} campo - El nombre del campo del formulario cuyo valor se va a obtener.
    * @param {string} metodoNombre - El nombre del método en el store que se va a invocar con el valor del campo.
    * @returns {void}
    */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof RequerimientosStates): void {
    const VALOR = form.get(campo)?.value;
    if (VALOR === '1' || VALOR === '2') {
      this.requerimientosStates.setPestaniaSolicitudDocumento(true);
    }
    else {
      this.requerimientosStates.setPestaniaSolicitudDocumento(false); // agrega esto si no lo tenías
    }
    (this.requerimientosStates[metodoNombre] as (value: string) => void)(VALOR);
  }

  /**
   * Método para manejar el evento keydown en el textarea de justificación
   * Previene que el usuario pueda escribir más caracteres cuando se alcanza el límite
   * @param {KeyboardEvent} event - El evento del teclado
   */
  onKeydown(event: KeyboardEvent): void {
    const CURRENT_VALUE = this.formRequerimiento.get('justificacionRequerimiento')?.value || '';
    const IS_AT_LIMIT = CURRENT_VALUE.length >= this.MAX_CHARS;

    // Permitir teclas de navegación y edición (backspace, delete, arrow keys, etc.)
    const ALLOWED_KEYS = [
      'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'Home', 'End', 'PageUp', 'PageDown', 'Tab', 'Escape'
    ];

    // Permitir Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
    const IS_CTRL_KEY = event.ctrlKey && ['a', 'c', 'v', 'x', 'z'].includes(event.key.toLowerCase());

    // Si se alcanzó el límite y la tecla no está permitida, prevenir la entrada
    if (IS_AT_LIMIT && !ALLOWED_KEYS.includes(event.key) && !IS_CTRL_KEY) {
      event.preventDefault();
      // Mostrar mensaje de límite de caracteres
      this.showCharLimitMessage = true;
      // Marcar el campo como tocado para mostrar el error si no está ya marcado
      const CONTROL = this.formRequerimiento.get('justificacionRequerimiento');
      if (CONTROL && !CONTROL.touched) {
        CONTROL.markAsTouched();
      }
    } else if (ALLOWED_KEYS.includes(event.key) && CURRENT_VALUE.length < this.MAX_CHARS) {
      // Ocultar mensaje cuando el usuario puede editar y está por debajo del límite
      this.showCharLimitMessage = false;
    }
  }

  /**
   * Método para manejar el evento de pegado en el textarea
   * Trunca el contenido pegado si excede el límite de caracteres
   * @param {ClipboardEvent} event - El evento del portapapeles
   */
  onPaste(event: ClipboardEvent): void {
    const CLIPBOARD_DATA = event.clipboardData?.getData('text') || '';
    const CURRENT_VALUE = this.formRequerimiento.get('justificacionRequerimiento')?.value || '';
    const REMAINING_CHARS = this.MAX_CHARS - CURRENT_VALUE.length;

    if (CLIPBOARD_DATA.length > REMAINING_CHARS) {
      event.preventDefault();
      const TRUNCATED_TEXT = CLIPBOARD_DATA.substring(0, REMAINING_CHARS);
      const NEW_VALUE = CURRENT_VALUE + TRUNCATED_TEXT;

      this.formRequerimiento.get('justificacionRequerimiento')?.setValue(NEW_VALUE);
      this.setValoresStore(this.formRequerimiento, 'justificacionRequerimiento', 'setjustificacionRequerimientoValue');

      // Mostrar mensaje si se truncó el contenido
      if (REMAINING_CHARS <= 0 || CLIPBOARD_DATA.length > REMAINING_CHARS) {
        this.showCharLimitMessage = true;
      }

      // Marcar como tocado para mostrar validaciones
      this.formRequerimiento.get('justificacionRequerimiento')?.markAsTouched();
    }
  }

  /**
   * Método para manejar el evento input del textarea
   * Controla el mensaje de límite de caracteres
   */
  onInput(): void {
    const CURRENT_VALUE = this.formRequerimiento.get('justificacionRequerimiento')?.value || '';
    this.showCharLimitMessage = CURRENT_VALUE.length > this.MAX_CHARS;
    this.setValoresStore(this.formRequerimiento, 'justificacionRequerimiento', 'setjustificacionRequerimientoValue');
  }
}