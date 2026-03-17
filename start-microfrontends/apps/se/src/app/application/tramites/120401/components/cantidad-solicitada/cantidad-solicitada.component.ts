/**
 * Componente que representa un formulario para solicitar una cantidad específica.
 * Gestiona la validación y el envío del formulario.
 */
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { Subject, map, takeUntil } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ConsultaioQuery, TituloComponent } from '@ng-mf/data-access-user';
import { Observable } from 'rxjs';
import { Validators } from '@angular/forms';

import { Tramite120401Query } from '../../estados/queries/tramite120401.query';

import { Tramite120401Store } from '../../estados/tramites/tramite120401.store';

/**
 * Componente que representa un formulario para solicitar una cantidad específica.
 * Gestiona la validación y el envío del formulario.
 */
@Component({
  selector: 'app-cantidad-solicitada',
  standalone: true,
  imports: [CommonModule, TituloComponent, ReactiveFormsModule],
  templateUrl: './cantidad-solicitada.component.html',
  styleUrl: './cantidad-solicitada.component.scss',
})
export class CantidadSolicitadaComponent implements OnInit, OnDestroy {
  /**
   * Formulario reactivo para la solicitud de cantidad.
   */
  form!: FormGroup;

  /**
   * Subject utilizado para manejar la destrucción del componente y evitar fugas de memoria.
   */
  private destroyed$ = new Subject<void>();

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;
  /**
   * Observable que emite la cantidad solicitada asociada al trámite 120401.
   * Puede emitir un valor de tipo `string` o `null` si no hay una cantidad disponible.
   *
   * @observable
   */
  cantidadSolicitada$: Observable<string | null> =
    this.tramite120401Query.cantidadSolicitada$;

  /**
   * Constructor del componente.
   * @param fb FormBuilder para la creación y gestión del formulario reactivo.
   */
  constructor(
    private fb: FormBuilder,
    private tramite120401Store: Tramite120401Store,
    private tramite120401Query: Tramite120401Query,
    private consultaQuery: ConsultaioQuery
  ) {
   
  }

  /**
   * Método de ciclo de vida de Angular que se ejecuta al inicializar el componente.
   */
  ngOnInit(): void {
    this.crearFormulario();

    this.cantidadSolicitada$.subscribe((cantidadSolicitada) => {
      if (cantidadSolicitada) {
        this.form.get('cantidadSolicitada')?.setValue(cantidadSolicitada);
      }
    });

    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   */
  inicializarEstadoFormulario(): void {
    if (!this.form) {
      this.crearFormulario();
    }
    if (this.esFormularioSoloLectura) {
      this.form.disable();
    }
  }

  /**
   * Método de ciclo de vida de Angular que se ejecuta al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Crea e inicializa el formulario con validaciones.
   */
  crearFormulario(): void {
    this.form = this.fb.group({
      cantidadSolicitada: ['', [Validators.required]],
    });
  }

  /**
   * Valida el formulario y marca todos los campos como tocados si es inválido.
   * @returns Verdadero si el formulario es válido, falso en caso contrario.
   */
   public validarFormulario(): boolean {
      let isValid = true;
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        isValid = false;
      }
      return isValid;
    }

  /**
   * Verifica si un control del formulario es inválido.
   * @param nombreControl Nombre del control a verificar.
   * @returns Verdadero si el control es inválido, falso en caso contrario.
   */
  esInvalido(nombreControl: string): boolean {
    const CONTROL = this.form.get(nombreControl);
    return CONTROL
      ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty)
      : false;
  }

  /**
   * Valida y envía el formulario, mostrando mensajes en consola según el resultado.
   */
  validarYEnviarFormulario(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
    }
  }

  /**
   * Obtiene el valor seleccionado del campo de cantidad solicitada y lo establece en el store.
   */
  getCantidadSolicitada(): void {
    const CANTIDAD_SOLICITADA = this.form.get('cantidadSolicitada')?.value;
    this.tramite120401Store.setCantidadSolicitada(CANTIDAD_SOLICITADA);
  }
}
