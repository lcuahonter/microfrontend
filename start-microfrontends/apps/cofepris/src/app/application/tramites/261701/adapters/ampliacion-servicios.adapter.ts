
import { CancelacionPeticion261701State } from '../estados/store/tramite261701.store';
import { Injectable } from '@angular/core';


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
  toFormGuardarPayload(state: CancelacionPeticion261701State): Record<string, unknown> {
    const DATA = state as Record<string, unknown>;
    const PAYLOAD = {
    "idSolicitud": state.idSolicitud ?? 0,
    "solicitante": {
        "rfc": "AAL0409235E6",
        "nombre": "ACEROS ALVARADO S.A. DE C.V.",
        "actividadEconomica": "Fabricación de productos de hierro y acero",
        "correoElectronico": "contacto@acerosalvarado.com",
        "rol_capturista":"PersonaMoral",
        "domicilio": {
            "pais": "México",
            "codigoPostal": "06700",
            "estado": "Ciudad de México",
            "municipioAlcaldia": "Cuauhtémoc",
            "localidad": "Centro",
            "colonia": "Roma Norte",
            "calle": "Av. Insurgentes Sur",
            "numeroExterior": "123",
            "numeroInterior": "Piso 5, Oficina A",
            "lada": "",
            "telefono": "123456"
        }
    },
    "solicitud": {
        "discriminatorValue": 261701,
        "declaracionesSeleccionadas": DATA["manifiestos"],
        "descripcion": DATA["motivoCancelacion"] || "",
        "numeroFolioTramiteOriginal": "0402600900520254001000004"
    },
    "representanteLegal": {
        "rfc":  DATA["rfc"] || "",
        "resultadoIDC": true,
        "nombre": DATA["nombre"] || "",
        "apellidoPaterno": DATA["apellidoPaterno"] || "",
        "apellidoMaterno": DATA["apellidoMaterno"] || ""
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
    motivoCancelacion: SOLICITUDE['descripcion'] as string || "",
    nombre: REPRESENTANTE_LEGAL['nombre'] as string || "",
    rfc: REPRESENTANTE_LEGAL['rfc'] as string || "",
    manifiestos: SOLICITUDE['declaracionesSeleccionadas'] as boolean,
  };
}

}