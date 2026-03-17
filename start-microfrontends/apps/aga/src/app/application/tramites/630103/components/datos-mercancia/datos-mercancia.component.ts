/**
 * Componente que gestiona los datos de la mercancía para el trámite 630103.
 * Permite inicializar formularios, obtener datos del estado y manejar el estado del formulario.
 */
import { CommonModule } from '@angular/common';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ConsultaioQuery, ModeloDeFormaDinamica } from '@ng-mf/data-access-user';
import { takeUntil } from 'rxjs';

import { Subject } from 'rxjs';

import { FORMULARIO_DATOS_MERCANCIA } from '../../enum/autorizacion-importacion-temporal.enum';
import { Tramite630103Query } from '../../estados/tramite630103.query';

import { Tramite630103State, Tramite630103Store } from '../../estados/tramite630103.store';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';

/**
 * Componente que gestiona los datos de la mercancía para el trámite 630103.
 */
@Component({
  selector: 'app-datos-mercancia',
  standalone: true,
  imports: [CommonModule, FormasDinamicasComponent],
  templateUrl: './datos-mercancia.component.html',
  styleUrl: './datos-mercancia.component.scss',
})
export class DatosMercanciaComponent implements OnInit, OnDestroy {
  /**
   * Indica si el formulario está en modo solo lectura.
   */
  esSoloLectura!: boolean;

  /**
   * Subject utilizado para manejar la destrucción de suscripciones y evitar fugas de memoria.
   */
  private destroyed$ = new Subject<void>();

  /**
   * Estado seleccionado del trámite 630103.
   */
  estadoSeleccionado!: Tramite630103State;

  /**
   * Formulario reactivo para gestionar los datos de la mercancía.
   */
  datosMercancia!: FormGroup;

  /**
   * Formulario dinámico que define la estructura del formulario de datos de mercancía.
   */
  formularioDatosMercancia: ModeloDeFormaDinamica[] = FORMULARIO_DATOS_MERCANCIA;

  /**
   * Estado actual de la solicitud.
   */
  public solicitudState!: Tramite630103State;

  /**
   * Constructor del componente.
   * 
   * formBuilder - Constructor de formularios reactivos.
   * tramite630103Store - Store para manejar el estado del trámite.
   * tramite630103Query - Query para consultar el estado del trámite.
   * consultaioQuery - Query para observar el estado de solo lectura.
   */
  constructor(
    private formBuilder: FormBuilder,
    private tramite630103Store: Tramite630103Store,
    private tramite630103Query: Tramite630103Query,
    private consultaioQuery: ConsultaioQuery,
  ) {
    this.datosMercancia = this.formBuilder.group({});
  }

  /**
   * Guarda los datos del formulario y ajusta el estado de solo lectura.
   * Deshabilita o habilita los campos según corresponda.
   */
  guardarDatosFormulario(): void {
    if (this.esSoloLectura) {
      this.datosMercancia.disable();
    } else {
      this.datosMercancia.enable();
    }
  }

  /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   * Inicializa el formulario y obtiene el estado del trámite.
   */
  ngOnInit(): void {
    this.getValorStore();
    this.obtenerEstadoValor()
  }
  
  /**
   * Se suscribe al observable del estado del trámite (`Tramite220103Query`)
   * para obtener y almacenar el estado actual en `estadoSeleccionado`.
   * La suscripción se gestiona con `takeUntil` para limpiarse automáticamente
   * en `ngOnDestroy`.
   */
  obtenerEstadoValor(): void {
   this.consultaioQuery.selectConsultaioState$
    .pipe(takeUntil(this.destroyed$))
    .subscribe((estadoConsulta) => {
      this.esSoloLectura = estadoConsulta.readonly;
      this.guardarDatosFormulario()
    });
  }

  /**
   * Obtiene el estado actual del trámite desde el store.
   */
  getValorStore(): void {
    this.tramite630103Query.selectTramite630103State$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.estadoSeleccionado = data;
      });
  }

  /**
   * Establece un cambio de valor en el store basado en un evento.
   * $event - Evento que contiene el campo y el valor a actualizar.
   */
  establecerCambioDeValor($event: { campo: string; valor: unknown }): void {
    this.tramite630103Store.setTramite630103State($event.campo, $event.valor);
  }
/*
  * Valida el formulario de datos de importación temporal.
  * @returns {boolean} - `true` si el formulario es válido, `false` en caso contrario.
  */
  validarFormulario(): boolean {
    this.datosMercancia.markAllAsTouched();
    return this.datosMercancia.valid;
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