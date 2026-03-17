/* eslint-disable complexity */
import { Catalogo, ENVIRONMENT, esValidArray, esValidObject, JSONResponse } from '@libs/shared/data-access-user/src';
import { FRACCION_DESCRIPCION, GUARDAR_SOLICITUD, MOSTRAR, OBTENER_CURP, RFC_BUSCAR_REPRESENTANTE_LEGAL, UNIDAD_MEDIDA } from '../../servers/api-route';
import { Observable, combineLatest, map } from 'rxjs';
import { AvisocalidadQuery } from '../../estados/queries/aviso-calidad.query';
import { DatosDomicilioLegalQuery } from '../../estados/queries/datos-domicilio-legal.query';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TercerosFabricanteQuery } from '../../estados/queries/terceros-fabricante.query';
import { TramitePagoBancoQuery } from '../../estados/queries/pago-banco.query';
import { DatosDomicilioLegalStore } from '../../estados/stores/datos-domicilio-legal.store';
import { TercerosFabricanteStore } from '../../estados/stores/terceros-fabricante.store';
import { TramitePagoBancoStore } from '../../estados/stores/pago-banco.store';
import { DatosDomicilioLegalService } from "../../services/datos-domicilio-legal.service";
import { Subject, takeUntil } from "rxjs";
import { DatosServiceService } from '../../../shared/services/datos-service.service';
import { TramiteStore } from '@ng-mf/data-access-user';
/**
 * @description
 * Servicio compartido registrado en el inyector raíz de Angular.
 * Proporciona una instancia única (singleton) accesible en toda la aplicación.
 * Ideal para lógica reutilizable, gestión de estado o comunicación entre componentes.
 */

@Injectable({
  providedIn: 'root'
})

export class Shared2605Service {
  /**
   * Identificador único de la solicitud actual.
   * Se utiliza para asociar y rastrear la solicitud a lo largo del ciclo de vida del trámite.
   * Puede ser asignado por el backend o generado en el frontend antes de enviar la solicitud.
   */
  public idSolicitud: number = 0;
  /**
   * Indica si la sección de datos del formulario principal es válida.
   */

  public setDenominacionRazonSocial: any;

  /**
* Indica si la sección de datos del formulario principal es válida.
*/
  public paisesCatalogoList: any;

  /**
* Indica si la sección de datos del formulario principal es válida.
*/
  public audonaCatalogoList: any;

  /**
* Indica si la sección de datos del formulario principal es válida.
*/

  public setRfcDel: any;

  /**
* Indica si la sección de datos del formulario principal es válida.
*/

  public setCorreoElectronico: any;
  /**
   * Indica si la sección de datos del formulario principal es válida.
   */

  public datosDelFormValidity: boolean = false;
  /**
   * Indica si la sección de domicilio es válida.
   */
  public domicilioValidity: boolean = false;
  /**
   * Indica si la sección de manifiestos es válida.
   */
  public manifiestosValidity: boolean = false;
  /**
   * Indica si la sección de representante legal es válida.
   */
  public representanteValidity: boolean = false;
  /**
   * Indica si la sección de fabricante es válida.
   */
  public fabricanteValidity: boolean = false;
  /**
   * Indica si la sección de formulador es válida.
   */
  public formuladorValidity: boolean = false;
  /**
   * Indica si la sección de proveedor es válida.
   */
  public proveedorValidity: boolean = false;
  /**
   * Notificador para destruir observables.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
 * @description
 * Constructor del servicio `Shared2605Service`.
 * Se ejecuta al momento de crear la instancia del servicio.
 * Ideal para inicializar propiedades, configurar dependencias o preparar el estado interno.
 */
  constructor(
    private datosDomicilioLegalQuery: DatosDomicilioLegalQuery,
    private tercerosFabricanteQuery: TercerosFabricanteQuery,
    private solicitudPagoBancoQuery: TramitePagoBancoQuery,
    private avisocalidadQuery: AvisocalidadQuery,
    private datosDeLaStore: DatosDomicilioLegalStore,
    private tercerosFabricanteStore: TercerosFabricanteStore,
    private pagoBancoStore: TramitePagoBancoStore,
    private tramiteStore: TramiteStore,
    private service: DatosDomicilioLegalService,
    private _http: HttpClient
  ) {
    // Get the current value of procedureno from the TramiteStore state
    const currentProcedureNo = (this.tramiteStore as any).getValue()?.procedureno;
    if (currentProcedureNo) {
      this.service
      .getPaisesList(currentProcedureNo?.toString())
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data): void => {
        this.paisesCatalogoList=data.datos ?? []
      });

      this.service
      .getAduanasList(currentProcedureNo?.toString())
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data): void => {
        this.audonaCatalogoList=data.datos ?? []  
      });
    }
      
  
  }

  /**
   * @description
   * Merges all state objects into one, removing duplicate keys.
   * If duplicates exist, keeps only the meaningful (non-empty) value.
   * @returns {Observable<Record<string, unknown>>} Observable with the merged state.
   */
  getAllState(): Observable<Record<string, unknown>> {
    return combineLatest([
      this.datosDomicilioLegalQuery.allStoreData$,
      this.tercerosFabricanteQuery.allStoreData$,
      this.solicitudPagoBancoQuery.allStoreData$,
      this.avisocalidadQuery.allStoreData$
    ]).pipe(
      map(([datosDomicilioLegal, tercerosFabricante, solicitudPagoBanco, avisocalidad]) =>
        Shared2605Service.mergeStates(
          datosDomicilioLegal as unknown as Record<string, unknown>,
          tercerosFabricante as unknown as Record<string, unknown>,
          solicitudPagoBanco as unknown as Record<string, unknown>,
          avisocalidad as unknown as Record<string, unknown>
        )
      )
    );
  }

  /**
   * @description
   * Utility function to merge multiple state objects.
   * Removes duplicate keys and retains only meaningful values.
   * @param {...Record<string, any>} states - List of state objects to merge.
   * @returns {Record<string, unknown>} Merged state object.
   */
  private static mergeStates(...states: Record<string, unknown>[]): Record<string, unknown> {
    const RESULT: Record<string, unknown> = {};

    for (const STATE of states) {
      for (const [KEY, VALUE] of Object.entries(STATE)) {
        const EXISTING = RESULT[KEY];

        const IS_MEANINGFUL = VALUE !== null && VALUE !== undefined &&
          !(typeof VALUE === 'string' && VALUE.trim() === '') &&
          !(Array.isArray(VALUE) && VALUE.length === 0);

        if (!EXISTING || IS_MEANINGFUL) {
          RESULT[KEY] = VALUE;
        }
      }
    }

    return RESULT;
  }

  /**
 * Construye el objeto de carga útil (payload) que representa la solicitud completa
 * para el trámite correspondiente, integrando los datos del solicitante, establecimiento,
 * mercancías, representante legal, terceros involucrados y el pago de derechos.
 *
 * @param data - Objeto que contiene todos los datos fuente necesarios para construir la solicitud.
 *               Se espera que incluya información sobre el establecimiento, SCIAN, mercancías,
 *               representante legal, y tablas de terceros como proveedor, formulador y fabricante.
 * @param discriminatorValue - Valor numérico que identifica el tipo de solicitud o trámite.
 *
 * @returns Un objeto `Record<string, unknown>` que representa la estructura completa de la solicitud,
 *          listo para ser enviado o procesado por el sistema.
 */
  // eslint-disable-next-line class-methods-use-this
  buildPayload(data: Record<string, unknown>, discriminatorValue: number): Record<string, unknown> {
    const aduanasDeEntrada = Array.isArray(data['aduanasDeEntrada']) ? data['aduanasDeEntrada'] : [];
    const matchingClaves = this.audonaCatalogoList?.filter((item: any) => aduanasDeEntrada.includes(item?.descripcion))
      .map((item: any) => item?.clave);
    data['aduanaId'] = matchingClaves;
    const ESTABLECIMIENTO = Shared2605Service.buildEstablecimiento(data);
    const DATOS_SCIAN = Shared2605Service.buildDatosScian(data);
    const MERCANCIAS = Shared2605Service.buildMercancias(data, discriminatorValue);
    const REPRESENTANTE_LEGAL = Shared2605Service.buildRepresentanteLegal(data);
    const PROVEEDOR_TABLA = Shared2605Service.buildTercerosTablaDatos(data['Proveedor'] as Array<{ tbodyData?: Array<unknown> }>, data['proveedorPais'] as Catalogo);
    const FORMULADOR_TABLA = Shared2605Service.buildTercerosTablaDatos(data['Formulador'] as Array<{ tbodyData?: Array<unknown> }>, data['formuladorPais'] as Catalogo);
    const FABRICANTE_TABLA = Shared2605Service.buildTercerosTablaDatos(data['Fabricante'] as Array<{ tbodyData?: Array<unknown> }>, data['fabricantePais'] as Catalogo);
    const PAGO_DERECHOS = Shared2605Service.buildPagoDerechos(data);
    return {
      idSolicitud: this.idSolicitud || 0,
      solicitante: {
        rfc: ENVIRONMENT.RFC,
        nombre: "ACEROS ALVARADO S.A. DE C.V.",
        actividadEconomica: "Fabricación de productos de hierro y acero",
        correoElectronico: "contacto@acerosalvarado.com",
        domicilio: {
          pais: "México",
          codigoPostal: "06700",
          estado: "Ciudad de México",
          municipioAlcaldia: "Cuauhtémoc",
          localidad: "Centro",
          colonia: "Roma Norte",
          calle: "Av. Insurgentes Sur",
          numeroExterior: "123",
          numeroInterior: "Piso 5, Oficina A",
          lada: "",
          telefono: "123456"
        }
      },
      solicitud: {
        discriminatorValue: discriminatorValue,
        declaracionesSeleccionadas: true,
        regimen: "",
        informacionConfidencial: true
      },
      establecimiento: ESTABLECIMIENTO,
      datosSCIAN: DATOS_SCIAN,
      mercancias: MERCANCIAS,
      representanteLegal: REPRESENTANTE_LEGAL,
      gridTerceros_TIPERS_PVD: PROVEEDOR_TABLA,
      gridTerceros_TIPERS_FAB: FABRICANTE_TABLA,
      gridTerceros_TIPERS_FAC: FORMULADOR_TABLA,
      gridTerceros_TIPERS_DES: [
        {
          "idPersonaSolicitud": "1",
          "ideTipoTercero": "TIPERS.FAB",
          "personaMoral": "1",
          "booleanExtranjero": "0",
          "booleanFisicaNoContribuyente": "0",
          "denominacion": "LABORATORIOS PISA S.A. DE C.V.",
          "razonSocial": "LABORATORIOS PISA S.A. DE C.V.",
          "rfc": "LPI950101ABC",
          "curp": "",
          "nombre": "",
          "apellidoPaterno": "",
          "apellidoMaterno": "",
          "telefono": "5555123456",
          "correoElectronico": "contacto@pisa.com.mx",
          "actividadProductiva": "MANUFACTURA",
          "actividadProductivaDesc": "Fabricación de productos farmacéuticos",
          "descripcionGiro": "Laboratorio farmacéutico",
          "numeroRegistro": "REG-001-2024",
          "domicilio": {
            "calle": "Av. Industria No. 2000",
            "numeroExterior": "2000",
            "numeroInterior": "A",
            "pais": {
              "clave": "MEX",
              "nombre": "México"
            },
            "colonia": {
              "clave": "001",
              "nombre": "Industrial"
            },
            "delegacionMunicipio": {
              "clave": "015",
              "nombre": "Cuauhtémoc"
            },
            "localidad": {
              "clave": "001",
              "nombre": "Ciudad de México"
            },
            "entidadFederativa": {
              "clave": "09",
              "nombre": "Ciudad de México"
            },
            "informacionExtra": "Zona Industrial Norte",
            "codigoPostal": "06400",
            "descripcionColonia": "Industrial Norte"
          },
          "idSolicitud": "12345"
        }
      ],
      pagoDeDerechos: PAGO_DERECHOS
    };
  }

  /**
 * Construye el objeto que representa los datos del establecimiento, incluyendo
 * información del responsable sanitario, razón social, correo y domicilio.
 *
 * @param data - Objeto con los datos fuente del formulario o entrada del usuario.
 *               Se espera que contenga claves como `rfcDel`, `denominacionRazonSocial`,
 *               `correoElectronico`, `codigoPostal`, `estado`, `muncipio`, `localidad`,
 *               `colonia`, `calle`, `lada` y `telefono`.
 *
 * @returns Un objeto `Record<string, unknown>` con la estructura del establecimiento,
 *          listo para integrarse en el payload de la solicitud.
 */
  static buildEstablecimiento(data: Record<string, unknown>): Record<string, unknown> {
    return {
      "RFCResponsableSanitario": data['rfcDel'] || "",
      "rfcResponsableSanitario": data['rfcDel'] || "",
      "razonSocial": data['denominacionRazonSocial'] || "",
      "correoElectronico": data['correoElectronico'] || "",
      "domicilio": {
        "codigoPostal": data['codigoPostal'] || "",
        "entidadFederativa": {
          "clave": data['estado'] || ""
        },
        "descripcionMunicipio": data['muncipio'] || "",
        "informacionExtra": data['localidad'] || "",
        "descripcionColonia": data['colonia'] || "",
        "calle": data['calle'] || "",
        "lada": data['lada'] || "",
        "telefono": data['telefono'] || "",
      },
      "original": "",
      "avisoFuncionamiento": true,
      "numeroLicencia": "123456",
      "aduanas": data['aduanaId'] || [],
    }
  }

  /**
 * Construye el objeto que representa los datos del establecimiento, incluyendo
 * información del responsable sanitario, razón social, correo y domicilio.
 *
 * @param data - Objeto con los datos fuente del formulario o entrada del usuario.
 *               Se espera que contenga claves como `rfcDel`, `denominacionRazonSocial`,
 *               `correoElectronico`, `codigoPostal`, `estado`, `muncipio`, `localidad`,
 *               `colonia`, `calle`, `lada` y `telefono`.
 *
 * @returns Un objeto `Record<string, unknown>` con la estructura del establecimiento,
 *          listo para integrarse en el payload de la solicitud.
 */
  static buildDatosScian(data: Record<string, unknown>): { cveScian: string, descripcion: string, selected: boolean }[] {
    const NICOTABLA = data['nicoTabla'] as Array<{ [key: string]: unknown }> | undefined;
    if (!Array.isArray(NICOTABLA)) {
      return [];
    }

    return NICOTABLA.map(item => ({
      "cveScian": String(item['clave_Scian'] ?? ""),
      "descripcion": String(item['descripcion_Scian'] ?? ""),
      "selected": true
    }));
  }

  /**
 * Construye un arreglo de objetos que representan las mercancías incluidas en la solicitud,
 * a partir de los datos proporcionados en la tabla `mercanciaTabla`.
 *
 * @param data - Objeto fuente que contiene la clave `mercanciaTabla`, la cual debe ser un arreglo
 *               de objetos con información detallada de cada mercancía, como estado físico,
 *               fracción arancelaria, unidad de medida, país de origen, uso específico, etc.
 *
 * @returns Un arreglo de objetos `Record<string, unknown>` que representan cada mercancía
 *          con su estructura completa, listo para integrarse en el payload de la solicitud.
 *          Si no se proporciona una tabla válida, se retorna un arreglo vacío.
 */
  static buildMercancias(data: Record<string, unknown>, discriminatorValue: number): Record<string, unknown>[] {
    const MERCANCIA_TABLA = data['mercanciaTabla'] as Array<{ [key: string]: unknown }> | undefined;
    if (!Array.isArray(MERCANCIA_TABLA)) {
      return [];
    }

    return MERCANCIA_TABLA.map(item => ({
      "idMercancia": "1",
      "idClasificacionProducto": "325",
      "nombreClasificacionProducto": "Fab. sustancias químicas básicas",
      "ideSubClasificacionProducto": "32541",
      "nombreSubClasificacionProducto": "Fab. productos farmacéuticos",
      "descDenominacionEspecifica": "Medicamentos para uso humano",
      "descDenominacionDistintiva": "Paracetamol Tabletas 500mg",
      "descripcionMercancia": "Acetaminophen",
      "formaFarmaceuticaDescripcionOtros": "Tableta",
      "estadoFisicoDescripcionOtros": item['estadoFisico'] as string || "",
      "fraccionArancelaria": {
        "clave": item['fraccionArancelaria'] as string || "",
        "descripcion": "Los demás medicamentos constituidos por productos mezclados"
      },
      "unidadMedidaComercial": {
        "descripcion": item['umc'] as string || ""
      },
      "cantidadUMCConComas": item['cantidadUmc'] as string || "",
      "unidadMedidaTarifa": {
        "descripcion": item['unidadMedidaTarifa'] as string || ""
      },
      "cantidadUMTConComas": item['cantidadUmt'] as string || "",
      "presentacion": "Frasco x 100 tabletas",
      "registroSanitarioConComas": item['numeroRegistroSanitario'] as string || "",
      "nombreCortoPaisOrigen": data['paisOrigenId'] || [],
      "nombreCortoPaisProcedencia": data['paisProcedenciaId'] || [],
      "paisesFormulaProducto": data['paisElaboraId'] || [],
      "paisesFabricaIngredienteActivo": data['paisIngredienteActivoId'] || [],
      "tipoProductoDescripcionOtros": "Analgésico",
      "nombreCortoUsoEspecifico": discriminatorValue === 260502 ? ['98', '1'] : item['usoEspecifico'] as string,
      "fechaCaducidadStr": "31/12/2026"
    }));
  }

  /**
   * Construye el objeto que representa los datos del representante legal de la solicitud,
   * incluyendo su RFC, nombre completo y campos auxiliares.
   *
   * @param data - Objeto fuente que contiene las claves necesarias para identificar al representante legal.
   *               Se esperan las propiedades `rfc`, `nombre`, `apellidoPaterno` y `apellidoMaterno`.
   *
   * @returns Un objeto `Record<string, unknown>` con la estructura del representante legal,
   *          listo para integrarse en el payload de la solicitud.
   */
  static buildRepresentanteLegal(data: Record<string, unknown>): Record<string, unknown> {
    return {
      "rfc": data['rfc'] || '',
      "resultadoIDC": "",
      "nombre": data['nombre'] || '',
      "apellidoPaterno": data['apellidoPaterno'] || '',
      "apellidoMaterno": data['apellidoMaterno'] || ''
    };
  }

  /**
 * Construye un arreglo de objetos que representan a terceros involucrados en la solicitud,
 * como proveedores, fabricantes o formuladores, a partir de los datos tabulares proporcionados.
 *
 * @param data - Arreglo de objetos que contienen la propiedad `tbodyData`, la cual debe ser
 *               un arreglo con los datos de cada tercero. Cada posición del arreglo representa
 *               un campo específico como denominación, RFC, CURP, teléfono, correo, domicilio, etc.
 *
 * @returns Un arreglo de objetos `Record<string, unknown>` que representan a cada tercero con
 *          su información estructurada, listo para integrarse en el payload de la solicitud.
 *          Si no se encuentran datos válidos, se retorna un arreglo vacío.
 */
  static buildTercerosTablaDatos(data: Array<{ tbodyData?: Array<unknown> }>, pais: Catalogo): Record<string, unknown>[] {
    return data
      .filter(row => Array.isArray(row.tbodyData))
      .map(row => {
        const ITEM = row.tbodyData as Array<unknown>;

        return {
          idPersonaSolicitud: "",
          ideTipoTercero: "TIPERS.FAB",
          personaMoral: "1",
          booleanExtranjero: "0",
          booleanFisicaNoContribuyente: "0",
          denominacion: ITEM[0],
          razonSocial: ITEM[0],
          rfc: ITEM[1],
          curp: ITEM[2],
          nombre: ITEM[0],
          apellidoPaterno: "",
          apellidoMaterno: "",
          telefono: ITEM[3],
          correoElectronico: ITEM[4] || "",
          actividadProductiva: "MANUFACTURA",
          actividadProductivaDesc: "Fabricación de productos farmacéuticos",
          descripcionGiro: "Laboratorio farmacéutico",
          numeroRegistro: "REG-001-2024",
          domicilio: {
            calle: ITEM[5],
            numeroExterior: ITEM[6],
            numeroInterior: ITEM[7],
            pais: { clave: "", nombre: ITEM[8] || "" },
            colonia: { clave: "", nombre: ITEM[9] || "" },
            delegacionMunicipio: { clave: "", nombre: ITEM[10] || "" },
            localidad: { clave: "", nombre: ITEM[11] || "" },
            entidadFederativa: { clave: "", nombre: ITEM[12] || "" },
            informacionExtra: ITEM[13],
            codigoPostal: ITEM[14],
            descripcionColonia: "Industrial Norte"
          },
          idSolicitud: "12345"
        }
      });
  }

  /**
 * Construye el objeto que representa los datos del pago de derechos asociado a la solicitud,
 * incluyendo claves de referencia, información bancaria y monto pagado.
 *
 * @param data - Objeto fuente que contiene las claves necesarias para identificar el pago.
 *               Se esperan propiedades como `claveDeReferencia`, `cadenaDependencia`, `banco`,
 *               `llaveDePago`, `fechaPago` e `importePago`.
 *
 * @returns Un objeto `Record<string, unknown>` con la estructura del pago de derechos,
 *          listo para integrarse en el payload de la solicitud.
 */
  static buildPagoDerechos(data: Record<string, unknown>): Record<string, unknown> {
    return {
      "claveDeReferencia": data['claveDeReferencia'] || "",
      "cadenaPagoDependencia": data['cadenaDependencia'] || "",
      "banco": {
        "clave": data['banco'],
        "descripcion": ""
      },
      "llaveDePago": data['llaveDePago'] || "",
      "fecPago": data['fechaPago'] || "",
      "impPago": data['importePago'] || ""
    }
  }

  /**
   * Realiza una solicitud HTTP POST para obtener información del representante legal
   * basado en el cuerpo proporcionado y el identificador del procedimiento.
   */
  getRepresentanteLegala(body: Record<string, unknown>, idProcedimiento: string): Observable<JSONResponse> {
    return this._http.post<JSONResponse>(RFC_BUSCAR_REPRESENTANTE_LEGAL(idProcedimiento), body).pipe(
      map((response) => response)
    );
  }

  /**
   * Realiza una solicitud HTTP GET para obtener la descripción de una fracción arancelaria
   * basada en la clave y el identificador del tipo de trámite.
   */
  getFraccionDescripcion(clave: string, idTipoTramite: string): Observable<JSONResponse> {
    return this._http.get<JSONResponse>(FRACCION_DESCRIPCION(clave, idTipoTramite)).pipe(
      map((response) => response)
    );
  }

  /**
   * Realiza una solicitud HTTP GET para obtener la unidad de medida
   * basada en la clave de fracción y el identificador del tipo de trámite.
   */
  getUnidad(cveFraccion: string, idTipoTramite: string): Observable<JSONResponse> {
    return this._http.get<JSONResponse>(UNIDAD_MEDIDA(cveFraccion, idTipoTramite)).pipe(
      map((response) => response)
    );
  }

  /**
   * Envía los datos proporcionados mediante una solicitud HTTP POST a la ruta especificada.
   * @param payload - Objeto que contiene los datos a enviar en el cuerpo de la solicitud.
   * @param idTipoTramite - Identificador del tipo de trámite para construir la URL de la solicitud.
   * @returns Observable con la respuesta de la solicitud POST.
   */
  guardarDatosPost(payload: Record<string, unknown>, idTipoTramite: string): Observable<JSONResponse> {
    return this._http.post<JSONResponse>(GUARDAR_SOLICITUD(idTipoTramite), payload).pipe(
      map((response) => response)
    );
  }

  /**
   * Realiza una solicitud HTTP POST para obtener información de CURP
   * basada en el valor de CURP y el identificador del procedimiento.
   */
  getCURP(curpValor: string, idProcedimiento: string): Observable<JSONResponse> {
    return this._http.post<JSONResponse>(OBTENER_CURP(idProcedimiento, curpValor), {}).pipe(
      map((response) => response)
    );
  }

  /**
   * Realiza una solicitud HTTP GET para obtener los datos de la solicitud
   * basada en el idSolicitud y el idProcedimiento.
   */
  getMostrarDatos(idSolicitud: string, idProcedimiento: string): Observable<JSONResponse> {
    return this._http.get<JSONResponse>(MOSTRAR(idProcedimiento, idSolicitud)).pipe(
      map((response) => response)
    );
  }

  /**
   * Construye y asigna los datos obtenidos a las respectivas tiendas (stores)
   * para la funcionalidad de "mostrar" en el trámite.
   * @param data - Objeto que contiene los datos obtenidos de la solicitud.
   */
  public buildMostrarMaping(data: Record<string, unknown>): void {
    const DATOS_DE_LA_SOLICITUD = {
      solicitude: data['solicitud'],
      establecimiento: data['establecimiento'],
      datosSCIAN: data['datosSCIAN'],
      mercancias: data['mercancias'],
      representanteLegal: data['representanteLegal']
    };

    const TERCEROS = {
      Proveedor: data['gridTerceros_TIPERS_PVD'],
      Formulador: data['gridTerceros_TIPERS_FAC'],
      Fabricante: data['gridTerceros_TIPERS_FAB']
    };

    const PAGO_DE_DERECHOS: any = data['pagoDeDerechos'];

    this.setDatosDeLaSolicitud(DATOS_DE_LA_SOLICITUD);
    this.setTercerosTabDatos(TERCEROS);
    this.setPagoDeDerechos(PAGO_DE_DERECHOS);
  }

  /**
   * Asigna los datos de la solicitud a la tienda correspondiente.
   * @param data - Objeto que contiene los datos de la solicitud.
   */
  public setDatosDeLaSolicitud(data: Record<string, unknown>): void {
    const SOLICITUDE = data['solicitude'] as any;
    const ESTABLECIMIENTO = data['establecimiento'] as any;
    const SCIAN = data['datosSCIAN'] as any;
    const DATOS_SCIAN_ARRAY = SCIAN?.map((item: any) => ({
      clave_Scian: item?.cveScian ?? '',
      descripcion_Scian: item?.descripcion ?? ''
    })) ?? [];
    if (esValidObject(ESTABLECIMIENTO)) {
      this.datosDeLaStore.setRfcDel(ESTABLECIMIENTO.rfcResponsableSanitario || '');
      this.datosDeLaStore.setDenominacion(ESTABLECIMIENTO.razonSocial || '');
      this.datosDeLaStore.setCorreo(ESTABLECIMIENTO.correoElectronico || '');
      this.datosDeLaStore.setDenominacionRazonSocial(ESTABLECIMIENTO.razonSocial || '');
      this.datosDeLaStore.setCorreoElectronico(ESTABLECIMIENTO.correoElectronico || '');
      this.setDenominacionRazonSocial = ESTABLECIMIENTO.razonSocial || '';
      this.setRfcDel = ESTABLECIMIENTO.rfcResponsableSanitario || '';
      this.setCorreoElectronico = ESTABLECIMIENTO.correoElectronico || '';
      if (ESTABLECIMIENTO.domicilio) {
        this.datosDeLaStore.setCodigoPostal(ESTABLECIMIENTO.domicilio.codigoPostal || '');
        this.datosDeLaStore.setEstado(ESTABLECIMIENTO.domicilio.entidadFederativa?.clave || '');
        this.datosDeLaStore.setMuncipio(ESTABLECIMIENTO.domicilio.descripcionMunicipio || '');
        this.datosDeLaStore.setLocalidad(ESTABLECIMIENTO.domicilio.informacionExtra || '');
        this.datosDeLaStore.setColonia(ESTABLECIMIENTO.domicilio.descripcionColonia || '');
        this.datosDeLaStore.setCalle(ESTABLECIMIENTO.domicilio.calle || '');
        this.datosDeLaStore.setLada(ESTABLECIMIENTO.domicilio.lada || '');
        this.datosDeLaStore.setTelefono(ESTABLECIMIENTO.domicilio.telefono || '');
      }
       // Filter audonaCatalogoList for unique clave values present in ESTABLECIMIENTO.aduanas and return their descriptions
       if(this.audonaCatalogoList?.length>0){
       const aduanaClaves = Array.isArray(ESTABLECIMIENTO?.aduanas) ? ESTABLECIMIENTO?.aduanas : [];
       const uniqueClaves = [...new Set(aduanaClaves)];
       const matchingDescriptions = this.audonaCatalogoList?.filter((item: any) => uniqueClaves?.includes(item?.clave))?.map((item: any) => item?.descripcion);
      this.datosDeLaStore.setPaisDeOriginDatos(matchingDescriptions || [])
      this.datosDeLaStore.setAduanasEntradas(matchingDescriptions || []);
       }
      this.datosDeLaStore.setCumplimiento(SOLICITUDE['informacionConfidencial'] ? "Si" : "No"); 
      this.datosDeLaStore.setAvisoCheckbox(SOLICITUDE['declaracionesSeleccionadas']);
      this.datosDeLaStore.setMensaje(SOLICITUDE['informacionConfidencial']);

    }

    if (esValidArray(SCIAN)) {
      this.datosDeLaStore.setNicoTabla(DATOS_SCIAN_ARRAY || []);
    }

    if (esValidArray(data['mercancias'])) {
      this.datosDeLaStore.setMercanciasTabla(this.mapMercanciasArray(data['mercancias'] as any));
    }

    const REPRESENTANTE_LEGAL = data['representanteLegal'] as any;
    if (esValidObject(REPRESENTANTE_LEGAL)) {
      this.datosDeLaStore.setRfc(REPRESENTANTE_LEGAL.rfc || '');
      this.datosDeLaStore.setNombre(REPRESENTANTE_LEGAL.nombre || '');
      this.datosDeLaStore.setApellidoPaterno(REPRESENTANTE_LEGAL.apellidoPaterno || '');
      this.datosDeLaStore.setApellidoMaterno(REPRESENTANTE_LEGAL.apellidoMaterno || '');
    }
  }


  /**
   * Asigna los datos de terceros (proveedor, formulador, fabricante) a la tienda correspondiente.
   * @param data - Objeto que contiene los datos de terceros.
   */
  public setTercerosTabDatos(data: Record<string, unknown>): void {
    const TERCEROS = {
      Proveedor: data['Proveedor'],
      Formulador: data['Formulador'],
      Fabricante: data['Fabricante']
    };
    this.tercerosFabricanteStore.setFabricante(this.mapFabricanteFilas(TERCEROS.Fabricante as any));
    this.tercerosFabricanteStore.setFormulador(this.mapFabricanteFilas(TERCEROS.Formulador as any));
    this.tercerosFabricanteStore.setProveedor(this.mapFabricanteFilas(TERCEROS.Proveedor as any));
  }
  /**
   * Transforma un arreglo de objetos de terceros en un formato adecuado para mostrar en una tabla.
   * Cada objeto del arreglo de entrada se mapea a un objeto con la propiedad 'tbodyData',
   * que contiene los datos relevantes del tercero, usando '---' como valor por defecto si falta algún dato.
   * @param gridTerceros - Arreglo de objetos que representan a los terceros (fabricantes, formuladores o proveedores).
   * @returns Un nuevo arreglo de objetos, cada uno con la propiedad 'tbodyData' lista para ser usada en la tabla.
   */
  private mapFabricanteFilas(gridTerceros: any[]): any[] {
    if (!Array.isArray(gridTerceros)) return [];
    return gridTerceros.map((baseDATOS: any) => ({
      tbodyData: [
        baseDATOS.denominacion ? baseDATOS.razonSocial : baseDATOS.nombre,
        baseDATOS.rfc ?? '---',
        baseDATOS.curp ?? '---',
        baseDATOS.telefono ?? '---',
        baseDATOS.correoElectronico ?? '---',
        baseDATOS.domicilio?.calle ?? '---',
        baseDATOS.domicilio?.numeroExterior ?? '---',
        baseDATOS.domicilio?.numeroInterior ?? '---',
        baseDATOS.domicilio?.pais?.clave ?? '---',
        baseDATOS.domicilio?.colonia?.clave ?? '---',
        baseDATOS.domicilio?.delegacionMunicipio?.clave ?? '---',
        baseDATOS.domicilio?.localidad?.clave ?? '---',
        baseDATOS.domicilio?.entidadFederativa?.clave ?? '---',
        baseDATOS.domicilio?.informacionExtra ?? '---',
        baseDATOS.domicilio?.codigoPostal ?? '---',
      ],
    }));
  }

  /**
 * Transforma un arreglo de objetos de terceros en un formato adecuado para mostrar en una tabla.
 *
 * Cada objeto del arreglo de entrada se mapea a un objeto con la propiedad 'tbodyData',
 * que contiene los datos relevantes del tercero, usando '---' como valor por defecto si falta algún dato.
 *
 * @param gridTerceros - Arreglo de objetos que representan a los terceros (fabricantes, formuladores o proveedores).
 * @returns Un nuevo arreglo de objetos, cada uno con la propiedad 'tbodyData' lista para ser usada en la tabla.
 */

    /**
     * Mapea el arreglo de mercancías a la estructura requerida para la tabla.
     * @param mercancias - Arreglo de mercancías de entrada
     * @returns Arreglo mapeado para la tabla de mercancías
     */
    private mapMercanciasArray(mercancias: any[]): any[] {
      return (mercancias || []).map((item: any) => {
        let descripcionesOrigen ;
        let descripcionesProcedencia;
        if(this.paisesCatalogoList?.length>0){
         descripcionesOrigen = this.paisesCatalogoList?.filter((pais: any) => Array.isArray(item?.nombreCortoPaisOrigen) && item.nombreCortoPaisOrigen.includes(pais?.clave))?.map((pais: any) => pais?.descripcion);

         descripcionesProcedencia = this.paisesCatalogoList?.filter((pais: any) => Array.isArray(item?.nombreCortoPaisProcedencia) && item.nombreCortoPaisProcedencia.includes(pais?.clave))?.map((pais: any) => pais?.descripcion);
        }

      return {
        cantidadUMC: item?.cantidadUMCConComas,
        cantidadUMT: item?.cantidadUMTConComas,
        clasificacionToxicologica: "5",
        clasificacionToxicologicaClave: "35",
        descripcionFraccion: "",
        estadoFisico: "",
        estadoFisicoClave: "",
        estadoFisicoOtro: "",
        fraccionArancelaria: item?.fraccionArancelaria?.clave,
        nombreCientifico: "Nombre químico o científico UNC",
        nombreComercial: "Nombre comercial UNC",
        nombreComun: "Nombre común UNC",
        numeroCas: "",
        numeroRegistro: item?.registroSanitarioConComas,
        numeroRegistroSanitario: item?.registroSanitarioConComas,
        objetoImportacion: "Otro",
        objetoImportacionClave: "OBIM.OTR",
        objetoImportacionOtro: null,
        paisDeOriginDatosObj: [],
        paisDeProcedenciaDatos: [
          "ARUBA (TERRITORIO HOLANDES DE ULTRAMAR)",
          "AUSTRALIA (COMUNIDAD DE)",
          "AUSTRIA (REPUBLICA DE)"
        ],
        paisDeProcedenciaDatosObj: [{}, {}, {}],
        paisElaboracion: [
          "ALEMANIA (REPUBLICA FEDERAL DE)",
          "ANDORRA (PRINCIPADO DE)",
          "ANGOLA (REPUBLICA DE)",
          "ANGUILA"
        ],
        paisElaboracionProducto: [
          "ALEMANIA (REPUBLICA FEDERAL DE)",
          "ANDORRA (PRINCIPADO DE)",
          "ANGOLA (REPUBLICA DE)",
          "ANGUILA"
        ],
        paisFabrica: [
          "ANTILLAS NEERLANDESAS (TERRITORIO HOLANDES DE ULTRAMAR)",
          "ARABIA SAUDITA (REINO DE)",
          "ARGELIA (REPUBLICA DEMOCRATICA Y POPULAR DE)",
          "ARGENTINA (REPUBLICA)"
        ],
        paisOrigen: [
          "ANTILLAS NEERLANDESAS (TERRITORIO HOLANDES DE ULTRAMAR)",
          "ARABIA SAUDITA (REINO DE)",
          "ARGELIA (REPUBLICA DEMOCRATICA Y POPULAR DE)"
        ],
        paisProcedenciaUltimoPuerto: descripcionesProcedencia,
        paisProduccionIngredienteActivo: [
          "ANTILLAS NEERLANDESAS (TERRITORIO HOLANDES DE ULTRAMAR)",
          "ARABIA SAUDITA (REINO DE)",
          "ARGELIA (REPUBLICA DEMOCRATICA Y POPULAR DE)",
          "ARGENTINA (REPUBLICA)"
        ],
        paisProveedor: descripcionesOrigen,
        porcentajeConcentracion: "Porcentaje de concentración",
        umc: item?.unidadMedidaComercial?.descripcion,
        umcClave: "105",
        unidadMedidaTarifa: "",
        usoEspecifico: item?.nombreCortoUsoEspecifico,
        cantidadUmt: item?.cantidadUMTConComas,
        cantidadUmcts: "",
        cantidadUmc: item?.cantidadUMCConComas
      };
    });
  }
  /**
   * Asigna los datos de pago de derechos a la tienda correspondiente.
   * @param data - Objeto que contiene los datos de pago de derechos.
   */
  public setPagoDeDerechos(data: Record<string, unknown>): void {
    const PAGO_DE_DERECHOS = data as any;
    this.pagoBancoStore.setClaveDeReferencia(PAGO_DE_DERECHOS.claveDeReferencia as string || '');
    this.pagoBancoStore.setCadenaDependencia(PAGO_DE_DERECHOS.cadenaPagoDependencia as string || '');
    this.pagoBancoStore.setBanco(PAGO_DE_DERECHOS.banco.clave as any || null);
    this.pagoBancoStore.setllaveDePago(PAGO_DE_DERECHOS.llaveDePago as string || '');
    this.pagoBancoStore.setFechaPago(PAGO_DE_DERECHOS.fecPago as string || '');
    this.pagoBancoStore.setImportePago(PAGO_DE_DERECHOS.impPago as string || '');

  }
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}