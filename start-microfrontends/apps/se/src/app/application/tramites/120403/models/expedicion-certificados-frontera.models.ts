export interface AsignacionRootResponse {
  asignacionResponse: AsignacionResponseDos;
  unidadAdministrativaResponse: UnidadAdministrativaResponse;
}

export interface AsignacionResponseDos {
  idAsignacion: number;
  idSolicitud: number;
  idMecanismoAsignacion: number;
  cantidadSolicitada: number;
  cantidadAprobada: number;
  impTotalAprobado: number;
  impTotalExpedido: number;
  cantidadCancelada: number;
  asignacionActiva: boolean;
  aprobada: boolean;
  fechaInicioVigencia: string;
  fechaFinVigenciaSolicitada: string | null;
  fechaFinVigenciaAprobada: string;
  ideTipoAsignacionDirecta: string;
  idAsignacionR: number;
  numFolioAsignacion: number;
  numFolioAsignacionTPL: number | null;
  fechaAutorizacion: string;
  impAntecedenteAsignacion: number | null;
  idLicitacionPublica: number | null;
  rfcParticipante: string | null;
  impCalculadoProrrata: number | null;
  areaVenta: number | null;
  areaRefrigeracion: number | null;
  impAntecedenteEmpresa: number | null;
  montoDisponible: number | null;
  montoExpedido: number | null;
  añoAutorizacion: number;
  solicitud: string | null;
  mecanismoAsignacion: string | null;
  asignacionOrigen: AsignacionOrigen | null;
  participante: string | null;
  saldoMecanismo: string | null;
  saldoMecanismoAsignado: string | null;
  saldoMecanismoExpedido: string | null;
  porcentajeParticipacion: number | null;
  resultadoParcial: number | null;
  fechaInicioVigenciaLicitacion: string | null;
}

export interface AsignacionOrigen {
  idAsignacion: number;
  idSolicitud: number;
  idMecanismoAsignacion: number;
  cantidadSolicitada: number;
  cantidadAprobada: number;
  impTotalAprobado: number;
  impTotalExpedido: number;
  cantidadCancelada: number;
  asignacionActiva: boolean;
  aprobada: boolean;
  fechaInicioVigencia: string;
  fechaFinVigenciaSolicitada: string | null;
  fechaFinVigenciaAprobada: string;
  ideTipoAsignacionDirecta: string;
  idAsignacionR: number;
  numFolioAsignacion: number;
  numFolioAsignacionTPL: number | null;
  fechaAutorizacion: string;
  impAntecedenteAsignacion: number | null;
  idLicitacionPublica: number | null;
  rfcParticipante: string | null;
  impCalculadoProrrata: number | null;
  areaVenta: number | null;
  areaRefrigeracion: number | null;
  impAntecedenteEmpresa: number | null;
  montoDisponible: number | null;
  montoExpedido: number | null;
  añoAutorizacion: number;
  solicitud: string | null;
  mecanismoAsignacion: string | null;
  asignacionOrigen: string | null;
  participante: string | null;
  saldoMecanismo: string | null;
  saldoMecanismoAsignado: string | null;
  saldoMecanismoExpedido: string | null;
  porcentajeParticipacion: number | null;
  resultadoParcial: number | null;
  fechaInicioVigenciaLicitacion: string | null;
}

export interface UnidadAdministrativaResponse {
  vigencia: string | null;
  clave: string;
  nombre: string | null;
  dependencia: string | null;
  entidadFederativa: string | null;
  claveUnidadAdminR: string | null;
  ideTipoUnidadAdministrativa: string | null;
  nivel: string | null;
  acronimo: string | null;
  estatusFrontera: string | null;
  descripcion: string | null;
  listaUnidadAdministrativaVecina: string[] | null;
  domicilio: string | null;
  nombreUnidad: string | null;
  asignado: boolean | null;
}
