import { CATALOGOS_ID } from '@libs/shared/data-access-user/src/tramites/constantes/constantes';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_EXTRANJERA } from '@libs/shared/data-access-user/src/tramites/constantes/solicitante-constantes.enum';
import { DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL } from '@libs/shared/data-access-user/src/tramites/constantes/solicitante-constantes.enum';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormularioDinamico } from '@libs/shared/data-access-user/src/core/models/shared/forms-model';
import { FormulariosService } from '@libs/shared/data-access-user/src/core/services/shared/formularios/formularios.service';
import { Input } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { PERSONA_FISICA_EXTRANJERO } from '@libs/shared/data-access-user/src/tramites/constantes/solicitante-constantes.enum';
import { PERSONA_FISICA_NACIONAL } from '@libs/shared/data-access-user/src/tramites/constantes/solicitante-constantes.enum';
import { PERSONA_MORAL_EXTRANJERO } from '@libs/shared/data-access-user/src/tramites/constantes/solicitante-constantes.enum';
import { PERSONA_MORAL_NACIONAL } from '@libs/shared/data-access-user/src/tramites/constantes/solicitante-constantes.enum';
import { ReactiveFormsModule } from '@angular/forms';
import { Requerimiento } from '../../models/datos-tramite.model';
import { SolicitanteService } from '@libs/shared/data-access-user/src/core/services/shared/solicitante/solicitante.service';
import { Subject } from 'rxjs';
import { TIPO_PERSONA } from '@libs/shared/data-access-user/src/tramites/constantes/constantes';
import { TituloComponent } from '@libs/shared/data-access-user/src/tramites/components/titulo/titulo.component';
import { UppercaseDirective } from '@libs/shared/data-access-user/src/tramites/directives/Uppercase/uppercase.directive';
import { ValidatorFn } from '@angular/forms';
import { Validators } from '@angular/forms';
import { forwardRef } from '@angular/core';
import { takeUntil } from 'rxjs';
import { tap } from 'rxjs';

@Component({
  selector: 'solicitante',
  standalone: true,
  imports: [
    TituloComponent,
    ReactiveFormsModule,
    CommonModule,
    forwardRef(() => UppercaseDirective),
  ],
  templateUrl: './solicitante.component.html',
  styleUrl: './solicitante.component.scss',
  host: {},
})
export class SolicitanteComponent implements OnInit, OnDestroy {
  /**
   * @input tabindex
   *
   * Define el índice de tabulación para el componente,
   * que determina el orden en el que los elementos son enfocados
   * al navegar con el teclado.
   *
   * @type {number}
   */
  @Input() tabindex!: number;

  /**
   * Representa el tipo de persona asociado.
   *
   * @type {number}
   * - Puede ser utilizado para identificar si la persona es física o moral.
   */
  tipoPersona!: number;
  /**
   * Arreglo que contiene objetos de tipo `FormularioDinamico`.
   * Representa los datos dinámicos asociados a una persona en el formulario.
   */
  persona: FormularioDinamico[] = [];

  /**
   * Arreglo que contiene los formularios dinámicos relacionados con el domicilio fiscal.
   * Cada elemento del arreglo representa un formulario dinámico que puede ser utilizado
   * para capturar o mostrar información del domicilio fiscal del solicitante.
   */
  domicilioFiscal: FormularioDinamico[] = [];

  /**
   * Formulario reactivo utilizado para gestionar los datos del solicitante.
   * Este formulario contiene los controles necesarios para capturar y validar
   * la información relacionada con el solicitante en el trámite.
   */
  form!: FormGroup;

  /**
   * Representa el folio del trámite asociado.
   *
   * @type {any} - Tipo genérico, se recomienda especificar un tipo más concreto si es posible.
   */
  folioTramite: Requerimiento = {} as Requerimiento;

  /**
   * Fecha de inicio del trámite, inicializada con la fecha actual en formato 'YYYY-MM-DD'.
   * Se obtiene utilizando el método `toISOString()` de la clase `Date` y dividiendo la cadena resultante.
   */
  fechaInicioTramite = new Date().toISOString().split('T')[0];

  /**
   * @private
   * @description Sujeto utilizado para manejar la destrucción de suscripciones y evitar fugas de memoria.
   * Se emite un valor cuando el componente se destruye, lo que permite completar las suscripciones activas.
   */
  private destroy$: Subject<void> = new Subject<void>();

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

  ngOnInit(): void {
    this.folioTramite = history?.state?.data;
    this.getDatosGenerales();
  }

    ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Obtiene el tipo de persona que es solicitante, y asigna los campos correspondientes al formulario.
   * @param tipo - Tipo de persona que es solicitante.
   * @returns void
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
   * Es un getter que proporciona un acceso más sencillo ala grupo de formularios llamado datosGenerales contenido dentr del formulario principal Form.
   */
  get datosGeneralesForm(): FormGroup {
    return this.form.get('datosGenerales') as FormGroup;
  }

  /**
   * Es un getter que proporciona un acceso más sencillo ala grupo de formularios llamado domicilioFiscal contenido dentr del formulario principal Form.
   */
  get domicilioFiscalForm(): FormGroup {
    return this.form.get('domicilioFiscal') as FormGroup;
  }

  /**
   * Crea un formulario vacío con dos grupos de formularios, datosGenerales y domicilioFiscal.
   */
  crearFormulario(): void {
    this.form = this.fb.group({
      datosGenerales: this.fb.group({}),
      domicilioFiscal: this.fb.group({}),
      requerimiento: this.fb.group({}),
    });
  }

  /**
   * Inicializa los campos del formulario con los campos de la configuración de los campos de los formularios.
   * @param config - Configuración de los campos de los formularios.
   * @param grupoNombre - Nombre del grupo de formularios a inicializar.
   * @returns void
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
   * Obtiene los validadores de los campos de los formularios.
   * @param validators - Validadores de los campos de los formularios.
   * @returns ValidatorFn[]
   */
  static getValidators(validators: string[]): ValidatorFn[] {
    const FORM_VALIDATORS: ValidatorFn[] = [];
    validators.forEach((validator) => {
      if (typeof validator === 'string') {
        if (validator === 'required') {
          FORM_VALIDATORS.push(Validators.required);
        } else if (validator.includes('maxLength')) {
          const MAX = validator.split(':')[1];
          FORM_VALIDATORS.push(Validators.maxLength(Number(MAX)));
        } else if (validator.includes('pattern')) {
          const PATTERN = validator.split(':')[1];
          FORM_VALIDATORS.push(Validators.pattern(PATTERN));
        }
      }
    });
    return FORM_VALIDATORS;
  }

  /**
   * Obtiene los datos generales del solicitante con una peticion get.
   * @returns void
   */
  getDatosGenerales(): void {
    this.solicitanteServicio
      .getDatosGenerales(CATALOGOS_ID.DATOS_PERSONA_FISICA)
      .pipe(
        takeUntil(this.destroy$),
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
