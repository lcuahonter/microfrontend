/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @fileoverview
 * Este archivo contiene el servicio adaptador para convertir entre el estado de Akita y los formatos de payload de API
 * para el trámite 260906.
 */

import { Subject, map, takeUntil } from 'rxjs';
import { DatosDelSolicituteSeccionState } from '../../../shared/estados/stores/datos-del-solicitute-seccion.store';
import { Injectable } from '@angular/core';
import { LoginQuery } from '@libs/shared/data-access-user/src';
import { PermisoImportacionBiologicaState } from '../../../shared/estados/permiso-importacion-biologica.store';
import { Solicitud260906State } from '../../../estados/tramites/sanitario260906.store';
import { TercerosRelacionadasState } from '../../../shared/estados/stores/terceros-relacionados.stores';


/**
 * Servicio adaptador para la conversión de datos del trámite 260906.
 * 
 * Esta clase se encarga de transformar los datos entre el estado interno de la aplicación
 * (Akita stores) y los formatos de payload requeridos por la API de COFEPRIS.
 * Proporciona métodos estáticos para conversión bidireccional de datos.
 * 
 * Funcionalidades principales:
 * - Conversión de estados Akita a payload de API para guardar datos
 * - Conversión de payload de API a estados Akita para cargar datos
 * - Gestión de RFC de usuario logueado
 * - Manejo de estructuras complejas de terceros relacionados
 */
@Injectable({
    providedIn: 'root'
})
export class GuardarAdapter_260906 {

    /**
     * RFC del usuario actualmente logueado en el sistema.
     * Se obtiene del estado de login y se utiliza para operaciones que requieren identificación del usuario.
     */
    public loginRfc: string = '';

    /**
     * Subject utilizado para gestionar la destrucción de suscripciones y prevenir fugas de memoria.
     * 
     * Se utiliza con el patrón takeUntil para cancelar automáticamente todas las suscripciones
     * activas cuando el componente o servicio se destruye.
     * 
     * @private
     */
    destroyNotifier$: Subject<void> = new Subject();

    /**
     * Constructor del adaptador de payload para el trámite 260906.
     * 
     * Inicializa la suscripción al estado de login para mantener actualizado
     * el RFC del usuario logueado. Esta información es necesaria para
     * operaciones que requieren identificación del usuario en los payloads.
     * 
     * @param loginQuery - Query para acceder al estado de login del usuario
     */
    constructor(
    private loginQuery: LoginQuery
    ) {
    this.loginQuery.selectLoginState$.pipe(takeUntil(this.destroyNotifier$),
        map((seccionState) => {
        this.loginRfc = seccionState.rfc;
        })).subscribe();
    }

    /**
     * Convierte los estados de Akita al formato de payload requerido por la API de COFEPRIS.
     * 
     * Este método estático toma múltiples estados de la aplicación y los transforma
     * en una estructura de datos compatible con la API del trámite 260906.
     * 
     * La transformación incluye:
     * - Datos del solicitante y su domicilio
     * - Información de la solicitud (régimen, aduanas, etc.)
     * - Datos del establecimiento y responsable sanitario
     * - Información SCIAN de actividades económicas
     * - Detalles de mercancías con clasificaciones y registros
     * - Información del representante legal
     * - Terceros relacionados (fabricantes, destinatarios, proveedores, facturadores)
     * - Datos de pago de derechos
     * 
     * @param state - Estado del trámite 260906 con datos principales
     * @param datosState - Estado de la sección de datos del solicitante
     * @param tercerosState - Estado de terceros relacionados
     * @param pagoDerechos - Estado del pago de derechos
     * @returns Payload formateado para envío a la API
     */
    static toFormPayload(state: Solicitud260906State, datosState: DatosDelSolicituteSeccionState, tercerosState: TercerosRelacionadasState, pagoDerechos: PermisoImportacionBiologicaState): unknown {
      return {
        solicitante: {
          rfc: "AAL0409235E6",
          nombre: 'ACEROS ALVARADO S.A. DE C.V.',
          actividadEconomica: 'Fabricación de productos de hierro y acero',
          correoElectronico: 'contacto@acerosalvarado.com',
          domicilio: {
            pais: 'México',
            codigoPostal: '06700',
            estado: 'Ciudad de México',
            municipioAlcaldia: 'Cuauhtémoc',
            localidad: 'Centro',
            colonia: 'Roma Norte',
            calle: 'Av. Insurgentes Sur',
            numeroExterior: '123',
            numeroInterior: 'Piso 5, Oficina A',
            lada: '',
            telefono: '123456',
          },
        },
        solicitud: {
          discriminatorValue: 260905,
          declaracionesSeleccionadas: true,
          regimen: datosState.regimen,
          aduanaAIFA: '140',
          informacionConfidencial: datosState.informacionConfidencialRadio,
          tipoOperacion: datosState.ideGenerica,
          justificacion: datosState.observaciones,
        },
        establecimiento: {
          rfcResponsableSanitario:
            datosState.establecimientoRFCResponsableSanitario,
          razonSocial: datosState.establecimientoRazonSocial,
          correoElectronico: datosState.establecimientoCorreoElectronico,
          domicilio: {
            codigoPostal: datosState.establecimientoDomicilioCodigoPostal,
            entidadFederativa: {
              clave: datosState.establecimientoEstados,
            },
            descripcionMunicipio: datosState.descripcionMunicipio,
            informacionExtra: datosState.localidad,
            descripcionColonia: datosState.establishomentoColonias,
            calle: datosState.calle,
            lada: datosState.lada,
            telefono: datosState.telefono,
          },
          original: '',
          avisoFuncionamiento: datosState.avisoCheckbox,
          numeroLicencia: datosState.noLicenciaSanitaria,
          aduanas: datosState.aduanasEntradas,
        },
        datosSCIAN: [
          {
            cveScian: datosState.scianData.map((i) => i.claveScian)[0],
            descripcion: datosState.scianData.map((i) => i.descripcionScian)[0],
            selected: true,
          },
        ],
        mercancias: datosState.mercanciaDatos.map((mercancia, index) => ({
          idMercancia: mercancia.id || (index + 1).toString(),
          idClasificacionProducto: mercancia.clasificacion || "325",
          nombreClasificacionProducto: 'Fab. sustancias químicas básicas',
          ideSubClasificacionProducto: '32541',
          nombreSubClasificacionProducto: 'Fab. productos farmacéuticos',
          descDenominacionEspecifica: mercancia.denominacionEspecifica || "Medicamentos para uso humano",
          descDenominacionDistintiva: mercancia.denominacionDistintiva || "Paracetamol Tabletas 500mg",
          descripcionMercancia: 'Paracetamol Tabletas 500mg',
          formaFarmaceuticaDescripcionOtros: mercancia.formaFarmaceutica || "Tableta",
          estadoFisicoDescripcionOtros: mercancia.estadoFisico || "Sólido",
          fraccionArancelaria: {
            clave: mercancia.fraccionArancelaria || "30049099",
            descripcion: mercancia.descripcionFraccion || "Los demás medicamentos constituidos por productos mezclados",
          },
          unidadMedidaComercial: {
            descripcion: mercancia.unidad || "Pieza",
          },
          cantidadUMCConComas: '50,000',
          unidadMedidaTarifa: {
            descripcion: mercancia.unidadUMT || "Kilogramo",
          },
          cantidadUMTConComas: mercancia.cantidadUMT || "1,000.00",
          presentacion: mercancia.presentacion || "Frasco x 100 tabletas",
          registroSanitarioConComas: mercancia.numeroRegistro || "COFEPRIS-REG-001-2024-SSA1",
          nombreCortoPaisOrigen: mercancia.paisOrigenDatosClave,
          nombreCortoPaisProcedencia: mercancia.paisProcedenciaDatosClave ?? [],
          tipoProductoDescripcionOtros: mercancia.tipoProducto || "Analgésico",
          nombreCortoUsoEspecifico: mercancia.usoEspecificoDatosClave ?? [],
          fechaCaducidadStr: mercancia.fechaDeCaducidad || "31/12/2026",
        })),
        representanteLegal: {
          rfc: datosState.representanteRfc,
          resultadoIDC: '',
          nombre: datosState.representanteNombre,
          apellidoPaterno: datosState.apellidoPaterno,
          apellidoMaterno: datosState.apellidoMaterno,
        },
        gridTerceros_TIPERS_FAB: tercerosState.destinatarioModel.map(destinatario => ({
          idPersonaSolicitud: '',
          ideTipoTercero: 'TIPERS.FAB',
          personaMoral: '1',
          booleanExtranjero: '0',
          booleanFisicaNoContribuyente: '0',
        
          denominacion: destinatario.denominacionRazonSocial,
          razonSocial: destinatario.denominacionRazonSocial,
          rfc: destinatario.rfc,
          curp: destinatario.curp || '',
        
          nombre: '',
          apellidoPaterno: '',
          apellidoMaterno: '',
          telefono: destinatario.telefono,
          correoElectronico: destinatario.CorreoElectronico,
        
          actividadProductiva: 'MANUFACTURA',
          actividadProductivaDesc: 'Fabricación de productos farmacéuticos',
          descripcionGiro: 'Laboratorio farmacéutico',
          numeroRegistro: 'REG-001-2024',
        
          domicilio: {
            calle: destinatario.calle,
            numeroExterior: destinatario.numeroExterior,
            numeroInterior: destinatario.numeroInterior,
        
            pais: {
              clave: destinatario.pais,
              nombre: 'México'
            },
        
            colonia: {
              clave: destinatario.colonia,
              nombre: 'Industrial'
            },
        
            delegacionMunicipio: {
              clave: destinatario.municipioOAlcaldia,
              nombre: 'Cuauhtémoc'
            },
        
            localidad: {
              clave: destinatario.localidad,
              nombre: 'Ciudad de México'
            },
        
            entidadFederativa: {
              clave: destinatario.entidadFederativa,
              nombre: 'Ciudad de México'
            },
        
            informacionExtra: destinatario.estadoLocalidad,
            codigoPostal: destinatario.codigoPostal,
            descripcionColonia: destinatario.coloniaoEquivalente
          },
        
          idSolicitud: state.idSolicitud
        })),        
        gridTerceros_TIPERS_DES: tercerosState.destinatarioModel.map(destinatario => ({
          idPersonaSolicitud: '',
          ideTipoTercero: 'TIPERS.DES', // <-- DES instead of FAB
          personaMoral: '1',
          booleanExtranjero: '0',
          booleanFisicaNoContribuyente: '0',
        
          denominacion: destinatario.denominacionRazonSocial,
          razonSocial: destinatario.denominacionRazonSocial,
          rfc: destinatario.rfc,
          curp: destinatario.curp || '',
        
          nombre: '',
          apellidoPaterno: '',
          apellidoMaterno: '',
          telefono: destinatario.telefono,
          correoElectronico: destinatario.CorreoElectronico,
        
          actividadProductiva: 'MANUFACTURA',
          actividadProductivaDesc: 'Fabricación de productos farmacéuticos',
          descripcionGiro: 'Laboratorio farmacéutico',
          numeroRegistro: 'REG-001-2024',
        
          domicilio: {
            calle: destinatario.calle,
            numeroExterior: destinatario.numeroExterior,
            numeroInterior: destinatario.numeroInterior,
        
            pais: {
              clave: destinatario.pais,
              nombre: 'México'
            },
        
            colonia: {
              clave: destinatario.colonia,
              nombre: 'Industrial'
            },
        
            delegacionMunicipio: {
              clave: destinatario.municipioOAlcaldia,
              nombre: 'Cuauhtémoc'
            },
        
            localidad: {
              clave: destinatario.localidad,
              nombre: 'Ciudad de México'
            },
        
            entidadFederativa: {
              clave: destinatario.entidadFederativa,
              nombre: 'Ciudad de México'
            },
        
            informacionExtra: destinatario.estadoLocalidad,
            codigoPostal: destinatario.codigoPostal,
            descripcionColonia: destinatario.coloniaoEquivalente
          },
        
          idSolicitud: state.idSolicitud
        })),        
        gridTerceros_TIPERS_PVD: tercerosState.proveedorModel.map(proveedor => ({
          idPersonaSolicitud: '',
          ideTipoTercero: 'TIPERS.PVD', // <-- PVD
          personaMoral: '1',
          booleanExtranjero: '0',
          booleanFisicaNoContribuyente: '0',
        
          denominacion: proveedor.denominacionRazonSocial,
          razonSocial: 'LABORATORIOS PISA S.A. DE C.V.',
          rfc: proveedor.rfc,
          curp: proveedor.curp || '',
        
          nombre: '',
          apellidoPaterno: '',
          apellidoMaterno: '',
          telefono: proveedor.telefono,
          correoElectronico: proveedor.CorreoElectronico,
        
          actividadProductiva: 'MANUFACTURA',
          actividadProductivaDesc: 'Fabricación de productos farmacéuticos',
          descripcionGiro: 'Laboratorio farmacéutico',
          numeroRegistro: 'REG-001-2024',
        
          domicilio: {
            calle: proveedor.calle || 'Av. Industria No. 2000',
            numeroExterior: proveedor.numeroExterior,
            numeroInterior: proveedor.numeroInterior,
        
            pais: {
              clave: proveedor.pais,
              nombre: 'México'
            },
        
            colonia: {
              clave: proveedor.colonia,
              nombre: 'Industrial'
            },
        
            delegacionMunicipio: {
              clave: proveedor.municipioOAlcaldia,
              nombre: 'Cuauhtémoc'
            },
        
            localidad: {
              clave: proveedor.localidad,
              nombre: 'Ciudad de México'
            },
        
            entidadFederativa: {
              clave: proveedor.entidadFederativa,
              nombre: 'Ciudad de México'
            },
        
            informacionExtra: proveedor.estadoLocalidad,
            codigoPostal: proveedor.codigoPostal,
            descripcionColonia: proveedor.coloniaoEquivalente
          },
        
          idSolicitud: state.idSolicitud
        })),        
        gridTerceros_TIPERS_FAC: tercerosState.facturadorModel.map(facturador => ({
          idPersonaSolicitud: '',
          ideTipoTercero: 'TIPERS.FAC', // <-- FAC
          personaMoral: '1',
          booleanExtranjero: '0',
          booleanFisicaNoContribuyente: '0',
        
          denominacion: facturador.denominacionRazonSocial,
          razonSocial: facturador.denominacionRazonSocial,
          rfc: facturador.rfc,
          curp: facturador.curp || '',
        
          nombre: '',
          apellidoPaterno: '',
          apellidoMaterno: '',
          telefono: facturador.telefono,
          correoElectronico: facturador.CorreoElectronico,
        
          actividadProductiva: 'MANUFACTURA',
          actividadProductivaDesc: 'Fabricación de productos farmacéuticos',
          descripcionGiro: 'Laboratorio farmacéutico',
          numeroRegistro: 'REG-001-2024',
        
          domicilio: {
            calle: facturador.calle || 'Av. Industria No. 2000',
            numeroExterior: facturador.numeroExterior,
            numeroInterior: facturador.numeroInterior,
        
            pais: {
              clave: facturador.pais,
              nombre: 'México'
            },
        
            colonia: {
              clave: facturador.colonia,
              nombre: 'Industrial'
            },
        
            delegacionMunicipio: {
              clave: facturador.municipioOAlcaldia,
              nombre: 'Cuauhtémoc'
            },
        
            localidad: {
              clave: facturador.localidad,
              nombre: 'Ciudad de México'
            },
        
            entidadFederativa: {
              clave: facturador.entidadFederativa,
              nombre: 'Ciudad de México'
            },
        
            informacionExtra: facturador.estadoLocalidad,
            codigoPostal: facturador.codigoPostal,
            descripcionColonia: facturador.coloniaoEquivalente
          },
        
          idSolicitud: state.idSolicitud
        })),        
        pagoDeDerechos: {
          claveDeReferencia: pagoDerechos.setClaveDeReferncia,
          cadenaPagoDependencia: pagoDerechos.setCadenaDeLaDependencia,
          banco: {
            clave: pagoDerechos.setBanco?.id,
            descripcion: pagoDerechos.setBanco?.descripcion,
          },
          llaveDePago: pagoDerechos.setLlaveDePago,
          fecPago: pagoDerechos.setFechaDePago,
          impPago: pagoDerechos.setImporteDePago,
        },
      };
    }

    /**
     * Convierte un payload de la API al formato de estado de Akita.
     * 
     * Este método estático realiza la transformación inversa, tomando los datos
     * recibidos de la API de COFEPRIS y convirtiéndolos al formato de estado
     * interno utilizado por la aplicación.
     * 
     * La conversión incluye el mapeo de:
     * - Información personal del solicitante (RFC, nombre, apellidos, etc.)
     * - Datos de domicilio completo
     * - Configuración del trámite (tipo de operación, permisos, etc.)
     * - Información del establecimiento y responsable sanitario
     * - Datos de terceros relacionados
     * - Información de pago de derechos
     * - Clasificaciones y catálogos seleccionados
     * 
     * @param payload - Datos recibidos de la API en formato JSON
     * @returns Estado parcial formateado para Akita con las propiedades mapeadas
     */
    static fromApiPayload(payload: any): Partial<Solicitud260906State> {
        return {
            // Mapear los campos del payload al estado según sea necesario
            rfc: payload?.solicitante?.rfc,
            nombre: payload?.solicitante?.nombre,
            primerApellido: payload?.solicitante?.primerApellido,
            segundoApellido: payload?.solicitante?.segundoApellido,
            denominacionRazonSocial: payload?.solicitante?.denominacionRazonSocial,
            tipoPersona: payload?.solicitante?.tipoPersona,
            curp: payload?.solicitante?.curp,
            correoElectronico: payload?.solicitante?.correoElectronico,
            pais: payload?.solicitante?.domicilio?.pais,
            codigoPostaloEquivalente: payload?.solicitante?.domicilio?.codigoPostal,
            estadoLocalidad: payload?.solicitante?.domicilio?.estado,
            municipioAlcaldia: payload?.solicitante?.domicilio?.municipioAlcaldia,
            localidad: payload?.solicitante?.domicilio?.localidad,
            entidadFederativa: payload?.solicitante?.domicilio?.entidadFederativa,
            colonia: payload?.solicitante?.domicilio?.colonia,
            coloniaoEquivalente: payload?.solicitante?.domicilio?.coloniaoEquivalente,
            calle: payload?.solicitante?.domicilio?.calle,
            numeroExterior: payload?.solicitante?.domicilio?.numeroExterior,
            numeroInterior: payload?.solicitante?.domicilio?.numeroInterior,
            lada: payload?.solicitante?.domicilio?.lada,
            telefono: payload?.solicitante?.domicilio?.telefono,
            tipoOperacion: payload?.solicitud?.tipoOperacion,
            tipoOperacionJustificacion: payload?.solicitud?.tipoOperacionJustificacion,
            numeroPermiso: payload?.solicitud?.numeroPermiso,
            rfcResponsableSanitario: payload?.solicitud?.rfcResponsableSanitario,
            denominacion: payload?.solicitud?.denominacion,
            correo: payload?.solicitud?.correo,
            regimen: payload?.solicitud?.regimen,
            aduanasEntradas: payload?.solicitud?.aduanasEntradas,
            licenciaSanitaria: payload?.solicitud?.licenciaSanitaria,
            avisoCheckbox: payload?.solicitud?.avisoCheckbox,
            tiempoPrograma: payload?.solicitud?.tiempoPrograma,
            claveScianModal: payload?.solicitud?.claveScianModal,
            claveDescripcionModal: payload?.solicitud?.claveDescripcionModal,
            clasificacion: payload?.solicitud?.clasificacion,
            especificarClasificacionProducto: payload?.solicitud?.especificarClasificacionProducto,
            denominacionEspecifica: payload?.solicitud?.denominacionEspecifica,
            denominacionDistintiva: payload?.solicitud?.denominacionDistintiva,
            denominacionComun: payload?.solicitud?.denominacionComun,
            tipoDeProducto: payload?.solicitud?.tipoDeProducto,
            formaFarmaceutica: payload?.solicitud?.formaFarmaceutica,
            estadoFisico: payload?.solicitud?.estadoFisico,
            Fabricante: payload?.terceros?.fabricante,
            Destinatario: payload?.terceros?.destinatario,
            Proveedor: payload?.terceros?.proveedor,
            Facturador: payload?.terceros?.facturador,
            tercerosNacionalidad: payload?.terceros?.tercerosNacionalidad,
            referencia: payload?.pagoDerechos?.referencia,
            cadenaDependencia: payload?.pagoDerechos?.cadenaDependencia,
            banco: payload?.pagoDerechos?.banco,
            llave: payload?.pagoDerechos?.llave,
            tipoFetch: payload?.pagoDerechos?.tipoFetch,
            importe: payload?.pagoDerechos?.importe,
            selectedEstado: payload?.pagoDerechos?.selectedEstado,
            setClave: payload?.pagoDerechos?.clave,
            setDescripcion: payload?.pagoDerechos?.descripcion,
            setDespecificarClasificacion: payload?.pagoDerechos?.despecificarClasificacion
        };
    }
}