import {
  AvisoSanitarioState,
  Tramite260601Store,
} from '../../../estados/tramites/tramite260601.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tramite260601Query } from '../../../estados/queries/tramite260601.query';

@Injectable({
  providedIn: 'root',
})
export class Service260601Service {
  /**
   * Constructor de la clase.
   *
   * Inyecta los servicios necesarios para:
   * - Realizar solicitudes HTTP al backend o a archivos locales.
   * - Gestionar el estado del trámite 260601 mediante el store.
   *
   * @param http Cliente HTTP de Angular para realizar peticiones.
   * @param tramite260601Store Store encargado de manejar el estado del trámite 260601.
   */
  constructor(
    private http: HttpClient,
    private tramite260601Store: Tramite260601Store,
    private query: Tramite260601Query
  ) {
    // Lógica de inicialización si es necesario
  }

  /**
   * Actualiza el estado del formulario en el store `tramite260601Store`
   * utilizando los datos proporcionados en el objeto `DATOS`.
   *
   * Este método sincroniza el estado del trámite con la información contenida
   * en el objeto `AvisoSanitarioState`.
   *
   * @param DATOS Objeto de tipo `AvisoSanitarioState` que contiene los datos del formulario.
   */
  actualizarEstadoFormulario(DATOS: AvisoSanitarioState): void {
    this.tramite260601Store.setTercerosNacionalidadFabricante(
      DATOS.tercerosNacionalidadFabricante
    );
    this.tramite260601Store.setTipoPersonaFabricante(
      DATOS.tipoPersonaFabricante
    );
    this.tramite260601Store.setRfcFabricante(DATOS.rfcFabricante);
    this.tramite260601Store.setRfcFabricanteInhabilitar(
      DATOS.rfcFabricanteInhabilitar
    );
    this.tramite260601Store.setCurpFabricanteInhabilitar(
      DATOS.curpFabricanteInhabilitar
    );
    this.tramite260601Store.setCurpFabricante(DATOS.curpFabricante);
    this.tramite260601Store.setFabricanteNombre(DATOS.fabricanteNombre);
    this.tramite260601Store.setFabricanteNombreInhabilitar(
      DATOS.fabricanteNombreInhabilitar
    );
    this.tramite260601Store.setFabricantePrimerApellido(
      DATOS.fabricantePrimerApellido
    );
    this.tramite260601Store.setFabricantePrimerApellidoInhabilitar(
      DATOS.fabricantePrimerApellidoInhabilitar
    );
    this.tramite260601Store.setFabricanteSegundoApellido(
      DATOS.fabricanteSegundoApellido
    );
    this.tramite260601Store.setFabricanteSegundoApellidoInhabilitar(
      DATOS.fabricanteSegundoApellidoInhabilitar
    );
    this.tramite260601Store.setFabricanteRazonSocial(
      DATOS.fabricanteRazonSocial
    );
    this.tramite260601Store.setFabricanteRazonSocialInhabilitar(
      DATOS.fabricanteRazonSocialInhabilitar
    );
    this.tramite260601Store.setPaisFabricante(DATOS.cvePaisFabricante);
    this.tramite260601Store.setPaisFabricanteInhabilitar(
      DATOS.cvePaisFabricanteInhabilitar
    );
    this.tramite260601Store.setEstadoFabricanteInhabilitar(
      DATOS.estadoFabricanteInhabilitar
    );
    this.tramite260601Store.setAlcaldiaFabricante(DATOS.alcaldiaFabricante);
    this.tramite260601Store.setAlcaldiaFabricanteInhabilitar(
      DATOS.alcaldiaFabricanteInhabilitar
    );
    this.tramite260601Store.setLocalidadFabricante(DATOS.localidadFabricante);
    this.tramite260601Store.setLocalidadFabricanteInhabilitar(
      DATOS.localidadFabricanteInhabilitar
    );
    this.tramite260601Store.setCodigoPostalFabricante(
      DATOS.codigoPostalFabricante
    );
    this.tramite260601Store.setCodigoPostalInhabilitar(
      DATOS.codigoPostalFabricanteInhabilitar
    );
    this.tramite260601Store.setColoniaFabricante(DATOS.coloniaFabricante);
    this.tramite260601Store.setColoniaFabricanteInhabilitar(
      DATOS.coloniaFabricanteInhabilitar
    );
    this.tramite260601Store.setCalleFabricante(DATOS.domicilioCalle);
    this.tramite260601Store.setCalleFabricanteInhabilitar(
      DATOS.calleFabricanteInhabilitar
    );
    this.tramite260601Store.setNumeroExteriorFabricante(
      DATOS.numeroExteriorFabricante
    );
    this.tramite260601Store.setNumeroExteriorFabricanteInhabilitar(
      DATOS.numeroExteriorFabricanteInhabilitar
    );
    this.tramite260601Store.setNumeroInteriorFabricante(
      DATOS.numeroInteriorFabricante
    );
    this.tramite260601Store.setNumeroInteriorFabricanteInhabilitar(
      DATOS.numeroInteriorFabricanteInhabilitar
    );
    this.tramite260601Store.setLadaFabricante(DATOS.ladaFabricante);
    this.tramite260601Store.setLadaFabricanteInhabilitar(
      DATOS.ladaFabricanteInhabilitar
    );
    this.tramite260601Store.setTelefonoFabricante(DATOS.telefonoFabricante);
    this.tramite260601Store.setTelefonoFabricanteInhabilitar(
      DATOS.telefonoFabricanteInhabilitar
    );
    this.tramite260601Store.setCorreoElectronicoFabricante(
      DATOS.correoElectronicoFabricante
    );
    this.tramite260601Store.setCorreoElectronicoFabricanteInhabilitar(
      DATOS.correoElectronicoFabricanteInhabilitar
    );
    this.tramite260601Store.setMostrarRfcFabricanteBuscarBoton(
      DATOS.mostrarRfcFabricanteBuscarBoton
    );
    this.tramite260601Store.setMostrarCurpFabricanteBuscarBoton(
      DATOS.mostrarCurpFabricanteBuscarBoton
    );
    this.tramite260601Store.setInhabilitarPaisFabricante(
      DATOS.inhabilitarPaisFabricante
    );
    this.tramite260601Store.setTercerosNacionalidad(DATOS.tercerosNacionalidad);
    this.tramite260601Store.setTipoPersona(DATOS.tipoPersona);
    this.tramite260601Store.setRfcProveedor(DATOS.rfcProveedor);
    this.tramite260601Store.setRfcProveedorInhabilitar(
      DATOS.rfcProveedorInhabilitar
    );
    this.tramite260601Store.setCurpInhabilitar(DATOS.curpInhabilitar);
    this.tramite260601Store.setCurp(DATOS.curp);
    this.tramite260601Store.setProveedorNombre(DATOS.proveedorNombre);
    this.tramite260601Store.setProveedorNombreInhabilitar(
      DATOS.proveedorNombreInhabilitar
    );
    this.tramite260601Store.setProveedorPrimerApellido(
      DATOS.proveedorPrimerApellido
    );
    this.tramite260601Store.setProveedorPrimerApellidoInhabilitar(
      DATOS.proveedorPrimerApellidoInhabilitar
    );
    this.tramite260601Store.setProveedorSegundoApellido(
      DATOS.proveedorSegundoApellido
    );
    this.tramite260601Store.setProveedorSegundoApellidoInhabilitar(
      DATOS.proveedorSegundoApellidoInhabilitar
    );
    this.tramite260601Store.setProveedorRazonSocial(DATOS.proveedorRazonSocial);
    this.tramite260601Store.setProveedorRazonSocialInhabilitar(
      DATOS.proveedorRazonSocialInhabilitar
    );
    this.tramite260601Store.setPais(DATOS.cvePais);
    this.tramite260601Store.setPaisInhabilitar(DATOS.cvePaisInhabilitar);
    this.tramite260601Store.setDomicilioEstado(DATOS.domicilioEstado);
    this.tramite260601Store.setDomicilioEstadoInhabilitar(
      DATOS.domicilioEstadoInhabilitar
    );
    this.tramite260601Store.setAlcaldia(DATOS.alcaldia);
    this.tramite260601Store.setAlcaldiaInhabilitar(DATOS.alcaldiaInhabilitar);
    this.tramite260601Store.setLocalidad(DATOS.localidad);
    this.tramite260601Store.setLocalidadInhabilitar(DATOS.localidadInhabilitar);
    this.tramite260601Store.setDomicilioCodigoPostal(
      DATOS.domicilioCodigoPostal
    );
    this.tramite260601Store.setDomicilioCodigoPostalInhabilitar(
      DATOS.domicilioCodigoPostalInhabilitar
    );
    this.tramite260601Store.setColonia(DATOS.colonia);
    this.tramite260601Store.setColoniaInhabilitar(DATOS.coloniaInhabilitar);
    this.tramite260601Store.setDomicilioCalle(DATOS.domicilioCalle);
    this.tramite260601Store.setDomicilioCalleInhabilitar(
      DATOS.domicilioCalleInhabilitar
    );
    this.tramite260601Store.setNumeroExterior(DATOS.numeroExterior);
    this.tramite260601Store.setNumeroExteriorInhabilitar(
      DATOS.numeroExteriorInhabilitar
    );
    this.tramite260601Store.setNumeroInterior(DATOS.numeroInterior);
    this.tramite260601Store.setNumeroInteriorInhabilitar(
      DATOS.numeroInteriorInhabilitar
    );
    this.tramite260601Store.setDomicilioLada(DATOS.domicilioLada);
    this.tramite260601Store.setDomicilioLadaInhabilitar(
      DATOS.domicilioLadaInhabilitar
    );
    this.tramite260601Store.setDomicilioTelefono(DATOS.domicilioTelefono);
    this.tramite260601Store.setDomicilioTelefonoInhabilitar(
      DATOS.domicilioTelefonoInhabilitar
    );
    this.tramite260601Store.setDomicilioCorreoElectronico(
      DATOS.domicilioCorreoElectronico
    );
    this.tramite260601Store.setDomicilioCorreoElectronicoInhabilitar(
      DATOS.domicilioCorreoElectronicoInhabilitar
    );
    this.tramite260601Store.setMostrarRfcBuscarBoton(
      DATOS.mostrarRfcBuscarBoton
    );
    this.tramite260601Store.setMostrarCurpBuscarBoton(
      DATOS.mostrarCurpBuscarBoton
    );
    this.tramite260601Store.setInhabilitarPais(DATOS.inhabilitarPais);
    this.tramite260601Store.updateProveedorTablaDatos(
      DATOS.proveedorTablaDatos
    );
    this.tramite260601Store.updateFabricanteTablaDatos(
      DATOS.fabricanteTablaDatos
    );
    this.tramite260601Store.setProductoTabla(DATOS.productoBodyData);
    this.tramite260601Store.setScianTabla(DATOS.scianBodyData);
  }

  /**
   * Obtiene los datos del registro de toma de muestras de mercancías
   * desde un archivo JSON local correspondiente al trámite 260601.
   *
   * Realiza una solicitud HTTP GET para recuperar un objeto con la estructura
   * del estado `AvisoSanitarioState`.
   *
   * @returns Un observable que emite un objeto de tipo `AvisoSanitarioState`.
   */
  getRegistroTomaMuestrasMercanciasData(): Observable<AvisoSanitarioState> {
    return this.http.get<AvisoSanitarioState>(
      'assets/json/260601/registro_toma_muestras_mercancias.json'
    );
  }

  getAllState(): Observable<AvisoSanitarioState> {
    return this.query.selectSeccionState$;
  }
}
