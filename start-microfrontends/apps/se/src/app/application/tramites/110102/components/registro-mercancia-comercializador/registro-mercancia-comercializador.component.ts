/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Este componente maneja el registro de la mercancía del comercializador.
 */

import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { TituloComponent } from "@ng-mf/data-access-user";

import { ComercializadoresProductosResponse } from '../../models/response/comercializadores-productos-response.model';
import { DatosTratadosAcuerdosComponent } from "../datos-tratados-acuerdos/datos-tratados-acuerdos.component";
import { Tramite110102Query } from '../../estados/queries/tramite110102.query';
import { Tramite110102State } from '../../estados/store/tramite110102.store';

/**
 * Este componente maneja el registro de la mercancía del comercializador.
 */
@Component({
  selector: 'app-registro-mercancia-comercializador',
  standalone: true,
  imports: [CommonModule, TituloComponent, ReactiveFormsModule, DatosTratadosAcuerdosComponent],
  templateUrl: './registro-mercancia-comercializador.component.html',
  styleUrl: './registro-mercancia-comercializador.component.scss',
})
export class RegistroMercanciaComercializadorComponent implements OnChanges, OnDestroy {
  
/**
   * FormGroup que contiene los datos de la mercancía asociada.
   */
registroMercanciaComercializadorFrom: FormGroup;

/**
 * Subject que emite un evento cuando el componente es destruido,
 * permitiendo la desuscripción de observables.
 */
private destroyed$ = new Subject<void>();

/**
 * Mercancía del comercializador de productos.
 */
@Input() mercancia!: ComercializadoresProductosResponse;

  /**
    * Estado actual del trámite.
  */
  estadoTramite!: Tramite110102State;

  /**
   * Constructor del componente.
   * Servicio para la creación de formularios reactivos y para obtener datos de la mercancía asociada.
   * @param {FormBuilder} fb - Servicio para la creación de formularios reactivos.
   * @param {MercanciaasociadaService} service - Servicio para obtener datos de la mercancía asociada.
   * @param {Tramite110102Query} consultaTramite - Servicio para consultar el estado del trámite.
   */
  constructor(private fb: FormBuilder,
    private consultaTramite: Tramite110102Query,
  ) {
      this.consultaTramite.selectTramite110102$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((estado) => {
        this.estadoTramite = estado;
      });
    this.registroMercanciaComercializadorFrom = this.fb.group({
      nombreComercial: [{ value: '', disabled: true }],
      nombreIngles: [{ value: '', disabled: true }],
      nombreTecnico: [{ value: '', disabled: true }],
      clave: [{ value: '', disabled: true }],
      clasificacionNaladi: [{value: '', disabled: true}],
      descripcionNaladi: [{value: '', disabled: true}],
      clasificacionNaladi1993: [{value: '', disabled: true}],
      descripcionNaladi1993: [{value: '', disabled: true}],
      clasificacionNaladi1996: [{value: '', disabled: true}],
      descripcionNaladi1996: [{value: '', disabled: true}],
      clasificacionNaladi2002: [{value: '', disabled: true}],
      descripcionNaladi2002: [{value: '', disabled: true}],
    });
  }


  /**
   * Maneja los cambios en las propiedades de entrada del componente.
   */
  ngOnChanges(changes: SimpleChanges):void {
    if (changes['mercancia']) {
      const ACTUAL = changes['mercancia'].currentValue;
      this.recuperaValores(ACTUAL);
    }
  }

  /**
   * Recupera los valores de la mercancía asociada desde el servicio y los asigna al formulario.
   */
  recuperaValores(data: ComercializadoresProductosResponse): void {
    if (!data || !data.registro_cuestionario || !data.registro_cuestionario.mercancia_asociada) {
      return;
    }
    this.registroMercanciaComercializadorFrom.patchValue({
      nombreComercial: data.registro_cuestionario.mercancia_asociada.nombre_comercial,
      nombreIngles: data.registro_cuestionario.mercancia_asociada.nombre_ingles,
      nombreTecnico: data.registro_cuestionario.mercancia_asociada.descripcion_fraccion,
      clave: data.registro_cuestionario.mercancia_asociada.cve_fraccion,
      clasificacionNaladi: data.registro_cuestionario.mercancia_asociada.fraccion_naladi?.cve_fraccion,
      descripcionNaladi: data.registro_cuestionario.mercancia_asociada.fraccion_naladi?.descripcion,
      clasificacionNaladi1993: data.registro_cuestionario.mercancia_asociada.fraccion_naladisa93?.cve_fraccion,
      descripcionNaladi1993: data.registro_cuestionario.mercancia_asociada.fraccion_naladisa93?.descripcion,
      clasificacionNaladi1996: data.registro_cuestionario.mercancia_asociada.fraccion_naladisa96?.cve_fraccion,
      descripcionNaladi1996: data.registro_cuestionario.mercancia_asociada.fraccion_naladisa96?.descripcion,
      clasificacionNaladi2002: data.registro_cuestionario.mercancia_asociada.fraccion_naladisa02?.cve_fraccion,
      descripcionNaladi2002: data.registro_cuestionario.mercancia_asociada.fraccion_naladisa02?.descripcion,
    });
   
  }

  /**
   * Hook del ciclo de vida que se llama cuando la directiva se destruye.
   * Completa el subject destroyed$ para desuscribirse de todos los observables.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}