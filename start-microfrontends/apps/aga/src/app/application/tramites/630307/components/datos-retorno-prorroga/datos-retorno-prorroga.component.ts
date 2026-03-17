/**
 * datos-retorno-prorroga.component.ts
 * Componente que gestiona los datos de retorno de prórroga para el trámite 630307.
 * Permite inicializar formularios, obtener datos de catálogos y manejar el estado del formulario.
 */

import { CommonModule } from '@angular/common';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, Subscription, map, takeUntil } from 'rxjs';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { FORMULARIO_DATOS_PRORROGA } from '../../enum/retorno-importacion-temporal.enum';
import { ModeloDeFormaDinamica } from '@libs/shared/data-access-user/src';
import { Tramite630307Query } from '../../estados/tramite630307.query';

import {
  Tramite630307State,
  Tramite630307Store,
} from '../../estados/tramite630307.store';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';

/**
 * Componente que gestiona los datos de retorno de prórroga para el trámite 630307.
 */
@Component({
  selector: 'app-datos-retorno-prorroga',
  standalone: true,
  imports: [CommonModule, FormasDinamicasComponent],
  templateUrl: './datos-retorno-prorroga.component.html',
  styleUrl: './datos-retorno-prorroga.component.scss',
})
export class DatosRetornoProrrogaComponent implements OnInit, OnDestroy {
  /**
   * Estado seleccionado del trámite 630307.
   */
  estadoSeleccionado!: Tramite630307State;

  /**
   * Formulario dinámico para gestionar los datos de la prórroga.
   */
  formularioDatosProrroga: ModeloDeFormaDinamica[] = FORMULARIO_DATOS_PRORROGA;

  /**
   * Subject utilizado para manejar la destrucción de suscripciones y evitar fugas de memoria.
   */
  private destroyed$ = new Subject<void>();

  /**
   * Formulario reactivo para gestionar los datos de la prórroga.
   */
  datosImportacionRetornoProrrogaGeneralFormulario!: FormGroup;

  /**
   * Suscripción a los cambios en el formulario reactivo.
   */
  private subscription: Subscription = new Subscription();

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Constructor del componente.
   *
   * @param fb - Constructor de formularios reactivos.
   * @param tramite630307Store - Store para manejar el estado del trámite.
   * @param tramite630307Query - Query para consultar el estado del trámite.
   */
  constructor(
    private fb: FormBuilder,
    private tramite630307Store: Tramite630307Store,
    private tramite630307Query: Tramite630307Query,
    private consultaioQuery: ConsultaioQuery
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarFormulario();
        })
      )
      .subscribe();
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
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   * Además, obtiene la información del catálogo de mercancía.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario();
    }
  }

  /**
   * @method
   * @name guardarDatosFormulario
   * @description
   * Inicializa los formularios y obtiene los datos de la tabla.
   * Dependiendo del modo de solo lectura (`esFormularioSoloLectura`),
   * deshabilita o habilita todos los formularios del componente.
   * Si el formulario está en modo solo lectura, todos los formularios se deshabilitan para evitar modificaciones.
   * Si no está en modo solo lectura, todos los formularios se habilitan para permitir la edición.
   *
   * @returns {void}
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.datosImportacionRetornoProrrogaGeneralFormulario.disable();
    } else {
      this.datosImportacionRetornoProrrogaGeneralFormulario.enable();
    }
  }

  /**
   * Inicializa el formulario reactivo con valores predeterminados y validaciones.
   */
  inicializarFormulario(): void {
    this.datosImportacionRetornoProrrogaGeneralFormulario = this.fb.group({
      // Define los controles del formulario aquí
    });
  }

  /**
   * Actualiza un valor específico en el store del trámite.
   *
   * @param $event - Evento que contiene el campo y el valor a actualizar.
   */
  establecerCambioDeValor($event: { campo: string; valor: unknown }): void {
    this.tramite630307Store.setTramite630307State($event.campo, $event.valor);
  }

  /**
   * Obtiene el estado actual del trámite desde el store.
   */
  getValorStore(): void {
    this.tramite630307Query.selectTramite630307State$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.estadoSeleccionado = data;
      });
  }

  /**
   * Método del ciclo de vida que se ejecuta al destruir el componente.
   * Libera las suscripciones activas para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
