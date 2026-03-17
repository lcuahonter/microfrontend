import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { HttpCoreService } from '@libs/shared/data-access-user/src/core/services/shared/http/http.service';

import {
  Catalogo,
  RespuestaCatalogos,
} from '@libs/shared/data-access-user/src/core/models/shared/catalogos.model';
import { Destinatario, Fabricante, Facturador, Proveedor } from '../../../shared/models/terceros-relacionados.model';
import { Observable, catchError, throwError } from 'rxjs';
import { ReprestantanteData, SolicitudModel } from '../models/permiso-sanitario.model';
import { Solicitud260215State, Tramite260215Store } from '../estados/tramites/tramite260215.store';

/**
 * Interface para la respuesta de la API.
 */
export interface JSONResponse {
  success: boolean;
  message: string;
  data?: unknown;
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ServiciosPermisoSanitarioService {
  /**
   * Crea una nueva instancia del servicio ServiciosPermisoSanitarioService.
   * 
   * @param http - Instancia de HttpClient utilizada para realizar solicitudes HTTP.
   * @param tramite260215Store - Instancia de Tramite260215Store para gestionar el estado relacionado con el trámite 260215.
   * @param httpService - Instancia de HttpCoreService para operaciones POST/PUT/DELETE.
   */
  constructor(
    private http: HttpClient, 
    private tramite260215Store: Tramite260215Store,
    private httpService: HttpCoreService
  ) {
    // to be initilized
  }

  /**
   * Obtiene los datos del banco desde un archivo JSON local.
   *
   * @returns Un observable que emite un arreglo de objetos de tipo Catalogo con las opciones del banco.
   */
  getBancoData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('./assets/json/260215/banco-options.json');
  }
  /**
   * Obtiene los datos desde un archivo JSON local ubicado en 'assets/json/260215/derechos.json'.
   * 
   * @returns Un Observable que emite los datos obtenidos del archivo JSON.
   * @throws Retorna un error si ocurre algún problema durante la solicitud HTTP.
   */
  getDatos(): Observable<unknown> {
    return this.http.get('assets/json/260215/derechos.json').pipe(
      catchError((error: unknown) => {
        return throwError(() => error);
      })
    );
  }

   /**
     * Obtiene la lista de solicitudes desde un recurso externo.
     * @returns Un Observable que emite un arreglo de objetos de tipo SolicitudModel.
     */
    getSolicitudes(): Observable<SolicitudModel[]> {
      return this.http.get<SolicitudModel[]>('assets/json/260215/solicitud.json');
    }

  /**
   * Obtiene los datos del proveedor desde un archivo JSON local.
   *
   * Realiza una solicitud HTTP GET al archivo 'assets/json/260215/proveedor.json'
   * y retorna un observable con la respuesta. Si ocurre un error durante la solicitud,
   * el error es capturado y reenviado mediante `throwError`.
   *
   * @returns {Observable<unknown>} Un observable que emite los datos del proveedor o un error si la solicitud falla.
   */
  getProveedordata(): Observable<unknown> {
    return this.http.get('assets/json/260215/proveedor.json').pipe(
      catchError((error: unknown) => {
        return throwError(() => error);
      })
    );
  }
  /**
   * Obtiene los datos de localidades desde un archivo JSON local.
   *
   * Realiza una petición HTTP GET al archivo 'assets/json/260215/estadolocalidad.json'
   * y retorna un observable con la respuesta. Si ocurre un error durante la petición,
   * el error es capturado y propagado.
   *
   * @returns {Observable<unknown>} Un observable que emite los datos de localidades o un error si la petición falla.
   */
  getLocalidaddata(): Observable<unknown> {
    return this.http.get('assets/json/260215/estadolocalidad.json').pipe(
      catchError((error: unknown) => {
        return throwError(() => error);
      })
    );
  }



  /**
   * Obtiene los datos de terceros relacionados desde un archivo JSON local.
   *
   * @returns Observable que emite un arreglo de objetos Catalogo.
   */
  getData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(
      'assets/json/260215/terceros-relacionados.json'
    );
  }
  /**
   * Obtiene los datos del estado desde un archivo JSON local.
   *
   * @returns Un observable que emite un arreglo de objetos de tipo `Catalogo`.
   */
  getEstado(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/260215/estado.json');
  }

  /**
   * Obtiene la lista de estados desde un archivo JSON local.
   *
   * Realiza una solicitud HTTP GET para recuperar los datos del catálogo de estados
   * desde el archivo 'assets/json/260215/seleccion.json'. El resultado es un observable
   * que emite una respuesta tipada como `RespuestaCatalogos`.
   *
   * @returns Observable que emite la respuesta del catálogo de estados.
   */
  getObtenerEstadoList(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(
      'assets/json/260215/seleccion.json'
    );
  }


  /**
   * Actualiza el estado del trámite 260215 en el store correspondiente.
   * 
   * Este método toma un objeto de tipo `Solicitud260215State` y actualiza cada uno de los campos
   * del store `tramite260215Store` con los valores proporcionados en el objeto de datos.
   * 
   * @param datos - Objeto que contiene el estado actual del trámite 260215, con toda la información relevante
   *                para actualizar el store, incluyendo datos de referencia, pago, ubicación, producto y solicitante.
   */
   actualizarEstadoTramite260215(datos: Solicitud260215State): void {
    this.tramite260215Store.setClaveDeReferencia(datos.claveDeReferencia);
    this.tramite260215Store.setCadenaDependencia(datos.cadenaDependencia);
    this.tramite260215Store.setBanco(datos.banco);
    this.tramite260215Store.setllaveDePago(datos.llaveDePago);
    this.tramite260215Store.setFechaPago(datos.fechaPago);
    this.tramite260215Store.setImportePago(datos.importePago);
    this.tramite260215Store.setRfcDel(datos.rfcDel);
    this.tramite260215Store.setDenominacion(datos.denominacion);
    this.tramite260215Store.setCorreo(datos.correo);
    this.tramite260215Store.setCodigoPostal(datos.codigoPostal);
    this.tramite260215Store.setEstado(datos.estado);
    this.tramite260215Store.setMuncipio(datos.muncipio);
    this.tramite260215Store.setLocalidad(datos.localidad);
    this.tramite260215Store.setColonia(datos.colonia);
    this.tramite260215Store.setCalle(datos.calle);
    this.tramite260215Store.setLada(datos.lada);
    this.tramite260215Store.setTelefono(datos.telefono);
    this.tramite260215Store.setClaveScianModal(datos.claveScianModal);
    this.tramite260215Store.setClaveDescripcionModal(datos.claveDescripcionModal);
    this.tramite260215Store.setAvisoCheckbox(datos.avisoCheckbox);
    this.tramite260215Store.setLicenciaSanitaria(datos.licenciaSanitaria);
    this.tramite260215Store.setRegimen(datos.regimen);
    this.tramite260215Store.setAduanasEntradas(datos.aduanasEntradas);
    this.tramite260215Store.setClasificacion(datos.clasificacion);
    this.tramite260215Store.setEspecificar(datos.especificar);
    this.tramite260215Store.setDenominacionEspecifica(datos.denominacionEspecifica);
    this.tramite260215Store.setDenominacionDistintiva(datos.denominacionDistintiva);
    this.tramite260215Store.setDenominacionComun(datos.denominacionComun);
    this.tramite260215Store.setTipoDeProducto(datos.tipoDeProducto);
    this.tramite260215Store.setEstadoFisico(datos.estadoFisico);
    this.tramite260215Store.setFraccionArancelaria(datos.fraccionArancelaria);
    this.tramite260215Store.setDescripcionFraccion(datos.descripcionFraccion);
    this.tramite260215Store.setCantidadUMT(datos.cantidadUMT);
    this.tramite260215Store.setUMT(datos.UMT);
    this.tramite260215Store.setCantidadUMC(datos.cantidadUMC);
    this.tramite260215Store.setUMC(datos.UMC);
    this.tramite260215Store.setPresentacion(datos.presentacion);
    this.tramite260215Store.setNumeroRegistro(datos.numeroRegistro);
    this.tramite260215Store.setFechaCaducidad(datos.fechaCaducidad);
    this.tramite260215Store.setCumplimiento(datos.cumplimiento);
    this.tramite260215Store.setRfc(datos.rfc);
    this.tramite260215Store.setNombre(datos.nombre);
    this.tramite260215Store.setApellidoPaterno(datos.apellidoPaterno);
    this.tramite260215Store.setApellidoMaterno(datos.apellidoMaterno);
  }

  
  /**
   * Obtiene los datos del registro de toma de muestras de mercancías.
   *
   * Realiza una solicitud HTTP GET para recuperar la información almacenada en el archivo JSON correspondiente
   * a la toma de muestras de mercancías para el trámite 260215.
   *
   * @returns Un observable que emite el estado de la solicitud (`Solicitud260215State`) con los datos obtenidos.
   */
  getRegistroTomaMuestrasMercanciasData(): Observable<Solicitud260215State> {
    return this.http.get<Solicitud260215State>('assets/json/260215/registro_toma_muestras_mercancias.json');
  }
  
      /**
     * Recupera los DATOS del representante desde un archivo JSON local.
     *
     * Este método envía una solicitud HTTP GET para recuperar los DATOS del archivo JSON especificado.
     * Se espera que los DATOS sean del tipo `ReprestantanteData`.
     *
     * @returns {Observable<ReprestantanteData>} Un observable que emite los DATOS del representante obtenidos.
     * @throws Lanzará un error si la solicitud HTTP falla.
     * @memberof ModificatNoticeService
     */
    public ObtenerReprestantanteData(): Observable<ReprestantanteData> {
      return this.http
        .get<ReprestantanteData>('assets/json/260215/represtantante.json')
        .pipe(
          catchError((error) => {
            return throwError(() => error);
          })
        );
    }
      /**
       * Obtiene los datos de la tabla de fabricantes como destinatarios desde un archivo JSON local.
       *
       * @returns {Observable<Destinatario[]>} Observable que emite un arreglo de objetos `Destinatario`.
       * @description Este método realiza una petición HTTP para obtener los datos de la tabla de fabricantes como destinatarios.
       */
      getFabricanteTablaDatos(): Observable<Fabricante[]> {
        return this.http.get<Fabricante[]>('assets/json/260214/fabricante.json');
      }
      
        /**
         * @description
         * Obtiene la lista de proveedores desde un archivo JSON local.
         *
         * @returns {Observable<Proveedor[]>} Un observable que emite un arreglo de proveedores.
         *
         * @example
         * this.miServicio.getProveedorTablaDatos().subscribe((data) => {
         *   console.log(data);
         * });
         */
        getProveedorTablaDatos(): Observable<Proveedor[]> {
          return this.http.get<Proveedor[]>('assets/json/260214/proveedor.json');
        }
          getDestinatarioTablaDatos(): Observable<Destinatario[]> {
            return this.http.get<Destinatario[]>(
              'assets/json/260214/destinatario-final.json'
            );
          }
            getFacturadorTablaDatos(): Observable<Facturador[]> {
              return this.http.get<Facturador[]>('assets/json/260214/facturador.json');
            }

  /**
   * Envía los datos proporcionados mediante una solicitud HTTP POST para guardar la solicitud.
   * OPCION 1: Usa el endpoint estándar SAT (se recomienda usar RegistroSolicitudService)
   * OPCION 2: Usa el endpoint específico COFEPRIS (como respaldo)
   * 
   * @param body - Objeto que contiene los datos a enviar en el cuerpo de la solicitud.
   * @returns Observable con la respuesta de la solicitud POST.
   */
  guardarDatosPost(body: Record<string, unknown>): Observable<JSONResponse> {
    // OPCION 1: Usar endpoint estándar SAT (recomendado - mejor usar RegistroSolicitudService)
    const ENDPOINT_SAT = '/api/sat-t260215/solicitud/guardar';
    
    // OPCION 2: Usar endpoint específico COFEPRIS (como respaldo si el servidor está configurado así)
    // const ENDPOINT_COFEPRIS = '/api/cofepris-t260215/solicitud/guardar';
    
    // Usar endpoint estándar SAT por defecto
    const ENDPOINT = ENDPOINT_SAT;
    
    return this.httpService.post<JSONResponse>(ENDPOINT, { body: body });
  }
      
}
