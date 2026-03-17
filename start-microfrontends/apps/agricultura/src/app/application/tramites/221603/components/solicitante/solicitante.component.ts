import {
  CATALOGOS_ID,
  DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_EXTRANJERA,
  DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL,
  FormularioDinamico,
  FormulariosService,
  PERSONA_FISICA_EXTRANJERO,
  PERSONA_FISICA_NACIONAL,
  PERSONA_MORAL_EXTRANJERO,
  PERSONA_MORAL_NACIONAL,
  SolicitanteService,
  TIPO_PERSONA,
} from '@libs/shared/data-access-user/src';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { tap } from 'rxjs';

@Component({
  selector: 'solicitante',
  templateUrl: './solicitante.component.html',
  styleUrl: './solicitante.component.scss',
})
/**
 * Componente que gestiona los datos del solicitante en el trámite 221603.
 * Permite capturar y gestionar los datos generales y el domicilio fiscal del solicitante.
 * También incluye la funcionalidad para inicializar formularios dinámicos y obtener datos generales del solicitante.
 */
export class SolicitanteComponent implements OnInit {
  /**
   * Índice de la pestaña activa en la interfaz de usuario.
   */
  tabindex!: number;

  /**
   * Tipo de persona que es el solicitante (física o moral, nacional o extranjera).
   */
  tipoPersona!: number;

  /**
   * Configuración de los campos del formulario para los datos generales del solicitante.
   */
  persona: FormularioDinamico[] = [];

  /**
   * Configuración de los campos del formulario para el domicilio fiscal del solicitante.
   */
  domicilioFiscal: FormularioDinamico[] = [];

  /**
   * Formulario reactivo principal que contiene los grupos de formularios `datosGenerales` y `domicilioFiscal`.
   */
  form!: FormGroup;

  /**
   * Constructor del componente. Inicializa las dependencias necesarias y prepara el formulario reactivo.
   *
   * solicitanteServicio - Servicio que gestiona las operaciones relacionadas con el solicitante.
   * fb - FormBuilder utilizado para crear el formulario reactivo.
   * formServices - Servicio que gestiona las operaciones relacionadas con los formularios dinámicos.
   */
  constructor(
    private solicitanteServicio: SolicitanteService,
    private fb: FormBuilder,
    private formServices: FormulariosService
  ) {
    this.obtenerTipoPersona(TIPO_PERSONA.FISICA_NACIONAL);
    this.crearFormulario();
    this.inicializarFormGroup(this.persona, 'datosGenerales');
    this.inicializarFormGroup(this.domicilioFiscal, 'domicilioFiscal');
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Llama a la función `getDatosGenerales` para obtener datos iniciales del solicitante.
   */
  ngOnInit(): void {
    this.getDatosGenerales();
  }

  /**
   * Obtiene el tipo de persona que es solicitante y asigna los campos correspondientes al formulario.
   *
   * tipo - Tipo de persona que es solicitante.
   */
  obtenerTipoPersona(tipo: number): void {
    this.tipoPersona = tipo;
    if (tipo === TIPO_PERSONA.FISICA_NACIONAL) {
      this.persona = PERSONA_FISICA_NACIONAL;
      this.domicilioFiscal = DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL;
    } else if (tipo === TIPO_PERSONA.MORAL_NACIONAL) {
      this.persona = PERSONA_MORAL_NACIONAL;
      this.domicilioFiscal = DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL;
    } else if (tipo === TIPO_PERSONA.FISICA_EXTRANJERA) {
      this.persona = PERSONA_FISICA_EXTRANJERO;
      this.domicilioFiscal = DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_EXTRANJERA;
    } else if (tipo === TIPO_PERSONA.MORAL_EXTRANJERA) {
      this.persona = PERSONA_MORAL_EXTRANJERO;
      this.domicilioFiscal = DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_EXTRANJERA;
    }
  }

  /**
   * Getter que proporciona acceso al grupo de formularios `datosGenerales` dentro del formulario principal.
   */
  get datosGeneralesForm(): FormGroup {
    return this.form.get('datosGenerales') as FormGroup;
  }

  /**
   * Getter que proporciona acceso al grupo de formularios `domicilioFiscal` dentro del formulario principal.
   */
  get domicilioFiscalForm(): FormGroup {
    return this.form.get('domicilioFiscal') as FormGroup;
  }

  /**
   * Crea un formulario vacío con dos grupos de formularios: `datosGenerales` y `domicilioFiscal`.
   */
  crearFormulario(): void {
    this.form = this.fb.group({
      datosGenerales: this.fb.group({}),
      domicilioFiscal: this.fb.group({}),
    });
  }

  /**
   * Inicializa los campos del formulario con la configuración proporcionada.
   *
   * config - Configuración de los campos del formulario.
   * grupoNombre - Nombre del grupo de formularios a inicializar.
   */
  inicializarFormGroup(
    config: FormularioDinamico[],
    grupoNombre: string
  ): void {
    const GRUPO = this.form.get(grupoNombre) as FormGroup;
    config.forEach((campo) => {
      const VALIDATORS = SolicitanteComponent.getValidators(campo.validators);
      GRUPO.addControl(
        campo.campo,
        this.fb.control({ value: '', disabled: campo.disabled }, VALIDATORS)
      );
    });
  }

  /**
   * Obtiene los validadores de los campos del formulario a partir de la configuración.
   *
   * validators - Lista de validadores en formato de cadena.
   * @returns Lista de funciones de validación.
   */
  static getValidators(validators: string[]): ValidatorFn[] {
    const FORM_VALIDATOR: ValidatorFn[] = [];
    validators.forEach((validator) => {
      if (validator === 'required') {
        FORM_VALIDATOR.push(Validators.required);
      } else if (validator.includes('maxLength')) {
        const MAX = validator.split(':')[1];
        FORM_VALIDATOR.push(Validators.maxLength(Number(MAX)));
      } else if (validator.includes('pattern')) {
        const PATTERN = validator.split(':')[1];
        FORM_VALIDATOR.push(Validators.pattern(PATTERN));
      }
    });
    return FORM_VALIDATOR;
  }

  /**
   * Obtiene los datos generales del solicitante mediante una petición al servicio.
   * Los datos obtenidos se asignan a los campos del formulario y se desactivan.
   */
  getDatosGenerales(): void {
    this.solicitanteServicio
      .getDatosGenerales(CATALOGOS_ID.DATOS_PERSONA_FISICA)
      .pipe(
        tap((response) => {
          if (response) {
            const DATOS = JSON.parse(response.data);
            const DATOS_SOLICITANTE = DATOS.datosGenerales;
            const DATOS_DOMICILIO_FISCAL = DATOS.domicilioFiscal;

            const CAMPOS_DATOS_GENERALES =
              FormulariosService.obtenerNombresCamposForm(
                this.datosGeneralesForm
              );
            const CAMPOS_DATOS_DOMICILIO_FISCAL =
              FormulariosService.obtenerNombresCamposForm(
                this.domicilioFiscalForm
              );

            CAMPOS_DATOS_GENERALES.forEach((campo) => {
              FormulariosService.agregarValorCampoDesactivado(
                this.datosGeneralesForm,
                campo,
                DATOS_SOLICITANTE[campo]
              );
            });

            CAMPOS_DATOS_DOMICILIO_FISCAL.forEach((campo) => {
              FormulariosService.agregarValorCampoDesactivado(
                this.domicilioFiscalForm,
                campo,
                DATOS_DOMICILIO_FISCAL[campo]
              );
            });
          }
        })
      )
      .subscribe();
  }
}
