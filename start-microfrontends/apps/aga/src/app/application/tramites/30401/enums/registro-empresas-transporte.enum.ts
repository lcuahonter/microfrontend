
import {
  AgentesTabla,
  RegistroVehiculos,
  VehiculosTabla,
} from '../modelos/registro-empresas-transporte.model';

/**
 * Objeto que contiene varias notas utilizadas en la aplicación.
 *
 * Cada nota proporciona información o instrucciones específicas:
 */
export const NOTA = {
  EFECTUAR_EL_PAGO:
    'Efectuar el pago de derechos a través del esquema electrónico eScinco, a que se refiere la regla 1 1 5, el pago de derechos previsto en el artículo 40, inciso J) de la Ley Federal de Derechos ($monto_pago)',
  DEBES_CAPTURAR:
    'Nota: Debes capturar todos los campos de pago de aprovechamiento',
  CAPITAL_SOCIAL_NOTA:
    '* El capital social de la persona moral por lo menos es de $3,113,240 00 M N',
  MI_REPRESENTADA_NOTA:
    '* Mi representada, por este conducto, se hace responsable solidaria con el titular del tránsito Interno de todos los embarques en que mi representada participe como transportista en los términos de los artículos (129 y 133, según sea el caso) de la Ley Aduanera, respecto de las mercancias que se destinen al régimen de tránsito Interno, responsabilizándose desde este momento de los créditos fiscales que se originen con mativo de fas infracciones cometidas durante el trayecto de las mercancías, desde la aduana de inicio hasta la de cierre del tránsito, inclusive la desviación de la ruta fiscal, el arribo extemporaneo, e no arrido de las mercancias o las irregularidades detectadas al practicar el reconocimiento aduanero o la verificación de mercancias en transporte',
  CONFIRMACION_VEHICULO: 'EL vehiculo fue agregado Correctamente.',
};

/**
 * Matriz de opciones para botones de radio.
 *
 * Cada objeto representa una opción de botón de radio con:
 * - `label`: El texto mostrado a la usuaria.
 * - `value`: El valor correspondiente de la opción.
 */
export const OPCIONES_DE_BOTON_DE_RADIO = [
  {
    label: 'Sí',
    value: '1',
  },
  {
    label: 'No',
    value: '0',
  },
];

/**
 * @constante
 * @nombre AGENTES_TABLA_DATOS
 * @descripción
 * Una matriz que define las columnas y claves para la tabla de agentes aduanales.
 * Cada objeto en la matriz representa una columna con su encabezado, clave y orden.
 *
 * @tipo {Array<{encabezado: string, clave: (item: AgentesTabla) => string, orden: number}>}
 * @ejemplo
 * AGENTES_TABLA_DATOS[0].encabezado; // "Nombre(s)"
 */
export const AGENTES_TABLA_DATOS = [
  {
    encabezado: 'Nombre(s)',
    clave: (item: AgentesTabla): string => item.nombreAgente,
    orden: 1,
  },
  {
    encabezado: 'Primer Apellido',
    clave: (item: AgentesTabla): string => item.primerApellido,
    orden: 2,
  },
  {
    encabezado: 'Segundo Apellido',
    clave: (item: AgentesTabla): string => item.segundoApellido,
    orden: 3,
  },
  {
    encabezado: 'Número de patente de agente aduanal',
    clave: (item: AgentesTabla): string => item.patente,
    orden: 4,
  },
];

/**
 * @constante
 * @nombre CROSLISTA_ENTRADA
 * @descripción
 * Una lista de cadenas que representan diversos puntos de entrada aduaneros en México.
 * Esta constante se utiliza para definir las opciones disponibles en operaciones relacionadas con aduanas.
 *
 * @tipo {string[]}
 * @ejemplo
 * CROSLISTA_ENTRADA[0]; // "ACAPULCO, PUERTO Y AEROPUERTO"
 */
export const REGISTRO_VEHICULOS = [
  {
    encabezado: 'Marca',
    clave: (item: RegistroVehiculos): string => item.solicitud.marca,
    orden: 1,
  },
  {
    encabezado: 'Modelo (s)',
    clave: (item: RegistroVehiculos): string => item.solicitud.modelo,
    orden: 2,
  },
  {
    encabezado: 'Número de identificación vehicular o serie del vehículo',
    clave: (item: RegistroVehiculos): string => item.solicitud.idVehiculoSerie,
    orden: 3,
  },
  {
    encabezado: 'Número de caja',
    clave: (item: RegistroVehiculos): string => item.solicitud.caja,
    orden: 4,
  },
  {
    encabezado: 'Domicilio para la verificación del vehículo',
    clave: (item: RegistroVehiculos): string =>
      item.direccionVehiculo.calleVehiculo,
    orden: 5,
  },
  
  {
    encabezado: 'Aduana',
    clave: (item: RegistroVehiculos): string =>
      item.direccionVehiculo.comboAduanaVehiculo,
    orden: 6,
  },
  {
    encabezado: 'Nombre de contacto en la circunscripción de la aduana',
    clave: (item: RegistroVehiculos): string => item.persona.nombre,
    orden: 7,
  },
  {
    encabezado: 'Correo electrónico',
    clave: (item: RegistroVehiculos): string => item.persona.apellidoPaterno,
    orden: 8,
  },
  {
    encabezado: 'Teléfono',
    clave: (item: RegistroVehiculos): string => item.persona.telefonoContacto,
    orden: 9,
  },
];

export const VEHICULOS_TABLA_DATOS = [
  {
    encabezado: 'Marca',
    clave: (item: VehiculosTabla): string => item.marca,
    orden: 1,
  },
  {
    encabezado: 'Modelo (s)',
    clave: (item: VehiculosTabla): string => item.modelo,
    orden: 2,
  },
  {
    encabezado: 'Número de identificación vehicular o serie del vehículo',
    clave: (item: VehiculosTabla): string => item.vin,
    orden: 3,
  },
];
