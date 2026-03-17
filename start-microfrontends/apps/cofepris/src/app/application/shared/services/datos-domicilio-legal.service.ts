import { CATALOGO_ESTADOS, CATALOGO_ESTADO_FISICO_MERCANCIA, CATALOGO_SCIAN, Catalogo} from '@libs/shared/data-access-user/src';
import { DatosDomicilioLegalState, DatosDomicilioLegalStore } from '../estados/stores/datos-domicilio-legal.store';
import { FraccionArancelaria, PermisoModel } from '../models/datos-domicilio-legal.model';
import { AvisocalidadStore} from '../estados/stores/aviso-calidad.store';
import { CATALOGO_ADUANAS, CATALOGO_PAISES, COMUN_URL, UNIDADES_MEDIDA_COMERCIAL } from '@libs/shared/data-access-user/src/core/servers/api-router';
import { CATALOGO_CLASIFICACION_TOXICOLOGICA, CATALOGO_OBJETO_IMPORTACION } from '../servers/api-route';
import {
  MercanciasTabla,
  RespuestaTabla,
} from '../components/domicilio-establecimiento/domicilio-establecimiento.component';
import { Observable, Subject } from 'rxjs';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/5701/base-response.model';
import { DatosDomicilioLegalQuery } from '../estados/queries/datos-domicilio-legal.query';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  TramitePagoBancoStore,
} from '../estados/stores/pago-banco.store';
import { TercerosFabricanteStore } from '../estados/stores/terceros-fabricante.store';
@Injectable({
  providedIn: 'root',
})
export class DatosDomicilioLegalService {

    /**
     * Subject utilizado para emitir y escuchar eventos personalizados dentro del servicio.
     * Puede ser suscrito para comunicación basada en eventos entre componentes o servicios.
     * @private
     */
    private eventSubject = new Subject();
    /**
     * Flujo observable que emite eventos desde el subject interno de eventos.
     * Suscríbete a este observable para escuchar notificaciones de eventos.
     */
    event$ = this.eventSubject.asObservable();

    /**
     * URL base del host para todas las consultas de catálogos.
     *
     * Esta propiedad almacena la URL base configurada desde las variables de entorno
     * y se utiliza como prefijo para construir todos los endpoints de los catálogos.
     *
     * @type {string}
     * @readonly
     * @since 1.0.0
     */
    host!: string;

  /**
   * Servicio para obtener datos de terceros relacionados y permisos.
   *
   * @param http - Instancia de HttpClient para realizar solicitudes HTTP.
   */
  constructor(public http: HttpClient,private query: DatosDomicilioLegalQuery, private datosDomicilioLegalStore: DatosDomicilioLegalStore,
    private avisocalidadStore: AvisocalidadStore,
    private tramitePagoBancoStore: TramitePagoBancoStore,
    private tercerosFabricanteStore: TercerosFabricanteStore,
    
  ) {
    this.host = `${COMUN_URL.BASE_URL}`;
  }

  /**
   * Obtiene los datos de selección desde un archivo JSON local.
   *
   * @returns Observable que emite un objeto Catalogo.
   */
  obtenerEstadoList(tramite: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_ESTADOS(tramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  estadoFisicoMercanciaCatalogo(tramite: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_ESTADO_FISICO_MERCANCIA(tramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene los datos de selección desde un archivo JSON local.
   *
   * @returns Observable que emite un objeto Catalogo.
   */
  getObtenerEstadoList(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(
      'assets/json/260512/clavescian.json'
    );
  }

  /**
   * Obtiene los datos de selección desde un archivo JSON local.
   * @returns Observable que emite un objeto Catalogo.
   */
  getClaveSvianList(tramite: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_SCIAN(tramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene los datos de selección desde un archivo JSON local.
   * @returns Observable que emite un objeto Catalogo.
   */
  getUMCList(tramite: string): Observable<BaseResponse<Catalogo[]>> { 
    const ENDPOINT = `${this.host}${UNIDADES_MEDIDA_COMERCIAL(tramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene los datos de selección desde un archivo JSON local.
   * @returns Observable que emite un objeto Catalogo.
   */
  getAduanasList(tramite: string): Observable<BaseResponse<Catalogo[]>> { 
    const ENDPOINT = `${this.host}${CATALOGO_ADUANAS(tramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene los datos de selección desde un archivo JSON local.
   * @returns Observable que emite un objeto Catalogo.
   */
  getClasificacionToxicologicaList(tramite: string): Observable<BaseResponse<Catalogo[]>> { 
    const ENDPOINT = `${this.host}${CATALOGO_CLASIFICACION_TOXICOLOGICA(tramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene los datos de selección desde un archivo JSON local.
   * @returns Observable que emite un objeto Catalogo.
   */
  getObjetoImportacionList(tramite: string): Observable<BaseResponse<Catalogo[]>> { 
    const ENDPOINT = `${this.host}${CATALOGO_OBJETO_IMPORTACION(tramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene los datos de selección desde un archivo JSON local.
   * @returns Observable que emite un objeto Catalogo.
   */
  getPaisesList(tramite: string): Observable<BaseResponse<Catalogo[]>> { 
    const ENDPOINT = `${this.host}${CATALOGO_PAISES(tramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene los datos de selección desde un archivo JSON local.
   *
   * @returns Observable que emite un objeto Catalogo.
   */
  getObtenerEstadoDescripcionList(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(
      'assets/json/260512/clavescian-descripcion.json'
    );
  }

  /**
   * Obtiene los datos de la tabla desde un archivo JSON local.
   *
   * @returns Observable que emite un objeto RespuestaTabla.
   */
  getObtenerTablaDatos(): Observable<RespuestaTabla> {
    return this.http.get<RespuestaTabla>('assets/json/260501/tablaDatos.json');
  }

  /**
   * Obtiene los datos de mercancías desde un archivo JSON local.
   *
   * @returns Observable que emite un objeto MercanciasTabla.
   */
  getObtenerMercanciasDatos(): Observable<MercanciasTabla> {
    return this.http.get<MercanciasTabla>(
      'assets/json/260501/mercanciasDatos.json'
    );
  }

  /**
   * Obtiene los datos de terceros relacionados desde un archivo JSON local.
   *
   * @returns Observable que emite un arreglo de objetos Catalogo.
   */
  getData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(
      'assets/json/260501/terceros-relacionados.json'
    );
  }

  /**
   * Obtiene los datos de permisos desde un archivo JSON local.
   * @returns Observable que emite un arreglo de objetos PermisoModel.
   */
  getTable(): Observable<PermisoModel[]> {
    return this.http.get<PermisoModel[]>('assets/json/260501/terceros.json');
  }

   /**
   * Obtiene el estado completo de DatosDomicilioLegal.
   * @returns Observable<DatosDomicilioLegalState>
   */
   getDatosDomicilioLegalState(): Observable<DatosDomicilioLegalState> {
    return this.query.selectSolicitud$;
  }
    /**
   * Método para actualizar el estado del formulario con los datos proporcionados.
   * @param DATOS - Objeto que contiene el estado del trámite.
   */
   actualizarEstadoFormulario(DATOS: any): void {
      this.datosDomicilioLegalStore.setClaveDeReferencia(DATOS.claveDeReferencia);
      this.datosDomicilioLegalStore.setCadenaDependencia(DATOS.cadenaDependencia);
      this.datosDomicilioLegalStore.setBanco(DATOS.banco);
      this.datosDomicilioLegalStore.setllaveDePago(DATOS.llaveDePago);
      this.datosDomicilioLegalStore.setFechaPago(DATOS.fechaPago);
      this.datosDomicilioLegalStore.setImportePago(DATOS.importePago);
      this.datosDomicilioLegalStore.setRfcDel(DATOS.rfcDel);
      this.datosDomicilioLegalStore.setDenominacion(DATOS.denominacion);
      this.datosDomicilioLegalStore.setCorreo(DATOS.correo);
      this.datosDomicilioLegalStore.setCodigoPostal(DATOS.establecimiento.domicilio.codigoPostal);
      this.datosDomicilioLegalStore.setEstado(DATOS.establecimiento.domicilio.entidadFederativa.clave);
      this.datosDomicilioLegalStore.setMuncipio(DATOS.establecimiento.domicilio.descripcionMunicipio);
      this.datosDomicilioLegalStore.setLocalidad(DATOS.establecimiento.domicilio.informacionExtra);
      this.datosDomicilioLegalStore.setColonia(DATOS.establecimiento.domicilio.descripcionColonia);
      this.datosDomicilioLegalStore.setCalle(DATOS.establecimiento.domicilio.calle);
      this.datosDomicilioLegalStore.setLada(DATOS.establecimiento.domicilio.lada);
      this.datosDomicilioLegalStore.setTelefono(DATOS.establecimiento.domicilio.telefono);
      this.datosDomicilioLegalStore.setClaveScianModal(DATOS.claveScianModal);
      this.datosDomicilioLegalStore.setClaveDescripcionModal(DATOS.claveDescripcionModal);
      if (typeof DATOS.avisoCheckbox === 'boolean') {this.datosDomicilioLegalStore.setAvisoCheckbox(DATOS.avisoCheckbox);}
      this.datosDomicilioLegalStore.setLicenciaSanitaria(DATOS.licenciaSanitaria);
      this.datosDomicilioLegalStore.setRegimen(DATOS.regimen);
      this.datosDomicilioLegalStore.setAduanasEntradas(DATOS.establecimiento.aduanas);
      this.datosDomicilioLegalStore.setNumeroPermiso(DATOS.numeroPermiso);
      this.datosDomicilioLegalStore.setClasificacion(DATOS.clasificacion);
      this.datosDomicilioLegalStore.setEspecificar(DATOS.especificar);
      this.datosDomicilioLegalStore.setDenominacionEspecifica(DATOS.denominacionEspecifica);
      this.datosDomicilioLegalStore.setDenominacionDistintiva(DATOS.denominacionDistintiva);
      this.datosDomicilioLegalStore.setDenominacionComun(DATOS.denominacionComun);
      this.datosDomicilioLegalStore.setTipoDeProducto(DATOS.tipoDeProducto);
      this.datosDomicilioLegalStore.setEstadoFisico(DATOS.estadoFisico);
      this.datosDomicilioLegalStore.setFraccionArancelaria(DATOS.fraccionArancelaria);
      this.datosDomicilioLegalStore.setDescripcionFraccion(DATOS.descripcionFraccion);
      this.datosDomicilioLegalStore.setCantidadUMT(DATOS.cantidadUMT);
      this.datosDomicilioLegalStore.setUMT(DATOS.UMT);
      this.datosDomicilioLegalStore.setCantidadUMC(DATOS.cantidadUMC);
      this.datosDomicilioLegalStore.setUMC(DATOS.UMC);
      this.datosDomicilioLegalStore.setPresentacion(DATOS.presentacion);
      this.datosDomicilioLegalStore.setNumeroRegistro(DATOS.numeroRegistro);
      this.datosDomicilioLegalStore.setFechaCaducidad(DATOS.fechaCaducidad);
      this.datosDomicilioLegalStore.setCumplimiento(DATOS.cumplimiento);
      this.datosDomicilioLegalStore.setMensaje(DATOS.mensaje);
      this.datosDomicilioLegalStore.setRfc(DATOS.representanteLegal.rfc);
      this.datosDomicilioLegalStore.setNombre(DATOS.representanteLegal.nombre);
      this.datosDomicilioLegalStore.setApellidoPaterno(DATOS.representanteLegal.apellidoPaterno);
      this.datosDomicilioLegalStore.setApellidoMaterno(DATOS.representanteLegal.apellidoMaterno);
      if (Array.isArray(DATOS.establecimiento.aduanas)) {this.datosDomicilioLegalStore.setPaisDeOriginDatos(DATOS.establecimiento.aduanas);}
      this.datosDomicilioLegalStore.setGarantiasOfrecidas(DATOS.garantiasOfrecidas);
       this.datosDomicilioLegalStore.setMensaje(DATOS.mensaje);
       this.datosDomicilioLegalStore.setCumplimiento("Si")
       this.avisocalidadStore.setDenominacionRazonSocial(DATOS.establecimiento.razonSocial);
       this.avisocalidadStore.setRfcDel(DATOS.establecimiento.RFCResponsableSanitario);
       this.avisocalidadStore.setCorreoElectronico(DATOS.establecimiento.correoElectronico);
       this.tramitePagoBancoStore.setClaveDeReferencia(DATOS.pagoDeDerechos.claveDeReferencia);
       this.tramitePagoBancoStore.setCadenaDependencia(DATOS.pagoDeDerechos.cadenaPagoDependencia);
       this.tramitePagoBancoStore.setllaveDePago(DATOS.pagoDeDerechos.llaveDePago);
       this.tramitePagoBancoStore.setBanco(DATOS.pagoDeDerechos.banco.clave);
       this.tramitePagoBancoStore.setImportePago(DATOS.pagoDeDerechos.impPago);
       this.tramitePagoBancoStore.setFechaPago(DATOS.pagoDeDerechos.fecPago);
       if (typeof DATOS.solicitud.declaracionesSeleccionadas === 'boolean') {this.datosDomicilioLegalStore.setAvisoCheckbox(DATOS.solicitud.declaracionesSeleccionadas);}
        this.datosDomicilioLegalStore.setCumplimiento(
        DATOS.establecimiento.informacionConfidencial ? "Si" : "No"
        ); 
        const datosSCIANArray = DATOS?.datosSCIAN?.map?.((item: any) => ({
          clave_Scian: item?.cveScian ?? '',
          descripcion_Scian: item?.descripcion ?? ''
        })) ?? [];
        this.datosDomicilioLegalStore.setNicoTabla(datosSCIANArray);
        const fabricanteFilas = this.mapFabricanteFilas(DATOS.gridTerceros_TIPERS_FAB)
        this.tercerosFabricanteStore.setFabricante(fabricanteFilas);
        const formuladorFilas = this.mapFabricanteFilas(DATOS.gridTerceros_TIPERS_FAC)
        this.tercerosFabricanteStore.setFormulador(formuladorFilas);
        const proveedorFilas = this.mapFabricanteFilas(DATOS.gridTerceros_TIPERS_PVD)
        this.tercerosFabricanteStore.setProveedor(proveedorFilas);
        this.datosDomicilioLegalStore.setMercanciasTabla(this.mapMercanciasArray(DATOS.mercancias));

  }

    /**
     * Transforma un arreglo de objetos de terceros en un formato adecuado para mostrar en una tabla.
     *
     * Cada objeto del arreglo de entrada se mapea a un objeto con la propiedad 'tbodyData',
     * que contiene los datos relevantes del tercero, usando '---' como valor por defecto si falta algún dato.
     *
     * @param gridTerceros - Arreglo de objetos que representan a los terceros (fabricantes, formuladores o proveedores).
     * @returns Un nuevo arreglo de objetos, cada uno con la propiedad 'tbodyData' lista para ser usada en la tabla.
     */

    /**
     * Mapea el arreglo de mercancías a la estructura requerida para la tabla.
     * @param mercancias - Arreglo de mercancías de entrada
     * @returns Arreglo mapeado para la tabla de mercancías
     */
    private mapMercanciasArray(mercancias: any[]): any[] {
      return (mercancias || []).map((item: any) => ({
        cantidadUMC: item.cantidadUMCConComas,
        cantidadUMT: item.cantidadUMTConComas,
        clasificacionToxicologica: "5",
        clasificacionToxicologicaClave: "35",
        descripcionFraccion: "",
        estadoFisico: "",
        estadoFisicoClave: "",
        estadoFisicoOtro: "",
        fraccionArancelaria: item.fraccionArancelaria.clave,
        nombreCientifico: "Nombre químico o científico UNC",
        nombreComercial: "Nombre comercial UNC",
        nombreComun: "Nombre común UNC",
        numeroCas: "",
        numeroRegistro: item.registroSanitarioConComas,
        numeroRegistroSanitario: item.registroSanitarioConComas,
        objetoImportacion: "Otro",
        objetoImportacionClave: "OBIM.OTR",
        objetoImportacionOtro: null,
        paisDeOriginDatosObj: [],
        paisDeProcedenciaDatos: [
          "ARUBA (TERRITORIO HOLANDES DE ULTRAMAR)",
          "AUSTRALIA (COMUNIDAD DE)",
          "AUSTRIA (REPUBLICA DE)"
        ],
        paisDeProcedenciaDatosObj: [{}, {}, {}],
        paisElaboracion: [
          "ALEMANIA (REPUBLICA FEDERAL DE)",
          "ANDORRA (PRINCIPADO DE)",
          "ANGOLA (REPUBLICA DE)",
          "ANGUILA"
        ],
        paisElaboracionProducto: [
          "ALEMANIA (REPUBLICA FEDERAL DE)",
          "ANDORRA (PRINCIPADO DE)",
          "ANGOLA (REPUBLICA DE)",
          "ANGUILA"
        ],
        paisFabrica: [
          "ANTILLAS NEERLANDESAS (TERRITORIO HOLANDES DE ULTRAMAR)",
          "ARABIA SAUDITA (REINO DE)",
          "ARGELIA (REPUBLICA DEMOCRATICA Y POPULAR DE)",
          "ARGENTINA (REPUBLICA)"
        ],
        paisOrigen: [
          "ANTILLAS NEERLANDESAS (TERRITORIO HOLANDES DE ULTRAMAR)",
          "ARABIA SAUDITA (REINO DE)",
          "ARGELIA (REPUBLICA DEMOCRATICA Y POPULAR DE)"
        ],
        paisProcedenciaUltimoPuerto: [
          "ARUBA (TERRITORIO HOLANDES DE ULTRAMAR)",
          "AUSTRALIA (COMUNIDAD DE)",
          "AUSTRIA (REPUBLICA DE)"
        ],
        paisProduccionIngredienteActivo: [
          "ANTILLAS NEERLANDESAS (TERRITORIO HOLANDES DE ULTRAMAR)",
          "ARABIA SAUDITA (REINO DE)",
          "ARGELIA (REPUBLICA DEMOCRATICA Y POPULAR DE)",
          "ARGENTINA (REPUBLICA)"
        ],
        paisProveedor: [
          "ANTILLAS NEERLANDESAS (TERRITORIO HOLANDES DE ULTRAMAR)",
          "ARABIA SAUDITA (REINO DE)",
          "ARGELIA (REPUBLICA DEMOCRATICA Y POPULAR DE)"
        ],
        porcentajeConcentracion: "Porcentaje de concentración",
        umc: item.unidadMedidaComercial.descripcion,
        umcClave: "105",
        unidadMedidaTarifa: "",
        usoEspecifico: item.nombreCortoUsoEspecifico,
        cantidadUmt: item.cantidadUMTConComas,
        cantidadUmcts: "",
        cantidadUmc: item.cantidadUMCConComas
      }));
    }

    /**
     * Transforma un arreglo de objetos de terceros en un formato adecuado para mostrar en una tabla.
     * Cada objeto del arreglo de entrada se mapea a un objeto con la propiedad 'tbodyData',
     * que contiene los datos relevantes del tercero, usando '---' como valor por defecto si falta algún dato.
     * @param gridTerceros - Arreglo de objetos que representan a los terceros (fabricantes, formuladores o proveedores).
     * @returns Un nuevo arreglo de objetos, cada uno con la propiedad 'tbodyData' lista para ser usada en la tabla.
     */
    private mapFabricanteFilas(gridTerceros: any[]): any[] {
      if (!Array.isArray(gridTerceros)) return [];
      return gridTerceros.map((baseDATOS: any) => ({
        tbodyData: [
          baseDATOS.denominacion ? baseDATOS.razonSocial : baseDATOS.nombre,
          baseDATOS.rfc ?? '---',
          baseDATOS.curp ?? '---',
          baseDATOS.telefono ?? '---',
          baseDATOS.correoElectronico ?? '---',
          baseDATOS.domicilio?.calle ?? '---',
          baseDATOS.domicilio?.numeroExterior ?? '---',
          baseDATOS.domicilio?.numeroInterior ?? '---',
          baseDATOS.domicilio?.pais?.clave ?? '---',
          baseDATOS.domicilio?.colonia?.clave ?? '---',
          baseDATOS.domicilio?.delegacionMunicipio?.clave ?? '---',
          baseDATOS.domicilio?.localidad?.clave ?? '---',
          baseDATOS.domicilio?.entidadFederativa?.clave ?? '---',
          baseDATOS.domicilio?.informacionExtra ?? '---',
          baseDATOS.domicilio?.codigoPostal ?? '---',
        ],
      }));
    }
  /**
   * Método para obtener los datos del registro de toma de muestras de mercancías.
   * @returns Observable que emite el estado del trámite.
   */
  getRegistroTomaMuestrasMercanciasData(): Observable<DatosDomicilioLegalState> {
    return this.http.get<DatosDomicilioLegalState>('assets/json/260501/registro_toma_muestras_mercancias_prefill.json');
  }

  /**
     * Obtiene los datos de la tabla desde un archivo JSON local.
     *
     * @returns Observable que emite un objeto RespuestaTabla.
     */
    getObtenerScianTablaDatos(): Observable<RespuestaTabla> {
      return this.http.get<RespuestaTabla>('assets/json/cofepris/clave-scian.json');
    }
  
    /**
     * Obtiene los datos de mercancías desde un archivo JSON local.
     *
     * @returns Observable que emite un objeto MercanciasTabla.
     */
    getObtenerDataMercanciasDatos(): Observable<MercanciasTabla> {
      return this.http.get<MercanciasTabla>(
        'assets/json/cofepris/mercancias-tabla.json'
      );
    }
    /**
     * Obtiene los datos de la fracción arancelaria desde un archivo JSON local.
     *
     * @returns Observable que emite un objeto FraccionArancelaria.
     */
    getFraccionArancelaria():Observable<FraccionArancelaria>{
      return this.http.get<FraccionArancelaria>('assets/json/cofepris/fraccion-arancelaria.json');
    }

  /**
   * Emite un evento booleano a los suscriptores a través de eventSubject.
   *
   * @param datos - El valor booleano que se emitirá a los observadores.
   */
  emitEvent(datos: boolean): void {
    this.eventSubject.next(datos);
  }
}
