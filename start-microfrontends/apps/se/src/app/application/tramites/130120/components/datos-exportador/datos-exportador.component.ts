import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OPCION_DE_RADIO_EXPORTADOR, TIPO_PERSONA } from '../../constants/permiso-importacion-modification.enum';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user'
import { DatosGrupos } from '../../models/permiso-importacion-modification.model';
import { PermisoImportacionStore } from '../../estados/permiso-importacion.store';
import { RadioOpcion } from '@libs/shared/data-access-user/src/core/models/110203/datos-busqueda.model';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { Tramite130120Query } from '../../estados/permiso-importacion.query';

import { FormValidationService } from '../../services/formValidation.service';

/**
 * @component
 * @name DatosExportadorComponent
 * @description
 * Componente encargado de gestionar el formulario de datos del exportador
 * para el trámite de permiso de importación 130120. Permite inicializar el formulario, manejar el tipo de persona,
 * aplicar validaciones dinámicas y actualizar el estado global mediante el store.
 *
 * @method ngOnInit
 * @description Inicializa el componente, suscribe al estado y configura los formularios y datos.
 *
 * @method initActionFormBuild
 * @description Inicializa el formulario reactivo con los valores actuales del estado.
 *
 * @method onTipoPersonaExportadorChange
 * @description Cambia el tipo de persona exportador y ajusta los validadores y valores del formulario según la selección.
 * @param {string | number} value - Valor seleccionado para el tipo de persona.
 *
 * @method setValoresStore
 * @description Actualiza el store con el valor de un campo del formulario usando el método correspondiente.
 * @param {FormGroup} form - Formulario reactivo.
 * @param {string} campo - Nombre del campo en el formulario.
 * @param {keyof PermisoImportacionStore} metodoNombre - Método del store a invocar.
 *
 * @method ngOnDestroy
 * @description Limpia las suscripciones activas cuando el componente es destruido.
 */
@Component({
  selector: 'app-datos-exportador',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TituloComponent],
  templateUrl: './datos-exportador.component.html',
  styleUrl: './datos-exportador.component.scss',
})
export class DatosExportadorComponent implements OnInit, OnDestroy {

  /**
   * @property {FormGroup} datosExportador 
   * @description Formulario reactivo que captura los datos del exportador.
   */
  datosExportador!: FormGroup;

  /**
   * @property {boolean} esFormularioSoloLectura
   * @description Indica si el formulario está en modo solo lectura.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * @property {RadioOpcion[]} tipo_opcion
   * @description Opciones disponibles para el tipo de persona exportador.
   */
  tipo_opcion: RadioOpcion[] = OPCION_DE_RADIO_EXPORTADOR

  /**
   * @property {Subject<void>} destroyNotifier$
   * @description Subject para manejar la destrucción de suscripciones.
   */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property {string} tipoPersonaExportador
   * @description Tipo de persona seleccionada ('Física' o 'Moral').
   */
  tipoPersonaExportador: string = '';

  /**
   * @property {DatosGrupos} datosState
   * @description Estado actual de los datos del trámite.
   */
  public datosState!: DatosGrupos

  /**
   * @constructor
   * @param {FormBuilder} fb - Servicio para construir formularios reactivos.
   * @param {PermisoImportacionStore} store - Store para manejar el estado global del trámite.
   * @param {Tramite130120Query} query - Query para obtener el estado de los datos del trámite.
   * @param {ConsultaioQuery} consultaquery - Query para obtener el estado de consulta y solo lectura.
   */
  constructor(
    public fb: FormBuilder,
    public store: PermisoImportacionStore,
    public query: Tramite130120Query,
    public consultaquery: ConsultaioQuery,
    private formValidation: FormValidationService,
    private cdr: ChangeDetectorRef,
  ) { }

  /**
   * @method ngOnInit
   * @description Inicializa el componente, suscribe al estado y configura los formularios y datos.
   */
  async ngOnInit(): Promise<void> {
    this.query.selectDatos$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((state) => {
          this.datosState = state as DatosGrupos;
          const PERSONA_TIPO = this.datosState?.datosExportador?.persona_tipo;
          // Validar que no sea null, undefined ni cadena vacía
          if (PERSONA_TIPO !== null && PERSONA_TIPO !== undefined && PERSONA_TIPO !== '') {
            this.tipoPersonaExportador = PERSONA_TIPO;
          }
        })
      )
      .subscribe();
    this.consultaquery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();
    await this.initActionFormBuild();
    if (this.esFormularioSoloLectura) {
      this.datosExportador.disable();
    }
  }

  /**
   * @method initActionFormBuild
   * @description Inicializa el formulario reactivo con los valores actuales del estado.
   */
  initActionFormBuild(): void {
    this.datosExportador = this.fb.group({
      persona_tipo: [this.datosState.datosExportador.persona_tipo, Validators.required],
      personales_nombre: [this.datosState.datosExportador.personales_nombre],
      primer_apellido: [this.datosState.datosExportador.primer_apellido],
      segundo_apellido: [this.datosState.datosExportador.segundo_apellido],
      denominacion_razon_social: [this.datosState.datosExportador.denominacion_razon_social_exportador],
      domicilio: [this.datosState.datosExportador.domicilio, [Validators.required, Validators.maxLength(200)]],
      observaciones: [this.datosState.datosExportador.observaciones, [Validators.maxLength(4000)]],
    });

    // Configurar validadores según el tipo de persona si ya existe un valor
    if (this.tipoPersonaExportador) {
      this.aplicarValidadoresPorTipoPersona(this.tipoPersonaExportador);
    }
  }

  /**
   * @method aplicarValidadoresPorTipoPersona
   * @description Aplica los validadores apropiados según el tipo de persona seleccionado.
   * @param {string} tipoPersona - Tipo de persona ('Física' o 'Moral').
   * @param {boolean} limpiarValores - Si se deben limpiar los valores de los campos condicionales.
   */
  private aplicarValidadoresPorTipoPersona(tipoPersona: string, limpiarValores: boolean = false): void {
    const GRUPO = this.datosExportador as FormGroup;

    // Siempre requerido
    GRUPO.get('persona_tipo')?.setValidators([Validators.required]);
    GRUPO.get('persona_tipo')?.updateValueAndValidity();

    // Limpiar validadores de campos condicionales
    GRUPO.get('personales_nombre')?.clearValidators();
    GRUPO.get('primer_apellido')?.clearValidators();
    GRUPO.get('segundo_apellido')?.clearValidators();
    GRUPO.get('denominacion_razon_social')?.clearValidators();

    // Limpiar valores solo si se solicita (cuando el usuario cambia la selección)
    if (limpiarValores) {
      GRUPO.get('personales_nombre')?.setValue('');
      GRUPO.get('primer_apellido')?.setValue('');
      GRUPO.get('segundo_apellido')?.setValue('');
      GRUPO.get('denominacion_razon_social')?.setValue('');

      this.store.setExportadorPersonales_nombre('');
      this.store.setExportadorPrimer_apellido('');
      this.store.setExportadorSegundo_apellido('');
      this.store.setExportadorDenominacion_razon_social('');
    }

    // Domicilio y Observaciones siempre tienen validadores (siempre visibles)
    GRUPO.get('domicilio')?.setValidators([Validators.required, Validators.maxLength(200)]);
    GRUPO.get('observaciones')?.setValidators([Validators.maxLength(4000)]);

    // Asignar validadores según el tipo de persona seleccionado
    if (tipoPersona === TIPO_PERSONA.FISICA) {
      GRUPO.get('personales_nombre')?.setValidators([Validators.required, Validators.maxLength(200)]);
      GRUPO.get('primer_apellido')?.setValidators([Validators.required, Validators.maxLength(200)]);
      GRUPO.get('segundo_apellido')?.setValidators([Validators.required, Validators.maxLength(200)]);
    } else if (tipoPersona === TIPO_PERSONA.MORAL) {
      GRUPO.get('denominacion_razon_social')?.setValidators([Validators.required, Validators.maxLength(250)]);
    }

    // Actualizar la validez de todos los campos
    GRUPO.get('personales_nombre')?.updateValueAndValidity();
    GRUPO.get('primer_apellido')?.updateValueAndValidity();
    GRUPO.get('segundo_apellido')?.updateValueAndValidity();
    GRUPO.get('denominacion_razon_social')?.updateValueAndValidity();
    GRUPO.get('domicilio')?.updateValueAndValidity();
    GRUPO.get('observaciones')?.updateValueAndValidity();

    this.cdr.detectChanges();
  }

  /**
   * @method onTipoPersonaExportadorChange
   * @description Cambia el tipo de persona exportador y ajusta los validadores y valores del formulario según la selección.
   * @param {string | number} value - Valor seleccionado para el tipo de persona.
   */
  onTipoPersonaExportadorChange(value: string | number): void {
    this.tipoPersonaExportador = String(value);
    this.store.setExportadorPersona_tipo(this.tipoPersonaExportador);
    this.aplicarValidadoresPorTipoPersona(this.tipoPersonaExportador, true);
  }

  /**
   * @method setValoresStore
   * @description Actualiza el store con el valor de un campo del formulario usando el método correspondiente.
   * @param {FormGroup} form - Formulario reactivo.
   * @param {string} campo - Nombre del campo en el formulario.
   * @param {keyof PermisoImportacionStore} metodoNombre - Método del store a invocar.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof PermisoImportacionStore,
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.store[metodoNombre] as (value: string) => void)(
      VALOR
    );
  }

  validarFormulario(): boolean {
    this.formValidation.marcarFormularioComoTocado(this.datosExportador);
    this.cdr.detectChanges();
    return this.datosExportador.valid;
  }

  /**
   * @method ngOnDestroy
   * @description Limpia las suscripciones activas cuando el componente es destruido.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

}
