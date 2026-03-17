import { Catalogo, JSONResponse } from '@libs/shared/data-access-user/src';
import { Solicitud120603State, Solicitud120603Store } from '../estados/tramite120603.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PROC_120603 } from '../servers/api.route';
import { Solicitud120603Query } from '../estados/tramite120603.query';

@Injectable({
  providedIn: 'root'
})
export class RegistroComoEmpresaService {
    /**
     * Helper to build and filter a block, including only non-empty fields.
     */
    private buildFilteredBlock(raw: Record<string, unknown>): Record<string, unknown> {
      const BLOCK: Record<string, unknown> = {};
      for (const KEY of Object.keys(raw)) {
        const VAL = raw[KEY];
        if (VAL !== undefined && VAL !== null && (!(typeof VAL === 'string') || VAL.trim() !== '')) {
          BLOCK[KEY] = VAL;
        }
      }
      return BLOCK;
    }

    /**
     * Helper to build and filter a domicilio block, including only non-empty fields.
     */
    private buildFilteredDomicilio(raw: unknown): Record<string, unknown> | undefined {
      if (typeof raw !== 'object' || raw === null) {
        return undefined;
      }
      const DOM_RAW = raw as Record<string, unknown>;
      const DOM_BLOCK: Record<string, unknown> = {};
      for (const KEY of Object.keys(DOM_RAW)) {
        const VAL = DOM_RAW[KEY];
        if (VAL !== undefined && VAL !== null && (!(typeof VAL === 'string') || VAL.trim() !== '')) {
          DOM_BLOCK[KEY] = VAL;
        }
      }
      return Object.keys(DOM_BLOCK).length > 0 ? DOM_BLOCK : undefined;
    }
  /**
   * Filtra solo los campos requeridos y visibles de un objeto fuente.
   * @param SOURCE Objeto fuente del cual filtrar los campos.
   * @param REQUIRED Lista de campos requeridos con sus etiquetas.
   * @returns Un objeto con solo los campos requeridos y visibles.
   */
  private filterRequiredFields<T extends Record<string, unknown>>(
    SOURCE: T,
    REQUIRED: { key: string; label: string }[]
  ): Record<string, unknown> {
    const RESULT: Record<string, unknown> = {};
    for (const CAMPO_REQUIRED of REQUIRED) {
      const VAL = SOURCE[CAMPO_REQUIRED.key];
      if (VAL !== undefined && VAL !== null && (!(typeof VAL === 'string') || (VAL as string).trim() !== '')) {
        RESULT[CAMPO_REQUIRED.key] = VAL;
      }
    }
    return RESULT;
  }


  /**
   * Construye el bloque 'solicitante' incluyendo solo los campos visibles y requeridos.
   * @param item Estado de la solicitud.
   * @param solicitanteRequired Lista de campos requeridos para el solicitante.
   * @returns Objeto 'solicitante' con los campos filtrados.
   */
  private buildSolicitanteBlock(item: Solicitud120603State, solicitanteRequired: { key: string, label: string }[]): Record<string, unknown> {
    const SOLICITANTE_FIELDS = this.buildSolicitanteFields(item);
    const SOLICITANTE: Record<string, unknown> = {};
    for (const CAMPO_REQUIRED of solicitanteRequired) {
      const VAL = SOLICITANTE_FIELDS[CAMPO_REQUIRED.key];
      SOLICITANTE[CAMPO_REQUIRED.key] = (VAL !== undefined && VAL !== null) ? VAL : '';
    }
    // dirección: incluya todos los campos obligatorios, usar null para campos vacíos
    const DOMICILIO_FIELDS = this.buildSolicitanteDomicilio(item);
    const DOMICILIO: Record<string, unknown> = {};
    for (const DOM_KEY of Object.keys(DOMICILIO_FIELDS)) {
      const DOM_VALUE = DOMICILIO_FIELDS[DOM_KEY];
      DOMICILIO[DOM_KEY] = (DOM_VALUE !== undefined && DOM_VALUE !== null && DOM_VALUE !== '') ? DOM_VALUE : null;
    }
    SOLICITANTE['domicilio'] = DOMICILIO;
    return SOLICITANTE;
  }

  /**
   * Construye el bloque 'ubicacionMercancia' incluyendo solo los campos no vacíos.
   * @param item Estado de la solicitud.
   * @returns Objeto 'ubicacionMercancia' con los campos filtrados o undefined si no hay campos válidos.
   */
  private buildUbicacionMercanciaBlock(item: Solicitud120603State): Record<string, unknown> | undefined {
    const UBICACION = this.buildUbicacionMercancia120603(item)['ubicacionMercancia'] as Record<string, unknown>;
    if (UBICACION && typeof UBICACION === 'object' && UBICACION['domicilio']) {
      const UBIC_DOM = UBICACION['domicilio'] as Record<string, unknown>;
      // Lista de todas las claves de domicilio requeridas por el backend
      const REQUIRED_KEYS = [
        'cvePais', 'cveColonia', 'cveEntidad', 'nombrePais', 'nombreColonia', 'nombreDelegMun',
        'calle', 'numeroExterior', 'numeroInterior', 'codigoPostal', 'lada', 'telefono'
      ];
      const UBIC_DOM_COMPLETE: Record<string, unknown> = {};
      for (const KEY of REQUIRED_KEYS) {
        const VALUE = UBIC_DOM[KEY];
        UBIC_DOM_COMPLETE[KEY] = (VALUE !== undefined && VALUE !== null && VALUE !== '') ? VALUE : null;
      }
      return { ...UBICACION, domicilio: UBIC_DOM_COMPLETE };
    }
    return undefined;
  }

  /**
   * Constructor del servicio RegistroComoEmpresaService.
   * @param http - Cliente HTTP para realizar solicitudes.
   * @param solicitud120603Store - Store para manejar el estado de la solicitud 120603.
   */
  constructor(private http: HttpClient, private solicitud120603Store: Solicitud120603Store, private tramite120603Query: Solicitud120603Query) { }
  /**
   * Actualiza el estado del formulario con los datos proporcionados.
   * @param DATOS - Datos de tipo Solicitud120603State que se utilizarán para actualizar el estado del formulario.
   */
  actualizarEstadoFormulario(DATOS: Solicitud120603State): void {
    this.solicitud120603Store.setEstado(DATOS.estado);
    this.solicitud120603Store.setRepresentacionFederal(DATOS.representacionFederal);
    this.solicitud120603Store.setTipoEmpresa(DATOS.tipoEmpresa);
    this.solicitud120603Store.setEspecifique(DATOS.apellidoPaterno);
    this.solicitud120603Store.setActividadEconomicaPreponderante(DATOS.actividadEconomicaPreponderante);
    this.solicitud120603Store.setDescripcion(DATOS.descripcion);
    this.solicitud120603Store.setCodigoPostal(DATOS.codigoPostal);
    this.solicitud120603Store.setEstadoDomicilio(DATOS.estadoDomicilio);
    this.solicitud120603Store.setMunicipioAlcaldia(DATOS.municipioAlcaldia);
    this.solicitud120603Store.setLocalidad(DATOS.localidad);
    this.solicitud120603Store.setColonia(DATOS.colonia);
    this.solicitud120603Store.setCalle(DATOS.calle);
    this.solicitud120603Store.setNumeroExterior(DATOS.numeroExterior);
    this.solicitud120603Store.setNumeroInterior(DATOS.numeroInterior);
    this.solicitud120603Store.setLada(DATOS.lada);
    this.solicitud120603Store.setTelefono(DATOS.telefono);
    this.solicitud120603Store.setNacionalidad(DATOS.nacionalidad);
    this.solicitud120603Store.setTipoDePersona(DATOS.tipoDePersona);
    this.solicitud120603Store.setTaxId(DATOS.taxId);
    this.solicitud120603Store.setRazonSocial(DATOS.razonSocial);
    this.solicitud120603Store.setDatosPais(DATOS.datosPais);
    this.solicitud120603Store.setDatosCodigoPostal(DATOS.datosCodigoPostal);
    this.solicitud120603Store.setDatosEstado(DATOS.datosEstado);
    this.solicitud120603Store.setCorreoElectronico(DATOS.correoElectronico);
    this.solicitud120603Store.setRegistroFederal(DATOS.registroFederal);
    this.solicitud120603Store.setNombre(DATOS.nombre);
    this.solicitud120603Store.setApellidoPaterno(DATOS.apellidoPaterno);
  }

  /**
   * Obtiene los datos de la consulta desde un archivo JSON local.
   * @returns Un Observable que emite un objeto de tipo Solicitud120603State.
   */
  getConsultaData(): Observable<Solicitud120603State> {
    return this.http.get<Solicitud120603State>('assets/json/120603/consulta.json');
  }

  /**
   * Obtiene los datos del estado desde un archivo JSON local.
   * @returns Un Observable que emite una lista de objetos de tipo Catalogo.
   */
  getEstadoData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('./assets/json/120603/estado.json');
  }

  /**
   * Obtiene los datos de representación federal desde un archivo JSON local.
   * @returns Un Observable que emite una lista de objetos de tipo Catalogo.
   */
  getRepresentacionFederalData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('./assets/json/120603/representacionfederal.json');
  }

  /**
   * Obtiene los datos de socios y accionistas desde un archivo JSON local.
   * @returns Un Observable que emite una lista de objetos de tipo Catalogo.
   */
  getSociosYAaccionistasData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('./assets/json/120603/sociosYAccionistasData.json');
  }

  /**
   * Obtiene los datos de socios y accionistas extranjeros desde un archivo JSON local.
   * @returns Un Observable que emite una lista de objetos de tipo Catalogo.
   */
  getSociosYAccionistasExtranjerosData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('./assets/json/120603/sociosYAccionistasExtranjerosData.json');
  }

  /**
   * Obtiene los datos de países desde un archivo JSON local.
   * @returns Un Observable que emite una lista de objetos de tipo Catalogo.
   */
  getPaisData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('./assets/json/120603/paisData.json');
  }

  /**
   * Obtiene los datos de sucursales desde un archivo JSON local.
   * @returns Un Observable que emite una lista de objetos de tipo Catalogo.
   */
  getSucursalData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('./assets/json/120603/seleccionDeSucursal.json');
  }
  /**
   * Obtiene la lista de plantas de un estado específico usando su ID.
   * Retorna un Observable con los datos obtenidos del servicio HTTP.
   */
  obtenerPlantas(body: Record<string, unknown>): Observable<JSONResponse> {
    return this.http.post<JSONResponse>(PROC_120603.PLANTAS, body);

  }
  /**
    * Obtiene todos los datos del estado almacenado en el store.
    * @returns {Observable<Solicitud120603State>} Observable con todos los datos del estado.
    */
  getAllState(): Observable<Solicitud120603State> {
    return this.tramite120603Query.selectSolicitud$;
  }
  
  obtenerAccionistas(rfcSolicitante: string): Observable<Record<string, unknown>> {
    const URL = `${PROC_120603.OBTENER_ACCIONSTAS}/${rfcSolicitante}`;
    return this.http.get<Record<string, unknown>>(URL);
  }

  obtenerAccionistasExtranjeros(rfcSolicitante: string): Observable<unknown> {
    const URL = `${PROC_120603.OBTENER_ACCIONSTAS_EXTRANJEROS}/${rfcSolicitante}`;
    return this.http.get<unknown>(URL);
  }
  /**
   * Envía los datos proporcionados mediante una solicitud HTTP POST a la ruta especificada.
   * 
   * @param body - Objeto que contiene los datos a enviar en el cuerpo de la solicitud.
   * @returns Observable con la respuesta de la solicitud POST.
   */
  guardarDatosPost(body: Record<string, unknown>): Observable<JSONResponse> {
      if (!body['tipoDeSolicitud'] || !body['cveRolCapturista'] || !body['discriminatorValue']) {
        console.warn('Missing required fields in payload:', {
          tipoDeSolicitud: body['tipoDeSolicitud'],
          cveRolCapturista: body['cveRolCapturista'], 
          discriminatorValue: body['discriminatorValue']
        });
      }
      
      const RESULT = this.http.post<JSONResponse>(PROC_120603.GUARDAR, body);
      return RESULT;
  }
  /**
   * 
   * @param body - Objeto que contiene los datos para buscar mercancías.
   * @returns 
   */
  buscarActividadesEconomicas(body: Record<string, unknown>): Observable<JSONResponse> {
    return this.http.post<JSONResponse>(PROC_120603.BUSCAR_ACTIVIDADES_ECONOMICAS, body);
  }

  elminarAccionista(idPersona: string | number): Observable<JSONResponse> {
    return this.http.post<JSONResponse>(
      `${PROC_120603.ELIMINAR_ACCIONISTA}/${idPersona}`,
      null
    );
  }
  obtenerDatosAccionistaExtranjero(body: Record<string, unknown>): Observable<JSONResponse> {
    return this.http.post<JSONResponse>(PROC_120603.OBTENER_DATOS_ACCIONISTA_EXTRANJERO_POST, body);
  }

  obtenerDatosAccionista(body: Record<string, unknown>): Observable<JSONResponse> {
    return this.http.post<JSONResponse>(PROC_120603.OBTENER_DATOS_ACCIONISTA_POST, body);
  }

  buildGuardarSolicitud120603(item: Solicitud120603State): Record<string, unknown> {
  return {
    tipoDeSolicitud: 'guardar',
    cveRolCapturista: "PersonaMoral",
    discriminatorValue: '120603',
    idSolicitud: item.id_solicitud || null,
    cveUnidadAdministrativa: item.representacionFederal || null,
    entFedCveEntidad: item.estado || null,
    costoTotal: null,
    certificadoSerialNumber: null,
    numeroFolioTramiteOriginal: null,
    tipoEmpresaRECIFClave: item.tipoEmpresa || null,
    actividadEconomicaClave: (item.actividadEconomicaPreponderante && item.actividadEconomicaPreponderante !== 'POR_DEFECTO_ACTIVIDAD') ? item.actividadEconomicaPreponderante : null,
    unidadAdministrativaRepresentacionFederalClave: item.representacionFederal || null,
  };
  }
buildUbicacionMercancia120603(item:Solicitud120603State): Record<string, unknown> {
  const DOMICILIO_FORM = item.domicilioDisabledForm || {};
  return {
    ubicacionMercancia: {
      domicilio: {
        cvePais: this.getFieldWithFallbacks(DOMICILIO_FORM, 'cvepais', item, 'datosPais'),
        cveColonia: this.getFieldWithFallbacks(DOMICILIO_FORM, 'cveColonia', item, 'colonia'),
        cveEntidad: this.getFieldWithFallbacks(DOMICILIO_FORM, 'cveEntidad', item, 'estadoDomicilio', 'datosEstado'),
        nombrePais: this.getFieldWithFallbacks(DOMICILIO_FORM, 'pais', item, 'datosPais'),
        nombreColonia: this.getFieldWithFallbacks(DOMICILIO_FORM, 'colonia', item, 'colonia'),
        nombreDelegMun: this.getFieldWithFallbacks(DOMICILIO_FORM, 'municipioAlcaldia', item, 'municipioAlcaldia'),
        calle: this.getFieldWithFallbacks(DOMICILIO_FORM, 'calle', item, 'calle'),
        numeroExterior: this.getFieldWithFallbacks(DOMICILIO_FORM, 'numeroExterior', item, 'numeroExterior'),
        numeroInterior: this.getFieldWithFallbacks(DOMICILIO_FORM, 'numeroInterior', item, 'numeroInterior'),
        codigoPostal: this.getFieldWithFallbacks(DOMICILIO_FORM, 'codigoPostal', item, 'codigoPostal', 'datosCodigoPostal'),
      }
    }
  };
}
buildPersona120603(_item: Solicitud120603State): Record<string, unknown> {
  return {
    persona: {
      ideTipoPersona: 'TIPER.MR',
    }
  };
}
  /**
   * Construye los campos básicos del solicitante.
   * @param item Estado de la solicitud.
   * @returns Objeto con los campos básicos del solicitante.
   */
  private buildSolicitanteFields(item: Solicitud120603State): Record<string, unknown> {
    return {
      rfc: item.taxId || item.registroFederal || '',
      nombre: item.nombre || '',
      actividad_economica: item.descripcion || '',
      correo_electronico: item.correoElectronico || '',
      razonSocial: item.razonSocial || ''
    };
  }

  /**
   * Obtiene el valor de un campo con posibles valores alternativos.
   * @param domicilioForm Objeto con los datos del formulario de domicilio.
   * @param formKey Clave principal a buscar en el formulario.
   * @param item Estado de la solicitud.
   * @param itemKey1 Clave alternativa 1 en el estado.
   * @param itemKey2 Clave alternativa 2 en el estado.
   * @returns Valor encontrado o null si no existe.
   */
  private getFieldWithFallbacks(domicilioForm: Record<string, unknown>, formKey: string, item: Solicitud120603State, itemKey1?: string, itemKey2?: string): string | null {
    const FIELD_VALUE = domicilioForm[formKey];
    if (typeof FIELD_VALUE === 'string') {
      return FIELD_VALUE;
    }
    const FALLBACK1 = itemKey1 ? item[itemKey1 as keyof Solicitud120603State] : null;
    if (typeof FALLBACK1 === 'string') {
      return FALLBACK1;
    }
    const FALLBACK2 = itemKey2 ? item[itemKey2 as keyof Solicitud120603State] : null;
    if (typeof FALLBACK2 === 'string') {
      return FALLBACK2;
    }
    return null;
  }

  /**
   * Construye el objeto 'domicilio' para el solicitante.
   * @param item Estado de la solicitud.
   * @returns Objeto 'domicilio' con los campos correspondientes.
   */
  private buildSolicitanteDomicilio(item: Solicitud120603State): Record<string, unknown> {
    const DOMICILIO_FORM = item.domicilioDisabledForm || {};
    return {
      pais: this.getFieldWithFallbacks(DOMICILIO_FORM, 'pais', item, 'datosPais') ?? '',
      codigoPostal: this.getFieldWithFallbacks(DOMICILIO_FORM, 'codigoPostal', item, 'codigoPostal', 'datosCodigoPostal') ?? '',
      estado: this.getFieldWithFallbacks(DOMICILIO_FORM, 'estadoDomicilio', item, 'estadoDomicilio', 'datosEstado') ?? '',
      delegacionMunicipio: this.getFieldWithFallbacks(DOMICILIO_FORM, 'municipioAlcaldia', item, 'municipioAlcaldia') ?? '',
      localidad: this.getFieldWithFallbacks(DOMICILIO_FORM, 'localidad', item, 'localidad') ?? '',
      colonia: this.getFieldWithFallbacks(DOMICILIO_FORM, 'colonia', item, 'colonia') ?? '',
      calle: this.getFieldWithFallbacks(DOMICILIO_FORM, 'calle', item, 'calle') ?? '',
      numeroExterior: this.getFieldWithFallbacks(DOMICILIO_FORM, 'numeroExterior', item, 'numeroExterior') ?? '',
      numeroInterior: this.getFieldWithFallbacks(DOMICILIO_FORM, 'numeroInterior', item, 'numeroInterior') ?? '',
      lada: this.getFieldWithFallbacks(DOMICILIO_FORM, 'lada', item, 'lada') ?? '',
      telefono: this.getFieldWithFallbacks(DOMICILIO_FORM, 'telefono', item, 'telefono') ?? ''
    };
  }

  buildSolicitante120603(item: Solicitud120603State): Record<string, unknown> {
    return {
      solicitante: {
        ...this.buildSolicitanteFields(item),
        domicilio: this.buildSolicitanteDomicilio(item)
      }
    };
  }
  buildPayload120603(item: Solicitud120603State): Record<string, unknown> {
    const CAMPO_REQUIREDS = [
      { key: 'tipoDeSolicitud', label: 'Tipo de Solicitud' },
      { key: 'cveRolCapturista', label: 'Rol Capturista' },
      { key: 'discriminatorValue', label: 'Discriminator' },
      { key: 'cveUnidadAdministrativa', label: 'Unidad Administrativa' },
      { key: 'entFedCveEntidad', label: 'Entidad Federativa' },
      { key: 'tipoEmpresaRECIFClave', label: 'Tipo de Empresa' },
      { key: 'actividadEconomicaClave', label: 'Actividad Económica' },
      { key: 'unidadAdministrativaRepresentacionFederalClave', label: 'Unidad Administrativa Federal' },
    ];

    const NACIONALIDAD = item.nacionalidad;
    const TIPO_PERSONA = item.tipoDePersona;
    let SOLICITANTE_REQUERIDO: { key: string, label: string }[] = [
      { key: 'rfc', label: 'RFC' }
    ];
    if (NACIONALIDAD === 'SI') {
      // Sólo se requiere RFC para mexicanos
    } else if (NACIONALIDAD === 'NO' && TIPO_PERSONA === 'MORAL') {
      SOLICITANTE_REQUERIDO = [
        { key: 'rfc', label: 'RFC' },
        { key: 'razonSocial', label: 'Razón social' },
        { key: 'correo_electronico', label: 'Correo electrónico' }
      ];
    } else if (NACIONALIDAD === 'NO' && TIPO_PERSONA === 'FISICA') {
      SOLICITANTE_REQUERIDO = [
        { key: 'rfc', label: 'RFC' },
        { key: 'nombre', label: 'Nombre' },
        { key: 'correo_electronico', label: 'Correo electrónico' }
      ];
    }
    // Incluir todos los campos del objeto base (incluyendo nulls)
    const BASE = this.buildGuardarSolicitud120603(item);
    const PAYLOAD: Record<string, unknown> = { ...BASE };
    
    // Asegurar que los campos requeridos no estén vacíos
    for (const CAMPO_REQUIRED of CAMPO_REQUIREDS) {
      if (!PAYLOAD[CAMPO_REQUIRED.key]) {
        PAYLOAD[CAMPO_REQUIRED.key] = '';
      }
    }
    // Bloque de persona (siempre incluido, todos los campos requeridos)
    const PERSONA_BLOCK = this.buildPersona120603(item)['persona'] as Record<string, unknown>;
    PAYLOAD['persona'] = {
      ideTipoPersona: typeof PERSONA_BLOCK['ideTipoPersona'] === 'string' ? PERSONA_BLOCK['ideTipoPersona'] : ''
    };

    // bloque de solicitante: siempre incluir todos los campos requeridos, aunque vacíos
    const SOLICITANTE_RAW = this.buildSolicitanteBlock(item, SOLICITANTE_REQUERIDO) as Record<string, unknown>;
    PAYLOAD['solicitante'] = SOLICITANTE_RAW;

    // bloque de ubicación de mercancía: domicilio debe tener todos los campos requeridos aunque vacíos
    const UBICACION_BLOCK_RAW = this.buildUbicacionMercanciaBlock(item);
    if (UBICACION_BLOCK_RAW) {
      PAYLOAD['ubicacionMercancia'] = UBICACION_BLOCK_RAW;
    }
    return PAYLOAD;
  }
}