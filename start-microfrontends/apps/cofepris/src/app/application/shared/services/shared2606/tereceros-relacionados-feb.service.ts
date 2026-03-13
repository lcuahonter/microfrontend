import { Catalogo, Otros } from '@libs/shared/data-access-user/src';
import { DestinatarioModel, FacricanteModel, FacturadorModel, ProveedorModel } from '../../models/shared2606/terceros-fabricante-relocionados.model';
import { Fabricante } from '../../models/shared2606/terceros-relacionados.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TercerosRelacionadosFebService {
  /**
   * Constructor del servicio.
   * Inyecta el cliente HTTP para realizar peticiones.
   *
   * @param http Cliente HTTP para realizar peticiones.
   */
  constructor(private http: HttpClient) {
    // Constructor logic can be added here if needed
  }

  /**
   * Obtiene los datos de terceros relacionados desde un archivo JSON local.
   *
   * @returns {Observable<Catalogo[]>} Observable que emite un arreglo de objetos `Catalogo`.
   * @description Este método realiza una petición HTTP para obtener los datos de terceros relacionados.
   */
  getData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(
      'assets/json/cofepris/terceros-relacionados.json'
    );
  }

  /**
   * Obtiene los datos de países desde un archivo JSON local.
   *
   * @returns {Observable<Catalogo[]>} Observable que emite un arreglo de objetos `Catalogo`.
   * @description Este método realiza una petición HTTP para obtener los datos de países.
   */
  getPaisData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/cofepris/pais.json');
  }

  /**
   * Obtiene los datos de municipios desde un archivo JSON local.
   *
   * @returns {Observable<Catalogo[]>} Observable que emite un arreglo de objetos `Catalogo`.
   * @description Este método realiza una petición HTTP para obtener los datos de municipios.
   */
  getMunicipioData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/cofepris/municipio.json');
  }

  /**
   * Obtiene los datos de códigos postales desde un archivo JSON local.
   *
   * @returns {Observable<Catalogo[]>} Observable que emite un arreglo de objetos `Catalogo`.
   * @description Este método realiza una petición HTTP para obtener los datos de códigos postales.
   */
  getCodigoPostalData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/cofepris/codigo-postal.json');
  }

  /**
   * Obtiene los datos de colonias desde un archivo JSON local.
   *
   * @returns {Observable<Catalogo[]>} Observable que emite un arreglo de objetos `Catalogo`.
   * @description Este método realiza una petición HTTP para obtener los datos de colonias.
   */
  getColoniaData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/cofepris/colonia.json');
  }

  /**
   * Obtiene los datos de localidades desde un archivo JSON local.
   *
   * @returns {Observable<Catalogo[]>} Observable que emite un arreglo de objetos `Catalogo`.
   * @description Este método realiza una petición HTTP para obtener los datos de localidades.
   */
  getLocalidadData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/cofepris/localidad.json');
  }

  /**
   * Obtiene los encabezados de la tabla desde un archivo JSON local.
   *
   * @returns {Observable<{ columns: string[] }>} Observable que emite un objeto con un arreglo de columnas.
   * @description Este método realiza una petición HTTP para obtener los encabezados de la tabla.
   */
  getEncabezadoDeTabla(): Observable<{ columns: string[] }> {
    return this.http.get<{ columns: string[] }>(
      'assets/json/cofepris/encabezado-de-tabla.json'
    );
  }
  /**
   *
   * @returns {Observable<FacricanteModel>} Observable que emite un objeto `FacricanteModel`.
   * @description Este método realiza una petición HTTP para obtener el formulario de fabricante.
   */
  getFabricanteForm(): Observable<FacricanteModel> {
    return this.http.get<FacricanteModel>(
      'assets/json/cofepris/fabricante-form.json'
    );
  }
  /**
   * Obtiene el formulario de destinatario desde un archivo JSON local.
   * @param {void}
   * @returns {Observable<DestinatarioModel>} Observable que emite un objeto `DestinatarioModel`.
   */
  getDestinatarioForm(): Observable<DestinatarioModel> {
    return this.http.get<DestinatarioModel>(
      'assets/json/cofepris/destinatario-form.json'
    );
  }
  /**
   * Obtiene el formulario de proveedor desde un archivo JSON local.
   * @param {void}
   * @returns {Observable<ProveedorModel>} Observable que emite un objeto `ProveedorModel`.
   */
  getProveedorForm(): Observable<ProveedorModel> {
    return this.http.get<ProveedorModel>(
      'assets/json/cofepris/proveedor-form.json'
    );
  }
  /**
   *  * Obtiene el formulario de facturador desde un archivo JSON local.
   * @param {void}
   * @returns {Observable<FacturadorModel>} Observable que emite un objeto `FacturadorModel`.
   */
  getFacturadorForm(): Observable<FacturadorModel> {
    return this.http.get<FacturadorModel>(
      'assets/json/cofepris/facturador-form.json'
    );
  }

  /**
   * Obtiene los datos de fabricantes desde un archivo JSON local.
   *
   * @returns {Observable<Fabricante[]>} Observable que emite un arreglo de objetos `Fabricante`.
   * @description Este método realiza una petición HTTP para obtener los datos de fabricantes.
   */
  getFabricanteTabla(): Observable<Fabricante[]> {
    return this.http.get<Fabricante[]>('assets/json/260905/fabricante.json');
  }

  /**
   * Obtiene los datos de "otros" desde un archivo JSON local.
   *
   * @returns {Observable<Otros[]>} Observable que emite un arreglo de objetos `Otros`.
   * @description Este método realiza una petición HTTP para obtener los datos de "otros".
   */
  getOtrosTabla(): Observable<Otros[]> {
    return this.http.get<Otros[]>('assets/json/260905/otros.json');
  }
}