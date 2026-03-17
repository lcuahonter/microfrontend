/**
 * Store de estado para el trámite 32516 utilizando Akita para la gestión del estado.
 *
 * Este archivo contiene la configuración del store de estado que administra los datos del trámite 32516,
 * incluyendo la información de solicitud y mercancías. Utiliza el patrón de state management de Akita
 * para proporcionar una gestión reactiva y eficiente del estado de la aplicación.
 *
 * @module TramiteStore
 */
import { Store, StoreConfig } from '@datorama/akita';
import { HechosDatosTabla } from '../modelos/acta-de-hechos.model';
import { Injectable } from '@angular/core';

/**
 * Interfaz que define la estructura del estado del trámite 32516.
 *
 * Esta interfaz representa el estado completo del trámite, incluyendo los datos de la solicitud
 * y las mercancías asociadas. Se utiliza como tipo base para el store de Akita.
 *
 * @interface TramiteState
 */
export interface TramiteState {
    /** Primera descripción genérica del trámite */
    descripcionGenerica1: string,
    /** Segunda descripción genérica del trámite */
    descripcionGenerica2: string,
    /** Tercera descripción genérica del trámite */
    descripcionGenerica3: string,
    /** Indicador de capacidad de almacenamiento disponible */
    capacidadAlmacenamiento: boolean,
    /** Indicador de cantidad de bienes disponible */
    cantidadBienes: boolean,
    /** Array opcional de datos de la tabla de hechos */
    tableDatos?: HechosDatosTabla[];
}

/**
 * Función que crea el estado inicial del trámite 32516.
 *
 * Inicializa el estado con valores predeterminados para ambos formularios (solicitud y mercancías).
 * Esta función se utiliza durante la construcción del store para establecer el estado base.
 *
 * @function createInitialState
 * @returns {TramiteState} Estado inicial del trámite con valores por defecto.
 */
export function createInitialState(): TramiteState {
    return {
        /** Valor inicial vacío para la primera descripción genérica */
        descripcionGenerica1: '',
        /** Valor inicial vacío para la segunda descripción genérica */
        descripcionGenerica2: '',
        /** Valor inicial vacío para la tercera descripción genérica */
        descripcionGenerica3: '',
        /** Estado inicial deshabilitado para capacidad de almacenamiento */
        capacidadAlmacenamiento: false,
        /** Estado inicial deshabilitado para cantidad de bienes */
        cantidadBienes: false,
        /** Array inicial vacío para los datos de la tabla de hechos */
        tableDatos: []
    };
}

/**
 * Store de estado para el trámite 32516 que extiende de Akita Store.
 *
 * Esta clase administra el estado del trámite utilizando el patrón de state management de Akita.
 * Proporciona métodos para actualizar el estado de la solicitud y las mercancías de manera reactiva.
 * El store está configurado con el nombre 'acta-de-hechos' y se inyecta como singleton en la aplicación.
 *
 * @class TramiteStore
 * @extends {Store<TramiteState>}
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'acta-de-hechos' })
export class TramiteStore extends Store<TramiteState> {
    /**
     * Constructor del TramiteStore.
     *
     * Inicializa el estado del store con los valores predeterminados definidos en `createInitialState`.
     * Se invoca automáticamente cuando se inyecta el servicio por primera vez.
     *
     * @constructor
     */
    constructor() {
        super(createInitialState());
    }

    /**
     * Actualiza el estado de la solicitud del trámite.
     *
     * Este método permite actualizar parcial o completamente el estado del formulario de solicitud.
     * Utiliza el patrón inmutable de Akita para garantizar la integridad del estado.
     *
     * @method setSolicitudTramite
     * @param {SolicitudForm} SolicitudState - Datos actualizados del formulario de solicitud.
     * @returns {void}
     */
    public setDescripcionGenerica1(descripcionGenerica1: string): void {
        this.update((state) => ({
            ...state,
            descripcionGenerica1,
        }));
    }

    /**
     * Actualiza el estado de las mercancías del trámite.
     *
     * Este método permite actualizar parcial o completamente el estado del formulario de mercancías.
     * Utiliza el patrón inmutable de Akita para garantizar la integridad del estado.
     *
     * @method setMercanciaTramite
     * @param {MercanciaForm} MercanciaState - Datos actualizados del formulario de mercancías.
     * @returns {void}
     */
    public setDescripcionGenerica2(descripcionGenerica2: string): void {
        this.update((state) => ({
            ...state,
            descripcionGenerica2,
        }));
    }


    /**
     * Actualiza completamente el array de datos de la tabla de hechos.
     *
     * Este método permite reemplazar todo el array de datos de hechos.
     * Utiliza el patrón inmutable de Akita para garantizar la integridad del estado.
     *
     * @method setHechosTableData
     * @param {HechosInfo[]} hechosData - Array completo de datos de hechos.
     * @returns {void}
     */
    public setDescripcionGenerica3(descripcionGenerica3: string): void {
        this.update((state) => ({
            ...state,
            descripcionGenerica3,
        }));
    }

    /**
     * Establece el indicador de capacidad de almacenamiento para el trámite.
     *
     * @param capacidadAlmacenamiento - Valor booleano que indica si la capacidad de almacenamiento está disponible o habilitada
     * @returns void
     */
    public setCapacidadAlmacenamiento(capacidadAlmacenamiento: boolean): void {
        this.update((state) => ({
            ...state,
            capacidadAlmacenamiento,
        }));
    }

    /**
     * Establece el indicador de cantidad de bienes para el trámite.
     *
     * @param cantidadBienes - Valor booleano que indica si la cantidad de bienes está disponible o habilitada
     * @returns void
     */
    public setCantidadBienes(cantidadBienes: boolean): void {
        this.update((state) => ({
            ...state,
            cantidadBienes,
        }));
    }

    /**
     * Actualiza completamente el array de datos de la tabla de hechos.
     *
     * @param tableDatos - Array completo de datos de hechos
     * @returns void
     */
    public setHechosTablaDatos(tableDatos: HechosDatosTabla[]): void {
        this.update((state) => ({
            ...state, 
            tableDatos,
        }));
    }
}