import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Interfaz que define la estructura del estado del solicitante.
 */
export interface SolicitanteState {
    rfc_original: string;
    nombre: string;
    ap_paterno: string | null;
    ap_materno: string | null;
    razon_social: string | null;
    tipo_persona: string;
    tipo_sociedad?: string;
    email?: string;
}

/** * Función que crea el estado inicial del solicitante.
 * @returns {SolicitanteState} Estado inicial del solicitante.
 */
export function createInitialStatee(): SolicitanteState {
    return {
        rfc_original: '',
        nombre: '',
        ap_paterno: null,
        ap_materno: null,
        razon_social: null,
        tipo_persona: '',
        tipo_sociedad: '',
        email: '',
    };
}

/**
 * Store para gestionar el estado del solicitante.
 * 
 * @extends Store<SolicitanteState>
 */
@Injectable({
    providedIn: 'root',
})
@StoreConfig({ name: 'tramite120301', resettable: true })
export class SolicitanteStore extends Store<SolicitanteState> {
    /**
     * Constructor que inicializa el estado con los valores predeterminados.
     */
    constructor() {
        super(createInitialStatee());
    }

    /**
     * Actualiza el RFC original del solicitante.
     * @param rfc_original Nuevo RFC original.
     */
    public setRfc(rfc_original: string): void {
        this.update((state) => ({
            ...state,
            rfc_original,
        }));
    }
    /**
     * Actualiza la ubicación del solicitante.
     * @param ubicacion Nuevo objeto de ubicación.
     */
    public setUbicacion(ubicacion: any): void {
        this.update((state:any) => ({
            ...state,
            ubicacion,
        }));
    }
    /**
     * Actualiza el nombre del solicitante.
     * @param nombre Nuevo nombre del solicitante.
     */
    public setNombre(nombre: string): void {
        this.update((state) => ({
            ...state,
            nombre,
        }));
    }

    /**
     * Actualiza el ID de la solicitud.
     * @param idSolicitud Nuevo ID de la solicitud.
     * */
    public setIdSolicitud(idSolicitud: number): void {
        this.update((state) => ({
            ...state,
            idSolicitud,
        }));
    }

    /**
     * Actualiza el apellido paterno.
     * @param ap_paterno Nuevo apellido paterno.
     * */
    public setPaterno(ap_paterno: string): void {
        this.update((state) => ({
            ...state,
            ap_paterno,
        }));
    }

    /** 
 * Actualiza el apellido materno
 * @param ap_materno - Nuevo apellido materno
 */
    public setMaterno(ap_materno: string): void {
        this.update((state) => ({
            ...state,
            ap_materno,
        }));
    }

    /** 
     * Actualiza la razón social
     * @param razon_social - Nueva razón social
     */
    public setRazonSocial(razon_social: string): void {
        this.update((state) => ({
            ...state,
            razon_social,
        }));
    }

    /** 
     * Actualiza el tipo de persona
     * @param tipo_persona - Nuevo tipo de persona
     */
    public setTipoPersona(tipo_persona: string): void {
        this.update((state) => ({
            ...state,
            tipo_persona,
        }));
    }
    /** 
     * Actualiza el tipo de sociedad
     * @param tipo_sociedad - Nuevo tipo de sociedad
     */
    public setTipoSociedad(tipo_sociedad: string): void {
        this.update((state) => ({
            ...state,
            tipo_sociedad,
        }));
    }

    /** 
     * Actualiza el email
     * @param email - Nuevo email
     */
    public setEmail(email: string): void {
        this.update((state) => ({
            ...state,
            email,
        }));
    }
}