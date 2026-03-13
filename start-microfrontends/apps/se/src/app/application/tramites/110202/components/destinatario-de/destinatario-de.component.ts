/* eslint-disable no-useless-return */
import {
  Catalogo,
  SeccionLibQuery,
  SeccionLibState,
  SeccionLibStore,
} from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subject, map } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, takeUntil } from 'rxjs';
import { CertificadoValidacionService } from '../../services/certificado-validacion.service';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DatosDelDestinatarioComponent } from '../../../../shared/components/datos-del-destinatario/datos-del-destinatario.component';
import { DestinatarioComponent } from '../../../../shared/components/destinatario/destinatario.component';
import { DestinatarioService } from '../../../../shared/services/destinatario.service';
import { DetallesDelTransporteComponent } from "../../../../shared/components/detalles-del-transporte/detalles-del-transporte.component";
import { Tramite110202Query } from '../../estados/tramite110202.query';
import { Tramite110202Store } from '../../estados/tramite110202.store';
import { ViewChild } from '@angular/core';

/**
 * Interfaz que representa los valores de un formulario con claves dinámicas.
 * Los valores pueden ser de tipo string, number, boolean, object o undefined.
 * @interface FormValues
 */
interface FormValues {
  [key: string]: unknown;
}

@Component({
  selector: 'app-destinatario-de',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    DestinatarioComponent,
    DatosDelDestinatarioComponent,
    DetallesDelTransporteComponent
  ],
  templateUrl: './destinatario-de.component.html',
  styleUrl: './destinatario-de.component.scss',
})
export class DestinatarioDeComponent implements OnDestroy, OnInit {

  /** Referencia al componente datos-del-destinatario para marcar campos como tocados */
  @ViewChild(DatosDelDestinatarioComponent) datosDelDestinatarioComponent?: DatosDelDestinatarioComponent;
  /** Referencia al componente destinatario para marcar campos como tocados */
  @ViewChild(DestinatarioComponent) destinatarioComponent?: DestinatarioComponent;
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
  /** Valores actuales del formulario de medio de transporte. */
  formMedioTransporteValues!: FormValues;
    /** Indica si hay un error de país de destino que no coincide. */
  paisCertificadoOrigen!: FormValues;
/** Indica si hay un error de país de destino que no coincide. */
  paisDestinoError: boolean = false;
  /**
   * Constructor del componente.
   * @param fb FormBuilder para crear formularios reactivos.
   * @param store Estado del formulario de destinatario.
   * @param tramiteQuery Consultas relacionadas con el trámite.
   * @param certificadoService Servicio para obtener datos de validación.
   * @param seccionQuery Consultas relacionadas con el estado de la sección.
   * @param seccionStore Almacén para gestionar el estado de la sección.
   * @param consultaQuery Consultas relacionadas con la consulta de datos.
   */
  constructor(
    private fb: FormBuilder,
    public store: Tramite110202Store,
    public tramiteQuery: Tramite110202Query,
    public certificadoService: CertificadoValidacionService,
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
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      ).subscribe();
       this.tramiteQuery.selectSolicitud$
            .pipe(takeUntil(this.destroyNotifier$))
            .subscribe((estado) => {
               this.paisCertificadoOrigen = estado as FormValues;
              this.formMedioTransporteValues = estado.formTransporte as unknown as FormValues;
            });
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
      this.setFormValidaDestinatario(this.destinatarioComponent.formDestinatario.valid);
    }
    if (this.datosDelDestinatarioComponent) {
      this.datosDelDestinatarioComponent.markAllFieldsTouched();
      if (!this.datosDelDestinatarioComponent.formDatosDelDestinatario.valid) {
        valid = false;
      }
      this.setFormValida(this.datosDelDestinatarioComponent.formDatosDelDestinatario.valid);
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
  onSubmit(): void {
    let valid = true;
    if (this.destinatarioForm && this.destinatarioForm.invalid) {
      this.destinatarioForm.markAllAsTouched();
      valid = false;
    }
    // Marcar todos los campos obligatorios de ambos hijos como tocados
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
    if (!valid) {
      // No avanzar si hay errores
      return;
    }
    // Lógica para continuar a la siguiente página si todos los formularios son válidos
  }
  /** Inicializa el formulario reactivo del destinatario */
  iniciarFormulario(): void {
    this.destinatarioForm = this.fb.group({
      medioDeTransporte: [''],
      // Agrega otros controles aquí si es necesario
    });
  }

  /**
   * Configura las suscripciones necesarias para el formulario y el estado.
   */
  inicializarSuscripciones(): void {
    this.tramiteQuery.selectDestinatarioForm$
      .pipe(
        takeUntil(this.destroyNotifier$),
        distinctUntilChanged(),
        filter(values => Boolean(values))
      )
      .subscribe(estado => {
        this.actualizandoFormulario = true;
        if (estado) {
          this.destinatarioForm.patchValue(estado, { emitEvent: false });
        }
        this.actualizandoFormulario = false;
      });

    this.destinatarioForm.valueChanges
      .pipe(
        takeUntil(this.destroyNotifier$),
        debounceTime(300),
        filter(() => !this.actualizandoFormulario)
      )
      .subscribe(value => {
        this.store.setDestinatarioForm(value);
      });

    this.tramiteQuery.selectFormDestinatario$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(estado => {
        this.formDestinatarioValues = estado ?? {};
      });

    this.tramiteQuery.selectFormDatosDelDestinatario$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(estado => {
        this.formDatosDelDestinatarioValues = estado ?? {};
      });

    this.seccionQuery.selectSeccionState$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(seccionState => {
        this.seccion = seccionState;
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
  setValoresStore(event: { formGroupName: string, campo: string, valor: undefined, storeStateName: string }): void {
    const { campo: CAMPO, valor: VALOR } = event;
    this.store.setFormDatosDelDestinatario({ [CAMPO]: VALOR });
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
  setValoresStoreDe(event: { formGroupName: string, campo: string, valor: undefined, storeStateName: string }): void {
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
  /** Compara el país de destino seleccionado con el país de origen del certificado */
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
  * Método llamado al destruir el componente. Limpia las suscripciones activas.
  */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}