 
 
/**
 * Representa los datos personales de una persona.
 *
 * @property nombre - Nombre(s) de la persona.
 * @property apellidoPaterno - Apellido paterno de la persona.
 * @property apellidoMaterno - Apellido materno de la persona.
 * @property curp - CURP (Clave Única de Registro de Población) de la persona.
 * @property resultadoIDC - Resultado de la identificación (IDC) de la persona.
 * @property rfc - RFC (Registro Federal de Contribuyentes) de la persona.
 */
 export interface DatosPersona {
          nombre?: string;
          apellidoPaterno?: string;
          apellidoMaterno?: string;
          curp?: string;
          resultadoIDC?: string;
          rfc?: string;
        }