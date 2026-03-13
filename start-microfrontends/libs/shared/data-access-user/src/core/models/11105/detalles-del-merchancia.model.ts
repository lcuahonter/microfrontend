/**
 * Interfaz que representa los detalles de un producto.
 */
export interface DetallesDelMercancia {
    /**
     * Tipo de mercancía, por ejemplo, "electrónica", "ropa", etc.
     */
    tipoDeMercancia: string;
    /**
     * Condición de la mercancía, como "nueva", "usada", etc.
     */
    condicionDeLaMercancia: string;
    /**
     * Cantidad de unidades de la mercancía.
     */
    cantidad: string;
    /**
     * Información adicional en caso de ser necesario.
     */
    enSucaso: string;
    /**
     * Unidad de medida utilizada, como "kilogramos", "litros", etc.
     */
    unidadDeMedida: string;
    /**
     * Año en el que se realizó la importación temporal.
     */
    anoDeImportacionTemporal: string;
    /**
     * Modelo del producto.
     */
    modelo: string;
    /**
     * Marca del producto.
     */
    marca: string;
    /**
     * Número de serie del producto.
     */
    numeroDeSerie: string;
    /**
     * Uso específico de la mercancía.
     */
    usoEspecifico: string;
    /**
     * Condición de la mercancía.
     */
    condicionMercancia: string;
    /**
     * Vehículo.
     */
    vehiculo: string;
}


/**
 *  Representa los datos del formulario de certificado de origen.
  *  @interface FormularioCertificadoOrigen
  */ 
export interface RespuestaConsulta {
  success: boolean;
  datos: ConsultaDatos;
  message: string;
}

/**
 *  Representa los datos de la consulta del certificado de origen.
 *  @interface ConsultaDatos
  */
export interface ConsultaDatos {
 aduana: string;
nombre: string;
tipoMercancia: string;
usoEspecifico: string;
condicion: string;
marca: string;
ano: string;
modelo: string;
serie: string;
manifesto: boolean;
calle: string;
numeroExterior: string;
numeroInterior: string;
telefono: string;
correoElectronico: string;
pais: string;
codigoPostal: string;
estado: string;
colonia: string;
opcion: string;
folioOriginal: string;
justificacionDelDesistimiento: string;
  }