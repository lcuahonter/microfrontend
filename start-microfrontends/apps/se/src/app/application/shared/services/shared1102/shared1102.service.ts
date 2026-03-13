import { Injectable } from '@angular/core';
import { reverseMap } from '@libs/shared/data-access-user/src';

/**
 * Servicio compartido para funcionalidades relacionadas con el trámite 1102.
 *
 * Este servicio se proporciona a nivel raíz, lo que significa que estará disponible
 * en toda la aplicación sin necesidad de declararlo en módulos específicos.
 */
@Injectable({
  providedIn: 'root'
})

export class Shared1102Service {

  /**
   * Identificador del procedimiento actual.
   *
   * Esta propiedad almacena el ID del trámite o procedimiento que se está gestionando
   * y se utiliza para determinar rutas y lógica específica en el servicio.
   */
  public idProcedimiento: number = 0;

  /**
   * Reinicia el identificador del procedimiento, estableciéndolo en 0.
   *
   * Este método se utiliza para limpiar o restablecer el estado del trámite actual.
   */
  resetProcedimiento(): void {
    this.idProcedimiento = 0;
  }

  /**
   * Asigna un nuevo identificador al procedimiento actual.
   *
   * @param id El nuevo ID del trámite o procedimiento a gestionar.
   */
  setProcedimiento(id: number): void {
    this.idProcedimiento = id;
  }

  /**
   * Mapea los datos de entrada a un estado estructurado para el trámite 1102.
   * Llama a funciones auxiliares para transformar cada sección de los datos.
   *
   * @param data Objeto con los datos originales.
   * @returns Objeto estructurado con el estado completo del trámite.
   */
  mapToState(data: Record<string, unknown>): Record<string, unknown> {
    return {
      formCertificado: this.mapFormCertificado(data),
      grupoDeTransporte: this.mapGrupoDeTransporte(data),
      grupoReceptor: this.mapGrupoReceptor(data),
      grupoRepresentativo: this.mapGrupoRepresentativo(data),
      grupoDeDirecciones: this.mapGrupoDeDirecciones(data),
      formDatosCertificado: this.mapFormDatosCertificado(data),
      mercanciaTabla: this.mapMercanciaTabla(data),
      formHistorico: this.mapFormHistorico(data),
      agregarProductoresExportador: this.mapAgregarProductoresExportador(data),
      productoresExportador: this.mapProductoresExportador(data),
      mercanciaProductores: this.mapMercanciaProductores(data)
    }
  }

  /**
   * Mapea y transforma los datos del certificado a un objeto estructurado.
   * @param data Datos originales.
   * @returns Objeto con los campos del formulario de certificado.
   */
  mapFormCertificado(data: Record<string, unknown>): Record<string, unknown> {
    const CERTIFICADO_MAP = {
      type: "object" as const,
      path: "certificado",
      items: {
        entidadFederativa: "tratado_acuerdo",
        tercerOperador: "realizo_tercer_operador.tercer_operador",
        bloque: "pais_bloque",
        nombreComercialForm: "nombre_comercial",
        registroProductoForm: "registro_producto",
        fraccionArancelariaForm: "fraccion_arancelaria",
        fechaInicioInput: "fecha_inicio",
        fechaFinalInput: "fecha_fin",
        si: "realizo_tercer_operador.tercer_operador",
        nombres: "realizo_tercer_operador.nombre",
        primerApellido: "realizo_tercer_operador.primer_apellido",
        segundoApellido: "realizo_tercer_operador.segundo_apellido",
        numeroDeRegistroFiscal: "realizo_tercer_operador.numero_registro_fiscal",
        razonSocial: "realizo_tercer_operador.razon_social",
        pais: "domicilio_tercer_operador.pais",
        ciudad: "domicilio_tercer_operador.ciudad",
        calle: "domicilio_tercer_operador.calle",
        numeroLetra: "domicilio_tercer_operador.numero_letra",
        telefono: "domicilio_tercer_operador.telefono",
        correo: "domicilio_tercer_operador.correo_electronico"
      }
    };
    const RESULT = reverseMap(CERTIFICADO_MAP, data);
    return Array.isArray(RESULT) ? (RESULT[0] ?? {}) : RESULT;
  }

  /**
   * Mapea los datos relacionados con el grupo de transporte.
   * @param data Datos originales.
   * @returns Objeto con los campos del grupo de transporte.
   */
  mapGrupoDeTransporte(data: Record<string, unknown>): Record<string, unknown> {
    const TRANSPORTE_MAP = {
      type: "object" as const,
      path: "solicitud.certificadoOrigen",
      items: {
        puertoEmbarque: "puertoEmbarque",
        puertoDesembarque: "puertoDesembarque",
        puertoTransito: "puertoTransito",
        nombreEmbarcacion: "nombreEmbarcacion",
        numeroVuelo: "numeroVuelo"
      }
    };
    const RESULT = reverseMap(TRANSPORTE_MAP, data);
    return Array.isArray(RESULT) ? (RESULT[0] ?? {}) : RESULT;
  }

  /**
   * Mapea los datos del receptor (destinatario) a un objeto estructurado.
   * @param data Datos originales.
   * @returns Objeto con los campos del grupo receptor.
   */
  mapGrupoReceptor(data: Record<string, unknown>): Record<string, unknown> {
    const RECEPTOR_MAP = {
      type: "object" as const,
      path: "destinatario",
      items: {
        nombre: "nombre",
        nombres: "nombre",
        apellidoPrimer: "primer_apellido",
        apellidoSegundo: "segundo_apellido",
        numeroFiscal: "numero_registro_fiscal",
        razonSocial: "razon_social",
        primerApellido: "primer_apellido",
        segundoApellido: "segundo_apellido",
        numeroDeRegistroFiscal: "numero_registro_fiscal"
      }
    };
    const RESULT = reverseMap(RECEPTOR_MAP, data);
    return Array.isArray(RESULT) ? (RESULT[0] ?? {}) : RESULT;
  }

  /**
   * Mapea los datos del representante legal a un objeto estructurado.
   * @param data Datos originales.
   * @returns Objeto con los campos del grupo representativo.
   */
  mapGrupoRepresentativo(data: Record<string, unknown>): Record<string, unknown> {
    const REPRESENTANTE_MAP = {
      type: "object" as const,
      path: "destinatario.generalesRepresentanteLegal",
      items: {
        lugar: "lugarRegistro",
        nombreExportador: "nombre",
        empresa: "razonSocial",
        cargo: "puesto",
        telefono: "telefono",
        lada: "lada",
        fax: "fax",
        correoElectronico: "correoElectronico"
      }
    };
    const RESULT = reverseMap(REPRESENTANTE_MAP, data);
    return Array.isArray(RESULT) ? (RESULT[0] ?? {}) : RESULT;
  }

  /**
   * Mapea los datos de domicilio del destinatario a un objeto estructurado.
   * @param data Datos originales.
   * @returns Objeto con los campos del grupo de direcciones.
   */
  mapGrupoDeDirecciones(data: Record<string, unknown>): Record<string, unknown> {
    const DOMICILIO_MAP = {
      type: "object" as const,
      path: "destinatario.domicilio",
      items: {
        ciudad: "ciudad_poblacion_estado_provincia",
        calle: "calle",
        numeroLetra: "numero_letra",
        telefono: "telefono",
        correoElectronico: "correo_electronico",
        fax: "fax",
        lada: "lada"
      }
    };
    const RESULT = reverseMap(DOMICILIO_MAP, data);
    return Array.isArray(RESULT) ? (RESULT[0] ?? {}) : RESULT;
  }

  /**
   * Mapea los datos adicionales del certificado a un objeto estructurado.
   * @param data Datos originales.
   * @returns Objeto con los campos adicionales del certificado.
   */
  mapFormDatosCertificado(data: Record<string, unknown>): Record<string, unknown> {
    const DATOS_CERTIFICADO_MAP = {
      type: "object" as const,
      path: "datos_del_certificado",
      items: {
        observacionesDates: "observaciones",
        idiomaDates: "idioma",
        EntidadFederativaDates: "representacion_federal.entidad_federativa",
        representacionFederalDates: "representacion_federal.representacion_federal",
      }
    };
    const RESULT = reverseMap(DATOS_CERTIFICADO_MAP, data);
    return Array.isArray(RESULT) ? (RESULT[0] ?? {}) : RESULT;
  }

  /**
   * Mapea la lista de mercancías seleccionadas a un arreglo de objetos estructurados.
   * @param data Datos originales.
   * @returns Arreglo de objetos con los datos de cada mercancía.
   */
  mapMercanciaTabla(data: Record<string, unknown>): Array<Record<string, unknown>> {
    const MERCANCIA_MAP = {
      type: "array" as const,
      path: "certificado.mercancias_seleccionadas",
      items: {
        fraccionArancelaria: "fraccion_arancelaria",
        cantidad: "cantidad",
        unidadMedidaMasaBruta: "unidad_medida",
        valorMercancia: "valor_mercancia",
        tipoFactura: "tipo_factura",
        numeroFactura: "num_factura",
        complementoDescripcion: "complemento_descripcion",
        fechaFinalInput: "fecha_factura",
        nombreTecnico: "nombre_tecnico",
        nombreComercial: "nombre_comercial"
      }
    }
    const RESULT = reverseMap(MERCANCIA_MAP, data);
    return Array.isArray(RESULT) ? RESULT : [];
  }

  /**
   * Mapea los datos históricos del formulario a un objeto estructurado.
   * @param data Datos originales.
   * @returns Objeto con los campos históricos del formulario.
   */
  mapFormHistorico(data: Record<string, unknown>): Record<string, unknown> {
    const HISTORICO_MAP = {
      type: "object" as const,
      path: this.idProcedimiento === 110214 ? "solicitud" : "historico",
      items: {
        datosConfidencialesProductor: "datosConfidencialesProductor",
        productorMismoExportador: "productorMismoExportador"
      }
    }
    const RESULT = reverseMap(HISTORICO_MAP, data);
    return Array.isArray(RESULT) ? (RESULT[0] ?? {}) : RESULT;
  }

  /**
   * Mapea la lista de productores por exportador a un arreglo de objetos estructurados.
   * @param data Datos originales.
   * @returns Arreglo de objetos con los datos de cada productor por exportador.
   */
  mapAgregarProductoresExportador(data: Record<string, unknown>): Array<Record<string, unknown>> {
    const AGREGAR_PRODUCTOR_MAP = {
      type: "array" as const,
      path: this.idProcedimiento === 110214 ? "solicitud.ProductoresPorExportadorSeleccionados" : "historico.ProductoresPorExportadorSeleccionados",
      items: {
        nombreProductor: "nombreCompleto",
        numeroRegistroFiscal: "rfc",
        direccion: "direccionCompleta",
        correoElectronico: "correoElectronico",
        telefono: "telefono",
        fax: "fax"
      }
    }
    const RESULT = reverseMap(AGREGAR_PRODUCTOR_MAP, data);
    return Array.isArray(RESULT) ? RESULT : [];
  }

  /**
   * Mapea la lista de productores por exportador seleccionados a un arreglo de objetos estructurados.
   * @param data Datos originales.
   * @returns Arreglo de objetos con los datos de cada productor seleccionado.
   */
  mapProductoresExportador(data: Record<string, unknown>): Array<Record<string, unknown>> {
    const PRODUCTORES_SELECCIONADAS_MAP = {
      type: "array" as const,
      path: this.idProcedimiento === 110214 ? "solicitud.productoresPorExportador" : "historico.productoresPorExportador",
      items: {
        nombreProductor: "nombreCompleto",
        numeroRegistroFiscal: "rfc",
        direccion: "direccionCompleta",
        correoElectronico: "correoElectronico",
        telefono: "telefono",
        fax: "fax"
      }
    }
    const RESULT = reverseMap(PRODUCTORES_SELECCIONADAS_MAP, data);
    return Array.isArray(RESULT) ? RESULT : [];
  }

  /**
   * Mapea la lista de mercancías por productor a un arreglo de objetos estructurados.
   * @param data Datos originales.
   * @returns Arreglo de objetos con los datos de cada mercancía por productor.
   */
  mapMercanciaProductores(data: Record<string, unknown>): Array<Record<string, unknown>> {
    const MERCANCIA_PRODUCTORES_MAP = {
      type: "array" as const,
      path: "solicitud.mercanciasProductor",
      items: {
        fraccionArancelaria: "fraccionArancelaria",
        cantidad: "cantidadComercial",
        unidadMedida: "descUnidadMedidaComercial",
        valorMercancia: "valorTransaccional",
        fetchFactura: "descFactura",
        fechaFactura: "fechaFactura",
        numeroFactura: "numeroFactura",
        complementoDescripcion: "complementoDescripcion",
        rfcProductor1: "rfcProductor"
      }
    }
    const RESULT = reverseMap(MERCANCIA_PRODUCTORES_MAP, data);
    return Array.isArray(RESULT) ? RESULT : [];
  }

}
