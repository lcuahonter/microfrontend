export interface DatosGenerales {
    curp: string; // Clave Única de Registro de Población
    rfc: string; // Registro Federal de Contribuyentes
    nombreRazonSocial: string; // Nombre o razón social
    primerApellido: string; // Primer apellido
    segundoApellido: string; // Segundo apellido
    actEconomica: string; // Actividad económica preponderante
    correo: string; // Correo electrónico
  }

  export interface DomicilioFiscal {
    pais: string; // País
    codigoPostal: string; // Código postal
    entidadFederativa: string; // Estado o entidad federativa
    municipio: string; // Municipio o alcaldía
    localidad: string; // Localidad
    colonia: string; // Colonia
    calle: string; // Calle
    nExt: string; // Número exterior
    nInt?: string; // Número interior (opcional)
    lada: string; // Lada
    telefono: string; // Teléfono
  }
  export interface SolicitanteData {
    datosGenerales: DatosGenerales;
    domicilioFiscal: DomicilioFiscal;
  }
  export interface DomicilioEstablecimiento {
    ideGenerica1: string;
    establecimientoRFCResponsableSanitario: string;
    establecimientoRazonSocial: string;
    establecimientoCorreoElectronico: string;
    establecimientoEstados: string;
    descripcionMunicipio: string;
    localidad: string;
    establishomentoColonias: string;
    calle: string;
    lada: string;
    telefono: string;
    establecimientoDomicilioCodigoPostal: string;
    scian: string;
  }
  
  export interface ScianForm {
    scian: string;
    descripcionScian: string;
  }
  
  export interface SolicitudForm {
    ideGenerica1: string;
    justificacionId: string;
    codigoPostal: string;
    estado: string;
    municipioOAlcaldia: string;
    localidad: string;
    colonias: string;
    calle: string;
    lada: string;
    telefono: string;
  }
  
  export interface SolicitudEstablecimientoForm {
    noLicenciaSanitaria: string;
    avisoCheckbox: string;
    regimen: string;
    aduanasEntradas: string;
    aifaCheckbox: string;
  }
  
  export interface FormMercancias {
    clasificacion: string;
    especificarClasificacionProducto: string;
    denominacionEspecifica: string;
    denominacionDistintiva: string;
    denominacionComun: string;
    tipoDeProducto: string;
    estadoFisico: string;
    fraccionArancelaria: string;
    cantidadUMT: string;
    cantidadUMC: string;
    UMC: string;
    presentacion: string;
    numeroRegistro: string;
    fechaCaducidad: string;
  }
  
  export interface CompleteForm {
    domicilioEstablecimiento: DomicilioEstablecimiento;
    scianForm: ScianForm;
    solicitudEstablecimientoForm: SolicitudEstablecimientoForm;
    formMercancias: FormMercancias;
  }
  export interface PagoDeDerechos {
    claveDeReferncia: string; // Clave de referencia del pago
    cadenaDeLaDependencia: string; // Cadena de la dependencia
    banco: string; // Nombre del banco
    llaveDePago: string; // Llave de pago
    fechaDePago: string; // Fecha del pago
    importeDePago: string; // Importe del pago
  }
  export interface Facturador {
    tipoPersona: string;
    pais: string;
    estado: string;
    codigoPostaloEquivalente: string;
    coloniaoEquivalente: string;
    calle: string;
    numeroExterior: string;
    numeroInterior: string;
    lada: string;
    telefono: string;
    correoElectronico: string;
  }
  
  export interface Fabricante {
    tercerosNacionalidad: string;
    tipoPersona: string;
    nombre: string;
    primerApellido: string;
    segundoApellido: string;
    pais: string;
    extranjeroEstado: string;
    estadoLocalidad: string;
    municipioAlcaldia: string;
    localidad: string;
    entidadFederativa: string;
    codigoPostaloEquivalente: string;
    colonia: string;
    coloniaoEquivalente: string;
    calle: string;
    numeroExterior: string;
    numeroInterior: string;
    lada: string;
    telefono: string;
    correoElectronico: string;
  }
  
  export interface Destinatario {
    tipoPersona: string;
    pais: string;
    estadoLocalidad: string;
    municipioAlcaldia: string;
    localidad: string;
    entidadFederativa: string;
    codigoPostaloEquivalente: string;
    colonia: string;
    coloniaoEquivalente: string;
    calle: string;
    numeroExterior: string;
    numeroInterior: string;
    lada: string;
    telefono: string;
    correoElectronico: string;
  }
  
  export interface Proveedor {
    tipoPersona: string;
    pais: string;
    estado: string;
    codigoPostaloEquivalente: string;
    coloniaoEquivalente: string;
    calle: string;
    numeroExterior: string;
    numeroInterior: string;
    lada: string;
    telefono: string;
    correoElectronico: string;
  }
  
  export interface TercerosRelacionados {
    facturador: Facturador;
    fabricante: Fabricante;
    destinatario: Destinatario;
    proveedor: Proveedor;
  }
  export interface Tramite {
    id: number; // Unique identifier for the tramite
    folioTramite: string; // Folio or reference number of the tramite
    tipoTramite: string; // Type of tramite
    estatus: string; // Status of the tramite
    fechaAltaDeRegistro: string; // Date of registration
  }