import { ENVIRONMENT } from "@libs/shared/data-access-user/src";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ListaSelect } from "../../../models/certificados/configuracion/registrar/response/listaSelect";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class RegistrarCertificadosService {
    /**
     * URL base del servidor configurado en los environments.
     * Se utiliza como prefijo para todas las peticiones del módulo.
     */
    private readonly host: string;
    /**
     * Constructor del servicio.
     *
     * @param http - Servicio HttpClient utilizado para realizar
     * peticiones HTTP.
     */
    constructor(private http: HttpClient) {
        this.host = `${ENVIRONMENT.API_HOST}/api`;
    }
    /**
     * Obtiene la lista de trámites disponibles para su selección.
     *
     * La información se carga desde un archivo JSON local ubicado en
     * `assets/json/configuracion/certificados/configuraciones/registrar/listaTratados.json`.
     *
     * Este método es útil para poblar componentes de tipo select, combo o listas
     * relacionadas con trámites o tratados disponibles en el sistema.
     *
     * @returns {Observable<ListaSelect[]>}
     * Un observable que emite un arreglo de objetos `ListaSelect`
     * con el valor y la etiqueta de cada trámite.
     */
    public obtenerListaTramites(): Observable<ListaSelect[]> {
        return this.http.get<ListaSelect[]>('/assets/json/configuracion/certificados/configuraciones/registrar/listaTratados.json')
    }
    /**
     * Obtiene la lista de países disponibles para su selección.
     *
     * La información se consume desde un archivo JSON local ubicado en
     * `assets/json/configuracion/certificados/configuraciones/registrar/bloquePais.json`.
     *
     * Este método se utiliza principalmente para cargar catálogos de países
     * en componentes de selección (select, lista o multiselección).
     *
     * @returns {Observable<ListaSelect[]>}
     * Un observable que emite un arreglo de objetos `ListaSelect`
     * representando los países disponibles.
     */
    public obtenerListaPais(): Observable<ListaSelect[]> {
        return this.http.get<ListaSelect[]>('/assets/json/configuracion/certificados/configuraciones/registrar/bloquePais.json')
    }
}

