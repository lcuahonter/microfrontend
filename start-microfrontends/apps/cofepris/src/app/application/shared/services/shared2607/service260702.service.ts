import {
  Solicitud260702State,
  Solicitud260702Store,
} from '../../estados/stores/shared2607/tramites260702.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Service260702Service {
  /**
   * Constructor de la clase.
   *
   * Inyecta los servicios necesarios para:
   * - Realizar solicitudes HTTP al backend o a archivos locales (`HttpClient`).
   * - Gestionar el estado del trámite 260702 mediante el store (`Solicitud260702Store`).
   *
   * @param http Cliente HTTP de Angular para realizar peticiones.
   * @param tramite260702Store Store encargado de manejar el estado del trámite 260702.
   */
  constructor(
    private http: HttpClient,
    private tramite260702Store: Solicitud260702Store
  ) {
    // Lógica de inicialización si es necesario
  }

  /**
   * Actualiza el estado del formulario en el store `tramite260702Store`
   * utilizando los datos proporcionados en el objeto `DATOS`.
   *
   * Cada campo del estado `Solicitud260702State` se asigna a su correspondiente
   * método setter en el store, asegurando que el estado del trámite 260702
   * esté completamente sincronizado con los datos recibidos.
   *
   * @param DATOS Objeto de tipo `Solicitud260702State` que contiene los datos del formulario.
   */
  actualizarEstadoFormulario(DATOS: Solicitud260702State): void {
    this.tramite260702Store.setClaveDeReferencia(DATOS.clavedereferencia);
    this.tramite260702Store.setCadenaDelaDependencia(
      DATOS.cadenadeladependencia
    );
    this.tramite260702Store.setBanco(DATOS.banco);
    this.tramite260702Store.setLlavedoPago(DATOS.llavedepago);
    this.tramite260702Store.setFechadePago(DATOS.fechadepago);
    this.tramite260702Store.setImportedePago(DATOS.importedepago);
    this.tramite260702Store.setTipoOperacion(DATOS.tipoOperacion);
    this.tramite260702Store.setTableData(DATOS.tableData);
    this.tramite260702Store.setTableData2(DATOS.tableData2);
    this.tramite260702Store.setTipoPersona(DATOS.tipoPersona);
    this.tramite260702Store.setNombre(DATOS.nombre);
    this.tramite260702Store.setPrimerApellido(DATOS.primerApellido);
    this.tramite260702Store.setSegundoApellido(DATOS.segundoApellido);
    this.tramite260702Store.setDenominacion(DATOS.denominacion);
    this.tramite260702Store.setCorreoElectronico(DATOS.correoElectronico);
    this.tramite260702Store.setPais(DATOS.pais);
    this.tramite260702Store.setDomicilio(DATOS.domicilio);
    this.tramite260702Store.setEstado(DATOS.estado);
    this.tramite260702Store.setCodigoPostal(DATOS.codigopostal);
    this.tramite260702Store.setCalle(DATOS.calle);
    this.tramite260702Store.setNumeroExterior(DATOS.numeroExterior);
    this.tramite260702Store.setNumeroInterior(DATOS.numeroInterior);
    this.tramite260702Store.setLada(DATOS.lada);
    this.tramite260702Store.setTelefono(DATOS.telefono);
    this.tramite260702Store.setJustification(DATOS.justification);
    this.tramite260702Store.setMunicipoyalcaldia(DATOS.municipoyalcaldia);
    this.tramite260702Store.setLocalidad(DATOS.localidad);
    this.tramite260702Store.setColonia(DATOS.colonia);
    this.tramite260702Store.setAvisoDeFuncionamiento(
      DATOS.avisoDeFuncionamiento
    );
    this.tramite260702Store.setLicenciaSanitaria(DATOS.licenciaSanitaria);
    this.tramite260702Store.setRegimenalque(DATOS.regimenalque);
    this.tramite260702Store.setHacerlosPublicos(DATOS.hacerlosPublicos);
    this.tramite260702Store.setAduana(DATOS.aduana);
    this.tramite260702Store.setRfc(DATOS.rfc);
    this.tramite260702Store.setLegalRazonSocial(DATOS.legalRazonSocial);
    this.tramite260702Store.setApellidoPaterno(DATOS.apellidoPaterno);
    this.tramite260702Store.setApellidoMaterno(DATOS.apellidoMaterno);
    this.tramite260702Store.setMercanciasDatos(DATOS.mercanciasDatos);
    this.tramite260702Store.setConfiguracionColumnasoli(
      DATOS.configuracionColumnasoli
    );
    this.tramite260702Store.setListaClave(DATOS.listaClave);
    this.tramite260702Store.setClaveDeLosLotes(DATOS.claveDeLosLotes);
    this.tramite260702Store.setFechaDeFabricacion(DATOS.fechaDeFabricacion);
    this.tramite260702Store.setFechaDeCaducidad(DATOS.fechaDeCaducidad);
    this.tramite260702Store.setDescripcionFraccionArancelaria(
      DATOS.descripcionFraccionArancelaria
    );
    this.tramite260702Store.setCantidadUMT(DATOS.cantidadUMT);
    this.tramite260702Store.setUMT(DATOS.umt);
    this.tramite260702Store.setCantidadUMC(DATOS.cantidadUMC);
    this.tramite260702Store.setUMC(DATOS.umc);
    this.tramite260702Store.setTipoProducto(DATOS.tipoProducto);
    this.tramite260702Store.setClasificaionProductos(
      DATOS.clasificaionProductos
    );
    this.tramite260702Store.setEspecificarProducto(DATOS.especificarProducto);
    this.tramite260702Store.setNombreProductoEspecifico(
      DATOS.nombreProductoEspecifico
    );
    this.tramite260702Store.setMarca(DATOS.marca);
    this.tramite260702Store.setFraccionArancelaria(DATOS.fraccionArancelaria);
  }

  /**
   * Obtiene los datos del registro de toma de muestras de mercancías
   * desde un archivo JSON local correspondiente al trámite 260702.
   *
   * Realiza una solicitud HTTP GET para recuperar un objeto con la estructura
   * del estado `Solicitud260702State`.
   *
   * @returns Un observable que emite un objeto de tipo `Solicitud260702State`.
   */
  getRegistroTomaMuestrasMercanciasData(): Observable<Solicitud260702State> {
    return this.http.get<Solicitud260702State>(
      'assets/json/260702/registro_toma_muestras_mercancias.json'
    );
  }
}
