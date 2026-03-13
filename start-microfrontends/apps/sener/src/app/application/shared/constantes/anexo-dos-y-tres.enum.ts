import { AnexoDosEncabezado, AnexoEncabezado , AnexoUnoEncabezado, ProveedorClienteTabla, ProyectoImmexEncabezado } from "../models/nuevo-programa-industrial.model";

export const ANEXO_SERVICIO = [
  {
    encabezado: 'Fracción arancelaria',
    clave: (ele: AnexoEncabezado):string => ele.encabezadoFraccion,
    orden: 1
  },
  {
    encabezado: 'Descripción',
    clave: (ele: AnexoEncabezado) :string=> ele.encabezadoDescripcion,
    orden: 2
  }
]

export const ANEXO_TRES_ALERTA = `<p>
Herramientas, equipos y accesorios de investigación, de seguridad industrial y de productos necesarios para la higiene, asepsia, y para la prevención y control de la contaminación ambiental de la planta productiva, manuales de trabajo y planos industriales, así como equipo de telecomunicación y cómputo. Maquinaria, aparatos, instrumentos y refacciones para el proceso productivo, equipo de laboratorio, de medición y de prueba de sus productos y los departamentos que con ellos se relacionen; capacitación de su personal; equipo para el manejo de materiales relacionados directamente con los bienes de exportación y otros vinculados con el proceso productivo; así como equipo para el desarrollo administrativo de la empresa, a importar al amparo del programa.</p>`

export const ANEXO_UNO_ALERTA = `<p>
Materiales primas, partes, componentes, materiales auxiliares, envases, material de empaque, etiquetas, folletos, combustibles y lubricantes que se utilicen en el proceso de producción o de servicios de las mercancías de exportación.
</p>`

export const ANEXO_I_SERVICIO = [
  {
    encabezado: 'Fracción',
    clave: (ele: AnexoUnoEncabezado):string => ele.encabezadoFraccion,
    orden: 1
  },
  {
    encabezado: 'Fracción arancelaria',
    clave: (ele: AnexoUnoEncabezado) :string=> ele.encabezadoFraccionArancelaria,
    orden: 2
  },
  {
    encabezado: 'Descripción comercial',
    clave: (ele: AnexoUnoEncabezado):string => ele.encabezadoDescripcionComercial,
    orden: 3
  },
  {
    encabezado: 'Anexo II',
    clave: (ele: AnexoUnoEncabezado):string => ele.encabezadoAnexoII,
    orden: 4
  },
  {
    encabezado: 'Tipo',
    clave: (ele: AnexoUnoEncabezado):string => ele.encabezadoTipo,
    orden: 5
  },
  {
    encabezado: 'UMT',
    clave: (ele: AnexoUnoEncabezado) :string=> ele.encabezadoUmt,
    orden: 6
  },
  {
    encabezado: 'Categoría',
    clave: (ele: AnexoUnoEncabezado):string => ele.encabezadoCategoria,
    orden: 7
  },
  {
    encabezado: 'Valor en mercado',
    clave: (ele: AnexoUnoEncabezado):string => ele.encabezadoValorEnMercado,
    orden: 8
  },
]

export const ANEXO_IMPORTACION_SERVICIO = [
  {
    encabezado: 'Fracción',
    clave: (ele: AnexoDosEncabezado):string => ele.encabezadoFraccion,
    orden: 1
  },
  {
    encabezado: 'Fracción arancelaria del producto de exportación',
    clave: (ele: AnexoDosEncabezado):string => ele.encabezadoFraccionExportacion,
    orden: 2
  },
  {
    encabezado: 'Descripción comercial',
    clave: (ele: AnexoDosEncabezado):string => ele.encabezadoDescripcionComercial,
    orden: 3
  },
  {
    encabezado: 'Fracción arancelaria de la mercancía de importación',
    clave: (ele: AnexoDosEncabezado):string => ele.encabezadoFraccionImportacion,
    orden: 4
  }

  
]
export const PROVEEDOR_CLIENTE_TABLA_CONFIG=[
  {
    encabezado: 'Fracción',
    clave: (ele: ProveedorClienteTabla):string | undefined=> ele.fraccion,
    orden: 1
  },
  {
    encabezado: 'Pais de origen',
    clave: (ele: ProveedorClienteTabla):number |undefined => ele.paisDeOrigin,
    orden: 2
  },
  {
    encabezado: 'Razón Social Proveedor',
    clave: (ele: ProveedorClienteTabla):string | undefined => ele.razonSocialProveedor,
    orden: 3
  },
  {
    encabezado: 'Pais destino',
    clave: (ele: ProveedorClienteTabla):string => ele.paisDestino,
    orden: 4
  },
  {
    encabezado: 'RFC/Tax ID Cliente',
    clave: (ele: ProveedorClienteTabla) :string=> ele.rfcClinte,
    orden: 5
  },
  {
    encabezado: 'Razón Social',
    clave: (ele: ProveedorClienteTabla) :string=> ele.razonSocial,
    orden: 6
  }
]

export const PROYECTO_IMMEX_CONFIG=[
  {
    encabezado: 'Fracción',
    clave: (ele: ProyectoImmexEncabezado):string => ele.encabezadoFraccion,
    orden: 1
  },
  {
    encabezado: 'Tipo document',
    clave: (ele: ProyectoImmexEncabezado):string => ele.encabezadoTipoDocument,
    orden: 2
  },
  {
    encabezado: 'Descripción otro',
    clave: (ele: ProyectoImmexEncabezado):string => ele.encabezadoDescripcionOtro,
    orden: 3
  },
  {
    encabezado: 'Fecha firma',
    clave: (ele: ProyectoImmexEncabezado) :string=> ele.encabezadoFechaFirma,
    orden: 4
  },
  {
    encabezado: 'Fecha fin vigencia',
    clave: (ele: ProyectoImmexEncabezado):string => ele.encabezadoFechaVigencia,
    orden: 5
  },
  {
    encabezado: 'RFC de la parte firmante',
    clave: (ele: ProyectoImmexEncabezado):string => ele.encabezadoRfc,
    orden: 6
  },
  {
    encabezado: 'Nómbre/Razón social de la parte firmante',
    clave: (ele: ProyectoImmexEncabezado):string => ele.encabezadoRazonFirmante,
    orden: 7
  }
]
