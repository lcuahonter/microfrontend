import { AmpliacionServiciosResponse , Anexo1, AnexoDosItem, CapacidadInstaladaItem, CatalogoResponso, ComplementarItem, DatosParaNavegar, EmpleadoItem, FirmanteItem, InfoServicios, MontoInversionItem, ProveedorClienteDatosTabla, ProyectoImmexEncabezado} from '../models/nuevo-programa-industrial.model';
import { Catalogo, JSONResponse, RespuestaCatalogos } from '@libs/shared/data-access-user/src/core/models/shared/catalogos.model';
import { HttpCoreService,formatearFechaYyyyMmDd } from '@libs/shared/data-access-user/src';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Tramite80101State, Tramite80101Store } from '../estados/tramite80101.store';
import { ComplimentosService } from '../../../shared/services/complimentos.service';
import { DatosComplimentos } from '../../../shared/models/complimentos.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PROC_80103 } from '../servers/api-route';
import { PlantasSubfabricante } from '../../../shared/models/empresas-subfabricanta.model';
import { Tramite80101Query } from '../estados/tramite80101.query';

@Injectable({
  providedIn: 'root',
})

export class NuevoProgramaIndustrialService {
  /**
   * Subject que mantiene el estado actual sobre si la tabla tiene datos.
   * Permite la suscripción reactiva a los cambios en la presencia de datos en la tabla.
   */
  private _tieneDatosDeTabla$ = new BehaviorSubject<boolean>(false);

 constructor(
    private readonly http: HttpClient,
    private tramite80101Query: Tramite80101Query,
    private tramite80101Store: Tramite80101Store,
    public httpService: HttpCoreService,
    private complimentosService: ComplimentosService
  ) {
   // No se necesita lógica de inicialización adicional.
   this.setProcedure();
   this.setProcedureNo();
  }

  /**
   * Establece el procedimiento actual para la gestión de trámites industriales.
   * Asigna el identificador de procedimiento 'st_t80101' y lo configura en el servicio de cumplimientos.
   *
   * @returns {void} No retorna ningún valor.
   */
  setProcedure():void{
    const PROCEDURE='sat-t80103'
    this.complimentosService.setProcedure(PROCEDURE);
  }

  /**
   * Actualiza el estado interno indicando si la tabla tiene datos.
   * Emite el nuevo valor a todos los suscriptores del observable correspondiente.
   */
  setTieneDatosDeTabla(value: boolean): void {
    this._tieneDatosDeTabla$.next(value);
  }

  setProcedureNo(): void {
    this.complimentosService.setProcedureNo('80103');
  }

  /**
   * Obtiene los datos de ampliación de servicios desde un archivo JSON.
   * @returns {Observable<any>} - Observable con los datos obtenidos.
   */
 getDatos(): Observable<InfoServicios> {
  return this.http
    .get<AmpliacionServiciosResponse>("assets/json/80205/ampliacion-servicios.json")
    .pipe(map(res => res.data.infoServicios));
}
   
  /**
   * Obtiene la lista de selección de ingreso desde un archivo JSON.
   * @returns {Observable<any>} - Observable con los datos obtenidos.
   */
 obtenerIngresoSelectList(): Observable<Catalogo[]> {
  return this.http
    .get<CatalogoResponso>("assets/json/80205/ampliacion-IMMEX-dropdown.json")
    .pipe(map(res => res.data));
}

   /**
   * Obtiene la lista de estados.
   * @method obtenerListaEstado
   * @returns {Observable<RespuestaCatalogos>} Observable con la lista de estados.
   */
   obtenerListaEstado(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(
      'assets/json/80207/estado-datos.json'
    );
  }

  /**
   * Obtiene la lista de subfabricantes disponibles.
   * @method getSubfabricantesDisponibles
   * @returns {Observable<TableData>} Observable con la lista de subfabricantes disponibles.
   */
  getSubfabricantesDisponibles(): Observable<PlantasSubfabricante[]> {
    return (
      this.http
        .get<PlantasSubfabricante[]>(
          'assets/json/80207/submanufactureras-disponibles-datos.json'
        )
      
        .pipe(map((response: PlantasSubfabricante[]) => response))
    );
  }


  /**
   * Obtiene los datos de complementos desde un archivo JSON local.
   * 
   * @returns Un observable que emite los datos de tipo `DatosComplimentos`.
   */
  obtenerComplimentos(): Observable<DatosComplimentos> {
  return this.http.get<DatosComplimentos>("assets/json/80102/datos-complimentos.json");
}

  /**
   * Obtiene todos los datos del estado almacenado en el store.
   * @returns {Observable<Tramite80101State>} Observable con todos los datos del estado.
   */
  getAllState(): Observable<Tramite80101State> {
    return this.tramite80101Query.allStoreData$;
  }

  /**
   * Envía los datos proporcionados mediante una solicitud HTTP POST a la ruta especificada.
   * 
   * @param body - Objeto que contiene los datos a enviar en el cuerpo de la solicitud.
   * @returns Observable con la respuesta de la solicitud POST.
   */
  guardarDatosPost(body: Record<string, unknown>): Observable<JSONResponse> {
    return this.httpService.post<JSONResponse>(PROC_80103.GUARDAR, { body: body });
  }

    /**
  * Construye un arreglo de socios/accionistas a partir de dos listas de entrada,
  * utilizando un objeto base como plantilla y datos complementarios para completar
  * los campos faltantes.
  *
  * @param data Primer arreglo de socios/accionistas.
  * @param base Objeto base que sirve de plantilla para cada elemento del resultado.
  *
  * @returns Un nuevo arreglo que contiene los objetos combinados y mapeados
  *          con la información de los dos arreglos de entrada.
  *
  * @example
  * const socios = buildComplimentos(datos, BASE);
  */
  buildComplimentos(data: Record<string, unknown>, base: Record<string, unknown>): Record<string, unknown> {
    const DATOS_COMPLIMENTOS = (data as Record<string, unknown>)['datosComplimentos'] as DatosComplimentos;
    return {
      ...base,
      notario: {
        ...(typeof base['notario'] === 'object' && base['notario'] !== null ? base['notario'] : {}),
        rfc: DATOS_COMPLIMENTOS.formaModificaciones.rfc,
        numeroActa: DATOS_COMPLIMENTOS.formaModificaciones.nombreDeActa,
        numeroNotario: DATOS_COMPLIMENTOS.formaModificaciones.nombreDeNotaria,
        entidadFederativa: DATOS_COMPLIMENTOS.formaModificaciones.estado,
        fechaActa: formatearFechaYyyyMmDd(DATOS_COMPLIMENTOS.formaModificaciones.fechaDeActa)
      },
      modalidad: DATOS_COMPLIMENTOS.modalidad,
      booleanGenerico: DATOS_COMPLIMENTOS.programaPreOperativo ? true : false,
      descripcionSistemasMedicion: DATOS_COMPLIMENTOS.datosGeneralis.paginaWWeb,
      descripcionLugarEmbarque: DATOS_COMPLIMENTOS.datosGeneralis.localizacion,
      capacidadAlmacenaje: DATOS_COMPLIMENTOS.formaModificaciones.nombreDeNotaria,
      numeroPermiso: DATOS_COMPLIMENTOS.obligacionesFiscales.opinionPositiva === '1' ? 'SI' : '',
      fechaOperacion: formatearFechaYyyyMmDd(DATOS_COMPLIMENTOS.obligacionesFiscales.fechaExpedicion),
      nomOficialAutorizado: DATOS_COMPLIMENTOS.formaModificaciones.nombreDelFederatario,

    };
  }

  /**
 * Construye un arreglo de socios/accionistas a partir de dos listas de entrada,
 * utilizando un objeto base como plantilla y datos complementarios para completar
 * los campos faltantes.
 *
 * @param arr1 Primer arreglo de socios/accionistas.
 * @param arr2 Segundo arreglo de socios/accionistas.
 * @param base Objeto base que sirve de plantilla para cada elemento del resultado.
 *
 * @returns Un nuevo arreglo que contiene los objetos combinados y mapeados
 *          con la información de los dos arreglos de entrada.
 *
 * @example
 * const socios = buildSociosAccionistas(listaA, listaB, BASE);
 */
  buildSociosAccionistas(
    arr1: unknown[],
    arr2: unknown[],
    base: Record<string, unknown> = {}
  ): Record<string, unknown>[] {
    const BASE_OBJECT = base[0];
    const CLONED_BASE = structuredClone ? structuredClone(BASE_OBJECT) : JSON.parse(JSON.stringify(BASE_OBJECT));
    const MAP_TO_PAYLOAD = (item: Record<string, unknown>): Record<string, unknown> => ({
      ...CLONED_BASE,
      nombre: item['nombre'] ?? '',
      apellidoPaterno: item['apellidoPaterno'] ?? '',
      apellidoMaterno: item['apellidoMaterno'] ?? '',
      rfc: item['rfc'] ?? '',
      correoElectronico: item['correoElectronico'] ?? '',
      razonSocial: item['razonSocial'] ?? '',
      estadoEvaluacionEntidad: item['estado'] ?? '',
      estadoEntidad: item['estado'] ?? '',
      cvePaisOrigen: item['pais'] ?? '',
      rfcExtranjero: item['taxId'] ?? '',
      domicilio: {
        codigoPostal: item['codigoPostal'] ?? '',
      }
    });

    return [
      ...arr1.map((item) => MAP_TO_PAYLOAD(item as Record<string, unknown>)),
      ...arr2.map((item) => MAP_TO_PAYLOAD(item as Record<string, unknown>))
    ];
  }

  /** Construye el arreglo de declaraciones de solicitud a partir de los datos proporcionados. */
  buildDeclaracionSolicitudEntries(data: Record<string, unknown>): unknown[] {
    const RESULT = [
      {
        "acepto": (data['datosComplimentos'] as { obligacionesFiscales: { aceptarObligacionFiscal: boolean } }).obligacionesFiscales.aceptarObligacionFiscal ? 1 : 0,
        "idTipoTramite": 80103,
        "cveDeclaracion": "123"
      }
    ];
    return RESULT;
  }


  /**
 * Construye plantasControladoras tomando el arreglo base
 * y agregando la longitud de cada clave en empresasSeleccionadas
 * a cada elemento de planta.
 *
 * @param array  Objeto con claves cuyos valores son arreglos
 * @param base            Arreglo existente de plantasControladoras
 */
  buildComplementosTablaPayload(array: Record<string, unknown>[], base: unknown[]): Record<string, unknown>[] {
    const RESULT: Record<string, unknown>[] = [];

      array.forEach(arr => {
        base.forEach(item => {
          const ITEM = (item && typeof item === 'object') ? item : {};
          RESULT.push({
            ...ITEM,
            rfc: arr['rfc'] || arr['taxId'],
            correoElectronico: arr['correoElectronico'],
            razonSocial: arr['razonSocial'],
            nombre: arr['nombre'],
            apellidoPaterno: arr['apellidoPaterno'],
            apellidoMaterno: arr['apellidoMaterno'],
            domicilioSolicitud: {
              codigoPostal: arr['codigoPostal'] || arr['cp'],
              informacionExtra: arr['estado']
            }
          });
        });
      });
    return RESULT;
  }



/**
 * Construye un arreglo de objetos de plantas basado en una estructura base común.
 * 
 * @param array Arreglo de datos de entrada para cada planta.
 * @param base Objeto base que se combina con los datos específicos de cada planta.
 * @param data Datos adicionales para construcción de plantas.
 * @returns Un nuevo arreglo de objetos con la información estructurada de cada planta.
 */
    buildPlantas(array: unknown[], base: unknown[], data: unknown = {}): unknown {
      const MAP_CAPACIDAD_INSTALADA = (item: CapacidadInstaladaItem): unknown => ({
        fraccion: item.FRACCION_ARANCELARIA_PRODUCTO_TERMINADO_CATLOGO ?? "",
        umt: item.UMT ?? "",
        descripcion: item.DESCRIPCION_COMERCIAL_PRODUCTO_TERMINADO ?? "",
        capacidadEfectiva: item.CAPACIDAD_EFECTIVAMENTE_UTILIZADA ?? "",
        calculo: item.CALCULO_CAPACIDAD_INSTALADA ?? "",
        turnos: (item.TURNOS ?? "").toString(),
        horasTurno: (item.HORAS_POR_TURNO ?? "").toString(),
        cantidadEmpleados: (item.CANTIDAD_EMPLEADOS ?? "").toString(),
        cantidadMaquinaria: (item.CANTIDAD_MAQUINARIA ?? "").toString(),
        descripcionMaquinaria: item.DESCRIPCION_MAQUINARIA ?? "",
        capacidadMensual: (item.CAPACIDAD_INSTALADA_MENSUAL ?? "").toString(),
        capacidadAnual: item.CAPACIDAD_INSTALADA_ANUAL ?? "",
        testado: "1",
      });
  
      const MAP_MONTOS_INVERSION = (item: MontoInversionItem): unknown => ({
        idPlantaM: item.PLANTA ?? "",
        idMonto: (item.MONTO ?? "").toString(),
        tipo: item.TIPO ?? "",
        descTipo: item.DESC_TIPO ?? "",
        cantidad: (item.CANTIDAD ?? "").toString(),
        descripcion: item.DESCRIPCION ?? "",
        monto: (item.MONTO ?? "").toString(),
        testado: item.TESTADO ?? "",
        descTestado: item.DESC_TESTADO ?? "",
      })
  
      const MAP_EMPLEADOS = (item: EmpleadoItem): unknown => ({
        idPlantaE: item.PLANTA ?? '',
        idEmpleados: item.ID_EMPLEADOS ?? '',
        totalEmpleados: (item.TOTAL ?? '').toString(),
        directos: item.DIRECTOS ?? '',
        cedula: item.CEDULA_DE_CUOTAS ?? '',
        fechaCedula: formatearFechaYyyyMmDd(item.FECHA_DE_CEDULA ?? ''),
        indirectos: item.INDIRECTOS_TEST ?? '',
        contrato: item.CONTRATO ?? '',
        objetoContrato: item.OBJETO_DEL_CONTRATO_DEL_SERVICIO ?? '',
        fechaFirma: formatearFechaYyyyMmDd(item.FECHA_FIRMA ?? ''),
        fechaFinVigencia: formatearFechaYyyyMmDd(item.FECHA_FIN_VIGENCIA ?? ''),
        rfcEmpresa: item.RFC ?? '',
        razonEmpresa: item.RAZON_SOCIAL ?? '',
        testado: item.TESTADO ?? '',
        descTestado: item.DESC_TESTADO ?? '',
      })
  
      const MAP_COMPLEMENTAR = (item: ComplementarItem): unknown => ({
        idPlantaC: item.PLANTA ?? '' ,
        idDato: item.DATO ?? '',
        amparoPrograma: item.PERMANECERA_MERCANCIA_PROGRAMA ?? '',
        tipoDocumento: item.TIPO_DOCUMENTO ?? '',
        descDocumento: item.DESCRIPCION_DOCUMENTO ?? '',
        descripcionOtro: item.DESCRIPCION_OTRO ?? '',
        documentoRespaldo: item.DOCUMENTO_RESPALDO ?? '',
        descDocRespaldo: item.DESC_DOCUMENTO_RESPALDO ?? '',
        respaldoOtro: item.RESPALDO_OTRO ?? '',
        fechaFirma: formatearFechaYyyyMmDd(item.FECHA_DE_FIRMA ?? ''),
        fechaVigencia: formatearFechaYyyyMmDd(item.FECHA_DE_FIN_DE_VIGENCIA ?? ''),
        fechaFirmaRespaldo: item.FECHA_DE_FIRMA_DOCUMENTO ?? '',
        fechaVigenciaRespaldo: item.FECHA_DE_FIN_DE_VIGENCIA_DOCUMENTO ?? ''
      })
  
  
      const MAP_FIRMANTES = (item: FirmanteItem): unknown => ({
        idPlantaF: item.planta ?? '',
        tipoFirmante: item.tipoFirmante ?? '',
        descTipoFirmante: item.descTipoFirmante ?? '',
      })
   
      const LISTA_CAPACIDAD = ((data as { tablaDatosCapacidadInstalada?: CapacidadInstaladaItem[] }).tablaDatosCapacidadInstalada || []).map(MAP_CAPACIDAD_INSTALADA);
      const MONTOS = ((data as { montosDeInversionTablaDatos?: MontoInversionItem[] }).montosDeInversionTablaDatos || []).map(MAP_MONTOS_INVERSION);
      const DATOS_EMPLEADOS = ((data as { empleadosTablaDatos?: EmpleadoItem[] }).empleadosTablaDatos || []).map(MAP_EMPLEADOS);
      const DATOS_COMPLEMENTARIOS = ((data as { complementarPlantaDatos?: ComplementarItem[] }).complementarPlantaDatos || []).map(MAP_COMPLEMENTAR);
      const FIRMANTES = ((data as { complementarFirmanteDatos?: FirmanteItem[] }).complementarFirmanteDatos || []).map(MAP_FIRMANTES);
   
      const RESULT: unknown[] = [];
      array.forEach(arr => {
        const PLANTA_OBJ = arr as { 
          planta?: string; 
          calle?: string; 
          numeroExterior?: string; 
          numeroInterior?: string; 
          codigoPostal?: string; 
          localidad?: string; 
          colonia?: string; 
          delegacionMunicipio?: string; 
          entidadFederativa?: string; 
          pais?: string; 
          registroFederalDeContribuyentes?: string; 
          domicilioDelSolicitante?: string; 
          razonSocial?: string;
        };
        base.forEach(item => {
          const ITEM = (item && typeof item === 'object') ? item : {};
          RESULT.push({
            ...ITEM,
            idPlanta: PLANTA_OBJ.planta ?? '',
            calle: PLANTA_OBJ.calle ?? '',
            numeroExterior: PLANTA_OBJ.numeroExterior ?? '',
            numeroInterior: PLANTA_OBJ.numeroInterior ?? '',
            codigoPostal: PLANTA_OBJ.codigoPostal ?? '',
            localidad: PLANTA_OBJ.localidad ?? '',
            colonia: PLANTA_OBJ.colonia ?? '',
            delegacionMunicipio: PLANTA_OBJ.delegacionMunicipio ?? '',
            entidadFederativa: PLANTA_OBJ.entidadFederativa ?? '',
            pais: PLANTA_OBJ.pais ?? '',
            rfc: PLANTA_OBJ.registroFederalDeContribuyentes ?? '',
            domicilioFiscal: PLANTA_OBJ.domicilioDelSolicitante ?? '',
            razonSocial: PLANTA_OBJ.razonSocial ?? '',
          });
        });
      });
      const RESULT_DATA = { ...(typeof RESULT[0] === 'object' && RESULT[0] !== null ? RESULT[0] : {}), LISTA_CAPACIDAD, MONTOS, DATOS_EMPLEADOS, DATOS_COMPLEMENTARIOS, FIRMANTES };
      return RESULT_DATA;
    }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/explicit-function-return-type
 /**
   * Construye el objeto `anexo` a partir de los datos proporcionados.
   *
   * @param data - Objeto de entrada que contiene la información necesaria para construir los anexos y sus tablas asociadas.
   * @returns Un objeto con la estructura de los anexos, incluyendo ANEXOII, ANEXOIII, proveedorCliente y datosParaNavegar.
   *
   * - `ANEXOII` y `ANEXOIII`: Listas construidas a partir de los elementos de `anexoDosTablaLista` y `anexoTresTablaLista` respectivamente.
   * - `proveedorCliente`: Lista de proveedores y clientes obtenida de `proveedorClienteDatosTabla`.
   * - `datosParaNavegar`: Información adicional para navegación, construida desde `datosParaNavegar`.
   *
   * Cada subestructura se construye utilizando funciones auxiliares para mapear y transformar los datos de entrada.
   */
    buildAnexo(data: unknown): { anexo: Record<string, unknown> } {
      const BUILD_ANEXO_ITEM = (item: Anexo1) => ({
        descripcion: item.encabezadoFraccion,
        idTipoBien: 0,
        idBienComercial: 0,
        testado: true,
        contadorGrid: null,
        descripcionTestado: item.encabezadoDescripcion,
      });
   
      const BUILD_PROVEEDOR_CLIENTE = (item: ProveedorClienteDatosTabla) => ({
        idProveedor: item.idProveedor,
        paisOrigen: item.paisOrigen,
        rfcProveedor: item.rfcProveedor,
        razonProveedor: item.razonProveedor,
        paisDestino: item.paisDestino,
        rfcCliente: item.rfcClinte,
        razonCliente: item.razonSocial,
        domicilio: item.domicilio,
        testado: item.testado,
        idProductoP: item.idProductoP,
        descTestado: item.descTestado,
      });
   
      const BUILD_DATOS_PARA_NAVEGAR = (datos: DatosParaNavegar) => ({
        anexoII: datos?.encabezadoAnexoII,
        tipo: datos?.encabezadoTipo,
        unidadMedida: datos?.encabezadoAnexoII,
        categoria: datos?.encabezadoCategoria,
        descripcion: datos?.encabezadoDescripcionComercial,
        valorMensual: datos?.encabezadoVolumenMensual,
        valorAnual: datos?.encabezadoVolumenAnual,
        volumenMensual: datos?.encabezadoValorEnMonedaMensual,
        volumenAnual: datos?.encabezadoValorEnMonedaAnual,
        testado: true,
        fecFinVigencia: null,
        volumenAnualSolicitado: null,
      });
   
      const BUILD_ANEXO_DOS = (item: AnexoDosItem) => ({
        fraccionExportacion: item.encabezadoFraccionExportacion,
        fraccionImportacion: item.encabezadoFraccionImportacion,
        descFraccionImpo: item.encabezadoDescripcionComercial,
        claveFraccionAnexo: item.encabezadoAnexoII,
        idProducto: item.encabezadoIdProducto,
        fraccionDescripcionAnexo: item.encabezadoFraccionDescripcionAnexo,
        fraccionValorMonedaAI: item.encabezadoValorEnMonedaAnual,
        fraccionValorProdMI: item.encabezadoValorEnMonedaMensual,
        fraccionVolumenMensual: item?.encabezadoValorEnMonedaMensual,
        fraccionVolumenAnual: item?.encabezadoVolumenAnual,
        categoriaFraccion: item.encabezadoCategoria,
        tipoFraccion: item.encabezadoTipo,
        umt: item.encabezadoUmt,
      });
   
      const PROYECTO_IMMEX_DATOS = (item: ProyectoImmexEncabezado) => ({
        tipoDocumento: item.encabezadoTipoDocument,
        descripcion: item.encabezadoDescripcionOtro,
        fechaFirma: item.encabezadoFechaFirma,
        fechaVigencia: item.encabezadoFechaVigencia,
        rfcFirmante: item.encabezadoRfc,
        razonFirmante: item.encabezadoRazonFirmante,
        testado: true,
        fecFinVigencia: item.encabezadoFechaVigencia,
      });
   
      /**
       * Construye un objeto con los datos del proveedor y cliente a partir de un elemento de tipo `ProveedorClienteDatosTabla`.
       *
       * @param item - Objeto que contiene la información del proveedor y cliente.
       * @returns Un objeto con las propiedades: paisOrigen, rfcProveedor, razonProveedor, paisDestino, rfcCliente, razonCliente, domicilio y descTestado.
       */
      const BUILD_PROVEEDOR_CLIENTE_DOS = (item: ProveedorClienteDatosTabla) => ({
        paisOrigen: item.paisOrigen,
        rfcProveedor: item.rfcProveedor,
        razonProveedor: item.razonProveedor,
        paisDestino: item.paisDestino,
        rfcCliente: item.rfcClinte,
        razonCliente: item.razonSocial,
        domicilio: item.domicilio,
        descTestado: item.descTestado,
      });
   
      return {
        anexo: {
          ANEXOII: ((data as { annexoDosTres?: { anexoDosTablaLista?: Anexo1[] } }).annexoDosTres?.anexoDosTablaLista || []).map(BUILD_ANEXO_ITEM),
          ANEXOIII: ((data as { annexoDosTres?: { anexoTresTablaLista?: Anexo1[] } }).annexoDosTres?.anexoTresTablaLista || []).map(BUILD_ANEXO_ITEM),
          proveedorCliente: ((data as { annexoUno?: { proveedorClienteDatosTabla?: ProveedorClienteDatosTabla[] } }).annexoUno?.proveedorClienteDatosTabla || []).map(BUILD_PROVEEDOR_CLIENTE),
          datosParaNavegar: BUILD_DATOS_PARA_NAVEGAR((data as { annexoUno?: { importarDatosTabla?: unknown[] } })?.annexoUno?.importarDatosTabla?.[0] || {}),
          tableDos: (((data as { annexoUno?: { exportarDatosTabla?: unknown[] } })?.annexoUno?.exportarDatosTabla || []) as AnexoDosItem[]).map(BUILD_ANEXO_DOS),
          proyectoimex: ((data as { proyectoImmexTablaLista?: ProyectoImmexEncabezado[] }).proyectoImmexTablaLista || []).map(PROYECTO_IMMEX_DATOS),
          proveedorClienteDos: ((data as { annexoUno?: { proveedorClienteDatosTablaDos?: ProveedorClienteDatosTabla[] } }).annexoUno?.proveedorClienteDatosTablaDos || []).map(BUILD_PROVEEDOR_CLIENTE_DOS),
        },
      };
    }
/**
 * Construye un arreglo de objetos con los datos de plantas submanufactureras a partir de un arreglo de entrada.
 *
 * @param arr Arreglo de objetos con datos de entrada (opcional).
 * @param base Objeto base que se fusiona con los datos específicos de cada planta.
 * @returns Un arreglo con los objetos estructurados de plantas submanufactureras.
 */
      buildPlantasSubmanufactureras(base: unknown[], array: PlantasSubfabricante[] = []): unknown[] {
        const RESULT: unknown[] = [];
        array.forEach(arr => {
          base.forEach(item => {
            type ItemWithDatosComplementarios = typeof item & { datosComplementarios?: unknown[] };
            const ITEM: ItemWithDatosComplementarios = (item && typeof item === 'object') ? item as ItemWithDatosComplementarios : {};
            RESULT.push({
              ...ITEM,
          empresaCalle: arr.calle ?? '',
          empresaNumeroInterior: arr.numInterior ?? '',
          empresaNumeroExterior: arr.numExterior ?? '',
          empresaCodigoPostal: arr.codigoPostal ?? '',
          localidad: arr.colonia ?? '',
          empresaDelegacionMunicipio: arr.municipio ?? '',
          empresaEntidadFederativa: arr.entidadFederativa ?? '',
          empresaPais: arr.pais ?? '',
          rfc: arr.rfc ?? '',
          domicilioFiscal: arr.domicilioFiscal ?? '',
          razonSocial: arr.razonSocial ?? '',
           datosComplementarios: Array.isArray(ITEM.datosComplementarios)
              ? ITEM.datosComplementarios.map((dc:unknown) => {
                  const COMPLEMENTO = dc as { idPlantaC?: string; idDato?: string; amparoPrograma?: string };
                  return {
                    idPlantaC: COMPLEMENTO.idPlantaC ?? '',
                    idDato: COMPLEMENTO.idDato ?? '',
                    amparoPrograma: COMPLEMENTO.amparoPrograma ?? '',
                  };
                })
              : []
            });
          });
        });
        return RESULT;
      }

/**
 * Genera un arreglo de objetos con los datos de fedatarios a partir de un arreglo de entrada.
 *
 * @param arr Arreglo de objetos con datos de entrada (opcional).
 * @param base Objeto base que se fusiona con los datos específicos de cada fedatario.
 * @returns Un arreglo de objetos estructurados con la información de los fedatarios.
 */
  buildDatosFederatarios(base: unknown[], array: unknown[] = []): unknown[] {
    const RESULT: unknown[] = [];
    array.forEach(arr => {
    const FEDATARIO = arr as { nombre?: string; segundoApellido?: string; primerApellido?: string; numeroDeActa?: string; fechaInicioInput?: string; numeroDeNotaria?: string; estado?: string; estadoOptions?: string };
      base.forEach(item => {
        const ITEM = (item && typeof item === 'object') ? item : {};
        RESULT.push({
          ...ITEM,
          nombreNotario: FEDATARIO.nombre ?? '',
          apellidoMaterno: FEDATARIO.segundoApellido ?? '',
          apellidoPaterno: FEDATARIO.primerApellido ?? '',
          numeroActa: FEDATARIO.numeroDeActa ?? '',
          fechaActa: formatearFechaYyyyMmDd(FEDATARIO.fechaInicioInput ?? ''),
          numeroNotaria: FEDATARIO.numeroDeNotaria ?? '',
          entidadFederativa: FEDATARIO.estado ?? '',
          delegacionMunicipio: FEDATARIO.estadoOptions ?? '',
        });
      });
    });
    return RESULT;
  }

  /**
   * @method getRegistroTomaMuestrasMercanciasData
   * @description
   * Obtiene los datos de prellenado para el formulario desde un archivo JSON local.
   * @returns {Observable<Tramite80101State>} Observable que emite los datos de prellenado.
   */
  /**
   * @method getMostrarSolicitud
   * @description
   * Obtiene los datos completos de una solicitud específica del trámite 80103 mediante su identificador único.
   * Este método consulta al servidor para recuperar toda la información asociada a una solicitud.
   * @param {string} id - Identificador único de la solicitud a consultar
   * @returns {Observable<JSONResponse>} Observable que emite la respuesta del servidor con los datos de la solicitud
   */
  getMostrarSolicitud(id: string): Observable<JSONResponse> {
    return this.httpService.get<JSONResponse>(PROC_80103.MOSTRAR(id));
  }

  /**
   * @method actualizarEstadoFormulario
   * @description
   * Actualiza el estado del formulario en el store con los datos proporcionados.
   * @param {Tramite80101State} DATOS - Objeto que contiene los nuevos datos para actualizar el estado.
   * @returns {void}
   */
  actualizarEstadoFormulario(DATOS: Tramite80101State): void {
    this.tramite80101Store.update(DATOS);
  }

  /**
   * Construye el objeto de solicitud 80103 a partir del payload recibido.
   * @param built Payload recibido desde el servidor.
   * @returns {Record<string, unknown>} Objeto estructurado de la solicitud 80103.
   */
  reverseBuildSolicitud80103(
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
      // Agregar datos del estado del formulario
      tablaDatosCapacidadInstalada: this.reverseMapCapacidadInstalada(solicitudData['LISTA_CAPACIDAD']),
      montosDeInversionTablaDatos: this.reverseMapMontosInversion(solicitudData['MONTOS']),
      empleadosTablaDatos: this.reverseMapEmpleados(solicitudData['DATOS_EMPLEADOS']),
      complementarPlantaDatos: this.reverseMapDatosComplementarios(solicitudData['DATOS_COMPLEMENTARIOS']),
      complementarFirmanteDatos: this.reverseMapFirmantes(solicitudData['FIRMANTES'])
    };
  }

  /**
 * Mapea los datos de cumplimentos desde la solicitud recibida.
 * @param solicitud Datos de solicitud que contienen información de cumplimentos
 * @returns Objeto con los datos de cumplimentos mapeados
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
        aceptarObligacionFiscal: true // Valor por defecto, debería derivarse de los datos de declaración
      },
    };
  }

  /**
   * Mapea los datos de socios accionistas desde la solicitud recibida.
   * @param socios Datos de socios accionistas a mapear
   * @returns Arreglo de objetos con los datos de socios accionistas mapeados
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
   * @param notarios Datos de notarios/federatarios a mapear
   * @returns Arreglo de objetos con los datos de notarios/federatarios mapeados
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
   * @param plantas Datos de plantas a mapear
   * @returns Arreglo de objetos con los datos de plantas mapeados
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
   * @param plantas Datos de plantas submanufactureras a mapear
   * @returns Arreglo de objetos con los datos de plantas submanufactureras mapeados
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
   * @param empresas Datos de empresas nacionales a mapear
   * @returns Arreglo de objetos con los datos de empresas nacionales mapeados
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

  /** 
   * Mapea los datos de empresas extranjeras desde la solicitud recibida.
   * @param empresas Datos de empresas extranjeras a mapear
   * @returns Arreglo de objetos con los datos de empresas extranjeras mapeados
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
   * @param solicitudData Datos de la solicitud que contienen información de plantas
   * @returns Arreglo de objetos con los datos de plantas completas mapeados
   */
  private reverseMapPlantasCompletas(solicitudData: Record<string, unknown>): unknown[] {
    // Extraer información básica de plantas - esto debería venir de la estructura principal de plantas
    const plantData = this.reverseMapPlantas([solicitudData]);
    
    return plantData;
  }

  /**
   * Mapea los datos de capacidad instalada desde la solicitud recibida.
   * @param capacidadData Datos de capacidad instalada a mapear
   * @returns Arreglo de objetos con los datos de capacidad instalada mapeados
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
   * @param montosData Datos de montos de inversión a mapear
   * @returns Arreglo de objetos con los datos de montos de inversión mapeados
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
   * @param empleadosData Datos de empleados a mapear
   * @returns Arreglo de objetos con los datos de empleados mapeados
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
   * @param complementariosData Datos complementarios a mapear
   * @returns Arreglo de objetos con los datos complementarios mapeados
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
   * @param firmantesData Datos de firmantes a mapear
   * @returns Arreglo de objetos con los datos de firmantes mapeados
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
   * @param anexoData Datos del anexo a mapear
   * @returns Objeto con los datos del anexo completo mapeados
   */
  private reverseMapAnexoCompleto(anexoData: Record<string, unknown>): Record<string, unknown> {
    // Agregar verificaciones de null/undefined para anexoData
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
   * @param proveedorData Datos de proveedor/cliente a mapear
   * @returns Arreglo de objetos con los datos de proveedor/cliente mapeados
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
   * @param datosNavegar Datos de navegación a mapear
   * @returns Objeto con los datos de navegación mapeados
   */
  private reverseMapDatosNavegar(datosNavegar: unknown): DatosParaNavegar {
    // Agregar verificación de null/undefined para datosNavegar
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
   * @param anexoDosData Datos del anexo dos a mapear
   * @returns Arreglo de objetos con los elementos del anexo dos mapeados
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
   * @param proyectoData Datos del proyecto IMMEX a mapear
   * @returns Arreglo de objetos con los datos del proyecto IMMEX mapeados
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

  /** 
   * Mapea los datos de anexos básicos desde la solicitud recibida.
   * @param anexos Datos de anexos básicos a mapear
   * @returns Arreglo de objetos con los datos de anexos básicos mapeados
   */
  private reverseMapAnexoItems(anexos: unknown): unknown[] {
    const DATA = (anexos as Record<string, unknown>[]) ?? [];
    return DATA.map((anexo) => ({
      encabezadoFraccion: anexo['descripcion'] ?? '',
      encabezadoDescripcion: anexo['descripcionTestado'] ?? '',
    }));
  }
}
