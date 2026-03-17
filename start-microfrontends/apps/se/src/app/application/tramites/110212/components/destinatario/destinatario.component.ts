import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  ConsultaioQuery,
  ConsultaioState,
  REGEX_CORREO_ELECTRONICO,
  REGEX_SOLO_DIGITOS,
  ValidacionesFormularioService,
} from '@ng-mf/data-access-user';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Subject,
  map,
  takeUntil
} from 'rxjs';
import {
  Tramite110212State,
  Tramite110212Store,
} from '../../../../estados/tramites/tramite110212.store';
import { CatalogosSelect } from '@libs/shared/data-access-user/src/core/models/shared/components.model';
import { CommonModule } from '@angular/common';
import {
  DatosDelDestinatarioComponent,
} from '../../../../shared/components/datos-del-destinatario/datos-del-destinatario.component';
import {
  DestinatarioComponent,
} from '../../../../shared/components/destinatario/destinatario.component';
import {
  RepresentanteLegalExportadorComponent,
} from '../../../../shared/components/representante-legal-exportador/representante-legal-exportador.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import {
  Tramite110212Query,
} from '../../../../estados/queries/tramite110212.query';


interface FormValues {
  [key: string]: unknown;
}

/**
 * Componente para gestionar los datos del destinatario.
 *
 * Este componente permite al usuario ingresar y gestionar información relacionada con el destinatario,
 * como datos personales, direcciones, información representativa y detalles de transporte.
 */
@Component({
  selector: 'app-destinatario-tramite',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TooltipModule,
    RepresentanteLegalExportadorComponent,
    DatosDelDestinatarioComponent,
    DestinatarioComponent
  ],
  templateUrl: './destinatario.component.html',
  styleUrl: './destinatario.component.scss',
})
export class DestinatarioTramiteComponent implements OnInit, OnDestroy {
  /**
   * Formulario reactivo para gestionar los datos del destinatario.
   */
  registroFormulario!: FormGroup;

  /**
   * Catálogo de opciones de transporte.
   */
  transporte!: CatalogosSelect;

  /**
   * Estado actual de la solicitud.
   */
  public solicitudState!: Tramite110212State;

  /**
   * Notificador para destruir las suscripciones y evitar fugas de memoria.
   */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * Indicador para deshabilitar elementos del formulario.
   */
  estaDeshabilitado: boolean = false;

  /**
   * Indicador para verificar si el formulario está vacío.
   */
  estaVacio: boolean = false;
  /**
   * @property {ConsultaioState} consultaDatos
   * @description Estado actual de la consulta, que contiene información relacionada con el trámite y el solicitante.
   */
  consultaDatos!: ConsultaioState;
  /**
   * @property {boolean} soloLectura
   * @description Indica si el formulario o los campos están en modo de solo lectura.
   * @default false
   */
  soloLectura: boolean = false;
  /** Valores actuales del formulario de datos del destinatario. */
  formDatosDelDestinatarioValues!: FormValues;
  /** Bandera de validez para datos-del-destinatario */
  datosDelDestinatarioValido: boolean = false;
  /** Valores actuales del formulario de destinatario. */
  formDestinatarioValues!: FormValues;
  /** Bandera de validez para destinatario */
  destinatarioValido: boolean = false;
  /** Referencia al componente datos-del-destinatario para marcar campos como tocados */
  @ViewChild(DatosDelDestinatarioComponent) datosDelDestinatarioComponent?: DatosDelDestinatarioComponent;
  /** Referencia al componente destinatario para marcar campos como tocados */
  @ViewChild(DestinatarioComponent) destinatarioComponent?: DestinatarioComponent;
  /** Referencia al componente datos-del-destinatario para marcar campos como tocados */
  @ViewChild(RepresentanteLegalExportadorComponent) representanteLegalExportadorComponent?: RepresentanteLegalExportadorComponent;

  /** Valores actuales del formulario de grupo representativo. */
  grupoRepresentativoValues!: FormValues;
  /**
   * Constructor del componente.
   *
   * @param {FormBuilder} fb - Constructor para crear formularios reactivos.
   * @param {Tramite110212Store} store - Store para gestionar el estado del trámite.
   * @param {Tramite110212Query} query - Query para obtener el estado del trámite.
   * @param {ValidacionesFormularioService} validacionesService - Servicio para validar formularios.
   */
  constructor(
    public fb: FormBuilder,
    private store: Tramite110212Store,
    private query: Tramite110212Query,
    private validacionesService: ValidacionesFormularioService,
    private consultaioQuery: ConsultaioQuery,
  ) {
    // El constructor se utiliza para la inyección de dependencias.
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   *
   * Configura el formulario y suscribe al estado de la solicitud.
   */
  ngOnInit(): void {
    this.query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
          this.grupoRepresentativoValues = this.solicitudState.grupoRepresentativo as unknown as FormValues || {};
        })
      )
      .subscribe();
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.soloLectura = this.consultaDatos.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();

    this.donanteDomicilio();
  }

   /** Inicializa el formulario reactivo del destinatario */
  iniciarFormulario(): void {
    this.registroFormulario = this.fb.group({
      medioDeTransporte: [''],
      // Agrega otros controles aquí si es necesario
    });
  }
 
public validateAllForms(): boolean {
  let valid = true;
  this.destinatarioComponent?.markAllFieldsTouched();
  this.datosDelDestinatarioComponent?.markAllFieldsTouched();
  this.representanteLegalExportadorComponent?.markAllFieldsTouched();
  if (this.destinatarioComponent && this.destinatarioComponent.formDestinatario && !this.destinatarioComponent.formDestinatario.valid) {
    valid = false;
  }
  if (this.datosDelDestinatarioComponent && this.datosDelDestinatarioComponent.formDatosDelDestinatario && !this.datosDelDestinatarioComponent.formDatosDelDestinatario.valid) {
    valid = false;
  }
  if (this.representanteLegalExportadorComponent && this.representanteLegalExportadorComponent.form && !this.representanteLegalExportadorComponent.form.valid) {
    valid = false;
  }
  return valid;
}


  /**
   * Método que se ejecuta al destruir el componente.
   *
   * Libera los recursos y cancela las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Inicializa el formulario con los datos del estado de la solicitud.
   */
  donanteDomicilio(): void {
    this.registroFormulario = this.fb.group({
      grupoReceptor: this.fb.group({
        nombre: [this.solicitudState?.grupoReceptor?.nombre, []],
        apellidoPrimer: [this.solicitudState?.grupoReceptor?.apellidoPrimer, []],
        apellidoSegundo: [this.solicitudState?.grupoReceptor?.apellidoSegundo, []],
        numeroFiscal: [this.solicitudState?.grupoReceptor?.numeroFiscal, [Validators.required]],
        razonSocial: [this.solicitudState?.grupoReceptor?.razonSocial, []],
      }),

      grupoDeDirecciones: this.fb.group({
        ciudad: [this.solicitudState?.grupoDeDirecciones?.ciudad, [Validators.required]],
        calle: [this.solicitudState?.grupoDeDirecciones?.calle, [Validators.required]],
        numeroLetra: [this.solicitudState?.grupoDeDirecciones?.numeroLetra, [Validators.required]],
        lada: [this.solicitudState?.grupoDeDirecciones?.lada, []],
        telefono: [this.solicitudState?.grupoDeDirecciones?.telefono, [Validators.pattern(REGEX_SOLO_DIGITOS)]],
        fax: [this.solicitudState?.grupoDeDirecciones?.fax, [Validators.pattern(REGEX_SOLO_DIGITOS)]],
        correoElectronico: [this.solicitudState?.grupoDeDirecciones?.correoElectronico, [Validators.required, Validators.pattern(REGEX_CORREO_ELECTRONICO)]],
      }),

      grupoRepresentativo: this.fb.group({
        lugar: [this.solicitudState?.grupoRepresentativo?.lugar, [Validators.required]],
        nombreExportador: [this.solicitudState?.grupoRepresentativo?.nombreExportador, [Validators.required]],
        empresa: [this.solicitudState?.grupoRepresentativo?.empresa, [Validators.required]],
        cargo: [this.solicitudState?.grupoRepresentativo?.cargo, [Validators.required]],
        lada: [this.solicitudState?.grupoRepresentativo?.lada, []],
        telefono: [this.solicitudState?.grupoRepresentativo?.telefono, [Validators.required, Validators.pattern(REGEX_SOLO_DIGITOS)]],
        fax: [this.solicitudState?.grupoRepresentativo?.fax, [Validators.required, Validators.pattern(REGEX_SOLO_DIGITOS)]],
        correoElectronico: [this.solicitudState?.grupoRepresentativo?.correoElectronico, [Validators.required, Validators.pattern(REGEX_CORREO_ELECTRONICO)]],
      }),
    });
    this.inicializarEstadoFormulario();
  }
  /**
   * @method inicializarEstadoFormulario
   * @description Inicializa el estado del formulario según el modo de solo lectura.
   * 
   * Si la propiedad `soloLectura` es verdadera, deshabilita todos los controles del formulario.
   * En caso contrario, habilita los controles del formulario.
   * 
   * @returns {void}
   */
  inicializarEstadoFormulario(): void {
    if (this.soloLectura) {
      this.registroFormulario?.disable();
    } else {
      this.registroFormulario?.enable();
    }
  }
  /**
   * Valida el formulario del destinatario.
   *
   * Si el formulario es inválido, marca todos los campos como tocados.
   */
  validarDestinatarioFormulario(): void {
    this.registroFormulario.markAllAsTouched();
    if (this.registroFormulario.invalid) {
      // formulario válido
    }
  }

  /**
   * Maneja el evento de clic para deshabilitar elementos del formulario.
   */
  onClick(): void {
    this.estaDeshabilitado = true;
  }

  /**
   * Maneja el envío del formulario.
   *
   * Si el formulario es válido, se implementará la lógica para manejar el envío.
   */
  onSubmit(): void {
    if (this.registroFormulario.valid) {
      // Aquí se implementará la lógica para manejar el envío del formulario.
    }
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

  /**
   * Actualiza el estado del store con el valor seleccionado en el formulario.
   *
   * @param {FormGroup} form - El formulario reactivo.
   * @param {string} campo - El nombre del campo en el formulario.
   * @param {keyof Tramite110212Store} metodoNombre - El nombre del método en el store para actualizar el estado.
   */

  setValoresStore(event: { formGroupName: string, campo: string, valor: undefined, storeStateName: string }): void {
    const { campo: CAMPO, valor: VALOR } = event;
    this.store.setFormDatosDelDestinatario({ [CAMPO]: VALOR });
    this.store.setFormDestinatario({ [CAMPO]: VALOR });
  }

  /**
   * @description
   * Actualiza el store utilizando un método dinámico con el valor de un campo específico.
   * @param event Evento con el campo y valor a actualizar.
   * @returns {void}
   */
  setValoresStore1(event: { formGroupName: string; campo: string; VALOR: undefined; METODO_NOMBRE: string; }): void {
    const { VALOR, METODO_NOMBRE } = event;
    (this.store as unknown as Record<string, (value: unknown) => void>)[METODO_NOMBRE]?.(VALOR);
  }

  /**
   * Obtiene el grupo receptor del formulario.
   *
   * @returns {FormGroup} El grupo receptor.
   */
  get grupoReceptor(): FormGroup {
    return this.registroFormulario.get('grupoReceptor') as FormGroup;
  }

  /**
   * Obtiene el grupo de direcciones del formulario.
   *
   * @returns {FormGroup} El grupo de direcciones.
   */
  get grupoDeDirecciones(): FormGroup {
    return this.registroFormulario.get('grupoDeDirecciones') as FormGroup;
  }

  /**
   * Obtiene el grupo representativo del formulario.
   *
   * @returns {FormGroup} El grupo representativo.
   */
  get grupoRepresentativo(): FormGroup {
    return this.registroFormulario.get('grupoRepresentativo') as FormGroup;
  }

  /**
   * Recibe validez del formulario de datos-del-destinatario
   */
  setFormValida(valido: boolean): void {
    this.datosDelDestinatarioValido = valido;
  }
  /**
   * 
   * @param valido 
   */
  setFormValidaDestinatario(valido: boolean): void {
    this.destinatarioValido = valido;
  }
}
