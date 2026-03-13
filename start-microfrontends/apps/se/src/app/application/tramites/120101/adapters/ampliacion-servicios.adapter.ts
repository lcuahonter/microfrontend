import { DetalleInstrumentoCupoTPL, InstrumentoCupoTPL, InsumoTPL } from '../models/insumos.model';
import { Injectable } from '@angular/core';
import { SolicitudDeRegistroTpl120101State } from '../../../estados/tramites/tramite120101.store';





@Injectable({
  providedIn: 'root'
})
export class AmpliacionServiciosAdapter {


  /**
   * Convierte un objeto de datos en el formato requerido para el detalle de instrumento de cupo TPL.
   *
   * @param data - Objeto de entrada que contiene los datos a transformar.
   * @returns Un objeto con las propiedades mapeadas para el detalle de instrumento de cupo TPL.
   *
   * Propiedades del objeto retornado:
   * - idMecanismoAsignacion: Identificador del mecanismo de asignación (o null si no existe).
   * - cveOficialCupo: Clave oficial del cupo (cadena vacía por defecto).
   * - cveFraccionArancelaria: Clave de fracción arancelaria (cadena vacía si no existe).
   * - idCategoriaTextil: Identificador de la categoría textil (o null si no existe).
   * - idFraccionHtsUsa: Identificador de fracción HTS USA (null por defecto).
   * - cveUmOficialCupo: Clave de unidad oficial del cupo (cadena vacía si no existe).
   * - fechaFinVigenciaMecanismo: Fecha de fin de vigencia del mecanismo (cadena vacía si no existe).
   * - montoDisponible: Monto disponible (o null si no existe).
   * - cvePais: Clave del país de destino (cadena vacía si no existe).
   * - idAsignacion: Identificador de asignación (null por defecto).
   * - solicitarMercancia: Indica si se solicita mercancía (false por defecto).
   */
  convertTodetalleInstrumentoCupoTPL(data: Record<string, any>): DetalleInstrumentoCupoTPL {
    return {
      idMecanismo: data["idMecanismo"] ?? null,
      idCupo: data["idCupo"] ?? null,
      clavefraccionArancelaria: data["clavefraccionArancelaria"] ?? "",
      producto: data["productoDescripcion"] ?? "",
      tratadoAcuerdo: data["cveTratado"] ?? "",
      subproducto: data["subProductoClasificacion"] ?? "",
      descripcionMecanismoAsignacion: data["asignacionMecanismo"] ?? "",
      categoriaTextil: data["categoriaTextil"] ?? "",
      regimen: data["regimen"] ?? "",
      descripcionCategoriaTextil: data["categoriaTextilDescripcion"] ?? "",
      paisOrigenDestino: data["paisOrigenDestino"] ?? "",
      descripcionUnidadMedida: data["unidad"] ?? "",
      fechaInicioVigenciaMecanismo: data["fechaInicioVigencia"] ?? "",
      fechaFinVigenciaMecanismo: data["fechaFinVigencia"] ?? "",
      cveRegimen: data["cveRegimenClasificacion"] ?? "",
      factorConversion: data["conversionFactor"] ?? null,
      idCategoriaTextil: data["idCategoriaTextil"] ?? null,
      idRegimen: "REG.02" ?? null,
      cvePais: data["cvePaisDestino"] ?? "",
      montoDisponible: data["montoDisponible"] ?? null,
      descripcionCupo: data["descripcionCupo"] ?? "",
      numFolioAsignacionTpl: data["numFolioAsignacionTpl"] ?? null,
      idAsignacion: data["idAsignacion"] ?? null,
      solicitarMercancia: data["solicitarMercancia"] ?? false,
      cveUmOficialCupo: data["cveUmOficialCupo"] ?? "",
      descripcionFraccion: data["descripcionFraccion"] ?? "",
      idFraccionHtsUsa: data["idFraccionHtsUsa"] ?? null,
      codCategoriaTextil: data["codCategoriaTextil"] ?? "",
      cveOficialCupo: data["cveOficialCupo"] ?? ""
    };
  }

  /**
   * Mapea un arreglo de objetos `tablaInsumos` a una nueva lista de insumos con la estructura requerida por TPL.
   * 
   * @param tablaInsumos - Arreglo de insumos provenientes de la tabla, cada uno con propiedades como `FraccionArancelaria`, `PaisDeOrigen`, y `DescripcionDelInsumo`.
   * @returns Un arreglo de objetos insumo transformados, listos para ser utilizados en el proceso de ampliación de servicios.
   */
  mapTablaInsumosToListInsumosTPL(tablaInsumos: Record<string, unknown>[]): InsumoTPL[] {
    return tablaInsumos.map(item => ({
      nombre: String(item["DescripcionDelInsumo"] ?? ""),
      clave_fraccion_arancelaria: "84799018",
      pais_origen: {
        clave:  "MX"
      },
      base_insumo_empaque_pk: {
        id_solicitud: "",
        id_insumo: 100
      },
      id_regimen: "REG.01",
      id_fraccion_hts_usa: 1
    }));
  }

  /**
   * Mapea los datos de país de origen de diferentes etapas del proceso textil a un objeto estructurado.
   *
   * @param DATA - Objeto que contiene la información de los países en los que se realizaron distintas etapas del proceso (corte, ensamble, fibra, hilado, tejido, etc.).
   * @returns Un objeto con las propiedades correspondientes a cada etapa del proceso y su país de origen. Si algún dato no está presente, se asigna una cadena vacía.
   */
  mapPaisOrigenData(DATA: Record<string, unknown>): Record<string, unknown> {
    return {
        clasificacion_bien_final: "A",
        paisOrigenCorte: DATA["paisEnQueSeRealizoElCorte"],
        paisOrigenEnsamble: DATA["paisEnQueSeRealizoElEnsamble"],
        paisOrigenFibra: DATA["paisDeOrigenDeLaFibra"],
        paisOrigenHilado: DATA["paisEnQueSeRealizoElHilado"],
        paisOrigenHiladoTLCAN: "",
        paisOrigenTejido: DATA["paisEnQueSeRealizoElTejido"] || "",
        paisOrigenTejidoAForma: DATA["paisEnQueSeRealizoElTejidoAForma"] || "",
        paisOrigenTejidoTLCAN: DATA["paisEnQueSeRealizoElTejidoTLCAN"] || ""
    };
  }

  /**
   * Genera el payload para guardar el formulario de solicitud de registro TPL 120101.
   *
   * @param state - El estado actual de la solicitud de registro TPL 120101.
   * @returns Un objeto con la estructura requerida para el envío del formulario, incluyendo los datos de la solicitud,
   *          detalle del instrumento de cupo TPL, entidad federativa, lista de insumos TPL y procesos productivos.
   */
  toFormGuardarPayload(state: Record<string, unknown>): Record<string, unknown> {  
    const DATA = state as Record<string, unknown>;
    const MAPPEDDETALLEINSTRUMENTOCUPOTPL = (DATA['cuerpoTabla'] as Record<string, unknown>[]).map((item) => this.convertTodetalleInstrumentoCupoTPL(item));
    const LISTINSUMOSTPL = this.mapTablaInsumosToListInsumosTPL(DATA['tablaInsumos'] as Record<string, unknown>[] || []);
    const PROCESOSPRODUCTIVOS = this.mapPaisOrigenData(DATA);
    const PAYLOAD = {
      "cve_regimen": "REG.02",
      "cve_clasificacion_regimen": "01",
      "solicitante": {
        "rfc": "AAL0409235E6",
        "nombre": "Juan Pérez",
        "es_persona_moral": true,
        "certificado_serial_number": "SN123456789",
        "rol_capturista": "PersonaMoral",
        "domicilio": {
          "pais": "México",
          "codigo_postal": "06700",
          "estado": "Ciudad de México",
          "municipio_alcaldia": "Cuauhtémoc",
          "localidad": "Centro",
          "colonia": "Roma Norte",
          "calle": "Av. Insurgentes Sur",
          "numero_exterior": "123",
          "numero_interior": "Piso 5, Oficina A",
          "lada": "55",
          "telefono": "1234567890",
          "entidad_federativa": {
            "cveEntidad": "BCS",
            "nombre": "Ciudad de México",
            "codEntidadIdc": "CDMX",
            "cvePais": "MEX",
            "fechaCaptura": "2025-06-09",
            "fechaInicioVigencia": "2025-06-01",
            "fechaFinVigencia": "2025-12-31",
            "activo": true,
            "pais": "México",
            "claveEnIDC": "CDMX09"
          }
        }
      },
      "detalle_instrumento_cupo_tpl":{...MAPPEDDETALLEINSTRUMENTOCUPOTPL[0]},
      "unidad_administrativa_representacion_federal": {
        "clave":DATA['representacionFederal'] || "1016"
      },
      "denominacion_exposicion": "Expo Example",
      "entidad_federativa": {
        "clave": DATA['estado'] || ""
      },
      "insumos": [
        ...LISTINSUMOSTPL
      ],
      "solicitud": {...PROCESOSPRODUCTIVOS}
    }

    return PAYLOAD;

  }


  /**
   * Mapea los datos de entrada a un objeto con las propiedades requeridas para el trámite de ampliación de servicios.
   *
   * @param data - Objeto de entrada que contiene la información a transformar.
   * @returns Un objeto con las siguientes propiedades:
   * - idTratadoAcuerdo: Identificador del tratado o acuerdo (string).
   * - claveRegimen: Clave del régimen de clasificación (string).
   * - clavePais: Clave del país (string).
   * - cveFraccion: Clave de la fracción arancelaria (string).
   * - descripcionFraccion: Descripción de la fracción (string).
   * - idFraccionHtsUsa: Identificador de la fracción HTS USA (string).
   */
  mappedBuscarPayloadDatos(data: any): InstrumentoCupoTPL {

    return {
      idTratadoAcuerdo: data.tratado ?? "",
      claveRegimen: data.clasificacion ?? "",
      clavePais: data.pais ?? "",
      cveFraccion: data.fraccionArancelaria ?? "",
      descripcionFraccion: data.fraccion ?? "",
      idFraccionHtsUsa: data.idFraccionHtsUsa ?? ""
    };


  }

  /**
   * Mapea una lista de objetos de entrada a una nueva estructura de objetos con propiedades específicas.
   *
   * @param items - Arreglo de objetos de entrada que contienen los datos a transformar.
   * @returns Un nuevo arreglo de objetos, cada uno con las propiedades mapeadas según la estructura requerida para la tabla de datos.
   */
  mapBuscarTablaDatosList(items: any[]): any[] {
    return items.map(item => ({
      idMecanismo: item["idMecanismo"],
      id: item["idCupo"],
      cveTratado: item["tratadoAcuerdo"],
      cveRegimenClasificacion: item["cveRegimen"],
      cvePaisDestino: item["cvePais"],
      fraccionArancelaria: item["clavefraccionArancelaria"],
      categoriaTextilDescripcion: item["descripcionCategoriaTextil"],
      productoDescripcion: item["producto"],
      subProductoClasificacion: item["subproducto"],
      fechaInicioVigencia: item["fechaInicioVigenciaMecanismo"],
      fechaFinVigencia: item["fechaFinVigenciaMecanismo"],
      montoDisponible: item["montoDisponible"],
      categoriaTextil: item["codCategoriaTextil"],
      asignacionMecanismo: item["descripcionMecanismoAsignacion"],
      unidad: item["descripcionUnidadMedida"],
      conversionFactor: item["factorConversion"],
      clavefraccionArancelaria: item["clavefraccionArancelaria"],
      codCategoriaTextil: item["codCategoriaTextil"],
      cveOficialCupo: item["cveOficialCupo"],
      cveUmOficialCupo: item["cveUmOficialCupo"],
      descripcionCupo: item["descripcionCupo"],
      descripcionFraccion: item["descripcionFraccion"],
      idAsignacion: item["idAsignacion"],
      idCategoriaTextil: item["idCategoriaTextil"],
      idFraccionHtsUsa: item["idFraccionHtsUsa"],
      idRegimen: item["idRegimen"],
      numFolioAsignacionTpl: item["numFolioAsignacionTpl"],
      paisOrigenDestino: item["paisOrigenDestino"],
      regimen: item["regimen"],
      solicitarMercancia: item["solicitarMercancia"]
    }));
  }


  /**
   * Mapea los datos administrativos recibidos a un nuevo objeto con las propiedades requeridas.
   *
   * @param data - Objeto de entrada que contiene la información administrativa.
   * @returns Un objeto con las propiedades `estado` y `representacionFederal`, extraídas y transformadas desde el objeto de entrada.
   */
  private mapAdminData(data: Record<string, unknown>): Record<string, unknown> {
  return {
    estado: (data['entidad_federativa'] as { clave?: string } | undefined)?.clave ?? "",
    representacionFederal:
      (data['unidad_administrativa_representacion_federal'] as { clave?: string } | undefined)?.clave ?? ""
  };
}

/**
 * Transforma un objeto de payload en una estructura interna utilizada por la aplicación.
 * 
 * Este método toma el payload recibido, extrae y mapea diferentes secciones de datos
 * (cabecera, cuerpo de tabla, datos administrativos, insumos y solicitud) utilizando
 * métodos auxiliares, y finalmente agrega el identificador de la solicitud.
 * 
 * @param payload - Objeto recibido que contiene los datos a transformar.
 * @returns Un nuevo objeto con la estructura interna requerida por la aplicación.
 */
reverseMapFromPayload(payload: Record<string, unknown>): Record<string, unknown> {
  const DATOS = payload as Record<string, unknown>;

  return {
    ...this.mapHeader(DATOS),
    ...this.mapCuerpoTabla(DATOS),
    ...this.mapAdminData(DATOS),
    ...this.mapInsumoData(DATOS),
    ...this.mapSolicitudData(DATOS),
    idSolicitud: this.getIdSolicitud(DATOS)
  };
}

/**
 * Mapea los datos de entrada para construir el encabezado requerido por el sistema.
 *
 * @param data - Objeto de entrada que contiene la información necesaria para el mapeo.
 * @returns Un objeto con las propiedades: tratado, clasificacion, pais, fraccionArancelaria e idMecanismo.
 *
 * - `tratado`: Código fijo "116".
 * - `clasificacion`: Código de clasificación del régimen, por defecto "01" si no está presente.
 * - `pais`: Código del país extraído de `detalle_instrumento_cupo_tpl`, vacío si no existe.
 * - `fraccionArancelaria`: Clave de fracción arancelaria, vacío si no existe.
 * - `idMecanismo`: Identificador del mecanismo, nulo si no existe.
 */
private mapHeader(data: any): any {
  const detalle = data.detalle_instrumento_cupo_tpl ?? {};
  return {
    tratado: "116",
    clasificacion: data.cve_clasificacion_regimen ?? "01",
    pais: detalle.cvePais ?? "",
    fraccionArancelaria: detalle.clavefraccionArancelaria ?? "",
    idMecanismo: detalle.idMecanismo ?? null
  };
}

/**
 * Mapea los datos recibidos en el formato esperado para la tabla de cuerpo.
 *
 * @param data - Objeto de entrada que contiene la información del instrumento de cupo.
 * @returns Un objeto con la propiedad `cuerpoTabla`, que es un arreglo de objetos con los campos mapeados y valores por defecto en caso de ausencia.
 *
 * @remarks
 * Este método extrae y transforma los datos de `detalle_instrumento_cupo_tpl` del objeto de entrada,
 * asignando valores predeterminados cuando los datos no están presentes.
 * Utiliza el método auxiliar `getProductoDescripcion` para obtener la descripción del producto.
 */
private mapCuerpoTabla(data: any): any {
  const detalle = data.detalle_instrumento_cupo_tpl ?? {};

  return {
    cuerpoTabla: [
      {
        idMecanismo: detalle.idMecanismo ?? null,
        id: detalle.idCupo ?? null,
        cveTratado: "Tratado entre México, Estados Unidos y Canadá",
        cveRegimenClasificacion: detalle.idRegimen ?? null,
        cvePaisDestino: detalle.cvePais ?? "",
        fraccionArancelaria: detalle.clavefraccionArancelaria ?? "",
        categoriaTextilDescripcion: detalle.descripcionCategoriaTextil ?? "",
        productoDescripcion: this.getProductoDescripcion(detalle),
        subProductoClasificacion: detalle.subproducto || "Sin subproducto",
        fechaInicioVigencia: detalle.fechaInicioVigenciaMecanismo ?? "",
        fechaFinVigencia: detalle.fechaFinVigenciaMecanismo ?? "",
        montoDisponible: detalle.montoDisponible ?? 0,
        categoriaTextil: detalle.categoriaTextil ?? "",
        asignacionMecanismo: null,
        unidad: null,
        conversionFactor: detalle.factorConversion ?? 0,
        clavefraccionArancelaria: detalle.clavefraccionArancelaria ?? "",
        codCategoriaTextil: detalle.categoriaTextil ?? "",
        cveOficialCupo: detalle.cveOficialCupo ?? null,
        cveUmOficialCupo: detalle.cveUmOficialCupo ?? null,
        descripcionCupo: detalle.descripcionCupo ?? null,
        descripcionFraccion: "Other (666)",
        idAsignacion: detalle.idAsignacion ?? 0,
        idCategoriaTextil: detalle.idCategoriaTextil ?? null,
        idFraccionHtsUsa: detalle.idFraccionHtsUsa ?? null,
        idRegimen: null,
        numFolioAsignacionTpl: detalle.numFolioAsignacionTpl ?? 0,
        paisOrigenDestino: detalle.paisOrigenDestino ?? "",
        regimen: detalle.regimen ?? "",
        solicitarMercancia: null
      }
    ]
  };
}

/**
 * Obtiene la descripción del producto a partir del detalle proporcionado.
 * Si el campo `producto` existe en el objeto `detalle`, elimina la subcadena "TPL 3-CAN " de su valor.
 * Si no existe, retorna una cadena vacía.
 *
 * @param detalle - Objeto que contiene la información del producto.
 * @returns La descripción del producto sin la subcadena "TPL 3-CAN ", o una cadena vacía si no existe el producto.
 */
private getProductoDescripcion(detalle: Record<string, unknown>): string {
  return detalle["producto"]
    ? (detalle["producto"] as string).replace("TPL 3-CAN ", "")
    : "";
}

/**
 * Mapea los datos de insumos recibidos y retorna un objeto con las propiedades necesarias
 * para el procesamiento de ampliación de servicios.
 *
 * @param data - Objeto de entrada que contiene la información de insumos.
 * @returns Un objeto con las propiedades:
 *   - descripcionBienFinal: Nombre del insumo o cadena vacía si no existe.
 *   - descripcionInsumo: Nombre del insumo o cadena vacía si no existe.
 *   - fraccion: Clave de fracción arancelaria del insumo o cadena vacía si no existe.
 *   - descfraccion: Valor fijo "undefined".
 *   - Pais: Clave del país de origen del insumo o cadena vacía si no existe.
 *   - tablaInsumos: Resultado del mapeo de la tabla de insumos.
 */
private mapInsumoData(data: Record<string, unknown>): Record<string, unknown> {
  const INSUMOARRAY = Array.isArray(data['insumos']) ? data['insumos'] : [];
  const INSUMO = INSUMOARRAY[0] ?? {};

  return {
    descripcionBienFinal: INSUMO.nombre ?? "",
    descripcionInsumo: INSUMO.nombre ?? "",
    fraccion: INSUMO.clave_fraccion_arancelaria ?? "",
    descfraccion: "undefined",
    Pais: INSUMO.pais_origen?.clave ?? "",
    tablaInsumos: this.mapTablaInsumos(INSUMOARRAY)
  };
}


/**
 * Mapea un arreglo de insumos a un nuevo formato de objetos con las propiedades:
 * DescripcionDelInsumo, FraccionArancelaria y PaisDeOrigen.
 *
 * @param insumos - Arreglo de objetos insumo a transformar.
 * @returns Un nuevo arreglo de objetos con las propiedades mapeadas.
 */
private mapTablaInsumos(insumos: Record<string, unknown>[]): Record<string, unknown>[] {
  return insumos.map(i => ({
    DescripcionDelInsumo: i["nombre"] ?? "",
    FraccionArancelaria: i["clave_fraccion_arancelaria"] ?? "",
    PaisDeOrigen: (i["pais_origen"] as { clave?: string })?.clave ?? ""
  }));
}


/**
 * Mapea los datos de una solicitud a un nuevo objeto con los campos requeridos para el proceso de ampliación de servicios.
 *
 * @param data - Objeto que contiene la información de la solicitud, incluyendo los países de origen de corte, ensamble, fibra, hilado y tejido.
 * @returns Un objeto con los campos mapeados correspondientes a los países involucrados en cada etapa del proceso textil.
 */
private mapSolicitudData(data: Record<string, unknown>): Record<string, unknown> {
  const SOLICITUDE = data["solicitud"] as Record<string, unknown> ?? {};

  return {
    paisEnQueSeRealizoElCorte: SOLICITUDE["paisOrigenCorte"] ?? "",
    paisEnQueSeRealizoElEnsamble: SOLICITUDE["paisOrigenEnsamble"] ?? "",
    paisDeOrigenDeLaFibra: SOLICITUDE["paisOrigenFibra"] ?? "",
    paisEnQueSeRealizoElHilado: SOLICITUDE["paisOrigenHilado"] ?? "",
    paisEnQueSeRealizoElTejido: SOLICITUDE["paisOrigenTejido"] ?? "",
    paisEnQueSeRealizoElTejidoAForma: SOLICITUDE["paisOrigenTejidoAForma"] ?? "",
    paisEnQueSeRealizoElTejidoTLCAN: SOLICITUDE["paisOrigenTejidoTLCAN"] ?? ""
  };
}


/**
 * Obtiene el identificador de la solicitud desde el objeto de datos proporcionado.
 *
 * @param data - Objeto que contiene la información de la solicitud.
 * @returns El identificador de la solicitud (`id_solicitud`) si existe, de lo contrario retorna `null`.
 */
private getIdSolicitud(data: Record<string, unknown>): number | null {
  const ID = (data["solicitud"] as Record<string, unknown>)?.["id_solicitud"];
  return typeof ID === "number" ? ID : null;
}

}