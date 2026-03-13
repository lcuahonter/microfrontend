/**
 * manifiesto.component.ts
 * Componente que gestiona el manifiesto para el trámite 630103.
 */
import { CommonModule } from '@angular/common';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { map, takeUntil } from 'rxjs';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Subject} from 'rxjs';

import { InputCheckComponent } from "@libs/shared/data-access-user/src/tramites/components/input-check/input-check.component";

import { TituloComponent } from '@ng-mf/data-access-user';

import { Tramite630103Query } from '../../estados/tramite630103.query';

import { Tramite630103State, Tramite630103Store } from '../../estados/tramite630103.store';
/**
 * Componente que gestiona el manifiesto para el trámite 630103.
 * Permite inicializar formularios, obtener datos del estado y manejar el estado del formulario.
 */
@Component({
  selector: 'app-manifiesto',
  standalone: true,
  imports: [CommonModule, TituloComponent, ReactiveFormsModule, InputCheckComponent],
  templateUrl: './manifiesto.component.html',
  styleUrl: './manifiesto.component.scss',
})
export class ManifiestoComponent implements OnInit, OnDestroy {
  /**
   * Subject utilizado para manejar la destrucción de suscripciones y evitar fugas de memoria.
   * Se emite y completa en ngOnDestroy para cancelar todas las suscripciones activas.
   */
  private destroyed$ = new Subject<void>();

  /**
   * Formulario reactivo para gestionar el manifiesto.
   * Se inicializa dinámicamente según la configuración del formulario.
   */
  manifiestoFormulario!: FormGroup;

  /**
   * Estado seleccionado del trámite 630103.
   * Contiene los datos actuales del trámite seleccionados desde el store.
   */
  estadoSeleccionado!: Tramite630103State;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Si es verdadero, los campos del formulario estarán deshabilitados para edición.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Estado actual de la solicitud.
   */
  public solicitudState!: Tramite630103State;

  /**
   * Constructor del componente.
   * fb - Constructor de formularios reactivos.
   * tramite630103Store - Store para manejar el estado del trámite.
   * tramite630103Query - Query para consultar el estado del trámite.
   * consultaioQuery - Query para observar el estado de solo lectura.
   */
  constructor(
    private fb: FormBuilder,
    private tramite630103Store: Tramite630103Store,
    private tramite630103Query: Tramite630103Query,
    private consultaioQuery: ConsultaioQuery,
  ) {
    this.consultaioQuery.selectConsultaioState$
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
   * Inicializa el estado del formulario dependiendo si es solo lectura o editable.
   * Si es solo lectura, desactiva los campos y carga los datos; si no, los activa.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inizializarFormulario();
    }
  }

  /**
   * Guarda los datos del formulario y ajusta el estado de solo lectura.
   * Deshabilita o habilita los campos según corresponda.
   */
  guardarDatosFormulario(): void {
    this.inizializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.manifiestoFormulario.disable();
    } else {
       this.manifiestoFormulario.enable();
    }
  }

  /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   * Inicializa el formulario y obtiene el estado del trámite.
   */
  ngOnInit(): void {
    this.getValorStore();
    this.inicializarEstadoFormulario();
  }

  /**
   * Inicializa el formulario reactivo con valores predeterminados y validaciones.
   * Puedes agregar los controles dinámicamente según la configuración.
   */
  inizializarFormulario(): void {
    this.manifiestoFormulario = this.fb.group({
      declaracion: [this.estadoSeleccionado?.['declaracion'], Validators.required]
    });
  }

  /**
   * Actualiza un valor específico en el store del trámite.
   * FormGroup - Formulario reactivo.
   * control - Nombre del control cuyo valor se actualizará en el store.
   */
  setValorStore(FormGroup: FormGroup, control: string): void {
    const VALOR = FormGroup.get(control)?.value;
    this.tramite630103Store.setTramite630103State(control, VALOR);
  }

  /**
   * Obtiene el estado actual del trámite desde el store.
   * Actualiza la propiedad estadoSeleccionado con los datos actuales.
   */
  getValorStore(): void {
    this.tramite630103Query.selectTramite630103State$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe(
      (data) => {
        this.estadoSeleccionado = data;
      }
    );
  }
  /*
  * Valida el formulario de datos de importación temporal.
  * @returns {boolean} - `true` si el formulario es válido, `false` en caso contrario.
  */
  validarFormulario(): boolean {
    this.manifiestoFormulario.markAllAsTouched();
    return this.manifiestoFormulario.valid;
  }
  /**
   * Método del ciclo de vida que se ejecuta al destruir el componente.
   * Libera las suscripciones activas para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}