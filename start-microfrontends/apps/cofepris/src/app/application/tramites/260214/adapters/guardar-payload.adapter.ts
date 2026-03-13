/**
 * @fileoverview
 * Este archivo contiene el servicio adaptador para convertir entre el estado de Akita y los formatos de payload de API
 * para el trámite de ampliación de servicios 80205.
 */

import { DatoSCIAN, PagoDeDerechos, PagoDerechosPatchData, PatchDatoScian } from '../mostra-api/mostra';
import { Destinatario, Fabricante, Facturador, PagoDerechosFormState, Proveedor } from '../../../shared/models/terceros-relacionados.model';
import { DatosSolicitudFormState, TablaMercanciasDatos } from '../../../shared/models/datos-solicitud.model';
import { Injectable } from '@angular/core';
import { Tramite260214State } from '../estados/tramite260214Store.store';


@Injectable({
  providedIn: 'root'
})
export class GuardarAdapter_260214 {
  /**
   * Convierte del estado de Akita al formato de payload de API usando las mismas claves
   * @param state El estado actual de Akita
   * @returns Payload formateado para la API
   */
  static toFormPayload(state: Tramite260214State): unknown {
    return {
      "solicitante": {
        "rfc": "AAL0409235E6",
        "nombre": "María Fernanda Torres",
        "actividadEconomica": "Comercio al por mayor de productos farmacéuticos",
        "correoElectronico": "mfernanda.torres@example.com",
        "rol_capturista":"personaMoral",
        "domicilio": {
            "pais": "México",
            "codigoPostal": "03100",
            "estado": "Ciudad de México",
            "municipioAlcaldia": "Benito Juárez",
            "localidad": "Narvarte",
            "colonia": "Colonia Narvarte Poniente",
            "calle": "Av. Universidad 300",
            "numeroExterior": "300",
            "numeroInterior": "12",
            "lada": "55",
            "telefono": "5556789012"
        },
      },
      "solicitud": {
        discriminatorValue: 260214,
        declaracionesSeleccionadas: state.datosSolicitudFormState.manifesto,
        regimen: state.datosSolicitudFormState.regimen,
        informacionConfidencial: state.datosSolicitudFormState.publico === 'si',
        idSolicitud: state.idSolicitud || 0
      },
      "establecimiento": {
          "rfcResponsableSanitario": state.datosSolicitudFormState.rfcSanitario,
          "razonSocial": state.datosSolicitudFormState.denominacionRazon,
          "correoElectronico": state.datosSolicitudFormState.correoElectronico,
          "domicilio": {
              "codigoPostal": state.datosSolicitudFormState.codigoPostal,
              "entidadFederativa": {
                  "clave": "09"
              },
              "descripcionMunicipio": state.datosSolicitudFormState.municipioAlcaldia,
              "informacionExtra": state.datosSolicitudFormState.localidad,
              "descripcionColonia": state.datosSolicitudFormState.colonia,
              "calle": state.datosSolicitudFormState.calle,
              "lada": state.datosSolicitudFormState.lada,
              "telefono": state.datosSolicitudFormState.telefono
          },
          "original": "",
          "avisoFuncionamiento": state.datosSolicitudFormState.aviso,
          "numeroLicencia": state.datosSolicitudFormState.licenciaSanitaria,
          "aduanas": state.datosSolicitudFormState.adunasDeEntradas
      },
     "datosSCIAN": (state.scianConfigDatos ?? []).map(d => ({
        cveScian: d.clave,
        descripcion: d.descripcion,
        selected: true
      })),
      "mercancias": (state.tablaMercanciasConfigDatos ?? []).map((mercancia) => {
        return {
              "idMercancia": "1",
              "idClasificacionProducto": null,
              "nombreClasificacionProducto": mercancia.clasificacionProducto,
              "ideSubClasificacionProducto": null,
              "nombreSubClasificacionProducto": mercancia.especificarClasificacionProducto,
              "descDenominacionEspecifica": mercancia.denominacionEspecificaProducto,
              "descDenominacionDistintiva": mercancia.denominacionDistintiva,
              "descripcionMercancia": "",
              "formaFarmaceuticaDescripcionOtros": mercancia.formaFarmaceutica,
              "estadoFisicoDescripcionOtros": mercancia.estadoFisico,
              "fraccionArancelaria": {
                  "clave": mercancia.fraccionArancelaria,
                  "descripcion": ""
              },
              "unidadMedidaComercial": {
                  "descripcion": mercancia.unidadMedidaComercializacion
              },
              "cantidadUMCConComas": mercancia.cantidadUmtValor,
              "unidadMedidaTarifa": {
                  "descripcion": mercancia.cantidadUMT
              },
              "cantidadUMTConComas": mercancia.cantidadUmtValor,
              "presentacion": mercancia.presentacion,
              "registroSanitarioConComas": mercancia.numeroRegistroSanitario,
              "nombreCortoPaisOrigen": mercancia.paisOrigenDatosClave,
              "nombreCortoPaisProcedencia": mercancia.paisProcedenciaDatosClave,
              "tipoProductoDescripcionOtros": mercancia.tipoProducto,
              "nombreCortoUsoEspecifico": mercancia.usoEspecificoDatosClave,
              "fechaCaducidadStr": mercancia.fechaCaducidad
          }
      }),
      "representanteLegal": {
          "rfc": state.datosSolicitudFormState.representanteRfc,
          "resultadoIDC": "",
          "nombre": state.datosSolicitudFormState.representanteNombre,
          "apellidoPaterno": state.datosSolicitudFormState.apellidoPaterno,
          "apellidoMaterno": state.datosSolicitudFormState.apellidoMaterno
      },
      "gridTerceros_TIPERS_FAB": state.fabricanteTablaDatos.map((fabricante) => {
        return {
              "idPersonaSolicitud": "",
              "ideTipoTercero": "",
              "personaMoral": fabricante.tipoPersona === "Moral" ? "1" : "0",
              "booleanExtranjero": fabricante.nacionalidad === 'Extranjero' ? "1" : "0",
              "booleanFisicaNoContribuyente": "0",
              "denominacion": fabricante.razonSocial,
              "razonSocial": fabricante.razonSocial,
              "rfc": fabricante.rfc,
              "curp": fabricante.curp,
              "nombre": fabricante.nombres,
              "apellidoPaterno": fabricante.primerApellido,
              "apellidoMaterno": fabricante.segundoApellido,
              "telefono": fabricante.telefono,
              "correoElectronico": fabricante.correoElectronico,
              "actividadProductiva": "",
              "actividadProductivaDesc": "",
              "descripcionGiro": "",
              "numeroRegistro": "",
              "domicilio": {
                  "calle": fabricante.calle,
                  "numeroExterior": fabricante.numeroExterior,
                  "numeroInterior": fabricante.numeroInterior,
                  "pais": {
                      "clave": "MEX",
                      "nombre": fabricante.pais
                  },
                  "colonia": {
                      "clave": "001",
                      "nombre": fabricante.colonia
                  },
                  "delegacionMunicipio": {
                      "clave": "015",
                      "nombre": fabricante.municipioAlcaldia
                  },
                  "localidad": {
                      "clave": "001",
                      "nombre": fabricante.localidad
                  },
                  "entidadFederativa": {
                      "clave": "09",
                      "nombre": fabricante.entidadFederativa
                  },
                  "informacionExtra": "",
                  "codigoPostal": fabricante.codigoPostal,
                  "descripcionColonia": fabricante.colonia
              },
              "idSolicitud": "0"
          }
      }),
      "gridTerceros_TIPERS_DES": state.destinatarioFinalTablaDatos.map((destinatario) => {
        return {
            "idPersonaSolicitud": "",
            "ideTipoTercero": "TIPERS.FAB",
            "personaMoral": destinatario.tipoPersona === "Moral" ? "1" : "0",
            "booleanExtranjero": "",
            "booleanFisicaNoContribuyente": "0",
            "denominacion": "LABORATORIOS PISA S.A. DE C.V.",
            "razonSocial": destinatario.razonSocial,
            "rfc": destinatario.rfc,
            "curp": destinatario.curp,
            "nombre": destinatario.nombres,
            "apellidoPaterno": destinatario.primerApellido,
            "apellidoMaterno": destinatario.segundoApellido,
            "telefono": destinatario.telefono,
            "correoElectronico": destinatario.correoElectronico,
            "actividadProductiva": "",
            "actividadProductivaDesc": "",
            "descripcionGiro": "",
            "numeroRegistro": "",
            "domicilio": {
                "calle": destinatario.calle,
                "numeroExterior": destinatario.numeroExterior,
                "numeroInterior": destinatario.numeroInterior,
                "pais": {
                    "clave": "",
                    "nombre": destinatario.pais
                },
                "colonia": {
                    "clave": "",
                    "nombre": destinatario.colonia
                },
                "delegacionMunicipio": {
                    "clave": "",
                    "nombre": destinatario.municipioAlcaldia
                },
                "localidad": {
                    "clave": "001",
                    "nombre": destinatario.localidad
                },
                "entidadFederativa": {
                    "clave": "09",
                    "nombre": "Ciudad de México"
                },
                "informacionExtra": "",
                "codigoPostal": destinatario.codigoPostal,
                "descripcionColonia": destinatario.colonia
            },
            "idSolicitud": "0"
          }
      }),
      "gridTerceros_TIPERS_PVD": state.proveedorTablaDatos.map((proveedor) => {
        return {
            "idPersonaSolicitud": "",
            "ideTipoTercero": "",
            "personaMoral": proveedor.tipoPersona === "Moral" ? "1" : "0",
            "booleanExtranjero": "",
            "booleanFisicaNoContribuyente": "",
            "denominacion": proveedor.razonSocial,
            "razonSocial": proveedor.razonSocial,
            "rfc": proveedor.rfc,
            "curp": proveedor.curp,
            "nombre": proveedor.nombres,
            "apellidoPaterno": proveedor.primerApellido,
            "apellidoMaterno": proveedor.segundoApellido,
            "telefono": proveedor.telefono,
            "correoElectronico": proveedor.correoElectronico,
            "actividadProductiva": "",
            "actividadProductivaDesc": "",
            "descripcionGiro": "",
            "numeroRegistro": "",
            "domicilio": {
                "calle": proveedor.calle,
                "numeroExterior": proveedor.numeroExterior,
                "numeroInterior": proveedor.numeroInterior,
                "pais": {
                    "clave": "",
                    "nombre": proveedor.pais
                },
                "colonia": {
                    "clave": "",
                    "nombre": proveedor.colonia
                },
                "delegacionMunicipio": {
                    "clave": "",
                    "nombre": proveedor.municipioAlcaldia
                },
                "localidad": {
                    "clave": "",
                    "nombre": proveedor.localidad
                },
                "entidadFederativa": {
                    "clave": "",
                    "nombre": proveedor.entidadFederativa
                },
                "informacionExtra": "",
                "codigoPostal": proveedor.codigoPostal,
                "descripcionColonia": proveedor.colonia
            },
            "idSolicitud": "0"
          }
      }),
      "gridTerceros_TIPERS_FAC": state.facturadorTablaDatos.map((facturador) => { 
        return {
          "idPersonaSolicitud": "",
          "ideTipoTercero": "",
          "personaMoral": facturador.tipoPersona === "Moral" ? "1" : "0",
          "booleanExtranjero": "",
          "booleanFisicaNoContribuyente": "",
          "denominacion": facturador.razonSocial,
          "razonSocial": facturador.razonSocial,
          "rfc": facturador.rfc,
          "curp": facturador.curp,
          "nombre": facturador.nombres,
          "apellidoPaterno": facturador.primerApellido,
          "apellidoMaterno": facturador.segundoApellido,
          "telefono": facturador.telefono,
          "correoElectronico": facturador.correoElectronico,
          "actividadProductiva": "",
          "actividadProductivaDesc": "",
          "descripcionGiro": "",
          "numeroRegistro": "",
          "domicilio": {
              "calle": facturador.calle,
              "numeroExterior": facturador.numeroExterior,
              "numeroInterior": facturador.numeroInterior,
              "pais": {
                  "clave": "",
                  "nombre": facturador.pais
              },
              "colonia": {
                  "clave": "",
                  "nombre": facturador.colonia
              },
              "delegacionMunicipio": {
                  "clave": "",
                  "nombre": facturador.municipioAlcaldia
              },
              "localidad": {
                  "clave": "",
                  "nombre": facturador.localidad
              },
              "entidadFederativa": {
                  "clave": "",
                  "nombre": facturador.entidadFederativa
              },
              "informacionExtra": "",
              "codigoPostal": facturador.codigoPostal,
              "descripcionColonia": facturador.colonia
          },
          "idSolicitud": "0"
        }
      }),
      "pagoDeDerechos": {
          "claveDeReferencia": state.pagoDerechos.claveReferencia,
          "cadenaPagoDependencia": state.pagoDerechos.cadenaDependencia,
          "banco": {
              "clave": state.pagoDerechos.banco,
              "descripcion": ""
          },
          "llaveDePago": state.pagoDerechos.llavePago,
          "fecPago": state.pagoDerechos.fechaPago,
          "impPago": state.pagoDerechos.importePago
      },
      "idSolicitud": state.idSolicitud || 0
    }
  }

static toPatchDatoscian(datos:DatoSCIAN[]):PatchDatoScian[] {
    if (!datos || datos.length === 0) {
      return [];
    }
    return datos.map((dato)=>{
          return {
                     "clave": dato.cveScian,
                     "descripcion": dato.descripcion,
                     "selected": true
                }
     });
}
static toPatchPagoDerechos(pagoDerechos:PagoDeDerechos):PagoDerechosFormState {
  if (!pagoDerechos) {
    return {} as PagoDerechosPatchData;
  }
    return {
    claveReferencia: pagoDerechos.claveDeReferencia,
      cadenaDependencia: pagoDerechos.cadenaPagoDependencia,
      estado: pagoDerechos.banco.clave,
      llavePago: pagoDerechos.llaveDePago,
      fechaPago: pagoDerechos.fecPago,
      importePago: pagoDerechos.impPago,
      banco: pagoDerechos.banco.clave
      }
}
static toPatchDatosSolicitudFormState(datos:any):DatosSolicitudFormState{
    if(!datos){
    return {} as DatosSolicitudFormState;
    }
    return GuardarAdapter_260214.toPatchDatosSolicitudFormStateCrt(datos);

}
static toPatchDatosSolicitudFormStateCrt(datos:any):DatosSolicitudFormState{
    return {
      rfcSanitario: datos.establecimiento.rfcResponsableSanitario || '',
      denominacionRazon:  datos.establecimiento.razonSocial || '',
      correoElectronico: datos.establecimiento.correoElectronico || '',
      codigoPostal: datos.establecimiento.domicilio.codigoPostal || '',
      estado: datos.establecimiento.domicilio.entidadFederativa.clave || '',
      municipioAlcaldia: datos.establecimiento.domicilio.descripcionMunicipio || '',
      localidad: datos.establecimiento.domicilio.informacionExtra || '',
      colonia: datos.establecimiento.domicilio.descripcionColonia || '',
      calle: datos.establecimiento.domicilio.calle || '',
      lada: datos.establecimiento.domicilio.lada || '',
      telefono: datos.establecimiento.domicilio.telefono || '',
      aviso: datos.establecimiento.avisoFuncionamiento|| false,
      licenciaSanitaria: datos.establecimiento.numeroLicencia || '',
      regimen: datos.solicitud.regimen || '',
      adunasDeEntradas: datos.establecimiento.aduanas || '',
      aeropuerto: false,
      publico: datos.solicitud.informacionConfidencial === true ? 'Si' : 'No',
      representanteRfc: datos?.representanteLegal?.rfc || '',
      representanteNombre: datos?.representanteLegal?.nombre || '',
      apellidoPaterno: datos?.representanteLegal?.apellidoPaterno || '',
      apellidoMaterno: datos?.representanteLegal?.apellidoMaterno || '',
      manifesto: datos.solicitud.declaracionesSeleccionadas || false,
}
}
static toPatchfabricanteTablaDatos(datos:any):Fabricante[]{
    if (!datos || datos.gridTerceros_TIPERS_FAB.length === 0) {
      return [];
    }
        const DATOSFABRICANTE = datos.gridTerceros_TIPERS_FAB;
        return DATOSFABRICANTE.map((fabricante:any)=>{
          return {
              id:fabricante.idPersonaSolicitud || '',
              ideTipoTercero:fabricante.ideTipoTercero || '',
              tipoPersona: fabricante.personaMoral === "1" ? "Moral" : "Física",
              nacionalidad: fabricante.booleanExtranjero === "1" ? "Extranjero" : "Nacional",
              denominacion: fabricante.denominacion || '',
              razonSocial: fabricante.razonSocial || '',
              rfc: fabricante.rfc || '',
              curp: fabricante.curp || '',
              nombres: fabricante?.nombre || '',
              primerApellido: fabricante.apellidoPaterno || '',
              segundoApellido: fabricante.apellidoMaterno || '',
              telefono: fabricante.telefono || '',
              correoElectronico: fabricante.correoElectronico || '',
              calle: fabricante.domicilio.calle || '',
              numeroExterior: fabricante.domicilio.numeroExterior || '',
              numeroInterior: fabricante.domicilio.numeroInterior || '',
              pais: fabricante.domicilio.pais.nombre || '',
              colonia: fabricante.domicilio.colonia.nombre || '',
              municipioAlcaldia: fabricante.domicilio.delegacionMunicipio.nombre || '',
              localidad: fabricante.domicilio.localidad.nombre || '',
              entidadFederativa: fabricante.domicilio.entidadFederativa.nombre || '',
              codigoPostal: fabricante.domicilio.codigoPostal || '',
              descripcionColonia: fabricante.domicilio.descripcionColonia || '',
              idSolicitud:fabricante.idSolicitud || ''
          }
        });
}
static toPatchDestinatario(datos:any):Destinatario[]{
    if (!datos || datos.gridTerceros_TIPERS_DES.length === 0) {
      return [];
    }
        const DATOSDESTINATARIO = datos.gridTerceros_TIPERS_DES;
        return DATOSDESTINATARIO.map((destinatario:any)=>{
          return {
                id:destinatario.idPersonaSolicitud || '',
                ideTipoTercero:destinatario.ideTipoTercero || '',
                tipoPersona: destinatario.personaMoral === "1" ? "Moral" : "Física",
                razonSocial: destinatario.razonSocial || '',
                rfc: destinatario.rfc || '',
                curp: destinatario.curp || '',
                nombres: destinatario.nombre || '',
                primerApellido: destinatario.apellidoPaterno || '',
                segundoApellido: destinatario.apellidoMaterno || '',
                telefono: destinatario.telefono || '',
                correoElectronico: destinatario.correoElectronico || '',
                calle: destinatario.domicilio.calle || '',
                numeroExterior: destinatario.domicilio.numeroExterior || '',
                numeroInterior: destinatario.domicilio.numeroInterior || '',
                pais: destinatario.domicilio.pais.nombre || '',
                colonia: destinatario.domicilio.colonia.nombre || '',
                delegacionMunicipio: destinatario.domicilio.delegacionMunicipio.nombre || '',
                localidad: destinatario.domicilio.localidad.nombre || '',
                codigoPostal: destinatario.domicilio.codigoPostal || '',
                idSolicitud:destinatario.idSolicitud || ''
          }
        });
}
static toPatchproveedorTablaDatos(datos:any):Proveedor[]{
if(!datos || datos.gridTerceros_TIPERS_PVD.length === 0) {
    return [] as Proveedor[] ;
}
const DATOSPROVEEDOR = datos.gridTerceros_TIPERS_PVD;
return DATOSPROVEEDOR.map((proveedor:any)=>{
    return {
id:proveedor.idPersonaSolicitud || '',
tipoPersona: proveedor.personaMoral === "1" ? "Moral" : "Física",
razonSocial: proveedor.denominacion || '',
rfc: proveedor.rfc || '',
curp: proveedor.curp || '',
nombres: proveedor.nombre || '',
primerApellido: proveedor.apellidoPaterno || '',
segundoApellido: proveedor.apellidoMaterno || '',
telefono: proveedor.telefono || '',
correoElectronico: proveedor.correoElectronico || '',
calle: proveedor.domicilio.calle || '',
numeroExterior: proveedor.domicilio.numeroExterior || '',
numeroInterior: proveedor.domicilio.numeroInterior || '',
pais: proveedor.domicilio.pais.nombre || '',
colonia: proveedor.domicilio.colonia.nombre || '',
municipioAlcaldia: proveedor.domicilio.delegacionMunicipio.nombre || '',
localidad: proveedor.domicilio.localidad.nombre || '',
entidadFederativa: proveedor.domicilio.entidadFederativa || '',
codigoPostal: proveedor.domicilio.codigoPostal || '',
idSolicitud:proveedor.idSolicitud || ''
    }
});
}
static toPatchfacturadorTablaDatos(datos:any):Facturador[]{
    if (!datos || datos.gridTerceros_TIPERS_FAC.length === 0) {
      return [] as Facturador[];
    }
        const DATOSFACTURADOR = datos.gridTerceros_TIPERS_FAC;
        return DATOSFACTURADOR.map((facturador:any)=>{
          return {
            id:facturador.idPersonaSolicitud || '',
            tipoPersona: facturador.personaMoral === "1" ? "Moral" : "Física",
            razonSocial: facturador.razonSocial || '',
            rfc: facturador.rfc || '',
            curp: facturador.curp || '',
            nombres: facturador?.nombre || '',
            primerApellido: facturador.apellidoPaterno || '',
            segundoApellido: facturador.apellidoMaterno || '',
            telefono: facturador.telefono || '',
            correoElectronico: facturador.correoElectronico || '',
            calle: facturador.domicilio.calle || '',
            numeroExterior: facturador.domicilio.numeroExterior || '',
            numeroInterior: facturador.domicilio.numeroInterior || '',
            pais: facturador.domicilio?.pais?.nombre || '',
            colonia: facturador.domicilio?.colonia?.nombre || '',
            municipioAlcaldia: facturador?.domicilio?.delegacionMunicipio?.nombre || '',
            localidad: facturador.domicilio.localidad.nombre || '',
            entidadFederativa: facturador?.domicilio?.entidadFederativa?.nombre || '',
            codigoPostal: facturador.domicilio.codigoPostal || '',
          }});
}
static toPatchtablaMercanciasConfigDatos(datos:any):TablaMercanciasDatos[]{
    if (!datos || datos.mercancias.length === 0) {
        return [];
        }
        const DATOSMERCANCIAS = datos.mercancias;
        return DATOSMERCANCIAS.map((mercancia:any)=>{
          return {
  id: mercancia?.idMercancia || '',
  idClasificacionProducto: mercancia?.idClasificacionProducto || '',
  clasificacionProducto: mercancia?.nombreClasificacionProducto || '',
  especificarClasificacionProducto: mercancia?.nombreSubClasificacionProducto || '',
  denominacionEspecificaProducto: mercancia?.descDenominacionEspecifica || '',
  denominacionDistintiva: mercancia?.descDenominacionDistintiva || '',
  formaFarmaceutica: mercancia?.formaFarmaceuticaDescripcionOtros || '',
  estadoFisico: mercancia?.estadoFisicoDescripcionOtros || '',
  fraccionArancelaria: mercancia?.fraccionArancelaria?.clave || '',
  unidadMedidaComercializacion: mercancia?.unidadMedidaComercial?.descripcion || '',
  cantidadUmtValor: mercancia?.cantidadUMCConComas || '',
  cantidadUMT: mercancia?.unidadMedidaTarifa?.descripcion || '',
  presentacion: mercancia?.presentacion || '',
  numeroRegistroSanitario: mercancia?.registroSanitarioConComas || '',
  paisOrigenDatosClave: mercancia?.nombreCortoPaisOrigen || '',
  paisProcedenciaDatosClave: mercancia?.nombreCortoPaisProcedencia || '',
  tipoProducto: mercancia?.tipoProductoDescripcionOtros || '',
  usoEspecificoDatosClave: mercancia?.nombreCortoUsoEspecifico || '',
  fechaCaducidad: mercancia?.fechaCaducidadStr || ''
}});
}


static toPatchValueStore(datos:any):any{
    return {
        datosSolicitudFormState: GuardarAdapter_260214.toPatchDatosSolicitudFormState(datos),
        scianConfigDatos:GuardarAdapter_260214.toPatchDatoscian(datos.datosSCIAN),
        pagoDerechos:GuardarAdapter_260214.toPatchPagoDerechos(datos.pagoDeDerechos),
        fabricanteTablaDatos:GuardarAdapter_260214.toPatchfabricanteTablaDatos(datos),
        destinatarioFinalTablaDatos:GuardarAdapter_260214.toPatchDestinatario(datos),
        proveedorTablaDatos:GuardarAdapter_260214.toPatchproveedorTablaDatos(datos),
        facturadorTablaDatos:GuardarAdapter_260214.toPatchfacturadorTablaDatos(datos),
        tablaMercanciasConfigDatos:GuardarAdapter_260214.toPatchtablaMercanciasConfigDatos(datos)
        
    }
}

}