
/**
  * @interface DatosDelSolicitud
  * @description
  * Esta interfaz define la estructura de los datos relacionados con una solicitud de exportación de ilustraciones. 
  * Incluye información detallada sobre la obra de arte, como el autor, título, técnica de realización, dimensiones, 
  * y otros detalles relevantes.
  * 
  * Propiedades:
  * - `autor`: Nombre del autor de la obra.
  * - `titulo`: Título de la obra.
  * - `tecnicaDeRealizacion`: Técnica utilizada para realizar la obra.
  * - `conMarco`: Indica si la obra incluye marco.
  * - `ancho`: Ancho de la obra en centímetros.
  * - `alto`: Altura de la obra en centímetros.
  * - `profundidad`: Profundidad de la obra en centímetros.
  * - `diametro`: Diámetro de la obra en centímetros.
  * - `variables`: Variables adicionales relacionadas con la obra.
  * - `anoDeCreacion`: Año en que se creó la obra.
  * - `avaluo`: Valor estimado de la obra.
  * - `moneda`: Moneda utilizada para el avalúo.
  * - `propietario`: Nombre del propietario de la obra.
  * - `fraccionArancelaria`: Fracción arancelaria asociada a la obra.
  * - `descripcion`: Descripción de la fracción arancelaria.
  */
export interface DatosDelSolicitud {
    autor: string;
    titulo: string;
    tecnicaDeRealizacion: string;
    conMarco: string;
    ancho: number;
    alto: number;
    profundidad: number;
    diametro: number;
    variables: string;
    anoDeCreacion: string;
    avaluo: number;
    moneda: string;
    propietario: string;
    fraccionArancelaria: string;
    descripcion: string;
}

/**
  * @interface AduanaDeSalida
  * @description
  * Esta interfaz define la estructura de los datos relacionados con una aduana de salida. 
  * Incluye información sobre el tipo de traslado, ciudad, sede, fechas y observaciones relevantes.
  * 
  * Propiedades:
  * - `tipo`: Tipo de aduana o traslado.
  * - `ciudad`: Ciudad donde se encuentra la aduana.
  * - `sede`: Sede asociada al traslado.
  * - `tipoDeTraslado`: Tipo de traslado realizado.
  * - `fechaExhibicion`: Fecha de exhibición asociada al traslado.
  * - `observaciones`: Observaciones adicionales relacionadas con el traslado.
  * - `fechoInicio`: Fecha de inicio del traslado.
  * - `fechaFin`: Fecha de finalización del traslado.
  */
export interface AduanaDeSalida {
    tipo: string;
    ciudad: string;
    sede: string;
    tipoDeTraslado: string;
    fechaExhibicion: string;
    observaciones: string;
    fechoInicio: string;
    fechaFin: string;
}