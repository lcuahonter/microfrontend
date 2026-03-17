import { Solicitud105State, Tramite105Store} from '../../105/estados/tramite105.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RespuestaCatalogos } from '@libs/shared/data-access-user/src';
/**
 * Servicio para obtener datos relacionados con importadores y exportadores.
 */
@Injectable({
  providedIn: 'root',
})
export class InvoCarService {
  /**
   * Constructor que se utiliza para la inyección de dependencias.
   * @param http Servicio HTTP para realizar solicitudes.
   * @param store Store de Akita para gestionar el estado.
   */
  constructor(private http: HttpClient, private store: Tramite105Store) {
    // El constructor se utiliza para la inyección de dependencias.
  }


  /**
   * Obtiene el catálogo de países.
   * @returns Observable con la respuesta del catálogo de países.
   */
  getPais():Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('https://api-v30.cloud-ultrasist.net/api/sat-t105/catalogo/paises').pipe(
    );
  }
  /**
   * Obtiene el catálogo de entidades federativas.
   * @returns Observable con la respuesta del catálogo de entidades federativas.
   */
  getEntidadFederativa(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('https://api-v30.cloud-ultrasist.net/api/sat-t105/catalogo/entidades-federativas').pipe(
    );
  }

  /**
   * Obtiene el catálogo de colonias.
   * @returns Observable con la respuesta del catálogo de colonias.
   */
  getColonia(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('https://api-v30.cloud-ultrasist.net/api/sat-t105/catalogo/municipio-delegacion/13074/colonias').pipe(
    );
  }

  /**
   * Obtiene las fechas seleccionadas.
   * @returns Observable con la respuesta de las fechas seleccionadas.
   */
  getFechasSeleccionadas(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/105/fechasSeleccionadas.json').pipe(
    );
  }

  /**
   * Obtiene las opciones de fracción arancelaria.
   * @returns Observable con la respuesta de las opciones de fracción arancelaria.
   */
  getFraccionArancelariaOptions(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('https://api-v30.cloud-ultrasist.net/api/sat-t105/catalogo/fracciones-arancelarias').pipe(
    );
  }

  /**
   * Obtiene el catálogo de municipios o delegaciones.
   * @returns Observable con la respuesta del catálogo de municipios o delegaciones.
   */
  getMunicipioDelegacion(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('https://api-v30.cloud-ultrasist.net/api/sat-t105/catalogo/entidad-federativa/JAL/municipios-delegaciones').pipe(
    );
  }

  /**
   * Obtiene el catálogo de aduanas.
   * @returns Observable con la respuesta del catálogo de aduanas.
   */
  getAduana(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('https://api-v30.cloud-ultrasist.net/api/sat-t105/catalogo/aduanas').pipe(
    );
  }

    /**
   * Obtiene el catálogo de aduanas.
   * @returns Observable con la respuesta del catálogo de aduanas.
   */
  tipoDeFigura(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('https://api-v30.cloud-ultrasist.net/api/sat-t105/tipo-de-figura-enum').pipe(
    );
  }


  /**
   * Actualiza el estado del formulario con los datos proporcionados.
   *
   * Este método toma un objeto de tipo `Solicitud105State` y actualiza los diferentes
   * campos del store relacionados con la importación, exportación, domicilio, ubicación,
   * datos fiscales, aduana, fracción arancelaria, procedimientos y operaciones, entre otros.
   * 
   * @param datos - Objeto que contiene el estado actual del formulario `Solicitud105State`.
   */
  actualizarEstadoFormulario(datos:Solicitud105State): void {
  this.store.setImportacion(datos.importacion);
  this.store.setExportacion(datos.exportacion);
  this.store.setDepositoFiscalGas(datos.depositoFiscalGas);
  this.store.setDepositoFiscalVehiculos(datos.depositoFiscalVehiculos);
  this.store.setDistribucionGas(datos.distribucionGas);
  this.store.setServiciosTerceros(datos.serviciosTerceros);
  this.store.setIndustriaAutomotriz(datos.industriaAutomotriz);
  this.store.setDomicilio(datos.domicilio);
  this.store.setUbicacion(datos.ubicacion);
  this.store.setPais(datos.pais ?? '');
  this.store.setCodigoPostal(datos.codigoPostal);
  this.store.setEntidadFederativa(datos.entidadFederativa ?? '');
  this.store.setMunicipioDelegacion(datos.municipioDelegacion ?? '');
  this.store.setlocalidad(datos.localidad);
  this.store.setColonia(datos.colonia ?? '');
  this.store.setEntidadFederativaDos(datos.entidadFederativaDos);
  this.store.setCalle(datos.calle);
  this.store.setNumeroExterior(datos.numeroExterior);
  this.store.setNumeroInterior(datos.numeroInterior);
  this.store.setUbicacionDescripcion(datos.ubicacionDescripcion);
  this.store.setAduana(datos.aduana ?? '');
  this.store.setFraccionarancelaria(datos.fraccionarancelaria ?? '');
  this.store.setProcedimientoCargaDescarga(datos.procedimientoCargaDescarga);
  this.store.setSistemasMedicionUbicacion(datos.sistemasMedicionUbicacion);
  this.store.setMotivoNoDespachoAduana(datos.motivoNoDespachoAduana);
  this.store.setOperaciones(datos.operaciones ?? '');
}

/**
 * Obtiene los datos del registro de toma de muestras de mercancías.
 *
 * Realiza una solicitud HTTP GET para recuperar la información almacenada en el archivo JSON
 * correspondiente a la toma de muestras de mercancías para el trámite 105.
 *
 * @returns Un observable que emite el estado de la solicitud 105 (`Solicitud105State`).
 */
getRegistroTomaMuestrasMercanciasData(): Observable<Solicitud105State> {
    return this.http.get<Solicitud105State>('assets/json/105/registro_toma_muestras_mercancias.json');
  }

}
