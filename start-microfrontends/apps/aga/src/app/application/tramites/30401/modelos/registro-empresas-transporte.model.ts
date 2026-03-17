/**
 * @interfaz
 * @nombre VehiculosTabla
 * @descripción
 * Define la estructura de los datos de la tabla de vehículos.
 * Contiene información básica sobre los vehículos, como marca, modelo y VIN.
 */
export interface VehiculosTabla {
  id: number; // Identificador único del vehículo.
  marca: string; // Marca del vehículo.
  modelo: string; // Modelo del vehículo.
  vin: string; // Número de identificación vehicular (VIN).
}

/**
 * @interfaz
 * @nombre AgentesTabla
 * @descripción
 * Define la estructura de los datos de la tabla de agentes aduanales.
 * Contiene información sobre los agentes, como nombreAgente, apellidos y número de patente.
 */
export interface AgentesTabla {
  id: number; // Identificador único del agente.
  nombreAgente: string; // Nombres del agente.
  primerApellido: string; // Primer apellido del agente.
  segundoApellido: string; // Segundo apellido del agente.
  patente: string; // Número de patente del agente aduanal.
}

/**
 * @interfaz
 * @nombre RegistroVehiculos
 * @descripción
 * Define la estructura de los datos para el registro de vehículos.
 * Contiene información sobre la solicitud, dirección del vehículo y datos de la persona asociada.
 */
export interface RegistroVehiculos {
  id: number; // Identificador único del registro.

  /**
   * @propiedad
   * @nombre solicitud
   * @descripción
   * Información relacionada con la solicitud del vehículo.
   */
  solicitud: {
    marca: string; // Marca del vehículo.
    modelo: string; // Modelo del vehículo.
    idVehiculoSerie: string; // Número de identificación vehicular (VIN).
    caja: string; // Número de caja del vehículo.
  };

  /**
   * @propiedad
   * @nombre direccionVehiculo
   * @descripción
   * Información sobre la dirección asociada al vehículo.
   */
  direccionVehiculo: {
    calleVehiculo: string; // Calle del domicilio del vehículo.
    numExteriorVehiculo: string; // Número exterior del domicilio.
    numInteriorVehiculo: string; // Número interior del domicilio.
    comboEntidadVehiculo: string; // Entidad federativa del domicilio.
    comboDelegacionVehiculo: string; // Delegación o municipio del domicilio.
    comboColoniaVehiculo: string; // Colonia del domicilio.
    localidadVehiculo: string; // Localidad del domicilio.
    codigoPostalVehiculo: string; // Código postal del domicilio.
    comboAduanaVehiculo: string; // Aduana asociada al vehículo.
  };

  /**
   * @propiedad
   * @nombre persona
   * @descripción
   * Información sobre la persona asociada al registro del vehículo.
   */
  persona: {
    nombre: string; // Nombre de la persona.
    apellidoPaterno: string; // Apellido paterno de la persona.
    apellidoMaterno: string; // Apellido materno de la persona.
    correoElectronico: string; // Correo electrónico de la persona.
    telefonoContacto: string; // Teléfono de contacto de la persona.
  };
}
