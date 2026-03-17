
import { Injectable } from '@angular/core';
import { RetirosCofepris261702State } from '../../../estados/tramites/tramite261702.store';


@Injectable({
  providedIn: 'root'
})
export class AmpliacionServiciosAdapter {


  /**
   * Genera el payload para guardar el formulario de solicitud de registro TPL 120101.
   *
   * @param state - El estado actual de la solicitud de registro TPL 120101.
   * @returns Un objeto con la estructura requerida para el envío del formulario, incluyendo los datos de la solicitud,
   *          detalle del instrumento de cupo TPL, entidad federativa, lista de insumos TPL y procesos productivos.
   */
  toFormGuardarPayload(state: RetirosCofepris261702State): Record<string, unknown> {
    const DATA = state as Record<string, unknown>;
    const PAYLOAD = {
  "idSolicitud": state.idSolicitud ?? 0,
  "solicitante": {
    "rfc": "AAL0409235E6",
    "nombre": "JUAN PEREZ",
    "razonSocial": "EMPRESA DEMO SA DE CV",
    "curp": "PEPJ800101HDFRRN01",
    "telefono": "5551234567",
    "correoElectronico": "juan.perez@demo.com",
    "rol_capturista":"PersonaMoral",
    "domicilio": {
      "calle": "AV. PRINCIPAL",
      "numeroExterior": "100",
      "numeroInterior": "A",
      "codigoPostal": "01234",
      "colonia": "CENTRO",
      "delegacionMunicipio": "BENITO JUAREZ",
      "localidad": "CDMX",
      "entidadFederativa": "CIUDAD DE MEXICO",
      "pais": "MEXICO"
    }
  },
  "solicitud": {
    "folioTramite": "FT-2025-001",
    "tipoSolicitud": "Corrección Interna",
    "descripcion": DATA["motivoDesistimiento"] || "",
    "representanteLegal": {
         "rfc":  DATA["rfc"] || "",
        "resultadoIDC": true,
        "nombre": DATA["nombre"] || "",
        "apellidoPaterno": DATA["apellidoPaterno"] || "",
        "apellidoMaterno": DATA["apellidoMaterno"] || ""
    }
  }
}

    return PAYLOAD;

  }


  /**
   * Transforma un objeto de payload recibido en un nuevo objeto con la estructura requerida
   * para el formulario de ampliación de servicios. Extrae y mapea los datos relevantes del
   * representante legal y la solicitud, asignando valores predeterminados en caso de ausencia.
   *
   * @param payload - Objeto con los datos originales, que incluye información de la solicitud y del representante legal.
   * @returns Un nuevo objeto con los campos mapeados: apellidoMaterno, apellidoPaterno, manifiestos, motivoCancelacion, nombre y rfc.
   */
  reverseMapFromPayload(payload: Record<string, unknown>): Record<string, unknown> {
  const DATOS = payload as Record<string, unknown>;
  const SOLICITUDE = DATOS['solicitud'] as Record<string, unknown>;
  const REPRESENTANTE_LEGAL = DATOS['representanteLegal'] as Record<string, unknown>;
  return {
    idSolicitud: DATOS['idSolicitud'] as number || 0,
    apellidoMaterno: REPRESENTANTE_LEGAL['apellidoPaterno'] as string || "",
    apellidoPaterno: REPRESENTANTE_LEGAL['apellidoPaterno'] as string || "",
    manifiestos: false,
    motivoCancelacion: SOLICITUDE['descripcion'] as string || "",
    nombre: REPRESENTANTE_LEGAL['nombre'] as string || "",
    rfc: REPRESENTANTE_LEGAL['rfc'] as string || "",
  };
}

}