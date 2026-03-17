import {
  CamState,
  camCertificadoStore,
} from '../../estados/cam-certificado.store';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  ConsultaioQuery,
  SeccionLibQuery,
  SeccionLibState,
} from '@ng-mf/data-access-user';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DatosDelDestinatarioComponent } from '../../../../shared/components/datos-del-destinatario/datos-del-destinatario.component';
import { DestinatarioComponent } from '../../../../shared/components/destinatario/destinatario.component';
import { RepresentanteLegalExportadorComponent } from '../../../../shared/components/representante-legal-exportador/representante-legal-exportador.component';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { camCertificadoQuery } from '../../estados/cam-certificado.query';

/**
 * @interface FormValues
 * @description
 * Representa un objeto genérico para almacenar los valores de los formularios.
 * Cada clave es un string y su valor puede ser de cualquier tipo.
 */
interface FormValues {
  [key: string]: unknown;
}

/**
 * @component
 * @name CamDestinatarioComponent
 * @description
 * Componente responsable de gestionar el formulario y la lógica relacionada con los datos del destinatario en el trámite 110211.
 * Permite la captura, visualización y actualización de los datos del exportador y destinatario, así como la gestión del estado de solo lectura.
 * Utiliza formularios reactivos y se integra con el store para mantener el estado sincronizado.
 *
 * @example
 * <app-cam-destinatario></app-cam-destinatario>
 *
 * @see CertificadoDeOrigenComponent
 * @see DatosCertificadoDeComponent
 * @see DatosDelDestinatarioComponent
 * @see TituloComponent
 * @see DestinatarioComponent
 *
 * @author
 * Equipo de desarrollo VUCEM
 */
/**
 * Componente encargado de gestionar el formulario y la lógica relacionada con los datos del destinatario
 * en el trámite 110211. Permite la captura, visualización y actualización de los datos del exportador y destinatario,
 * así como la gestión del estado de solo lectura y la sincronización con el almacén de estado.
 *
 * @remarks
 * Este componente utiliza formularios reactivos y se integra con el sistema de estado de la aplicación
 * para mantener la consistencia de los datos entre los distintos subcomponentes y el almacén global.
 *
 * @example
 * ```html
 * <app-cam-destinatario></app-cam-destinatario>
 * ```
 *
 * @comdoc
 * - Gestiona el formulario de exportador y destinatario.
 * - Sincroniza los valores del formulario con el almacén de estado.
 * - Permite habilitar/deshabilitar el formulario según el estado de solo lectura.
 * - Expone métodos para actualizar valores y validaciones en el almacén.
 *
 * @see CamState
 * @see SeccionLibState
 * @see camCertificadoStore
 * @see camCertificadoQuery
 * @see SeccionLibQuery
 * @see ConsultaioQuery
 */
@Component({
  selector: 'app-cam-destinatario',
  templateUrl: './cam-destinatario.component.html',
  styleUrl: './cam-destinatario.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DatosDelDestinatarioComponent,
    TituloComponent,
    DestinatarioComponent,
    RepresentanteLegalExportadorComponent,
  ],
})
export class CamDestinatarioComponent implements OnInit, OnDestroy {
  /**
   * @property {FormValues} formDestinatarioValues
   * @description Valores actuales del formulario de destinatario.
   */
  formDestinatarioValues!: FormValues;

  /**
   * @property {FormValues} formDatosDelDestinatarioValues
   * @description Valores actuales del formulario de datos del destinatario.
   */
  formDatosDelDestinatarioValues!: FormValues;

  /**
   * @property {CamState['grupoRepresentativo']} grupoRepresentativo
   * @description Estado actual del grupo representativo.
   */
  grupoRepresentativo!: CamState['grupoRepresentativo'];

  /**
   * @property {Subject<void>} destroyNotifier$
   * @description Notificador para gestionar la destrucción de suscripciones.
   * @private
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property {CamState} exportadoState
   * @description Estado actual del formulario de exportador.
   * @private
   */
  exportadoState!: CamState;

  /**
   * @property {SeccionLibState} seccionState
   * @description Estado actual de la sección.
   * @private
   */
  private seccionState!: SeccionLibState;

  /**
   * @property {boolean} esFormularioSoloLectura
   * @description Indica si el formulario se encuentra en modo solo lectura. Si es `true`, los campos del formulario no podrán ser editados por el usuario.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * @property {number} idProcedimiento
   * @description ID del procedimiento asociado al componente.
   */
  idProcedimiento: number = 110211;

  /**
   * @property {DatosDelDestinatarioComponent} datosDelDestinatarioComponent
   * @description Referencia al componente hijo `DatosDelDestinatarioComponent` para acceder a sus métodos y propiedades.
   */
  @ViewChild('datosDelDestinatarioComponent', { static: false })
  datosDelDestinatarioComponent!: DatosDelDestinatarioComponent;

  /**
   * @property {DestinatarioComponent} destinatarioComponent
   * @description Referencia al componente hijo `DestinatarioComponent` para acceder a sus métodos y propiedades.
   */
  @ViewChild('destinatarioRef', { static: false })
  destinatarioComponent!: DestinatarioComponent;

  /**
   * @property {RepresentanteLegalExportadorComponent} representanteLegalExportadorComponent
   * @description Referencia al componente hijo `RepresentanteLegalExportadorComponent` para acceder a sus métodos y propiedades.
   */
  @ViewChild('representanteLegalExportadorComponent', { static: false })
  representanteLegalExportadorComponent!: RepresentanteLegalExportadorComponent;

  /** Indica si el campo Razón Social puede ser editado. */
  razonSocialEditable: boolean = false;

  /**
   * @constructor
   * @description
   * Constructor que inicializa los servicios y dependencias requeridas.
   * @param fb Instancia de FormBuilder para gestionar formularios.
   * @param store Almacén para gestionar el estado del formulario de certificado.
   * @param query Consulta para obtener el estado del formulario.
   * @param seccionStore Almacén para gestionar el estado de la sección.
   * @param seccionQuery Consulta para obtener el estado de la sección.
   * @param consultaioQuery Consulta para obtener el estado global de solo lectura.
   */
  constructor(
    private readonly fb: FormBuilder,
    private store: camCertificadoStore,
    private query: camCertificadoQuery,
    private seccionQuery: SeccionLibQuery,
    private consultaioQuery: ConsultaioQuery
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

    this.query.selectGrupoRepresentativo$?.pipe(takeUntil(this.destroyNotifier$))
      .subscribe((estado) => {
        this.grupoRepresentativo = estado;
      });

    this.consultaioQuery.selectConsultaioState$
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
   * @description
   * Hook del ciclo de vida que se llama después de inicializar el componente.
   * Obtiene los datos iniciales para el formulario y el estado de la sección.
   */
  async ngOnInit(): Promise<void> {
    await this.seccionQuery.selectSeccionState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.seccionState = seccionState;
        })
      )
      .subscribe();
    await this.query.selectCam$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((state) => {
          this.exportadoState = state as CamState;
        })
      )
      .subscribe();
  }

  /**
   * @description
   * Actualiza el store utilizando un método dinámico con el valor de un campo específico.
   * @param event Evento con el campo y valor a actualizar.
   * @returns {void}
   */
  setValoresStore1(event: {
    formGroupName: string;
    campo: string;
    VALOR: string;
    METODO_NOMBRE: string;
  }): void {
    const { VALOR, METODO_NOMBRE } = event;
    (this.store as unknown as Record<string, (value: unknown) => void>)[
      METODO_NOMBRE
    ]?.(VALOR);
  }

  /**
   * Maneja los valores del store para el representante legal.
   * @param event Evento del formulario con estructura específica del representante
   */
  setValoresStoreRepresentante(event: { formGroupName: string; campo: string; VALOR: unknown; METODO_NOMBRE: string }): void {
    const { VALOR } = event;
    this.store.setGrupoRepresentativoNombreExportador({ [event.campo]: VALOR });
  }

  /**
   * @method datosDelDestinatarioFunc
   * @description
   * Actualiza el almacén con los datos del destinatario.
   * @param e Los datos del destinatario a almacenar.
   */
  datosDelDestinatarioFunc(e: unknown): void {
    this.store.setFormDatosDelDestinatario(e as FormValues);
  }

  /**
   * @method setValoresStoreDatos
   * @description
   * Actualiza el almacén con los datos del formulario de datos del destinatario.
   * @param event Objeto que contiene el nombre del grupo de formulario, el campo, el valor y el nombre del estado del almacén.
   */
  setValoresStoreDatos(event: {
    formGroupName: string;
    campo: string;
    valor: undefined | string | number | boolean;
    storeStateName: string;
  }): void {
    const { campo: CAMPO, valor: VALOR } = event;
    this.store.setFormDatosDelDestinatario({ [CAMPO]: VALOR });
    if(event.campo === 'nombres' && event.valor !== ''){
      this.razonSocialEditable = true;
    }else{
      this.razonSocialEditable = false;
    }
  }

  /**
   * @method setValoresStoreDe
   * @description
   * Actualiza el almacén con los datos del formulario de destinatario.
   * @param event Objeto que contiene el nombre del grupo de formulario, el campo, el valor y el nombre del estado del almacén.
   */
  setValoresStoreDe(event: {
    formGroupName: string;
    campo: string;
    valor: undefined | string | number | boolean;
    storeStateName: string;
  }): void {
    const { campo: CAMPO, valor: VALOR } = event;
    this.store.setFormDestinatario({ [CAMPO]: VALOR });
  }

  /**
   * @method setFormValida
   * @description
   * Actualiza el almacén con el estado de validación del formulario de destinatario.
   * @param valida El estado de validación del formulario.
   */
  setFormValida(valida: boolean): void {
    this.store.setFormValida({ destinatrio: valida });
  }

  /**
   * @method setFormValidaDestinatario
   * @description
   * Actualiza el almacén con el estado de validación de los datos del destinatario.
   * @param valida El estado de validación de los datos del destinatario.
   */
  setFormValidaDestinatario(valida: boolean): void {
    this.store.setFormValida({ datosDestinatario: valida });
  }

  /**
   * @method setValoresStore
   * @description
   * Actualiza el almacén con un valor específico del formulario.
   * @param form El formulario que contiene el valor.
   * @param campo El campo del formulario cuyo valor se actualizará.
   * @param metodoNombre El método del almacén que se llamará para actualizar el valor.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof camCertificadoStore
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.store[metodoNombre] as (value: camCertificadoStore) => void)(VALOR);
  }
  validarFormularios(): boolean {
    let isFormInvalid = true;
    //  if(this.exportadorForm.invalid){
    // this.exportadorForm.markAllAsTouched();
    //  isFormInvalid = false;
    // }
    if (this.datosDelDestinatarioComponent) {
      if (!this.datosDelDestinatarioComponent.validarFormularios()) {
        isFormInvalid = false;
      }
    } else {
      isFormInvalid = false;
    }
    if (this.destinatarioComponent) {
      if (!this.destinatarioComponent.validarFormularios()) {
        isFormInvalid = false;
      }
    } else {
      isFormInvalid = false;
    }
    if (this.representanteLegalExportadorComponent) {
      if (!this.representanteLegalExportadorComponent.validarFormularios()) {
        isFormInvalid = false;
      }
    } else {
      isFormInvalid = false;
    }
    return isFormInvalid;
  }

  /**
   * @method ngOnDestroy
   * @description
   * Hook del ciclo de vida que se llama cuando el componente se destruye.
   * Limpia los recursos y suscripciones.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
