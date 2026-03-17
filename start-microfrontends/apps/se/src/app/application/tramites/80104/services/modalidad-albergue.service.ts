import { AmpliacionServiciosResponse , Anexo1, AnexoDosItem, CapacidadInstaladaItem, CatalogoResponso, ComplementarItem, DatosParaNavegar, EmpleadoItem, FirmanteItem, InfoServicios, MontoInversionItem, PlantasSubfabricanteResponse, ProveedorClienteDatosTabla, ProyectoImmexEncabezado} from '../models/nuevo-programa-industrial.model';
import { Catalogo, JSONResponse, RespuestaCatalogos } from '@libs/shared/data-access-user/src/core/models/shared/catalogos.model';
import { HttpCoreService,formatearFechaYyyyMmDd } from '@libs/shared/data-access-user/src';
import { Observable, map } from 'rxjs';
import { ComplimentosService } from '../../../shared/services/complimentos.service';
import { DatosComplimentos } from '../../../shared/models/complimentos.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PROC_80104 } from '../servers/api-route';
import { PlantasSubfabricante } from '../../../shared/models/empresas-subfabricanta.model';
import { Tramite80101Query } from '../estados/tramite80101.query';
import { Tramite80101State } from '../estados/tramite80101.store';

@Injectable({
  providedIn: 'root',
})
export class NuevoProgramaIndustrialService {
 constructor(private readonly http: HttpClient, private tramite80101Query: Tramite80101Query, public httpService: HttpCoreService, private complimentosService: ComplimentosService
   ) {
    // No se necesita lógica de inicialización adicional.
    this.setProcedure();
    this.setProcedureNo();
   }

   setProcedureNo(): void {
    this.complimentosService.setProcedureNo('80104');
  }
 
   /**
    * Establece el procedimiento actual para la gestión de trámites industriales.
    * Asigna el identificador de procedimiento 'st_t80101' y lo configura en el servicio de cumplimientos.
    *
    * @returns {void} No retorna ningún valor.
    */
   setProcedure():void{
     const PROCEDURE='sat-t80104'
     this.complimentosService.setProcedure(PROCEDURE);
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
  return this.http
    .get<PlantasSubfabricanteResponse>('assets/json/80102/submanufactureras-disponibles-datos.json')
    .pipe(map(response => response.data));
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
  guardarDatosPost(body:Record<string, unknown>): Observable<JSONResponse> {
    return this.httpService.post<JSONResponse>(PROC_80104.GUARDAR, { body: body });
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
    * const socios = buildSociosAccionistas(listaA, listaB, BASE, datos);
    */
    buildComplimentos(data: Record<string, unknown>, base: Record<string, unknown>): Record<string, unknown> {
      const DATOS_COMPLIMENTOS = (data as Record<string, unknown>)['datosComplimentos'] as DatosComplimentos;
      return {
        ...base,
        notario: {
          ...(typeof base['notario'] === 'object' && base['notario'] !== null ? base['notario'] : {}),
          rfc: DATOS_COMPLIMENTOS?.formaModificaciones?.rfc ?? '',
          numeroActa: DATOS_COMPLIMENTOS?.formaModificaciones?.nombreDeActa ?? '',
          numeroNotario: DATOS_COMPLIMENTOS?.formaModificaciones?.nombreDeNotaria ?? '',
          entidadFederativa: DATOS_COMPLIMENTOS?.formaModificaciones?.estado ?? '',
          fechaActa: formatearFechaYyyyMmDd(DATOS_COMPLIMENTOS?.formaModificaciones?.fechaDeActa ?? ''),
        },
        modalidad: DATOS_COMPLIMENTOS?.modalidad ?? '',
        booleanGenerico: DATOS_COMPLIMENTOS?.programaPreOperativo ? true : false,
        descripcionSistemasMedicion: DATOS_COMPLIMENTOS?.datosGeneralis?.paginaWWeb ?? '',
        descripcionLugarEmbarque: DATOS_COMPLIMENTOS?.datosGeneralis?.localizacion ?? '',
        capacidadAlmacenaje: DATOS_COMPLIMENTOS?.formaModificaciones?.nombreDeNotaria ?? '',
        numeroPermiso: DATOS_COMPLIMENTOS?.obligacionesFiscales?.opinionPositiva === '1' ? 'SI' : '',
        fechaOperacion: DATOS_COMPLIMENTOS?.obligacionesFiscales?.fechaExpedicion ?? '',
        nomOficialAutorizado: DATOS_COMPLIMENTOS?.formaModificaciones?.nombreDelFederatario ?? '',
  
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
   * @param data Objeto con datos complementarios necesarios para completar el payload.
   *
   * @returns Un nuevo arreglo que contiene los objetos combinados y mapeados
   *          con la información de los dos arreglos de entrada.
   *
   * @example
   * const socios = buildSociosAccionistas(listaA, listaB, BASE, datos);
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
          "idTipoTramite": 80104,
          "cveDeclaracion": "123"
        }
      ];
      return RESULT;
    }
  
  
    /**
   * Build plantasControladoras by taking the base array
   * and appending the length of each key in empresasSeleccionadas
   * to every planta item.
   *
   * @param array  Object with keys whose values are arrays
   * @param base            Existing plantasControladoras array
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
   * @param arr Arreglo de datos de entrada para cada planta.
   * @param base Objeto base que se combina con los datos específicos de cada planta.
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
          testado: true,
        });
    
        const MAP_MONTOS_INVERSION = (item: MontoInversionItem): unknown => ({
          idPlantaM: item.PLANTA ?? "",
          idMonto: (item.MONTO ?? "").toString(),
          tipo: item.TIPO ?? "",
          descTipo: item.DESC_TIPO ?? "",
          cantidad: (item.CANTIDAD ?? "").toString(),
          descripcion: item.DESCRIPCION ?? "",
          monto: (item.MONTO ?? "").toString(),
          testado: true,
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
          testado: true,
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
     
        const listaCapacidad = ((data as { tablaDatosCapacidadInstalada?: CapacidadInstaladaItem[] }).tablaDatosCapacidadInstalada || []).map(MAP_CAPACIDAD_INSTALADA);
        const montos = ((data as { montosDeInversionTablaDatos?: MontoInversionItem[] }).montosDeInversionTablaDatos || []).map(MAP_MONTOS_INVERSION);
        const datosEmpleados = ((data as { empleadosTablaDatos?: EmpleadoItem[] }).empleadosTablaDatos || []).map(MAP_EMPLEADOS);
        const datosComplementariosPlantaDTOs = ((data as { complementarPlantaDatos?: ComplementarItem[] }).complementarPlantaDatos || []).map(MAP_COMPLEMENTAR);
        const firmantes = ((data as { complementarFirmanteDatos?: FirmanteItem[] }).complementarFirmanteDatos || []).map(MAP_FIRMANTES);
     
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
        const RESULT_DATA = { ...(typeof RESULT[0] === 'object' && RESULT[0] !== null ? RESULT[0] : {}), listaCapacidad, montos, datosEmpleados, datosComplementariosPlantaDTOs, firmantes };
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
          testado: true,
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
          fechaFinVigencia: null,
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
          fechaFinVigencia: item.encabezadoFechaVigencia,
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
 * Build plantasControladoras by taking the base array
 * and appending the length of each key in empresasSeleccionadas
 * to every planta item.
 *
 * @param empresasSeleccionadas  Object with keys whose values are arrays
 * @param basePlantas            Existing plantasControladoras array
 */
  buildPlantasControladoras(empresasSeleccionadas: unknown[], basePlantas: unknown[]): unknown[] {
    const RESULT: unknown[] = [];

    empresasSeleccionadas.forEach(empRaw => {
      const EMP = empRaw as {
        calle?: string;
        numeroExterior?: string;
        numeroInterior?: string;
        codigoPostal?: string;
        colonia?: string;
        municipioDelegacion?: string;
        entidadFederativa?: string;
        pais?: string;
        registroFederalContribuyentes?: string;
        razonSocial?: string;
        domicilioFiscalSolicitante?: string;
      };
      basePlantas.forEach(planta => {
        const PLANTA = (planta && typeof planta === 'object') ? planta : {};
        RESULT.push({
          ...PLANTA,
          calle: EMP.calle ?? '',
          numeroExterior: EMP.numeroExterior ?? '',
          numeroInterior: EMP.numeroInterior ?? '',
          codigoPostal: EMP.codigoPostal ?? '',
          colonia: EMP.colonia ?? '',
          delegacionMunicipio: EMP.municipioDelegacion ?? '',
          entidadFederativa: EMP.entidadFederativa ?? '',
          pais: EMP.pais ?? '',
          rfc: EMP.registroFederalContribuyentes ?? '',
          razonSocial: EMP.razonSocial ?? '',
          domicilioFiscal: EMP.domicilioFiscalSolicitante ?? ''
        });
      });
    });
    return RESULT;
  }

}
