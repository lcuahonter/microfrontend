import { Catalogo, JSONResponse } from '@libs/shared/data-access-user/src';
import { FRACCION_DESCRIPCION, GUARDAR_SOLICITUD, OBTENER_CURP, RFC_BUSCAR_REPRESENTANTE_LEGAL, UNIDAD_MEDIDA } from '../../servers/api-route';
import { Observable, combineLatest, map } from 'rxjs';
import { AvisocalidadQuery } from '../../estados/queries/aviso-calidad.query';
import { DatosDomicilioLegalQuery } from '../../estados/queries/datos-domicilio-legal.query';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TercerosFabricanteQuery } from '../../estados/queries/terceros-fabricante.query';
import { TramitePagoBancoQuery } from '../../estados/queries/pago-banco.query';

/**
 * @description
 * Servicio compartido registrado en el inyector raíz de Angular.
 * Proporciona una instancia única (singleton) accesible en toda la aplicación.
 * Ideal para lógica reutilizable, gestión de estado o comunicación entre componentes.
 */

@Injectable({
  providedIn: 'root'
})

export class Shared2606Service {

  /**
 * @description
 * Constructor del servicio `Shared2606Service`.
 * Se ejecuta al momento de crear la instancia del servicio.
 * Ideal para inicializar propiedades, configurar dependencias o preparar el estado interno.
 */
  constructor(
    private datosDomicilioLegalQuery: DatosDomicilioLegalQuery,
    private tercerosFabricanteQuery: TercerosFabricanteQuery,
    private solicitudPagoBancoQuery: TramitePagoBancoQuery,
    private avisocalidadQuery: AvisocalidadQuery,
    private _http: HttpClient
  ) {
    // Initialization logic
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
        Shared2606Service.mergeStates(
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
    const ESTABLECIMIENTO = Shared2606Service.buildEstablecimiento(data);
    const DATOS_SCIAN = Shared2606Service.buildDatosScian(data);
    const MERCANCIAS = Shared2606Service.buildMercancias(data);
    const REPRESENTANTE_LEGAL = Shared2606Service.buildRepresentanteLegal(data);
    const PROVEEDOR_TABLA = Shared2606Service.buildTercerosTablaDatos(data['Proveedor'] as Array<{ tbodyData?: Array<unknown> }>, data['proveedorPais'] as Catalogo);
    const FORMULADOR_TABLA = Shared2606Service.buildTercerosTablaDatos(data['Formulador'] as Array<{ tbodyData?: Array<unknown> }>, data['formuladorPais'] as Catalogo);
    const FABRICANTE_TABLA = Shared2606Service.buildTercerosTablaDatos(data['Fabricante'] as Array<{ tbodyData?: Array<unknown> }>, data['fabricantePais'] as Catalogo);
    const PAGO_DERECHOS = Shared2606Service.buildPagoDerechos(data);

    return {
      solicitante: {
        rfc: "AAL0409235E6",
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
          "calle":  data['calle'] || "",
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
  static buildDatosScian(data: Record<string, unknown>): {cveScian: string, descripcion: string, selected: boolean}[] {
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
  static buildMercancias(data: Record<string, unknown>): Record<string, unknown>[] {
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
      "nombreCortoUsoEspecifico": item['usoEspecifico'] as string || "",
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
            pais: { clave: ITEM[8], nombre: pais?.descripcion || "" },
            colonia: { clave: ITEM[9], nombre: "" },
            delegacionMunicipio: { clave: ITEM[10], nombre: "" },
            localidad: { clave: ITEM[11], nombre: "" },
            entidadFederativa: { clave: ITEM[12], nombre: "" },
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
    return this._http.post<JSONResponse>(OBTENER_CURP(idProcedimiento,curpValor),{}).pipe(
      map((response) => response)
    );
  }
}
