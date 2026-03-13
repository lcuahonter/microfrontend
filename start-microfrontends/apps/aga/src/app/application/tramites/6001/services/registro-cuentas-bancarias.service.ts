/* eslint-disable sort-imports */
/* eslint-disable @nx/enforce-module-boundaries */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JSONResponse } from '@libs/shared/data-access-user/src/core/models/shared/catalogos.model';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src/enviroments/enviroment';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { DatosGenerales, RegistroDeSolicitudesTabla } from '../models/registro-cuentas-bancarias.model';
import { AgregarCuenta6001State, Tramite6001Store } from '../estados/tramite6001.store';
import { Tramite6001TablaState, Tramite6001TablaStore } from '../estados/tramite6001tabla.store';

@Injectable({
  providedIn: 'root'
})
export class RegistroCuentasBancariasService {

  /**
   * URL del servidor utilizado para servicios auxiliares JSON.
   * Esta URL se obtiene de la configuración del entorno.
   */
  urlServer = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;

  /**
   * Un BehaviorSubject que contiene la fuente del componente actual como una cadena.
   * Inicializado con el componente predeterminado 'DatosGenerales'.
   */
  private componentSource = new BehaviorSubject<string>('DatosGenerales'); // Default component

  /**
   * Un observable que emite el estado actual del componente.
   */
  componenteActual = this.componentSource.asObservable();


  /**
   * Construye una instancia de RegistroCuentasBancariasService.
   * 
   * @param http - La instancia de HttpClient utilizada para realizar solicitudes HTTP.
   */
  constructor(
    private http: HttpClient,
    private tramite6001Store: Tramite6001Store,
    private tramite6001TablaStore: Tramite6001TablaStore
  ) {
    //
   }

  /**
   * Recupera la lista de "Registro de Solicitudes" desde un archivo JSON.
   *
   * @returns {Observable<RegistroDeSolicitudesTabla[]>} Un observable que contiene un array de objetos RegistroDeSolicitudesTabla.
   *
   * @throws Lanzará un error si la solicitud HTTP falla.
   */
   public getSolicitudesTabla():Observable<RegistroDeSolicitudesTabla[]> {
      return this.http.get<RegistroDeSolicitudesTabla[]>('assets/json/6001/registro-de-solicitudes-tabla.json').pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
   }

  /**
   * Obtiene datos del formulario desde un archivo JSON local.
   *
   * Este método envía una solicitud HTTP GET para recuperar datos del archivo JSON especificado.
   * Se espera que los datos sean del tipo `DatosGenerales`.
   *
   * @returns Un `Observable` que emite los datos `DatosGenerales` obtenidos.
   * @throws Lanzará un error si la solicitud HTTP falla.
   */
   public obtenerDatosDeFormularioDeAPI():Observable<DatosGenerales> {
      return this.http.get<DatosGenerales>('assets/json/6001/respuesta-de-la-api.json').pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
   }

     /**
   * @description Función para obtener el trámite
   * @param id
   * @returns JSONResponse
   */
  public obtenerTramite(id: number): Observable<JSONResponse> {
    return this.http.get<JSONResponse>(`${this.urlServer}/${id}`).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }


  /**
   * Cambia el componente actual emitiendo un nuevo valor a la fuente del componente.
   *
   * @param component - El nombre del componente al que se desea cambiar.
   */
  public cambiarComponente(component: string): void {
    this.componentSource.next(component);
  }

  /**
   * Obtiene los datos del tipo de persona desde un archivo JSON local.
   *
   * @returns {Observable<JSONResponse>} Un observable que emite la respuesta JSON que contiene los datos del tipo de persona.
   *
   * @throws {Error} Si hay un error durante la solicitud HTTP.
   */
  public getTipoDePersonaDatos(): Observable<JSONResponse> {
    return this.http.get<JSONResponse>('assets/json/6001/tipo-de-persona.json').pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtiene los datos del país donde reside el usuario desde un archivo JSON local.
   *
   * @returns {Observable<JSONResponse>} Un observable que emite la respuesta JSON que contiene los datos del país.
   *
   * @throws Lanzará un error si la solicitud HTTP falla.
   */
  public getPaisDondeRadicaDatos(): Observable<JSONResponse> {
    return this.http.get<JSONResponse>('assets/json/6001/pais-donde-radica.json').pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }


  /**
   * Obtiene los datos de la institución desde un archivo JSON local.
   *
   * @returns {Observable<JSONResponse>} Un observable que emite los datos de la institución.
   * @throws Lanzará un error si la solicitud HTTP falla.
   */
  public getInstitucionDatos(): Observable<JSONResponse> {
    return this.http.get<JSONResponse>('assets/json/6001/institucion.json').pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }


  /**
   * Obtiene los datos del estado desde un archivo JSON.
   *
   * @returns {Observable<JSONResponse>} Un observable que emite la respuesta JSON que contiene los datos del estado.
   *
   * @throws Lanzará un error si la solicitud HTTP falla.
   */
  public getEstadoDatos(): Observable<JSONResponse> {
    return this.http.get<JSONResponse>('assets/json/6001/estado.json').pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtiene los datos de la tabla de sociedad desde un archivo JSON local.
   *
   * @returns {Observable<JSONResponse>} Un observable que emite la respuesta JSON.
   *
   * @throws Lanzará un error si la solicitud HTTP falla.
   */
  public getSociedadTablaDatos(): Observable<JSONResponse> {
    return this.http.get<JSONResponse>('assets/json/6001/sociedad-tabla.json').pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Recupera los datos del formulario para el proceso "Agregar Cuenta 6001" realizando una solicitud HTTP GET
   * a un archivo JSON local. Retorna un observable que emite el estado de los datos del formulario.
   * @returns {Observable<AgregarCuenta6001State>} Un observable que emite el estado de los datos del formulario.
   * @throws Emite un observable de error si la solicitud HTTP falla.
   */
  public getConsultaFormularioDatos(): Observable<AgregarCuenta6001State> {
     return this.http.get<AgregarCuenta6001State>('assets/json/6001/consulta-datos.json').pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  /**
   * Actualiza el estado del formulario en el tramite6001Store con los datos de cuenta proporcionados.
   * @param DATOS - Un objeto de tipo `AgregarCuenta6001State` que contiene la información actualizada de la cuenta,
   * incluyendo titular de la cuenta, tipo de persona, RFC, número de cuenta, país donde radica,
   * institución, estado, sucursal y número de plaza.
   */
  public actualizarEstadoFormulario(DATOS: AgregarCuenta6001State): void {
    this.tramite6001Store.setTitularDeLaCuenta(DATOS.titularDeLaCuenta);
    this.tramite6001Store.setPersona(DATOS.persona);
    this.tramite6001Store.setRfc(DATOS.rfc);
    this.tramite6001Store.setNumeroDeCuenta(DATOS.numeroDeCuenta);
    this.tramite6001Store.setPais(DATOS.pais);
    this.tramite6001Store.setInstitucion(DATOS.institucion);
    this.tramite6001Store.setEstado(DATOS.estado);
    this.tramite6001Store.setSucursal(DATOS.sucursal);
    this.tramite6001Store.setNumeroDePlaza(DATOS.numeroDePlaza);
  }

  /**
   * Actualiza el tramite6001TablaStore con los datos proporcionados de la cuenta bancaria.
   *
   * @param DATOS - Objeto que contiene el estado de la cuenta bancaria a registrar.
   *   - titularDeLaCuenta: Nombre del titular de la cuenta.
   *   - rfc: RFC (identificación fiscal) del titular de la cuenta.
   *   - persona: Tipo de persona (física o moral).
   *   - numeroDeCuenta: Número de cuenta bancaria.
   *   - sucursal: Sucursal bancaria.
   *   - institucion: Institución de crédito.
   *   - numeroDePlaza: Número de plaza.
   *   - pais: País donde se encuentra la cuenta.
   *   - estado: Estado donde se encuentra la cuenta.
   */
  public conjuntoTablaDatos(DATOS: AgregarCuenta6001State): void {
    this.tramite6001TablaStore.setCuenta(DATOS.titularDeLaCuenta);
    this.tramite6001TablaStore.setRfc(DATOS.rfc);
    this.tramite6001TablaStore.setPersona(DATOS.persona);
    this.tramite6001TablaStore.setNumeroDeCuenta(DATOS.numeroDeCuenta);
    this.tramite6001TablaStore.setSucursal(DATOS.sucursal);
    this.tramite6001TablaStore.setInstitucionDeCredito(DATOS.institucion);
    this.tramite6001TablaStore.setNumero(DATOS.numeroDePlaza);
    this.tramite6001TablaStore.setRadicaCuenta(DATOS.pais);
    this.tramite6001TablaStore.setEstado(DATOS.estado);
  }
}
