import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Representa el estado de Solicitude32612State.
 * Es un objeto dinámico donde las claves son cadenas y los valores pueden ser de cualquier tipo.
 *
 * @interface Solicitude32612DosState
 * @property {string} [key] - Las claves son cadenas que representan los nombres de los campos.
 * @property {unknown} [value] - Los valores pueden ser de cualquier tipo, dependiendo del campo.
 */
export interface Solicitude32612DosState {
    nombreAgenciaAduanal: string;
    tipoInstalacion: string;
    antiguedadInstalacion: string;
    actividadPreponderante: string;
    tiposServicios: string;
    operacionesMensualesExp: string;
    operacionesMensualesImp: string;
    numeroEmpleados: string;
    superficieInstalacion: string;
    opcion: string;
    nombrePrograma: string;
    numeroDeRegistro: string;
    organismoCertificador: string;
    numeroPatente: string;
    numeroRegistro: string;
    nombreAgenteAduanal: string;
    numeroTrabajadoresIMSS: string;
    numeroTrabajadoresContratistas: string;
    serviciosAdicionales: string;
    indique: string;
}

/**
 * Crea el estado inicial para ExportarIlustraciones270101.
 * @returns {Solicitude32612DosState} Un objeto vacío que representa el estado inicial del estado de Solicitude32612State.
 */
export function createInitialState(): Solicitude32612DosState {
  return {
    nombreAgenciaAduanal: '',
    tipoInstalacion: '',
    antiguedadInstalacion: '',
    actividadPreponderante: '',
    tiposServicios: '',
    operacionesMensualesExp: '',
    operacionesMensualesImp: '',
    numeroEmpleados: '',
    superficieInstalacion: '',
    opcion: '',
    nombrePrograma: '',
    numeroDeRegistro: '',
    organismoCertificador: '',
    numeroPatente: '',
    numeroRegistro: '',
    nombreAgenteAduanal: '',
    numeroTrabajadoresIMSS: '',
    numeroTrabajadoresContratistas: '',
    serviciosAdicionales: '',
    indique: '',
  };
}

/**
 * Marca esta clase como un servicio inyectable en Angular.
 *
 * @decorator Injectable
 * @property {string} providedIn - Define el alcance del servicio.
 * En este caso, el servicio está disponible en toda la aplicación ('root').
 */
@Injectable({
  providedIn: 'root',
})
/**
 * Configuración del store para Tramite31401.
 *
 * @decorator StoreConfig
 * @property {string} name - Nombre del store, utilizado para identificarlo.
 * @property {boolean} resettable - Indica si el estado del store puede ser reiniciado.
 */
@StoreConfig({ name: 'tramite32612', resettable: true })
export class Tramite32612DosStore extends Store<Solicitude32612DosState> {
  /**
   * Constructor de la clase Tramite32612DosStore.
   *
   * Este constructor inicializa el estado del store utilizando la función `createInitialState`.
   * La función `createInitialState` devuelve un objeto vacío que representa el estado inicial.
   */
  constructor() {
    super(createInitialState());
  }

/**
 * Actualiza el estado con el nombre de la agencia aduanal proporcionado.
 *
 * @param nombre - El nombre de la agencia aduanal para establecer en el estado.
 */
  public setNombreAgenciaAduanal(nombre: string): void {
    this.update((state) => ({
      ...state,
      nombreAgenciaAduanal: nombre,
    }));
  }

    /**
     * Actualiza la propiedad `tipoInstalacion` en el estado del store.
     *
     * @param tipo - El nuevo valor para establecer en `tipoInstalacion`.
     */
    public setTipoInstalacion(tipo: string): void {
        this.update((state) => ({
        ...state,
        tipoInstalacion: tipo,
        }));
    }

    /**
     * Actualiza la propiedad `antiguedadInstalacion` en el estado del store.
     *
     * @param antiguedad - El nuevo valor para establecer en `antiguedadInstalacion`.
     */
    public setAntiguedadInstalacion(antiguedad: string): void {
        this.update((state) => ({
        ...state,
        antiguedadInstalacion: antiguedad,
        }));
    }

    /**
     * Actualiza la propiedad `actividadPreponderante` en el estado del store.
     *
     * @param actividad - El nuevo valor para establecer en `actividadPreponderante`.
     */
    public setActividadPreponderante(actividad: string): void {
        this.update((state) => ({
        ...state,
        actividadPreponderante: actividad,
        }));
    }

    /**
     * Actualiza la propiedad `tiposServicios` en el estado del store.
     *
     * @param servicios - El nuevo valor para establecer en `tiposServicios`.
     */
    public setTiposServicios(servicios: string): void {
        this.update((state) => ({
        ...state,
        tiposServicios: servicios,
        }));
    }

    /**
     * Actualiza la propiedad `operacionesMensualesExp` en el estado del store.
     *
     * @param operaciones - El nuevo valor para establecer en `operacionesMensualesExp`.
     */
    public setOperacionesMensualesExp(operaciones: string): void {
        this.update((state) => ({
        ...state,
        operacionesMensualesExp: operaciones,
        }));
    }

    /**
     * Actualiza la propiedad `operacionesMensualesImp` en el estado del store.
     *
     * @param operaciones - El nuevo valor para establecer en `operacionesMensualesImp`.
     */
    public setOperacionesMensualesImp(operaciones: string): void {
        this.update((state) => ({
        ...state,
        operacionesMensualesImp: operaciones,
        }));
    }

    /**
     * Actualiza la propiedad `numeroEmpleados` en el estado del store.
     *
     * @param numero - El nuevo valor para establecer en `numeroEmpleados`.
     */
    public setNumeroEmpleados(numero: string): void {
        this.update((state) => ({
        ...state,
        numeroEmpleados: numero,
        }));
    }

    /**
     * Actualiza la propiedad `superficieInstalacion` en el estado del store.
     *
     * @param superficie - El nuevo valor para establecer en `superficieInstalacion`.
     */
    public setSuperficieInstalacion(superficie: string): void {
        this.update((state) => ({
        ...state,
        superficieInstalacion: superficie,
        }));
    }


    /**
     * Actualiza la propiedad `opcion` en el estado del store.
     *
     * @param opcion - El nuevo valor para establecer en `opcion`.
     */
    public setOpcion(opcion: string): void {
        this.update((state) => ({
        ...state,
        opcion: opcion,
        }));
    }

    /**
     * Actualiza la propiedad `nombrePrograma` en el estado del store.
     *
     * @param nombre - El nuevo valor para establecer en `nombrePrograma`.
     */
    public setNombrePrograma(nombre: string): void {
        this.update((state) => ({
        ...state,
        nombrePrograma: nombre,
        }));
    }

    /**
     * Actualiza la propiedad `numeroDeRegistro` en el estado del store.
     *
     * @param numero - El nuevo valor para establecer en `numeroDeRegistro`.
     */
    public setNumeroDeRegistro(numero: string): void {
        this.update((state) => ({
        ...state,
        numeroDeRegistro: numero,
        }));
    }

    /**
     * Actualiza la propiedad `organismoCertificador` en el estado del store.
     *
     * @param organismo - El nuevo valor para establecer en `organismoCertificador`.
     */
    public setOrganismoCertificador(organismo: string): void {
        this.update((state) => ({
        ...state,
        organismoCertificador: organismo,
        }));
    }

    /**
     * Actualiza la propiedad `numeroPatente` en el estado del store.
     *
     * @param numero - El nuevo valor para establecer en `numeroPatente`.
     */
    public setNumeroPatente(numeroPatente: string): void {
        this.update((state) => ({
        ...state,
        numeroPatente: numeroPatente,
        }));
    }

    /**
     * Actualiza la propiedad `numeroRegistro` en el estado del store.
     *
     * @param numeroRegistro - El nuevo valor para establecer en `numeroRegistro`.
     */
    public setNumeroRegistro(numeroRegistro: string): void {
        this.update((state) => ({
        ...state,
        numeroRegistro: numeroRegistro,
        }));
    }

    /**
     * Actualiza la propiedad `nombreAgenteAduanal` en el estado del store.
     *
     * @param nombre - El nuevo valor para establecer en `nombreAgenteAduanal`.
     */
    public setNombreAgenteAduanal(nombre: string): void {
        this.update((state) => ({
        ...state,
        nombreAgenteAduanal: nombre,
        }));
    }
    /**
     * Actualiza la propiedad `numeroTrabajadoresIMSS` en el estado del store.
     *
     * @param numero - El nuevo valor para establecer en `numeroTrabajadoresIMSS`.
     */
    public setNumeroTrabajadoresIMSS(numero: string): void {
        this.update((state) => ({
        ...state,
        numeroTrabajadoresIMSS: numero,
        }));
    }
    /**
     * Actualiza la propiedad `numeroTrabajadoresContratistas` en el estado del store.
     *
     * @param numero - El nuevo valor para establecer en `numeroTrabajadoresContratistas`.
     */
    public setNumeroTrabajadoresContratistas(numero: string): void {
        this.update((state) => ({
        ...state,
        numeroTrabajadoresContratistas: numero,
        }));
    }

    /**
     * Actualiza la propiedad `serviciosAdicionales` en el estado del store.
     *
     * @param servicios - El nuevo valor para establecer en `serviciosAdicionales`.
     */
    public setServiciosAdicionales(servicios: string): void {
        this.update((state) => ({
        ...state,
        serviciosAdicionales: servicios,
        }));
    }
    /**
     * Actualiza la propiedad `indique` en el estado del store.
     *
     * @param indique - El nuevo valor para establecer en `indique`.
     */
    public setIndique(indique: string): void {
        this.update((state) => ({
        ...state,
        indique: indique,
        }));
    }
    

}
