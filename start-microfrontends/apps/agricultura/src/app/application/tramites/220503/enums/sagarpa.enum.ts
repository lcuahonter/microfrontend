import { ConfiguracionColumna } from "@libs/shared/data-access-user/src";
import { FilaSolicitudTabla } from "../models/datos-generales.model";
import { Solicitud } from "../models/solicitud-pantallas.model";

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
    }
  ];

  /** 
 * Constante que define las opciones disponibles para el botón de radio. 
 * Se utiliza para capturar la selección del usuario en el formulario.
 * 
 * - "Animales Vivos" tiene un valor de '1'.
 * - "Productos Subproductos" tiene un valor de '0'.
 */
  export const CAPTURA_OPCIONES_DE_BOTON_DE_RADIO = [
    {
        label: 'Animales Vivos',
        value: '1',
      },
      {
        label: 'Productos Subproductos',
        value: '0',
      }
  ];


  export const MERCANCIA = [
    {
      Partida: 1,
      Tiporequisito: 'Inspección ocular',
      Requisito: 'Requisito',
      Certificado: 'ABC123',
      Fraccion: '01039201',
      Descripcion: 'Con pedigree o certificado de alto registro.',
      Nico: '00',
    },
    {
      Partida: 2,
      Tiporequisito: 'Inspección de oído',
      Requisito: 'Requisito',
      Certificado: 'DEF456',
      Fraccion: '02039402',
      Descripcion: 'Sin pedigree, certificado básico.',
      Nico: '01',
    },
    {
      Partida: 3,
      Tiporequisito: 'Inspección de nariz',
      Requisito: 'Requisito',
      Certificado: 'GHI789',
      Fraccion: '03039503',
      Descripcion: 'Con registro nacional.',
      Nico: '02',
    },
  ];
export const CONFIGURACION_COLUMNAS_TABLA: ConfiguracionColumna<FilaSolicitudTabla>[] = [
  {
    encabezado: 'No. partida',
    clave: (solicitud) => solicitud.Partida,
    orden: 1
  },
  {
    encabezado: 'Tipo de requisito',
    clave: (solicitud) => solicitud.Tiporequisito,
    orden: 2
  },
  {
    encabezado: 'Requisito',
    clave: (solicitud) => solicitud.Requisito,
    orden: 3
  },
  {
    encabezado: 'Número de certificado internacional',
    clave: (solicitud) => solicitud.Certificado,
    orden: 4
  },
  {
    encabezado: 'Fracción arancelaria',
    clave: (solicitud) => solicitud.Fraccion,
    orden: 5
  },
  {
    encabezado: 'Descripción de la fracción',
    clave: (solicitud) => solicitud.Descripcion,
    orden: 6
  },
  {
    encabezado: 'Nico',
    clave: (solicitud) => solicitud.Nico,
    orden: 7
  }
  ];
  
  export const CONFIGURACION_COLUMNA_SOLICITUD: ConfiguracionColumna<Solicitud>[] = [
    {
      encabezado: 'Fecha de creación',
      clave: (solicitud) => solicitud.fechaCreacion,
      orden: 1
    },
    {
      encabezado: 'Mercancía',
      clave: (solicitud) => solicitud.mercancia,
      orden: 2
    },
    {
      encabezado: 'Cantidad',
      clave: (solicitud) => solicitud.cantidad,
      orden: 3
    },
    {
      encabezado: 'Proveedor',
      clave: (solicitud) => solicitud.proovedor,
      orden: 4
    }
  ];