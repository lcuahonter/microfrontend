import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

import { CAATRegistradoEmpresaForm, CandidatoModificarCaatForm } from '../models/modificacion-transportacion-maritima.model';
import { TransportistaMaritimo } from '../models/modificar-empresa.model';

/**
 * Interfaz que define el estado del trámite 40202.
 * @interface TransportacionMaritima40202State
 */
export interface TransportacionMaritima40202State {

    /**
     * ID de la solicitud.
     * @type {number | null}
     */
    idSolicitud: number | null;
    /**
     * RFC del solicitante.
     * @type {string}
     */
    solicitante: {
        rfc: string;
    }
    /**
     * lista de transportistas marítimos.
     * @type {TransportistaMaritimo[]}
     */
    transportistas_maritimos: TransportistaMaritimo[];
    /**
     * fecha de registro.
     * @type {string}
     */
    fecha_registro: string;
}

/**
 * Crea el estado inicial del trámite 40202.
 * @returns Estado inicial de tipo `TransportacionMaritima40202State`.
 */
export function createInitialState(): TransportacionMaritima40202State {
    return {
        idSolicitud: null,
        fecha_registro: '',
        solicitante: {
            rfc: '',
        },
        transportistas_maritimos: [],
    };
}

/**
 * Servicio de estado global para gestionar el trámite 40202 con Akita.
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Configuración de la tienda Akita para el trámite 40202 con opción de reinicio.
 */
@StoreConfig({ name: 'tramite40202', resettable: true })
export class Tramite40202Store extends Store<TransportacionMaritima40202State> {
    /**
     * Constructor que inicializa el estado con los valores predeterminados.
     */
    constructor() {
        super(createInitialState());
    }

    /**
     * Establece el ID de la solicitud en el estado.
     * @param idSolicitud ID de la solicitud.
     */
    setIdSolicitud(idSolicitud: number): void {
        this.update({
            idSolicitud: idSolicitud,
        });
    }
    
    /**
     * establece la lista de transportistas marítimos en el estado.
     * @param transportistas transportistas marítimos.
     */
    setTransportistasMaritimos(transportistas: TransportistaMaritimo[]): void {
        this.update({
            transportistas_maritimos: transportistas,
        });
    }
}
