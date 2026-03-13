/**
 * tramites220103.store.ts
 */
import { Store, StoreConfig } from '@datorama/akita';

import { Injectable } from '@angular/core';

import { DatosDelTerceroDestinatario, Instalacion, Mercancia } from '../../modelos/sanidad-acuicola-importacion.model';


/**
 * Interfaz que define el estado del trámite 220103.
 * Contiene las propiedades necesarias para gestionar el estado del trámite.
 */
export interface Tramite220103State {
    /** Tabla con la lista de mercancías */
    tablaMercancia?: Mercancia[];
    /** Tabla con la lista de instalaciones */
    tablaInstalacion?: Instalacion[];
    /** Datos del tercero instalación seleccionada */
    datosDelTerceroInstalacion?: Instalacion;
    /** Tabla con la lista de destinatarios */
    tablaDestinatario?: DatosDelTerceroDestinatario[];
    /** Datos del tercero destinatario seleccionado */
    datosDelTerceroDestinatario?: DatosDelTerceroDestinatario;
    /** Objeto de mercancía actual */
    mercancia?: Mercancia;
    /** Propiedades adicionales dinámicas */
    [key: string]: unknown;
}

/**
 * Función que crea el estado inicial del trámite 220103.
 * 
 * @returns Estado inicial del trámite 220103.
 */
export function createInitialState(): Tramite220103State {
    return {
        /** Estado inicial de la mercancía */
        mercancia: {
            descripcion: '',
            fraccionArancelaria: '',
            descripcionFraccion: '',
            cantidadUMT: '',
            umt: '',
            cantidadUMC: '',
            umc: '',
            nombreComun: '',
            nombreCientifico: '',
            faseDesarrollo: '',
            uso: '',
            otroUso: '',
            origen: '',
            paisOrigen: '',
            paisProcedencia: ''
        },
        /** Estado inicial de los datos del tercero destinatario */
        datosDelTerceroDestinatario:{
            nombre: '',
            primerApellido: '',
            razonSocial: '',
            segundoApellido: '',
            telefono: '',
            correoElectronico: '',
            calle: '',
            numeroExterior: '',
            numeroInterior: '',
            pais: '',
            estado: '',
            municipioAlcaldia: '',
            lada: '',
            colonia: '',
            codigoPostal: ''
        },
        /** Estado inicial de los datos del tercero instalación */
        datosDelTerceroInstalacion:{
            nombre: '',
            primerApellido: '',
            segundoApellido: '',
            telefono: '',
            correoElectronico: '',
            calle: '',
            numeroExterior: '',
            numeroInterior: '',
            pais: '',
            estado: '',
            municipio: '',
            colonia: '',
            lada: '',
            codigoPostal: '',
            domicillio: '',
            razonSocial: ''
        }
    }
}

/**
 * Clase que representa el store del trámite 220103.
 * Extiende la clase `Store` de Akita para gestionar el estado del trámite.
 */
@Injectable({
    providedIn: 'root',
})
@StoreConfig({ name: 'tramite220103', resettable: true })
export class Tramite220103Store extends Store<Tramite220103State> {
    /**
     * Constructor del store.
     * Inicializa el estado con los valores predeterminados.
     */
    constructor() {
        super(createInitialState());
    }

    /**
     * Actualiza el estado del trámite 220103 con los valores proporcionados.
     * 
     * @param fieldName - Nombre del campo a actualizar.
     * @param valores - Valores parciales para actualizar el estado.
     * @param prop - Propiedad específica del estado a actualizar (opcional).
     */
    setTramite220103State(fieldName: string, valores: unknown, prop?: string): void {
        this.update(state => ({
            ...state,
            [prop ?? fieldName]: prop
                ? {
                    ...(state[prop] as object),
                    [fieldName]: valores
                }
                : valores
        }));
    }

    /**
     * Elimina una mercancía de la tabla de mercancías por su identificador.
     * 
     * @param id - Identificador de la mercancía a eliminar.
     */
    eliminarMercancia(id: string): void {
        this.update((state) => ({
            ...state,
            tablaMercancia: state.tablaMercancia?.filter((mercancia) => mercancia.id !== id)
        }));
    }
}