import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { REGEX_CORREO_ELECTRONICO, REGEX_SOLO_DIGITOS } from '@ng-mf/data-access-user';
import { SeccionLibQuery, SeccionLibState, SeccionLibStore } from '@libs/shared/data-access-user/src';
import { Subject, map, takeUntil } from 'rxjs';
import { Tramite110221Store } from '../../estados/tramite110221.store';

import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DatosDelDestinatarioComponent } from '../../../../shared/components/datos-del-destinatario/datos-del-destinatario.component';
import { DestinatarioComponent } from '../../../../shared/components/destinatario/destinatario.component';
import { GrupoRepresentativo } from '../../models/peru-certificado.model';
import { ID_PROCEDIMIENTO } from '../../constantes/peru-certificado.model';
import { RepresentanteLegalExportadorComponent } from '../../../../shared/components/representante-legal-exportador/representante-legal-exportador.component';
import { Tramite110221Query } from '../../estados/tramite110221.query';
import { Validators } from '@angular/forms';

import { Tramite110221State } from '../../estados/tramite110221.store';

/**
* @description
* Representa un objeto genérico para valores de formulario, donde cada clave de propiedad es una cadena y el valor puede ser de cualquier tipo.
*
* @typeParam key: El nombre del campo de formulario.
* @typeParam unknown: El valor asociado al campo de formulario, de cualquier tipo.
 *
 * @see https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html
 *
 * @example
 * const values: FormValues = {
 *   firstName: 'John',
 *   age: 30,
 *   isActive: true
 * };
 */
interface FormValues {
  [key: string]: unknown;
}

/**
 * @component DestinatarioDeCertificadoComponent
 * @descripcion
 * Componente responsable de gestionar los datos y las interacciones relacionadas con el formulario de destinatario en el módulo PERU.
 * Permite la visualización, edición y validación de los datos del destinatario, exportador y datos relacionados, así como la actualización del estado en el store correspondiente.
 * Controla el modo de solo lectura y la destrucción de suscripciones para evitar fugas de memoria.
 */
@Component({
  selector: 'app-destinatario-de-certificado',
  templateUrl: './destinatario-de-certificado.component.html',
  styleUrls: ['./destinatario-de-certificado.component.scss'], // Fix typo here
})
export class DestinatarioDeCertificadoComponent implements OnInit, OnDestroy {
  
 
    /**
   * @descripcion
   * Valores actuales del formulario de destinatario.
   */
  formDestinatarioValues!: FormValues;

  /**
   * @descripcion
   * Valores actuales del formulario de datos del destinatario.
   */
  formDatosDelDestinatarioValues!: FormValues;

  /**
   * @property {FormValues} formExportadorValues
   * @description Almacena los valores del formulario relacionados con el exportador.
   * @memberof DestinatarioDeCertificadoComponent
   * @see FormValues
   */
  formExportadorValues!: GrupoRepresentativo;

  /**
   * @descripcion
   * Notificador para gestionar la destrucción de suscripciones.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @descripcion
   * Estado actual del formulario de exportador.
   */
  public exportadoState!: Tramite110221State;

  /**
   * @descripcion
   * Estado actual de la sección.
   */
  private seccionState!: SeccionLibState;

  /**
   * @ignore
   * @description Indica si se debe ocultar el campo de LADA en el formulario.
   * @type {boolean}
   * @default true
   */
  ocultarLada: boolean = true;

  /**
   * @property {boolean} ocultarFax
   * @description Indica si el campo de fax debe estar oculto en la interfaz de usuario.
   * @default true
   * @memberof DestinatarioDeCertificadoComponent
   */
  ocultarFax: boolean = true;

  /**
   * @descripcion
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * @descripcion
   * Identificador único del procedimiento asociado al formulario.
   * @type {number}
   * @readonly
   */
  public readonly idProcedimiento: number = ID_PROCEDIMIENTO;
  /**
   * Indica si el formulario de datos del destinatario es válido.
   * Se utiliza para habilitar o deshabilitar la navegación en el asistente (wizard).
   */
  registroFormulario!: FormGroup;
  
    /** Referencia al componente datos-del-destinatario para marcar campos como tocados */
    @ViewChild(DatosDelDestinatarioComponent) datosDelDestinatarioComponent?: DatosDelDestinatarioComponent;
    /** Referencia al componente destinatario para marcar campos como tocados */
    @ViewChild(DestinatarioComponent) destinatarioComponent?: DestinatarioComponent;
    /** Referencia al componente datos-del-destinatario para marcar campos como tocados */
    @ViewChild(RepresentanteLegalExportadorComponent) representanteLegalExportadorComponent?: RepresentanteLegalExportadorComponent;
  
  /** Referencia al componente DestinatarioComponent */
  @ViewChild('destinatarioRef') destinatario!: DestinatarioDeCertificadoComponent;


  /** Indica si el país de destino está habilitado. */
  paisDestino = true;
  /**
   * @descripcion
   * Constructor que inicializa los servicios y dependencias requeridas.
   * @param fb - Instancia de FormBuilder para gestionar formularios.
   * @param store - Almacén para gestionar el estado del formulario de certificado.
   * @param query - Consulta para obtener el estado del formulario.
   * @param seccionStore - Almacén para gestionar el estado de la sección.
   * @param seccionQuery - Consulta para obtener el estado de la sección.
   * @param consultaQuery - Consulta para obtener el estado global de consulta.
   */
  constructor(
    private readonly fb: FormBuilder,
    private store: Tramite110221Store,
    private query: Tramite110221Query,
    private seccionStore: SeccionLibStore,
    private seccionQuery: SeccionLibQuery,
    private consultaQuery: ConsultaioQuery
  ) {
    this.query.selectFormDatosDelDestinatario$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((estado) => {
        this.formDatosDelDestinatarioValues = estado;
      });

    this.query.selectFormDestinatario$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((estado) => {
        this.formDestinatarioValues = estado;
      });


    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();
  }

  /**
   * @method ngOnInit
   * @descripcion
   * Hook del ciclo de vida que se llama después de inicializar el componente.
   * Obtiene los datos iniciales para el formulario y suscribe al estado de la sección y del trámite.
   */
  ngOnInit(): void {
    this.seccionQuery.selectSeccionState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.seccionState = seccionState;
        })
      )
      .subscribe();

    this.query.selectTramite$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((state) => {
          this.exportadoState = state as Tramite110221State;
        })
      )
      .subscribe();
  }

    /** Inicializa el formulario reactivo del destinatario */
  iniciarFormulario(): void {
    this.registroFormulario = this.fb.group({
      medioDeTransporte: [''],
      // Agrega otros controles aquí si es necesario
    });
  }
  /**
   * @method validateAllForms
   * @descripcion
   * Valida todos los formularios hijos marcando todos los campos como tocados.
   * @returns {boolean} - Retorna true si todos los formularios son válidos, false en caso contrario.
   */
 public validateAllForms(): boolean {
  let valid = true;

  this.destinatarioComponent?.markAllFieldsTouched();
  this.datosDelDestinatarioComponent?.markAllFieldsTouched();
  this.representanteLegalExportadorComponent?.markAllFieldsTouched();

  if (this.destinatarioComponent?.formDestinatario) {
    if (!this.destinatarioComponent.formDestinatario.valid) {
      valid = false;
    } 
  } else {
    valid = false;
  }

  if (this.datosDelDestinatarioComponent?.formDatosDelDestinatario) {
    if (!this.datosDelDestinatarioComponent.formDatosDelDestinatario.valid) {
      valid = false;
    } 
  } else {
    valid = false;
  }

  if (this.representanteLegalExportadorComponent?.form) {
    if (!this.representanteLegalExportadorComponent.form.valid) {
      valid = false;
    }
  } else {
    valid = false;
  }

  return valid;
}

  /**
   * @method datosDelDestinatarioFunc
   * @descripcion
   * Actualiza el almacén con los datos del destinatario.
   * @param e - Los datos del destinatario a almacenar.
   */
  datosDelDestinatarioFunc(e: unknown): void {
    this.store.setFormDatosDelDestinatario(e as FormValues);
  }

  /**
   * @method setValoresStoreDatos
   * @descripcion
   * Actualiza el almacén con los datos del formulario de datos del destinatario.
   * @param event - Objeto que contiene el nombre del grupo de formulario, el campo, el valor y el nombre del estado del almacén.
   */
  setValoresStoreDatos(event: { formGroupName: string, campo: string, valor: undefined, storeStateName: string }): void {
    const { campo: CAMPO, valor: VALOR } = event;
    this.store.setFormDatosDelDestinatario({ [CAMPO]: VALOR });
  }

  /**
   * @method setValoresStoreExportador
   * @descripcion
   * Actualiza el almacén con los datos del formulario de exportador.
   * @param event - Objeto que contiene el nombre del grupo de formulario, el campo, el valor y el nombre del estado del almacén.
   */
  setValoresStoreExportador(event: { formGroupName: string, campo: string, valor: undefined, storeStateName: string }): void {
    const { campo: CAMPO, valor: VALOR } = event;
    this.store.setFormExportador({ [CAMPO]: VALOR });
  }

  /**
   * @method setValoresStoreDe
   * @descripcion
   * Actualiza el almacén con los datos del formulario de destinatario.
   * @param event - Objeto que contiene el nombre del grupo de formulario, el campo, el valor y el nombre del estado del almacén.
   */
  setValoresStoreDe(event: { formGroupName: string, campo: string, valor: undefined, storeStateName: string }): void {
    const { campo: CAMPO, valor: VALOR } = event;
    this.store.setFormDestinatario({ [CAMPO]: VALOR });
  }
  

/**
   * @method setValoresStore1
   * @descripcion
   * Actualiza el almacén con los datos del formulario de destinatario.
   * @param event - Objeto que contiene el nombre del grupo de formulario, el campo, el valor y el nombre del estado del almacén.
   */
  setValoresStore1(event: { formGroupName: string; campo: string; VALOR: undefined; METODO_NOMBRE: string; }): void {
    const { VALOR, METODO_NOMBRE } = event;
    (this.store as unknown as Record<string, (value: unknown) => void>)[METODO_NOMBRE]?.(VALOR);
  }
  /**
     * Inicializa el formulario con los datos del estado de la solicitud.
     */
  donanteDomicilio(): void {
    this.registroFormulario = this.fb.group({
      grupoRepresentativo: this.fb.group({
        lugar: [this.exportadoState?.grupoRepresentativo?.lugar, [Validators.required]],
        nombre: [this.exportadoState?.grupoRepresentativo?.nombre, [Validators.required]],
        empresa: [this.exportadoState?.grupoRepresentativo?.empresa, [Validators.required]],
        cargo: [this.exportadoState?.grupoRepresentativo?.cargo, [Validators.required]],
        registroFiscal: [this.exportadoState?.grupoRepresentativo?.registroFiscal, []],
        telefono: [this.exportadoState?.grupoRepresentativo?.telefono, [Validators.required, Validators.pattern(REGEX_SOLO_DIGITOS)]],
        fax: [this.exportadoState?.grupoRepresentativo?.fax, [Validators.required, Validators.pattern(REGEX_SOLO_DIGITOS)]],
        correo: [this.exportadoState?.grupoRepresentativo?.correo, [Validators.required, Validators.pattern(REGEX_CORREO_ELECTRONICO)]],
      }),
    });
  }

  /**
   * Getter para el grupo representativo del formulario.
   * @returns {FormGroup} El grupo representativo del formulario.
   */

  get grupoRepresentativo(): FormGroup {
    return this.registroFormulario.get('grupoRepresentativo') as FormGroup;
  }
  /**
   * @method setFormValida
   * @descripcion
   * Actualiza el almacén con el estado de validación del formulario de destinatario.
   * @param valida - El estado de validación del formulario.
   */
  setFormValida(valida: boolean): void {
    this.store.setFormValida({ destinatrio: valida });
  }

  /**
   * @method setFormValidaExportador
   * @descripcion
   * Actualiza el almacén con el estado de validación del formulario de exportador.
   * @param valida - El estado de validación del formulario.
   */
  setFormValidaExportador(valida: boolean): void {
    this.store.setFormValida({ exportador: valida });
  }

  /**
   * @method setFormValidaDestinatario
   * @descripcion
   * Actualiza el almacén con el estado de validación de los datos del destinatario.
   * @param valida - El estado de validación de los datos del destinatario.
   */
  setFormValidaDestinatario(valida: boolean): void {
    this.store.setFormValida({ datosDestinatario: valida });
  }

  /**
   * @method validatorCheck
   * @descripcion
   * Verifica la validez del formulario de registro.
   * @returns {boolean} - Retorna true si el formulario es válido, false en caso contrario.
   */
  validatorCheck(): boolean {
    if (!this.registroFormulario) {
      return false;
    }
    const DESTINATARIO_FORM_VALID = this.registroFormulario.get('destinatarioForm')?.valid;
    const DOMICILIO_FORM_VALID = this.registroFormulario.get('domicilioForm')?.valid;
    const REPRESENTANTE_LEGAL_FORM_VALID = this.registroFormulario.get('representanteLegalForm')?.valid;

    if (DESTINATARIO_FORM_VALID && DOMICILIO_FORM_VALID && REPRESENTANTE_LEGAL_FORM_VALID) {
      return true;
    }
    this.registroFormulario.get('destinatarioForm')?.markAllAsTouched();
    this.registroFormulario.get('domicilioForm')?.markAllAsTouched();
    this.registroFormulario.get('representanteLegalForm')?.markAllAsTouched();
    return false;
  }
  /**
   * @method validarFormulario
   * @descripcion
   * Valida el formulario de registro.
   * @returns {boolean} - Retorna true si el formulario es válido, false en caso contrario.
   */
  validarFormulario(): boolean {
    let isValid = true;
    if (this.datosDelDestinatarioComponent) {
      if (!this.datosDelDestinatarioComponent.validarFormularios()) {
        isValid = false;
      }
    }
    if (this.destinatarioComponent) {
      if (!this.destinatarioComponent.validarFormularios()) {
        isValid = false;
      }
    }
    if (this.representanteLegalExportadorComponent) {
      if (!this.representanteLegalExportadorComponent.validarFormularios()) {
        isValid = false;
      }
    } else {
      isValid = false;
    }
    return isValid;
  }
  /**
  * @method ngOnDestroy
  * @descripcion
  * Hook del ciclo de vida que se llama cuando el componente se destruye.
  * Limpia los recursos y suscripciones.
  */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}


