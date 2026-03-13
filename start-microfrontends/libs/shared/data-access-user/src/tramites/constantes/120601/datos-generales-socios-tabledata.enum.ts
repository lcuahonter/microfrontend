interface Socios {
  rfc: string;
  razonsocial: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoM: string;
  correo: string;
}

interface Extranjeros {
  taxID: string;
  razonSocial: string;
  nombre: string;
  apellidoPaterno: string;
  pais: string;
  codigoPostal: string;
  estado: string;
  correo: string;
}

interface Representacion {
  calle: string;
  numeroExterior: string;
  numeroInterior: string;
  codigoPostal: string;
  colonia: string;
  municipio: string;
  estado: string;
  pais: string;
  localidad: string;
  telefono: string;
}

export const DATOS_GENERALES_SOCIOS = [
  {
    encabezado: 'RFC',
    clave: (ele: Socios): string => ele.rfc,
    orden: 1,
  },
  {
    encabezado: 'Razón social',
    clave: (ele: Socios): string => ele.razonsocial,
    orden: 2,
  },
  {
    encabezado: 'Nombre',
    clave: (ele: Socios): string => ele.nombre,
    orden: 3,
  },
  {
    encabezado: 'Apellido paterno',
    clave: (ele: Socios): string => ele.apellidoPaterno,
    orden: 4,
  },
  {
    encabezado: 'Apellido materno',
    clave: (ele: Socios): string => ele.apellidoM,
    orden: 5,
  },
  {
    encabezado: 'Correo',
    clave: (ele: Socios): string => ele.correo,
    orden: 6,
  },
];

export const DATOS_GENERALES_EXTRANJEROS = [
  {
    encabezado: 'TAX ID',
    clave: (ele: Extranjeros): string => ele.taxID,
    orden: 1,
  },
  {
    encabezado: 'Razón social',
    clave: (ele: Extranjeros): string => ele.razonSocial,
    orden: 2,
  },
  {
    encabezado: 'Nombre',
    clave: (ele: Extranjeros): string => ele.nombre,
    orden: 3,
  },
  {
    encabezado: 'Apellido paterno',
    clave: (ele: Extranjeros): string => ele.apellidoPaterno,
    orden: 4,
  },
  {
    encabezado: 'Pais',
    clave: (ele: Extranjeros): string => ele.pais,
    orden: 5,
  },
  {
    encabezado: 'CP',
    clave: (ele: Extranjeros): string => ele.codigoPostal,
    orden: 6,
  },
  {
    encabezado: 'Estado',
    clave: (ele: Extranjeros): string => ele.estado,
    orden: 7,
  },
  {
    encabezado: 'Correo',
    clave: (ele: Extranjeros): string => ele.correo,
    orden: 8,
  },
];

export const DATOS_GENERALES_REPRESENTACION = [
  {
    encabezado: 'Calle',
    clave: (ele: Representacion): string => ele.calle,
    orden: 1,
  },
  {
    encabezado: 'Número exterior',
    clave: (ele: Representacion): string => ele.numeroExterior,
    orden: 2,
  },
  {
    encabezado: 'Número interior',
    clave: (ele: Representacion): string => ele.numeroInterior,
    orden: 3,
  },
  {
    encabezado: 'Código postal',
    clave: (ele: Representacion): string => ele.codigoPostal,
    orden: 4,
  },
  {
    encabezado: 'Colonia',
    clave: (ele: Representacion): string => ele.colonia,
    orden: 5,
  },
  {
    encabezado: 'Municipio o alcaldía',
    clave: (ele: Representacion): string => ele.municipio,
    orden: 6,
  },
  {
    encabezado: 'Estado',
    clave: (ele: Representacion): string => ele.estado,
    orden: 7,
  },
   {
    encabezado: 'Pais',
    clave: (ele: Representacion): string => ele.pais,
    orden: 8,
  },
   {
    encabezado: 'Localidad',
    clave: (ele: Representacion): string => ele.localidad,
    orden: 9,
  },
   {
    encabezado: 'Teléfono',
    clave: (ele: Representacion): string => ele.telefono,
    orden: 10,
  },
];