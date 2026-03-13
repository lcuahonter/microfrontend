import { Catalogo } from '@libs/shared/data-access-user/src';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Solicitud32512Store } from '../estados/solicitud32512.store';
import { SolicitudModel } from '../models/solicitud.model';

/**
 * Servicio encargado de obtener los datos necesarios para el llenado del formulario
 * de la solicitud 32512 a partir de archivos JSON locales.
 */
@Injectable({
  providedIn: 'root',
})
export class SolicitudService {
  /**
   * Constructor que inyecta el cliente HTTP.
   * @param http - Cliente HTTP para realizar peticiones.
   */
  constructor(
    private http: HttpClient,
    public solicitud32512Store: Solicitud32512Store
  ) {
    // Lógica del constructor aquí
  }

  /**
   * Obtiene el catálogo de entidades federativas desde un archivo JSON local.
   *
   * @returns Observable con un arreglo de objetos tipo Catalogo.
   */
  conseguirEntidadFederativa(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(
      'assets/json/32512/entidad-federativa-catalogo.json'
    );
  }

  /**
   * Obtiene el catálogo de municipios o alcaldías desde un archivo JSON local.
   *
   * @returns Observable con un arreglo de objetos tipo Catalogo.
   */
  conseguirMunicipioAlcaldia(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(
      'assets/json/32512/municipio-alcaldia-catalogo.json'
    );
  }

  /**
   * Obtiene el catálogo de colonias desde un archivo JSON local.
   *
   * @returns Observable con un arreglo de objetos tipo Catalogo.
   */
  conseguirColonia(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/32512/colonia-catalogo.json');
  }

  /**
   * Obtiene los datos simulados del formulario desde un archivo JSON local.
   *
   * @returns Un observable que emite un objeto `SolicitudModel` con los datos del formulario.
   */
  guardarDatosFormulario(): Observable<SolicitudModel> {
    return this.http.get<SolicitudModel>(
      'assets/json/32512/solicitud-datos.json'
    );
  }

  /**
   * Actualiza el estado centralizado (`Store`) de la solicitud con los valores obtenidos del formulario.
   *
   * Este método toma como entrada un objeto `SolicitudModel` y actualiza individualmente
   * cada propiedad en el store `solicitud32512Store`, permitiendo mantener sincronizado
   * el estado de la aplicación con los datos actuales del formulario.
   *
   * @param resp - Objeto de tipo `SolicitudModel` con los datos del formulario.
   */
  actualizarEstadoFormulario(resp: SolicitudModel): void {
    this.solicitud32512Store.actualizarNombreComercial(resp.nombreComercial);
    this.solicitud32512Store.actualizarEntidadFederativa(
      resp.entidadFederativa
    );
    this.solicitud32512Store.actualizarMunicipio(resp.municipio);
    this.solicitud32512Store.actualizarColonia(resp.colonia);
    this.solicitud32512Store.actualizarCalle(resp.calle);
    this.solicitud32512Store.actualizarNumeroExterior(resp.numeroExterior);
    this.solicitud32512Store.actualizarNumeroInterior(resp.numeroInterior);
    this.solicitud32512Store.actualizarCodigoPostal(resp.codigoPostal);
    this.solicitud32512Store.actualizarLugarEntidadFederativa(
      resp.lugarEntidadFederativa
    );
    this.solicitud32512Store.actualizarLugarMunicipioAlcaldia(
      resp.lugarMunicipioAlcaldia
    );
    this.solicitud32512Store.actualizarLugarColonia(resp.lugarColonia);
    this.solicitud32512Store.actualizarLugarCalle(resp.lugarCalle);
    this.solicitud32512Store.actualizarLugarNumeroExterior(
      resp.lugarNumeroExterior
    );
    this.solicitud32512Store.actualizarLugarNumeroInterior(
      resp.lugarNumeroInterior
    );
    this.solicitud32512Store.actualizarLugarCodigoPostal(
      resp.lugarCodigoPostal
    );
    this.solicitud32512Store.actualizarGenerico1(resp.generico1);
    this.solicitud32512Store.actualizarGenerico2(resp.generico2);
    this.solicitud32512Store.actualizarArchivoDestruccion(
      resp.archivoDestruccion
    );
  }
}
