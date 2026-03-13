import {Observable , catchError, throwError , } from 'rxjs';

import {Catalogo ,RespuestaCatalogos} from '@libs/shared/data-access-user/src';

import { Injectable } from '@angular/core';
// import { HttpCoreService } from '@libs/shared/data-access-user/src';
import { HttpClient } from '@angular/common/http';

import { MercanciasTabla, RespuestaTabla } from '../components/domicillo/domicillo.component';
import { Solicitud260211State, Tramite260211Store } from '../../../estados/tramites/tramite260211.store';
import { Terceros260211State, Terceros260211Store } from '../../../estados/tramites/terceros260211.store';
import { ProductoResponse } from '../models/permiso-sanitario.enum';

/**
 * Servicio para gestionar funcionalidades relacionadas con el ámbito sanitario.
 *
 * Este servicio puede ser extendido para incluir métodos que interactúen
 * con APIs o manipulen datos relacionados con trámites sanitarios.
 */
@Injectable({
  providedIn: 'root',
})
export class SanitarioService {
  
  constructor( private http: HttpClient,
     private tramite260211Store: Tramite260211Store,
          private terceros260211Store: Terceros260211Store,
            

  ) { }
/**
 * 
 * @returns {Observable<Solicitud260211State>} Un observable que emite el estado de la solicitud.
 * @description
 */
   getSolicitudData(): Observable<Solicitud260211State> {
    return this.http.get<Solicitud260211State>('assets/json/260211/solicitude_data.json');
  }
  /**
 * Obtiene los datos de terceros desde un archivo JSON local.
 * Retorna un observable con el estado Terceros260211State.
 * Utilizado para precargar datos del formulario.
 */
   getTercerosData(): Observable<Terceros260211State> {
    return this.http.get<Terceros260211State>('assets/json/260211/tercerosdata.json');
  }

  /**
 * Obtiene datos relacionados con derechos desde un archivo JSON.
 *
 * @returns {Observable<unknown>} Un observable que emite los datos obtenidos.
 */

  getDatos(): Observable<unknown> {
    return this.http.get('assets/json/260211/derechos.json').pipe(
      catchError((error: unknown) => {
        return throwError(() => error);
      })
    );
 }

/**
 * Obtiene datos relacionados con proveedores desde un archivo JSON.
 *
 * @returns {Observable<unknown>} Un observable que emite los datos obtenidos.
 */
 getProveedordata(): Observable<unknown> {
  return this.http.get('assets/json/260211/proveedor.json').pipe(
    catchError((error: unknown) => {
      return throwError(() => error);
    })
  );
}

/**
 * Obtiene datos relacionados con localidades desde un archivo JSON.
 *
 * @returns {Observable<unknown>} Un observable que emite los datos obtenidos.
 */
getLocalidaddata(): Observable<unknown> {
  return this.http.get('assets/json/260211/estadolocalidad.json').pipe(
    catchError((error: unknown) => {
      return throwError(() => error);
    })
  );
}

/**
 * Obtiene datos relacionados con terceros desde un archivo JSON.
 *
 * @returns {Observable<PermisoModel[]>} Un observable que emite una lista de objetos `PermisoModel`.
 */

/**
 * Obtiene datos adicionales relacionados con terceros desde un archivo JSON.
 *
 * @returns {Observable<Catalogo[]>} Un observable que emite una lista de objetos `Catalogo`.
 */

getData(): Observable<Catalogo[]> {
  return this.http.get<Catalogo[]>('assets/json/260211/terceros-relacionadoes.json');
}
/*
  * Obtiene datos de permisos desde un archivo JSON.
  *
  * @returns {Observable<ProductoResponse[]>} Un observable que emite una lista de objetos `ProductoResponse`.
  */
getPermisoData(): Observable<ProductoResponse[]> {
  return this.http.get<ProductoResponse[]>('assets/json/260211/terceros-solicitute.json');
}
/**
 * 
 * @returns {Observable<RespuestaCatalogos>} Un observable que emite un objeto `RespuestaCatalogos` con los estados.
 */
obtenerEstadoList(): Observable<RespuestaCatalogos> {
  return this.http.get<RespuestaCatalogos>('assets/json/260211/seleccion.json');
}
/**
  * Obtiene datos de una tabla desde un archivo JSON.
  *
  * @returns {Observable<RespuestaTabla>} Un observable que emite un objeto `RespuestaTabla`.
  */

obtenerTablaDatos(): Observable<RespuestaTabla> {
  return this.http.get<RespuestaTabla>('assets/json/260211/tablaDatos.json');
}
/**
  * Obtiene datos relacionados con mercancías desde un archivo JSON.
  *
  * @returns {Observable<MercanciasTabla>} Un observable que emite un objeto `MercanciasTabla`.
  */

obtenerMercanciasDatos(): Observable<MercanciasTabla> {
  return this.http.get<MercanciasTabla>('assets/json/260211/mercanciasDatos.json');
}
/**
  * Actualiza el estado del formulario con los datos proporcionados.
  * @param DATOS - Objeto que contiene los datos del formulario.
  */
actualizarEstadoFormulario(DATOS: Solicitud260211State ): void {
  
    this.tramite260211Store.setRfcResponsableSanitario(DATOS.rfcResponsableSanitario);
    this.tramite260211Store.setDenominacion(DATOS.denominacion);
    this.tramite260211Store.setCorreo(DATOS.correo);
    this.tramite260211Store.setCodigoPostal(DATOS.codigoPostal);
    this.tramite260211Store.setEstado(DATOS.estado);
    this.tramite260211Store.setMuncipio(DATOS.muncipio);
    this.tramite260211Store.setLocalidad(DATOS.localidad);
    this.tramite260211Store.setColonia(DATOS.colonia);
    this.tramite260211Store.setCalle(DATOS.calle);  
    this.tramite260211Store.setLada(DATOS.lada);
    this.tramite260211Store.setTelefono(DATOS.telefono);
    this.tramite260211Store.setClaveScianModal(DATOS.claveScianModal);
    this.tramite260211Store.setClaveDescripcionModal(DATOS.claveDescripcionModal);
    this.tramite260211Store.setAvisoCheckbox(DATOS.avisoCheckbox);
    this.tramite260211Store.setLicenciaSanitaria(DATOS.licenciaSanitaria);
    this.tramite260211Store.setRegimen(DATOS.regimen);
    this.tramite260211Store.setAduanasEntradas(DATOS.aduanasEntradas);
    this.tramite260211Store.setNumeroPermiso(DATOS.numeroPermiso);
    this.tramite260211Store.setClasificacion(DATOS.clasificacion);
    this.tramite260211Store.setEspecificarClasificacionProducto(DATOS.especificarClasificacionProducto);
    this.tramite260211Store.setDenominacionEspecifica(DATOS.denominacionEspecifica);
    this.tramite260211Store.setDenominacionDistintiva(DATOS.denominacionDistintiva);
    this.tramite260211Store.setDenominacionComun(DATOS.denominacionComun);
    this.tramite260211Store.setTipoDeProducto(DATOS.tipoDeProducto);
    this.tramite260211Store.setEstadoFisico(DATOS.estadoFisico);
    this.tramite260211Store.setFraccionArancelaria(DATOS.fraccionArancelaria);
    this.tramite260211Store.setDescripcionFraccion(DATOS.descripcionFraccion);
    this.tramite260211Store.setCantidadUMT(DATOS.cantidadUMT);
    this.tramite260211Store.setUMT(DATOS.UMT);
    this.tramite260211Store.setCantidadUMC(DATOS.cantidadUMC);
    this.tramite260211Store.setUMC(DATOS.UMC);
    this.tramite260211Store.setPresentacion(DATOS.presentacion);
    this.tramite260211Store.setNumeroRegistro(DATOS.numeroRegistro);
    this.tramite260211Store.setFechaCaducidad(DATOS.fechaCaducidad);
    this.tramite260211Store.setCumplimiento(DATOS.cumplimiento);
    this.tramite260211Store.setRfc(DATOS.rfc);
    this.tramite260211Store.setNombre(DATOS.nombre);
    this.tramite260211Store.setApellidoPaterno(DATOS.apellidoPaterno);
    this.tramite260211Store.setApellidoMaterno(DATOS.apellidoMaterno);
    this.tramite260211Store.setMensaje(DATOS.mensaje);   
    this.tramite260211Store.setreferencia(DATOS.referencia);
    this.tramite260211Store.setcadenaDependencia(DATOS.cadenaDependencia);
    this.tramite260211Store.setbanco(DATOS.banco);
    this.tramite260211Store.setLlave(DATOS.Llave);
    this.tramite260211Store.settipoFetch(DATOS.deFetch);
    this.tramite260211Store.setimporte(DATOS.importe);   
  }
  /**
 * Actualiza el estado del store con los datos del formulario de terceros.
 * Sincroniza cada propiedad individual del estado usando los setters correspondientes.
 * Recibe un objeto completo de tipo Terceros260211State.
 */
  actualizarEstadoTercerosFormulario(DATOS: Terceros260211State): void {
  this.terceros260211Store.setTercerosNacionalidad(DATOS.tercerosNacionalidad);
  this.terceros260211Store.setTipoPersona(DATOS.tipoPersona);
  this.terceros260211Store.setRfc(DATOS.rfc);
  this.terceros260211Store.setNombre(DATOS.nombre);
  this.terceros260211Store.setPrimerApellido(DATOS.primerApellido);
  this.terceros260211Store.setSegundoApellido(DATOS.segundoApellido);
  this.terceros260211Store.setCurp(DATOS.curp);
  this.terceros260211Store.setDenominacionRazonSocial(DATOS.denominacionRazonSocial);
  this.terceros260211Store.setPais(DATOS.pais);
  this.terceros260211Store.setEstadoLocalidad(DATOS.estadoLocalidad);
  this.terceros260211Store.setMunicipioAlcaldia(DATOS.municipioAlcaldia);
  this.terceros260211Store.setLocalidad(DATOS.localidad);
  this.terceros260211Store.setCodigoPostaloEquivalente(DATOS.codigoPostaloEquivalente);
  this.terceros260211Store.setColonia(DATOS.colonia);
  this.terceros260211Store.setExtranjeroEstado(DATOS.extranjeroEstado);
  this.terceros260211Store.setExtranjeroCodigo(DATOS.extranjeroCodigo);
  this.terceros260211Store.setExtranjeroColonia(DATOS.extranjeroColonia);
  this.terceros260211Store.setCalle(DATOS.calle);
  this.terceros260211Store.setNumeroExterior(DATOS.numeroExterior);
  this.terceros260211Store.setNumeroInterior(DATOS.numeroInterior);
  this.terceros260211Store.setLada(DATOS.lada);
  this.terceros260211Store.setTelefono(DATOS.telefono);
  this.terceros260211Store.setCorreoElectronico(DATOS.correoElectronico);
  this.terceros260211Store.setColoniaoEquivalente(DATOS.coloniaoEquivalente);
  this.terceros260211Store.setColoniaoEquivalenteLabel(DATOS.coloniaoEquivalenteLabel);
  this.terceros260211Store.setCodigoPostaloEquivalentes(DATOS.codigoPostaloEquivalentes);
  this.terceros260211Store.setEstado(DATOS.estado);
  this.terceros260211Store.setEntidadFederativa(DATOS.entidadFederativa);
}

}

 
