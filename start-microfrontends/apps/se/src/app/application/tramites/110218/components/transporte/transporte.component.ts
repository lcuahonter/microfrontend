import { CommonModule } from '@angular/common';

import { Component } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';

import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { REGEX_DESCRIPCION_ESPECIALES } from '@ng-mf/data-access-user';
import { ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';

import { REG_X } from '@ng-mf/data-access-user';

import { ConsultaioQuery,TituloComponent } from '@ng-mf/data-access-user';
import { Tramite110218Query } from '../../estados/queries/tramite110218.query';
import { Tramite110218Store } from '../../estados/tramites/tramite110218.store';

import { Solicitud110218State } from '../../estados/tramites/tramite110218.store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs';

/**
 * Componente para manejar los detalles del transporte para el certificado técnico de Japón.
 *
 * Este componente permite a los usuarios introducir y visualizar los detalles del transporte,
 * incluyendo información sobre puertos, embarcaciones y vuelos.
 */
@Component({
  selector: 'app-transporte',
  standalone: true,
  imports: [CommonModule, TituloComponent, ReactiveFormsModule],
  templateUrl: './transporte.component.html',
  styleUrl: './transporte.component.scss',
})
export class TransporteComponent implements OnInit, OnDestroy {
  /**
   * Indica si el formulario está en modo solo lectura.
   * Si es verdadero, los campos del formulario estarán deshabilitados para evitar modificaciones.
   */
  esSoloLectura!: boolean;

  /**
   * Formulario para los detalles del transporte.
   * Contiene los campos relacionados con los puertos, embarcaciones y vuelos.
   */
  detallestransporte!: FormGroup;

  /**
   * Subject utilizado para manejar la destrucción del componente y evitar fugas de memoria.
   */
  private destroyed$ = new Subject<void>();

  /**
   * Estado seleccionado del trámite 110218.
   * Contiene los valores actuales almacenados en el estado global.
   */
  estadoSeleccionado!: Solicitud110218State;

  /**
   * Constructor del componente.
   *
   * @param formBuilder - Constructor de formularios reactivos.
   * @param tramite110218Store - Store para manejar el estado del trámite 110218.
   * @param tramite110218Query - Query para consultar el estado del trámite 110218.
   */
  constructor(
    public formBuilder: FormBuilder,
    private tramite110218Store: Tramite110218Store,
    private tramite110218Query: Tramite110218Query,
    private consultaQuery: ConsultaioQuery
  ) {}

  /**
   * Inicializa el formulario reactivo con valores predeterminados y validaciones.
   * Los campos incluyen puertos, embarcaciones y vuelos.
   */
  inicializarFormulario(): void {
    this.detallestransporte = this.formBuilder.group({
      /**
       * Puerto de embarque.
       * Campo obligatorio, solo permite letras y espacios.
       */
      puertodeEmbarque: [
        this.estadoSeleccionado?.puertodeEmbarque,
        [Validators.required, Validators.pattern(REGEX_DESCRIPCION_ESPECIALES)],
      ],
      /**
       * Puerto de desembarque.
       * Campo obligatorio, solo permite letras y espacios.
       */
      puertodeDesembarque: [
        this.estadoSeleccionado?.puertodeDesembarque,
        [Validators.required, Validators.pattern(REGEX_DESCRIPCION_ESPECIALES)],
      ],
      /**
       * Puerto de tránsito.
       * Campo obligatorio, solo permite letras y espacios.
       */
      puertodeTransito: [
        this.estadoSeleccionado?.puertodeTransito,
        [Validators.required, Validators.pattern(REGEX_DESCRIPCION_ESPECIALES)],
      ],
      /**
       * Nombre de la embarcación.
       * Campo obligatorio, solo permite letras y espacios.
       */
      nombredelaEmbarcacion: [
        this.estadoSeleccionado?.nombredelaEmbarcacion,
        [Validators.required, Validators.pattern(REGEX_DESCRIPCION_ESPECIALES)],
      ],
      /**
       * Número de vuelo.
       * Campo obligatorio, solo permite números.
       */
      numerodeVuelo: [
        this.estadoSeleccionado?.numerodeVuelo,
        [Validators.required, Validators.pattern(REG_X.SOLO_NUMEROS), Validators.maxLength(15)],
      ],
    });
  }

  /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   * Obtiene el estado actual del trámite y configura el formulario.
   */
  ngOnInit(): void {
    this.getValorStore();
    this.inicializarFormulario();
    this.consultaQuery.selectConsultaioState$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((estadoConsulta) => {
        this.esSoloLectura = estadoConsulta.readonly;
        this.habilitarDeshabilitarFormulario();
      });
  }
  /**
   * Habilita o deshabilita el formulario de detalles de transporte según el modo de solo lectura.
   * Si `esSoloLectura` es verdadero, deshabilita todos los controles del formulario para evitar modificaciones.
   * Si es falso, habilita los controles para permitir la edición.
   */
  habilitarDeshabilitarFormulario(): void {
    if (this.esSoloLectura) {
      this.detallestransporte.disable();
    } else {
      this.detallestransporte.enable();
    }
  }

  /**
   * Método del ciclo de vida que se ejecuta al destruir el componente.
   * Libera las suscripciones activas para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Actualiza un valor específico en el store del trámite.
   *
   * @param FormGroup - Formulario reactivo.
   * @param control - Nombre del control cuyo valor se actualizará en el store.
   */
  setValorStore(FormGroup: FormGroup, control: string): void {
    const VALOR = FormGroup.get(control)?.value;
    this.tramite110218Store.setTramite110218State({
      [control]: VALOR,
    });
  }

  /**
   * Obtiene el estado actual del trámite desde el store.
   * Suscribe al observable del estado y actualiza la propiedad `estadoSeleccionado`.
   */
  getValorStore(): void {
    this.tramite110218Query.selectTramite110218State$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.estadoSeleccionado = data;
      });
  }
}