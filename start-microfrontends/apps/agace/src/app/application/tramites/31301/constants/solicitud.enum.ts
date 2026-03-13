import { ConfiguracionColumna } from '@libs/shared/data-access-user/src';
import { Domicilios } from '../models/solicitud.model';
import { RecibirNotificaciones } from '../models/solicitud.model';
import { SeccionSociosIC } from '../models/solicitud.model';
import { SubContratistas } from '../models/solicitud.model';
import { TipoDeInversion } from '../models/solicitud.model';

/** Configuración de columnas para SubContratistas */
export const SUB_CONTRATISTAS_CONFIGURACION: ConfiguracionColumna<SubContratistas>[] =
  [
    {
      /** RFC del Subcontratista */
      encabezado: 'RFC',
      clave: (item: SubContratistas) => item.rfc,
      orden: 1,
    },
    {
      /** Nombre o razón social del Subcontratista */
      encabezado: 'Nombre / Razón social',
      clave: (item: SubContratistas) => item.razonSocial,
      orden: 2,
    },
  ];

/** Configuración de columnas para Sección de Socios IC */
export const SECCION_SOCIOSIC_CONFIGURACION_COLUMNAS: ConfiguracionColumna<SeccionSociosIC>[] =
  [
    {
      /** Tipo de Persona */
      encabezado: 'Tipo de Persona',
      clave: (item: SeccionSociosIC) => item.tipoPersonaMuestra,
      orden: 1,
    },
    {
      /** Nombre completo */
      encabezado: 'Nombre',
      clave: (item: SeccionSociosIC) => item.nombreCompleto,
      orden: 1,
    },
    {
      /** RFC del Socio IC */
      encabezado: 'RFC',
      clave: (item: SeccionSociosIC) => item.rfc,
      orden: 1,
    },
    {
      /** Carácter en que actúa el Socio IC */
      encabezado: 'En su carácter de',
      clave: (item: SeccionSociosIC) => item.caracterDe,
      orden: 1,
    },
    {
      /** Carácter Nacionalidad */
      encabezado: 'Nacionalidad',
      clave: (item: SeccionSociosIC) => item.nacionalidad,
      orden: 1,
    },
    {
      /** ¿Obligado a tributar en México? */
      encabezado: 'Obligado a tributar en México',
      clave: (item: SeccionSociosIC) => item.tributarMexico,
      orden: 1,
    },
    {
      /** Nombre de la empresa */
      encabezado: 'Nombre de la empresa',
      clave: (item: SeccionSociosIC) => item.nombreEmpresa,
      orden: 1,
    },
  ];

/** Configuración de columnas para Tipo de Inversión */
export const TIPO_DE_INVERSION_CONFIGURACION_COLUMNAS: ConfiguracionColumna<TipoDeInversion>[] =
  [
    {
      /** Tipo de inversión realizada */
      encabezado: 'Tipo de inversión',
      clave: (item: TipoDeInversion) => item.tipoInversion,
      orden: 1,
    },
    {
      /** Descripción general del tipo de inversión */
      encabezado: 'Descripción general',
      clave: (item: TipoDeInversion) => item.descripcion,
      orden: 1,
    },
    {
      /** Valor de la inversión en moneda nacional */
      encabezado: 'Valor en moneda nacional',
      clave: (item: TipoDeInversion) => item.valor,
      orden: 1,
    },
  ];

/** Configuración de columnas para Domicilios */
export const DOMICILIOS_CONFIGURACION_COLUMNAS: ConfiguracionColumna<Domicilios>[] =
  [
    {
      /** Instalaciones principales de la empresa */
      encabezado: 'Instalaciones principales',
      clave: (item: Domicilios) => item.instalacionPrincipal,
      orden: 1,
    },
    {
      /** Tipo de instalación */
      encabezado: 'Tipo de instalación',
      clave: (item: Domicilios) => item.tipoInstalacion,
      orden: 1,
    },
    {
      /** Entidad federativa donde está ubicada la instalación */
      encabezado: 'Entidad federativa',
      clave: (item: Domicilios) => item.entidadFederativa,
      orden: 1,
    },
    {
      /** Municipio o delegación donde está ubicada la instalación */
      encabezado: 'Municipio o delegación',
      clave: (item: Domicilios) => item.municipioDelegacion,
      orden: 1,
    },
    {
      /** Dirección completa: colonia, calle y número */
      encabezado: 'Colonia, calle y número',
      clave: (item: Domicilios) => item.direccion,
      orden: 1,
    },
    {
      /** Código postal del domicilio */
      encabezado: 'Código postal',
      clave: (item: Domicilios) => item.codigoPostal,
      orden: 1,
    },
    {
      /** Registro ante SE/SAT */
      encabezado: 'Registro ante SE/SAT',
      clave: (item: Domicilios) => item.registroSESAT,
      orden: 1,
    },
    {
      /** Proceso productivo realizado en la instalación */
      encabezado: 'Proceso Productivo',
      clave: (item: Domicilios) => item.procesoProductivo,
      orden: 1,
    },
    {
      /** Estatus de la instalación */
      encabezado: 'Estatus',
      clave: (item: Domicilios) => item.estatus,
      orden: 1,
    },
  ];

/** Configuración de columnas para Recibir Notificaciones */
export const RECIBIR_NOTIFICACIONES_CONFIGURACION: ConfiguracionColumna<RecibirNotificaciones>[] =
  [
    {
      /** RFC del destinatario de la notificación */
      encabezado: 'RFC',
      clave: (item: RecibirNotificaciones) => item.rfc,
      orden: 1,
    },
    {
      /** CURP del destinatario de la notificación */
      encabezado: 'CURP',
      clave: (item: RecibirNotificaciones) => item.curp,
      orden: 2,
    },
    {
      /** Nombre del destinatario de la notificación */
      encabezado: 'Nombre',
      clave: (item: RecibirNotificaciones) => item.nombre,
      orden: 3,
    },
    {
      /** Primer apellido del destinatario */
      encabezado: 'Primer apellido',
      clave: (item: RecibirNotificaciones) => item.apellidoPaterno,
      orden: 4,
    },
    {
      /** Segundo apellido del destinatario */
      encabezado: 'Segundo apellido',
      clave: (item: RecibirNotificaciones) => item.apellidoMaterno,
      orden: 5,
    },
  ];
