import { FilaData2, FilaTablaData } from '../models/fila-modal';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TramitesAsociados } from '../models/destinatario.model';

import { Solicitud260919State, Solicitud260919Store } from '../estados/tramites260919.store';
/**
 * Servicio para importar datos relacionados con remedios herbales.
 * Este servicio realiza solicitudes HTTP para obtener datos desde archivos JSON.
 */
@Injectable({
  providedIn: 'root'
})
export class ImportarDeRemediosHerbalsService {
  /**
   * Constructor del servicio.
   * @param http Cliente HTTP para realizar solicitudes a los recursos.
   */
  constructor(private http: HttpClient, private solicitud260919Store: Solicitud260919Store) {}
  /**
 * Método para actualizar el estado del formulario.
 * Establece los valores del estado en el store correspondiente.
 * @param DATOS - Objeto que contiene los datos del estado de la solicitud.
 */
  actualizarEstadoFormulario(DATOS: Solicitud260919State): void {
     this.solicitud260919Store.setClaveDeReferencia(DATOS.clavedereferencia);
     this.solicitud260919Store.setCadenaDelaDependencia(DATOS.cadenadeladependencia);
     this.solicitud260919Store.setBanco(DATOS.banco);
     this.solicitud260919Store.setLlavedoPago(DATOS.llavedepago);
     this.solicitud260919Store.setFechadePago(DATOS.fechadepago);
     this.solicitud260919Store.setImportedePago(DATOS.importedepago);   
     this.solicitud260919Store.setTipoPersona(DATOS.tipoPersona); 
     this.solicitud260919Store.setNombre(DATOS.nombre);
     this.solicitud260919Store.setPrimerApellido(DATOS.primerApellido);
     this.solicitud260919Store.setSegundoApellido(DATOS.segundoApellido);
     this.solicitud260919Store.setDenominacion(DATOS.denominacion);
     this.solicitud260919Store.setCorreoElectronico(DATOS.correoElectronico);
     this.solicitud260919Store.setPais(DATOS.pais);   
     this.solicitud260919Store.setDomicilio(DATOS.domicilio); 
     this.solicitud260919Store.setEstado(DATOS.estado);
     this.solicitud260919Store.setCodigoPostal(DATOS.codigopostal);
     this.solicitud260919Store.setCalle(DATOS.calle);
     this.solicitud260919Store.setNumeroExterior(DATOS.numeroExterior);
     this.solicitud260919Store.setNumeroInterior(DATOS.numeroInterior);
     this.solicitud260919Store.setLada(DATOS.lada);   
     this.solicitud260919Store.setTelefono(DATOS.telefono); 
     this.solicitud260919Store.setJustification(DATOS.justification);
     this.solicitud260919Store.setMunicipoyalcaldia(DATOS.municipoyalcaldia);
     this.solicitud260919Store.setLocalidad(DATOS.localidad);
     this.solicitud260919Store.setColonia(DATOS.colonia);
     this.solicitud260919Store.setAvisoDeFuncionamiento(DATOS.avisoDeFuncionamiento);
     this.solicitud260919Store.setTipoOperacion(DATOS.tipoOperacion);   
     this.solicitud260919Store.setLicenciaSanitaria(DATOS.licenciaSanitaria);   
     this.solicitud260919Store.setRegimenalque(DATOS.regimenalque);
     this.solicitud260919Store.setAduana(DATOS.aduana);
     this.solicitud260919Store.setRfc(DATOS.rfc);
     this.solicitud260919Store.setLegalRazonSocial(DATOS.legalRazonSocial);
     this.solicitud260919Store.setApellidoPaterno(DATOS.apellidoPaterno);
     this.solicitud260919Store.setApellidoMaterno(DATOS.apellidoMaterno);   
     this.solicitud260919Store.setMercanciasDatos(DATOS.mercanciasDatos);      
     this.solicitud260919Store.setConfiguracionColumnasoli(DATOS.configuracionColumnasoli);
     this.solicitud260919Store.setClaveDeLosLotes(DATOS.claveDeLosLotes);
     this.solicitud260919Store.setFechaDeFabricacion(DATOS.fechaDeFabricacion);
     this.solicitud260919Store.setFechaDeCaducidad(DATOS.fechaDeCaducidad);
     this.solicitud260919Store.setDescripcionFraccionArancelaria(DATOS.descripcionFraccionArancelaria);
     this.solicitud260919Store.setCantidadUMT(DATOS.cantidadUMT);   
     this.solicitud260919Store.setUMT(DATOS.umt);        
     this.solicitud260919Store.setCantidadUMC(DATOS.cantidadUMC);
     this.solicitud260919Store.setUMC(DATOS.umc);
     this.solicitud260919Store.setTipoProducto(DATOS.tipoProducto);
     this.solicitud260919Store.setClasificaionProductos(DATOS.clasificaionProductos);
     this.solicitud260919Store.setEspecificarProducto(DATOS.especificarProducto);
     this.solicitud260919Store.setNombreProductoEspecifico(DATOS.nombreProductoEspecifico);   
     this.solicitud260919Store.setDenominacionDistintiva(DATOS.denominacionDistintiva);         
     this.solicitud260919Store.setFraccionArancelaria(DATOS.fraccionArancelaria);
     this.solicitud260919Store.setDenominacionNombre(DATOS.denominacionNombre);
     this.solicitud260919Store.setEstadoFisico(DATOS.estadoFisico);
     this.solicitud260919Store.setPresentacionFarmaceutica(DATOS.presentacionFarmaceutica);
     this.solicitud260919Store.setRfcDel(DATOS.rfcDel);
     this.solicitud260919Store.setNumeroDeRegistoSanitario(DATOS.numeroDeRegistoSanitario);   
     this.solicitud260919Store.setPresentacion(DATOS.presentacion);        
     this.solicitud260919Store.setFormaFarmaceutica(DATOS.formaFarmaceutica);
     this.solicitud260919Store.setClaveScian(DATOS.claveScian);
      this.solicitud260919Store.setDescripcionDelScian(DATOS.descripcionDelScian);
      this.solicitud260919Store.setNumeroDeRegistroSanitario(DATOS.numeroDeRegistroSanitario);  
      this.solicitud260919Store.setCumplocon(DATOS.cumplocon);  
      this.solicitud260919Store.setHacerlosRadioOptions(DATOS.hacerlosRadioOptions);
      this.solicitud260919Store.setCurp(DATOS.curp);  
      this.solicitud260919Store.setNacionalidad(DATOS.nacionalidad);  

  }
  
  /**
 * Método para obtener los datos de consulta desde un archivo JSON.
 * @returns Observable con los datos del estado de la solicitud.
 */
  getConsultaData(): Observable<Solicitud260919State> {
    return this.http.get<Solicitud260919State>('assets/json/260919/consulta.json');
  }

  /**
   * Obtiene los datos de los estados desde un archivo JSON.
   * @returns Observable con la lista de estados.
   */
  getEstadosData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('./assets/json/260919/estado.json');
  }

  /**
   * Obtiene los datos de las claves SCIAN desde un archivo JSON.
   * @returns Observable con la lista de claves SCIAN.
   */
  getClaveScianData(): Observable<Catalogo[]> {
      return this.http.get<Catalogo[]>('./assets/json/260919/clavescian.json');
    }
  
    /**
     * Obtiene los datos de las descripciones de claves desde un archivo JSON.
     * @returns Observable con la lista de descripciones de claves.
     */
    getClaveDescripcionDelData(): Observable<Catalogo[]> {
      return this.http.get<Catalogo[]>('./assets/json/260919/clavedescripciondel.json');
    }
  

  /**
   * Obtiene los datos del régimen desde un archivo JSON.
   * @returns Observable con la lista de regímenes.
   */
  getRegimenalqueData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('./assets/json/260919/regimen.json');
  }

  /**
   * Obtiene los datos de las aduanas desde un archivo JSON.
   * @returns Observable con la lista de aduanas.
   */
  getAduanaData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('./assets/json/260919/adauna.json');
  }

  /**
   * Obtiene los datos de los bancos desde un archivo JSON.
   * @returns Observable con la lista de bancos.
   */
  getBancoData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('./assets/json/260919/banco.json');
  }

  /**
   * Obtiene los datos de los trámites asociados desde un archivo JSON.
   * @returns Observable con la lista de trámites asociados.
   */
  getTramitesAsociados(): Observable<TramitesAsociados[]> {
    return this.http.get<TramitesAsociados[]>('./assets/json/260919/tramitesasociados.json');
  }

  /**
   * Obtiene los datos de las mercancías desde un archivo JSON.
   * @returns Observable con la lista de mercancías.
   */
  getMercanciasData(): Observable<FilaData2[]> {
    return this.http.get<FilaData2[]>('./assets/json/260919/mercanciatabla.json');
  }

  /**
   * Obtiene los datos de los fabricantes desde un archivo JSON.
   * @returns Observable con la lista de fabricantes.
   */
  getFabricanteData(): Observable<FilaTablaData[]> {
    return this.http.get<FilaTablaData[]>('./assets/json/260919/fabricante.json');
  }

/**
 * Obtiene los datos del tipo de producto desde un archivo JSON.
 * @returns Observable con la lista de tipos de producto.
 */
getTipoProductoData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('./assets/json/260919/tipoproducto.json');
}

/**
 * Obtiene los datos de la clasificación del producto desde un archivo JSON.
 * @returns Observable con la lista de clasificaciones del producto.
 */
getClasificacionDelProductoData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('./assets/json/260919/delproducto.json');
}

/**
 * Obtiene los datos del estado físico desde un archivo JSON.
 * @returns Observable con la lista de estados físicos.
 */
getEstadoFisicoData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('./assets/json/260919/estadofisico.json');
}
  /**
   * Obtiene los datos para especificar productos desde un archivo JSON.
   * @returns Observable con la lista de especificaciones de productos.
   */
  getEspificarData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('./assets/json/260919/espicificar.json');
  }

  /**
   * Obtiene los datos de los destinatarios desde un archivo JSON.
   * @returns Observable con la lista de destinatarios.
   */
  getDestinatarioData(): Observable<FilaTablaData[]> {
    return this.http.get<FilaTablaData[]>('./assets/json/260919/destinatario.json');
  }

  /**
   * Obtiene los datos de los proveedores desde un archivo JSON.
   * @returns Observable con la lista de proveedores.
   */
  getProveedorData(): Observable<FilaTablaData[]> {
    return this.http.get<FilaTablaData[]>('./assets/json/260919/proveedor.json');
  }

  /**
   * Obtiene los datos de los facturadores desde un archivo JSON.
   * @returns Observable con la lista de facturadores.
   */
  getFacturadorData(): Observable<FilaTablaData[]> {
    return this.http.get<FilaTablaData[]>('./assets/json/260919/facturador.json');
  }

  /**
 * Obtiene los datos de la solicitud desde un archivo JSON.
 * @returns Observable con la lista de trámites asociados.
 */
  getSolicitudData(): Observable<TramitesAsociados[]> {
      return this.http.get<TramitesAsociados[]>('./assets/json/260919/solicitud.json');
    }

    /**
   * Obtiene los datos de los países desde un archivo JSON.
   * @returns Observable con la lista de países.
   */
  getPaisData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('./assets/json/260919/pais.json');
  }
  /**
 * Obtiene los datos del crosslist de mercancías desde un archivo JSON.
 * @returns Observable con los datos del crosslist.
 */
getMercanciaCrosslistData(): Observable<unknown> {
  return this.http.get<unknown>('assets/json/260919/mercancia-crosslist.json');
}
}