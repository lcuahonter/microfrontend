import { Observable, catchError, map, retry, take, throwError } from "rxjs";
import { ENVIRONMENT } from "@libs/shared/data-access-user/src";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ModeloDatos } from "@libs/shared/data-access-user/src/core/models/modelo-datos.model";
import { ResponseTable } from "@libs/shared/data-access-user/src/core/models/shared/bandeja-de-tareas-pendientes.model";

@Injectable({
    providedIn: 'root'
})
export class LogInService {
    private readonly host: string;
    private responseUrl = '/assets/json/login/login-datos.json';
    /**
     * Constructor que inyecta el cliente HTTP de Angular.
     * @param http Cliente HTTP para realizar peticiones a la API.
     */
    constructor(private http: HttpClient) {
        this.host = `${ENVIRONMENT.API_HOST}/api/`
    }
    
    /**
     * Consulta los datos de una persona a partir de su RFC.
     *
     * Realiza una petición HTTP GET al endpoint configurado en `responseUrl` para obtener una lista de datos,
     * y busca dentro de la respuesta el registro que coincida con el RFC proporcionado.
     * 
     * @param rfc El RFC de la persona a consultar.
     * @returns Un observable que emite el objeto `ModeloDatos` correspondiente al RFC proporcionado, o `undefined` si no se encuentra.
     *          En caso de error en la petición, el observable emite un error.
     */
    consultaPersona(rfc: string): Observable<ModeloDatos | undefined> {
        const ENDPOINT = `${this.responseUrl}`;
        return this.http.get<ResponseTable>(ENDPOINT).pipe(
            retry(2),
            take(1),
            map((x: ResponseTable) => {                
                return x.datos.find((dato: ModeloDatos) => dato.rfc === rfc);
            }),
            catchError(() => {
                const ERROR = new Error(
                    `Ocurrió un error al devolver la información ${ENDPOINT} `
                );
                return throwError(() => ERROR);
            })
        );
    }
}
