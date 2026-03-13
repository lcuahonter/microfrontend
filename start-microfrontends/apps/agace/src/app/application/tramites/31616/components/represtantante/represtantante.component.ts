import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Solicitud31616TercerosState, Tramite31616TercerosStore } from '../../../../estados/tramites/tramite31616_terceros.store';
import { map, takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { TituloComponent } from '@ng-mf/data-access-user';
import { Tramite31616TercerosQuery } from '../../../../estados/queries/tramite31616_terceros.query';
import representanteDatos from '@libs/shared/theme/assets/json/31601/represtantante-data.json';

/**
 * Componente que muestra y gestiona el formulario de datos del representante legal
 * dentro del trámite 31616.
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
   * @type {Solicitud31616TercerosState}
   * @memberof ReprestantanteComponent
   */
  public solicitudState!: Solicitud31616TercerosState;

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
   * @param {Tramite31616TercerosStore} tramite31616Store - Store encargado de manejar el estado de los datos del trámite.
   * @param {Tramite31616TercerosQuery} tramite31616Query - Query que permite consultar el estado del trámite.
   * @memberof ReprestantanteComponent
   */
  constructor(
    private fb: FormBuilder,
    private tramite31616Store: Tramite31616TercerosStore,
    private tramite31616Query: Tramite31616TercerosQuery
  ) {
    //Añade lógica aquí
  }

  /**
   * Método que se ejecuta al iniciar el componente.
   * Configura el formulario con validaciones, carga el estado actual del trámite y
   * establece los datos precargados del representante.
   *
   * @memberof ReprestantanteComponent
   */
  ngOnInit(): void {
    this.tramite31616Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();

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
   * Establece el valor de un campo específico en el store del trámite.
   *
   * @param {FormGroup} form - Formulario del que se extrae el valor.
   * @param {string} campo - Nombre del campo en el formulario.
   * @param {keyof Tramite31616TercerosStore} metodoNombre - Nombre del método en el store que se ejecutará.
   * @memberof ReprestantanteComponent
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite31616TercerosStore
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite31616Store[metodoNombre] as (value: string) => void)(VALOR);
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
