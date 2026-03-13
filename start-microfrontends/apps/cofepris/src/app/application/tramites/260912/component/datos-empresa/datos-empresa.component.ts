import { ALERT, OPCIONES_DE_BOTON_DE_RADIO} from '../../enums/datos-de-la-solicitud.enum'
import { AbstractControl, FormBuilder } from '@angular/forms';
import { AfterViewInit, EventEmitter, OnInit, Output } from '@angular/core';
import { AlertComponent, REGEX_RFC } from '@libs/shared/data-access-user/src';
import { Subject, map } from 'rxjs';
import {Tramite260912Store, Tramites260912State } from '../../estados/tramite-260912.store';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConsultaioQuery } from "@ng-mf/data-access-user";
import { DomicilioDelEstablecimientoComponent } from '../domicilio-del-establecimiento/domicilio-del-establecimiento.component'
import { FormGroup } from '@angular/forms';
import { InputRadioComponent } from '@libs/shared/data-access-user/src';
import { OnDestroy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ViewChild } from '@angular/core';

import { takeUntil } from 'rxjs';

import { TituloComponent } from '@libs/shared/data-access-user/src';
import { Tramite260912Query } from '../../estados/tramite-260912.query';
import { Validators } from '@angular/forms';


/**
 * Componente que representa los datos de la empresa en un proceso de múltiples pasos.
 * 
 * @selector app-datos-empresa
 * @standalone true
 * @imports [
 *   CommonModule,
 *   AlertComponent,
 *   InputRadioComponent,
 *   ReactiveFormsModule,
 *   TituloComponent
 * ]
 * @templateUrl ./datos-empresa.component.html
 * @styleUrl ./datos-empresa.component.scss
 */

/**
 * Componente que representa los datos de la empresa en un proceso de múltiples pasos.
 */
@Component({
  selector: 'app-datos-empresa',
  standalone: true,
  imports: [
    CommonModule,
    AlertComponent,
    InputRadioComponent,
    ReactiveFormsModule,
    TituloComponent,
  ],
  templateUrl: './datos-empresa.component.html',
  styleUrls: ['./datos-empresa.component.scss'],
})
export class DatosEmpresaComponent implements OnInit, OnDestroy, AfterViewInit {
  colapsable: boolean = true;

  @ViewChild(DomicilioDelEstablecimientoComponent)
  domicilioDelEstablecimientoComponent!: DomicilioDelEstablecimientoComponent;

  TEXTOS = ALERT;
  estadoSeleccionado!: Tramites260912State;
  btonDeRadio = OPCIONES_DE_BOTON_DE_RADIO;
  form!: FormGroup;
  datosDelEstablecimiento!: FormGroup;

  @Output() radioButtonSelectedChange = new EventEmitter<boolean>();
  @Output() tipoTramiteChange = new EventEmitter<string>();
  @Output() emitirSeleccionEstablecimiento = new EventEmitter<boolean>();

  isRadioButtonSelected: boolean = false;
  esFormularioSoloLectura: boolean = false;
  botonDesactivarParaProrrogar:boolean = true;
  mostrarModal: boolean = false;
  isSeleccionEstablecimientoClicked : boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private tramite260912Query: Tramite260912Query,
    private tramite260912Store: Tramite260912Store,
    private consultaQuery: ConsultaioQuery,
  ) {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.inicializarEstadoFormulario();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializeTooltips();
    }, 100);
  }

  private initializeTooltips(): void {
    try {
      const TOOLTIP_ELEMENTS = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      TOOLTIP_ELEMENTS.forEach(element => {
        const BS_TITLE = element.getAttribute('data-bs-title') || '';
        if (BS_TITLE) {
          element.setAttribute('title', BS_TITLE);
        }
      });
      if (typeof (window as unknown as { bootstrap?: { Tooltip?: unknown } })?.bootstrap?.Tooltip !== 'undefined') {
        Array.from(TOOLTIP_ELEMENTS).forEach(tooltipTriggerEl => {
          type BootstrapTooltipConstructor = new (element: Element) => object;
          const BOOTSTRAP_TOOLTIP_CTOR = (window as { bootstrap?: { Tooltip?: BootstrapTooltipConstructor } }).bootstrap?.Tooltip;
          if (BOOTSTRAP_TOOLTIP_CTOR) {
            const TOOLTIP = new BOOTSTRAP_TOOLTIP_CTOR(tooltipTriggerEl);
            (tooltipTriggerEl as { __bootstrap_tooltip?: object }).__bootstrap_tooltip = TOOLTIP;
          }
        });
      }
      if (this.colapsable) {
        // No hacer nada, solo para usar 'this'
      }
    } catch (error) {
      console.warn('Error inicializando tooltips:', error);
    }
  }

  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.crearFormulario();
    }
  }

  guardarDatosFormulario(): void {
    this.crearFormulario();
    if (this.esFormularioSoloLectura) {
      this.form.disable();
      this.datosDelEstablecimiento.disable();
    } else {
      const RADIO_VALUE = this.form.get('btonDeRadio')?.value;
      if (!RADIO_VALUE) {
        this.disableSections();
      } else if (RADIO_VALUE === '0') {
        this.enableProrrogaOnly();
      } else {
        this.enableSections();
      }
    }
  }

  enableSections(): void {
    if (!this.esFormularioSoloLectura) {
      this.form.get('justificacion')?.enable();
      this.datosDelEstablecimiento.enable();
    }
  }

  enableProrrogaOnly(): void {
    if (!this.esFormularioSoloLectura) {
      this.form.get('justificacion')?.enable();
      this.datosDelEstablecimiento.disable();
    }
  }

  mostrarModalEstablecimiento(): void {
    this.mostrarModal = true;
  }

  disableSections(): void {
    this.form.get('justificacion')?.disable();
    this.datosDelEstablecimiento.disable();
  }

  onRadioButtonChange(value: string | null): void {
    this.isRadioButtonSelected = value !== undefined && value !== null && value !== '';
    this.radioButtonSelectedChange.emit(this.isRadioButtonSelected);
    if (this.isRadioButtonSelected) {
      if (value === '0') {
        this.enableProrrogaOnly();
        this.botonDesactivarParaProrrogar = true;
      } else {
        this.enableSections();
        this.botonDesactivarParaProrrogar = false;
      }
    } else {
      this.disableSections();
    }
  }

  mostrar_colapsable(): void {
    this.colapsable = !this.colapsable;
  }

  static rfcEmailValidator(control: import('@angular/forms').AbstractControl): Record<string, unknown> | null {
    if (!control.value) {
      return null;
    }
    const BASIC_EMAIL_REGEX = /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (control.value.length > 320) {
      return { maxlength: true };
    }
    return BASIC_EMAIL_REGEX.test(control.value) ? null : { email: true };
  }

  private initialFormValues: { btonDeRadio: string; justificacion: string } = {
  btonDeRadio: '',
  justificacion: ''
};

private initialEstablecimientoValues: { rfcDel: string; denominacion: string; correo: string } = {
  rfcDel: '',
  denominacion: '',
  correo: ''
};

  crearFormulario(): void {
    this.tramite260912Query.selectTramite260912$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.estadoSeleccionado = seccionState;
           this.initialFormValues = {
          btonDeRadio: seccionState.btonDeRadio || '1',
          justificacion: seccionState.justificacion || 'Justificación de prueba'
        };

        this.initialEstablecimientoValues = {
          rfcDel: seccionState.rfcDel || 'XAXX010101000',
          denominacion: seccionState.denominacion || 'Empresa de Prueba S.A. de C.V.',
          correo: seccionState.correo || 'prueba@empresa.com'
        };
        })
      )
      .subscribe();

    this.form = this.fb.group({
      btonDeRadio: [this.estadoSeleccionado.btonDeRadio, [Validators.required]],
      justificacion: [this.estadoSeleccionado.justificacion || 'justificationData', [Validators.required]],
    });

    this.datosDelEstablecimiento = this.fb.group({
      rfcDel: [
        { value: this.estadoSeleccionado?.rfcDel, disabled: true },
        [Validators.required, Validators.maxLength(13),
        Validators.pattern(REGEX_RFC)
        ]
      ],
      denominacion: [
        { value: this.estadoSeleccionado?.denominacion, disabled: true },
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern(/^(?!.*https?:\/\/)[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,\-/#()]+$/)
        ]
      ],
      correo: this.fb.control(
        this.estadoSeleccionado?.correo,
        {
          validators: [
            Validators.required,
            DatosEmpresaComponent.rfcEmailValidator,
            Validators.maxLength(320)
          ],
          updateOn: 'blur'
        }
      )
    });


    this.isRadioButtonSelected = Boolean(this.estadoSeleccionado.btonDeRadio);
    this.form.get('btonDeRadio')?.valueChanges.subscribe(value => {
      this.onRadioButtonChange(value);
    });
    const RADIO_VALUE = this.form.get('btonDeRadio')?.value;
    if (RADIO_VALUE === undefined || RADIO_VALUE === null || RADIO_VALUE === '') {
      this.disableSections();
    } else if (RADIO_VALUE === '0') {
      this.enableProrrogaOnly();
    } else {
      this.enableSections();
    }
  }

  public esInvalido(nombreControl: string): boolean {
    let CONTROL = this.form.get(nombreControl);
    if (!CONTROL) {
      CONTROL = this.datosDelEstablecimiento.get(nombreControl);
    }
    return CONTROL ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty) : false;
  }

  // eslint-disable-next-line class-methods-use-this
  public isInvalid(control: AbstractControl, campo?: string): boolean | null {
    if (!control) {
      return null;
    }
    if (control instanceof FormGroup && campo) {
      const CHILD = control.controls[campo];
      if (!CHILD) {
        return null;
      }
      return CHILD.errors && CHILD.touched;
    }
    return control.errors && control.touched;
  }

  toggleFormControls(): void {
    if (!this.isRadioButtonSelected || this.esFormularioSoloLectura) {
      return;
    }
    Object.keys(this.datosDelEstablecimiento.controls).forEach(
      (controlName) => {
        const CONTROL = this.datosDelEstablecimiento.get(controlName);
        if (CONTROL?.disabled) {
          CONTROL.enable();
        }
      }
    );
  }

  openEstablecimientoModal(): void {
    this.mostrarModal = true;
    this.isSeleccionEstablecimientoClicked = true;
    this.emitirSeleccionEstablecimiento.emit(this.isSeleccionEstablecimientoClicked);
    const MODAL_ELEMENT = document.getElementById('establecimientoModal');
    if (MODAL_ELEMENT) {
      type BootstrapModalConstructor = new (element: Element) => { show: () => void };
      const BOOTSTRAP_MODAL_CTOR = (window as unknown as { bootstrap?: { Modal?: BootstrapModalConstructor } }).bootstrap?.Modal;
      if (BOOTSTRAP_MODAL_CTOR) {
        const MODAL_INSTANCE = new BOOTSTRAP_MODAL_CTOR(MODAL_ELEMENT);
        MODAL_INSTANCE.show();
      }
    }
  }

  closeEstablecimientoModal(): void {
    this.mostrarModal = false;
  }

  setValorStore(FormGroup: FormGroup, control: string): void {
    const VALOR = FormGroup.get(control)?.value;
    this.tramite260912Store.setTramite260912State({
      [control]: VALOR
    });
  }

  getValorStore(): void {
    this.tramite260912Query.selectTramite260912$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(
      (data) => {
        this.estadoSeleccionado = data;
      }
    );
  }

  public validarLongitudMaxima(controlName: string, maxLength: number): void {
    const CONTROL = this.datosDelEstablecimiento.get(controlName);
    if (CONTROL && CONTROL.value) {
      CONTROL.markAsTouched();
      CONTROL.markAsDirty();
      if (CONTROL.value.length > maxLength) {
        const CURRENT_ERRORS = CONTROL.errors || {};
        const NEW_ERRORS = {
          ...CURRENT_ERRORS,
          maxlength: { requiredLength: maxLength, actualLength: CONTROL.value.length }
        };
        CONTROL.setErrors(NEW_ERRORS);
      } else {
        const ERRORS = CONTROL.errors;
        if (ERRORS && ERRORS['maxlength']) {
          delete ERRORS['maxlength'];
          CONTROL.setErrors(Object.keys(ERRORS).length === 0 ? null : ERRORS);
        }
      }
      CONTROL.updateValueAndValidity({ emitEvent: false });
    }
  }

  onContinuar(): void {
    this.form.markAllAsTouched();
    this.datosDelEstablecimiento.markAllAsTouched();
  }

  public validateRequiredFields(): boolean {
    if (!this.form) {
      return true;
    }
    return this.form.valid;
  }

  public markAllFieldsTouched(): void {
    if (this.form) {
      Object.values(this.form.controls).forEach(control => {
        control.markAsTouched();
        control.markAsDirty();
        control.updateValueAndValidity();
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  /**
   * Restaura los datos prellenados en todos los formularios y componentes relacionados.
   */
 restaurarDatosPrellenados(): void {
   this.form.patchValue(this.initialFormValues);
  this.datosDelEstablecimiento.patchValue(this.initialEstablecimientoValues);

  if (this.domicilioDelEstablecimientoComponent && typeof this.domicilioDelEstablecimientoComponent.resetForm === 'function') {
    this.domicilioDelEstablecimientoComponent.resetForm();
  }
 }

 
}