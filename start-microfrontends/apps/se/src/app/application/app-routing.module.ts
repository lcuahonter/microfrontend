import { AcusePageComponent, AcuseResolucionComponent } from '@libs/shared/data-access-user/src';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SeleccionTramiteComponent } from './seleccion-tramite/seleccion-tramite.component';
const ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'seleccion-tramite' },
  {
    path: 'seleccion-tramite',
    component: SeleccionTramiteComponent,
  },
  {
    path: 'octava-temporal',
    loadChildren: () =>
      import('./tramites/130102/octava-temporal.module').then(
        (m) => m.OctavaTemporalModule
      ),
  },
  {
    path: 'entidad-legal',
    loadChildren: () =>
      import('./tramites/120404/entidad-legal.module').then(
        (m) => m.EntidadLegalModule
      ),
  },
  {
    path: 'confirmar-notificacion',
    loadComponent: () =>
      import('./confirmar-notificacion/confirmar-notificacion.component').then((m) => m.ConfirmarNotificacionComponent),
  },
  {
    path: 'exportador-autorizado',
    loadChildren: () =>
      import('./tramites/110102/exportador-autorizado.module').then(
        (m) => m.ExportadorautorizadoModule
      ),
  },
  {
    path: 'solicitartransferencia',
    loadChildren: () =>
      import('./tramites/120501/solicitar-transferencia-cupos.module').then(
        (m) => m.SolicitarTransferenciaCuposModule
      ),
  },
  {
    path: 'registro-como-empresa',
    loadChildren: () =>
      import('./tramites/120601/registro-como-empresa.module').then(
        (m) => m.RegistroComoEmpresaModule
      ),
  },
  {
    path: 'tramites-disponibles',
    loadChildren: () =>
      import('./tramites/110210/tramites-disponibles.module').then(
        (m) => m.TramitesDisponiblesModule
      ),
  },
  {
    path: 'empresa-frontera',
    loadChildren: () =>
      import('./tramites/120602/registro-como-empresa.module').then(
        (m) => m.RegistroComoEmpresaModule
      ),
  },
  {
    path: 'prosec-modificacion',
    loadChildren: () =>
      import('./tramites/90305/prosec-modificacion.module').then(
        (m) => m.ProsecModificacionModule
      ),
  },
  {
    path: 'pantallas',
    loadChildren: () =>
      import('./tramites/110101/pantallas/pantallas.module').then(
        (m) => m.Pantallas110101Module
      ),
  },
  {
    path: 'asignacion-directa-de-cupo',
    loadChildren: () =>
      import('./tramites/120402/asignacion-directa-cupo-personas-fisicas-primera-vez.module').then(
        (m) => m.AsignacionDirectaDeCupoModule
      ),
  },
  {
    path: 'pexim',
    loadChildren: () =>
      import('./tramites/130118/pexim.module').then((m) => m.PeximModule),
  },
  {
    path: 'expansion-de-productores',
    loadChildren: () =>
      import(
        './tramites/90201/expansion-de-productores/expansion-de-productores.module'
      ).then((m) => m.ExpansionDeProductoresModule),
  },
  {
    path: 'pexim',
    loadChildren: () =>
      import('./tramites/110204/pexim.module').then((m) => m.PeximModule),
  },
  {
    path: 'elegibilidad-de-textiles',
    loadChildren: () =>
      import('./tramites/120301/elegibilidad-de-textiles.module').then(
        (m) => m.ElegibilidadDeTextilesModule
      ),
  },
  {
    path: 'permiso-importacion',
    loadChildren: () =>
      import('./tramites/130120/permiso-importacion.module').then(
        (m) => m.PermisoImportacionModule
      ),
  },
  {
    path: 'registro',
    loadChildren: () =>
      import('./tramites/110201/registro.module').then((m) => m.RegistroModule),
  },
  {
    path: 'cancelacion-de',
    loadChildren: () =>
      import('./tramites/140103/cancelacion-de.module').then(
        (m) => m.CancelacionDeModule
      ),
  },
  {
    path: 'certificado-tecnico-japon',
    loadChildren: () =>
      import('./tramites/110218/certificado-tecnico-japon.module').then(
        (m) => m.CertificadoTecnicoJaponModule
      ),
  },
  {
    path: 'desmantelar',
    loadChildren: () =>
      import('./tramites/130106/desmantelar.module').then(
        (m) => m.DesmantelarModule
      ),
  },
  {
    path: 'cancelacion-de-certificados-de-cupo',
    loadChildren: () =>
      import(
        './tramites/140104/desistimiento-de-permiso.module'
      ).then((m) => m.DesistimientoDePermisoModule),
  },
  {
    path: 'desistimiento-de-permiso',
    loadChildren: () =>
      import('./tramites/140105/desistimiento-de-permiso.module').then(
        (m) => m.DesistimientoDePermisoModule
      ),
  },
  {
    path: 'certificado-sgp',
    loadChildren: () =>
      import('./tramites/110209/certificado-sgp.module').then(
        (m) => m.CertificadoSGPModule
      ),
  },
  {
    path: 'certificado-registro',
    loadChildren: () =>
      import('./tramites/80205/certificado-registro.module').then(
        (m) => m.CertificadoRegistroModule
      ),
  },
  {
    path: 'certificado-registro',
    loadChildren: () =>
      import('./tramites/80205/certificado-registro.module').then(
        (m) => m.CertificadoRegistroModule
      ),
  },
  {
    path: 'subfabricante-immex',
    loadChildren: () =>
      import('./tramites/80207/subfabricante-extension.module').then(
        (m) => m.SubfabricanteExtentionModule
      ),
  },
  {
    path: 'immex-ampliacion-sensibles',
    loadChildren: () =>
      import('./tramites/80202/immex-ampliacion-sensibles.module').then(
        (m) => m.ImmexAmpliacionSensiblesModule
      ),
  },
  {
    path: 'immex-registro-solicitud-modality',
    loadChildren: () =>
      import(
        './tramites/80203/immex-registro-de-solicitud-modalidad.modulo'
      ).then((m) => m.ImmexRegistroDeSolicitudModalityModule),
  },
  {
    path: 'modificacion',
    loadChildren: () =>
      import('./tramites/80308/modificacion-solicitud.module').then(
        (m) => m.ModificacionSolicitudModule
      ),
  },
  {
    path: 'autorizacion-prosec',
    loadChildren: () =>
      import('./tramites/90101/autorizacion-prosec.module').then(
        (m) => m.AutorizacionProsecModule
      ),
  },
  {
    path: 'solicitud-modalidad',
    loadChildren: () =>
      import('./tramites/80208/registro-solicitud.module').then(
        (m) => m.RegistroSolicitudModule
      ),
  },
  {
    path: 'importacion-de-vehiculos-usados',
    loadChildren: () =>
      import('./tramites/130111/importacion-de-vehiculos-usados.module').then(
        (m) => m.ImportacionDeVehiculosUsadosModule
      ),
  },
  {
    path: 'diamante-bruto',
    loadChildren: () =>
      import('./tramites/130114/diamante-bruto.module').then(
        (m) => m.DiamanteBrutoModule
      ),
  },
  {
    path: 'solicitud-modificacion',
    loadChildren: () =>
      import('./tramites/80302/modificacion.module').then(
        (m) => m.ModificacionModule
      ),
  },
  {
    path: 'importacion-material-de-investigacion-cientifica',
    loadChildren: () =>
      import(
        './tramites/130112/importacion-material-de-investigacion-cientifica.module'
      ).then((m) => m.ImportacionMaterialDeInvestigacionCientificaModule),
  },
  {
    path: 'importacion-vehiculos-nuevos',
    loadChildren: () =>
      import('./tramites/130115/importacion-vehiculos-nuevos.module').then(
        (m) => m.ImportacionVehiculosNuevosModule
      ),
  },
  {
    path: 'cancelaciones-ministerio',
    loadChildren: () =>
      import('./tramites/140201/cancelaciones.module').then(
        (m) => m.CancelacionesModule
      ),
  },
  {
    path: 'validar-inicialmente',
    loadChildren: () =>
      import('./tramites/110208/validar-inicalmente.module').then(
        (m) => m.ValidarInicalmenteModule
      ),
  },
  {
    path: 'certificado',
    loadChildren: () =>
      import('./tramites/110219/certificado.module').then(
        (m) => m.CertificadoModule
      ),
  },
  {
    path: 'nuevo-programa-industrial',
    loadChildren: () =>
      import('./tramites/80101/nuevo-programa-industrial.module').then(
        (m) => m.NuevoProgramaIndustrialModule
      ),
  },
  {
    path: 'certificado-validacion',
    loadChildren: () =>
      import('./tramites/110202/certificado-validacion.module').then(
        (m) => m.CertificadoValidacionModule
      ),
  },
  {
    path: 'exportacion-minerales',
    loadChildren: () =>
      import('./tramites/130202/exportacion-minerales-de-hierro.module').then(
        (m) => m.ExportacionMineralesDeHierroModule
      ),
  },
  {
    path: 'autorizacion-programa-nuevo',
    loadChildren: () =>
      import('./tramites/80102/autorizacion-programa-nuevo.module').then(
        (m) => m.AutorizacionProgrmaNuevoModule
      ),
  },
  {
    path: 'tecnicos',
    loadChildren: () =>
      import('./tramites/110203/tecnicos.module').then((m) => m.TecnicosModule),
  },
  {
    path: 'previos-exportacion',
    loadChildren: () =>
      import(
        './tramites/130217/control-permisos-previos-exportacion.module'
      ).then((m) => m.ControlPermisosPreviosExportacionModule),
  },
  {
    path: 'inicialmente-certificado-origen',
    loadChildren: () =>
      import('./tramites/110216/inicialmente-certificado-origen.module').then(
        (m) => m.InicialmenteCertificadoOrigenModule
      ),
  },
  {
    path: 'validador-certificado-cam',
    loadChildren: () =>
      import('./tramites/110221/validador-certificado-cam.module').then(
        (m) => m.ValidadorCertificadoCamModule
      ),
  },
  {
    path: 'registro-solicitud-anual',
    loadChildren: () =>
      import('./tramites/150101/registro-solicitud-anual.module').then(
        (m) => m.ReporteAnualModule
      ),
  },
  {
    path: 'cupos',
    loadChildren: () =>
      import('./tramites/120201/cupos.module').then((m) => m.CuposModule),
  },
  {
    path: 'solicitud-prorroga',
    loadChildren: () =>
      import('./tramites/130301/solicitud-prorroga.module').then(
        (m) => m.SolicitudProrrogaModule
      ),
  },
  {
    path: 'aviso-importacion-maquinas',
    loadChildren: () =>
      import('./tramites/130119/aviso-importacion-maquinas.module').then(
        (m) => m.AvisoImportacionMaquinasModule
      ),
  },
  {
    path: 'reporte-anual',
    loadChildren: () =>
      import('./tramites/150102/reporte-anual.module').then(
        (m) => m.ReporteAnualModule
      ),
  },
  {
    path: 'importacion-definitiva',
    loadChildren: () =>
      import('./tramites/130103/importacion-definitiva.module').then(
        (m) => m.ImportacionDefinitivaModule
      ),
  },
  {
    path: 'solicitud-de-cancelacion',
    loadChildren: () =>
      import('./tramites/140101/solicitud-de-cancelacion.module').then(
        (m) => m.SolicitudDeCancelacionModule
      ),
  },
  {
    path: 'validar-certificado',
    loadChildren: () =>
      import('./tramites/110211/validar-certificado.module').then(
        (m) => m.ValidarCertificadoModule
      ),
  },
  {
    path: 'solicitud-importacion-ambulancia',
    loadChildren: () =>
      import('./tramites/130116/solicitud-importacion-ambulancia.module').then(
        (m) => m.SolicitudImportacionAmbulanciaModule
      ),
  },
  {
    path: 'importacion-vehiculos-usados-donacion',
    loadChildren: () =>
      import(
        './tramites/130105/importacion-vehiculos-usados-donacion.module'
      ).then((m) => m.ImportacionVehiculosUsadosDonacionModule),
  },
  {
    path: 'importacion',
    loadChildren: () =>
      import(
        './tramites/130110/importacion-neumaticos-comercializar.module'
      ).then((m) => m.ImportacionNeumaticosComercializarModule),
  },
  {
    path: 'importacion',
    loadChildren: () =>
      import(
        './tramites/130113/importacion-equipo-anticontaminante.module'
      ).then((m) => m.ImportacionEquipoAnticontaminanteModule),
  },
  {
    path: 'importacion-de',
    loadChildren: () =>
      import('./tramites/130109/vehiculos-usados-adaptados.module').then(
        (m) => m.VehiculosUsadosAdaptadosModule
      ),
  },
  {
    path: 'expedicion-certificado-cupos',
    loadChildren: () =>
      import('./tramites/120204/expedicion-certificado-cupos.module').then(
        (m) => m.ExpedicionCertificadoModule
      ),
  },
  {
    path: 'exportar-diamantes',
    loadChildren: () =>
      import('./tramites/130203/exportación-de-diamantes-en-bruto.module').then(
        (m) => m.ExportaciónDeDiamantesEnBrutoModule
      ),
  },
  {
    path: 'importacion-otros-vehiculos-usados',
    loadChildren: () =>
      import(
        './tramites/130104/importacion-otros-vehiculos-usados.module'
      ).then((m) => m.ImportacionOtrosVehiculosUsadosModule),
  },
  {
    path: 'modalidad-ampliacion',
    loadChildren: () =>
      import('./tramites/80206/modalidad-ampliacion.module').then(
        (m) => m.ModalidadAmpliacionModule
      ),
  },
  {
    path: 'reportes',
    loadChildren: () =>
      import('./tramites/110207/reportes.module').then((m) => m.ReportesModule),
  },
  {
    path: 'expedicion-certificados-frontera',
    loadChildren: () =>
      import('./tramites/120702/expedicion-certificados-frontera.module').then(
        (m) => m.ExpedicionCertificadosFronteraModule
      ),
  },
  {
    path: 'catalogos',
    loadChildren: () =>
      import('./tramites/90303/catalogos.module').then(
        (m) => m.CatalogosModule
      ),
  },
  {
    path: 'expedicion-certificado-asignacion',
    loadChildren: () =>
      import('./tramites/120202/expedicion-certificado-asignacion.module').then(
        (m) => m.ExpedicionCertificadoAsignacionModule
      ),
  },
  {
    path: 'autorizacion-prosec-productor',
    loadChildren: () =>
      import('./tramites/90102/autorizacion-prosec-productor.module').then(
        (m) => m.AutorizacionProsecProductorModule
      ),
  },
  {
    path: 'immex-modificacion',
    loadChildren: () =>
      import('./tramites/80306/immexModification.module').then(
        (m) => m.ImmexModificationModule
      ),
  },
  {
    path: 'registro-solicitud-immex',
    loadChildren: () =>
      import('./tramites/80210/registro-solicitud-immex.module').then(
        (m) => m.registroSolicitudImmexModule
      ),
  },
  {
    path: 'registro-expansion',
    loadChildren: () =>
      import('./tramites/80211/registro-solicitud-immex.module').then(
        (m) => m.registroSolicitudImmexModule
      ),
  },
  {
    path: 'validar-inicialmente-certificado',
    loadChildren: () =>
      import('./tramites/110214/validar-inicialmente-certificado.module').then(
        (m) => m.ValidarInicialmenteCertificadoModule
      ),
  },
  {
    path: 'registro-solicitud',
    loadChildren: () =>
      import('./tramites/80301/registro-modificacion.module').then(
        (m) => m.RegistroModificacionModule
      ),
  },
  {
    path: 'modificacion-descripcion',
    loadChildren: () =>
      import('./tramites/130401/modificacion-descripcion.module').then(
        (m) => m.ModificacionDescripcionModule
      ),
  },
  {
    path: 'certificado-alianza-posteriori',
    loadChildren: () =>
      import('./tramites/110223/certificado-alianza-posteriori.module').then(
        (m) => m.CertificadoAlianzaPosterioriModule
      ),
  },
  {
    path: 'validacion-posteriori',
    loadChildren: () =>
      import('./tramites/110212/validacion-posteriori.module').then(
        (m) => m.ValidacionPosterioriModuleModule
      ),
  },
  {
    path: 'modificaciones-immex-prosec',
    loadChildren: () =>
      import('./tramites/90304/prosec.module').then((m) => m.ProsecModule),
  },
  {
    path: 'ampliacion-prosec-productor',
    loadChildren: () =>
      import('./tramites/90202/ampliacion-prosec-productor.module').then(
        (m) => m.AmpliacionProsecProductorModule
      ),
  },
  {
    path: 'cupos',
    loadChildren: () =>
      import('./tramites/120403/entidad-legal.module').then((m) => m.EntidadLegalModule),
  },
  {
    path: 'informe-anual-programa',
    loadChildren: () =>
      import('./tramites/150103/informe-anual-programa.module').then(
        (m) => m.InformeAnualProgramaModule
      ),
  },
  {
    path: 'registro-como-expresa',
    loadChildren: () =>
      import('./tramites/120603/registro-como-empresa.module').then(
        (m) => m.RegistroComoEmpresaModule
      ),
  },
  {
    path: 'registro-solicitude',
    loadChildren: () =>
      import(
        './tramites/80303/modificacion-programa-immex-baja-submanufacturera.module'
      ).then((m) => m.ModificacionProgramaImmexBajaSubmanufactureraModule),
  },
  {
    path: 'programa-prosec',
    loadChildren: () =>
      import('./tramites/90302/programa-prosec.module').then(
        (m) => m.ProgramaProsecModule
      ),
  },

  {
    path: 'validar-certificado',
    loadChildren: () =>
      import('./tramites/110205/validar-certificado.module').then(
        (m) => m.ValidarCertificadoModule
      ),
  },
  {
    path: 'asignacion-directa-cupo-personas-fisicas',
    loadChildren: () =>
      import(
        './tramites/120401/asignacion-directa-cupo-personas-fisicas-primera-vez.module'
      ).then((m) => m.AsignacionDirectaCupoPersonasFisicasPrimeraVezModule),
  },
  {
    path: 'immex-modificacion-cambio-de-sector',
    loadChildren: () =>
      import(
        './tramites/80314/immex-modificacion-cambio-de-sector.module'
      ).then((m) => m.ImmexModificacionCambioDeSectorModule),
  },
  {
    path: 'validar-certificado-inicialmente',
    loadChildren: () =>
      import('./tramites/110222/validar-inicialmente-certificado.module').then(
        (m) => m.ValidarInicialmenteCertificadoModule
      ),
  },

  {
    path: 'solicitud-de-registro-tpl',
    loadChildren: () =>
      import('./tramites/120101/solicitud-de-registro-tpl.module').then(
        (m) => m.SolicitudDeRegistroTplModule
      ),
  },
  {
    path: 'registro-solicitudModule',
    loadChildren: () =>
      import('./tramites/140102/registro-de-solicitud.module').then(
        (m) => m.RegistroDeSolicitudModule
      ),
  },
  {
    path: 'modalidad-terciarizacion',
    loadChildren: () =>
      import('./tramites/80105/modalidad-terciarización.module').then(
        (m) => m.ModalidadTerciarizaciónModule
      ),
  },
  {
    path: 'importaciones-agropecuarias',
    loadChildren: () =>
      import(
        './tramites/130107/importaciones-agropecuarias/importaciones-agropecuarias.module'
      ).then((m) => m.ImportacionesAgropecuariasModule),
  },
  {
    path: 'modificaciones-immex',
    loadChildren: () =>
      import('./tramites/80316/modificaciones-immex-prosec.module').then(
        (m) => m.ModificacionesImmexProsecModule
      ),
  },
  {
    path: 'cancelaciones-certificado',
    loadChildren: () =>
      import('./tramites/140205/cancelacion-de.module').then(
        (m) => m.CancelacionDeModule
      ),
  },
  {
    path: 'evaluar',
    loadComponent: () =>
      import('./evaluar/evaluar.component').then((m) => m.EvaluarComponent),
  },
  {
    path: 'autorizar-requerimiento',
    loadComponent: () =>
      import('./autorizar-requerimiento/autorizar-requerimiento.component').then((m) => m.AutorizarRequerimientoComponent),
  },
  {
    path: 'autorizar-dictamen',
    loadComponent: () =>
      import('./autorizar-dictamen/autorizar-dictamen.component').then((m) => m.AutorizarDictamenComponent),
  },
  {
    path: 'autorizar',
    loadComponent: () =>
      import('./autorizar/autorizar.component').then(
        (m) => m.AutorizarComponent
      ),
  },
  {
    path: 'subsecuentes',
    loadComponent: () =>
      import(
        './subsecuentes/acuses-y-resoluciones-folio-del-tramite-detalles-contenedor/acuses-y-resoluciones-folio-del-tramite-detalles-contenedor.component'
      ).then(
        (m) => m.AcusesYResolucionesFolioDelTramiteDetallesContenedorComponent
      ),
  },
  {
    path: 'proceso-requerimiento',
    loadComponent: () =>
      import('./proceso-requerimiento/proceso-requerimiento.component').then(
        (m) => m.ProcesoRequerimientoComponent
      ),
  },
  {
    path: 'registro-solicitud-immex-modalidad',
    loadChildren: () =>
      import('./tramites/80103/modalidad-albergue.module').then(
        (m) => m.ModalidadAlbergueModule
      ),
  },
  {
    path: 'registro-solicitud-immex-modalidad-controladora',
    loadChildren: () =>
      import('./tramites/80104/modalidad-controlodora.module').then(
        (m) => m.ModalidadControlodoraModule
      ),
  },
  {
    path: 'certificado-origen',
    loadChildren: () =>
      import('./tramites/110217/certificado-origen.module').then(
        (m) => m.CertificadoOrigenModule
      ),
  },
  {
    path: 'verificar-dictamen',
    loadComponent: () =>
      import('./verificar-dictamen/verificar-dictamen.component').then((m) => m.VerificarDictamenComponent),
  },
  {
    path: 'detalle-v-dictamen',
    loadComponent: () =>
      import('./detalle-v-dictamen/detalle-v-dictamen.component').then((m) => m.DetalleVDictamenComponent),
  },
  {
    path: 'datos-generales-tramite',
    loadComponent: () =>
      import('./datos-generales-tramite/datos-generales-tramite.component').then((m) => m.DatosGeneralesTramiteComponent),
  },
  {
    path: 'registrar-opinion',
    loadComponent: () =>
      import('./registrar-opinion/registrar-opinion.component').then((m) => m.RegistrarOpinionComponent),
  },

  {
    path: 'acuse',
    component: AcusePageComponent,
  },
    {
    path: 'acuse-resolucion',
    component: AcuseResolucionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class AppRoutingModule {}