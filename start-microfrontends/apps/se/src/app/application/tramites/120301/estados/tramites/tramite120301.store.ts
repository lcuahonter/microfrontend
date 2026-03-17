import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Interfaz que define el estado de la solicitud para el trámite 120301.
 */
export interface Solicitud120301State {
    /** Identificador de expedicion. */
    idExpedicion: number;
    /** Identificador regimen */
    identificadorRegimen: string;
    /** Id de la solicitud. */
    idSolicitud: number;
    /** Unidad de medida */
    unidadMedida: string;
    /** País de origen o destino */
    pais_origen_destino: string;
    /** Clave de entidad */
    cve_entidad: string;
    /** Clave */
    clave: string;
    /** Clave de país */
    cve_pais: string;
    /** ID del mecanismo */
    id_mecanismo: number;
    /** ID de asignación del trámite */
    id_asignacion: number;
    /** ID de la factura de expedición */
    id_factura_expedicion: number;
    /** Indica si el formulario de facturas asociadas es válido */
    validarFormularioFacturasAsociadas?: boolean;
    /** Indica si el formulario de importador en destino es válido */
    validarFormularioImportadorDestino?: boolean;
}
/**
 * Crea el estado inicial del trámite 120301.
 * @returns Estado inicial de tipo `Solicitud120301State`.
 */
export function createInitialState(): Solicitud120301State {
    return {
        idExpedicion: 0,
        identificadorRegimen: '',
        idSolicitud: 0,
        unidadMedida: '',
        pais_origen_destino: '',
        cve_entidad: '',
        clave: '',
        cve_pais: '',
        id_mecanismo: 0,
        id_asignacion: 0,
        id_factura_expedicion: 0,
        validarFormularioFacturasAsociadas: false,
        validarFormularioImportadorDestino: false,
    };
}

/**
 * Servicio de estado global para gestionar el trámite 120301 con Akita.
 * Proporciona métodos para actualizar cada campo del estado.
 */
@Injectable({
    providedIn: 'root',
})
@StoreConfig({ name: 'tramite120301', resettable: true })
export class Tramite120301Store extends Store<Solicitud120301State> {
    /**
     * Constructor que inicializa el estado con los valores predeterminados.
     */
    constructor() {
        super(createInitialState());
    }

    /**
      * Guarda el ID de la expedicion en el estado.
      *
      * @param idExpedicion - El ID de la expedicion que se va a guardar.
      */
    public setIdExpedicion(idExpedicion: number): void {
        this.update((state) => ({
            ...state,
            idExpedicion,
        }));
    }

    /**
     * Actualiza el Identificador regimen.
     * @param identificadorRegimen Nuevo Identificador regimen.
     */
    public setIdentificadorRegimen(identificadorRegimen: string): void {
        this.update((state) => ({
            ...state,
            identificadorRegimen,
        }));
    }

    /**
     * Actualiza el Id de la solicitud.
     * @param idSolicitud Nuevo Id de la solicitud. 
     * */
    public setIdSolicitud(idSolicitud: number): void {
        this.update((state) => ({
            ...state,
            idSolicitud,
        }));
    }

    /**
     * Actualiza el país de origen o destino.
     * @param pais_origen_destino Nuevo país de origen o destino.
     * */
    public setPaisOrigenDestino(pais_origen_destino: string): void {
        this.update((state) => ({
            ...state,
            pais_origen_destino,
        }));
    }

    /**
     * Actualiza la unidad de medida.
     * @param unidadMedida Nueva unidad de medida.
     * */
    public setUnidadMedida(unidadMedida: string): void {
        this.update((state) => ({
            ...state,
            unidadMedida,
        }));
    }

    /** 
 * Actualiza la clave de entidad
 * @param cve_entidad - Nueva clave de entidad
 */
    public setClave(cve_entidad: string): void {
        this.update((state) => ({
            ...state,
            cve_entidad,
        }));
    }

    /** 
     * Actualiza la clave
     * @param clave - Nueva clave
     */
    public setClaveEntidad(clave: string): void {
        this.update((state) => ({
            ...state,
            clave,
        }));
    }

    /** 
     * Actualiza el ID del mecanismo
     * @param id_mecanismo - Nuevo ID del mecanismo
     */
    public setIdMecanismo(id_mecanismo: number): void {
        this.update((state) => ({
            ...state,
            id_mecanismo,
        }));
    }

    /** 
     * Actualiza la clave de país
     * @param cve_pais - Nueva clave de país
     */
    public setClavePais(cve_pais: string): void {
        this.update((state) => ({
            ...state,
            cve_pais,
        }));
    }

    /**
     * Actualiza el ID de la solicitud.
     * @param idSolicitud 
     */
    public setId(idSolicitud: number): void {
        this.update((state) => ({
            ...state,
            idSolicitud,
        }));
    }

    /**
     * Actualizar el ID de asignación del trámite.
     * @param id_asignacion 
     */
    public setIdAsignacion(id_asignacion: number): void {
        this.update((state) => ({
            ...state,
            id_asignacion,
        }));
    }
    /**
     * Actualiza el ID de la factura de expedición.
     * @param id_factura_expedicion 
     */
    public setFacturaExpedicion(id_factura_expedicion: number): void {
        this.update((state) => ({
            ...state,
            id_factura_expedicion,
        }));
    }

    /**
     * Actualizar el estado de validación del formulario de facturas asociadas.
     * @param valor 
     */
    public setValidarFormularioFacturasAsociadas(valor: boolean): void {
        this.update(state => ({
            ...state,
            validarFormularioFacturasAsociadas: valor,
        }));
    }

    /**
     * Actualizar el estado de validación del formulario de importador en destino.
     * @param valor 
     */
    public setValidarFormularioImportadorDestino(valor: boolean): void {
        this.update(state => ({
            ...state,
            validarFormularioImportadorDestino: valor,
        }));
    }
}