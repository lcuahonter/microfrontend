import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  ConsultaioQuery,
  ConsultaioState,
  REGEX_CORREO_ELECTRONICO_EXPORTADOR,
  REGEX_SOLO_DIGITOS,
  TituloComponent,
  ValidacionesFormularioService
} from '@ng-mf/data-access-user';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import {
  Tramite110216State,
  Tramite110216Store
} from '../../../../estados/tramites/tramite110216.store';
import { CatalogosSelect } from '@libs/shared/data-access-user/src/core/models/shared/components.model';
import { CommonModule } from '@angular/common';
import { Tramite110216Query } from '../../../../estados/queries/tramite110216.query';

/**
 * Componente para gestionar los datos del destinatario.
 * 
 * Este componente permite al usuario ingresar y gestionar información relacionada con el destinatario,
 * como datos personales, direcciones, información representativa y detalles de transporte.
 */
@Component({
  selector: 'app-destinatario',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './destinatario.component.html',
  styleUrl: './destinatario.component.scss',
})
export class DestinatarioComponent implements OnInit, OnDestroy {

  /** Indica si el botón continuar ha sido activado para ejecutar las validaciones del formulario. */
  @Input() isContinuarTriggered: boolean = false;

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
  public solicitudState!: Tramite110216State;

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

  /**
   * Constructor del componente.
   * 
   * @param {FormBuilder} fb - Constructor para crear formularios reactivos.
   * @param {Tramite110216Store} store - Store para gestionar el estado del trámite.
   * @param {Tramite110216Query} query - Query para obtener el estado del trámite.
   * @param {ValidacionesFormularioService} validacionesService - Servicio para validar formularios.
   * @param {ConsultaioQuery} consultaioQuery - Query para obtener el estado de la consulta.
   */
  constructor(
    public fb: FormBuilder,
    private store: Tramite110216Store,
    private query: Tramite110216Query,
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
        correoElectronico: [this.solicitudState?.grupoDeDirecciones?.correoElectronico, [Validators.required, Validators.email,Validators.pattern(REGEX_CORREO_ELECTRONICO_EXPORTADOR)]],
      }),

      grupoRepresentativo: this.fb.group({
        lugar: [this.solicitudState?.grupoRepresentativo?.lugar, [Validators.required, Validators.maxLength(40)]],
        nombreExportador: [this.solicitudState?.grupoRepresentativo?.nombreExportador, [Validators.required, Validators.maxLength(40)]],
        empresa: [this.solicitudState?.grupoRepresentativo?.empresa, [Validators.required, Validators.maxLength(40)]],
        cargo: [this.solicitudState?.grupoRepresentativo?.cargo, [Validators.required, Validators.maxLength(40)]],
        lada: [this.solicitudState?.grupoRepresentativo?.lada, []],
        telefono: [this.solicitudState?.grupoRepresentativo?.telefono, [Validators.required, Validators.pattern(REGEX_SOLO_DIGITOS)]],
        fax: [this.solicitudState?.grupoRepresentativo?.fax, [Validators.required, Validators.pattern(REGEX_SOLO_DIGITOS)]],
        correoElectronico: [this.solicitudState?.grupoRepresentativo?.correoElectronico, [Validators.required, Validators.email]],
      }),

      grupoDeTransporte: this.fb.group({
        puertoEmbarque: [this.solicitudState?.grupoDeTransporte?.puertoEmbarque, [Validators.maxLength(40)]],
        puertoDesembarque: [this.solicitudState?.grupoDeTransporte?.puertoDesembarque, [Validators.maxLength(40)]],
        puertoTransito: [this.solicitudState?.grupoDeTransporte?.puertoTransito, [Validators.maxLength(30)]],
        nombreEmbarcacion: [this.solicitudState?.grupoDeTransporte?.nombreEmbarcacion, [Validators.maxLength(30)]],
        numeroVuelo: [this.solicitudState?.grupoDeTransporte?.numeroVuelo, [Validators.maxLength(15)]]
      }),
    });
 
    /**
     * Utiliza queueMicrotask para actualizar la validez del formulario y sincronizar el estado en el store.
     *
     * Esta llamada asegura que la validación y el estado del formulario se actualicen correctamente
     * después de la inicialización, evitando problemas de sincronización en el ciclo de vida de Angular.
     * Se actualiza la validez del formulario sin emitir eventos y se registra el estado de validez en el store.
     */
    queueMicrotask(() => {
      this.registroFormulario.updateValueAndValidity({ emitEvent: false });
      this.store.setFormValidity('destinatario', this.registroFormulario.valid);
    });

    this.inicializarEstadoFormulario();

    if (this.isContinuarTriggered) {
      Promise.resolve().then(() => {
        this.registroFormulario.markAllAsTouched();
      });
    }
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
   * @param {keyof Tramite110216Store} metodoNombre - El nombre del método en el store para actualizar el estado.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite110216Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.store[metodoNombre] as (value: unknown) => void)(VALOR);
    this.store.setFormValidity('destinatario', this.registroFormulario.valid);
  }

  /**
   * Obtiene el grupo de transporte del formulario.
   * 
   * @returns {FormGroup} El grupo de transporte.
   */
  get grupoDeTransporte(): FormGroup {
    return this.registroFormulario.get('grupoDeTransporte') as FormGroup;
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
   * Valida el formulario del destinatario.
   * 
   * @returns {boolean} `true` si el formulario es válido, de lo contrario `false`.
   */
  public validarFormulario(): void {
    this.registroFormulario.markAllAsTouched();
  }
}