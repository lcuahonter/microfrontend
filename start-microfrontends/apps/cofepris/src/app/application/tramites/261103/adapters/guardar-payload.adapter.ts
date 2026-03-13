/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @fileoverview
 * Este archivo contiene el servicio adaptador para convertir entre el estado de Akita y los formatos de payload de API
 * para el trámite de ampliación de servicios 80205.
 */

import { DatosDelSolicituteSeccionState, DatosDelSolicituteSeccionStateStore } from '../../../shared/estados/stores/datos-del-solicitute-seccion.store';
import { DatosDomicilioLegalState, DatosDomicilioLegalStore } from '../../../shared/estados/stores/datos-domicilio-legal.store';
import { DomicilioState, DomicilioStore } from '../../../shared/estados/stores/domicilio.store';
import { Injectable } from '@angular/core';

import { DatosProcedureState, DatosProcedureStore } from '../estados/tramites261103.store';



@Injectable({
    providedIn: 'root'
})
export class GuardarAdapter_261103 {
    /**
     * Convierte del estado de Akita al formato de payload de API usando las mismas claves
     * @param state El estado actual de Akita
     * @returns Payload formateado para la API
     */
    static toFormPayload(state: DatosProcedureState): unknown {
        return {
            "idSolicitud": state.idSolicitud || "0",
            "solicitante": {
                "rfc": "AAL0409235E6",
                "nombre": "ACEROS ALVARADO S.A. DE C.V.",
                "actividadEconomica": "Fabricación de productos de hierro y acero",
                "correoElectronico": "contacto@acerosalvarado.com",
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
                },
            },
            "solicitud": {
                "discriminatorValue": 261103,
                "declaracionesSeleccionadas": state.datosSolicitudFormState.manifesto,
                "regimen": state.datosSolicitudFormState.regimen,
                "aduanaAIFA": "",
                "informacionConfidencial": state.datosSolicitudFormState.publico === 'Si' ? true : false,
                
            },
             "establecimiento": {
          "rfcResponsableSanitario": state.datosSolicitudFormState.rfcSanitario,
          "razonSocial": state.datosSolicitudFormState.denominacionRazon,
          "correoElectronico": state.datosSolicitudFormState.correoElectronico,
          "domicilio": {
              "codigoPostal": state.datosSolicitudFormState.codigoPostal,
              "entidadFederativa": {
                  "clave": state.datosSolicitudFormState.estado
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
           "datosSCIAN": state.scianConfigDatos.map((datos)=>{
        return {
              "cveScian": datos.clave,
              "descripcion": datos.descripcion,
              "selected": true
          }
      }),
      "mercancias": (state.tablaMercanciasConfigDatos ?? []).map((mercancia) => {
        return {
              "idMercancia": mercancia.id?.toString() ?? null,
              "idClasificacionProducto": mercancia.claveClasificacionProductoObj?.clave,
              "nombreClasificacionProducto": mercancia.claveClasificacionProductoObj?.descripcion,
              "ideSubClasificacionProducto": mercancia.especificarClasificacionObj?.clave,
              "nombreSubClasificacionProducto": mercancia.especificarClasificacionObj?.descripcion,
              "descDenominacionEspecifica": mercancia.denominacionEspecificaProducto,
              "descDenominacionDistintiva": mercancia.denominacionDistintiva,
              "descripcionMercancia": mercancia.denominacionComun,
              "idFormaFarmaceutica": mercancia.formaFarmaceutica,
              "formaFarmaceuticaDescripcionOtros": mercancia.especifiqueForma,
              "idEstadoFisico": mercancia.estadoFisico,
              "estadoFisicoDescripcionOtros": mercancia.especifiqueEstado,
              "fraccionArancelaria": {
                  "clave": mercancia.fraccionArancelaria,
                  "descripcion": mercancia.descripcionFraccion
              },
              "unidadMedidaComercial": {
                descripcion: mercancia.cantidadUMC
            },
            "cantidadUMCConComas": mercancia.cantidadUmcValor,
            "unidadMedidaTarifa": {
                descripcion: mercancia.cantidadUMT
            },
            "cantidadUMTConComas": mercancia.cantidadUmtValor,
              "presentacion": mercancia.presentacion,
              "registroSanitarioConComas": mercancia.numeroRegistroSanitario,
              "nombreCortoPaisOrigen": mercancia.paisOrigenDatosClave,
              "nombreCortoPaisProcedencia": mercancia.paisProcedenciaDatosClave,
              "idTipoProductoTipoTramite": mercancia.tipoProducto,
              "tipoProductoDescripcionOtros": mercancia.especifique,
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
                    "idPersonaSolicitud": fabricante.id?.toString() || "",
                    "ideTipoTercero": fabricante.ideTipoTercero ?? '',
                    "personaMoral": fabricante.tipoPersona === "Moral" ? "1" : "0",
                    "booleanExtranjero": fabricante.nacionalidad === 'Extranjero' ? "1" : "0",
                    "booleanFisicaNoContribuyente": fabricante.booleanFisicaNoContribuyente,
                    "denominacion": fabricante.tipoPersona === "Moral" ? fabricante.razonSocial : `${fabricante.nombres} ${fabricante.primerApellido} ${fabricante.segundoApellido}`,
                    "razonSocial": fabricante.razonSocial,
                    "rfc": fabricante.rfc,
                    "curp": fabricante.curp,
                    "nombre": fabricante.nombres,
                    "apellidoPaterno": fabricante.primerApellido,
                    "apellidoMaterno": fabricante.segundoApellido,
                    "telefono": fabricante.telefono,
                    "correoElectronico": fabricante.correoElectronico,
                    "actividadProductiva": fabricante.actividadProductiva ?? '',
                    "actividadProductivaDesc": "",
                    "descripcionGiro": "",
                    "numeroRegistro": "",
                    "domicilio": {
                        "calle": fabricante.calle,
                        "numeroExterior": fabricante.numeroExterior,
                        "numeroInterior": fabricante.numeroInterior,
                        "pais": {
                            "clave": fabricante.paisObj?.clave ? fabricante.paisObj.clave.substring(0, 3) : '',
                            "nombre": fabricante.paisObj?.descripcion
                        },
                        "colonia": {
                            "clave": fabricante.coloniaObj?.clave,
                            "nombre": fabricante.coloniaObj?.descripcion
                        },
                        "delegacionMunicipio": {
                            "clave": fabricante.municipioAlcaldiaObj?.clave,
                            "nombre": fabricante.municipioAlcaldiaObj?.descripcion
                        },
                        "localidad": {
                            "clave": fabricante.localidadObj?.clave,
                            "nombre": fabricante.localidadObj?.descripcion
                        },
                        "entidadFederativa": {
                            "clave": fabricante.entidadFederativaObj?.clave,
                            "nombre": fabricante.entidadFederativaObj?.descripcion
                        },
                        "informacionExtra": fabricante.localidad,
                        "codigoPostal": fabricante.codigoPostal,
                        "descripcionColonia": fabricante.colonia
                    },
                    "idSolicitud": state.idSolicitud.toString() || "0"
                }
            }),
            "gridTerceros_TIPERS_DES": state.destinatarioFinalTablaDatos.map((destinatario) => {
                return {
                    "idPersonaSolicitud": "",
                    "ideTipoTercero": "TIPERS.FAB",
                    "personaMoral": destinatario.tipoPersona === "Moral" ? "1" : "0",
                    "booleanExtranjero": "",
                    "booleanFisicaNoContribuyente": destinatario.booleanFisicaNoContribuyente || '',
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
                            "clave": destinatario.paisObj?.clave ? destinatario.paisObj.clave.substring(0, 3) : '',
                            "nombre": destinatario.paisObj?.descripcion
                        },
                        "colonia": {
                            "clave": destinatario.coloniaObj?.clave,
                            "nombre": destinatario.coloniaObj?.descripcion
                        },
                        "delegacionMunicipio": {
                            "clave": destinatario.municipioObj?.clave,
                            "nombre": destinatario.municipioObj?.descripcion
                        },
                        "localidad": {
                            "clave": destinatario.localidadObj?.clave,
                            "nombre": destinatario.localidadObj?.descripcion
                        },
                        "entidadFederativa": {
                            "clave": "",
                            "nombre": ""
                        },
                        "informacionExtra": destinatario.localidad,
                        "codigoPostal": destinatario.codigoPostal,
                        "descripcionColonia": destinatario.colonia
                    },
                    "idSolicitud": state.idSolicitud.toString() || "0"
                }
            }),
            "gridTerceros_TIPERS_PVD": state.proveedorTablaDatos.map((proveedor) => {
                return {
                    "idPersonaSolicitud": "",
                    "ideTipoTercero": "",
                    "personaMoral": proveedor.tipoPersona === "Moral" ? "1" : "0",
                    "booleanExtranjero": "",
                    "booleanFisicaNoContribuyente": proveedor.booleanFisicaNoContribuyente,
                    "denominacion": proveedor.razonSocial,
                    "razonSocial": proveedor.razonSocial,
                    "rfc": proveedor.rfc,
                    "curp": proveedor.curp,
                    "nombre": proveedor.nombres,
                    "apellidoPaterno": proveedor.primerApellido,
                    "apellidoMaterno": proveedor.segundoApellido,
                    "telefono": proveedor.telefono,
                    "correoElectronico": proveedor.correoElectronico,
                    "actividadProductiva": proveedor.actividadProductiva,
                    "actividadProductivaDesc": "",
                    "descripcionGiro": "",
                    "numeroRegistro": "",
                    "domicilio": {
                        "calle": proveedor.calle,
                        "numeroExterior": proveedor.numeroExterior,
                        "numeroInterior": proveedor.numeroInterior,
                        "pais": {
                            "clave": proveedor.paisObj?.clave ? proveedor.paisObj.clave.substring(0, 3) : '',
                            "nombre": proveedor.paisObj?.descripcion
                        },
                        "colonia": {
                            "clave": "",
                            "nombre": ""
                        },
                        "delegacionMunicipio": {
                            "clave": "",
                            "nombre": ""
                        },
                        "localidad": {
                            "clave": "",
                            "nombre": ""
                        },
                        "entidadFederativa": {
                            "clave": "",
                            "nombre": ""
                        },
                        "informacionExtra": proveedor.localidad,
                        "codigoPostal": proveedor.codigoPostal,
                        "descripcionColonia": proveedor.colonia
                    },
                    "idSolicitud": state.idSolicitud.toString() || "0"
                }
            }),
            "gridTerceros_TIPERS_FAC": state.facturadorTablaDatos.map((facturador) => {
                return {
                    "idPersonaSolicitud": "",
                    "ideTipoTercero": "",
                    "personaMoral": facturador.tipoPersona === "Moral" ? "1" : "0",
                    "booleanExtranjero": "",
                    "booleanFisicaNoContribuyente": facturador.booleanFisicaNoContribuyente,
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
                            "clave": facturador.paisObj?.clave ? facturador.paisObj.clave.substring(0, 3) : '',
                            "nombre": facturador.paisObj?.descripcion
                        },
                        "colonia": {
                            "clave": "",
                            "nombre": ""
                        },
                        "delegacionMunicipio": {
                            "clave": "",
                            "nombre": ""
                        },
                        "localidad": {
                            "clave": "",
                            "nombre": ""
                        },
                        "entidadFederativa": {
                            "clave": "",
                            "nombre": ""
                        },
                        "informacionExtra": facturador.localidad,
                        "codigoPostal": facturador.codigoPostal,
                        "descripcionColonia": facturador.colonia
                    },
                    "idSolicitud": state.idSolicitud.toString() || "0"
                }
            }),

            "pagoDeDerechos": {
                "claveDeReferencia": state.pagoDerechos.claveReferencia,
                "cadenaPagoDependencia": state.pagoDerechos.cadenaDependencia,
                "banco": {
                    "clave": state.pagoDerechos.bancoObject?.clave,
                    "descripcion": state.pagoDerechos.bancoObject?.descripcion
                },
                "llaveDePago": state.pagoDerechos.llavePago,
                "fecPago": state.pagoDerechos.fechaPago,
                "impPago": state.pagoDerechos.importePago
            }
        }
    }
    /**     * Mapea los datos de SCIAN al formato requerido por la API
     * @param arr 
     * @returns 
     */
    private static mapScianData(arr?: any[]): any[] {
        return (arr ?? []).map((d: any) => ({
            claveScian: d.cveScian ?? d.clave ?? '',
            descripcionScian: d.descripcion ?? ''
        }));
    }
    /**
     * Mapea los datos de mercancías al formato requerido por la API
     * @param arr 
     * @returns 
     */
    private static mapMercanciasData(arr?: any[]): any[] {
        return (arr ?? []).map((m: any) => ({
            id: m.idMercancia ?? null,
            idClasificacionProducto: m.idClasificacionProducto ?? null,
            idSubClasificacionProducto: m.ideSubClasificacionProducto ?? null,
            clasificacion: m.nombreClasificacionProducto ?? '',
            especificar: m.nombreSubClasificacionProducto ?? '',
            denominacionEspecifica: m.descDenominacionEspecifica ?? '',
            denominacionDistintiva: m.descDenominacionDistintiva ?? '',
            denominacionComun: m.denominacionComun ?? '',
            formaFarmaceutica: m.formaFarmaceuticaDescripcionOtros ?? '',
            descripcionMercancia: m.descripcionMercancia ?? '',
            estadoFisico: m.estadoFisicoDescripcionOtros ?? '',
            fraccionArancelaria: m.fraccionArancelaria?.clave ?? '',
            descripcionFraccion: m.fraccionArancelaria?.descripcion ?? '',
            fraccionArancelariaDescripcion: m.fraccionArancelaria?.descripcion ?? '',
            cantidadUMC: m.unidadMedidaComercial.descripcion ?? '',
            cantidadUmtValor: m.cantidadUMTConComas ?? '',
            cantidadUMT: m.unidadMedidaTarifa.descripcion ?? '',
            cantidadUmcValor: m.cantidadUMCConComas ?? '',
            presentacion: m.presentacion ?? '',
            paisOrigenDatosClave: m.nombreCortoPaisOrigen ?? '',
            paisProcedenciaDatosClave: m.nombreCortoPaisProcedencia ?? '',
            tipoProducto: m.tipoProductoDescripcionOtros ?? '',
            usoEspecificoDatosClave: m.nombreCortoUsoEspecifico ?? ''
        }));
    }

    /**
     * Mapea los datos de fabricantes al formato requerido por la API
     * 
     * @param grid 
     * @returns 
     */
    private static mapFabricantesData(grid?: any[]): any[] {
        
        return (grid ?? []).map((p: any) => ({
            nacionalidad: p.booleanExtranjero === '1' ? 'Extranjero' : 'Nacional',
            tipoPersona: p.personaMoral === '1' ? 'Moral' : 'Física',
            id: parseInt(p.idPersonaSolicitud ?? '0', 10) || undefined,
            ideTipoTercero: p.ideTipoTercero ?? '',
            nombreRazonSocial: p.denominacion ?? p.razonSocial ?? '',
            booleanFisicaNoContribuyente: p.booleanFisicaNoContribuyente ?? '',
            rfc: p.rfc ?? '',
            curp: p.curp ?? '',
            telefono: p.telefono ?? '',
            correoElectronico: p.correoElectronico ?? '',
            calle: p.domicilio?.calle ?? '',
            numeroExterior: p.domicilio?.numeroExterior ?? '',
            numeroInterior: p.domicilio?.numeroInterior ?? '',
            pais: p.domicilio?.pais?.nombre ?? '',
            paisObj: { 
                clave: p.domicilio?.pais?.nombre ?? '',
                descripcion: p.domicilio?.pais?.nombre ?? ''
            },
            colonia: p.domicilio?.colonia?.nombre ?? '',
            municipioAlcaldia: p.domicilio?.delegacionMunicipio?.nombre ?? '',
            localidad: p.domicilio?.localidad?.nombre ?? '',
            entidadFederativa: p.domicilio?.entidadFederativa?.nombre ?? '',
            estadoLocalidad: p.domicilio?.localidad?.nombre ?? '',
            codigoPostal: p.domicilio?.codigoPostal ?? '',
            coloniaEquivalente: p.domicilio?.descripcionColonia ?? '',
            nombres: p.nombre ?? '',
            primerApellido: p.apellidoPaterno ?? '',
            segundoApellido: p.apellidoMaterno ?? '',
            razonSocial: p.razonSocial ?? '',
            lada: p.domicilio?.lada ?? ''
        }));
    }

/**
 * Mapea los datos de destinatarios al formato requerido por la API
 * @param grid 
 * @returns 
 */
    private static mapDestinatariosData(grid?: any[]): any[] {
        
        return (grid ?? []).map((p: any) => ({
            nacionalidad: p.booleanExtranjero === '1' ? 'Extranjero' : 'Nacional',
            tipoPersona: p.personaMoral === '1' ? 'Moral' : 'Física',
            id: parseInt(p.idPersonaSolicitud ?? '0', 10) || undefined,
            nombreRazonSocial: p.denominacion ?? p.razonSocial ?? '',
            booleanFisicaNoContribuyente: p.booleanFisicaNoContribuyente ?? '',
            rfc: p.rfc ?? '',
            curp: p.curp ?? '',
            telefono: p.telefono ?? '',
            correoElectronico: p.correoElectronico ?? '',
            calle: p.domicilio?.calle ?? '',
            numeroExterior: p.domicilio?.numeroExterior ?? '',
            numeroInterior: p.domicilio?.numeroInterior ?? '',
            pais: p.domicilio?.pais?.nombre ?? '',
            paisObj: { 
                clave: p.domicilio?.pais?.nombre ?? '',
                descripcion: p.domicilio?.pais?.nombre ?? ''
            },
            colonia: p.domicilio?.colonia?.nombre ?? '',
            municipioAlcaldia: p.domicilio?.delegacionMunicipio?.nombre ?? '',
            localidad: p.domicilio?.localidad?.nombre ?? '',
            entidadFederativa: p.domicilio?.entidadFederativa?.nombre ?? '',
            estadoLocalidad: p.domicilio?.entidadFederativa?.nombre ?? '',
            codigoPostal: p.domicilio?.codigoPostal ?? '',
            coloniaEquivalente: p.domicilio?.descripcionColonia ?? '',
            nombres: p.nombre ?? '',
            primerApellido: p.apellidoPaterno ?? '',
            segundoApellido: p.apellidoMaterno ?? '',
            razonSocial: p.razonSocial ?? '',
            lada: p.domicilio?.lada ?? ''
        }));
    }
    /**
     * Mapea los datos de proveedores al formato requerido por la API
     * @param grid 
     * @returns 
     */

    private static mapProveedoresData(grid?: any[]): any[] {
        return (grid ?? []).map((p: any) => ({
            rfc: p.rfc ?? '',
            razonSocial: p.razonSocial ?? '',
            nombres: p.nombre ?? '',
            primerApellido: p.apellidoPaterno ?? '',
            segundoApellido: p.apellidoMaterno ?? '',
            telefono: p.telefono ?? '',
            correoElectronico: p.correoElectronico ?? '',
            booleanFisicaNoContribuyente: p.booleanFisicaNoContribuyente ?? '',
            pais: p.domicilio?.pais?.nombre ?? '',
            paisObj: { 
                clave: p.domicilio?.pais?.nombre ?? '',
                descripcion: p.domicilio?.pais?.nombre ?? ''
            },
            municipioAlcaldia: p.domicilio?.delegacionMunicipio?.nombre ?? '',
            localidad: p.domicilio?.localidad?.nombre ?? '',
            entidadFederativa: p.domicilio?.entidadFederativa?.nombre ?? '',
            estadoLocalidad: p.domicilio?.entidadFederativa?.nombre ?? '',
            codigoPostal: p.domicilio?.codigoPostal ?? '',
            colonia: p.domicilio?.descripcionColonia ?? '',
            nombreRazonSocial: p.denominacion ?? p.razonSocial ?? '',
            curp: p.curp ?? '',
            calle: p.domicilio?.calle ?? '',
            numeroExterior: p.domicilio?.numeroExterior ?? '',
            numeroInterior: p.domicilio?.numeroInterior ?? '',
            tipoPersona: p.personaMoral === '1' ? 'Moral' : 'Física',
            nacionalidad: p.booleanExtranjero === '1' ? 'Extranjero' : 'Nacional',
            actividadEconomica: '',
            id: parseInt(p.idPersonaSolicitud ?? '0', 10) || undefined,
        }));
    }


    /**
     * Maps API facturador data to internal facturador format
     */
    private static mapFacturadoresData(grid?: any[]): any[] {
        return (grid ?? []).map((p: any) => ({
            nacionalidad: p.booleanExtranjero === '1' ? 'Extranjero' : 'Nacional',
            tipoPersona: p.personaMoral === '1' ? 'Moral' : 'Física',
            id: parseInt(p.idPersonaSolicitud ?? '0', 10) || undefined,
            nombreRazonSocial: p.denominacion ?? p.razonSocial ?? '',
            booleanFisicaNoContribuyente: p.booleanFisicaNoContribuyente ?? '',
            rfc: p.rfc ?? '',
            curp: p.curp ?? '',
            telefono: p.telefono ?? '',
            correoElectronico: p.correoElectronico ?? '',
            calle: p.domicilio?.calle ?? '',
            numeroExterior: p.domicilio?.numeroExterior ?? '',
            numeroInterior: p.domicilio?.numeroInterior ?? '',
            pais: p.domicilio?.pais?.nombre ?? '',
            paisObj: { 
                clave: p.domicilio?.pais?.nombre ?? '',
                descripcion: p.domicilio?.pais?.nombre ?? ''
            },
            colonia: p.domicilio?.descripcionColonia ?? '',
            municipioAlcaldia: p.domicilio?.delegacionMunicipio?.nombre ?? '',
            localidad: p.domicilio?.localidad?.nombre ?? '',
            entidadFederativa: p.domicilio?.entidadFederativa?.nombre ?? '',
            estadoLocalidad: p.domicilio?.localidad?.nombre ?? '',
            codigoPostal: p.domicilio?.codigoPostal ?? '',
            coloniaEquivalente: p.domicilio?.descripcionColonia ?? '',
            nombres: p.nombre ?? '',
            primerApellido: p.apellidoPaterno ?? '',
            segundoApellido: p.apellidoMaterno ?? '',
            razonSocial: p.razonSocial ?? '',
            lada: p.domicilio?.lada ?? ''
        }));
    }

/**
 * 
 * Maps API pago de derechos data to internal pago de derechos format
 * @param pagoData 
 * @returns 
 */
    private static mapPagoDerechosData(pagoData?: any): any {
        return {
            claveReferencia: pagoData?.claveDeReferencia ?? '',
            cadenaDependencia: pagoData?.cadenaPagoDependencia ?? '',
            bancoObject: {
                clave: pagoData?.banco?.clave ?? '',
                descripcion: pagoData?.banco?.descripcion ?? '',
                id: pagoData?.banco?.clave ?? '',
            },
            llavePago: pagoData?.llaveDePago ?? '',
            fechaPago: pagoData?.fecPago ?? '',
            importePago: pagoData?.impPago ?? '',
            banco: pagoData?.banco?.clave ?? '',
        };
    }

    /**
     * Map an API response (form payload) back into a partial Tramite260202State.
     * This is a best-effort reverse mapping of `toFormPayload` and will only
     * populate commonly used fields. Unknown or complex nested fields are left
     * untouched so callers can merge them as needed.
     *
     * @param response API response object matching the form payload shape
     * @returns Partial<Tramite260202State>
     */
    static fromApiResponse(response: unknown): Partial<DatosProcedureState> {
        if (!response || typeof response !== 'object') {
            return {};
        }
        const RESP = response as any;
        const DATOS_SOLICITUD_FORM_STATE = {
            rfc: RESP.representanteLegal?.rfc ?? '',
            nombreRazonSocial: RESP.representanteLegal?.nombre ?? '',
            apellidoPaterno: RESP.representanteLegal?.apellidoPaterno ?? '',
            apellidoMaterno: RESP.representanteLegal?.apellidoMaterno ?? '',
        };

        const PARTIAL: Partial<DatosProcedureState> = {
            idSolicitud: RESP.idSolicitud ?? 0,
            datosSolicitudFormState: DATOS_SOLICITUD_FORM_STATE as any,
            fabricanteTablaDatos: this.mapFabricantesData(RESP.gridTerceros_TIPERS_FAB) as any,
            destinatarioFinalTablaDatos: this.mapDestinatariosData(RESP.gridTerceros_TIPERS_DES) as any,
            proveedorTablaDatos: this.mapProveedoresData(RESP.gridTerceros_TIPERS_PVD) as any,
            facturadorTablaDatos: this.mapFacturadoresData(RESP.gridTerceros_TIPERS_FAC) as any,
            pagoDerechos: this.mapPagoDerechosData(RESP.pagoDeDerechos) as any,
        };

        return PARTIAL;
    }
/**
 * Mapea los datos del establecimiento al formato requerido por la API
 * @param establecimiento 
 * @returns 
 */
    private static mapEstablecimientoDatos(establecimiento: any): Partial<DatosDelSolicituteSeccionState> {
        return {
            establecimientoCorreoElectronico: establecimiento?.correoElectronico ?? '',
            establecimientoDomicilioCodigoPostal: establecimiento?.domicilio?.codigoPostal ?? '',
            establecimientoRFCResponsableSanitario: establecimiento?.rfcResponsableSanitario ?? '',
            establecimientoRazonSocial: establecimiento?.razonSocial ?? '',
            establishomentoColonias: establecimiento?.domicilio?.descripcionColonia ?? '',
            establecimientoEstados: establecimiento?.domicilio?.entidadFederativa?.clave ?? '',
            descripcionMunicipio: establecimiento?.domicilio?.descripcionMunicipio ?? '',
            localidad: establecimiento?.domicilio?.informacionExtra ?? '',
            calle: establecimiento?.domicilio?.calle ?? '',
            lada: establecimiento?.domicilio?.lada ?? '',
            telefono: establecimiento?.domicilio?.telefono ?? '',
            noLicenciaSanitaria: establecimiento?.numeroLicencia ?? '',
            avisoCheckbox: establecimiento?.avisoFuncionamiento ?? '',
            original: establecimiento?.original ?? '',
            aduanasEntradas: establecimiento?.aduanas ?? [],
            noDeLicenciaSanitaria: establecimiento?.numeroLicencia ?? '',
        };
    }
    
    /**
     * Mapea los datos de la solicitud al formato requerido por la API
     * @param solicitud 
     * @returns 
     */
    private static mapSolicitudDatos(solicitud: any): Partial<DatosDelSolicituteSeccionState> {
        return {
            ideGenerica: solicitud?.tipoOperacion ?? '',
            observaciones: solicitud?.justificacion ?? '',
            regimen: solicitud?.regimen ?? '',
            aifaCheckbox: solicitud?.aduanaAIFA ?? '',
        };
    }
    /**
     * Mapea la respuesta de la API al estado interno de datos de la solicitud
     * @param response 
     * @returns 
     */
    static fromApiResponseDatosSolicitud(response: unknown): Partial<DatosDelSolicituteSeccionState> {
        if (!response || typeof response !== 'object') {
            return {};
        }
        const RESP = response as any;

        return {
            ...this.mapEstablecimientoDatos(RESP.establecimiento),
            ...this.mapSolicitudDatos(RESP.solicitud),
            scianData: this.mapScianData(RESP.datosSCIAN) as any,
            mercanciaDatos: this.mapMercanciasData(RESP.mercancias) as any,
        };
    }

    static fromApiResponseRepresentanteLegal(response: unknown): Partial<DomicilioState> {
        if (!response || typeof response !== 'object') {
            return {};
        }
        const RESP = response as any;
        return {
            rfc: RESP.representanteLegal?.rfc ?? '',
            nombreRazonSocial: RESP.representanteLegal?.nombre ?? '',
            apellidoPaterno: RESP.representanteLegal?.apellidoPaterno ?? '',
            apellidoMaterno: RESP.representanteLegal?.apellidoMaterno ?? '',
        };
    }
/**
 * 
 * Mapea la respuesta de la API al estado interno de datos del manifiesto
 * @param response 
 * @returns 
 */
    static fromApiResponseManifesto(response: unknown): Partial<DatosDomicilioLegalState> {
        if (!response || typeof response !== 'object') {
            return {};
        }
        const RESP = response as any;
        return {
            cumplimiento: RESP.solicitud?.informacionConfidencial ? 'Si' : 'No',
            mensaje: RESP.solicitud?.declaracionesSeleccionadas ?? false,
        };
    }

    /**
     * Convenience method: map the API response and patch it directly into the provided store.
     * If the `store` argument is omitted, the method simply returns the mapped partial state.
     *
     * @param response API response
     * @param store Optional Tramite260202Store instance to apply the patch
     * @returns Partial<DatosProcedureStore> (and patches the store when provided)
     */
    static patchToStore(response: any, store?: DatosProcedureStore): Partial<DatosProcedureState> {
        const PARTIAL = GuardarAdapter_261103.fromApiResponse(response);
        if (store) {
            // Akita's update accepts a partial or updater function
            store.update((state) => ({ ...state, ...PARTIAL }));
        }
        return PARTIAL;
    }
    /**
     * Convenience method: map the API response and patch it directly into the provided store.
     * @param response 
     * @param store 
     * @returns 
     */
    static patchToStoreDatosSolicitud(response: any, store?: DatosDelSolicituteSeccionStateStore): Partial<DatosDelSolicituteSeccionState> {
        const PARTIAL = GuardarAdapter_261103.fromApiResponseDatosSolicitud(response);
        if (store) {
            store.update((state) => ({ ...state, ...PARTIAL }));
        }
        return PARTIAL;
    }
    /**
     * Convenience method: map the API response and patch it directly into the provided store.
     * @param response 
     * @param store 
     * @returns 
     */
    static patchToStoreDomicilio(response: any, store?: DomicilioStore): Partial<DomicilioState> {
        const PARTIAL = GuardarAdapter_261103.fromApiResponseRepresentanteLegal(response);
        if (store) {
            store.update((state) => ({ ...state, ...PARTIAL }));
        }   
        return PARTIAL;
    }
    /** * Convenience method: map the API response and patch it directly into the provided store.
     * @param response 
     * @param store 
     * @returns 
     */
    static patchToStoreManifestos(response: any, store?: DatosDomicilioLegalStore): Partial<DatosDomicilioLegalState> {
        const PARTIAL = GuardarAdapter_261103.fromApiResponseManifesto(response);
        if (store) {
            store.update((state) => ({ ...state, ...PARTIAL }));
        }
        return PARTIAL;
    }
}