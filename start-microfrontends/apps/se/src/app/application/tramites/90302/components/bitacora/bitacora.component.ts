/**
 * @fileoverview
 * El `BitacoraComponent` es un componente de Angular diseñado para gestionar y mostrar información relacionada con la bitácora de PROSEC.
 * Este componente interactúa con servicios para obtener datos de bitácoras, mercancías, plantas, productores indirectos y sectores.
 * Además, utiliza configuraciones predefinidas para mostrar los datos en tablas.
 * 
 * @module BitacoraComponent
 * @description
 * Este componente proporciona funcionalidad para obtener y mostrar datos relacionados con PROSEC, 
 * incluyendo bitácoras, mercancías a producir, plantas, productores indirectos y sectores.
 */

import { Bitacora, MercanciasAProducir, Plantas, ProductorIndirecto, Sector } from "../../models/datos-info.model";
import { CONFIGURACION_BITCORA, CONFIGURACION_MERCANCIAS_A_PRODUCIR, CONFIGURACION_PLANTAS, CONFIGURACION_PRODUCTOR_INDIRECTO, CONFIGURACION_SECTOR } from "../../constantes/modificacion.constants";
import { Component, Input } from '@angular/core';
import { OnDestroy, OnInit } from '@angular/core';
import { AmpliacionServiciosService } from '../../services/ampliacion-servicios.service';
import { ConfiguracionColumna } from '../../models/configuracion-columna.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-bitacora',
  templateUrl: './bitacora.component.html',
  styleUrl: './bitacora.component.scss',
})
export class BitacoraComponent implements OnInit, OnDestroy {
  /**
   * Indica si el componente pertenece al solicitante.
   * Este valor se recibe como entrada desde el componente padre.
   * @property {boolean} esDeSolicitante
   */
  @Input() esDeSolicitante: boolean = false;

  /**
   * Configuración de la tabla para la bitácora.
   * Define las columnas y su configuración utilizando la constante `CONFIGURACION_BITCORA`.
   * @property {ConfiguracionColumna<Bitacora>[]} configuracionTablaBitacora
   */
  configuracionTablaBitacora: ConfiguracionColumna<Bitacora>[] = CONFIGURACION_BITCORA;

  /**
   * Configuración de la tabla para mercancías a producir.
   * Define las columnas utilizando la constante `CONFIGURACION_MERCANCIAS_A_PRODUCIR`.
   * @property {ConfiguracionColumna<MercanciasAProducir>[]} configuracionTablaMercancias
   */
  configuracionTablaMercancias: ConfiguracionColumna<MercanciasAProducir>[] = CONFIGURACION_MERCANCIAS_A_PRODUCIR;

  /**
   * Configuración de la tabla para mostrar las plantas.
   * Utiliza la constante `CONFIGURACION_PLANTAS`.
   * @property {ConfiguracionColumna<Plantas>[]} configuracionTablaPlantas
   */
  configuracionTablaPlantas: ConfiguracionColumna<Plantas>[] = CONFIGURACION_PLANTAS;

  /**
   * Configuración de la tabla para mostrar los productores indirectos.
   * Utiliza la constante `CONFIGURACION_PRODUCTOR_INDIRECTO`.
   * @property {ConfiguracionColumna<ProductorIndirecto>[]} configuracionTablaProductor
   */
  configuracionTablaProductor: ConfiguracionColumna<ProductorIndirecto>[] = CONFIGURACION_PRODUCTOR_INDIRECTO;

  /**
   * Configuración de la tabla para el sector.
   * Utiliza la constante `CONFIGURACION_SECTOR`.
   * @property {ConfiguracionColumna<Sector>[]} configuracionTablaSector
   */
  configuracionTablaSector: ConfiguracionColumna<Sector>[] = CONFIGURACION_SECTOR;

  /**
   * Arreglo que almacena los datos de la bitácora.
   * @property {Bitacora[]} datosBitacora
   */
  datosBitacora: Bitacora[] = [];

  /**
   * Arreglo que almacena los datos de las mercancías a producir.
   * @property {MercanciasAProducir[]} datosMercancias
   */
  datosMercancias: MercanciasAProducir[] = [];

  /**
   * Arreglo que almacena los datos de las plantas.
   * @property {Plantas[]} datosPlantas
   */
  datosPlantas: Plantas[] = [];

  /**
   * Arreglo que almacena información sobre los productores indirectos.
   * @property {ProductorIndirecto[]} datosProductor
   */
  datosProductor: ProductorIndirecto[] = [];

  /**
   * Arreglo que almacena los datos de los sectores.
   * @property {Sector[]} datosSector
   */
  datosSector: Sector[] = [];

  /**
   * Notificador para gestionar la destrucción o desuscripción de observables.
   * @property {Subject<void>} destroyNotifier$
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor del componente.
   * @constructor
   * @param {AmpliacionServiciosService} ampliacionServiciosService - Servicio para obtener datos de ampliación de servicios.
   */
  constructor(private ampliacionServiciosService: AmpliacionServiciosService) {}

  /**
   * Método de inicialización del componente.
   * Llama a los métodos para obtener datos de bitácoras, mercancías, plantas, productores indirectos y sectores.
   * @method ngOnInit
   */
  ngOnInit(): void {
    this.getBitacoraProsec();
    this.getMercanciasProsec();
    this.getPlantasProsec();
    this.getProductorProsec();
    this.getSectoresProsec();
  }

  /**
   * Obtiene la bitácora de PROSEC desde el servicio y actualiza la propiedad `datosBitacora`.
   * @method getBitacoraProsec
   */
  getBitacoraProsec(): void {
    this.ampliacionServiciosService
      .getBitacoraProsec()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp.code === 200) {
          const RESPONSE = resp.data;
          this.datosBitacora = RESPONSE;
        }
      });
  }

  /**
   * Obtiene la lista de mercancías PROSEC desde el servicio y actualiza la propiedad `datosMercancias`.
   * @method getMercanciasProsec
   */
  getMercanciasProsec(): void {
    this.ampliacionServiciosService
      .getMercanciasProsec()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp.code === 200) {
          const RESPONSE = resp.data;
          this.datosMercancias = RESPONSE;
        }
      });
  }

  /**
   * Obtiene la lista de plantas PROSEC desde el servicio y actualiza la propiedad `datosPlantas`.
   * @method getPlantasProsec
   */
  getPlantasProsec(): void {
    this.ampliacionServiciosService
      .getPlantasProsec()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp.code === 200) {
          const RESPONSE = resp.data;
          this.datosPlantas = RESPONSE;
        }
      });
  }

  /**
   * Obtiene los datos del productor indirecto PROSEC desde el servicio y actualiza la propiedad `datosProductor`.
   * @method getProductorProsec
   */
  getProductorProsec(): void {
    this.ampliacionServiciosService
      .getProductorIndirectoProsec()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp.code === 200) {
          const RESPONSE = resp.data;
          this.datosProductor = RESPONSE;
        }
      });
  }

  /**
   * Obtiene los sectores PROSEC desde el servicio y actualiza la propiedad `datosSector`.
   * @method getSectoresProsec
   */
  getSectoresProsec(): void {
    this.ampliacionServiciosService
      .getSectoresProsec()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp.code === 200) {
          const RESPONSE = resp.data;
          this.datosSector = RESPONSE;
        }
      });
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Limpia las suscripciones para evitar fugas de memoria.
   * @method ngOnDestroy
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}