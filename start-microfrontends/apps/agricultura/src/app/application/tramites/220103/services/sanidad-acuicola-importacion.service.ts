/**
 * Servicio para gestionar la obtención de catálogos y datos
 */
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { DatosDelTerceroDestinatario, Instalacion, Mercancia } from "../../220103/modelos/sanidad-acuicola-importacion.model";
import { Observable } from "rxjs";

import { Catalogo } from "@libs/shared/data-access-user/src";

import { Tramite220103State, Tramite220103Store } from "../estados/tramites/tramites220103.store";

/**
 * Servicio para gestionar la obtención de catálogos y datos
 * relacionados con el trámite de sanidad acuícola en importación.
 */
@Injectable({
    providedIn: 'root'
})
export class SanidadAcuicolaImportacionService {

    /**
     * Constructor del servicio.
     * @param http Cliente HTTP para realizar peticiones a archivos JSON locales.
     */
    constructor(private http: HttpClient ,private store:Tramite220103Store) { }

    /**
     * Obtiene el catálogo de mercancías.
     * @returns Observable con la lista de mercancías.
     */
    getMercancias(): Observable<Mercancia[]> {
        return this.http.get<Mercancia[]>('/assets/json/220103/mercancia.json');
    }

    /**
     * Obtiene el catálogo de aduanas de ingreso.
     * @returns Observable con la lista de aduanas de ingreso.
     */
    getAdunaDeIngreso(): Observable<Catalogo[]> {
        return this.http.get<Catalogo[]>('/assets/json/220103/aduna-de-ingreso.json');
    }

    /**
     * Obtiene el catálogo de medios de transporte.
     * @returns Observable con la lista de medios de transporte.
     */
    getMedioDeTransporte(): Observable<Catalogo[]> {
        return this.http.get<Catalogo[]>('/assets/json/220103/medio-de-transporte.json');
    }

    /**
     * Obtiene el catálogo de países.
     * @returns Observable con la lista de países.
     */
    getPais(): Observable<Catalogo[]> {
        return this.http.get<Catalogo[]>('/assets/json/220103/pais.json');
    }

    /**
     * Obtiene el catálogo de orígenes.
     * @returns Observable con la lista de orígenes.
     */
    getOrigen(): Observable<Catalogo[]> {
        return this.http.get<Catalogo[]>('/assets/json/220103/origen.json');
    }

    /**
     * Obtiene el catálogo de unidades de medida y conteo (UMC).
     * @returns Observable con la lista de UMC.
     */
    getUmc(): Observable<Catalogo[]> {
        return this.http.get<Catalogo[]>('/assets/json/220103/umc.json');
    }

    /**
     * Obtiene el catálogo de usos.
     * @returns Observable con la lista de usos.
     */
    getUso(): Observable<Catalogo[]> {
        return this.http.get<Catalogo[]>('/assets/json/220103/uso.json');
    }

    /**
     * Obtiene el catálogo de colonias.
     * @returns Observable con la lista de colonias.
     */
    getColonia(): Observable<Catalogo[]> {
        return this.http.get<Catalogo[]>('/assets/json/220103/colonia.json');
    }

    /**
     * Obtiene la lista de destinatarios.
     * @returns Observable con la lista de destinatarios.
     */
    getDestinatario(): Observable<DatosDelTerceroDestinatario[]> {
        return this.http.get<DatosDelTerceroDestinatario[]>('/assets/json/220103/destinatario.json');
    }

    /**
     * Obtiene la lista de instalaciones.
     * @returns Observable con la lista de instalaciones.
     */
    getInstalacion(): Observable<Instalacion[]> {
        return this.http.get<Instalacion[]>('/assets/json/220103/instalacion.json');
    }

    /**
     * Obtiene los datos generales del trámite.
     * @returns Observable con el estado del trámite 220103.
     */
    obtenerDatos(): Observable<Tramite220103State> {
        return this.http.get<Tramite220103State>('/assets/json/220103/datos.json');
    }

    /**
     * Actualiza el estado del store con los datos proporcionados.
     * @param valor Nuevo estado del trámite 220103.
     */
    actualizarEstado(valor: Tramite220103State): void {
        this.store.update(valor);
        // Actualiza la tabla de destinatarios en el estado
        this.store.setTramite220103State("tablaDestinatario", [valor.datosDelTerceroDestinatario]);
        // Actualiza la tabla de mercancías en el estado
        this.store.setTramite220103State("tablaMercancia", [valor.mercancia]);
        // Actualiza la tabla de instalaciones en el estado
        this.store.setTramite220103State("tablaInstalacion", [valor.datosDelTerceroInstalacion]);
    }
}