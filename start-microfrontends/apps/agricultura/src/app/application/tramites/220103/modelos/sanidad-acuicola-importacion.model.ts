/**
 * Interfaz que representa una mercancía para el trámite de sanidad acuícola en importación.
 */
export interface Mercancia {
    /** Identificador único de la mercancía */
    id?: string; 
    /** Descripción de la mercancía */
    descripcion: string;
    /** Fracción arancelaria de la mercancía */
    fraccionArancelaria: string; 
    /** Descripción de la fracción arancelaria */
    descripcionFraccion: string;          
    /** Cantidad en la unidad de medida de transporte (UMT) */
    cantidadUMT: string;                 
    /** Unidad de medida de transporte (UMT) */
    umt: string;                          
    /** Cantidad en la unidad de medida y conteo (UMC) */
    cantidadUMC: string;                
    /** Unidad de medida y conteo (UMC) */
    umc: string;                          
    /** Nombre común de la especie */
    nombreComun: string;                 
    /** Nombre científico de la especie */
    nombreCientifico: string;            
    /** Fase de desarrollo de la especie */
    faseDesarrollo: string;              
    /** Uso de la mercancía */
    uso: string;                         
    /** Otro uso de la mercancía (en caso de especificar) */
    otroUso: string;                     
    /** Origen de la mercancía */
    origen: string;                      
    /** País de origen */
    paisOrigen: string;                  
    /** País de procedencia */
    paisProcedencia: string;     
    /** Propiedades adicionales dinámicas */
    [key: string]: string|undefined; 
}

/**
 * Interfaz que representa los datos de un tercero destinatario.
 */
export interface DatosDelTerceroDestinatario {
    /** Identificador único del destinatario */
    id?: string;
    /** Nombre del destinatario */
    nombre: string;
    /** Primer apellido del destinatario */
    primerApellido: string;
    /** Segundo apellido del destinatario */
    segundoApellido: string;
    /** Razón social del destinatario */
    razonSocial: string;
    /** Teléfono de contacto */
    telefono: string;
    /** Correo electrónico de contacto */
    correoElectronico: string;
    /** Calle del domicilio */
    calle: string;
    /** Número exterior del domicilio */
    numeroExterior: string;
    /** Número interior del domicilio */
    numeroInterior: string;
    /** País del domicilio */
    pais: string;
    /** Estado del domicilio */
    estado: string;
    /** Municipio o alcaldía del domicilio */
    municipioAlcaldia: string;
    /** Colonia del domicilio */
    colonia: string;
    /** Lada telefónica */
    lada: string;
    /** Código postal del domicilio */
    codigoPostal: string;
    /** Propiedades adicionales dinámicas */
    [key: string]: string|undefined;
}

/**
 * Interfaz que representa una instalación relacionada con el trámite.
 */
export interface Instalacion {
    /** Identificador único de la instalación */
    id?: string;
    /** Nombre de la instalación o responsable */
    nombre: string;
    /** Primer apellido del responsable */
    primerApellido: string;
    /** Segundo apellido del responsable */
    segundoApellido: string;
    /** Teléfono de contacto */
    telefono: string;
    /** Correo electrónico de contacto */
    correoElectronico: string;
    /** Calle del domicilio */
    calle: string;
    /** Número exterior del domicilio */
    numeroExterior: string;
    /** Número interior del domicilio */
    numeroInterior: string;
    /** País del domicilio */
    pais: string;
    /** Estado del domicilio */
    estado: string;
    /** Municipio del domicilio */
    municipio: string;
    /** Colonia del domicilio */
    colonia: string;
    /** Lada telefónica */
    lada: string;
    /** Código postal del domicilio */
    codigoPostal: string;
    /** Domicilio completo (opcional) */
    domicillio?: string;
    /** Razón social de la instalación (opcional) */
    razonSocial?: string;
    /** Propiedades adicionales dinámicas */
    [key: string]: string|undefined | unknown;
}