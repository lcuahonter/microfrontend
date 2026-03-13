/**
 * datos-retorno-autorizacion.component.ts
 * Componente que gestiona los datos de retorno de autorización para el trámite 630307.
 * Permite inicializar formularios, obtener datos de catálogos y manejar el estado del formulario.
 */

import { CommonModule } from '@angular/common';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, Subscription, map, takeUntil } from 'rxjs';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ModeloDeFormaDinamica } from '@libs/shared/data-access-user/src';

import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';

import { FORMULARIO_DATOS_AUTORIZACION } from '../../enum/retorno-importacion-temporal.enum';
import { Tramite630307Query } from '../../estados/tramite630307.query';

import {
  Tramite630307State,
  Tramite630307Store,
} from '../../estados/tramite630307.store';
import { RetornoImportacionTemporalService } from '../../services/retorno-importacion-temporal.service';
/**
 * Componente que gestiona los datos de retorno de autorización para el trámite 630307.
 * Permite inicializar formularios, obtener datos de catálogos y manejar el estado del formulario.
 */
@Component({
  selector: 'app-datos-retorno-autorizacion',
  standalone: true,
  imports: [CommonModule, FormasDinamicasComponent],
  templateUrl: './datos-retorno-autorizacion.component.html',
  styleUrl: './datos-retorno-autorizacion.component.scss',
})
export class DatosRetornoAutorizacionComponent implements OnInit, OnDestroy {
  /**
   * Formulario dinámico para gestionar los datos de autorización.
   */
  formularioDatosAutorizacion: ModeloDeFormaDinamica[] =
    FORMULARIO_DATOS_AUTORIZACION;

  /**
   * Estado seleccionado del trámite 630307.
   */
  estadoSeleccionado!: Tramite630307State;

  /**
   * Formulario reactivo para gestionar los datos de la autorización de retorno.
   */
  datosImportacionRetornoAutorizacionGeneralFormulario!: FormGroup;

  /**
   * Subject utilizado para manejar la destrucción de suscripciones y evitar fugas de memoria.
   */
  private destroyed$ = new Subject<void>();

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
   * @param retornoImportacionTemporalService - Servicio para obtener datos de catálogos.
   * @param tramite630307Store - Store para manejar el estado del trámite.
   * @param tramite630307Query - Query para consultar el estado del trámite.
   */
  constructor(
    private fb: FormBuilder,
    private retornoImportacionTemporalService: RetornoImportacionTemporalService,
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
   * Inicializa el formulario y obtiene datos de catálogos.
   */
  ngOnInit(): void {
    this.getValorStore();
    this.inicializarEstadoFormulario();
    this.getAduanaDeIngreso();
    this.getSeccionAduanera();
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
      this.datosImportacionRetornoAutorizacionGeneralFormulario.disable();
    } else {
      this.datosImportacionRetornoAutorizacionGeneralFormulario.enable();
    }
  }

  /**
   * Inicializa el formulario reactivo con valores predeterminados y validaciones.
   */
  inicializarFormulario(): void {
    this.datosImportacionRetornoAutorizacionGeneralFormulario = this.fb.group(
      {}
    );
  }

  /**
   * Obtiene las opciones de aduanas de ingreso desde el servicio.
   */
  getAduanaDeIngreso(): void {
    this.retornoImportacionTemporalService
      .getAduanaDeIngreso()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        const ADUANA_DE_INGRESO = this.formularioDatosAutorizacion.find(
          (item) => item.id === 'aduanaDeIngreso'
        );
        if (ADUANA_DE_INGRESO) {
          ADUANA_DE_INGRESO.opciones = data;
        }
      });
  }

  /**
   * Obtiene las opciones de secciones aduaneras desde el servicio.
   */
  getSeccionAduanera(): void {
    this.retornoImportacionTemporalService
      .getSeccionAduanera()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        const SECCION_ADUANERA = this.formularioDatosAutorizacion.find(
          (item) => item.id === 'seccionAduanera'
        );
        if (SECCION_ADUANERA) {
          SECCION_ADUANERA.opciones = data;
        }
      });
  }

  /**
   * Actualiza un valor específico en el store del trámite.
   *
   * @param $event - Evento que contiene el campo y el valor a actualizar.
   */
  establecerCambioDeValor($event: { campo: string; valor: unknown }): void {
    if (
      typeof $event.valor === 'object' &&
      $event.valor !== null &&
      'id' in $event.valor
    ) {
      this.tramite630307Store.setTramite630307State(
        $event.campo,
        ($event.valor as { id: unknown }).id
      );
    } else {
      this.tramite630307Store.setTramite630307State($event.campo, $event.valor);
    }
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
