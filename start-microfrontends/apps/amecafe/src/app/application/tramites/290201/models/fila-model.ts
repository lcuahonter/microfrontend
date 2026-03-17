/**
 * Interfaz que representa los datos de una fila en el trámite.
 */
export interface FilaData {
    id: number; // Identificador único de la fila.
    datosDelTramiteRealizar: {
        envasadoen: string; // Lugar donde se realizó el envasado.
        utilizoCafeComo: string; // Uso que se le dio al café.
        cantidadutilizada: string; // Cantidad de café utilizada.
        numerodepedimento: string; // Número de pedimento de importación/exportación.
        paisdeimportacion: string; // País de importación.
        fraccionarancelaria: string; // Fracción arancelaria correspondiente.
        cantidad: string; // Cantidad declarada.
        unidaddemedida: string; // Unidad de medida utilizada.
        precioapplicable: string; // Precio aplicable.
        dolar: string; // Valor en dólares.
        lote: string; // Número de lote.
        otrasmarcas: string; // Otras marcas relacionadas.
        elcafe: string; // Información adicional sobre el café.
        otrasCaracteristicas: string; // @description Otras características adicionales del domicilio, como referencias o detalles específicos.
        fechaexportacion: string; // Fecha de exportación.
        paisdetransbordo: string; // País de transbordo.
        mediodetransporte: string; // Medio de transporte utilizado.
        Identificadordel: string; // Identificador del trámite.
        observaciones: string; // Observaciones adicionales.
        formasdelcafe?:string
        tipos?:string
        calidad?:string
    };
}

/**
 * Interfaz que representa los datos adicionales de una fila en el trámite.
 */
export interface FilaData2 {
    id: number; // Identificador único de la fila.
    datosDelTramiteRealizar: {
        tipoPersona: string; // Tipo de persona (física o moral).
        denominacion: string; // Denominación o razón social.
        nombre: string; // Nombre de la persona.
        primerApellido: string; // Primer apellido (si aplica).
        segundoApellido: string; // Segundo apellido (si aplica).
        domicilio: string; // Dirección del domicilio.
        pais: string; // País de residencia.
        codigopostal: number; // Código postal.
        telefono: number; // Número de teléfono.
        correoelectronico: string; // Dirección de correo electrónico.
    };
      selected?: boolean; // Agregue esta propiedad a la selección de filas

}

export interface SolicitudResponse {
  codigo: string;
  mensaje: string;
  datos: {
    id_solicitud: number|string;
    formas_cafe: string;
    tipos_cafe: string;
    calidad_cafe: string;
    procesos_cafe: string;
    certificaciones_cafe: string | null;
    clave_aduana: string;
    pais_procedencia: string;
    entidades_solicitud: string;
    descripcion_generica1: string | null;
    lote: {
      id_mercancia: number;
      id_fraccion_gob: number;
      generica1: string;
      cantidad_presentacion: string;
      numero_oficio_caso_especial: string;
      condicion_almacenamiento_primario: string;
      cantidad_umc: string;
      unidad_medida_comercial: string;
      importe_total_componente: string;
      moneda: string;
      numero_lote: string;
      descripcion_mercancia: string;
      boolean_generico1: boolean;
      detalles_marca: string | null;
      descripcion_otras_especificaciones: string | null;
      fecha_salida: string; // DD-MM-YYYY
      condicion_almacenamiento_secundario: string;
      generica2: string;
      marcas_embarque: string;
      descripcion_tratamiento: string;
      aceptada: boolean;
    }[];
    terceros: null;
  };

  
}
/**
 * Interfaz genérica para estandarizar las respuestas del backend.
 *
 * @template T Tipo de dato que contiene la propiedad `datos`.
 * Por ejemplo: string, number, object, array, etc.
 */
export interface GuadarResponse<T = unknown> {
  codigo: string;
  mensaje: string;
  datos: T;
}

