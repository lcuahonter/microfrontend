import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { MostrarPartidas } from '@libs/shared/data-access-user/src';
import { PartidasDeLaMercanciaModelo } from '../../../shared/models/partidas-de-la-mercancia.model';

/**
 * Representa el estado de ImportacionesAgropecuariasState.
 * Es un objeto dinámico donde las claves son cadenas y los valores pueden ser de cualquier tipo.
 * 
 * @interface ImportacionesAgropecuariasState
 * @property {string} [key] - Las claves son cadenas que representan los nombres de los campos.
 * @property {any} [value] - Los valores pueden ser de cualquier tipo, dependiendo del campo.
 */
export interface ImportacionesAgropecuariasState {
    /**
     * Identificador numérico de la solicitud actual.
     */
    idSolicitud: number;
    /** Producto seleccionado en el trámite. */
    producto: string;

    /** Descripción del producto o mercancía. */
    descripcion: string;

    /** Fracción arancelaria asociada al producto. */
    fraccion: string;

    /** Cantidad de producto o mercancía. */
    cantidad: string;

    /** Valor de la partida en USD. */
    valorPartidaUSD: number | string;

    /** Unidad de medida del producto o mercancía. */
    unidadMedida: string;

    /** Solicitud asociada al trámite. */
    solicitud: string;

    /** Valor predeterminado del selector en el formulario. */
    defaultSelect: string;

    /** Valor predeterminado del producto en el formulario. */
    defaultProducto: string;

    /** Régimen seleccionado en el trámite. */
    regimen: string;

    /** Clasificación del régimen seleccionado. */
    clasificacion: string;

    /** Fila seleccionada en la tabla de partidas de mercancía. */
    filaSeleccionada: PartidasDeLaMercanciaModelo[];

    /** Cantidad de partidas de la mercancía. */
    cantidadPartidasDeLaMercancia: string;

    /** Fracción TIGIE asociada a las partidas de la mercancía. */
    fraccionTigiePartidasDeLaMercancia: string;

    /** Descripción de la fracción asociada a las partidas de la mercancía. */
    fraccionDescripcionPartidasDeLaMercancia: string;

    /** Valor de la partida en USD para las partidas de la mercancía. */
    valorPartidaUSDPartidasDeLaMercancia: string;

    /** Descripción de las partidas de la mercancía. */
    descripcionPartidasDeLaMercancia: string;

    /** Valor de la factura en USD. */
    valorFacturaUSD: string;

    /** Bloque asociado al trámite. */
    bloque: string;

    /** Uso específico del producto o mercancía. */
    usoEspecifico: string;

    /** Justificación para la importación o exportación. */
    justificacionImportacionExportacion: string;

    /** Observaciones adicionales relacionadas con el trámite. */
    observaciones: string;

    /** Entidad federativa seleccionada en el trámite. */
    entidad: string;

    /** Representación federal seleccionada en el trámite. */
    representacion: string;

    /** Indica si se debe mostrar la tabla de partidas de mercancía. */
    mostrarTabla: boolean;

    /** Arreglo de partidas a mostrar en la tabla. */
    mostrarPartidas: MostrarPartidas[];
    /**
     * Formulario para modificar las partidas de la mercancía.
     */
    modificarPartidasDelaMercanciaForm: {
        /** Cantidad de partidas de la mercancía */
        cantidadPartidasDeLaMercancia: string;
        /** Valor en USD de las partidas de la mercancía */
        valorPartidaUSDPartidasDeLaMercancia: string;
        /** Descripción de las partidas de la mercancía */
        descripcionPartidasDeLaMercancia: string;
        /**
         * Clave de la fracción arancelaria TIGIE correspondiente a la partida
         * de la mercancía. Este valor representa la fracción seleccionada dentro
         * del catálogo TIGIE.
         */
        fraccionTigiePartidasDeLaMercancia: string;
        /**
         * Descripción asociada a la fracción arancelaria TIGIE dentro de
         * *Partidas de la mercancía*. Se utiliza para mostrar el detalle
         * descriptivo de la fracción seleccionada.
         */
        fraccionDescripcionPartidasDeLaMercancia: string;
    };
    /**   
     * Cantidad total de las partidas de la mercancía.
     */
    cantidadTotal: string;
    /**   
     * Valor total en USD de las partidas de la mercancía.
     */
    valorTotalUSD: string;
    /**   
      * Fechas seleccionadas en el formulario.
      */
    fechasSeleccionadas: string[];

    /** Lista de partidas de la mercancía asociadas al trámite. */
    tableBodyData: PartidasDeLaMercanciaModelo[];
}

/**
 * Crea el estado inicial para ImportacionesAgropecuariasState.
 * @returns {ImportacionesAgropecuariasState} Un objeto vacío que representa el estado inicial del estado de SolicitudDeRegistroTpl120101.
 */
export function createInitialState(): ImportacionesAgropecuariasState {
    return {
        idSolicitud: 0,
        filaSeleccionada: [],
        mostrarTabla: false,
        solicitud: '',
        fraccion: '',
        defaultSelect: 'TISOL.I',
        producto: 'CONDMER.N',
        descripcion: '',
        cantidad: '',
        valorPartidaUSD: '',
        unidadMedida: '',
        defaultProducto: 'CONDMER.N',
        regimen: '',
        clasificacion: '',
        cantidadPartidasDeLaMercancia: '',
        fraccionTigiePartidasDeLaMercancia: '',
        fraccionDescripcionPartidasDeLaMercancia: '',
        valorPartidaUSDPartidasDeLaMercancia: '',
        descripcionPartidasDeLaMercancia: '',
        valorFacturaUSD: '',
        bloque: '',
        usoEspecifico: '',
        justificacionImportacionExportacion: '',
        observaciones: '',
        entidad: '',
        representacion: '',
        mostrarPartidas: [],
        modificarPartidasDelaMercanciaForm: {
            cantidadPartidasDeLaMercancia: '',
            valorPartidaUSDPartidasDeLaMercancia: '',
            descripcionPartidasDeLaMercancia: '',
            fraccionTigiePartidasDeLaMercancia: '',
            fraccionDescripcionPartidasDeLaMercancia: '',
        },
        cantidadTotal: '',
        valorTotalUSD: '',
        fechasSeleccionadas: [],
        tableBodyData: [],
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
 * Configuración del store para Tramite130103.
 * 
 * @decorator StoreConfig
 * @property {string} name - Nombre del store, utilizado para identificarlo.
 * @property {boolean} resettable - Indica si el estado del store puede ser reiniciado.
 */
@StoreConfig({ name: 'ImportacionesAgropecuarias', resettable: true })

export class ImportacionesAgropecuariasStore extends Store<ImportacionesAgropecuariasState> {

    /**
     * Constructor de la clase ImportacionesAgropecuariasStore.
     * 
     * Este constructor inicializa el estado del store utilizando la función `createInitialState`.
     * La función `createInitialState` devuelve un objeto vacío que representa el estado inicial.
     */
    constructor() {
        super(createInitialState());
    }

    /**
   * Set a value dynamically in the store by field name.
   * @param fieldName The name of the field to update.
   * @param value The value to set.
   */
    public setDynamicFieldValue(fieldName: string, value: string | number | boolean | null | undefined): void {
        this.update((state) => ({
            ...state,
            [fieldName]: value,
        }));
    }

    /**
       * Actualiza el estado del store con los valores proporcionados.
       * Valores a actualizar en el estado.
       */
    public actualizarEstado(valores: Partial<ImportacionesAgropecuariasState>): void {
        this.update((state) => ({
            ...state,
            ...valores,
        }));
    }

}