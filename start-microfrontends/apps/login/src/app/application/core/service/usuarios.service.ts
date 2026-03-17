import { Observable, catchError, map, of } from 'rxjs';
import { Capturista } from '../models/capturista.model';
import { ConsultaRegistro } from '../models/consulta-registro.model';
import { ConsultaSocioExtranjero } from '../models/consulta-socio-extranjero.model';
import { ConsultaSocioNacional } from '../models/consulta-socio-nacional.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/**
 * Servicio para operaciones relacionadas con trámites de usuario.
 * Proporciona métodos para interactuar con la API de cambio de contraseña y consulta de socios/capturistas.
 */
@Injectable({
    providedIn: 'root'
})
export class UsuariosService {
    /**
     * Constructor que inyecta el cliente HTTP de Angular.
     * @param http Cliente HTTP para realizar peticiones a la API.
     */
    constructor(private http: HttpClient) {
    }

    /**
     * Consulta los datos de un usuario por RFC.
     * Realiza una petición GET a la API para obtener la información del usuario.
     * 
     * @param rfc RFC del usuario.
     * @returns Observable con los datos del registro consultado o undefined si no existe coincidencia.
     */
    consultaNotificadores(rfc: string): Observable<ConsultaRegistro | undefined> {
        return this.http.get<ConsultaRegistro[]>(`/assets/json/login/consulta-notificadores.json`).pipe(
            map((capturistas) => {
                return capturistas.find(c =>
                    (rfc ? c.rfc === rfc : true)
                );
            })
        );
    }

    /**
     * Consulta un capturista por RFC o CURP.
     * Realiza una petición GET para obtener la lista de capturistas y busca el primero que coincida
     * con el RFC o CURP proporcionados. Si no se proporciona ningún parámetro, retorna el primer capturista.
     *
     * @param rfc RFC del capturista (opcional).
     * @param curp CURP del capturista (opcional).
     * @returns Observable con el capturista encontrado o undefined si no existe coincidencia.
     */
    consultaCapturista(rfc?: string, curp?: string): Observable<Capturista | undefined> {
        return this.http.get<Capturista[]>(`/assets/json/login/lista-capturista.json`).pipe(
            map((capturistas) => {
                return capturistas.find(c =>
                    (rfc ? c.rfc === rfc : true) &&
                    (curp ? c.curp === curp : true)
                );
            })
        );
    }

    /**
     * Consulta un socio nacional por RFC.
     * Realiza una petición GET para obtener la lista de socios nacionales y busca el primero que coincida
     * con el RFC proporcionado. Si no se proporciona ningún parámetro, retorna el primer socio nacional.
     *
     * @param rfc RFC del socio nacional.
     * @returns Observable con el socio nacional encontrado o undefined si no existe coincidencia.
     */
    consultaSocioNacional(rfc: string): Observable<ConsultaSocioNacional | undefined> {
        return this.http.get<ConsultaSocioNacional[]>(`/assets/json/login/lista-socio-nacional.json`).pipe(
            map((socio) => {
                return socio.find(s =>
                    (rfc ? s.rfc === rfc : true)
                );
            })
        );
    }

    /**
     * Consulta un socio extranjero persona física por nombre.
     * Realiza una petición GET para obtener la lista de socios extranjeros y busca el primero que coincida
     * con el nombre proporcionado.
     *
     * @param nombre Nombre del socio extranjero.
     * @param apellidoPaterno Apellido paterno del socio extranjero.
     * @param pais País del socio extranjero.
     * @param codigoPostal Código postal del socio extranjero.
     * @param estado Estado del socio extranjero.
     * @returns Observable con el socio extranjero encontrado o undefined si no existe coincidencia.
     */
    consultaSocioExtranjeroFisica(
        nombre: string,
        apellidoPaterno: string,
        pais: string,
        codigoPostal: string,
        estado: string
    ): Observable<ConsultaSocioExtranjero | undefined> {
        return this.http.get<ConsultaSocioExtranjero[]>(`/assets/json/login/lista-socio-extranjero.json`).pipe(
            map((socio) => {
                return socio.find(s =>
                    (nombre ? s.nombre === nombre : true)
                );
            })
        );
    }

    /**
     * Consulta un socio extranjero persona moral por razón social.
     * Realiza una petición GET para obtener la lista de socios extranjeros y busca el primero que coincida
     * con la razón social proporcionada.
     *
     * @param razonSocial Razón social del socio extranjero.
     * @param pais País del socio extranjero.
     * @param codigoPostal Código postal del socio extranjero.
     * @param estado Estado del socio extranjero.
     * @returns Observable con el socio extranjero encontrado o undefined si no existe coincidencia.
     */
    consultaSocioExtranjerMoral(
        razonSocial: string,
        pais: string,
        codigoPostal: string,
        estado: string
    ): Observable<ConsultaSocioExtranjero | undefined> {
        return this.http.get<ConsultaSocioExtranjero[]>(`/assets/json/login/lista-socio-extranjero.json`).pipe(
            map((socio) => {
                return socio.find(s =>
                    (razonSocial ? s.razonSocial === razonSocial : true)
                );
            })
        );
    }

    /**
     * Guarda un socio extranjero persona física.
     * Simula una petición GET para validar si el socio es válido.
     *
     * @param socio Objeto con los datos del socio extranjero.
     * @returns Observable que indica si el socio fue guardado correctamente.
     */
    guardarSocioExtranjero(socio: ConsultaSocioExtranjero): Observable<boolean> {
        return this.http.get<{ socioValido: string[] }>(
            '/assets/json/login/guardar-socio-extranjero.json'
        ).pipe(
            map((data) => {
                const SOCIO_VALIDO = data.socioValido.includes(socio.nombre);
                return SOCIO_VALIDO;
            }),
            catchError((error) => {
                console.error('Error al guardar el socio accionista', error);
                return of(false);
            })
        );
    }

    /**
     * Guarda un socio extranjero persona moral.
     * Simula una petición GET para validar si el socio moral es válido.
     *
     * @param socio Objeto con los datos del socio extranjero moral.
     * @returns Observable que indica si el socio moral fue guardado correctamente.
     */
    guardarSocioExtranjeroMoral(socio: ConsultaSocioExtranjero): Observable<boolean> {
        return this.http.get<{ socioValido: string[] }>(
            '/assets/json/login/guardar-socio-extranjero-Moral.json'
        ).pipe(
            map((data) => {
                const SOCIO_VALIDO = data.socioValido.includes(socio.razonSocial);
                return SOCIO_VALIDO;
            }),
            catchError((error) => {
                console.error('Error al guardar el socio accionista', error);
                return of(false);
            })
        );
    }

    /**
 * Simula el guardado de la aceptación de condiciones de uso.
 * Envía los datos de firma y aceptación a un endpoint simulado y retorna un booleano.
 * 
 * @param firma Cadena con la firma electrónica del usuario.
 * @param aceptoCondiciones Booleano que indica si el usuario aceptó las condiciones de uso.
 * @returns Observable<boolean> indicando si la operación fue exitosa.
 */
    aceptaCondicionesUso(firma: string, aceptoCondiciones: boolean): Observable<boolean> {
        return this.http.get<{ success: boolean }>(
            'assets/json/login/guardar-condiciones-uso.json'
        ).pipe(
            map(response => response.success)
        );
    }


}