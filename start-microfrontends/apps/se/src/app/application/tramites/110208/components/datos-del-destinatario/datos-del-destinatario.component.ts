import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ValidacionesFormularioService } from '@ng-mf/data-access-user';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Solicitud110208State, Tramite110208Store } from '../../../../estados/tramites/tramite110208.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { Tramite110208Query } from '../../../../estados/queries/tramite110208.query';

/**
 * Componente que gestiona los datos del destinatario en el trámite 110208.
 */
@Component({
  selector: 'app-datos-del-destinatario',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent
  ],
  templateUrl: './datos-del-destinatario.component.html',
  styleUrl: './datos-del-destinatario.component.css',
})
export class DatosDelDestinatarioComponent implements OnInit, OnDestroy {
  /**
   * Estado de la solicitud obtenido desde el store.
   * @type {Solicitud110208State}
   */
  public solicitudState!: Solicitud110208State;
  /**
   * Determina si el formulario debe estar en modo solo lectura.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Notificador para destruir observables activos y evitar pérdidas de memoria.
   * @private
   * @type {Subject<void>}
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Formulario reactivo para gestionar los datos del destinatario.
   * @type {FormGroup}
   */
  datosDestinatario!: FormGroup;

  /**
   * Constructor del componente.
   * @param {FormBuilder} fb - Constructor de formularios reactivos.
   * @param {Tramite110208Store} tramite110208Store - Store del trámite 110208.
   * @param {Tramite110208Query} tramite110208Query - Query para obtener datos del trámite 110208.
   */
  constructor(
    private fb: FormBuilder,
    private tramite110208Store: Tramite110208Store,
    private tramite110208Query: Tramite110208Query,
    private consultaioQuery: ConsultaioQuery,
    private validacionesService: ValidacionesFormularioService
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /**
   * Método de ciclo de vida que se ejecuta al inicializar el componente.
   * Configura el formulario y sus valores iniciales.
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
    this.desactivarRazonSocial();
    this.desactivarNombre();
  }

  /**
   * Inicializa el formulario con datos del store y aplica validaciones.
   * También aplica configuración de solo lectura si es necesario.
   * @method inicializarEstadoFormulario
   */
  inicializarEstadoFormulario(): void {
    this.tramite110208Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();

    this.datosDestinatario = this.fb.group({
      nombres: [this.solicitudState?.nombres],
      primerApellido: [this.solicitudState?.primerApellido],
      segundoApellido: [this.solicitudState?.segundoApellido],
      numeroFiscal: [this.solicitudState?.numeroFiscal, Validators.required],
      razonSocial: [{ value: this.solicitudState?.razonSocial, disabled: true }]
    });

    if (this.esFormularioSoloLectura) {
      Object.keys(this.datosDestinatario.controls).forEach((key) => {
        this.datosDestinatario.get(key)?.disable();
      });
    } else {
      Object.keys(this.datosDestinatario.controls).forEach((key) => {
        this.datosDestinatario.get(key)?.enable();
      });
    }
  }

  /**
   * Establece valores en el store a partir de un formulario.
   * @param {FormGroup} form - Formulario reactivo.
   * @param {string} campo - Nombre del campo en el formulario.
   * @param {keyof Tramite110208Store} metodoNombre - Método del store para actualizar el valor.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite110208Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite110208Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Desactiva el campo 'razonSocial' si el campo 'nombres' tiene valor,
   * de lo contrario lo activa.
  */
  desactivarRazonSocial(): void {
    if (this.datosDestinatario.get('nombres')?.value) {
      this.datosDestinatario.get('razonSocial')?.disable();
    } else {
      this.datosDestinatario.get('razonSocial')?.enable();
    }
  }
  /**
   * Desactiva los campos de nombre completo (nombres, apellidos) 
   * si el campo 'razonSocial' tiene valor, de lo contrario los activa.
  */
  desactivarNombre(): void {
    if (this.datosDestinatario.get('razonSocial')?.value) {
      this.datosDestinatario.get('nombres')?.disable();
      this.datosDestinatario.get('primerApellido')?.disable();
      this.datosDestinatario.get('segundoApellido')?.disable();
    } else {
      this.datosDestinatario.get('nombres')?.enable();
      this.datosDestinatario.get('primerApellido')?.enable();
      this.datosDestinatario.get('segundoApellido')?.enable();
    }
  }

  /**
  * compo doc
  * @method esValido
  * @description 
  * Verifica si un campo específico del formulario es válido.
  * @param campo El nombre del campo que se desea validar.
  * @returns {boolean | null} Un valor booleano que indica si el campo es válido.
  */
  public esValido(campo: string): boolean | null {
    return this.validacionesService.isValid(this.datosDestinatario, campo);
  }

  /**
   * Método de ciclo de vida que se ejecuta al destruir el componente.
   * Libera recursos y evita pérdidas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}