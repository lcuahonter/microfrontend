import { ComplementarState, ComplementarStore } from '../../../estados/tramites/complementar.store';
import { ComplementosSeccionState, ComplementosSeccionStore } from '../../../estados/tramites/complementos-seccion.store';
import { FederatoriosState, FederatoriosStore } from '../../../estados/tramites/federatarios.store';
import { Solicitud80104State, Tramite80104Store } from '../../../estados/tramites/tramite80104.store';
import { Tramite80101State, Tramite80101Store } from '../estados/tramite80101.store';
import { ENVIRONMENT } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
/** Servicio responsable de la lógica del trámite 110203.  
 *  Maneja la comunicación con APIs y gestión de estado relacionada. */
export class Solocitud80103Service {
  /**
   * AppConfig es una inyección de dependencias que proporciona la configuración de la aplicación.
   */
  urlServer = ENVIRONMENT.URL_SERVER;
// URL base para consumir los catálogos auxiliares desde el servidor.
  urlServerCatalogos = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;

/** Constructor que inyecta servicios HTTP y el store del trámite 110203.  
 *  Utilizado para inicializar dependencias necesarias en el componente. */
  constructor(private http: HttpClient, private tramite80104Store: Tramite80104Store,private tramite80101Store:Tramite80101Store, private complementosSeccionStore: ComplementosSeccionStore,
    private federatoriosStore: FederatoriosStore, private complementarStore: ComplementarStore,
        ) {
    // Lógica de inicialización si es necesario ComplementarStore
  }
/** Actualiza el estado del formulario en el store con los datos proporcionados.  
 *  Establece el régimen seleccionado desde el objeto de estado.
 *  */
actualizarEstadoFormulario(DATOS: Solicitud80104State): void {
  this.tramite80104Store.setRfc(DATOS.rfc);
  this.tramite80104Store.setEstado(DATOS.estado);
  this.tramite80104Store.setDisponibles(DATOS.disponibles);
  this.tramite80104Store.setSeleccionadas(DATOS.seleccionadas);
  this.tramite80104Store.setFraccionArancelaria(DATOS.fraccionArancelaria);
  this.tramite80104Store.setDescripcion(DATOS.descripcion);
  this.tramite80104Store.setFraccionTres(DATOS.fraccionTres);
  this.tramite80104Store.setDescripcionTres(DATOS.descripcionTres);
  this.tramite80104Store.setAnexoDos(DATOS.anexoDos);
  this.tramite80104Store.setAnexoTres(DATOS.anexoTres);
  }
  /**
 * Actualiza todos los estados del store `Tramite80101Store` con los valores proporcionados.
 * Este método se utiliza generalmente para restaurar el estado previamente guardado del formulario.
 * Se asignan múltiples campos uno por uno al store para reflejar completamente el estado actual.
 *
 * @param {Tramite80101State} DATOS - Objeto que contiene todos los datos necesarios para actualizar el estado del formulario.
 */
actualizarEstadoFormularios(DATOS: Tramite80101State): void {
   this.tramite80101Store.setInfoRegistro(DATOS.infoRegistro);
  this.tramite80101Store.setAduanaDeIngreso(DATOS.aduanaDeIngreso);
  this.tramite80101Store.setDatosImmex(DATOS.datosImmex);
  this.tramite80101Store.setDatos(DATOS.datos);
  this.tramite80101Store.setAduanaDeIngresoSeleccion(DATOS.aduanaDeIngresoSelecion);
  this.tramite80101Store.setFormValida(DATOS.formaValida);
  this.tramite80101Store.setRfcEmpresa(DATOS.rfcEmpresa);
  this.tramite80101Store.setNumeroPrograma(DATOS.numeroPrograma);
  this.tramite80101Store.setTiempoPrograma(DATOS.tiempoPrograma);
  this.tramite80101Store.setAnnexoDosTableLista(DATOS.annexoDosTres?.anexoDosTablaLista);
  this.tramite80101Store.setAnnexoTresTableLista(DATOS.annexoDosTres?.anexoTresTablaLista);
  this.tramite80101Store.setindicePrevioRuta(DATOS.indicePrevioRuta);
  this.tramite80101Store.setAnnexoUnoSeccionActiva(DATOS.annexoUno?.seccionActiva);
  this.tramite80101Store.setDatosParaNavegar(DATOS.annexoUno?.datosParaNavegar);
  this.tramite80101Store.setImportarDatosTabla(DATOS.annexoUno?.importarDatosTabla);
  this.tramite80101Store.setExportarDatosTabla(DATOS.annexoUno?.exportarDatosTabla);
this.tramite80101Store.setCamposEmpresa(
  DATOS.rfcEmpresa,
  DATOS.numeroPrograma,
  DATOS.tiempoPrograma
);
this.tramite80101Store.setEmpresas(DATOS.empresas);
this.tramite80101Store.setServicios(DATOS.servicios);
this.tramite80101Store.setPaisesOrigen(DATOS.paisesOrigen);
this.tramite80101Store.eliminarDatosEmpresaExtranjera(DATOS.datosEmpresaExtranjera);
this.tramite80101Store.setDatosComplimentos(DATOS.datosComplimentos);
this.tramite80101Store.setDatosSubcontratista(DATOS.empressaSubFabricantePlantas.datosSubcontratista);
this.tramite80101Store.setPlantasSubfabricantesAgregar(DATOS.empressaSubFabricantePlantas.plantasSubfabricantesAgregar);
this.tramite80101Store.setPlantasBuscadas(DATOS.empressaSubFabricantePlantas.plantasBuscadas);
this.tramite80101Store.eliminarPlantas(DATOS.empressaSubFabricantePlantas.plantasBuscadas);
this.tramite80101Store.setPlantasPorCompletar(DATOS.empressaSubFabricantePlantas.plantasPorCompletar);
this.tramite80101Store.eliminarTablaDatosComplimentos(DATOS.tablaDatosComplimentos);
this.tramite80101Store.eliminarTablaDatosComplimentosExtranjera(DATOS.tablaDatosComplimentosExtranjera);
  }
/**
 * Actualiza dinámicamente los campos del estado `ComplementosSeccionStore` con los valores proporcionados.
 * Recorre todas las entradas del objeto `DATOS` y asigna cada valor al campo correspondiente en el store.
 * Este método es útil cuando se necesita una actualización flexible sin métodos específicos por campo.
 *
 * @param {ComplementosSeccionState} DATOS - Objeto con los valores a actualizar en el estado de complementos.
 */
actualizarComplementos(DATOS: ComplementosSeccionState): void {
  Object.entries(DATOS).forEach(([key, value]) => {
    this.complementosSeccionStore.setDynamicFieldValue(key, value);
  });
}
/**
 * Actualiza dinámicamente los campos del estado `FederatoriosStore` con los datos proporcionados.
 * Recorre cada entrada del objeto `DATOS` y asigna su valor correspondiente en el store utilizando claves dinámicas.
 * Este método permite una actualización general sin necesidad de definir un método específico por cada campo.
 *
 * @param {FederatoriosState} DATOS - Objeto con los valores del estado federatorio a actualizar.
 */
actualizarFederatorios(DATOS: FederatoriosState): void {
 Object.entries(DATOS).forEach(([key, value]) => {
    this.federatoriosStore.setDynamicFieldValue(key, value);
  });
}
/**
 * Actualiza los valores del estado `ComplementarStore` con los datos proporcionados.
 * Asigna uno por uno los campos almacenados en el objeto `DATOS` para restaurar o sincronizar el estado del formulario complementar.
 * Este método se utiliza cuando los datos deben ser cargados desde una fuente persistente como backend o localStorage.
 *
 * @param {ComplementarState} DATOS - Objeto con los valores que se desean establecer en el estado `ComplementarStore`.
 */
actualizarComplementar(DATOS: ComplementarState): void {
  this.complementarStore.setPermanecera(DATOS.permanecera);
  this.complementarStore.setTipo(DATOS.tipo);
  this.complementarStore.setFechaDeFirma(DATOS.fechaDeFirma);
  this.complementarStore.setFetchaDeFinDeVigencia(DATOS.fetchaDeFinDeVigencia);
  this.complementarStore.setTipos(DATOS.tipos);
  this.complementarStore.setCantidad(DATOS.cantidad);
  this.complementarStore.setDescripsion(DATOS.descripsion);
  this.complementarStore.setMnx(DATOS.mnx);
  this.complementarStore.setTotalDeEmpleados(DATOS.totalDeEmpleados);
  this.complementarStore.setDirectos(DATOS.directos);
  this.complementarStore.setIndirectos(DATOS.indirectos);
  this.complementarStore.setDirecto(DATOS.directo);
  this.complementarStore.setCedula(DATOS.cedula);
  this.complementarStore.setFechaCedula(DATOS.fechaCedula);
  this.complementarStore.setIndirectosDatos(DATOS.indirectosDatos);
  this.complementarStore.setContrato(DATOS.contrato);
  this.complementarStore.setObjeto(DATOS.objeto);
  this.complementarStore.setFechaFirma(DATOS.fechaFirma);
  this.complementarStore.setFechaFinVigencia(DATOS.fechaFinVigencia);
  this.complementarStore.setRfcEmpresa(DATOS.rfcEmpresa);
  this.complementarStore.setRazonSocial(DATOS.razonSocial);
  this.complementarStore.setFraccionArancelariaProductoTerminado(DATOS.fraccionArancelariaProductoTerminado);
  this.complementarStore.setUmt(DATOS.umt);
  this.complementarStore.setDescripcionComercialProductoTerminado(DATOS.descripcionComercialProductoTerminado);
  this.complementarStore.setTurnos(DATOS.turnos);
  this.complementarStore.setHorasPorTurno(DATOS.horasPorTurno);
  this.complementarStore.setCantidadEmpleados(DATOS.cantidadEmpleados);
  this.complementarStore.setCantidadMaquinaria(DATOS.cantidadMaquinaria);
  this.complementarStore.setDescripcionMaquinaria(DATOS.descripcionMaquinaria);
  this.complementarStore.setCapacidadInstaladaMensual(DATOS.capacidadInstaladaMensual);
  this.complementarStore.setCapacidadInstaladaAnual(DATOS.capacidadInstaladaAnual);
  this.complementarStore.setCalculoCapacidadInstalada(DATOS.calculoCapacidadInstalada);
  this.complementarStore.setCapacidadUtilizadaPct(DATOS.capacidadUtilizadaPct);
}

/** Obtiene los datos simulados del registro de toma de muestras de mercancías  
 *  desde un archivo JSON local para el trámite 110203. */
  getRegistroTomaMuestrasMercanciasData(): Observable<Solicitud80104State> {
    return this.http.get<Solicitud80104State>('assets/json/80104/serviciosExtraordinarios.json');
  }

  /** Obtiene los datos simulados del registro de toma de muestras de mercancías  
 *  desde un archivo JSON local para el trámite 110203. */
  getRegistroTomaMuestrasMercanciasDatas(): Observable<Tramite80101State> {
    return this.http.get<Tramite80101State>('assets/json/80104/serviciosExtraordinarios.json');
  }
    /** Obtiene los datos simulados del registro de toma de muestras de mercancías  
 *  desde un archivo JSON local para el trámite 110203. */
  getRegistroComplementosData(): Observable<ComplementosSeccionState> {
    return this.http.get<ComplementosSeccionState>('assets/json/80104/serviciosExtraordinarios.json');
  }
  getRegistroFederatoriosData(): Observable<FederatoriosState> {
    return this.http.get<FederatoriosState>('assets/json/80104/serviciosExtraordinarios.json');
  }
  getRegistroComplementarData(): Observable<ComplementarState> {
    return this.http.get<ComplementarState>('assets/json/80104/serviciosExtraordinarios.json');
  }

}