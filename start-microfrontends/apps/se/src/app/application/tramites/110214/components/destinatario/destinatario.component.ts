import { Component, Input } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, REGEX_SOLO_DIGITOS } from '@ng-mf/data-access-user';
import { CatalogosSelect } from '@libs/shared/data-access-user/src/core/models/shared/components.model';
import { CommonModule } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { TituloComponent } from '@ng-mf/data-access-user';
import { Tramite110214Query } from '../../../../estados/queries/tramite110214.query';
import { Tramite110214State } from '../../../../estados/tramites/tramite110214.store';
import { Tramite110214Store } from '../../../../estados/tramites/tramite110214.store';
import { ValidacionesFormularioService } from '@libs/shared/data-access-user/src';
import { Validators } from '@angular/forms';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';

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
  public solicitudState!: Tramite110214State;

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
   * @param {Tramite110214Store} store - Store para gestionar el estado del trámite.
   * @param {Tramite110214Query} query - Query para obtener el estado del trámite.
   * @param {ValidacionesFormularioService} validacionesService - Servicio para validar formularios.
   */
  constructor(
    public fb: FormBuilder,
    private store: Tramite110214Store,
    private query: Tramite110214Query,
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
        nombre: [this.solicitudState?.grupoReceptor?.nombre, [Validators.maxLength(20)]],
        apellidoPrimer: [this.solicitudState?.grupoReceptor?.apellidoPrimer, [Validators.maxLength(20)]],
        apellidoSegundo: [this.solicitudState?.grupoReceptor?.apellidoSegundo, [Validators.maxLength(20)]],
        numeroFiscal: [this.solicitudState?.grupoReceptor?.numeroFiscal, [Validators.required, Validators.maxLength(30)]],
        razonSocial: [this.solicitudState?.grupoReceptor?.razonSocial, []],
      }),
  
      grupoDeDirecciones: this.fb.group({
        ciudad: [this.solicitudState?.grupoDeDirecciones?.ciudad, [Validators.required, Validators.maxLength(50)]],
        calle: [this.solicitudState?.grupoDeDirecciones?.calle, [Validators.required, Validators.maxLength(90)]],
        numeroLetra: [this.solicitudState?.grupoDeDirecciones?.numeroLetra, [Validators.required, Validators.maxLength(30)]],
        telefono: [this.solicitudState?.grupoDeDirecciones?.telefono, [Validators.required, Validators.pattern(/^\d+$/), Validators.maxLength(16)]],
        correoElectronico: [this.solicitudState?.grupoDeDirecciones?.correoElectronico, [Validators.required, Validators.email, Validators.maxLength(50)]],
      }),
  
      grupoRepresentativo: this.fb.group({
        lugar: [this.solicitudState?.grupoRepresentativo?.lugar, [Validators.required, Validators.maxLength(70)]],
        nombreExportador: [this.solicitudState?.grupoRepresentativo?.nombreExportador, [Validators.required, Validators.maxLength(70)]],
        empresa: [this.solicitudState?.grupoRepresentativo?.empresa, [Validators.required, Validators.maxLength(90)]],
        cargo: [this.solicitudState?.grupoRepresentativo?.cargo, [Validators.required, Validators.maxLength(70)]],
        telefono: [this.solicitudState?.grupoRepresentativo?.telefono, [Validators.required, Validators.pattern(REGEX_SOLO_DIGITOS), Validators.maxLength(16)]],
        correoElectronico: [this.solicitudState?.grupoRepresentativo?.correoElectronico, [Validators.required, Validators.email, Validators.maxLength(50)]],
      }),
    });
    queueMicrotask(() => {
      this.registroFormulario.updateValueAndValidity({ emitEvent: false });
      this.store.setFormValidity('destinatario', this.registroFormulario.valid);
    });
    if (this.isContinuarTriggered) {
      Promise.resolve().then(() => {
        this.registroFormulario.markAllAsTouched();
      });
    }
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
   * @param {keyof Tramite110214Store} metodoNombre - El nombre del método en el store para actualizar el estado.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite110214Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.store[metodoNombre] as (value: unknown) => void)(VALOR);
    this.store.setFormValidity('destinatario', this.registroFormulario.valid);
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