/**
 * Store de gestión del estado para el trámite 290101 de exportadores de café.
 *
 * Este archivo contiene la implementación del store de Akita que administra el estado completo
 * del proceso de aplicación de exportadores de café, incluyendo formularios de solicitud,
 * regiones, beneficios, bodegas y información de exportación de café.
 *
 * Utiliza el patrón de store de Akita para mantener un estado centralizado y reactivo
 * que puede ser observado por los componentes de la aplicación.
 *
 * @fileoverview Store principal para el trámite 290101 - Exportadores de Café
 * @module TramiteStore
 * @version 1.0.0
 * @author Sistema VUCEM 3.0
 */
import { Injectable } from '@angular/core';

import { Store, StoreConfig } from '@datorama/akita';

import {
    BeneficiosFormaInt,
    BodegasFormaInt,
    CafExportFormaInt,
  DatosSolicitudFormaInt,
  RegionFormaInt
} from '../modelos/datos-de-interfaz.model';

import {
    BeneficiosInfo,
    BodegasInfo,
    CafeExporacionInfo,
    RegionesInfo,
} from '../modelos/cafe-exportadores.model';


/**
 * Interfaz que define la estructura completa del estado del trámite 290101.
 *
 * Esta interfaz representa el estado global del trámite de exportadores de café,
 * incluyendo todos los formularios individuales y las tablas de datos que componen
 * el proceso completo de solicitud.
 *
 * Cada propiedad del estado mantiene información específica de diferentes secciones
 * del trámite: solicitud principal, regiones, beneficios, bodegas y café de exportación.
 *
 * @interface TramiteState
 * @since 1.0.0
 */
export interface TramiteState {
    /**
     * Estado del formulario principal de solicitud del trámite.
     *
     * Contiene información básica como clave del padrón, observaciones,
     * requerimientos de inspección e información confidencial.
     *
     * @property {DatosSolicitudFormaInt} SolicitudState
     * @memberof TramiteState
     */
    SolicitudState: DatosSolicitudFormaInt;

    /**
     * Estado del formulario de captura de regiones de compra.
     *
     * Almacena información sobre estados, productos de café, descripciones
     * de regiones de compra, tipos de café y volúmenes.
     *
     * @property {RegionFormaInt} RegionFormatState
     * @memberof TramiteState
     */
    RegionFormatState: RegionFormaInt;

    /**
     * Colección de registros de regiones procesadas y almacenadas.
     *
     * Mantiene un array con todas las regiones de compra que han sido
     * capturadas y validadas en el formulario correspondiente.
     *
     * @property {RegionesInfo[]} regionesTabla
     * @memberof TramiteState
     */
    regionesTabla: RegionesInfo[];

    /**
     * Colección de registros de beneficios procesados y almacenados.
     *
     * Contiene información detallada de todas las instalaciones de beneficio
     * registradas para el exportador de café.
     *
     * @property {BeneficiosInfo[]} beneficiosTabla
     * @memberof TramiteState
     */
    beneficiosTabla: BeneficiosInfo[];

    /**
     * Colección de registros de bodegas procesadas y almacenadas.
     *
     * Mantiene información sobre todas las instalaciones de almacenamiento
     * asociadas al exportador.
     *
     * @property {BodegasInfo[]} bodegasTabla
     * @memberof TramiteState
     */
    bodegasTabla: BodegasInfo[];

    /**
     * Colección de registros de café de exportación procesados.
     *
     * Contiene información específica sobre los tipos de café que serán
     * exportados, incluyendo descripciones, clasificaciones y concentraciones.
     *
     * @property {CafeExporacionInfo[]} cafeExportacionTabla
     * @memberof TramiteState
     */
    cafeExportacionTabla: CafeExporacionInfo[];

    /**
     * Estado del formulario de captura de datos de beneficios.
     *
     * Almacena información en proceso sobre instalaciones de beneficio,
     * incluyendo datos de ubicación, capacidades y características operativas.
     *
     * @property {BeneficiosFormaInt} BeneficiosFormaState
     * @memberof TramiteState
     */
    BeneficiosFormaState: BeneficiosFormaInt;

    /**
     * Estado del formulario de captura de datos de bodegas.
     *
     * Contiene información en proceso sobre instalaciones de almacenamiento,
     * incluyendo ubicación, propiedad y capacidades de almacenaje.
     *
     * @property {BodegasFormaInt} BodegasFormaState
     * @memberof TramiteState
     */
    BodegasFormaState: BodegasFormaInt;

    /**
     * Estado del formulario de captura de información de café para exportación.
     *
     * Almacena datos específicos sobre los productos de café que serán exportados,
     * incluyendo descripciones, clasificaciones y porcentajes de concentración.
     *
     * @property {CafExportFormaInt} CafeExportFormState
     * @memberof TramiteState
     */
    CafeExportFormState: CafExportFormaInt;
}

/**
 * Función factory para crear el estado inicial del trámite 290101.
 *
 * Esta función inicializa todos los campos del estado con valores predeterminados
 * apropiados para comenzar un nuevo proceso de solicitud de exportador de café.
 *
 * Todos los formularios se inicializan con valores vacíos o cero según corresponda,
 * y todas las tablas de datos se inicializan como arrays vacíos.
 *
 * @function createInitialState
 * @returns {TramiteState} Objeto de estado inicial con todos los valores predeterminados
 * @since 1.0.0
 * @example
 * const initialState = createInitialState();
 * console.log(initialState.SolicitudState.claveDelPadron); // ''
 */
export function createInitialState(): TramiteState {
    return {
        SolicitudState: {
            /**
             * @property {string} claveDelPadron
             * Clave única del padrón del exportador.
             */
            claveDelPadron: '',

            /**
             * @property {string} observaciones
             * Observaciones adicionales para la solicitud.
             */
            observaciones: '',

            /**
             * @property {string} requiereInspeccionInmediata
             * Indicador de requerimiento de inspección inmediata.
             */
            requiereInspeccionInmediata: '',

            /**
             * @property {number} informacionConfidencial
             * Indicador numérico de información confidencial.
             */
            informacionConfidencial: 0
        },
        RegionFormatState: {
            /**
             * @property {string} estado
             * Estado donde se realiza la compra de café.
             */
            estado: '',

            /**
             * @property {string} productoCafe
             * Tipo de producto de café.
             */
            productoCafe: '',

            /**
             * @property {string} descRegionCompra
             * Descripción de la región de compra.
             */
            descRegionCompra: '',

            /**
             * @property {string} descripTipoCafe
             * Descripción del tipo de café.
             */
            descripTipoCafe: '',

            /**
             * @property {number} volumen
             * Volumen de café en la región.
             */
            volumen: 0
        },
        BeneficiosFormaState: {
            /**
             * @property {string} razonSocial
             * Razón social del beneficio.
             */
            razonSocial: '',

            /**
             * @property {string} propAlquil
             * Indicador de propiedad o alquiler.
             */
            propAlquil: '',

            /**
             * @property {string} calle
             * Dirección - calle del beneficio.
             */
            calle: '',

            /**
             * @property {number} numeroExterior
             * Número exterior de la dirección.
             */
            numeroExterior: 0,

            /**
             * @property {number} numeroInterior
             * Número interior de la dirección.
             */
            numeroInterior: 0,

            /**
             * @property {string} colonia
             * Colonia donde se ubica el beneficio.
             */
            colonia: '',

            /**
             * @property {number} estado
             * Código del estado donde se ubica.
             */
            estado: 0,

            /**
             * @property {number} codigoPostal
             * Código postal de la ubicación.
             */
            codigoPostal: 0,

            /**
             * @property {number} capacidadAlmacenaje
             * Capacidad total de almacenaje.
             */
            capacidadAlmacenaje: 0,

            /**
             * @property {number} volumenAlmacenaje
             * Volumen actual de almacenaje.
             */
            volumenAlmacenaje: 0
        },
        BodegasFormaState: {
            /**
             * @property {string} razonSocial
             * Razón social de la bodega.
             */
            razonSocial: '',

            /**
             * @property {string} propAlquil
             * Indicador de propiedad o alquiler.
             */
            propAlquil: '',

            /**
             * @property {string} calle
             * Dirección - calle de la bodega.
             */
            calle: '',

            /**
             * @property {number} numeroExterior
             * Número exterior de la dirección.
             */
            numeroExterior: 0,

            /**
             * @property {number} numeroInterior
             * Número interior de la dirección.
             */
            numeroInterior: 0,

            /**
             * @property {string} colonia
             * Colonia donde se ubica la bodega.
             */
            colonia: '',

            /**
             * @property {number} estado
             * Código del estado donde se ubica.
             */
            estado: 0,

            /**
             * @property {number} codigoPostal
             * Código postal de la ubicación.
             */
            codigoPostal: 0,

            /**
             * @property {number} capacidadAlmacenaje
             * Capacidad total de almacenaje.
             */
            capacidadAlmacenaje: 0
        },
        CafeExportFormState: {
            /**
             * @property {string} descripcionMercancia
             * Descripción detallada de la mercancía de café.
             */
            descripcionMercancia: '',

            /**
             * @property {string} clasificacion
             * Clasificación del tipo de café.
             */
            clasificacion: '',

            /**
             * @property {number} porcentajeConcentracion
             * Porcentaje de concentración del café.
             */
            porcentajeConcentracion: 0
        },
        /**
         * Arrays de datos inicializados como colecciones vacías.
         * Estas propiedades almacenarán los registros procesados de cada sección.
         */

        /**
         * @property {RegionesInfo[]} regionesTabla
         * Colección vacía para almacenar regiones procesadas.
         */
        regionesTabla: [],

        /**
         * @property {BeneficiosInfo[]} beneficiosTabla
         * Colección vacía para almacenar beneficios procesados.
         */
        beneficiosTabla: [],

        /**
         * @property {BodegasInfo[]} bodegasTabla
         * Colección vacía para almacenar bodegas procesadas.
         */
        bodegasTabla: [],

        /**
         * @property {CafeExporacionInfo[]} cafeExportacionTabla
         * Colección vacía para almacenar información de café de exportación.
         */
        cafeExportacionTabla: []
    };
}

/**
 * Store principal para la gestión del estado del trámite 290101 - Exportadores de Café.
 *
 * Esta clase extiende el Store de Akita y proporciona métodos especializados para
 * la gestión del estado del proceso de solicitud de exportadores de café.
 *
 * Incluye funcionalidades para:
 * - Actualización de formularios individuales (solicitud, regiones, beneficios, bodegas, café)
 * - Gestión de colecciones de datos (agregar y actualizar tablas)
 * - Mantenimiento del estado reactivo para toda la aplicación
 *
 * El store utiliza el patrón inmutable de Akita para garantizar la predictibilidad
 * y rastreabilidad de los cambios de estado.
 *
 * @class TramiteStore
 * @extends {Store<TramiteState>}
 * @since 1.0.0
 * @example
 * // Inyectar el store en un componente
 * constructor(private tramiteStore: TramiteStore) {}
 *
 * // Actualizar el estado de solicitud
 * this.tramiteStore.setSolicitudTramite(nuevasSolicitudDatos);
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'cafe-exportadores' })
export class TramiteStore extends Store<TramiteState> {
    /**
     * Constructor de la clase TramiteStore.
     *
     * Inicializa el store con el estado predeterminado utilizando la función
     * createInitialState() e invoca el constructor padre de Akita Store.
     *
     * @constructor
     * @memberof TramiteStore
     * @since 1.0.0
     */
    constructor() {
        super(createInitialState());
    }

    /**
     * Actualiza el estado del formulario principal de solicitud.
     *
     * Este método reemplaza completamente el estado actual de SolicitudState
     * con los nuevos datos proporcionados, manteniendo la inmutabilidad del estado.
     *
     * @method setSolicitudTramite
     * @param {DatosSolicitudFormaInt} SolicitudState - Objeto con los datos actualizados del formulario de solicitud
     * @returns {void}
     * @memberof TramiteStore
     * @since 1.0.0
     * @example
     * const nuevosDatos = {
     *   claveDelPadron: 'EXP001',
     *   observaciones: 'Solicitud urgente',
     *   requiereInspeccionInmediata: 'Si',
     *   informacionConfidencial: 1
     * };
     * this.tramiteStore.setSolicitudTramite(nuevosDatos);
     */
    public setSolicitudTramite(SolicitudState: DatosSolicitudFormaInt): void {
        this.update((state) => ({
            ...state,
            SolicitudState,
        }));
    }

    /**
     * Actualiza el estado del formulario de regiones de compra.
     *
     * Reemplaza el estado actual de RegionFormatState con los nuevos datos,
     * incluyendo información sobre estados, productos de café, descripciones
     * de regiones y volúmenes de compra.
     *
     * @method setRegionTramite
     * @param {RegionFormaInt} RegionFormatState - Objeto con los datos actualizados del formulario de regiones
     * @returns {void}
     * @memberof TramiteStore
     * @since 1.0.0
     * @example
     * const regionDatos = {
     *   estado: 'Chiapas',
     *   productoCafe: 'Arabica',
     *   descRegionCompra: 'Región montañosa',
     *   descripTipoCafe: 'Café orgánico',
     *   volumen: 1000
     * };
     * this.tramiteStore.setRegionTramite(regionDatos);
     */
    public setRegionTramite(RegionFormatState: RegionFormaInt): void {
        this.update((state) => ({
            ...state,
            RegionFormatState,
        }));
    }

    /**
     * Limpia el estado del formulario de regiones, restaurándolo a sus valores iniciales.
     *
     * Este método reestablece todos los campos del formulario de regiones a sus valores
     * por defecto, útil cuando se desea limpiar el formulario antes de agregar una nueva entrada.
     *
     * @method clearRegionTramite
     * @returns {void}
     * @memberof TramiteStore
     * @since 1.0.0
     * @example
     * // Limpia el formulario de regiones
     * this.tramiteStore.clearRegionTramite();
     */
    public clearRegionTramite(): void {
        const INITIAL_STATE = createInitialState();
        this.update((state) => ({
            ...state,
            RegionFormatState: INITIAL_STATE.RegionFormatState,
        }));
    }


    public clearBeneficiosTramite(): void {
        const INITIAL_STATE = createInitialState();
        this.update((state) => ({
            ...state,
            BeneficiosFormaState: INITIAL_STATE.BeneficiosFormaState,
        }));
    }

    /**
     * Actualiza el estado del formulario de beneficios.
     *
     * Reemplaza el estado actual de BeneficiosFormaState con los nuevos datos,
     * incluyendo información sobre instalaciones de beneficio, ubicación,
     * capacidades de almacenaje y datos de propiedad.
     *
     * @method setBeneficiosTramite
     * @param {BeneficiosFormaInt} BeneficiosFormaState - Objeto con los datos actualizados del formulario de beneficios
     * @returns {void}
     * @memberof TramiteStore
     * @since 1.0.0
     * @example
     * const beneficiosDatos = {
     *   razonSocial: 'Beneficio San Juan S.A.',
     *   propAlquil: 'Propio',
     *   calle: 'Av. Principal 123',
     *   capacidadAlmacenaje: 5000,
     *   volumenAlmacenaje: 2500
     * };
     * this.tramiteStore.setBeneficiosTramite(beneficiosDatos);
     */
    public setBeneficiosTramite(BeneficiosFormaState: BeneficiosFormaInt): void {
        this.update((state) => ({
            ...state,
            BeneficiosFormaState,
        }));
    }

    /**
     * Actualiza el estado del formulario de bodegas.
     *
     * Reemplaza el estado actual de BodegasFormaState con los nuevos datos,
     * incluyendo información sobre instalaciones de almacenamiento, ubicación,
     * capacidades y datos de propiedad.
     *
     * @method setBodegasTramite
     * @param {BodegasFormaInt} BodegasFormaState - Objeto con los datos actualizados del formulario de bodegas
     * @returns {void}
     * @memberof TramiteStore
     * @since 1.0.0
     * @example
     * const bodegasDatos = {
     *   razonSocial: 'Almacenes del Sur S.A.',
     *   propAlquil: 'Alquilado',
     *   calle: 'Calle Industrial 456',
     *   capacidadAlmacenaje: 10000
     * };
     * this.tramiteStore.setBodegasTramite(bodegasDatos);
     */
    public setBodegasTramite(BodegasFormaState: BodegasFormaInt): void {
        this.update((state) => ({
            ...state,
            BodegasFormaState,
        }));
    }

    /**
     * Limpia el estado del formulario de bodegas, restaurándolo a sus valores iniciales.
     *
     * Este método reestablece todos los campos del formulario de bodegas a sus valores
     * por defecto, útil cuando se desea limpiar el formulario antes de agregar una nueva entrada.
     *
     * @method clearBodegasTramite
     * @returns {void}
     * @memberof TramiteStore
     * @since 1.0.0
     * @example
     * // Limpia el formulario de bodegas
     * this.tramiteStore.clearBodegasTramite();
     */
    public clearBodegasTramite(): void {
        const INITIAL_STATE = createInitialState();
        this.update((state) => ({
            ...state,
            BodegasFormaState: INITIAL_STATE.BodegasFormaState,
        }));
    }

    /**
     * Actualiza el estado del formulario de café de exportación.
     *
     * Reemplaza el estado actual de CafeExportFormState con los nuevos datos,
     * incluyendo información específica sobre los productos de café que serán
     * exportados, clasificaciones y concentraciones.
     *
     * @method setCafExportTramite
     * @param {CafExportFormaInt} CafeExportFormState - Objeto con los datos actualizados del formulario de café de exportación
     * @returns {void}
     * @memberof TramiteStore
     * @since 1.0.0
     * @example
     * const cafeDatos = {
     *   descripcionMercancia: 'Café verde arabica especial',
     *   clasificacion: 'Grado 1',
     *   porcentajeConcentracion: 98.5
     * };
     * this.tramiteStore.setCafExportTramite(cafeDatos);
     */
    public setCafExportTramite(CafeExportFormState: CafExportFormaInt): void {
        this.update((state) => ({
            ...state,
            CafeExportFormState,
        }));
    }

    /**
     * Limpia el estado del formulario de café de exportación, restaurándolo a sus valores iniciales.
     *
     * Este método reestablece todos los campos del formulario de café de exportación a sus valores
     * por defecto, útil cuando se desea limpiar el formulario antes de agregar una nueva entrada.
     *
     * @method clearCafExportTramite
     * @returns {void}
     * @memberof TramiteStore
     * @since 1.0.0
     * @example
     * // Limpia el formulario de café de exportación
     * this.tramiteStore.clearCafExportTramite();
     */
    public clearCafExportTramite(): void {
        const INITIAL_STATE = createInitialState();
        this.update((state) => ({
            ...state,
            CafeExportFormState: INITIAL_STATE.CafeExportFormState,
        }));
    }
    /**
     * Agrega nuevos registros a la tabla de regiones de compra.
     *
     * Este método concatena los nuevos datos de regiones al array existente,
     * manteniendo los registros previos. Utiliza el patrón spread operator
     * para garantizar la inmutabilidad del estado.
     *
     * @method setRegionesTabla
     * @param {RegionesInfo[]} regionesTabla - Array de nuevos registros de regiones a agregar
     * @returns {void}
     * @memberof TramiteStore
     * @since 1.0.0
     * @example
     * const nuevasRegiones = [
     *   { estado: 'Chiapas', producto: 'Arabica', volumen: 1000 },
     *   { estado: 'Veracruz', producto: 'Robusta', volumen: 800 }
     * ];
     * this.tramiteStore.setRegionesTabla(nuevasRegiones);
     */
    public setRegionesTabla(regionesTabla: RegionesInfo[]): void {
        this.update((state) => ({
            ...state,
            regionesTabla: [...state.regionesTabla, ...regionesTabla],
        }));
    }
    
    /**
     * Agrega nuevos registros a la tabla de beneficios.
     *
     * Concatena los nuevos datos de beneficios al array existente,
     * preservando los registros anteriores y manteniendo la inmutabilidad
     * del estado mediante el uso de spread operators.
     *
     * @method setBeneficiosTabla
     * @param {BeneficiosInfo[]} beneficiosTabla - Array de nuevos registros de beneficios a agregar
     * @returns {void}
     * @memberof TramiteStore
     * @since 1.0.0
     * @example
     * const nuevosBeneficios = [
     *   { razonSocial: 'Beneficio Norte', capacidad: 5000, ubicacion: 'Chiapas' }
     * ];
     * this.tramiteStore.setBeneficiosTabla(nuevosBeneficios);
     */
   
    public setBeneficiosTabla(beneficiosTabla: BeneficiosInfo[]): void {
        this.update((state) => ({
            ...state,
            beneficiosTabla: [...state.beneficiosTabla, ...beneficiosTabla],
        }));
    }
    /**
     * Agrega nuevos registros a la tabla de bodegas.
     *
     * Concatena los nuevos datos de bodegas al array existente,
     * manteniendo los registros previos y garantizando la inmutabilidad
     * del estado a través del patrón spread operator.
     *
     * @method setBodegasTabla
     * @param {BodegasInfo[]} bodegasTabla - Array de nuevos registros de bodegas a agregar
     * @returns {void}
     * @memberof TramiteStore
     * @since 1.0.0
     * @example
     * const nuevasBodegas = [
     *   { razonSocial: 'Almacenes Central', capacidad: 8000, propiedad: 'Propio' }
     * ];
     * this.tramiteStore.setBodegasTabla(nuevasBodegas);
     */
    public setBodegasTabla(bodegasTabla: BodegasInfo[]): void {
        this.update((state) => ({
            ...state,
            bodegasTabla: [...state.bodegasTabla, ...bodegasTabla],
        }));}

    /**
     * Agrega nuevos registros a la tabla de café de exportación.
     *
     * Concatena los nuevos datos de café de exportación al array existente,
     * preservando los registros anteriores y manteniendo la inmutabilidad
     * del estado mediante el uso de spread operators.
     *
     * @method setCafeExportacionTabla
     * @param {CafeExporacionInfo[]} cafeExportacionTabla - Array de nuevos registros de café de exportación a agregar
     * @returns {void}
     * @memberof TramiteStore
     * @since 1.0.0
     * @example
     * const nuevosCafes = [
     *   { descripcion: 'Café especial', clasificacion: 'Premium', concentracion: 99.2 }
     * ];
     * this.tramiteStore.setCafeExportacionTabla(nuevosCafes);
     */
    public setCafeExportacionTabla(cafeExportacionTabla: CafeExporacionInfo[]): void {
        this.update((state) => ({
            ...state,
            cafeExportacionTabla: [...state.cafeExportacionTabla, ...cafeExportacionTabla],
        }));
    }
    /**
     * Reemplaza completamente la tabla de regiones de compra.
     *
     * A diferencia del método setRegionesTabla que agrega datos, este método
     * reemplaza todo el array existente con los nuevos datos proporcionados.
     * Útil para operaciones de actualización masiva o sincronización completa.
     *
     * @method updateRegionesTabla
     * @param {RegionesInfo[]} regionesTabla - Array completo de registros de regiones que reemplazará los existentes
     * @returns {void}
     * @memberof TramiteStore
     * @since 1.0.0
     * @example
     * const regionesActualizadas = [
     *   { estado: 'Chiapas', producto: 'Arabica', volumen: 1200 },
     *   { estado: 'Oaxaca', producto: 'Robusta', volumen: 900 }
     * ];
     * this.tramiteStore.updateRegionesTabla(regionesActualizadas);
     */
    public updateRegionesTabla(regionesTabla: RegionesInfo[]): void {
        this.update((state) => ({
            ...state,
            regionesTabla,
        }));
    }

    /**
     * Reemplaza completamente la tabla de beneficios.
     *
     * Reemplaza todo el array existente de beneficios con los nuevos datos
     * proporcionados, permitiendo una actualización completa de la colección.
     *
     * @method updateBeneficiosTabla
     * @param {BeneficiosInfo[]} beneficiosTabla - Array completo de registros de beneficios que reemplazará los existentes
     * @returns {void}
     * @memberof TramiteStore
     * @since 1.0.0
     * @example
     * const beneficiosActualizados = [
     *   { razonSocial: 'Beneficio Actualizado', capacidad: 6000 }
     * ];
     * this.tramiteStore.updateBeneficiosTabla(beneficiosActualizados);
     */
    public updateBeneficiosTabla(beneficiosTabla: BeneficiosInfo[]): void {
        this.update((state) => ({
            ...state,
            beneficiosTabla,
        }));
    }

    /**
     * Reemplaza completamente la tabla de bodegas.
     *
     * Sustituye todo el array existente de bodegas con los nuevos datos,
     * proporcionando una forma de actualización masiva para la colección
     * de instalaciones de almacenamiento.
     *
     * @method updateBodegasTabla
     * @param {BodegasInfo[]} bodegasTabla - Array completo de registros de bodegas que reemplazará los existentes
     * @returns {void}
     * @memberof TramiteStore
     * @since 1.0.0
     * @example
     * const bodegasActualizadas = [
     *   { razonSocial: 'Nueva Bodega Central', capacidad: 12000 }
     * ];
     * this.tramiteStore.updateBodegasTabla(bodegasActualizadas);
     */
    public updateBodegasTabla(bodegasTabla: BodegasInfo[]): void {
        this.update((state) => ({
            ...state,
            bodegasTabla,
        }));
    }

    /**
     * Reemplaza completamente la tabla de café de exportación.
     *
     * Sustituye todo el array existente de información de café de exportación
     * con los nuevos datos, permitiendo una actualización completa de los
     * productos de café registrados para exportación.
     *
     * @method updateCafeExportacionTabla
     * @param {CafeExporacionInfo[]} cafeExportacionTabla - Array completo de registros de café de exportación que reemplazará los existentes
     * @returns {void}
     * @memberof TramiteStore
     * @since 1.0.0
     * @example
     * const cafeActualizado = [
     *   { descripcion: 'Café Premium Actualizado', clasificacion: 'AAA', concentracion: 99.8 }
     * ];
     * this.tramiteStore.updateCafeExportacionTabla(cafeActualizado);
     */
    public updateCafeExportacionTabla(cafeExportacionTabla: CafeExporacionInfo[]): void {
        this.update((state) => ({
            ...state,
            cafeExportacionTabla,
        }));
    }
}