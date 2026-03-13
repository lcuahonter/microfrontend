import { Catalogo, CatalogoResponse } from '@libs/shared/data-access-user/src';
import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { MercanciasInfo } from '@libs/shared/data-access-user/src/core/models/260906/domicilo.model';
import { NicoInfo } from '../../shared/models/datos-domicilio-legal.model';
import { TablaDatos } from '@libs/shared/data-access-user/src/core/models/260906/detos.model';

/**
 * Interfaz que define el estado de la tienda Sanitario260906.
 */
export interface Solicitud260906State {
  /** ID de la solicitud */
  idSolicitud: number | null;
  /** Referencia única asociada a la solicitud */
  referencia: string;
  /** Cadena de dependencia asociada */
  cadenaDependencia: string;
  /** Nombre del banco */
  banco: string;
  /** llave identificadora */
  llave: string;
  /** Tipo de operación de fetch */
  tipoFetch: string;
  /** Importe asociado */
  importe: string;
  /** Estado seleccionado */
  selectedEstado: CatalogoResponse | null;
  /** Clave seleccionada */
  setClave: CatalogoResponse | null;
  /** Descripción seleccionada */
  setDescripcion: CatalogoResponse | null;
  /** Clasificación específica seleccionada */
  setDespecificarClasificacion: Catalogo | null;
  /** Lista de fabricantes */
  Fabricante: TablaDatos[];
  /** Lista de destinatarios */
  Destinatario: TablaDatos[];
  /** Lista de proveedores */
  Proveedor: TablaDatos[];
  /** Lista de facturadores */
  Facturador: TablaDatos[];
  
  /** Nacionalidad de terceros involucrados */
  tercerosNacionalidad: string;
  /** Tipo de persona (física o moral) */
  tipoPersona: string;
  /** Registro Federal de Contribuyentes */
  rfc: string;
  /** Clave Única de Registro de Población */
  curp: string;
  /** Nombre de la persona */
  nombre: string;
  /** Primer apellido */
  primerApellido: string;
  /** Segundo apellido */
  segundoApellido: string;
  /** Denominación o razón social de la empresa */
  denominacionRazonSocial: string;
  /** País de origen o residencia */
  pais: string;
  /** Estado o localidad */
  estadoLocalidad: string;
  /** Municipio o alcaldía */
  municipioAlcaldia: string;
  /** Localidad específica */
  localidad: string;
  /** Entidad federativa */
  entidadFederativa: string;
  /** Código postal o equivalente */
  codigoPostaloEquivalente: string;
  /** Colonia del domicilio */
  colonia: string;
  /** Colonia o equivalente alternativo */
  coloniaoEquivalente: string;
  /** Calle del domicilio */
  calle: string;
  /** Número exterior del domicilio */
  numeroExterior: string;
  /** Número interior del domicilio */
  numeroInterior: string;
  /** Lada telefónica */
  lada: string;
  /** Número de teléfono */
  telefono: string;
  /** Dirección de correo electrónico */
  correoElectronico: string;
  /** Código para extranjeros */
  extranjeroCodigo: string;
  /** Estado para extranjeros */
  extranjeroEstado: string;
  /** Colonia para extranjeros */
  extranjeroColonia: string;
  /** Estado general */
  estado: string;
  /** Tipo de operación */
  tipoOperacion: string | number;
  
  // Propiedades adicionales del trámite 260906
  /** RFC del responsable sanitario */
  rfcResponsableSanitario: string;
  /** Denominación de la empresa o entidad */
  denominacion: string;
  /** Dirección de correo electrónico */
  correo: string;
  /** Justificación del tipo de operación */
  tipoOperacionJustificacion: string;
  /** Código postal del domicilio */
  codigoPostal: string;
  /** Municipio del domicilio */
  muncipio: string;
  /** Clave SCIAN del modal */
  claveScianModal: string;
  /** Descripción de la clave del modal */
  claveDescripcionModal: string;
  /** Estado del checkbox de aviso */
  avisoCheckbox: boolean;
  /** Número de licencia sanitaria */
  licenciaSanitaria: string;
  /** Régimen aplicable */
  regimen: string;
  /** Aduanas de entrada autorizadas */
  aduanasEntradas: string;
  /** Número de permiso sanitario */
  numeroPermiso: string;
  /** Tiempo del programa en días */
  tiempoPrograma: number;
  /** Clasificación del producto */
  clasificacion: string;
  /** Especificación de clasificación del producto */
  especificarClasificacionProducto: string;
  /** Denominación específica del producto */
  denominacionEspecifica: string;
  /** Denominación distintiva del producto */
  denominacionDistintiva: string;
  /** Denominación común del producto */
  denominacionComun: string;
  /** Tipo de producto */
  tipoDeProducto: string;
  /** Forma farmacéutica del producto */
  formaFarmaceutica: string;
  /** Estado físico del producto */
  estadoFisico: string;
  /** Fracción arancelaria */
  fraccionArancelaria: string;
  /** Descripción de la fracción arancelaria */
  descripcionFraccion: string;
  /** Cantidad en Unidad de Medida de Tarifa */
  cantidadUMT: string;
  /** Unidad de Medida de Tarifa */
  UMT: string;
  /** Cantidad en Unidad de Medida Comercial */
  cantidadUMC: string;
  /** Unidad de Medida Comercial */
  UMC: string;
  /** Presentación del producto */
  presentacion: string;
  /** Número de registro sanitario */
  numeroRegistro: string;
  /** Fecha de caducidad del producto */
  fechaCaducidad: string;
  /** Estado de cumplimiento normativo */
  cumplimiento: string;
  /** Apellido paterno */
  apellidoPaterno: string;
  /** Apellido materno */
  apellidoMaterno: string;
  /** Información confidencial */
  informacionConfidencial: string | number;
  /** Estado del manifiesto */
  manifesto: boolean;
  /** Datos de la tabla NICO */
  nicoTablaDatos: NicoInfo[];
  /** Datos de la tabla de mercancías */
  mercanciasTablaDatos: MercanciasInfo[];
}

/**
 * Función que crea el estado inicial de la tienda.
 * @returns El estado inicial de la tienda.
 */
export function createInitialState(): Solicitud260906State {
  return {
    idSolicitud: 0,
    referencia: '',
    cadenaDependencia: '',
    banco: '',
    llave: '',
    tipoFetch: '',
    importe: '',
    selectedEstado: null,
    setClave: null,
    setDescripcion: null,
    setDespecificarClasificacion: null,
    Fabricante: [],
    Destinatario: [],
    Proveedor: [],
    Facturador: [],
    
    tercerosNacionalidad: '',
    tipoPersona: '',
    rfc: '',
    curp: '',
    nombre: '',
    primerApellido: '',
    segundoApellido: '',
    denominacionRazonSocial: '',
    pais: '',
    estadoLocalidad: '',
    municipioAlcaldia: '',
    localidad: '',
    entidadFederativa: '',
    codigoPostaloEquivalente: '',
    colonia: '',
    coloniaoEquivalente: '',
    calle: '',
    numeroExterior: '',
    numeroInterior: '',
    lada: '',
    telefono: '',
    correoElectronico: '',
    extranjeroCodigo: '',
    extranjeroEstado: '',
    extranjeroColonia: '',
    estado: '',
    tipoOperacion: '',
    
    // Missing properties from tramite260906 store
    rfcResponsableSanitario: '',
    denominacion: '',
    correo: '',
    tipoOperacionJustificacion: '',
    codigoPostal: '',
    muncipio: '',
    claveScianModal: '',
    claveDescripcionModal: '',
    avisoCheckbox: false,
    licenciaSanitaria: '',
    regimen: '',
    aduanasEntradas: '',
    numeroPermiso: '',
    tiempoPrograma: 0,
    clasificacion: '',
    especificarClasificacionProducto: '',
    denominacionEspecifica: '',
    denominacionDistintiva: '',
    denominacionComun: '',
    tipoDeProducto: '',
    formaFarmaceutica: '',
    estadoFisico: '',
    fraccionArancelaria: '',
    descripcionFraccion: '',
    cantidadUMT: '',
    UMT: '',
    cantidadUMC: '',
    UMC: '',
    presentacion: '',
    numeroRegistro: '',
    fechaCaducidad: '',
    cumplimiento: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    informacionConfidencial: '',
    manifesto: false,
    nicoTablaDatos: [],
    mercanciasTablaDatos: []
  };
}

/**
 * Tienda que gestiona el estado de Sanitario260906.
 */
@Injectable({
  providedIn: 'root'
})
@StoreConfig({
  name: 'sanitario260906Store',
  resettable: true
})
export class Sanitario260906Store extends Store<Solicitud260906State> {
  /**
   * Constructor que inicializa la tienda con el estado inicial.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Actualiza el ID de la solicitud en el estado.
   * @param idSolicitud Nuevo ID de solicitud.
   */
  public setIdSolicitud(idSolicitud: number): void {
    this.update((state) => ({
      ...state,
      idSolicitud
    }));
  }

  /**
   * Actualiza el campo `referencia` en el estado.
   * @param referencia Nueva referencia.
   */
  public setreferencia(referencia: string): void {
    this.update((state) => ({
      ...state,
      referencia
    }));
  }

  /**
   * Actualiza el campo `cadenaDependencia` en el estado.
   * @param cadenaDependencia Nueva cadena de dependencia.
   */
  public setcadenaDependencia(cadenaDependencia: string): void {
    this.update((state) => ({
      ...state,
      cadenaDependencia
    }));
  }

  /**
   * Actualiza el campo `banco` en el estado.
   * @param banco Nuevo nombre del banco.
   */
  public setbanco(banco: string): void {
    this.update((state) => ({
      ...state,
      banco
    }));
  }

  /**
   * Actualiza el campo `llave` en el estado.
   * @param llave Nueva llave identificadora.
   */
  public setLlave(llave: string): void {
    this.update((state) => ({
      ...state,
      llave
    }));
  }

  /**
   * Actualiza el campo `tipoFetch` en el estado.
   * @param tipoFetch Nuevo tipo de fetch.
   */
  public settipoFetch(tipoFetch: string): void {
    this.update((state) => ({
      ...state,
      tipoFetch
    }));
  }

  /**
   * Actualiza el campo `importe` en el estado.
   * @param importe Nuevo importe.
   */
  public setimporte(importe: string): void {
    this.update((state) => ({
      ...state,
      importe
    }));
  }

  /**
   * Actualiza el campo `selectedEstado` en el estado.
   * @param selectedEstado Nuevo estado seleccionado.
   */
  public setSelectedEstado(selectedEstado: CatalogoResponse): void {
    this.update((state) => ({
      ...state,
      selectedEstado
    }));
  }

  /**
   * Actualiza el campo `setClave` en el estado.
   * @param selectedClave Nueva clave seleccionada.
   */
  public setClave(selectedClave: CatalogoResponse): void {
    this.update((state) => ({
      ...state,
      setClave: selectedClave
    }));
  }

  /**
   * Actualiza el campo `setDescripcion` en el estado.
   * @param selectedDescripcion Nueva descripción seleccionada.
   */
  public setDescripcion(selectedDescripcion: CatalogoResponse): void {
    this.update((state) => ({
      ...state,
      setDescripcion: selectedDescripcion
    }));
  }

  /**
   * Actualiza el campo `setDespecificarClasificacion` en el estado.
   * @param selectedDespecificarClasificacion Nueva clasificación específica seleccionada.
   */
  public setDespecificarClasificacion(selectedDespecificarClasificacion: CatalogoResponse): void {
    this.update((state) => ({
      ...state,
      setDespecificarClasificacion: selectedDespecificarClasificacion
    }));
  }

  /**
   * Actualiza el campo `Fabricante` en el estado.
   * @param fabricante Nueva lista de fabricantes.
   */
  public setFabricante(fabricante: TablaDatos[]): void {
    this.update((state) => ({
      ...state,
      Fabricante: fabricante
    }));
  }

  /**
   * Actualiza el campo `Destinatario` en el estado.
   * @param destinatario Nueva lista de destinatarios.
   */
  public setDestinatario(destinatario: TablaDatos[]): void {
    this.update((state) => ({
      ...state,
      Destinatario: destinatario
    }));
  }

  /**
   * Actualiza el campo `Proveedor` en el estado.
   * @param proveedor Nueva lista de proveedores.
   */
  public setProveedor(proveedor: TablaDatos[]): void {
    this.update((state) => ({
      ...state,
      Proveedor: proveedor
    }));
  }

  /**
   * Actualiza el campo `Facturador` en el estado.
   * @param facturador Nueva lista de facturadores.
   */
  public setFacturador(facturador: TablaDatos[]): void {
    this.update((state) => ({
      ...state,
      Facturador: facturador
    }));
  }

  /**
   * Actualiza el campo `tercerosNacionalidad` en el estado.
   * @param tercerosNacionalidad Nueva nacionalidad de terceros.
   */
  public setTercerosNacionalidad(tercerosNacionalidad: string): void {
    this.update((state) => ({
      ...state,
      tercerosNacionalidad
    }));
  }

  /**
   * Actualiza el campo `tipoPersona` en el estado.
   * @param tipoPersona Nuevo tipo de persona.
   */
  public setTipoPersona(tipoPersona: string): void {
    this.update((state) => ({
      ...state,
      tipoPersona
    }));
  }

  /**
   * Actualiza el campo `rfc` en el estado.
   * @param rfc Nuevo RFC.
   */
  public setRfc(rfc: string): void {
    this.update((state) => ({
      ...state,
      rfc
    }));
  }

  /**
   * Actualiza el campo `curp` en el estado.
   * @param curp Nueva CURP.
   */
  public setCurp(curp: string): void {
    this.update((state) => ({
      ...state,
      curp
    }));
  }

  /**
   * Actualiza el campo `nombre` en el estado.
   * @param nombre Nuevo nombre.
   */
  public setNombre(nombre: string): void {
    this.update((state) => ({
      ...state,
      nombre
    }));
  }

  /**
   * Actualiza el campo `primerApellido` en el estado.
   * @param primerApellido Nuevo primer apellido.
   */
  public setPrimerApellido(primerApellido: string): void {
    this.update((state) => ({
      ...state,
      primerApellido
    }));
  }

  /**
   * Actualiza el campo `segundoApellido` en el estado.
   * @param segundoApellido Nuevo segundo apellido.
   */
  public setSegundoApellido(segundoApellido: string): void {
    this.update((state) => ({
      ...state,
      segundoApellido
    }));
  }

  /**
   * Actualiza el campo `denominacionRazonSocial` en el estado.
   * @param denominacionRazonSocial Nueva denominación o razón social.
   */
  public setDenominacionRazonSocial(denominacionRazonSocial: string): void {
    this.update((state) => ({
      ...state,
      denominacionRazonSocial
    }));
  }

  /**
   * Actualiza el campo `pais` en el estado.
   * @param pais Nuevo país.
   */
  public setPais(pais: string): void {
    this.update((state) => ({
      ...state,
      pais
    }));
  }

  /**
   * Actualiza el campo `estadoLocalidad` en el estado.
   * @param estadoLocalidad Nuevo estado o localidad.
   */
  public setEstadoLocalidad(estadoLocalidad: string): void {
    this.update((state) => ({
      ...state,
      estadoLocalidad
    }));
  }

  /**
   * Actualiza el campo `municipioAlcaldia` en el estado.
   * @param municipioAlcaldia Nuevo municipio o alcaldía.
   */
  public setMunicipioAlcaldia(municipioAlcaldia: string): void {
    this.update((state) => ({
      ...state,
      municipioAlcaldia
    }));
  }

  /**
   * Actualiza el campo `localidad` en el estado.
   * @param localidad Nueva localidad.
   */
  public setLocalidad(localidad: string): void {
    this.update((state) => ({
      ...state,
      localidad
    }));
  }

  /**
   * Actualiza el campo `entidadFederativa` en el estado.
   * @param entidadFederativa Nueva entidad federativa.
   */
  public setEntidadFederativa(entidadFederativa: string): void {
    this.update((state) => ({
      ...state,
      entidadFederativa
    }));
  }

  /**
   * Actualiza el campo `codigoPostaloEquivalente` en el estado.
   * @param codigoPostaloEquivalente Nuevo código postal o equivalente.
   */
  public setCodigoPostaloEquivalente(codigoPostaloEquivalente: string): void {
    this.update((state) => ({
      ...state,
      codigoPostaloEquivalente
    }));
  }

  /**
   * Actualiza el campo `colonia` en el estado.
   * @param colonia Nueva colonia.
   */
  public setColonia(colonia: string): void {
    this.update((state) => ({
      ...state,
      colonia
    }));
  }

  /**
   * Actualiza el campo `coloniaoEquivalente` en el estado.
   * @param coloniaoEquivalente Nueva colonia o equivalente.
   */
  public setColoniaoEquivalente(coloniaoEquivalente: string): void {
    this.update((state) => ({
      ...state,
      coloniaoEquivalente
    }));
  }

  /**
   * Actualiza el campo `calle` en el estado.
   * @param calle Nueva calle.
   */
  public setCalle(calle: string): void {
    this.update((state) => ({
      ...state,
      calle
    }));
  }

  /**
   * Actualiza el campo `numeroExterior` en el estado.
   * @param numeroExterior Nuevo número exterior.
   */
  public setNumeroExterior(numeroExterior: string): void {
    this.update((state) => ({
      ...state,
      numeroExterior
    }));
  }

  /**
   * Actualiza el campo `numeroInterior` en el estado.
   * @param numeroInterior Nuevo número interior.
   */
  public setNumeroInterior(numeroInterior: string): void {
    this.update((state) => ({
      ...state,
      numeroInterior
    }));
  }

  /**
   * Actualiza el campo `lada` en el estado.
   * @param lada Nueva lada telefónica.
   */
  public setLada(lada: string): void {
    this.update((state) => ({
      ...state,
      lada
    }));
  }

  /**
   * Actualiza el campo `telefono` en el estado.
   * @param telefono Nuevo teléfono.
   */
  public setTelefono(telefono: string): void {
    this.update((state) => ({
      ...state,
      telefono
    }));
  }

  /**
   * Actualiza el campo `correoElectronico` en el estado.
   * @param correoElectronico Nuevo correo electrónico.
   */
  public setCorreoElectronico(correoElectronico: string): void {
    this.update((state) => ({
      ...state,
      correoElectronico
    }));
  }

  /**
   * Actualiza el campo `extranjeroCodigo` en el estado.
   * @param extranjeroCodigo Nuevo código para extranjero.
   */
  public setExtranjeroCodigo(extranjeroCodigo: string): void {
    this.update((state) => ({
      ...state,
      extranjeroCodigo
    }));
  }

  /**
   * Actualiza el campo `extranjeroEstado` en el estado.
   * @param extranjeroEstado Nuevo estado para extranjero.
   */
  public setExtranjeroEstado(extranjeroEstado: string): void {
    this.update((state) => ({
      ...state,
      extranjeroEstado
    }));
  }

  /**
   * Actualiza el campo `extranjeroColonia` en el estado.
   * @param extranjeroColonia Nueva colonia para extranjero.
   */
  public setExtranjeroColonia(extranjeroColonia: string): void {
    this.update((state) => ({
      ...state,
      extranjeroColonia
    }));
  }

  /**
   * Actualiza el campo `estado` en el estado.
   * @param estado Nuevo estado.
   */
  public setEstado(estado: string): void {
    this.update((state) => ({
      ...state,
      estado
    }));
  }

  /**
   * Actualiza el tipo de operación en el estado.
   * @param tipoOperacion Nuevo tipo de operación.
   */
  public setTipoOperacion(tipoOperacion: string | number): void {
    this.update((state) => ({
      ...state,
      tipoOperacion
    }));
  }

  // Missing setter methods from tramite260906 store

  /**
   * Establece el estado de rfcResponsableSanitario.
   * @param rfcResponsableSanitario - El valor de rfcResponsableSanitario.
   */
  public setRfcResponsableSanitario(rfcResponsableSanitario: string): void {
    this.update((state) => ({
      ...state,
      rfcResponsableSanitario
    }));
  }

  /**
   * Establece el estado de denominacion.
   * @param denominacion - El valor de denominacion.
   */
  public setDenominacion(denominacion: string): void {
    this.update((state) => ({
      ...state,
      denominacion
    }));
  }

  /**
   * Establece el estado de correo.
   * @param correo - El valor de correo.
   */
  public setCorreo(correo: string): void {
    this.update((state) => ({
      ...state,
      correo
    }));
  }

  /**
   * Establece el estado de tipoOperacionJustificacion.
   * @param tipoOperacionJustificacion - El valor de tipoOperacionJustificacion.
   */
  public setTipoOperacionJustificacion(tipoOperacionJustificacion: string): void {
    this.update((state) => ({
      ...state,
      tipoOperacionJustificacion
    }));
  }

  /**
   * Establece el estado de codigoPostal.
   * @param codigoPostal - El valor de codigoPostal.
   */
  public setCodigoPostal(codigoPostal: string): void {
    this.update((state) => ({
      ...state,
      codigoPostal
    }));
  }

  /**
   * Establece el estado de muncipio.
   * @param muncipio - El valor de muncipio.
   */
  public setMuncipio(muncipio: string): void {
    this.update((state) => ({
      ...state,
      muncipio
    }));
  }

  /**
   * Establece el estado de claveScianModal.
   * @param claveScianModal - El valor de claveScianModal.
   */
  public setClaveScianModal(claveScianModal: string): void {
    this.update((state) => ({
      ...state,
      claveScianModal
    }));
  }

  /**
   * Establece el estado de claveDescripcionModal.
   * @param claveDescripcionModal - El valor de claveDescripcionModal.
   */
  public setClaveDescripcionModal(claveDescripcionModal: string): void {
    this.update((state) => ({
      ...state,
      claveDescripcionModal
    }));
  }

  /**
   * Establece el estado de avisoCheckbox.
   * @param avisoCheckbox - El valor de avisoCheckbox.
   */
  public setAvisoCheckbox(avisoCheckbox: boolean): void {
    this.update((state) => ({
      ...state,
      avisoCheckbox
    }));
  }

  /**
   * Establece el estado de licenciaSanitaria.
   * @param licenciaSanitaria - El valor de licenciaSanitaria.
   */
  public setLicenciaSanitaria(licenciaSanitaria: string): void {
    this.update((state) => ({
      ...state,
      licenciaSanitaria
    }));
  }

  /**
   * Establece el estado de regimen.
   * @param regimen - El valor de regimen.
   */
  public setRegimen(regimen: string): void {
    this.update((state) => ({
      ...state,
      regimen
    }));
  }

  /**
   * Establece el estado de aduanasEntradas.
   * @param aduanasEntradas - El valor de aduanasEntradas.
   */
  public setAduanasEntradas(aduanasEntradas: string): void {
    this.update((state) => ({
      ...state,
      aduanasEntradas
    }));
  }

  /**
   * Establece el estado de numeroPermiso.
   * @param numeroPermiso - El valor de numeroPermiso.
   */
  public setNumeroPermiso(numeroPermiso: string): void {
    this.update((state) => ({
      ...state,
      numeroPermiso
    }));
  }

  /**
   * Establece el estado de tiempoPrograma.
   * @param tiempoPrograma - El valor de tiempoPrograma.
   */
  public setTiempoPrograma(tiempoPrograma: number): void {
    this.update((state) => ({
      ...state,
      tiempoPrograma
    }));
  }

  /**
   * Establece el estado de clasificacion.
   * @param clasificacion - El valor de clasificacion.
   */
  public setClasificacion(clasificacion: string): void {
    this.update((state) => ({
      ...state,
      clasificacion
    }));
  }

  /**
   * Establece el estado de especificarClasificacionProducto.
   * @param especificarClasificacionProducto - El valor de especificarClasificacionProducto.
   */
  public setEspecificarClasificacionProducto(especificarClasificacionProducto: string): void {
    this.update((state) => ({
      ...state,
      especificarClasificacionProducto
    }));
  }

  /**
   * Establece el estado de denominacionEspecifica.
   * @param denominacionEspecifica - El valor de denominacionEspecifica.
   */
  public setDenominacionEspecifica(denominacionEspecifica: string): void {
    this.update((state) => ({
      ...state,
      denominacionEspecifica
    }));
  }

  /**
   * Establece el estado de denominacionDistintiva.
   * @param denominacionDistintiva - El valor de denominacionDistintiva.
   */
  public setDenominacionDistintiva(denominacionDistintiva: string): void {
    this.update((state) => ({
      ...state,
      denominacionDistintiva
    }));
  }

  /**
   * Establece el estado de denominacionComun.
   * @param denominacionComun - El valor de denominacionComun.
   */
  public setDenominacionComun(denominacionComun: string): void {
    this.update((state) => ({
      ...state,
      denominacionComun
    }));
  }

  /**
   * Establece el estado de tipoDeProducto.
   * @param tipoDeProducto - El valor de tipoDeProducto.
   */
  public setTipoDeProducto(tipoDeProducto: string): void {
    this.update((state) => ({
      ...state,
      tipoDeProducto
    }));
  }

  /**
   * Establece el estado de formaFarmaceutica.
   * @param formaFarmaceutica - El valor de formaFarmaceutica.
   */
  public setFormaFarmaceutica(formaFarmaceutica: string): void {
    this.update((state) => ({
      ...state,
      formaFarmaceutica
    }));
  }

  /**
   * Establece el estado de estadoFisico.
   * @param estadoFisico - El valor de estadoFisico.
   */
  public setEstadoFisico(estadoFisico: string): void {
    this.update((state) => ({
      ...state,
      estadoFisico
    }));
  }

  /**
   * Establece el estado de fraccionArancelaria.
   * @param fraccionArancelaria - El valor de fraccionArancelaria.
   */
  public setFraccionArancelaria(fraccionArancelaria: string): void {
    this.update((state) => ({
      ...state,
      fraccionArancelaria
    }));
  }

  /**
   * Establece el estado de descripcionFraccion.
   * @param descripcionFraccion - El valor de descripcionFraccion.
   */
  public setDescripcionFraccion(descripcionFraccion: string): void {
    this.update((state) => ({
      ...state,
      descripcionFraccion
    }));
  }

  /**
   * Establece el estado de cantidadUMT.
   * @param cantidadUMT - El valor de cantidadUMT.
   */
  public setCantidadUMT(cantidadUMT: string): void {
    this.update((state) => ({
      ...state,
      cantidadUMT
    }));
  }

  /**
   * Establece el estado de UMT.
   * @param UMT - El valor de UMT.
   */
  public setUMT(UMT: string): void {
    this.update((state) => ({
      ...state,
      UMT
    }));
  }

  /**
   * Establece el estado de cantidadUMC.
   * @param cantidadUMC - El valor de cantidadUMC.
   */
  public setCantidadUMC(cantidadUMC: string): void {
    this.update((state) => ({
      ...state,
      cantidadUMC
    }));
  }

  /**
   * Establece el estado de UMC.
   * @param UMC - El valor de UMC.
   */
  public setUMC(UMC: string): void {
    this.update((state) => ({
      ...state,
      UMC
    }));
  }

  /**
   * Establece el estado de presentacion.
   * @param presentacion - El valor de presentacion.
   */
  public setPresentacion(presentacion: string): void {
    this.update((state) => ({
      ...state,
      presentacion
    }));
  }

  /**
   * Establece el estado de numeroRegistro.
   * @param numeroRegistro - El valor de numeroRegistro.
   */
  public setNumeroRegistro(numeroRegistro: string): void {
    this.update((state) => ({
      ...state,
      numeroRegistro
    }));
  }

  /**
   * Establece el estado de fechaCaducidad.
   * @param fechaCaducidad - El valor de fechaCaducidad.
   */
  public setFechaCaducidad(fechaCaducidad: string): void {
    this.update((state) => ({
      ...state,
      fechaCaducidad
    }));
  }

  /**
   * Establece el estado de cumplimiento.
   * @param cumplimiento - El valor de cumplimiento.
   */
  public setCumplimiento(cumplimiento: string): void {
    this.update((state) => ({
      ...state,
      cumplimiento
    }));
  }

  /**
   * Establece el estado de apellidoPaterno.
   * @param apellidoPaterno - El valor de apellidoPaterno.
   */
  public setApellidoPaterno(apellidoPaterno: string): void {
    this.update((state) => ({
      ...state,
      apellidoPaterno
    }));
  }

  /**
   * Establece el estado de apellidoMaterno.
   * @param apellidoMaterno - El valor de apellidoMaterno.
   */
  public setApellidoMaterno(apellidoMaterno: string): void {
    this.update((state) => ({
      ...state,
      apellidoMaterno
    }));
  }

  /**
   * Establece el estado de informacionConfidencial.
   * @param informacionConfidencial - El valor de informacionConfidencial.
   */
  public setInformacionConfidencial(informacionConfidencial: string | number): void {
    this.update((state) => ({
      ...state,
      informacionConfidencial
    }));
  }

  /**
   * Actualiza el estado del manifiesto en el estado.
   * @param manifesto - Nuevo valor para el estado del manifiesto.
   */
  public setManifesto(manifesto: boolean): void {
    this.update((state) => ({
      ...state,
      manifesto
    }));
  }

  /**
   * Actualiza los datos de la tabla NICO en el estado.
   * @param nicoTablaDatos - Nueva lista de datos NICO.
   */
  public setNicoTablaDatos(nicoTablaDatos: NicoInfo[]): void {
    this.update((state) => ({
      ...state,
      nicoTablaDatos
    }));
  }

  /**
   * Actualiza los datos de la tabla de mercancías en el estado.
   * @param mercanciasTablaDatos - Nueva lista de datos de mercancías.
   */
  public setMercanciasTablaDatos(mercanciasTablaDatos: MercanciasInfo[]): void {
    this.update((state) => ({
      ...state,
      mercanciasTablaDatos
    }));
  }

  /**
   * Actualiza el estado del store con los datos proporcionados.
   * @param {Partial<Tramite110209State>} estado - Datos parciales para actualizar el estado.
   */
  setTramite260906(estado: Partial<Solicitud260906State>): void {
    this.update((state) => ({
      ...state,
      ...estado,
    }));
  }
}
