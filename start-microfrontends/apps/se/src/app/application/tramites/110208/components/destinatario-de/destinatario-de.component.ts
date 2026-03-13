import {
  Catalogo,
  SeccionLibQuery,
  SeccionLibState,
  SeccionLibStore,
} from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Observable, Subject, map } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DatosDelDestinatarioComponent } from '../../../../shared/components/datos-del-destinatario/datos-del-destinatario.component';
import { DestinatarioComponent } from '../../../../shared/components/destinatario/destinatario.component';
import { DestinatarioService } from '../../../../shared/services/destinatario.service';
import { DetallesDelTransporteComponent } from '../../../../shared/components/detalles-del-transporte/detalles-del-transporte.component';
import { Tramite110208Query } from '../../../../estados/queries/tramite110208.query';
import { Tramite110208Store } from '../../../../estados/tramites/tramite110208.store';
import { ViewChild } from '@angular/core';

/**
 * Interfaz que representa los valores de un formulario con claves dinámicas.
 * Los valores pueden ser de tipo string, number, boolean, object o undefined.
 * @interface FormValues
 */
interface FormValues {
  [key: string]: string | number | boolean | object | undefined;
}

@Component({
  selector: 'app-destinatario-de',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    DestinatarioComponent,
    DatosDelDestinatarioComponent,
    DetallesDelTransporteComponent,
  ],
  templateUrl: './destinatario-de.component.html',
  styleUrl: './destinatario-de.component.scss',
})
export class DestinatarioDeComponent implements OnDestroy, OnInit {
  /** Inicializa el formulario reactivo del destinatario */
  iniciarFormulario(): void {
    this.destinatarioForm = this.fb.group({
      medioDeTransporte: [''],
      // Agrega otros controles aquí si es necesario
    });
  }

  /** Referencia al componente datos-del-destinatario para marcar campos como tocados */
  @ViewChild(DatosDelDestinatarioComponent)
  datosDelDestinatarioComponent?: DatosDelDestinatarioComponent;
  /** Referencia al componente destinatario para marcar campos como tocados */
  @ViewChild(DestinatarioComponent)
  destinatarioComponent?: DestinatarioComponent;
  /**
   * Maneja el envío del formulario y muestra errores si hay campos obligatorios vacíos.
   */
  /** Bandera de validez para datos-del-destinatario */
  datosDelDestinatarioValido: boolean = false;
  /** Bandera de validez para destinatario */
  destinatarioValido: boolean = false;

  /** Indica si el país de destino está habilitado. */
  paisDestino = true;

  /** Valores actuales del formulario de destinatario. */
  formDestinatarioValues!: FormValues;

  /** Valores actuales del formulario de datos del destinatario. */
  formDatosDelDestinatarioValues!: FormValues;

  /** Formulario reactivo para gestionar los datos del destinatario. */
  destinatarioForm!: FormGroup;

  /** Notificador para destruir las suscripciones activas. */
  destroyNotifier$ = new Subject<void>();

  /** Observable que contiene los países de destino disponibles. */
  paisDestin$!: Observable<Catalogo[]>;

  /** Observable que contiene los medios de transporte disponibles. */
  medioDeTransporte$!: Observable<Catalogo[]>;

  /** Estado actual de la sección. */
  private seccion!: SeccionLibState;

  /** Indica si el formulario se está actualizando programáticamente. */
  private actualizandoFormulario = false;
  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;
  /** Indica si hay un error de país de destino que no coincide. */
  paisCertificadoOrigen!: FormValues;
  /** Indica si hay un error de país de destino que no coincide. */
  paisDestinoError: boolean = false;
  /** Valores actuales del formulario de transporte. */
  formTransporteValues!: FormValues;
  /**
   * Constructor del componente.
   * @param fb FormBuilder para crear formularios reactivos.
   * @param store Estado del formulario de destinatario.
   * @param tramiteQuery Consultas relacionadas con el trámite.
   * @param seccionQuery Consultas relacionadas con el estado de la sección.
   * @param seccionStore Almacén para gestionar el estado de la sección.
   * @param consultaQuery Consultas relacionadas con la consulta de datos.
   */
  constructor(
    private fb: FormBuilder,
    public store: Tramite110208Store,
    public tramiteQuery: Tramite110208Query,
    private seccionQuery: SeccionLibQuery,
    private seccionStore: SeccionLibStore,
    public consultaQuery: ConsultaioQuery,
    public destinatarioService: DestinatarioService
  ) {
    this.iniciarFormulario();
    this.inicializarSuscripciones();
  }

  /**
   * Método de inicialización del componente.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$.pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState) => {
        this.esFormularioSoloLectura = seccionState.readonly;
      })
    );
  }

  /** Método público para validar todos los formularios y emitir validez al store */
  public validateAll(): boolean {
    let valid = true;
    if (this.destinatarioForm && this.destinatarioForm.invalid) {
      this.destinatarioForm.markAllAsTouched();
      valid = false;
    }
    if (this.destinatarioComponent) {
      this.destinatarioComponent.markAllFieldsTouched();
      if (!this.destinatarioComponent.formDestinatario.valid) {
        valid = false;
      }
      this.setFormValidaDestinatario(
        this.destinatarioComponent.formDestinatario.valid
      );
    }
    if (this.datosDelDestinatarioComponent) {
      this.datosDelDestinatarioComponent.markAllFieldsTouched();
      if (!this.datosDelDestinatarioComponent.formDatosDelDestinatario.valid) {
        valid = false;
      }
      this.setFormValida(
        this.datosDelDestinatarioComponent.formDatosDelDestinatario.valid
      );
    }
    return valid;
  }

  /**
   * Recibe validez del formulario de datos-del-destinatario
   */
  setFormValida(valido: boolean): void {
    this.datosDelDestinatarioValido = valido;
  }

  /**
   * Recibe validez del formulario de destinatario
   */
  setFormValidaDestinatario(valido: boolean): void {
    this.destinatarioValido = valido;
  }

  /**
   * Maneja el envío del formulario y muestra errores si hay campos obligatorios vacíos en ambos formularios.
   */
  onSubmit(): boolean {
    let valid = true;
    if (this.destinatarioForm && this.destinatarioForm.invalid) {
      this.destinatarioForm.markAllAsTouched();
      valid = false;
    }
    if (this.destinatarioComponent) {
      this.destinatarioComponent.markAllFieldsTouched();
      if (!this.destinatarioComponent.formDestinatario.valid) {
        valid = false;
      }
    }
    if (this.datosDelDestinatarioComponent) {
      this.datosDelDestinatarioComponent.markAllFieldsTouched();
      if (!this.datosDelDestinatarioComponent.formDatosDelDestinatario.valid) {
        valid = false;
      }
    }
    return valid;
  }

  /**
   * Configura las suscripciones necesarias para el formulario y el estado.
   */
  inicializarSuscripciones(): void {
    this.tramiteQuery.selectDestinatarioForm$
      .pipe(
        takeUntil(this.destroyNotifier$),
        distinctUntilChanged(),
        filter((values) => Boolean(values))
      )
      .subscribe((estado) => {
        this.actualizandoFormulario = true;
        this.destinatarioForm.patchValue(estado, { emitEvent: false });
        this.actualizandoFormulario = false;
      });

    this.destinatarioForm.valueChanges
      .pipe(
        takeUntil(this.destroyNotifier$),
        debounceTime(300),
        filter(() => !this.actualizandoFormulario)
      )
      .subscribe((value) => {
        this.store.setDestinatarioForm(value);
      });

    this.tramiteQuery.selectFormDestinatario$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((estado) => {
        this.formDestinatarioValues = estado as FormValues;
      });

    this.tramiteQuery.selectFormDatosDelDestinatario$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((estado) => {
        this.formDatosDelDestinatarioValues = estado as FormValues;
      });

    this.seccionQuery.selectSeccionState$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((seccionState) => {
        this.seccion = seccionState;
      });
    this.tramiteQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        distinctUntilChanged(),
        filter((values) => Boolean(values))
      )
      .subscribe((estado) => {
        this.formTransporteValues = (estado?.formTransporte as FormValues) ?? {}
        this.paisCertificadoOrigen = estado as unknown as FormValues;
      });


    this.paisDestin$ = this.tramiteQuery.selectPaisDestino$ as Observable<Catalogo[]>;
    this.medioDeTransporte$ = this.tramiteQuery.selectMedioDeTransporte$ as Observable<Catalogo[]>;
  }

  /**
   * Establece valores en el estado de la tienda para un formulario genérico de certificado.
   *
   * @param event - Objeto que contiene los datos necesarios para actualizar el estado.
   * @param event.formGroupName - Nombre del grupo de formulario (no utilizado en esta implementación).
   * @param event.campo - Nombre del campo que se actualizará en el estado.
   * @param event.valor - Valor que se asignará al campo especificado.
   * @param event.storeStateName - Nombre del estado de la tienda (no utilizado en esta implementación).
   *
   * @returns void
   *
   * @command Este método actualiza el estado de la tienda con los valores proporcionados.
   */
  setValoresStore(event: {
    formGroupName: string;
    campo: string;
    valor: undefined;
    storeStateName: string;
  }): void {
    const { campo: CAMPO, valor: VALOR } = event;
    this.store.setFormDatosDelDestinatario({ [CAMPO]: VALOR });
  }
  
  /**
   * Establece valores en el estado de la tienda para los detalles del transporte.
   * @param event - Objeto que contiene los datos necesarios para actualizar el estado.
   * @param event.formGroupName - Nombre del grupo de formulario (no utilizado en esta implementación).
   * @param event.campo - Nombre del campo que se actualizará en el estado.
   * @param event.valor - Valor que se asignará al campo especificado.
   * @param event.storeStateName - Nombre del estado de la tienda (no utilizado en esta implementación).
   * @returns void
   * @command Este método actualiza el estado de la tienda con los valores proporcionados.
   */
    setValoresStoreTransporte(event: {
    formGroupName: string;
    campo: string;
    valor: undefined;
    storeStateName: string;
  }): void {
    const { campo: CAMPO, valor: VALOR } = event;
    this.store.setformTransporte({ [CAMPO]: VALOR });
  }
  /**
   * Establece valores en el estado de la tienda para un formulario genérico de certificado.
   *
   * @param event - Objeto que contiene los datos necesarios para actualizar el estado.
   * @param event.formGroupName - Nombre del grupo de formulario (no utilizado en esta implementación).
   * @param event.campo - Nombre del campo que se actualizará en el estado.
   * @param event.valor - Valor que se asignará al campo especificado.
   * @param event.storeStateName - Nombre del estado de la tienda (no utilizado en esta implementación).
   *
   * @returns void
   *
   * @command Este método actualiza el estado de la tienda con los valores proporcionados.
   */
  setValoresStoreDe(event: {
    formGroupName: string;
    campo: string;
    valor: undefined;
    storeStateName: string;
  }): void {
    const { campo: CAMPO, valor: VALOR } = event;
    this.store.setFormDestinatario({ [CAMPO]: VALOR });
    if (CAMPO === 'paisDestin') {
      this.compararPaisDestino(String(VALOR ?? ''));
    }
  }

  /**
   * Obtiene el control del formulario.
   * @returns Control del formulario.
   */
  get formularioControl(): FormControl {
    return this.destinatarioForm.get('') as FormControl;
  }

  /**
   * Actualiza los valores del formulario de destinatario en el estado.
   * @param e Valores del formulario.
   */
  formDestinatarioFunc(e: unknown): void {
    this.store.setFormDestinatario(e as FormValues);
  }

  /**
   * Actualiza los valores del formulario de datos del destinatario en el estado.
   * @param e Valores del formulario.
   */
  detosDelDestinatarioFunc(e: unknown): void {
    this.store.setFormDatosDelDestinatario(e as FormValues);
  }

  /**
   * Selecciona un medio de transporte y lo actualiza en el estado.
   * @param estado Medio de transporte seleccionado.
   */
  medioDeTransporteSeleccion(estado: Catalogo): void {
    this.store.setMedioDeTransporteSeleccion(estado);
  }

  /**
   * Selecciona un país de destino y lo actualiza en el estado.
   * @param estado País de destino seleccionado.
   */
  paisDestinSeleccion(estado: Catalogo): void {
    this.store.setPaisDestinSeleccion(estado);
  }


  /**
 * @method compararPaisDestino - Compara el país destino con el país/bloque del certificado de origen
 * Si no coinciden, activa el error
 * @param valorNacion - Valor del país seleccionado
 */
  compararPaisDestino(valorNacion: string): void {
    const FORM_CERIFICADO = this.paisCertificadoOrigen?.['formCertificado'];
    let bloque: string | undefined;
    if (
      FORM_CERIFICADO &&
      typeof FORM_CERIFICADO === 'object' &&
      'bloque' in FORM_CERIFICADO
    ) {
      bloque = (FORM_CERIFICADO as { bloque?: string })?.bloque;
    }
    if (!bloque) {
      this.paisDestinoError = false;
      return;
    }
    const ORIGEN = String(bloque).trim().toLowerCase();
    const DESTINO = String(valorNacion).trim().toLowerCase();

    this.paisDestinoError = ORIGEN !== DESTINO;
  }
  /**
   * Método llamado al destruir el componente. Limpia las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
