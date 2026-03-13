import { CatalogoResponse } from '@libs/shared/data-access-user/src';
import { Injectable } from '@angular/core';
import { Solicitud120702State } from '../estados/tramite120702.store';

@Injectable({
  providedIn: 'root'
})
export class AmpliacionServiciosAdapter {


  /**
   * Genera el payload para guardar el formulario de ampliación de servicios.
   */
  toFormGuardarPayload(datos: Record<string, unknown>): Record<string, unknown> {
       const EXTRA_DATOS =datos['extraDatos'] as Record<string, unknown> || {};
    const PAYLOAD = {
      "solicitante": {
        "rfc": "AAL0409235E6",
        "nombre": "ACEROS ALVARADO S.A. DE C.V.",
        "actividad_economica": "Fabricación de productos de hierro y acero",
        "correo_electronico": "contacto@acerosalvarado.com",
        "razonSocial": "INTEGRADORA",
        "domicilio": {
          "pais": "México",
          "codigoPostal": "03100",
          "estado": "26",
          "delegacionMunicipio": "Benito Juárez",
          "localidad": "REGION ARROYO SECO",
          "colonia": "Del Valle",
          "calle": "Av. Insurgentes Sur",
          "numeroExterior": "1234",
          "numeroInterior": "A",
          "lada": "1234",
          "telefono": "12345678"
        }
      },
      "asignacion": {
        "añoAutorizacion": datos["anoDelOficio"],
        "montoDisponible": "100",
        "idAsignacion": EXTRA_DATOS['idAsignacion'] || 0,
        fechaInicioVigencia: datos['fechaInicioCupo'],
        fechaFinVigencia: datos['fechaFinCupo'],
        fundamentos: datos['fundamento'],
        regimen: datos['regimenAduanero'],
        unidadMedidaComercializacion: datos['unidadMedida'],
        descClasificacionProducto: datos['descripcionProducto'],
        montoTotal: datos['totalAExpedir'],
        saldoDisponible: datos['montoDisponible'],
        montoAsignado: datos['montoAsignado'],
        "mecanismoAsignacion": {
          fechaInicioVigencia: datos['fechaInicioVigencia'],
          fechaFinVigencia: datos['fechaFinVigencia'],
          requiereImportador: datos['requiereImportador'],
          requiereProductor: datos['requiereProductor'],
          fraccionesPorExpedir: datos['fraccionesPorExpedir'],
          "cupo": {
            idCupo: EXTRA_DATOS['idCupo'] || 0,
            producto: {
              "descripcion": datos['descripcionProducto']
            },
            clasificacionSubProducto: datos['clasificacionSubProducto'],
            unidadMedidaOficialCupo: datos['unidadMedida'],
            fechaFinCupo: datos['fechaFinCupo'],
            fechaInicioCupo: datos['fechaInicioCupo'],
            mecanismoAsignacion: datos['mecanismoAsignacion'],
            paises: datos['paises'],
            fundamento: datos['fundamento'],
            fraccionesArancelarias: datos['fraccionesArancelarias'],
            tratadoAcuerdo: {
              "clave": ""
            }
          },
          "idMecanismoAsignacion": EXTRA_DATOS['idMecanismoAsignacion'] || 0,
          "solicitarMercancia": ""
        },
        "expediciones": [
          {
            "cantidad": 50
          },
          {
            "cantidad": 50
          }
        ]
      },
      "numFolioAsignacionAux": "",
      "unidadAdministrativaRepresentacionFederal": {
        "entidadFederativa": {
          "nombre": "",
          "clave": ""
        },
        "nombre": "",
        "clave": ""
      },
      "importador": {
        "nombre": "abc",
        "domicilio": {
          "informacionExtra": ""
        },
        "idPersonaSolicitud": "",
        "idSolicitud": ""
      },
      "productorCupos": {
        "nombre": "",
        "domicilio": {
          "informacionExtra": ""
        },
        "idPersonaSolicitud": "",
        "idSolicitud": ""
      }
    }
    return PAYLOAD;
  }

  /**
   * Obtiene y transforma los datos recibidos en un objeto de tipo `Solicitud120702State`.
   *
   * @param datos - Objeto con la información de entrada, donde se espera que contenga la propiedad 'asignacion' y otros campos auxiliares.
   * @returns Un objeto `Solicitud120702State` con los datos mapeados y valores por defecto en caso de ausencia.
   */
  obtenerMostrarDatos(datos: Record<string, unknown>): Solicitud120702State {
    const ASSIGN = datos['asignacion'] as Record<string, unknown>;
    const MECANISMO_ASIGNACION = ASSIGN['mecanismoAsignacion'] as Record<string, unknown>;
    const CUPO = MECANISMO_ASIGNACION['cupo'] as Record<string, unknown>;
    const DATOS: Solicitud120702State = {
      estado: ASSIGN['estado'] as string || 'N/A',
      anoDelOficio: ASSIGN['anoDelOficio'] as CatalogoResponse || [],
      representacionFederal: ASSIGN['repFedMecanismosAsignacion'] as string || 'N/A',

      numFolioAsignacion: datos['numFolioAsignacionAux'] as string || 'N/A',
      fechaInicioCupo: ASSIGN['fechaInicioVigencia'] as string || 'N/A',
      fechaFinCupo: ASSIGN['fechaFinVigencia'] as string || 'N/A',
      fundamento: CUPO['fundamentos'] as string || 'N/A',
      montoAsignado: ASSIGN['montoAsignado'] as number || 0,
      montoExpedido: ASSIGN['montoExpedido'] as number || 0,
      montoADisponible: ASSIGN['montoDisponible'] as number || 0,
      datosNumeroOficio: ASSIGN['numeroOficio'] as number || 0,
      numeroOficio: ASSIGN['añoAutorizacion'] as number || 0,
      montoAExpedir: ASSIGN['montoAdjudicado'] as number || 0,
      montoDisponible: 0,
      totalAExpedir: 0,
      continuarTriggered: false,
      fechaInicioVigencia: '',
      fechaFinVigencia: ''
    };

    return DATOS;
  }


}
