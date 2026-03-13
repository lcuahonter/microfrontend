/**
 * El `Tramite80206Store` es una clase de Angular que utiliza Akita para gestionar el estado relacionado con la ampliación de servicios.
 * Proporciona métodos para actualizar y gestionar datos como información de registro, aduanas, sectores, empresas y otros campos relacionados.
 * Este archivo define la estructura del estado inicial, las interfaces necesarias y los métodos para actualizar el estado de la ampliación de servicios.
 */

import { Arancelaria, ArancelariaImportacion, Sector, Servicios } from '../models/datos-info.model';
import { Store, StoreConfig } from '@datorama/akita';
import { Catalogo } from '@ng-mf/data-access-user';
import { Injectable } from '@angular/core';

/**
 * Interfaz que define la estructura del estado de ampliación de servicios.
 */
export interface AmpliacionServiciosState {
    /** Identificador de la solicitud, puede ser nulo si aún no se ha creado. */
  idSolicitud: number | null;
  /**
   * Información del registro.
   */
  infoRegistro: Servicios;

  /**
   * Lista de datos IMMEX.
   */
  datosImmex: Arancelaria[];

  /**
   * Lista de datos de importación.
   */
  datosImportacion: ArancelariaImportacion[];

  /**
   * Lista de datos del sector.
   */
  datosSector: Sector[];

  /**
   * Lista de datos generales.
   */
  datos: Arancelaria[];

  /**
   * Aduana de ingreso seleccionada.
   */
  aduanaDeIngresoSelecion: string;

  /**
   * Sector seleccionado.
   */
  sectorSelecion: string;

  /**
   * Validez del formulario.
   */
  formaValida: { [key: string]: boolean };

  /**
   * Fracción seleccionada.
   */
  fraccion: string;

  /**
   * Valor de importación.
   */
  importacion: string;

  /**
   * Fracción arancelaria seleccionada.
   */
  fraccionArancelaria: string;

  /**
   * Cantidad seleccionada.
   */
  cantidad: string;

  /**
   * Valor seleccionado.
   */
  valor: string;

  /**
   * Modalidad seleccionada.
   */
  seleccionaLaModalidad: string;

  /**
   * Regla seleccionada.
   */
  seleccionarRegla: string;

  /**
   * Sector seleccionado.
   */
  sector: string;

  /**
   * Lista de sectores desplegables.
   */
  sectorDesplegable: Catalogo[];

  /**
   * Lista de reglas seleccionadas.
   */
  reglaSeleccionada: Catalogo[];

  /**
   * Indica si una regla está seleccionada.
   */
  isSelectedRegla: boolean;
}

/**
 * Estado inicial de la ampliación de servicios.
 * @constant {AmpliacionServiciosState} INITIAL_AMPLIACION_SERVICIOS_STATE
 */
export const INITIAL_AMPLIACION_SERVICIOS_STATE: AmpliacionServiciosState = {
  idSolicitud: 0,
  infoRegistro: {
    seleccionaLaModalidad: '',
    folio: '',
    ano: '',
  },
  seleccionaLaModalidad: 'Ampliación 3RS',
  seleccionarRegla: '',
  sector: '',
  sectorDesplegable: [],
  reglaSeleccionada: [],
  isSelectedRegla: false,
  datosImmex: [],
  datosImportacion: [],
  datosSector: [],
  datos: [],
  aduanaDeIngresoSelecion: "",
  sectorSelecion: "",
  formaValida: {
    seleccionarRegla: true,
  },
  fraccion: '',
  importacion: '',
  valor: '',
  cantidad: '',
  fraccionArancelaria: '',
};

/**
 * Clase que representa el store de ampliación de servicios.
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'tramite-80206', resettable: true })
export class Tramite80206Store extends Store<AmpliacionServiciosState> {
  /**
   * Constructor del store.
   */
  constructor() {
    super(INITIAL_AMPLIACION_SERVICIOS_STATE);
  }

  /**
   * Actualiza la información de registro en el estado.
   */
  setInfoRegistro(infoRegistro: Servicios): void {
    this.update((state) => ({
      ...state,
      infoRegistro,
    }));
  }

  /**
   * Actualiza la lista de aduanas de ingreso en el estado.
   */
  setAduanaDeIngreso(aduanaDeIngreso: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      aduanaDeIngreso,
    }));
  }

  /**
   * Actualiza los datos IMMEX en el estado.
   */
  setDatosImmex(datosImmex: Arancelaria[]): void {
    this.update((state) => ({
      ...state,
      datosImmex,
    }));
  }

  /**
   * Actualiza los datos de importación en el estado.
   */
  setDatosImportacion(datosImportacion: ArancelariaImportacion[]): void {
    this.update((state) => ({
      ...state,
      datosImportacion,
    }));
  }

  /**
   * Actualiza los datos del sector en el estado.
   */
  setDatosSector(datosSector: Sector[]): void {
    this.update((state) => ({
      ...state,
      datosSector,
    }));
  }

  /**
   * Actualiza los datos generales en el estado.
   */
  setDatos(datos: Arancelaria[]): void {
    this.update((state) => ({
      ...state,
      datos,
    }));
  }

  /**
   * Actualiza la aduana de ingreso seleccionada en el estado.
   */
  setAduanaDeIngresoSeleccion(aduanaDeIngresoSelecion: string): void {
    this.update((state) => ({
      ...state,
      aduanaDeIngresoSelecion,
    }));
  }

  /**
   * Actualiza el sector seleccionado en el estado.
   */
  setSectorSeleccion(sectorSelecion: string): void {
    this.update((state) => ({
      ...state ,
      sectorSelecion,
    }));
  }

  /**
   * Actualiza la validez del formulario en el estado.
   */
  setFormValida(formaValida: { [key: string]: boolean }): void {
    this.update((state) => {
      const IS_VALID = { ...state.formaValida, ...formaValida };
      return {
        ...state,
        formaValida: IS_VALID,
      };
    });
  }

  /**
   * Actualiza la fracción en el estado.
   */
  setRfcEmpresa(fraccion: string): void {
    this.update((state) => ({
      ...state,
      fraccion,
    }));
  }

  /**
   * Actualiza el valor de importación en el estado.
   */
  setImportacion(importacion: string): void {
    this.update((state) => ({
      ...state,
      importacion,
    }));
  }

  /**
   * Actualiza el valor en el estado.
   */
  setValor(valor: string): void {
    this.update((state) => ({
      ...state,
      valor,
    }));
  }

  /**
   * Actualiza la cantidad en el estado.
   */
  setCantidad(cantidad: string): void {
    this.update((state) => ({
      ...state,
      cantidad,
    }));
  }

  /**
   * Actualiza la fracción arancelaria en el estado.
   */
  setFraccionArancelaria(fraccionArancelaria: string): void {
    this.update((state) => ({
      ...state,
      fraccionArancelaria,
    }));
  }

  /**
   * Actualiza la modalidad seleccionada en el estado.
   */
  setSeleccionaLaModalidad(seleccionaLaModalidad: string): void {
    this.update((state) => ({
      ...state,
      seleccionaLaModalidad,
    }));
  }

  /**
   * Actualiza la regla seleccionada en el estado.
   */
  setSeleccionarRegla(seleccionarRegla: string): void {
    this.update((state) => ({
      ...state,
      seleccionarRegla,
    }));
  }

  /**
   * Actualiza el sector en el estado.
   */
  setSector(sector: string): void {
    this.update((state) => ({
      ...state,
      sector,
    }));
  }

  /**
   * Actualiza el sector desplegable en el estado.
   */
  setSectorDesplegable(sectorDesplegable: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      sectorDesplegable,
    }));
  }

  /**
   * Actualiza la regla seleccionada en el estado.
   */
  setReglaSeleccionada(reglaSeleccionada: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      reglaSeleccionada,
    }));
  }

  /**
   * Actualiza el estado de selección de regla.
   */
  setIsSelectedRegla(isSelectedRegla: boolean): void {
    this.update((state) => ({
      ...state,
      isSelectedRegla,
    }));
  }

  /**
   * Actualiza el estado con el nuevo valor de `idSolicitud`.
   */
  setIdSolicitud(idSolicitud: number): void {
    this.update((state) => ({
      ...state,
      idSolicitud,
    }));
  }
}