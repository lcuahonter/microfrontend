import { ConfiguracionColumna } from "@libs/shared/data-access-user/src";
import { TercerosTablaInfo } from "@libs/shared/data-access-user/src/core/models/32614/dato-comunes.model";

/**
 * Configuración de columnas para la tabla de Número de Empleados.
 * Cada objeto en el arreglo define los detalles de una columna.
 * La clave indica el valor que se mostrará y el orden define la posición de la columna en la tabla.
 */
export const TERCEROS: ConfiguracionColumna<TercerosTablaInfo>[] =
  [
    {
      encabezado: 'RFC',
      clave: (item: TercerosTablaInfo) => item.rfc,
      orden: 1,
    },
    {
      encabezado: 'Nombre',
      clave: (item: TercerosTablaInfo) => item.nombre,
      orden: 2,
    },
    {
      encabezado: 'Apellido Paterno',
      clave: (item: TercerosTablaInfo) => item.apellidoPaterno,
      orden: 3,
    },
    {
      encabezado: 'Apellido Materno',
      clave: (item: TercerosTablaInfo) => item.apellidoMaterno,
      orden: 4,
    },
    {
      encabezado: 'Ciudad o Estado de Residencia',
      clave: (item: TercerosTablaInfo) => item.ciudadOEstadoDeResidencia,
      orden: 5,
    },
    {
      encabezado: 'Cargo o Puesto',
      clave: (item: TercerosTablaInfo) => item.cargoOPuesto,
      orden: 6,
    },
    {
      encabezado: 'Teléfono',
      clave: (item: TercerosTablaInfo) => item.telefono,
      orden: 7,
    },
    {
      encabezado: 'Correo Electrónico',
      clave: (item: TercerosTablaInfo) => item.correoElectronico,
      orden: 8,
    },
    {
      encabezado: 'Suplente',
      clave: (item: TercerosTablaInfo) => item.suplente,
      orden: 9,
    },
  ];

  
/** Tabla con el número de empleados registrados, RFC y bimestre correspondiente. */
export const TERCEROS_TABLA = [
  {
    rfc: 'SIN123456789',
    nombre: 'SINE S.A. de C.V.',
    apellidoPaterno: '25',
    apellidoMaterno: 'Enero-Febrero',
    ciudadOEstadoDeResidencia: 'SIN123456789',
    cargoOPuesto: 'SINE S.A. de C.V.',
    telefono: '25',
    correoElectronico: 'Enero-Febrero',
    suplente: 'SINE S.A. de C.V.'
  }
]
