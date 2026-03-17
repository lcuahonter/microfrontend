import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Solicitud32614TercerosState, Tramite32614TercerosStore } from '../../estados/tramites/tramite32614_terceros.store';
import { map, takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Subject } from 'rxjs';
import { TituloComponent } from '@ng-mf/data-access-user';
import { Tramite32614TercerosQuery } from '../../estados/queries/terceros.query';
import representanteDatos from '@libs/shared/theme/assets/json/31601/represtantante-data.json';

/**
 * Componente que muestra y gestiona el formulario de datos del representante legal
 * dentro del trámite 32614.
 *
 * @export
 * @class ReprestantanteComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-represtantante',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './represtantante.component.html',
  styleUrl: './represtantante.component.scss',
})
export class ReprestantanteComponent implements OnInit, OnDestroy {

  /**
   * Formulario reactivo que contiene los campos del representante.
   *
   * @type {FormGroup}
   * @memberof ReprestantanteComponent
   */
  represtantante!: FormGroup;

  /**
   * Datos estáticos o predefinidos del representante, cargados desde un archivo JSON.
   *
   * @type {*}
   * @memberof ReprestantanteComponent
   */
  datosRepresentativos = representanteDatos;

  /**
   * Estado actual de la solicitud del trámite.
   *
   * @type {Solicitud32614TercerosState}
   * @memberof ReprestantanteComponent
   */
  public solicitudState!: Solicitud32614TercerosState;

  /**
   * Determina si el formulario debe estar en modo solo lectura.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Subject utilizado para cancelar suscripciones y evitar fugas de memoria.
   *
   * @private
   * @type {Subject<void>}
   * @memberof ReprestantanteComponent
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor del componente.
   *
   * @param {FormBuilder} fb - Utilizado para construir formularios reactivos.
   * @param {Tramite32614TercerosStore} tramite32614Store - Store encargado de manejar el estado de los datos del trámite.
   * @param {Tramite32614TercerosQuery} tramite32614Query - Query que permite consultar el estado del trámite.
   * @memberof ReprestantanteComponent
   */
  constructor(
    private fb: FormBuilder,
    private tramite32614Store: Tramite32614TercerosStore,
    private tramite32614Query: Tramite32614TercerosQuery,
    private consultaioQuery: ConsultaioQuery,
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
     * Inicializa el formulario con datos del store y aplica validaciones.
     * También aplica configuración de solo lectura si es necesario.
     * @method inicializarEstadoFormulario
     */
  inicializarEstadoFormulario(): void {
    this.tramite32614Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
    this.getFormalario();
    if (this.esFormularioSoloLectura) {
      Object.keys(this.represtantante.controls)
        .map((key) => this.represtantante.get(key))
        .map((control) => {
          control?.disable();
          return control;
        });
    } else {
      Object.keys(this.represtantante.controls)
        .map((key) => this.represtantante.get(key))
        .map((control) => {
          control?.enable();
          return control;
        });
    }
  }

  /**
   * Método que se ejecuta al iniciar el componente.
   * Configura el formulario con validaciones, carga el estado actual del trámite y
   * establece los datos precargados del representante.
   *
   * @memberof ReprestantanteComponent
   */
  ngOnInit(): void {
    this.tramite32614Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
    this.represtantante.get('rfc')?.disable();
    this.represtantante.get('nombre')?.disable();
    this.represtantante.get('apellidoPaterno')?.disable();
    this.represtantante.get('apellidoMaterno')?.disable();

    this.represtantante.patchValue({
      rfc: this.datosRepresentativos?.rfc,
      nombre: this.datosRepresentativos?.nombre,
      apellidoPaterno: this.datosRepresentativos?.apellidoPaterno,
      apellidoMaterno: this.datosRepresentativos?.apellidoMaterno,
    });
  }

  /**
   * Initializes the `represtantante` form group with controls for representative information.
   * 
   * The form fields include:
   * - `resigtro`: Pre-filled from `solicitudState.resigtro` if available and not empty, otherwise from `datosRepresentativos.resigtro`. Required.
   * - `rfc`: Empty by default. Required.
   * - `nombre`: Empty by default. Required.
   * - `apellidoPaterno`: Empty by default. Required.
   * - `apellidoMaterno`: Empty by default. Required.
   * - `telefono`: Pre-filled from `solicitudState.telefono` if available and not empty, otherwise from `datosRepresentativos.telefono`. Required.
   * - `correo`: Pre-filled from `solicitudState.correo` if available and not empty, otherwise from `datosRepresentativos.correo`. Required.
   *
   * All fields are marked as required using Angular's `Validators.required`.
   */
  getFormalario(): void {
    this.represtantante = this.fb.group({
      resigtro: [
        this.solicitudState?.resigtro && this.solicitudState?.resigtro !== ''
          ? this.solicitudState?.resigtro
          : this.datosRepresentativos?.resigtro,
        Validators.required
      ],
      rfc: ['', Validators.required],
      nombre: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],
      telefono: [
        this.solicitudState?.telefono && this.solicitudState?.telefono !== ''
          ? this.solicitudState?.telefono
          : this.datosRepresentativos?.telefono,
        Validators.required
      ],
      correo: [
        this.solicitudState?.correo && this.solicitudState?.correo !== ''
          ? this.solicitudState?.correo
          : this.datosRepresentativos?.correo,
        Validators.required
      ],
    });
  }


  /**
   * Establece el valor de un campo específico en el store del trámite.
   *
   * @param {FormGroup} form - Formulario del que se extrae el valor.
   * @param {string} campo - Nombre del campo en el formulario.
   * @param {keyof Tramite32614TercerosStore} metodoNombre - Nombre del método en el store que se ejecutará.
   * @memberof ReprestantanteComponent
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite32614TercerosStore
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite32614Store[metodoNombre] as (value: string) => void)(VALOR);
  }

  /**
   * Método ejecutado cuando el componente se destruye.
   * Cancela las suscripciones activas liberando recursos.
   *
   * @memberof ReprestantanteComponent
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
