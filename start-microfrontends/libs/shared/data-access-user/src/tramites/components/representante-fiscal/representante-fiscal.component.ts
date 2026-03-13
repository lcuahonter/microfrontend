import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  CORREO_INVALIDO,
  REQUERIDO,
  RFC_INVALIDO
} from '../../constantes/mensajes-error-formularios';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  DatosRepresentanteLegal,
  DatosRfcResponse,
} from '../../../core/models/shared/components.model';
import { CommonModule } from '@angular/common';
import { FormulariosService } from '../../../core/services/shared/formularios/formularios.service';
import { NumeroTelefonicoDirective } from '../../directives/numeroTelefonico/numero-telefonico.directive';
import { REGEX_RFC } from '../../constantes/regex.constants';
import { UppercaseDirective } from '../../directives/Uppercase/uppercase.directive';
import { ValidacionesFormularioService } from '../../../core/services/shared/validaciones-formulario/validaciones-formulario.service';
@Component({
  selector: 'representante-fiscal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    UppercaseDirective,
    NumeroTelefonicoDirective,
  ],
  templateUrl: './representante-fiscal.component.html',
  styleUrl: './representante-fiscal.component.scss',
})
export class RepresentanteFiscalComponent implements OnInit {
  // Componente para representante fiscal

  MENSAJE_REQUERIDO = REQUERIDO;
  RFC_INVALIDO = RFC_INVALIDO;
  CORREO_INVALIDO = CORREO_INVALIDO;

  rfcBusqueda: FormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(REGEX_RFC),
  ]);

  representanteLegalForm!: FormGroup;

  @Output() datosRepresentanteLegal: EventEmitter<DatosRepresentanteLegal> =
    new EventEmitter();

  constructor(
    private validacionesService: ValidacionesFormularioService,
    private fb: FormBuilder,
    private formServices: FormulariosService
  ) {
    // Lógica de inicialización si es
  }

  /**
   * @inheritdoc
   * @description Inicializa el componente creando el formulario de representante legal.
   * @returns {void} No retorna ningún valor.
   */
  ngOnInit(): void {
    this.crearRepresentanteLegalForm();
  }

  /**
   * Retorna un booleano si el campo no contiene errores
   * @returns {boolean | null}
   */
  isValid(control: AbstractControl, campo?: string): boolean | null {
    return this.validacionesService.isValid(control, campo);
  }

  /**
   * Retorna un booleano si el campo tiene un error de pattern
   * @returns {boolean | null}
   */
  errorPattern(control: AbstractControl, campo?: string): boolean | null {
    return this.validacionesService.errorPattern(control, campo);
  }

  /**
   * Retorna un booleano si el campo tiene un error de pattern
   * @returns {boolean | null}
   */
  errorEmail(control: AbstractControl, campo?: string): boolean | null {
    return this.validacionesService.errorEmail(control, campo);
  }

  /**
   * Retorna un booleano si el campo tiene un error de requerido
   * @returns {boolean | null}
   */
  errorRequerido(control: AbstractControl, field?: string): boolean | null {
    return this.validacionesService.errorCampoRequerido(control, field);
  }

  /**
   * Crea el formulario para representante legal
   * @returns {void}
   */
  crearRepresentanteLegalForm(): void {
    this.representanteLegalForm = this.fb.group({
      RFC: [
        { value: '', disabled: true },
        [
          Validators.required,
          Validators.maxLength(13),
          Validators.pattern(REGEX_RFC),
        ],
      ],
      nombre: [
        { value: '', disabled: true },
        [Validators.required, Validators.maxLength(250)],
      ],
      primerApellido: [
        { value: '', disabled: true },
        [Validators.required, Validators.maxLength(250)],
      ],
      segundoApellido: [
        { value: '', disabled: true },
        [Validators.required, Validators.maxLength(250)],
      ],
      telefono: [null, [Validators.required, Validators.maxLength(15)]],
      correo: [
        '',
        [Validators.required, Validators.maxLength(50), Validators.email],
      ],
    });
  }

  /**
   * Busqueda de representante fiscal por RFC
   * @returns {void}
   */
  buscarRepresentanteFiscal(): void {
    const RFC = this.rfcBusqueda.value;
    const DATOS_REPRESENTANTE: DatosRfcResponse = {
      rfc: 'LEQI810131HDGSXG05',
      nombre: 'IGNACIO EDUARDO',
      primerApellido: 'LEOS',
      segundoApellido: 'QUIÑONES',
    };

    // Obtenemos los campos deactivados de la formulario para el Representante Legal por RFC
    const CAMPOS_DISABLED = FormulariosService.obtenerCamposDisabled(
      this.representanteLegalForm
    );
    if (RFC) {
      //Agregamos los valores a los campos desactivados
      CAMPOS_DISABLED.forEach((campo) => {
        if (campo in DATOS_REPRESENTANTE) {
          FormulariosService.agregarValorCampoDesactivado(
            this.representanteLegalForm,
            campo,
            DATOS_REPRESENTANTE[campo as keyof DatosRfcResponse]
          );
        }
      });
    } else {
      // Activamos los campos desactivados en el formulario para que se pueda ingresar la información.
      CAMPOS_DISABLED.forEach((campo) => {
        this.representanteLegalForm.controls[campo].enable();
        this.representanteLegalForm.controls[campo].setValidators([
          Validators.required,
        ]);
        this.representanteLegalForm.controls[campo].updateValueAndValidity();
      });
    }
  }
}
