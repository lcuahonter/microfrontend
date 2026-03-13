import { Store, StoreConfig } from '@datorama/akita';

import { Injectable } from '@angular/core';

/**
 * Interfaz que define la estructura del estado para el trámite 5601.
 * 
 * Cada propiedad representa un campo específico del trámite, permitiendo
 * almacenar y manipular la información correspondiente en el store.
 * 
 * Se incluye un índice de tipo string para permitir la adición dinámica
 * de nuevas propiedades si es necesario.
 */
export interface Tramite5601State {
    // Indica si se cuenta con certificación
    tieneCertificacion: boolean;
    // Nombre de la empresa certificadora
    certificacionEmpresa: string;
    // Otra certificación distinta a la principal
    otraCertificacion: string;

    // Datos relacionados con la aduana y la operación
    aduana: string;
    seccionAduanera: string;
    tipoOperacion: string;
    fechaOperacion: string;
    motivoDespachoDomicilio: string;
    observaciones: string;

    // Información sobre la mercancía
    especificacionesMercancia: string;
    descripcionMercancia: string;
    tipoMoneda: string;
    valorMercancia: string;

    // Esquemas de control y seguridad
    esquemasControlSeguridad: string;
    distanciaRutaTiempos: string;

    // Datos de contacto y ubicación
    direccion: string;
    telefono: string;
    distanciaAduana: string;
    referencias: string;

    /**
     * Permite agregar propiedades adicionales de forma dinámica.
     * La clave es de tipo string y el valor puede ser de cualquier tipo.
     */
    [key: string]: unknown;
}

/**
 * Crea y devuelve el estado inicial para el trámite 5601.
 * 
 * Este estado inicializa todos los campos requeridos por el trámite con valores predeterminados,
 * asegurando que el store comience siempre con una estructura consistente y sin datos residuales.
 * 
 * Los valores por defecto son:
 * - Campos booleanos: false
 * - Campos de texto: cadena vacía ('')
 * 
 * Esta función puede ser modificada para agregar nuevos campos o cambiar los valores iniciales
 * según evolucionen los requisitos del trámite.
 */
export function createInitialState(): Tramite5601State {
    return {
        tieneCertificacion: false,
        certificacionEmpresa: '',
        otraCertificacion: '',

        aduana: '',
        seccionAduanera: '',
        tipoOperacion: '',
        fechaOperacion: '',
        motivoDespachoDomicilio: '',
        observaciones: '',

        especificacionesMercancia: '',
        descripcionMercancia: '',
        tipoMoneda: '',
        valorMercancia: '',

        esquemasControlSeguridad: '',
        distanciaRutaTiempos: '',

        direccion: '',
        telefono: '',
        distanciaAduana: '',
        referencias: ''
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
 * Configuración del store para Tramite270101.
 * 
 * @decorator StoreConfig
 * @property {string} name - Nombre del store, utilizado para identificarlo.
 * @property {boolean} resettable - Indica si el estado del store puede ser reiniciado.
 */
@StoreConfig({ name: 'tramite5601', resettable: true })

export class Tramite5601Store extends Store<Tramite5601State> {

    /**
     * Constructor de la clase Tramite5601Store.
     * 
     * Este constructor inicializa el estado del store utilizando la función `createInitialState`.
     * La función `createInitialState` devuelve un objeto vacío que representa el estado inicial.
     */
    constructor() {
        super(createInitialState());
    }

    /**
     * Actualiza dinámicamente el valor de un campo en el estado del store.
     * 
     * @template TKey - Tipo de la clave del estado (nombre del campo).
     * @param {TKey} fieldName - Nombre del campo a actualizar.
     * @param {Tramite5601State[TKey]} value - Nuevo valor para el campo especificado.
     * 
     * Esta función permite modificar cualquier propiedad del estado de manera dinámica,
     * facilitando la actualización de campos sin necesidad de métodos específicos para cada uno.
     */
    public setDynamicFieldValue<TKey extends keyof Tramite5601State>(
        fieldName: TKey,
        value: Tramite5601State[TKey]
    ): void {
        this.update((state) => ({
            ...state,
            [fieldName]: value,
        }));
    }

}