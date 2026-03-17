import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';

import { Solicitud280101State, Tramite280101Store } from '../../../../estados/tramite/tramite280101.store';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { Tramite280101Query } from '../../../../estados/queries//tramite280101.query';


/**
 * Componente `DestinoComponent` que gestiona el formulario reactivo para los datos del destino
 * en el trámite 280101. Este componente es independiente y utiliza módulos comunes de Angular,
 * formularios reactivos y un componente reutilizable para títulos.
 */
@Component({
  selector: 'app-destino',
  templateUrl: './destino.component.html',
  styleUrl: './destino.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent
  ]
})

export class DestinoComponent implements OnInit, OnDestroy {
  /**
   * Formulario reactivo para gestionar los datos del destino.
   */
  destinoForm!: FormGroup;

  /**
   * Estado de la solicitud 280101.
   */
  private solicitudState!: Solicitud280101State;

  /**
   * Subject para manejar la destrucción del componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();


  /**
   * Indica si el componente debe estar en modo solo lectura.
   * Cuando es `true`, los campos del componente no serán editables.
   * @default false
   */
  @Input() soloLectura: boolean = false;

  /**
   * Constructor del componente.
   * @param fb FormBuilder para crear formularios reactivos.
   * @param store Store para gestionar el estado de la solicitud.
   * @param query Query para obtener el estado de la solicitud.
   */
  constructor(
    private fb: FormBuilder,
    private store: Tramite280101Store,
    private query: Tramite280101Query
  ) {}

  /**
   * Método que se ejecuta al inicializar el componente.
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

    this.establecerValoresFormulario();
  }

  /**
   * Establece los valores iniciales del formulario `DestinoForm` utilizando el estado de la solicitud.
   */
  establecerValoresFormulario(): void {
    this.destinoForm = this.fb.group({
      pais: [this.solicitudState?.pais, [Validators.required]],
      codigoPostal: [this.solicitudState?.codigoPostal, [Validators.required]],
      estado: [this.solicitudState?.estado, [Validators.required]],
      municipioOAlcadia: [this.solicitudState?.municipioOAlcadia, [Validators.required]],
      localidad: [this.solicitudState?.localidad, [Validators.required]],
      colonia: [this.solicitudState?.colonia, [Validators.required]],
      numeroExterior: [this.solicitudState?.numeroExterior, [Validators.required]],
      numeroInterior: [this.solicitudState?.numeroInterior, [Validators.required]],
      calle: [this.solicitudState?.calle, [Validators.required]],
    });

    if (this.soloLectura) {
      this.destinoForm.disable(); // Deshabilita el formulario si está en modo solo lectura.
    }
  }

  /**
   * Actualiza el estado del store con los valores del formulario.
   * @param form Formulario reactivo que contiene los valores.
   * @param campo Nombre del campo del formulario.
   * @param metodoNombre Método del store que se utilizará para guardar el valor.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite280101Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * Limpia las suscripciones para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}