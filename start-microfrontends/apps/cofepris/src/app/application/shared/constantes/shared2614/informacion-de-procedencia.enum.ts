import { ConfiguracionColumna } from '@ng-mf/data-access-user';

/**
 * Interfaz que representa la información de un destinatario.
 * Contiene los datos personales y de contacto del destinatario, así como su dirección.
 */
export interface InformaciondeProcedencia {
  /** Nombre completo del destinatario. */
  nombre: string;

  /** Registro Federal de Contribuyentes (RFC) del destinatario. */
  rfc: string;

  /** Clave Única de Registro de Población (CURP) del destinatario. */
  curp: string;

  /** Número telefónico de contacto del destinatario. */
  telefono: string;

  /** Correo electrónico del destinatario. */
  correoElectronico: string;

  /** Calle correspondiente al domicilio del destinatario. */
  calle: string;

  /** Número exterior del domicilio del destinatario. */
  numeroExterior: string;

  /** Número interior del domicilio del destinatario, si aplica. */
  numeroInterior: string;

  /** País donde reside el destinatario. */
  pais: string;

  /** Colonia del domicilio del destinatario. */
  colonia: string;

  /** Municipio donde reside el destinatario. */
  municipio: string;

  /** Localidad específica del domicilio del destinatario. */
  localidad: string;

  /** Estado asociado al domicilio del destinatario. */
  estado: string;

  /** Estado alternativo (o subdivisión administrativa) asociado al domicilio del destinatario, si aplica. */
  estado2: string;

  /** Código postal del domicilio del destinatario. */
  codigo: string;
}

/**
 * Configuración de las columnas para mostrar la información de los destinatarios en una tabla.
 * Define los encabezados, claves y el orden de las columnas.
 */
export const DESTINATARIO_ENCABEZADO_DE_TABLA: ConfiguracionColumna<InformaciondeProcedencia>[] = [
  {
    encabezado: 'Nombre/denominación o razón social',
    clave: (item: InformaciondeProcedencia) => item.nombre,
    orden: 1,
  },
  {
    encabezado: 'R.F.C.',
    clave: (item: InformaciondeProcedencia) => item.rfc,
    orden: 2,
  },
  {
    encabezado: 'CURP',
    clave: (item: InformaciondeProcedencia) => item.curp,
    orden: 3,
  },
  {
    encabezado: 'Teléfono',
    clave: (item: InformaciondeProcedencia) => item.telefono,
    orden: 4,
  },
  {
    encabezado: 'Correo electrónico',
    clave: (item: InformaciondeProcedencia) => item.correoElectronico,
    orden: 5,
  },
  {
    encabezado: 'Calle',
    clave: (item: InformaciondeProcedencia) => item.calle,
    orden: 6,
  },
  {
    encabezado: 'Número exterior',
    clave: (item: InformaciondeProcedencia) => item.numeroExterior,
    orden: 7,
  },
  {
    encabezado: 'Número interior',
    clave: (item: InformaciondeProcedencia) => item.numeroInterior,
    orden: 8,
  },
  {
    encabezado: 'País',
    clave: (item: InformaciondeProcedencia) => item.pais,
    orden: 9,
  },
  {
    encabezado: 'Colonia',
    clave: (item: InformaciondeProcedencia) => item.colonia,
    orden: 10,
  },
  {
    encabezado: 'Municipio o alcaldía',
    clave: (item: InformaciondeProcedencia) => item.municipio,
    orden: 11,
  },
  {
    encabezado: 'Localidad',
    clave: (item: InformaciondeProcedencia) => item.localidad,
    orden: 12,
  },
  {
    encabezado: 'Estado',
    clave: (item: InformaciondeProcedencia) => item.estado,
    orden: 13,
  },
  {
    encabezado: 'Estado',
    clave: (item: InformaciondeProcedencia) => item.estado2,
    orden: 14,
  },
  {
    encabezado: 'Código postal',
    clave: (item: InformaciondeProcedencia) => item.codigo,
    orden: 15,
  },
];