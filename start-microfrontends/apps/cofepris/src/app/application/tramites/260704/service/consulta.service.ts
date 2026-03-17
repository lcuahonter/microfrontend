import { Asociados, ColumnasTabla, Destinatario, ListaClave, Mercancia } from '../models/consulta.model';
import { Catalogo, RespuestaCatalogos } from '@libs/shared/data-access-user/src';
import { Observable, catchError, throwError } from 'rxjs';
import { Solicitud260704State, Tramite260704Store } from '../estados/Tramite260704.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/**
 * Servicio de consulta para obtener datos y tablas relacionados con el trámite 260704.
 *
 * Este servicio se encarga de realizar solicitudes HTTP para obtener:
 * - Datos de catálogos (estado, clave, banco, etc.).
 * - Tablas de datos (SCIAN, mercancías, lista clave, trámites asociados y terceros).
 * - Descripción del SCIAN.
 *
 * Los métodos retornan Observables tipados, y manejan errores mediante catchError.
 */
@Injectable({
  providedIn: 'root',
})
export class ConsultaService {
  /**
   * Constructor que inyecta el HttpClient para realizar solicitudes HTTP.
   * @param http Instancia de HttpClient.
   */
  constructor(private http: HttpClient, private tramite260704Store: Tramite260704Store) {
    // Constructor vacío, no requiere inicialización adicional.
  }
/**
     * Actualiza el estado global del formulario con los datos proporcionados.
     * @param DATOS Objeto con los datos del formulario de tipo Solicitud260704State.
     */
  actualizarEstadoFormulario(DATOS: Solicitud260704State): void {
    // this.tramite260704Store.addMercanciasDatos(DATOS.mercanciasDatos);
    // this.tramite260704Store.removeDestinatarioDato(DATOS.destinatarioDatos);
    this.tramite260704Store.setTipoOperacion(DATOS.tipoOperacion);
    this.tramite260704Store.setJustificacion(DATOS.justificacion);
    this.tramite260704Store.setEstablecimiento(DATOS.establecimiento);
    this.tramite260704Store.setRazonSocial(DATOS.razonSocial);
    this.tramite260704Store.setCorreoElectronico(DATOS.correoElectronico);
    this.tramite260704Store.setCodigoPostal(DATOS.codigoPostal);
    this.tramite260704Store.setEstado(DATOS.estado);
    this.tramite260704Store.setMunicipio(DATOS.municipio);
    this.tramite260704Store.setLocalidad(DATOS.localidad);
    this.tramite260704Store.setColonia(DATOS.colonia);
    this.tramite260704Store.setCalle(DATOS.calle);
    this.tramite260704Store.setLada(DATOS.lada);
    this.tramite260704Store.setTelefono(DATOS.telefono);
    this.tramite260704Store.setScian(DATOS.scian);
    this.tramite260704Store.setScianDatos(DATOS.scianDatos);
    this.tramite260704Store.setClaveScian(DATOS.claveScian);
    this.tramite260704Store.setDescripcionScian(DATOS.descripcionScian);
    this.tramite260704Store.setAvisoDeFuncionamiento(DATOS.avisoDeFuncionamiento);
    this.tramite260704Store.setLicenciaSanitaria(DATOS.licenciaSanitaria);
    this.tramite260704Store.setRegimen(DATOS.regimen);
    this.tramite260704Store.setAduana(DATOS.aduana);
    this.tramite260704Store.setImmex(DATOS.immex);
    this.tramite260704Store.setAno(DATOS.ano);
    this.tramite260704Store.setMercancia(DATOS.mercancia);
    this.tramite260704Store.setClasificacionProducto(DATOS.clasificacionProducto);
    this.tramite260704Store.setEspecificarClasificacionProducto(DATOS.especificarClasificacionProducto);
    this.tramite260704Store.setDenominacionProducto(DATOS.denominacionProducto);
    this.tramite260704Store.setMarca(DATOS.marca);
    this.tramite260704Store.setTipoProducto(DATOS.tipoProducto);
    this.tramite260704Store.setEspecifique(DATOS.especifique);
    this.tramite260704Store.setFraccionArancelaria(DATOS.fraccionArancelaria);
    this.tramite260704Store.setDescripcionFraccionArancelaria(DATOS.descripcionFraccionArancelaria);
    this.tramite260704Store.setCantidadUMT(DATOS.cantidadUMT);
    this.tramite260704Store.setUMT(DATOS.umt);
    this.tramite260704Store.setCantidadUMC(DATOS.cantidadUMC);
    this.tramite260704Store.setUMC(DATOS.umc);
    this.tramite260704Store.setClaveLote(DATOS.claveLote);
    this.tramite260704Store.setListaClave(DATOS.listaClave);
    this.tramite260704Store.setManfestosYDeclaraciones(DATOS.manfestosYDeclaraciones);
    this.tramite260704Store.setHacerlosPublicos(DATOS.hacerlosPublicos);
    this.tramite260704Store.setRFC(DATOS.rfc);
    this.tramite260704Store.setClaveDeReferencia(DATOS.claveDeReferencia);
    this.tramite260704Store.setCadenaDependecia(DATOS.cadenaDependecia);
    this.tramite260704Store.setBanco(DATOS.banco);
    this.tramite260704Store.setLiaveDePago(DATOS.liaveDePago);
    this.tramite260704Store.setImporteDePago(DATOS.importeDePago);
    this.tramite260704Store.setDestinatario(DATOS.destinatario);
    this.tramite260704Store.setFabricante(DATOS.fabricante);
    this.tramite260704Store.setTipoPersona(DATOS.tipoPersona);
    this.tramite260704Store.setNombre(DATOS.nombre);
    this.tramite260704Store.setPrimerApellido(DATOS.primerApellido);
    this.tramite260704Store.setSegundoApellido(DATOS.segundoApellido);
    this.tramite260704Store.setDenominacion(DATOS.denominacion);
    this.tramite260704Store.setPais(DATOS.pais);
    this.tramite260704Store.setEstados(DATOS.estados);
    this.tramite260704Store.setCodigoDeZip(DATOS.codigoDeZip);
    this.tramite260704Store.setCamino(DATOS.camino);
    this.tramite260704Store.setNumeroExterior(DATOS.numeroExterior);
    this.tramite260704Store.setNumeroInterior(DATOS.numeroInterior);
    this.tramite260704Store.setLadaDeTerceros(DATOS.ladaDeTerceros);
    this.tramite260704Store.setFon(DATOS.fon);
    this.tramite260704Store.setEmail(DATOS.email);
    this.tramite260704Store.setFechaPago(DATOS.fechaPago);
    this.tramite260704Store.setNombreRazon(DATOS.nombreRazon);
    this.tramite260704Store.setApellidoPaterno(DATOS.apellidoPaterno);
    this.tramite260704Store.setApellidoMaterno(DATOS.apellidoMaterno);

  }
  /**
     * Obtiene los datos del registro de toma de muestras de mercancías desde un archivo JSON.
     * @returns Observable con los datos del formulario.
     */
  getRegistroTomaMuestrasMercanciasData(): Observable<Solicitud260704State> {
    return this.http.get<Solicitud260704State>('assets/json/260704/registro_toma_muestras_mercancias.json');
  }
  /**
   * Obtiene el catálogo de estados.
   * @returns Observable que emite un arreglo de Catalogo.
   */
  obtenerDatosEstado(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/260704/estado.json');
  }

  /**
   * Obtiene el catálogo de claves.
   * @returns Observable que emite un arreglo de Catalogo.
   */
  obtenerDatosClave(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/260704/clave.json');
  }

  /**
   * Obtiene la tabla SCIAN.
   * @returns Observable que emite un arreglo de ColumnasTabla.
   */
  obtenerTablaScian(): Observable<ColumnasTabla[]> {
    return this.http
      .get<ColumnasTabla[]>('assets/json/260704/clave-scian.json')
      .pipe(
        catchError((error) => {
          // Maneja errores en la solicitud HTTP.
          return throwError(() => error);
        })
      );
  }

  /**
   * Obtiene la tabla de mercancías.
   * @returns Observable que emite un arreglo de Mercancia.
   */
  obtenerTablaMercancias(): Observable<Mercancia[]> {
    return this.http
      .get<Mercancia[]>('assets/json/260704/mercancia-tabla.json')
      .pipe(
        catchError((error) => {
          // Maneja errores en la solicitud HTTP.
          return throwError(() => error);
        })
      );
  }

  /**
   * Obtiene la tabla de lista clave.
   * @returns Observable que emite un arreglo de ListaClave.
   */
  obtenerTablaListaClave(): Observable<ListaClave[]> {
    return this.http
      .get<ListaClave[]>('assets/json/260704/lista-clave-tabla.json')
      .pipe(
        catchError((error) => {
          // Maneja errores en la solicitud HTTP.
          return throwError(() => error);
        })
      );
  }

  /**
   * Obtiene la tabla de trámites asociados.
   * @returns Observable que emite un arreglo de Asociados.
   */
  obtenerTablaTramites(): Observable<Asociados[]> {
    return this.http
      .get<Asociados[]>('assets/json/260704/asociados-tabla.json')
      .pipe(
        catchError((error) => {
          // Maneja errores en la solicitud HTTP.
          return throwError(() => error);
        })
      );
  }

  /**
   * Obtiene la tabla de terceros.
   * @returns Observable que emite un arreglo de Destinatario.
   */
  obtenerTablaTerceros(): Observable<Destinatario[]> {
    return this.http
      .get<Destinatario[]>('assets/json/260704/terceros-tabla.json')
      .pipe(
        catchError((error) => {
          // Maneja errores en la solicitud HTTP.
          return throwError(() => error);
        })
      );
  }

  /**
   * Obtiene el catálogo de bancos.
   * @returns Observable que emite un arreglo de Catalogo.
   */
  obtenerDatosBanco(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/260704/banco.json');
  }

  /**
   * Obtiene la descripción SCIAN.
   * @returns Observable que emite un objeto RespuestaCatalogos con la descripción del SCIAN.
   */
  getDescripcionScian(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/260601/descripcion-scian.json');
  }
}
