import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Solicitud220501Query } from '../../estados/tramites220501.query';
import { Solicitud220501State } from '../../estados/tramites220501.store';

/**
 * Componente para la frecuencia de inspección.
 */
@Component({
  selector: 'app-frecuencia-inspeccion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './frecuencia-inspeccion.component.html',
  styleUrl: './frecuencia-inspeccion.component.scss',
})
export class FrecuenciaInspeccionComponent implements OnDestroy {
  /**
   * Formulario para la frecuencia de inspección.
   */
  frecuenciaInspeccionForm!: FormGroup;

  /** 
   * Estado de la solicitud 220501. 
   * Se inicializa como un objeto vacío con la estructura de Solicitud220501State.
   */
  solicitud220501State: Solicitud220501State = {} as Solicitud220501State;

  /**
   * Subject para desuscribirse de los observables.
   * @type {Subject<void>}
   */
  private destroyed$ = new Subject<void>();

  /**
   * Constructor del componente.
   * @param fb FormBuilder para crear formularios reactivos.
   * @param solicitud220501Query Consulta del estado de la solicitud 220501.
   */
  constructor(
    private fb: FormBuilder,
    private solicitud220501Query: Solicitud220501Query
  ) {
    this.solicitud220501Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((data: Solicitud220501State) => {
          this.solicitud220501State = data;
        })
      )
      .subscribe();

    this.crearFormulario();
  }

  /**
   * Crea el formulario de frecuencia de inspección.
   */
  crearFormulario(): void {
    this.frecuenciaInspeccionForm = this.fb.group({
      certificadoNumero: [{ value: this.solicitud220501State?.certificadoNumero, disabled: true }],
      calculoResultado: [{ value: this.solicitud220501State?.calculoResultado, disabled: true }]
    });
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Desuscribe el componente de todos los observables.
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
