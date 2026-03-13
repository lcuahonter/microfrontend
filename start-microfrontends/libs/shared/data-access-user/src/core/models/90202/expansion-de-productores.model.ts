/**
 * Representa la estructura de un domicilio de planta para mostrar en la tabla dinámica del componente DomiciliosDePlantasComponent.
 * Cada propiedad corresponde a una columna de la tabla y almacena información relevante del domicilio, 
 * como dirección, datos fiscales y razón social.
 *
 * @interface DomiciliosDePlantasTabla
 * @property {string} calle - Nombre de la calle del domicilio de la planta.
 * @property {string} numero - Número exterior del domicilio.
 * @property {string} interior - Número interior del domicilio.
 * @property {string} postal - Código postal del domicilio.
 * @property {string} colonia - Colonia donde se ubica la planta.
 * @property {string} municipio - Municipio o alcaldía correspondiente.
 * @property {string} estado - Estado de la República donde se encuentra la planta.
 * @property {string} pais - País donde se ubica la planta.
 * @property {string} registro - Número de registro de la planta.
 * @property {string} registroFederalDeContribuyentes - RFC de la planta o empresa.
 * @property {string} razonSocial - Razón social de la empresa.
 * @property {string} domicilioFiscalDelSolicitante - Domicilio fiscal del solicitante.
 */
export interface DomiciliosDePlantasTabla {
   calle: string;
   numExterior: string;
   numInterior: string;
   codigoPostal: string;
   colonia: string;
   municipioOAlcaldia: string;
   estado: string;
   pais: string;
   registroFederalDeContribuyentes: string;
   razonSocial: string;
   domicilioFiscalDelSolicitante: string;
}