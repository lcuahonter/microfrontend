import { LicitacionResponse, LicitacionesResponse, ParticipanteLicitacion } from '../../models/solicitud.model';
import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
/**
 * Creacion del estado inicial para la interfaz de tramite 
 * @returns Solicitud120501
 */
export interface Solicitud120501State {
  /** Identificador de la asignación */
  idAsignacion: number;
  /** Identificador de la solicitud */
  idSolicitud: number;
  /** Identificador del mecanismo */
  idMecanismo: number;
  /** Entidad federativa */
  entidadFederativa: string;
  /** Representación federal */
  representacionFederal: string;
  /** Número de licitación */
  numeraDelicitacion: string;
  /** Fecha del evento de licitación */
  fechaDelEventoDelicitacion: string;
  /** Descripción del producto */
  descripcionDelProducto: string;
  /** Unidad tarifaria */
  unidadTarifaria: string;
  /** Régimen aduanero */
  regimenAduanero: string;
  /** Fracción arancelaria */
  fraccionArancelaria: string;
  /** Fecha de inicio de vigencia del cupo */
  fechaDeiniciodeVigenciadelCupo:string,
  /** Fecha de fin de vigencia del cupo */
  fechaDefindeVigenciadelCupo:string,
  /** Observaciones */
  obserVaciones:string,
  /** Bloque comercial */
  bloqueComercial:string,
  /** Países */
  paises:string,
  /** Monto adjudicado */
  montoadJudicado:string,
  /** Monto disponible */
  montoDisponible:string,
  /** Monto máximo */
  montoMaximo:string,
  /** RFC */
  rfc:string,
  /** Monto disponible del adquiriente */
  adquirienteMontoDisponible:string,
  /** Monto a recibir */
  montoRecibir:string,
  /** RFC1 */
  rfc1:string,
  /**
   * Identificador de la licitación
   */
  idLicitacion:number;
  /** Datos de licitaciones */
  licitacionesDatos:LicitacionesResponse
  /** Datos de tabla de licitaciones */
  licitacionTablaDatos: LicitacionResponse[];

  /**
   * Datos de participantes en la licitación
   */
  datosParticipantes: ParticipanteLicitacion[];
}
/**
 *  Crea el estado inicial para el store de tramite 120501.
 * @returns  Solicitud120501State - Estado inicial del store.
 */
export function createInitialState(): Solicitud120501State {
  return{
      idAsignacion:0,
      idSolicitud: 0,
      idMecanismo:0,
      entidadFederativa:'',
      representacionFederal:'',
      numeraDelicitacion: '',
      fechaDelEventoDelicitacion: '',
      descripcionDelProducto: '', 
      unidadTarifaria: '',
      regimenAduanero: '',
      fraccionArancelaria: '',
      fechaDeiniciodeVigenciadelCupo:'',
      fechaDefindeVigenciadelCupo:'',
      obserVaciones:'',
      bloqueComercial:'',
      paises:'',
      montoadJudicado:'',
      montoDisponible:'',
      montoMaximo:'',
      rfc:'',
      adquirienteMontoDisponible:'',
      montoRecibir:'',
      rfc1:'',
      idLicitacion:0,
      licitacionTablaDatos: [],
      datosParticipantes: [],
      licitacionesDatos:{
        idSolicitud: 0,
        fechaCreacion: "",
        fechaInicioTramite: "",
        fechaEstatus: "",
        fechaActualizacion: "",
        costo: 0,
        estadoSolicitud: "",
        cveRolCapturista: "",
        cveUsuarioCapturista: "",
        idPersonaSolicitante: 0,
        idPeticionWs: 0,
        blnDepuracionDocProcesada: false,
        certificadoSerialNumber: "",
        idTipoTramite: 0,
        cveUnidadAdministrativa: "",
        numeroFolioTramiteOriginal: "",
        esNuevo: false,
        certSerialNumber: "",
        certificado: "",
        idPersonaSolicitud: 0,
        solicitante: "",
        clave: "",
        unidadAdministrativaRepresentacionFederal: "",
        numFolioTramite: "",
        tramite: "",
        representanteLegalCapturistaGubernamental: "",
        discriminatorValue: "",
        documentosRequeridos: "",
        listaDocumentos: "",
        programaEconomia: "",
        fraccionesAnexoDos: "",
        fraccionesAnexoTres: "",
        tipoEmpresaRECIF: "",
        actividadEconomica: "",
        actividadProductiva: "",
        actividadProductivaProsec: "",
        ambito: "",
        numeroPermiso: "",
        nomOficialAutorizado: "",
        actividadEconomicaPreponderante: "",
        empresaControladora: "",
        mercanciaPatrimonio: "",
        cveRegimen: "",
        regimen: "",
        empresaMismoGrupo: "",
        tipoRegimen: "",
        tipoSolicitudPexim: "",
        tipoCaat: "",
        programaAutorizadoEconomia: "",
        descripcionOtroTipoDePropietarioAeronave: "",
        tratado: "",
        importeValorComercial: 0,
        fechaEmbarque: "",
        fechaArribo: "",
        fechaOperacion: "",
        idNormaOficial: 0,
        normaAplicable: "",
        claveTipoCertificado: "",
        booleanGenerico: false,
        claveAduana: "",
        ideGenerica1: "",
        registroAutomatizado: false,
        ideGenerica2: "",
        ideGenerica3: "",
        descripcion: "",
        descripcionClobGenerica1: "",
        descripcionClobGenerica2: "",
        descripcionSistemasMedicion: "",
        booleanIMMEX: false,
        periodoDictaminacion: "",
        motivo: "",
        numAutorizacion: "",
        domicilio: "",
        denominacionExposicion: "",
        descripcionGenerica2: "",
        fechaIniExposicion: "",
        fechaFinExposicion: "",
        consolidacionCargas: "",
        tipoTransito: "",
        tipoProgFomExp: "",
        idAsignacion: 0,
        observaciones: "",
        fechaPropuestaVisita: "",
        clavePais: "",
        tienePrioridad: false,
        numeroProgramaImmex: "",
        informacionConfidencial: "",
        clavePermisoSedena: "",
        numeroPermisoCNSNS: "",
        actividadEnDestino: "",
        locacion: "",
        idFraccionGob: 0,
        idFolioExternoOriginal: "",
        descripcionEspecificaciones: "",
        coordenadasGeograficas: "",
        justificacionTecnica: "",
        numeroRegistro: "",
        plazo: "",
        descripcionLugarEmbarque: "",
        establecimientoTIF: "",
        capacidadAlmacenamiento: "",
        licitacionPublica: {
            idLicitacion: 0,
            anio: 0,
            cantidadMaxima: 0,
            fechaLimiteCalificacion: "",
            fechaConcurso: "",
            fechaInicioVigencia: "",
            fechaFinVigencia: "",
            fundamento: "",
            ideTipoConstancia: "",
            ideTipoLicitacion: "",
            numeroLicitacion: "",
            idMecanismoAsignacion: 0,
            producto: '',
            unidadMedidaTarifaria: '',
            bloqueComercial: '',
            paises: '',
        },
        asignacion: "",
        participante: {
            idLicitacionPublica: 0,
            rfcParticipante:"" ,
            rfc: "",
            montoAdjudicado: 0,
            ganador: false,
            tipoParticipante: "",
            licitacionPublica: "",
            montoDisponible:0
        },
        montosCertificado: "",
        idLicitacion: 522,
        montoTransferir: 0,
        maximoTransferir: 0,
        fechaEncabezado:"" ,
        participantesLicitacion: [],
        fraccionArancelaria: [],
        tipoTramite: {
            vigencia: "",
            idTipoTramite: 120501,
            servicio: "",
            descripcionServicio: "",
            subservicio: "",
            descripcionSubservicio: "",
            modalidad: "",
            descripcionModalidad: "",
            flujo: "",
            descripcionFlujo: "",
            nivelServicio: "",
            nombreServicioAxway: "",
            nombreMensajeAxway: "",
            urlAxway: "",
            cveUnidadAdmResponsable: "",
            fechaCaptura: "",
            dependencia: "",
            declaraciones: "",
            documentos: "",
            nombre: "",
            blnReplicaInfo: false,
            blnAutomatico: false,
            claveModulo: 0,
            requiereVerificacion: "",
            asignado: "",
            suplencia: "",
            nivelRol: "",
            listTipoTramite: [],
            descripcionCorta: "",
            context: "",
            actionSSO: ""
        },
        entidadFederativa: ""
    }
  }
}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite120501', resettable: true })
/**
 * Store para el manejo del estado del trámite 120501.
 * Extiende la clase Store de Akita para gestionar el estado específico del trámite.
 */
export class Tramite120501Store extends Store<Solicitud120501State> {
  /**
   * Constructor del store.
   * Inicializa el store con el estado inicial definido por createInitialState().
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Actualiza el estado del store con los valores proporcionados.
   * Valores parciales para actualizar el estado.
   */
  public actualizarEstado(valores: Partial<Solicitud120501State>): void {
    this.update((state) => ({
      ...state,
      ...valores,
    }));
  }
  

  /**
   * Resetea el store a su estado inicial.
   * No recibe parámetros.
   * @return void
   */
  public resetearStore(): void {
    this.reset();
  }
}
