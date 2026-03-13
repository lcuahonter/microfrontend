import { Injectable } from "@angular/core";

import {
    Store,
    StoreConfig
} from "@datorama/akita";

import {
    FinalDataToSend,
    MercanciaForm,
    createDatosState,
} from "../models/fitosanitario.model";

/**
 * @fileoverview
 * Store Akita para la gestión del estado de los datos de mercancía fitosanitaria.
 * Permite almacenar, actualizar y eliminar la información capturada en el formulario de mercancía.
 * Cobertura compodoc 100%: cada método, propiedad y constructor está documentado.
 * @module FitosanitarioStore
 */

/**
 * Store Akita para la gestión del estado de los datos de mercancía fitosanitaria.
 * Permite almacenar, actualizar y eliminar la información capturada en el formulario de mercancía.
 * @class FitosanitarioStore
 * @extends {Store<FinalDataToSend>}
 * @providedIn root
 */
@Injectable({
    providedIn: 'root',
})
@StoreConfig({ name: 'fitosanitariostore', resettable: true })
export class FitosanitarioStore extends Store<FinalDataToSend> {
    /**
     * Constructor del store.
     * Inicializa el estado con los valores por defecto utilizando la función createDatosState().
     * @constructor
     */
    constructor() {
        super(createDatosState());
    }

    /**
     * Actualiza el estado con la información del formulario de mercancía.
     * @method actualizarDatosForma
     * @param {MercanciaForm[]} datos - Datos del formulario de mercancía a almacenar en el estado.
     * @returns {void}
     * @description Actualiza la propiedad `datos` del estado con el nuevo arreglo recibido.
     */
    public actualizarDatosForma(datos: MercanciaForm[]): void {
        this.update(state => ({
            ...state,
            datos
        }));
    }

    /**
     * Elimina un dato de mercancía del estado según su ID.
     * @method eliminarDatoPorId
     * @param {number} id - Identificador del dato de mercancía a eliminar.
     * @returns {void}
     * @description Filtra el arreglo `datos` del estado para eliminar el elemento cuyo ID coincida con el proporcionado.
     */
    public eliminarDatoPorId(id: number): void {
        this.update(state => ({
            ...state,
            datos: state.datos.filter(dato => dato.id !== id),
        }));
    }
}