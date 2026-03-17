/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @fileoverview
 * Este archivo contiene el servicio adaptador para convertir entre el estado de Akita y los formatos de payload de API
 * para el trámite de ampliación de servicios 260910.
 */

import { DatosDelSolicituteSeccionState, DatosDelSolicituteSeccionStateStore } from '../../../shared/estados/stores/datos-del-solicitute-seccion.store';
import { DatosDomicilioLegalState, DatosDomicilioLegalStore } from '../../../shared/estados/stores/datos-domicilio-legal.store';
import { DomicilioState, DomicilioStore } from '../../../shared/estados/stores/domicilio.store';
import { Tramite260910State, Tramite260910Store } from '../estados/tramite260910Store.store';
import { Injectable } from '@angular/core';


@Injectable({
    providedIn: 'root'
})
export class GuardarAdapter_260910 {
    /**
     * Convierte del estado de Akita al formato de payload de API usando las mismas claves
     * @param state El estado actual de Akita
     * @param datosState El estado de los datos del solicitante
     * @param manifestoState El estado del manifiesto
     * @param representanteLegalDatos Los datos del representante legal
     * @returns Payload formateado para la API
     */
    static toFormPayload(state: Tramite260910State, datosState: DatosDelSolicituteSeccionState, manifestoState: DatosDomicilioLegalState, representanteLegalDatos: DomicilioState): unknown {

        return {
            idSolicitud: state.idSolicitud ?? 0,
            "solicitante": {
                "rfc": "AAL0409235E6",
                "nombre": "ACEROS ALVARADO S.A. DE C.V.",
                "actividadEconomica": "Fabricación de productos de hierro y acero",
                "correoElectronico": "contacto@acerosalvarado.com",
                "rol_capturista": "PersonaMoral",
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
                "discriminatorValue": 260918,
                "declaracionesSeleccionadas": manifestoState.mensaje,
                "regimen": datosState.regimen,
                "aduanaAIFA": datosState.aifaCheckbox,
                "informacionConfidencial": manifestoState.cumplimiento === 'Si' ? true : false,
                "tipoOperacion": datosState.ideGenerica,
                "justificacion": datosState.observaciones
            },
            "establecimiento": {
                "rfcResponsableSanitario": datosState.establecimientoRFCResponsableSanitario,
                "razonSocial": datosState.establecimientoRazonSocial,
                "correoElectronico": datosState.establecimientoCorreoElectronico,
                "domicilio": {
                    "codigoPostal": datosState.establecimientoDomicilioCodigoPostal,
                    "entidadFederativa": {
                        "clave": datosState.establecimientoEstados
                    },
                    "descripcionMunicipio": datosState.descripcionMunicipio,
                    "informacionExtra": datosState.localidad,
                    "descripcionColonia": datosState.establishomentoColonias,
                    "calle": datosState.calle,
                    "lada": datosState.lada,
                    "telefono": datosState.telefono
                },
                "original": "",
                "avisoFuncionamiento": datosState.avisoCheckbox,
                "numeroLicencia": datosState.noDeLicenciaSanitaria,
                "aduanas": datosState.aduanasEntradas
            },
            "datosSCIAN": datosState.scianData.map((datos) => {
                return {
                    "cveScian": datos.claveScian,
                    "descripcion": datos.descripcionScian,
                    "selected": true
                }
            }),
            "mercancias": (datosState.mercanciaDatos ?? []).map((mercancia) => {
                return {
                    "idMercancia": mercancia.id ?? null,
                    "idClasificacionProducto": mercancia.claveClasificacionProductoObj?.clave,
                    "nombreClasificacionProducto": mercancia.claveClasificacionProductoObj?.descripcion,
                    "ideSubClasificacionProducto": mercancia.especificarClasificacionObj?.clave,
                    "nombreSubClasificacionProducto": mercancia.especificarClasificacionObj?.descripcion,
                    "descDenominacionEspecifica": mercancia.denominacionEspecifica,
                    "descDenominacionDistintiva": mercancia.denominacionDistintiva,
                    "descripcionMercancia": mercancia.descripcionMercancia,
                    "registroSanitarioConComas": "",
                    "fechaCaducidadStr": mercancia.fechaDeCaducidad,
                    "formaFarmaceuticaDescripcionOtros": mercancia.formaFarmaceutica,
                    "estadoFisicoDescripcionOtros": mercancia.estadoFisico,
                    "fraccionArancelaria": {
                        "clave": mercancia.fraccionArancelaria,
                        "descripcion": ""
                    },
                    "unidadMedidaComercial": {
                        "descripcion": mercancia.cantidadUMC
                    },
                    "cantidadUMCConComas": mercancia.cantidadUmcValor,
                    "unidadMedidaTarifa": {
                        "descripcion": mercancia.cantidadUMT
                    },
                    "cantidadUMTConComas": mercancia.cantidadUmtValor,
                    "presentacion": mercancia.presentacion,
                    "nombreCortoPaisOrigen": mercancia.paisOrigenDatosClave ?? [],
                    "tipoProductoDescripcionOtros": mercancia.tipoProducto,
                    "nombreCortoPaisProcedencia": mercancia.paisProcedenciaDatosClave ?? [],
                    "nombreCortoUsoEspecifico": mercancia.usoEspecificoDatosClave ?? [],
                }
            }),
            "representanteLegal": {
                "rfc": representanteLegalDatos.rfc,
                "resultadoIDC": "",
                "nombre": representanteLegalDatos.nombreRazonSocial,
                "apellidoPaterno": representanteLegalDatos.apellidoPaterno,
                "apellidoMaterno": representanteLegalDatos.apellidoMaterno
            },
            "gridTerceros_TIPERS_FAB": state.fabricanteTablaDatos.map((fabricante) => {
                return {
                    "idPersonaSolicitud": "",
                    "ideTipoTercero": "",
                    "personaMoral": fabricante.tipoPersona === "Moral" ? "1" : "0",
                    "booleanExtranjero": fabricante.nacionalidad === 'Extranjero' ? "1" : "0",
                    "booleanFisicaNoContribuyente": "0",
                    "denominacion": fabricante.tipoPersona === "Moral" ? fabricante.razonSocial : `${fabricante.nombres} ${fabricante.primerApellido} ${fabricante.segundoApellido}`,
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
                            "clave": fabricante.paisObj?.clave,
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
                        "informacionExtra": "",
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
                            "clave": destinatario.paisObj?.clave,
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
                        "informacionExtra": "",
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
                            "clave": proveedor.paisObj?.clave,
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
                        "informacionExtra": "",
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
                            "clave": facturador.paisObj?.clave,
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
                        "informacionExtra": "",
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


    /**
     * Mapea un arreglo de objetos de datos SCIAN desde formato de API o interno a un arreglo normalizado.
     * @param arr Arreglo de objetos SCIAN (opcional)
     * @returns Arreglo de objetos con propiedades claveScian y descripcionScian
     */
    private static mapScianData(arr?: any[]): any[] {
        return (arr ?? []).map((d: any) => ({
            claveScian: d.cveScian ?? d.clave ?? '',
            descripcionScian: d.descripcion ?? ''
        }));
    }


    /**
     * Mapea un arreglo de objetos de mercancías de API o formato interno a un arreglo normalizado para uso interno.
     * @param arr Arreglo de objetos de mercancías (opcional)
     * @returns Arreglo de objetos de mercancías normalizados con propiedades mapeadas
     */
    private static mapMercanciasData(arr?: any[]): any[] {
        return (arr ?? []).map((m: any) => ({
            claveClasificacionProductoObj: {
                clave: m.idClasificacionProducto ?? '',
                descripcion: m.nombreClasificacionProducto ?? ''
            },
            especificarClasificacionObj: {
                clave: m.ideSubClasificacionProducto ?? '',
                descripcion: m.nombreSubClasificacionProducto ?? ''
            },
            denominacionEspecificaProducto: m.descDenominacionEspecifica ?? '',
            denominacionComun: m.descripcionMercancia ?? '',
            denominacionDistintiva: m.descDenominacionDistintiva ?? '',
            formaFarmaceutica: m.formaFarmaceuticaDescripcionOtros ?? '',
            estadoFisico: m.estadoFisicoDescripcionOtros ?? '',
            fraccionArancelaria: m.fraccionArancelaria?.clave ?? '',
            descripcionFraccion: m.fraccionArancelaria?.descripcion ?? '',
            cantidadUMT: m.unidadMedidaTarifa?.descripcion ?? '',
            presentacion: m.presentacion ?? '',
            numeroRegistroSanitario: m.registroSanitarioConComas ?? '',
            paisDeOriginDatos: m.nombreCortoPaisOrigen ?? '',
            paisDeProcedenciaDatos: m.nombreCortoPaisProcedencia ?? '',
            tipoProducto: m.tipoProductoDescripcionOtros ?? '',
            usoEspecifico: m.nombreCortoUsoEspecifico ?? '',
            fechaCaducidad: m.fechaCaducidadStr ?? '',
            clasificacionProducto: m.nombreClasificacionProducto ?? '',
            especificarClasificacionProducto: m.nombreSubClasificacionProducto ?? '',
            unidadMedidaComercializacion: m.unidadMedidaComercial?.descripcion ?? '',
            unidadMedidaTarifa: m.unidadMedidaTarifa?.descripcion ?? '',
            paisOrigen: m.nombreCortoPaisOrigen ?? "",
            paisProcedencia: m.nombreCortoPaisProcedencia ?? "",
            id: m.idMercancia || null,
            paisOrigenDatosClave: m.nombreCortoPaisOrigen ?? "",
            paisProcedenciaDatosClave: m.nombreCortoPaisProcedencia ?? "",
            usoEspecificoDatosClave: m.nombreCortoUsoEspecifico ?? "",
            cantidadUMCConComas: m.cantidadUmcValor ?? '',
            cantidadUMC: m.unidadMedidaComercial?.descripcion ?? '',
            cantidadUMTConComas: m.cantidadUmtValor ?? '',
        }));
    }


    /**
     * Mapea un arreglo de objetos de fabricantes de API o formato interno a un arreglo normalizado para uso interno.
     * @param grid Arreglo de objetos de fabricantes (opcional)
     * @returns Arreglo de objetos de fabricantes normalizados con propiedades mapeadas
     */
    private static mapFabricantesData(grid?: any[]): any[] {
        return (grid ?? []).map((p: any) => ({
            nacionalidad: p.booleanExtranjero === '1' ? 'Extranjero' : 'Nacional',
            tipoPersona: p.personaMoral === '1' ? 'Moral' : 'Física',
            id: parseInt(p.idPersonaSolicitud ?? '0', 10) || undefined,
            nombreRazonSocial: p.denominacion ?? p.razonSocial ?? '',
            rfc: p.rfc ?? '',
            curp: p.curp ?? '',
            telefono: p.telefono ?? '',
            correoElectronico: p.correoElectronico ?? '',
            calle: p.domicilio?.calle ?? '',
            numeroExterior: p.domicilio?.numeroExterior ?? '',
            numeroInterior: p.domicilio?.numeroInterior ?? '',
            pais: p.domicilio?.pais?.nombre ?? '',
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
     * Mapea un arreglo de objetos de destinatarios de API o formato interno a un arreglo normalizado para uso interno.
     * @param grid Arreglo de objetos de destinatarios (opcional)
     * @returns Arreglo de objetos de destinatarios normalizados con propiedades mapeadas
     */
    private static mapDestinatariosData(grid?: any[]): any[] {
        return (grid ?? []).map((p: any) => ({
            nacionalidad: p.booleanExtranjero === '1' ? 'Extranjero' : 'Nacional',
            tipoPersona: p.personaMoral === '1' ? 'Moral' : 'Física',
            id: parseInt(p.idPersonaSolicitud ?? '0', 10) || undefined,
            nombreRazonSocial: p.denominacion ?? p.razonSocial ?? '',
            rfc: p.rfc ?? '',
            curp: p.curp ?? '',
            telefono: p.telefono ?? '',
            correoElectronico: p.correoElectronico ?? '',
            calle: p.domicilio?.calle ?? '',
            numeroExterior: p.domicilio?.numeroExterior ?? '',
            numeroInterior: p.domicilio?.numeroInterior ?? '',
            pais: p.domicilio?.pais?.nombre ?? '',
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
     * Mapea un arreglo de objetos de proveedores de API o formato interno a un arreglo normalizado para uso interno.
     * @param grid Arreglo de objetos de proveedores (opcional)
     * @returns Arreglo de objetos de proveedores normalizados con propiedades mapeadas
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
            pais: p.domicilio?.pais?.nombre ?? '',
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
     * Mapea datos de facturador de API al formato interno de facturador
     * @param grid Arreglo de objetos de facturadores (opcional)
     * @returns Arreglo de objetos de facturadores normalizados con propiedades mapeadas
     */
    private static mapFacturadoresData(grid?: any[]): any[] {
        return (grid ?? []).map((p: any) => ({
            nacionalidad: p.booleanExtranjero === '1' ? 'Extranjero' : 'Nacional',
            tipoPersona: p.personaMoral === '1' ? 'Moral' : 'Física',
            id: parseInt(p.idPersonaSolicitud ?? '0', 10) || undefined,
            nombreRazonSocial: p.denominacion ?? p.razonSocial ?? '',
            rfc: p.rfc ?? '',
            curp: p.curp ?? '',
            telefono: p.telefono ?? '',
            correoElectronico: p.correoElectronico ?? '',
            calle: p.domicilio?.calle ?? '',
            numeroExterior: p.domicilio?.numeroExterior ?? '',
            numeroInterior: p.domicilio?.numeroInterior ?? '',
            pais: p.domicilio?.pais?.nombre ?? '',
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
     * Mapea datos de pago de derechos de API o formato interno a un objeto normalizado para uso interno.
     * @param pagoData Objeto de datos de pago (opcional)
     * @returns Objeto de datos de pago normalizado con propiedades mapeadas
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
     * Mapea una respuesta de API (payload del formulario) de vuelta a un Tramite260910State parcial.
     * Este es un mapeo reverso de mejor esfuerzo de `toFormPayload` y solo
     * poblará campos comúnmente utilizados. Campos desconocidos o anidados complejos se dejan
     * sin tocar para que los llamadores puedan fusionarlos según sea necesario.
     *
     * @param response Objeto de respuesta de API que coincide con la forma del payload del formulario
     * @returns Partial<Tramite260910State>
     */
    static fromApiResponse(response: unknown): Partial<Tramite260910State> {
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

        const PARTIAL: Partial<Tramite260910State> = {
            idSolicitud: RESP.solicitud?.idSolicitud ?? 0,
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
     * Mapea datos de establecimiento de API o formato interno a un objeto DatosDelSolicituteSeccionState parcial.
     * @param establecimiento Objeto de datos del establecimiento
     * @returns Partial<DatosDelSolicituteSeccionState> con propiedades mapeadas
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
     * Mapea datos de solicitud de API o formato interno a un objeto DatosDelSolicituteSeccionState parcial.
     * @param solicitud Objeto de datos de solicitud
     * @returns Partial<DatosDelSolicituteSeccionState> con propiedades mapeadas
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
     * Mapea una respuesta de API (payload del formulario) a un objeto DatosDelSolicituteSeccionState parcial.
     * Este es un mapeo reverso del método toFormPayload para la sección de solicitud.
     * @param response Objeto de respuesta de API que coincide con la forma del payload del formulario
     * @returns Partial<DatosDelSolicituteSeccionState> con propiedades mapeadas
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

    /**
     * Mapea una respuesta de API (payload del formulario) a un objeto DomicilioState parcial para la sección de representante legal.
     * @param response Objeto de respuesta de API que coincide con la forma del payload del formulario
     * @returns Partial<DomicilioState> con propiedades mapeadas
     */
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
     * Mapea una respuesta de API (payload del formulario) a un objeto DatosDomicilioLegalState parcial para la sección de manifiesto.
     * @param response Objeto de respuesta de API que coincide con la forma del payload del formulario
     * @returns Partial<DatosDomicilioLegalState> con propiedades mapeadas
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
     * Método de conveniencia: mapea la respuesta de API y la aplica directamente al store proporcionado.
     * Si se omite el argumento `store`, el método simplemente devuelve el estado parcial mapeado.
     *
     * @param response Respuesta de API
     * @param store Instancia opcional de Tramite260910Store para aplicar el parche
     * @returns Partial<Tramite260910State> (y aplica el parche al store cuando se proporciona)
     */
    static patchToStore(response: any, store?: Tramite260910Store): Partial<Tramite260910State> {
        const PARTIAL = GuardarAdapter_260910.fromApiResponse(response);
        if (store) {
            // Akita's update accepts a partial or updater function
            store.update((state) => ({ ...state, ...PARTIAL }));
        }
        return PARTIAL;
    }

    /**
     * Método de conveniencia: mapea la respuesta de API para la sección de solicitud y la aplica al store proporcionado.
     * Si se omite el store, devuelve solo el estado parcial mapeado.
     *
     * @param response Objeto de respuesta de API
     * @param store Instancia opcional de DatosDelSolicituteSeccionStateStore para aplicar el parche
     * @returns Partial<DatosDelSolicituteSeccionState> (y aplica el parche al store cuando se proporciona)
     */
    static patchToStoreDatosSolicitud(response: any, store?: DatosDelSolicituteSeccionStateStore): Partial<DatosDelSolicituteSeccionState> {
        const PARTIAL = GuardarAdapter_260910.fromApiResponseDatosSolicitud(response);
        if (store) {
            store.update((state) => ({ ...state, ...PARTIAL }));
        }
        return PARTIAL;
    }

    /**
     * Método de conveniencia: mapea la respuesta de API para la sección de representante legal y la aplica al DomicilioStore proporcionado.
     * Si se omite el store, devuelve solo el estado parcial mapeado.
     *
     * @param response Objeto de respuesta de API
     * @param store Instancia opcional de DomicilioStore para aplicar el parche
     * @returns Partial<DomicilioState> (y aplica el parche al store cuando se proporciona)
     */
    static patchToStoreDomicilio(response: any, store?: DomicilioStore): Partial<DomicilioState> {
        const PARTIAL = GuardarAdapter_260910.fromApiResponseRepresentanteLegal(response);
        if (store) {
            store.update((state) => ({ ...state, ...PARTIAL }));
        }
        return PARTIAL;
    }

    /**
     * Método de conveniencia: mapea la respuesta de API para la sección de manifiesto y la aplica al DatosDomicilioLegalStore proporcionado.
     * Si se omite el store, devuelve solo el estado parcial mapeado.
     *
     * @param response Objeto de respuesta de API
     * @param store Instancia opcional de DatosDomicilioLegalStore para aplicar el parche
     * @returns Partial<DatosDomicilioLegalState> (y aplica el parche al store cuando se proporciona)
     */
    static patchToStoreManifestos(response: any, store?: DatosDomicilioLegalStore): Partial<DatosDomicilioLegalState> {
        const PARTIAL = GuardarAdapter_260910.fromApiResponseManifesto(response);
        if (store) {
            store.update((state) => ({ ...state, ...PARTIAL }));
        }
        return PARTIAL;
    }
}