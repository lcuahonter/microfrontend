import { Anexo1, AnexoDosItem, CapacidadInstaladaItem, ComplementarItem, DatosParaNavegar, EmpleadoItem, FirmanteItem, InfoServicios, MontoInversionItem, ProveedorClienteDatosTabla, ProyectoImmexEncabezado, Servicio } from '../models/autorizacion-programa-nuevo.model';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Catalogo, JSONResponse, JsonResponseCatalogo, RespuestaCatalogos } from '@libs/shared/data-access-user/src/core/models/shared/catalogos.model';
import { HttpCoreService,formatearFechaYyyyMmDd } from '@libs/shared/data-access-user/src';
import { Tramite80102State, Tramite80102Store } from '../estados/tramite80102.store';
import { CatalogoDatosIdx } from '../../../shared/models/federatarios-y-plantas.model';
import { ComplimentosService } from '../../../shared/services/complimentos.service';
import { DatosComplimentos } from '../../../shared/models/complimentos.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PROC_80102 } from '../servers/api-route';
import { PlantasSubfabricante } from '../../../shared/models/empresas-subfabricanta.model';
import { Tramite80102Query } from '../estados/tramite80102.query';

@Injectable({
  providedIn: 'root',
})
export class AutorizacionProgrmaNuevoService {
 constructor(private readonly http: HttpClient, public tramite80102Store: Tramite80102Store,
  private tramite80102Query:Tramite80102Query,public httpService: HttpCoreService,private complimentosService:ComplimentosService) {
   this.setProcedure();
   this.setProcedureNo();
  }

   setProcedureNo(): void {
    this.complimentosService.setProcedureNo('80102');
  }
  /**
   * Subject que mantiene el estado actual sobre si la tabla tiene datos.
   * Permite la suscripción reactiva a los cambios en la presencia de datos en la tabla.
   */
  private _tieneDatosDeTabla$ = new BehaviorSubject<boolean>(false);

    /**
   * Observable que expone el estado de si la tabla tiene datos.
   * Se utiliza para que otros componentes puedan reaccionar a los cambios sin modificar el estado directamente.
   */
  public tieneDatosDeTabla$ = this._tieneDatosDeTabla$.asObservable();

  /**
   * Actualiza el estado interno indicando si la tabla tiene datos.
   * Emite el nuevo valor a todos los suscriptores del observable correspondiente.
   */
  setTieneDatosDeTabla(value: boolean): void {
    this._tieneDatosDeTabla$.next(value);
  }
  /**
   * Obtiene los datos de ampliación de servicios desde un archivo JSON.
   * @returns {Observable<any>} - Observable con los datos obtenidos.
   */
  getDatos(): Observable<InfoServicios> {
    return this.http
    .get<Servicio[]>("assets/json/80205/ampliacion-servicios.json")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .pipe(map((res: any) => res.data.InfoServicios));
}
   
  /**
   * Obtiene la lista de selección de ingreso desde un archivo JSON.
   * @returns {Observable<any>} - Observable con los datos obtenidos.
   */
  obtenerIngresoSelectList(): Observable<Catalogo[]> {
    return this.http
    .get<Catalogo[]>("assets/json/80205/ampliacion-IMMEX-dropdown.json")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .pipe(map((res: any) => res.data));
  }

   /**
   * Obtiene la lista de estados.
   * @method obtenerListaEstado
   * @returns {Observable<RespuestaCatalogos>} Observable con la lista de estados.
   */
   obtenerListaEstado(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(
      'assets/json/80102/estado-datos.json'
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
          'assets/json/80102/submanufactureras-disponibles-datos.json'
        )
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .pipe(map((response: any) => response.data))
    );
  }

  obtenerComplimentos(): Observable<DatosComplimentos> {
    return this.http.get<DatosComplimentos>("assets/json/80102/datos-complimentos.json");
  }

  /**
 * Actualiza el estado del formulario con los datos proporcionados.
 * 
 * @param DATOS - Estado de la solicitud `Solicitud230401State` con la información 
 *                del tipo de solicitud a actualizar en el store.
 */
actualizarEstadoFormulario(DATOS: Tramite80102State): void {
  this.tramite80102Store.update((state) => ({
    ...state,
    ...DATOS
  }))

}

/**
* Obtiene los datos del registro de toma de muestras de mercancías desde un archivo JSON.
* 
* @returns Observable con los datos del estado de la solicitud `Solicitud230401State`,
*          cargados desde el archivo JSON especificado en la ruta de `assets`.
*/
getRegistroTomaMuestrasMercanciasData(): Observable<Tramite80102State> {
  return this.http.get<Tramite80102State>('assets/json/80102/respuestaDeActualizacionDe.json');
}

/**
   * Obtiene los datos del catálogo de federatarios y plantas desde un archivo JSON local.
   *
   * Este método realiza una solicitud HTTP GET para recuperar los datos del catálogo
   * almacenados en el archivo `federatarios-y-plantas-catalogos.json` ubicado en la
   * carpeta de activos (`assets/json/80101/`). Los datos recuperados se devuelven como
   * un observable de tipo `CatalogoDatosIdx`.
   *
   * @returns {Observable<CatalogoDatosIdx>} Un observable que emite los datos del catálogo
   * de federatarios y plantas.
   *
   * @example
   * this.nuevoProgramaIndustrialService.getFederataiosyPlantaCatalogosData()
   *   .subscribe((datos: CatalogoDatosIdx) => {
   *     console.log('Datos del catálogo:', datos);
   *   });
   *
   * @remarks
   * Este método es útil para cargar información estática de catálogos que se utiliza
   * en la aplicación, como listas de federatarios y plantas. Asegúrese de que el archivo
   * JSON exista en la ubicación especificada para evitar errores de carga.
   */
  getFederataiosyPlantaCatalogosData(): Observable<CatalogoDatosIdx> {
    return this.http.get<CatalogoDatosIdx>(
      'assets/json/80101/federatarios-y-plantas-catalogos.json'
    );
  }

/**
 * Obtiene todos los datos del estado almacenado en el store.
 * @returns {Observable<Tramite80101State>} Observable con todos los datos del estado.
 */
getAllState(): Observable<Tramite80102State> {
  return this.tramite80102Query.allStoreData$;
}

/**
 * Envía los datos proporcionados mediante una solicitud HTTP POST a la ruta especificada.
 * 
 * @param body - Objeto que contiene los datos a enviar en el cuerpo de la solicitud.
 * @returns Observable con la respuesta de la solicitud POST.
 */
guardarDatosPost(body: Record<string, unknown>): Observable<JSONResponse> {
  return this.httpService.post<JSONResponse>(PROC_80102.GUARDAR, { body: body });
}
/**
 * Establece el procedimiento actual para la gestión de trámites industriales.
 * Asigna el identificador de procedimiento 'st_t80101' y lo configura en el servicio de cumplimientos.
 *
 * @returns {void} No retorna ningún valor.
 */
setProcedure():void{
  const PROCEDURE='sat-t80102'
  this.complimentosService.setProcedure(PROCEDURE);
}

/**
 * Obtiene información del servicio IMMEX desde el catálogo correspondiente.
 *
 * Realiza una solicitud HTTP GET al endpoint definido en `apiRoutes.servicoImex`
 * y retorna la respuesta como un observable de tipo `JsonResponseCatalogo`.
 *
 * @returns Observable que emite la respuesta del catálogo IMMEX.
 */
getServicoImmex(): Observable<JsonResponseCatalogo> {
  
     return this.httpService.get<JsonResponseCatalogo>(
    PROC_80102.servicoImex,
    {},
    false
  );
}

 /**
   * Recupera una lista de países desde el API de catálogo.
   *
   * @returns Un Observable que emite la respuesta con un arreglo de países.
   */
  getPais(): Observable<JsonResponseCatalogo> {
    return this.httpService.get<JsonResponseCatalogo>(
      PROC_80102.PAIS,
      {},
      false
    );
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
 * const socios = buildComplimentos(listaA, listaB, BASE, datos);
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
        fechaActa: formatearFechaYyyyMmDd(DATOS_COMPLIMENTOS?.formaModificaciones?.fechaDeActa ?? '')
      },
      modalidad: DATOS_COMPLIMENTOS?.modalidad ?? '',
      booleanGenerico: DATOS_COMPLIMENTOS?.programaPreOperativo ? true : false,
      descripcionSistemasMedicion: DATOS_COMPLIMENTOS?.datosGeneralis?.paginaWWeb ?? '',
      descripcionLugarEmbarque: DATOS_COMPLIMENTOS?.datosGeneralis?.localizacion ?? '',
      capacidadAlmacenaje: DATOS_COMPLIMENTOS?.formaModificaciones?.nombreDeNotaria ?? '',
      numeroPermiso: DATOS_COMPLIMENTOS?.obligacionesFiscales?.opinionPositiva === '1' ? 'SI' : '',
      fechaOperacion: DATOS_COMPLIMENTOS?.obligacionesFiscales?.fechaExpedicion,
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


/**
 * Genera un array de empresas nacionales combinando datos de entrada con una base.
 * @param array - Datos dinámicos con propiedades como servicio, RFC, año y número IMMEX.
 * @param base - Plantilla base con valores por defecto para cada empresa.
 * @returns Array de objetos que fusiona la base con los datos del array.
 * @example buildEmpresaacionales(input, base) => [{ rfc: 'RFC123', razonSocial: 'Empresa X', idServicio: 'S01', ... }]
 */
  buildEmpresaNacionales(base: unknown[], array: Record<string, unknown>[] = []): unknown[] {
    const RESULT: unknown[] = [];
    array.forEach(arr => {
      base.forEach(item => {
        const ITEM = (item && typeof item === 'object') ? item : {};
        RESULT.push({
          ...ITEM,      
          idServicio: arr['servicio'] ?? '0',
          rfc: arr['registroContribuyentes'] ?? '',
          tiempoPrograma: arr['anoIMMEX'] ?? '',
          numeroPrograma: arr['numeroIMMEX'] ?? '',
          razonSocial: arr['denominacionSocial'] ?? '',
        });
      });
    });
    return RESULT;
  }

/**
 * Construye un array de empresas extranjeras combinando datos de entrada con una base.
 * @param array - Datos dinámicos con propiedades como dirección, servicio y nombre.
 * @param base - Plantilla base con valores por defecto para cada empresa extranjera.
 * @returns Array de objetos fusionando la base con los datos del array.
 * @example buildEmpresaExtranjera(input, base) => [{ nombre: 'Empresa X', idServicio: 'S01', idDireccionSol: 'Dirección Y' }]
 */

  buildEmpresaExtranjera(base: unknown[], array: Record<string, unknown>[] = []): Record<string, unknown>[] {
    const RESULT: Record<string, unknown>[] = [];
    array.forEach(arr => {
      base.forEach(item => {
        const ITEM = (item && typeof item === 'object') ? item : {};
        RESULT.push({
          ...ITEM,     
          idDireccionSol: arr['direccionEmpresaExtranjera'],
          idServicio: arr['servicio'],
          nombre: arr['nombreEmpresa'],
        });
      });
    });
    return RESULT;
  }


    /** Construye el arreglo de declaraciones de solicitud a partir de los datos proporcionados. */
  buildDeclaracionSolicitudEntries(data: Record<string, unknown>): unknown[] {
    const RESULT = [
      {
          "acepto": (data['datosComplimentos'] as { obligacionesFiscales: { aceptarObligacionFiscal: boolean } }).obligacionesFiscales.aceptarObligacionFiscal ? 1 : 0,
          "idTipoTramite": 80102,
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

   /** Realiza una solicitud POST para obtener los datos de la solicitud seleccionada desde el servidor. */
    fetchMostrarDatos(id: string): Observable<unknown> {
      return this.httpService.get<unknown>(PROC_80102.MOSTRAR(id));
    }
 
  /**
   * Construye el objeto de solicitud 80102 a partir del payload recibido.
   * @param built Payload recibido desde el servidor.
   * @returns {Record<string, unknown>} Objeto estructurado de la solicitud 80102.
   */
  reverseBuildSolicitud80102(
    built: Record<string, unknown>
  ): Record<string, unknown> {
    return {
      datosComplimentos: this.reverseMapComplimentos(built['solicitud']),
      tablaDatosComplimentos: this.reverseMapSociosAccionistas(built['sociosAccionistas']),
      tablaDatosFederatarios: this.reverseMapNotarios(built['notarios']),
      plantasImmexTablaLista: this.reverseMapPlantas(built['planta']),
      empressaSubFabricantePlantas: {
        plantasSubfabricantesAgregar: this.reverseMapPlantasSubmanufactureras(built['plantasSubmanufactureras'])
      },
      datos: this.reverseMapEmpresasNacionales(built['empresasNacionales']),
      datosEmpresaExtranjera: this.reverseMapEmpresasExtranjeras(built['empresasExtranjeras']),
      annexoDosTres: {
        anexoDosTablaLista: this.reverseMapAnexo(built['anexoII']),
        anexoTresTablaLista: this.reverseMapAnexo(built['anexoIII']),
      },
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
      },
      modalidad: DATA['modalidad'] ?? '',
      programaPreOperativo: DATA['booleanGenerico'] ?? false,
      datosGeneralis: {
        paginaWWeb: DATA['descripcionSistemasMedicion'] ?? '',
        localizacion: DATA['descripcionLugarEmbarque'] ?? '',
      },
      obligacionesFiscales: {
        opinionPositiva: DATA['numeroPermiso'] === 'SI' ? '1' : '',
        fechaExpedicion: DATA['fechaOperacion'] ?? '',
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
   * Mapea los datos de notarios desde la solicitud recibida.
   * @param notarios
   * @returns
   */
  private reverseMapNotarios(notarios: unknown): unknown[] {
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
  /** Mapea los datos de anexos desde la solicitud recibida.
   * @param anexos
   * @returns
   */
  private reverseMapAnexo(anexos: unknown): unknown[] {
    const DATA = (anexos as Record<string, unknown>[]) ?? [];
    return DATA.map((anexo) => ({
      encabezadoFraccion: anexo['descripcion'] ?? '',
      encabezadoDescripcion: anexo['descripcionTestado'] ?? '',
    }));
  }
}