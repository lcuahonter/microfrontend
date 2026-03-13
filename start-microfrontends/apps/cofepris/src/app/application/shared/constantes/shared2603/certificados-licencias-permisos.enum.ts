/**
 * Interface for fracción arancelaria items used in mercancías validation.
 */
export interface FraccionArancelaria {
  arancelaria: string;
  procedure: number;
  descripcion: string;
}
import { ConfiguracionColumna, Fabricante, MercanciasDatos, Otros260303 } from "@libs/shared/data-access-user/src";

import { ProductoTerminado,ProductoTerminadoDos, ScianDatos } from "@libs/shared/data-access-user/src/core/models/shared2603/certificados-licencias-permisos.model";

/**
 * Identificador único del procedimiento para el trámite 260304.
 * @type {number}
 */
export const ID_PROCEDIMIENTO = 260304;

/**
 * Pasos principales del proceso de solicitud.
 * Cada objeto representa un paso con su estado de activación y finalización.
 */
export const PANTA_PASOS = [
    {
      indice: 1,
      titulo: 'Capturar solicitud',
      activo: true,
      completado: false,
    },
    {
        indice: 2,
        titulo: 'Anexar requisitos',
        activo: false,
        completado: false,
    },
    {
        indice: 3,
        titulo: 'Firmar solicitud',
        activo: false,
        completado: false,
    },
];


/**
 * Configuración de columnas para la tabla de fabricantes.
 * Define los encabezados y claves para mostrar los datos de fabricantes en la tabla.
 */
export const FABRICANTE_TABLA: Array<{ encabezado: string; clave: keyof Fabricante }> = [
  { encabezado: 'Nombre/denominación o razón social', clave: 'nombre' },
  { encabezado: 'R.F.C', clave: 'rfc' },
  { encabezado: 'CURP', clave: 'curp' },
  { encabezado: 'Teléfono', clave: 'telefono' },
  { encabezado: 'Correo electrónico', clave: 'correoElectronico' },
  { encabezado: 'Calle', clave: 'calle' },
  { encabezado: 'Número exterior', clave: 'numeroExterior' },
  { encabezado: 'Número interior', clave: 'numeroInterior' },
  { encabezado: 'País', clave: 'pais' },
  { encabezado: 'Colonia', clave: 'colonia' },
  { encabezado: 'Municipio o alcaldía', clave: 'municipio' },
  { encabezado: 'Localidad', clave: 'localidad' },
  { encabezado: 'Entidad federativa', clave: 'entidadFederativa' },
  { encabezado: 'Estado/localidad', clave: 'estado' },
  { encabezado: 'Código postal', clave: 'cp' },
];


/**
 * Configuración de columnas para la tabla de otros terceros relacionados.
 * Define los encabezados y claves para mostrar los datos de otros terceros en la tabla.
 */
export const OTROS_TABLA:Array<{ encabezado: string; clave: keyof Otros260303 }> = [
  { encabezado: 'Tercero nombre descripción', clave: 'tercero' },
  { encabezado: 'Nombre/denominación o razón social', clave: 'nombre' },
  { encabezado: 'R.F.C', clave: 'rfc' },
  { encabezado: 'CURP', clave: 'curp' },
  { encabezado: 'Teléfono', clave: 'telefono' },
  { encabezado: 'Correo electrónico', clave: 'correoElectronico' },
  { encabezado: 'Calle', clave: 'calle' },
  { encabezado: 'Número exterior', clave: 'numeroExterior' },
  { encabezado: 'Número interior', clave: 'numeroInterior' },
  { encabezado: 'País', clave: 'pais' },
  { encabezado: 'Colonia', clave: 'colonia' },
  { encabezado: 'Municipio o alcaldía', clave: 'municipio' },
  { encabezado: 'Localidad', clave: 'localidad' },
  { encabezado: 'Entidad federativa', clave: 'entidadFederativa' },
  { encabezado: 'Estado/localidad', clave: 'estado' },
  { encabezado: 'Código postal', clave: 'cp' },
];

/**
 * Texto descriptivo para el primer paso del proceso de solicitud.
 */
export const PASO_UNO = 'Solicitud Exportación de Medicamentos que sean o contengan Estupefacientes o Psicotrópicos';
/**
 * Texto descriptivo para el segundo paso del proceso de solicitud.
 */
export const PASO_DOS = 'Cargar archivos';
/**
 * Texto descriptivo para el tercer paso del proceso de solicitud.
 */
export const PASO_TRES = 'Firmar';

/**
 * Configuración para el campo de fecha de pago.
 * Incluye etiqueta, si es requerido y si está habilitado.
 */
export const FECHA_PAGO = {
  labelNombre: 'Fecha de pago',
  required: false,
  habilitado: false,
};

/** Configuración de la tabla de sectores */
/**
 * Configuración de la tabla de sectores para datos de mercancías.
 * Define los encabezados, claves y orden para mostrar los datos en la tabla.
 */
export const CONFIGURACION_MERCANCIAS_DATOS : ConfiguracionColumna<MercanciasDatos>[] = [
    { encabezado: 'Clasificación del producto', clave: (item: MercanciasDatos) => item.clasificacion, orden: 1 },
    { encabezado: 'Especificar clasificación del producto', clave: (item: MercanciasDatos) => item.especificar, orden: 2 },
    { encabezado: 'Denominación común internacional (DCI) o Denominación genérica o nombre científico', clave: (item: MercanciasDatos) => item.dci, orden: 3 },
    { encabezado: 'Denominación distintiva', clave: (item: MercanciasDatos) => item.denominacion, orden: 4 },
    { encabezado: 'Número CAS', clave: (item: MercanciasDatos) => item.numeroCas, orden: 5 },
    { encabezado: 'Fracción arancelaria', clave: (item: MercanciasDatos) => item.fraccion, orden: 6 },
    { encabezado: 'Descripción de la fracción', clave: (item: MercanciasDatos) => item.descripcionDeLa, orden: 7 },
    { encabezado: 'Cantidad UMC', clave: (item: MercanciasDatos) => item.cantidadUmc, orden: 8 },
    { encabezado: 'Cantidad de lotes', clave: (item: MercanciasDatos) => item.cantidad, orden: 9 },
    { encabezado: 'Kg o g por lote', clave: (item: MercanciasDatos) => item.kg, orden: 10 },
    { encabezado: 'Numero de piezas a fabricar ', clave: (item: MercanciasDatos) => item.numeroFabricar, orden: 11 },
    { encabezado: 'Descripcion del numero de piezas a fabricar', clave: (item: MercanciasDatos) => item.descripcionFabricar, orden: 12 },
    { encabezado: 'Presentación', clave: (item: MercanciasDatos) => item.presentacion, orden: 13 },
    { encabezado: 'Número de registro sanitario', clave: (item: MercanciasDatos) => item.registroSanitario, orden: 14 },
    { encabezado: 'Uso específico', clave: (item: MercanciasDatos) => item.uso, orden: 15 },
    { encabezado: 'Detallar uso específico', clave: (item: MercanciasDatos) => item.detalle, orden: 16 },
    { encabezado: 'País de destino', clave: (item: MercanciasDatos) => item.paisDeDestino, orden: 17 },
    { encabezado: 'País de origen', clave: (item: MercanciasDatos) => item.paisDeOrigen, orden: 18 },
    { encabezado: 'País de procedencia', clave: (item: MercanciasDatos) => item.paisDeProcedencia, orden: 19},
    { encabezado: 'Forma farmacéutica', clave: (item: MercanciasDatos) => item.formaFarmaceutica, orden: 20 },
    { encabezado: 'UMC', clave: (item: MercanciasDatos) => item.umc, orden: 21 },
    { encabezado: 'Cantidad UMT', clave: (item: MercanciasDatos) => item.cantidadUmt, orden: 22 },
    { encabezado: 'Unidad de medida de tarifa (UMT)', clave: (item: MercanciasDatos) => item.umt, orden: 23 },
    { encabezado: 'Tipo de Producto', clave: (item: MercanciasDatos) => item.tipoDeProducto, orden: 24 },
  ];

/**
 * Configuración de la tabla de mercancías específica para el procedimiento 260304.
 * Define los encabezados, claves y orden para mostrar los datos en la tabla.
 * Excluye los campos "Numero de piezas a fabricar" y "Descripcion del numero de piezas a fabricar".
 */
export const CONFIGURACION_MERCANCIAS_DATOS_260304 : ConfiguracionColumna<MercanciasDatos>[] = [
    { encabezado: 'Clasificación del producto', clave: (item: MercanciasDatos) => item.clasificacion, orden: 1 },
    { encabezado: 'Especificar clasificación del producto', clave: (item: MercanciasDatos) => item.especificar, orden: 2 },
    { encabezado: 'Denominación común internacional (DCI) o Denominación genérica o nombre científico', clave: (item: MercanciasDatos) => item.dci, orden: 3 },
    { encabezado: 'Denominación distintiva', clave: (item: MercanciasDatos) => item.denominacion, orden: 4 },
    { encabezado: 'Número CAS', clave: (item: MercanciasDatos) => item.numeroCas, orden: 5 },
    { encabezado: 'Fracción arancelaria', clave: (item: MercanciasDatos) => item.fraccion, orden: 6 },
    { encabezado: 'Descripción de la fracción', clave: (item: MercanciasDatos) => item.descripcionDeLa, orden: 7 },
    { encabezado: 'Cantidad UMC', clave: (item: MercanciasDatos) => item.cantidadUmc, orden: 8 },
    { encabezado: 'Cantidad de lotes', clave: (item: MercanciasDatos) => item.cantidad, orden: 9 },
    { encabezado: 'Número de registro sanitario', clave: (item: MercanciasDatos) => item.registroSanitario, orden: 10 },
    { encabezado: 'Presentación', clave: (item: MercanciasDatos) => item.presentacion, orden: 11 },
    { encabezado: 'Uso específico', clave: (item: MercanciasDatos) => item.uso, orden: 12 },
    { encabezado: 'Detallar uso específico', clave: (item: MercanciasDatos) => item.detalle, orden: 13 },
    { encabezado: 'País de destino', clave: (item: MercanciasDatos) => item.paisDeDestino, orden: 14 },
    { encabezado: 'Forma farmacéutica', clave: (item: MercanciasDatos) => item.formaFarmaceutica, orden: 15 },
    { encabezado: 'UMC', clave: (item: MercanciasDatos) => item.umc, orden: 16 },
    { encabezado: 'Cantidad UMT', clave: (item: MercanciasDatos) => item.cantidadUmt, orden: 17 },
    { encabezado: 'Unidad de medida de tarifa (UMT)', clave: (item: MercanciasDatos) => item.umt, orden: 18 },
    { encabezado: 'Tipo de Producto', clave: (item: MercanciasDatos) => item.tipoDeProducto, orden: 19 },
  ];

  /**
 * Opciones para los campos de selección tipo radio: "No" y "Sí".
 */
  /**
   * Opciones para los campos de selección tipo radio: "No" y "Sí".
   * Cada opción tiene una etiqueta y un valor asociado.
   */
  export const RADIO_OPCIONES = [
    {
      "label": "No",
      "value": 1
    },
    {
      "label": "Sí",
      "value": 2
    }
  ];

  /**
   * Constante para configurar el input de fecha.
   * Define las propiedades del campo de entrada de fecha.
   */
  /**
   * Constante para configurar el input de fecha.
   * Define las propiedades del campo de entrada de fecha, incluyendo etiqueta, obligatoriedad y habilitación.
   */
   export const INPUT_FECHA_CONFIG = {
        /**
         * Propiedad labelNombre
         * Descripción: Etiqueta que se muestra como nombre del campo.
         */
        labelNombre: 'Fecha de pago',
      
        /**
         * Propiedad required
         * Descripción: Indica si el campo es obligatorio.
         */
        required: true,
      
        /**
         * Propiedad habilitado
         * Descripción: Indica si el campo está habilitado para su edición.
         */
        habilitado: true,
      }

/**
 * Configuración de columnas para la tabla SCIAN.
 * Define los encabezados y claves para mostrar los datos de SCIAN en la tabla.
 */
/**
 * Configuración de columnas para la tabla SCIAN.
 * Define los encabezados y claves para mostrar los datos de SCIAN en la tabla.
 */
export const CONFIGURACION_TABLA_SCIAN: ConfiguracionColumna<ScianDatos>[] = [
  { encabezado: 'Clave S.C.I.A.N.', clave: (item: ScianDatos) => item.clave, orden: 1 },
  { encabezado: 'Descripción del S.C.I.A.N.', clave: (item: ScianDatos) => item.descripcion, orden: 2 }
];

/**
 * Configuración de columnas para la tabla Producto Terminado.
 * Define los encabezados y claves para mostrar los datos de productos terminados en la tabla for 260304.
 */
export const CONFIGURACION_TABLA_PRODUCTO_TERMINADO_260304: ConfiguracionColumna<ProductoTerminado>[] = [
  { encabezado: 'Cantidad', clave: (item: ProductoTerminado) => item.clave, orden: 1 },
  { encabezado: 'Presentacion', clave: (item: ProductoTerminado) => item.descripcion, orden: 2 },
  { encabezado: 'Registro sanitario', clave: (item: ProductoTerminado) => item.descripcion, orden: 3 }
];

/**
 * Configuración de columnas para la tabla Producto Terminado.
 * Define los encabezados y claves para mostrar los datos de productos terminados en la tabla.
 */
export const CONFIGURACION_TABLA_PRODUCTO_TERMINADO: ConfiguracionColumna<ProductoTerminadoDos>[] = [
 
  { encabezado: 'Presentacion', clave: (item: ProductoTerminadoDos) => item.presentacion, orden: 1 },
  { encabezado: 'Numero de piezas', clave: (item: ProductoTerminadoDos) => item.numeroFabricar, orden: 2 },
  { encabezado: 'Descripción del número de piezas a fabricar', clave: (item: ProductoTerminadoDos) => item.descripcionDePiezas, orden: 3},
  { encabezado: 'Registro sanitario', clave: (item: ProductoTerminadoDos) => item.registroSanitario, orden: 4 }
];

	/**
	 * Constante que define el mensaje de error para validación de formularios.
	 * 
	 * Este mensaje se utiliza para informar al usuario que faltan campos por capturar
	 * antes de poder continuar al siguiente paso del trámite.
	 */
	export const ERROR_FORMA_ALERT = `
	<div class="d-flex justify-content-center text-center">
	  <div>
	    <div class="col-md-12 campos-requeridos">
	      <p>¡Error de registro! Faltan campos por capturar.</p>
	    </div>
	  </div>
	</div>
`;