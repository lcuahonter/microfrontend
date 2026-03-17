import { ENVIRONMENT } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ComplementarState, ComplementarStore } from '../../../estados/tramites/complementar.store';
import { ComplementosSeccionState, ComplementosSeccionStore } from '../../../estados/tramites/complementos-seccion.store';
import { FederatoriosState, FederatoriosStore } from '../../../estados/tramites/federatarios.store';
import { Solicitud80104State, Tramite80104Store } from '../../../estados/tramites/tramite80104.store';
import { HttpCoreService, JSONResponse } from '@libs/shared/data-access-user/src';
import { PROC_80104 } from '../servers/api-route';
import { DatosParaNavegar, ProveedorClienteDatosTabla } from '../models/nuevo-programa-industrial.model';
import { Tramite80101State, Tramite80101Store } from '../estados/tramite80101.store';


@Injectable({
  providedIn: 'root',
})
/** Servicio responsable de la lógica del trámite 110203.  
 *  Maneja la comunicación con APIs y gestión de estado relacionada. */
export class Solocitud80104Service {
  /**
   * AppConfig es una inyección de dependencias que proporciona la configuración de la aplicación.
   */
  urlServer = ENVIRONMENT.URL_SERVER;
  // URL base para consumir los catálogos auxiliares desde el servidor.
  urlServerCatalogos = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;

  /** Constructor que inyecta servicios HTTP y el store del trámite 110203.  
   *  Utilizado para inicializar dependencias necesarias en el componente. */
  constructor(private http: HttpClient, public httpService: HttpCoreService, private tramite80104Store: Tramite80104Store, private tramite80101Store: Tramite80101Store, private complementosSeccionStore: ComplementosSeccionStore,
    private federatoriosStore: FederatoriosStore, private complementarStore: ComplementarStore,
  ) {
    // Lógica de inicialización si es necesario 
  }
  /** Actualiza el estado del formulario en el store con los datos proporcionados.  
   *  Establece el régimen seleccionado desde el objeto de estado.
   *  */
  actualizarEstadoFormulario(DATOS: Tramite80101State): void {
    this.tramite80101Store.update(DATOS);
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

  /** Obtiene los datos de una solicitud específica mediante su ID. */
  getMostrarSolicitud(id: string): Observable<JSONResponse> {
    return this.httpService.get<JSONResponse>(PROC_80104.MOSTRAR(id));
  }

  /** Reconstruye el estado completo de la solicitud del trámite 110222 a partir del objeto recibido. */
  reverseBuildSolicitud80104(
    built: Record<string, unknown>
  ): Record<string, unknown> {
    const solicitudData = (built['solicitud'] as Record<string, unknown>) || {};
    const anexoData = (built['anexo'] as Record<string, unknown>) || {};

    return {
      datosComplimentos: this.reverseMapComplimentos(solicitudData),
      tablaDatosComplimentos: this.reverseMapSociosAccionistas(built['sociosAccionistas']),
      tablaDatosFederatarios: this.reverseMapDatosFederatarios(built['notarios']),
      plantasImmexTablaLista: this.reverseMapPlantasCompletas(solicitudData),
      empressaSubFabricantePlantas: {
        plantasSubfabricantesAgregar: this.reverseMapPlantasSubmanufactureras(built['plantasSubmanufactureras'])
      },
      datos: this.reverseMapEmpresasNacionales(built['empresasNacionales']),
      datosEmpresaExtranjera: this.reverseMapEmpresasExtranjeras(built['empresasExtranjeras']),
      annexoUno: this.reverseMapAnexoCompleto(anexoData),
      annexoDosTres: {
        anexoDosTablaLista: this.reverseMapAnexoItems(anexoData['ANEXOII']),
        anexoTresTablaLista: this.reverseMapAnexoItems(anexoData['ANEXOIII']),
      },
      proyectoImmexTablaLista: this.reverseMapProyectoImmex(anexoData['proyectoimex']),
      tablaDatosCapacidadInstalada: this.reverseMapCapacidadInstalada(solicitudData['LISTA_CAPACIDAD']),
      montosDeInversionTablaDatos: this.reverseMapMontosInversion(solicitudData['MONTOS']),
      empleadosTablaDatos: this.reverseMapEmpleados(solicitudData['DATOS_EMPLEADOS']),
      complementarPlantaDatos: this.reverseMapDatosComplementarios(solicitudData['DATOS_COMPLEMENTARIOS']),
      complementarFirmanteDatos: this.reverseMapFirmantes(solicitudData['FIRMANTES'])
    };
  }

  /**
 * Mapea los datos de cumplimentos desde la solicitud recibida.
 * @param solicitud
 * @returns 
 */
  private reverseMapComplimentos(solicitud: unknown): Record<string, unknown> {
    const DATA = (solicitud as Record<string, unknown>) ?? {};
    const NOTARIO = (DATA?.['notario'] as Record<string, unknown>) ?? {};
    return {
      formaModificaciones: {
        rfc: NOTARIO['rfc'] ?? '',
        nombreDeActa: NOTARIO['numeroActa'] ?? '',
        nombreDeNotaria: NOTARIO['numeroNotario'] ?? '',
        estado: NOTARIO['entidadFederativa'] ?? '',
        fechaDeActa: NOTARIO['fechaActa'] ?? '',
        nombreDelFederatario: DATA['nomOficialAutorizado'] ?? ''
      },
      modalidad: DATA['modalidad'] ?? '',
      programaPreOperativo: DATA['booleanGenerico'] ?? false,
      datosGeneralis: {
        paginaWWeb: DATA['descripcionSistemasMedicion'] ?? '',
        localizacion: DATA['descripcionLugarEmbarque'] ?? '',
      },
      obligacionesFiscales: {
        opinionPositiva: DATA['numeroPermiso'] === 'SI' ? '1' : '0',
        fechaExpedicion: DATA['fechaOperacion'] ?? '',
        aceptarObligacionFiscal: true 
      },
    };
  }

  /**
   * Mapea los datos de socios accionistas desde la solicitud recibida.
   * @param socios
   * @returns
   */
  private reverseMapSociosAccionistas(socios: unknown): unknown[] {
    const DATA = (socios as Record<string, unknown>[]) ?? [];
    return DATA.map((socio) => ({
      nombre: socio['nombre'] ?? '',
      apellidoPaterno: socio['apellidoPaterno'] ?? '',
      apellidoMaterno: socio['apellidoMaterno'] ?? '',
      rfc: socio['rfc'] ?? '',
      correoElectronico: socio['correoElectronico'] ?? '',
      razonSocial: socio['razonSocial'] ?? '',
      estado: socio['estadoEntidad'] ?? '',
      pais: socio['cvePaisOrigen'] ?? '',
      taxId: socio['rfcExtranjero'] ?? '',
      codigoPostal: (socio['domicilio'] as Record<string, unknown>)?.[
        'codigoPostal'
      ] ?? '',
    }));
  }

  /**
   * Mapea los datos de notarios/federatarios desde la solicitud recibida.
   * @param notarios
   * @returns
   */
  private reverseMapDatosFederatarios(notarios: unknown): unknown[] {
    const DATA = (notarios as Record<string, unknown>[]) ?? [];
    return DATA.map((notario) => ({
      nombre: notario['nombreNotario'] ?? '',
      segundoApellido: notario['apellidoMaterno'] ?? '',
      primerApellido: notario['apellidoPaterno'] ?? '',
      numeroDeActa: notario['numeroActa'] ?? '',
      fechaInicioInput: notario['fechaActa'] ?? '',
      numeroDeNotaria: notario['numeroNotaria'] ?? '',
      estado: notario['entidadFederativa'] ?? '',
      estadoOptions: notario['delegacionMunicipio'] ?? '',
    }));
  }

  /**
   * Mapea los datos de plantas desde la solicitud recibida.
   * @param plantas
   * @returns
   */
  private reverseMapPlantas(plantas: unknown): unknown[] {
    const DATA = (plantas as Record<string, unknown>[]) ?? [];
    return DATA.map((planta) => ({
      planta: planta['idPlanta'] ?? '',
      calle: planta['calle'] ?? '',
      numeroExterior: planta['numeroExterior'] ?? '',
      numeroInterior: planta['numeroInterior'] ?? '',
      codigoPostal: planta['codigoPostal'] ?? '',
      localidad: planta['localidad'] ?? '',
      colonia: planta['colonia'] ?? '',
      delegacionMunicipio: planta['delegacionMunicipio'] ?? '',
      entidadFederativa: planta['entidadFederativa'] ?? '',
      pais: planta['pais'] ?? '',
      registroFederalDeContribuyentes: planta['rfc'] ?? '',
      domicilioDelSolicitante: planta['domicilioFiscal'] ?? '',
      razonSocial: planta['razonSocial'] ?? '',
    }));
  }

  /**
   * Mapea los datos de plantas submanufactureras desde la solicitud recibida.
   * @param plantas
   * @returns
   */
  private reverseMapPlantasSubmanufactureras(plantas: unknown): unknown[] {
    const DATA = (plantas as Record<string, unknown>[]) ?? [];
    return DATA.map((planta) => ({
      calle: planta['empresaCalle'] ?? '',
      numInterior: planta['empresaNumeroInterior'] ?? '',
      numExterior: planta['empresaNumeroExterior'] ?? '',
      codigoPostal: planta['empresaCodigoPostal'] ?? '',
      colonia: planta['localidad'] ?? '',
      municipio: planta['empresaDelegacionMunicipio'] ?? '',
      entidadFederativa: planta['empresaEntidadFederativa'] ?? '',
      pais: planta['empresaPais'] ?? '',
      rfc: planta['rfc'] ?? '',
      domicilioFiscal: planta['domicilioFiscal'] ?? '',
      razonSocial: planta['razonSocial'] ?? '',
    }));
  }

  /**
   * Mapea los datos de empresas nacionales desde la solicitud recibida.
   * @param empresas
   * @returns
   */
  private reverseMapEmpresasNacionales(empresas: unknown): unknown[] {
    const DATA = (empresas as Record<string, unknown>[]) ?? [];
    return DATA.map((empresa) => ({
      servicio: empresa['idServicio'] ?? '',
      registroContribuyentes: empresa['rfc'] ?? '',
      anoIMMEX: empresa['tiempoPrograma'] ?? '',
      numeroIMMEX: empresa['numeroPrograma'] ?? '',
      denominacionSocial: empresa['razonSocial'] ?? '',
    }));
  }

  /** Mapea los datos de empresas extranjeras desde la solicitud recibida.
   * @param empresas
   * @returns
   */
  private reverseMapEmpresasExtranjeras(empresas: unknown): unknown[] {
    const DATA = (empresas as Record<string, unknown>[]) ?? [];
    return DATA.map((empresa) => ({
      direccionEmpresaExtranjera: empresa['idDireccionSol'] ?? '',
      servicio: empresa['idServicio'] ?? '',
      nombreEmpresa: empresa['nombre'] ?? '',
    }));
  }

  /**
   * Mapea los datos de plantas completas desde la solicitud recibida.
   * Incluye todas las estructuras anidadas de plantas.
   * @param plantas
   * @returns
   */
  private reverseMapPlantasCompletas(solicitudData: Record<string, unknown>): unknown[] {
    const plantData = this.reverseMapPlantas([solicitudData]);

    return plantData;
  }

  /**
   * Mapea los datos de capacidad instalada desde la solicitud recibida.
   * @param capacidadData
   * @returns
   */
  private reverseMapCapacidadInstalada(capacidadData: unknown): unknown[] {
    const DATA = (capacidadData as Record<string, unknown>[]) ?? [];
    return DATA.map((item) => ({
      FRACCION_ARANCELARIA_PRODUCTO_TERMINADO_CATLOGO: item['fraccion'] ?? '',
      UMT: item['umt'] ?? '',
      DESCRIPCION_COMERCIAL_PRODUCTO_TERMINADO: item['descripcion'] ?? '',
      CAPACIDAD_EFECTIVAMENTE_UTILIZADA: item['capacidadEfectiva'] ?? '',
      CALCULO_CAPACIDAD_INSTALADA: item['calculo'] ?? '',
      TURNOS: parseInt(item['turnos']?.toString() ?? '0'),
      HORAS_POR_TURNO: parseInt(item['horasTurno']?.toString() ?? '0'),
      CANTIDAD_EMPLEADOS: parseInt(item['cantidadEmpleados']?.toString() ?? '0'),
      CANTIDAD_MAQUINARIA: parseInt(item['cantidadMaquinaria']?.toString() ?? '0'),
      DESCRIPCION_MAQUINARIA: item['descripcionMaquinaria'] ?? '',
      CAPACIDAD_INSTALADA_MENSUAL: parseInt(item['capacidadMensual']?.toString() ?? '0'),
      CAPACIDAD_INSTALADA_ANUAL: item['capacidadAnual'] ?? '',
      TESTADO: item['testado'] ?? '1',
    }));
  }

  /**
   * Mapea los datos de montos de inversión desde la solicitud recibida.
   * @param montosData
   * @returns
   */
  private reverseMapMontosInversion(montosData: unknown): unknown[] {
    const DATA = (montosData as Record<string, unknown>[]) ?? [];
    return DATA.map((item) => ({
      PLANTA: item['idPlantaM'] ?? '',
      MONTO: parseInt(item['monto']?.toString() ?? '0'),
      TIPO: item['tipo'] ?? '',
      DESC_TIPO: item['descTipo'] ?? '',
      CANTIDAD: parseInt(item['cantidad']?.toString() ?? '0'),
      DESCRIPCION: item['descripcion'] ?? '',
      TESTADO: item['testado'] ?? '',
      DESC_TESTADO: item['descTestado'] ?? '',
    }));
  }

  /**
   * Mapea los datos de empleados desde la solicitud recibida.
   * @param empleadosData
   * @returns
   */
  private reverseMapEmpleados(empleadosData: unknown): unknown[] {
    const DATA = (empleadosData as Record<string, unknown>[]) ?? [];
    return DATA.map((item) => ({
      PLANTA: item['idPlantaE'] ?? '',
      ID_EMPLEADOS: item['idEmpleados'] ?? '',
      TOTAL: parseInt(item['totalEmpleados']?.toString() ?? '0'),
      DIRECTOS: item['directos'] ?? '',
      CEDULA_DE_CUOTAS: item['cedula'] ?? '',
      FECHA_DE_CEDULA: item['fechaCedula'] ?? '',
      INDIRECTOS_TEST: item['indirectos'] ?? '',
      CONTRATO: item['contrato'] ?? '',
      OBJETO_DEL_CONTRATO_DEL_SERVICIO: item['objetoContrato'] ?? '',
      FECHA_FIRMA: item['fechaFirma'] ?? '',
      FECHA_FIN_VIGENCIA: item['fechaFinVigencia'] ?? '',
      RFC: item['rfcEmpresa'] ?? '',
      RAZON_SOCIAL: item['razonEmpresa'] ?? '',
      TESTADO: item['testado'] ?? '',
      DESC_TESTADO: item['descTestado'] ?? '',
    }));
  }

  /**
   * Mapea los datos complementarios desde la solicitud recibida.
   * @param complementariosData
   * @returns
   */
  private reverseMapDatosComplementarios(complementariosData: unknown): unknown[] {
    const DATA = (complementariosData as Record<string, unknown>[]) ?? [];
    return DATA.map((item) => ({
      PLANTA: item['idPlantaC'] ?? '',
      DATO: item['idDato'] ?? '',
      PERMANECERA_MERCANCIA_PROGRAMA: item['amparoPrograma'] ?? '',
      TIPO_DOCUMENTO: item['tipoDocumento'] ?? '',
      DESCRIPCION_DOCUMENTO: item['descDocumento'] ?? '',
      DESCRIPCION_OTRO: item['descripcionOtro'] ?? '',
      DOCUMENTO_RESPALDO: item['documentoRespaldo'] ?? '',
      DESC_DOCUMENTO_RESPALDO: item['descDocRespaldo'] ?? '',
      RESPALDO_OTRO: item['respaldoOtro'] ?? '',
      FECHA_DE_FIRMA: item['fechaFirma'] ?? '',
      FECHA_DE_FIN_DE_VIGENCIA: item['fechaVigencia'] ?? '',
      FECHA_DE_FIRMA_DOCUMENTO: item['fechaFirmaRespaldo'] ?? '',
      FECHA_DE_FIN_DE_VIGENCIA_DOCUMENTO: item['fechaVigenciaRespaldo'] ?? ''
    }));
  }

  /**
   * Mapea los datos de firmantes desde la solicitud recibida.
   * @param firmantesData
   * @returns
   */
  private reverseMapFirmantes(firmantesData: unknown): unknown[] {
    const DATA = (firmantesData as Record<string, unknown>[]) ?? [];
    return DATA.map((item) => ({
      planta: item['idPlantaF'] ?? '',
      tipoFirmante: item['tipoFirmante'] ?? '',
      descTipoFirmante: item['descTipoFirmante'] ?? '',
    }));
  }

  /**
   * Mapea los datos de anexo completo desde la solicitud recibida.
   * @param anexoData
   * @returns
   */
  private reverseMapAnexoCompleto(anexoData: Record<string, unknown>): Record<string, unknown> {
    if (!anexoData || typeof anexoData !== 'object') {
      return {
        proveedorClienteDatosTabla: [],
        proveedorClienteDatosTablaDos: [],
        importarDatosTabla: [],
        exportarDatosTabla: [],
      };
    }

    return {
      proveedorClienteDatosTabla: this.reverseMapProveedorCliente(anexoData['proveedorCliente']),
      proveedorClienteDatosTablaDos: this.reverseMapProveedorCliente(anexoData['proveedorClienteDos']),
      importarDatosTabla: [this.reverseMapDatosNavegar(anexoData['datosParaNavegar'])],
      exportarDatosTabla: this.reverseMapAnexoDosItems(anexoData['tableDos']),
    };
  }

  /**
   * Mapea los datos de proveedor/cliente desde la solicitud recibida.
   * @param proveedorData
   * @returns
   */
  private reverseMapProveedorCliente(proveedorData: unknown): ProveedorClienteDatosTabla[] {
    const DATA = (proveedorData as Record<string, unknown>[]) ?? [];
    return DATA.map((item) => ({
      idProveedor: parseInt(item['idProveedor']?.toString() ?? '0'),
      paisOrigen: item['paisOrigen'] as string ?? '',
      rfcProveedor: item['rfcProveedor'] as string ?? '',
      razonProveedor: item['razonProveedor'] as string ?? '',
      paisDestino: item['paisDestino'] as string ?? '',
      rfcClinte: item['rfcCliente'] as string ?? '',
      razonSocial: item['razonCliente'] as string ?? '',
      domicilio: item['domicilio'] as string ?? '',
      testado: item['testado'] as boolean ?? false,
      idProductoP: parseInt(item['idProductoP']?.toString() ?? '0'),
      descTestado: item['descTestado'] as string ?? '',
    }));
  }

  /**
   * Mapea los datos de navegación desde la solicitud recibida.
   * @param datosNavegar
   * @returns
   */
  private reverseMapDatosNavegar(datosNavegar: unknown): DatosParaNavegar {
    if (!datosNavegar || typeof datosNavegar !== 'object') {
      return {
        encabezadoAnexoII: '',
        encabezadoTipo: '',
        encabezadoUmt: '',
        encabezadoCategoria: '',
        encabezadoDescripcionComercial: '',
        encabezadoVolumenMensual: '',
        encabezadoVolumenAnual: '',
        encabezadoValorEnMonedaMensual: '',
        encabezadoValorEnMonedaAnual: '',
      } as DatosParaNavegar;
    }

    const item = datosNavegar as Record<string, unknown>;
    return {
      encabezadoAnexoII: item['anexoII'] as string ?? '',
      encabezadoTipo: item['tipo'] as string ?? '',
      encabezadoUmt: item['unidadMedida'] as string ?? '',
      encabezadoCategoria: item['categoria'] as string ?? '',
      encabezadoDescripcionComercial: item['descripcion'] as string ?? '',
      encabezadoVolumenMensual: item['valorMensual'] as string ?? '',
      encabezadoVolumenAnual: item['valorAnual'] as string ?? '',
      encabezadoValorEnMonedaMensual: item['volumenMensual'] as string ?? '',
      encabezadoValorEnMonedaAnual: item['volumenAnual'] as string ?? '',
    } as DatosParaNavegar;
  }

  /**
   * Mapea los elementos de anexo dos desde la solicitud recibida.
   * @param anexoDosData
   * @returns
   */
  private reverseMapAnexoDosItems(anexoDosData: unknown): unknown[] {
    const DATA = (anexoDosData as Record<string, unknown>[]) ?? [];
    return DATA.map((item) => ({
      encabezadoFraccionExportacion: item['fraccionExportacion'] ?? '',
      encabezadoFraccionImportacion: item['fraccionImportacion'] ?? '',
      encabezadoDescripcionComercial: item['descFraccionImpo'] ?? '',
      encabezadoAnexoII: item['claveFraccionAnexo'] ?? '',
      encabezadoIdProducto: item['idProducto'] ?? '',
      encabezadoFraccionDescripcionAnexo: item['fraccionDescripcionAnexo'] ?? '',
      encabezadoValorEnMonedaAnual: item['fraccionValorMonedaAI'] ?? '',
      encabezadoValorEnMonedaMensual: item['fraccionValorProdMI'] ?? '',
      encabezadoVolumenMensual: item['fraccionVolumenMensual'] ?? '',
      encabezadoVolumenAnual: item['fraccionVolumenAnual'] ?? '',
      encabezadoCategoria: item['categoriaFraccion'] ?? '',
      encabezadoTipo: item['tipoFraccion'] ?? '',
      encabezadoUmt: item['umt'] ?? '',
    }));
  }

  /**
   * Mapea los datos de proyecto IMMEX desde la solicitud recibida.
   * @param proyectoData
   * @returns
   */
  private reverseMapProyectoImmex(proyectoData: unknown): unknown[] {
    const DATA = (proyectoData as Record<string, unknown>[]) ?? [];
    return DATA.map((item) => ({
      encabezadoTipoDocument: item['tipoDocumento'] ?? '',
      encabezadoDescripcionOtro: item['descripcion'] ?? '',
      encabezadoFechaFirma: item['fechaFirma'] ?? '',
      encabezadoFechaVigencia: item['fechaVigencia'] ?? '',
      encabezadoRfc: item['rfcFirmante'] ?? '',
      encabezadoRazonFirmante: item['razonFirmante'] ?? '',
    }));
  }

  /** Mapea los datos de anexos básicos desde la solicitud recibida.
   * @param anexos
   * @returns
   */
  private reverseMapAnexoItems(anexos: unknown): unknown[] {
    const DATA = (anexos as Record<string, unknown>[]) ?? [];
    return DATA.map((anexo) => ({
      encabezadoFraccion: anexo['descripcion'] ?? '',
      encabezadoDescripcion: anexo['descripcionTestado'] ?? '',
    }));
  }

}