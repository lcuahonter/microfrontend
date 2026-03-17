import { RouterModule, Routes } from '@angular/router';
import { AcusePageComponent } from '@libs/shared/data-access-user/src';
import { NgModule } from '@angular/core';
import { SeleccionTramiteComponent } from './seleccion-tramite/seleccion-tramite.component';

const ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'seleccion-tramite' },
  {
    path: 'seleccion-tramite',
    component: SeleccionTramiteComponent,
  },
  {
    path: 'antecesor',
    loadChildren: () =>
      import('./tramites/31601/antecesor/antecesor.module').then(
        (m) => m.AntecesorModule
      ),
  },
  {
    path: 'registros-de-comercio-exterior',
    loadChildren: () =>
      import(
        './tramites/31602/comercio-exterior/comercio-exterior.module'
      ).then((m) => m.ComercioExteriorModule),
  },
  {
    path: 'aviso',
    loadChildren: () =>
      import('./tramites/32502/aviso.module').then((m) => m.AvisoModule),
  },
  {
    path: 'aviso-procesos',
    loadChildren: () =>
      import('./tramites/32504/aviso-procesos.module').then(
        (m) => m.AvisoProcesosModule
      ),
  },
  {
    path: 'aviso-unico-renovacion',
    loadChildren: () =>
      import('./tramites/317/aviso-unico-renovacion.module').then(
        (m) => m.AvisoUnicoRenovacionModule
      ),
  },
  {
    path: 'registro-solicitud',
    loadChildren: () =>
      import('./tramites/31802/registro-solicitud.module').then(
        (m) => m.RegistroSolicitudModule
      ),
  },
  {
    path: 'autoridad',
    loadChildren: () =>
      import('./tramites/31501/autoridad.module').then(
        (m) => m.AutoridadModule
      ),
  },
  {
    path: 'registro',
    loadChildren: () =>
      import('./tramites/31803/registro-solicitud.module').then(
        (m) => m.RegistroSolicitudModule
      ),
  },
  {
    path: 'mercancias-desmontadas-o-sin-montar',
    loadChildren: () =>
      import(
        './tramites/32501/mercancias-desmontadas-o-sin-montar.module'
      ).then((m) => m.MercanciasDesmontadasOSinMontarModule),
  },
  {
    path: 'manifiesto-aereo',
    loadChildren: () =>
      import('./tramites/32401/manifiesto-aereo.module').then(
        (m) => m.ManifiestoAereoModule
      ),
  },
  {
    path: 'consulta-aviso-acreditacion',
    loadChildren: () =>
      import('./tramites/32101/Consulta-Aviso-Acreditacion.module').then(
        (m) => m.ConsultaAvisoAcreditacionModule
      ),
  },
  {
    path: 'aviso-traslado',
    loadChildren: () =>
      import('./tramites/32503/aviso-traslado.module').then(
        (m) => m.AvisoTrasladoModule
      ),
  },
  {
    path: 'aviso-destruccion',
    loadChildren: () =>
      import('./tramites/32506/aviso-destruccion.module').then(
        (m) => m.AvisoDestruccionModule
      ),
  },
  {
    path: 'aviso-procesos-solicitante',
    loadChildren: () =>
      import('./tramites/32505/aviso-procesos.module').then(
        (m) => m.AvisoProcesosModule
      ),
  },
  {
    path: 'adace',
    loadChildren: () =>
      import('./tramites/32508/adace.module').then((m) => m.AdaceModule),
  },
  {
    path: 'anexo-veintiocho',
    loadChildren: () =>
      import('./tramites/32201/anexo-veintiocho.module').then(
        (m) => m.AnexoVeintiochoModule
      ),
  },
  {
    path: 'endoso-garantia',
    loadChildren: () =>
      import('./tramites/31301/endoso-garantia.module').then(
        (m) => m.EndosoGarantiaModule
      ),
  },
  {
    path: 'solicitud-de-registro-invocar',
    loadChildren: () =>
      import('./tramites/31616/solicitud-de-registro-invocar.module').then(
        (m) => m.SolicitudDeRegistroInvocarModule
      ),
  },
  {
    path: 'aviso-de-ampliacion',
    loadChildren: () =>
      import('./tramites/32102/Aviso-De-Ampliacion.module').then(
        (m) => m.AvisoDeAmpliacionModule
      ),
  },
  {
    path: 'renovacion-comercializadora',
    loadChildren: () =>
      import('./tramites/31801/renovacion-comercializadora.module').then(
        (m) => m.RenovacionComercializadoraModule
      ),
  },
  {
    path: 'registros-de-comercio-exterior',
    loadChildren: () =>
      import(
        './tramites/31603/registros-de-comercio-exterior/registros-de-comercio-exterior.module'
      ).then((m) => m.RegistrosDeComercioExteriorModule),
  },
  {
    path: 'garantia',
    loadChildren: () =>
      import('./tramites/31101/garantia.module').then((m) => m.GarantiaModule),
  },
  {
    path: 'aviso-opcion-seguro-global',
    loadChildren: () =>
      import('./tramites/32515/aviso-opcion-seguro-global.module').then(
        (m) => m.AvisoOpcionSeguroGlobalModule
      ),
  },
  {
    path: 'acta-de-hechos',
    loadChildren: () =>
      import('./tramites/32516/acta-de-hechos.module').then(
        (m) => m.ActaDeHechosModule
      ),
  },
  {
    path: 'entrega-acta-solicitante',
    loadChildren: () =>
      import('./tramites/32507/entrega-acta.module').then(
        (m) => m.EntregaActaModule
      ),
  },
  {
    path: 'importador-y-o-exportador',
    loadChildren: () =>
      import('./tramites/32605/importador-y-o-exportador.module').then(
        (m) => m.ImportadorYOExportadorModule
      ),
  },
  {
    path: 'retorno-seguro-vehiculos-extranjeros',
    loadChildren: () =>
      import('./tramites/32514/aviso-retorno.module').then(
        (m) => m.AvisoRetornoModule
      ),
  },
  {
    path: 'aviso-mercancia',
    loadChildren: () =>
      import('./tramites/32509/aviso-de-mercancia.module').then(
        (m) => m.AvisoDeMercanciaModule
      ),
  },
  {
    path: 'aviso',
    loadChildren: () =>
      import('./tramites/32301/aviso-modify-ivaEIepsAgace.module').then(
        (m) => m.AvisoModifyIvaElepsAgaceModule
      ),
  },
  {
    path: 'cancelacion-garantia',
    loadChildren: () =>
      import('./tramites/31401/cancelacion-garantia.module').then(
        (m) => m.CancelacionGarantiaModule
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
    path: 'evaluar',
    loadComponent: () =>
      import('./evaluar/evaluar.component').then((m) => m.EvaluarComponent),
  },
  {
    path: 'autorizar',
    loadComponent: () =>
      import('./autorizar/autorizar.component').then(
        (m) => m.AutorizarComponent
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
    path: 'verificar-dictamen',
    loadComponent: () =>
      import('./verificar-dictamen/verificar-dictamen.component').then(
        (m) => m.VerificarDictamenComponent
      ),
  },
  {
    path: 'detalle-v-dictamen',
    loadComponent: () =>
      import('./detalle-v-dictamen/detalle-v-dictamen.component').then(
        (m) => m.DetalleVDictamenComponent
      ),
  },
  {
    path: 'datos-generales-tramite',
    loadComponent: () =>
      import(
        './datos-generales-tramite/datos-generales-tramite.component'
      ).then((m) => m.DatosGeneralesTramiteComponent),
  },
  {
    path: 'aviso-de-modificacion',
    loadChildren: () =>
      import('./tramites/30505/aviso-de-modificacion.module').then(
        (m) => m.AvisoDeModificacionModule)
  },
  {
    path: 'certificacion-empresas',
    loadChildren: () =>
      import('./tramites/32609/oea-textil-registro.module').then(
        (m) => m.OeaTextilRegistroModule)
  },
  {
    path: 'recinto-fiscalizado',
    loadChildren: () =>
      import('./tramites/32615/recinto-fiscalizado.module').then(
        (m) => m.RecintoFiscalizadoModule)
  },
  {
    path: 'esquema-de-certificacion',
    loadChildren: () =>
      import('./tramites/32612/esquema-de-certificacion/esquema-de-certificacion.module').then(
        (m) => m.EsquemaDeCertificacionModule
      )
  },
  {
    path: 'aviso-modification-certificacion',
    loadChildren: () =>
      import('./tramites/33303/aviso-modification-certificacion.module').then(
        (m) => m.AvisoModificacionCertificacionModule)
  },
  {
    path: 'registros',
    loadChildren: () =>
      import('./tramites/30506/registro.module').then(
        (m) => m.RegistroModule
      ),
  },
  {
    path: 'aviso-destruccion-mercancias',
    loadChildren: () =>
      import('./tramites/32512/aviso-destruccion-mercancias.module').then(
        (m) => m.AvisoDestruccionMercanciasModule)
  },
  {
    path: 'avisos-agace',
    loadChildren: () =>
      import('./tramites/32511/avisos.module').then((m) => m.AvisosModule),
  },
  {
    path: 'aviso-tesoreria',
    loadChildren: () =>
      import('./tramites/32513/aviso-tesoreria.module').then(
        (m) => m.AvisoTesoreriaModule
      ),
  },
  {
    path: 'aviso-certificacion',
    loadChildren: () =>
      import('./tramites/33302/aviso-certificacion.module').then(
        (m) => m.AvisoCertificacionModule
      ),
  },
  {
    path: 'aeronaves',
    loadChildren: () =>
      import('./tramites/32607/aeronaves.module').then(
        (m) => m.AeronavesModule
      ),
  },
  {
    path: 'empresas-comercializadoras',
    loadChildren: () =>
      import('./tramites/32604/empresas-comercializadoras.module').then(
        (m) => m.EmpresasComercializadorasModule)
  },
  {
    path: 'rubro-transporte-ferroviario',
    loadChildren: () =>
      import('./tramites/32613/rubro-transporte-ferroviario.module').then((m) => m.RubroTransporteFerroviarioModule)
  },
  {
    path: 'solicitud-de-registro',
    loadChildren: () =>
      import('./tramites/32616/solicitud-de-registro-invocar.module').then(
        (m) => m.SolicitudDeRegistroInvocarModule)
  },
  {
    path: 'sce-socio-almacenamiento',
    loadChildren: () =>
      import('./tramites/32618/sce-socio-almacen.module').then(
        (m) => m.SceSocioAlmacenModule)
  },
  {
    path: 'registro-oae-rfe',
    loadChildren: () =>
      import('./tramites/32610/registro-oae-rfe.module').then(
        (m) => m.RegistroOaeRfeModule
      )
  },
  {
    path: 'economico',
    loadChildren: () =>
      import('./tramites/32606/economico.module').then((m) => m.EconomicoModule),
  },
  {
    path: 'importador-y-o-exportador2',
    loadChildren: () =>
      import('./tramites/32614/importador-y-o-exportador.module').then(
        (m) => m.ImportadorYOExportadorModule
      ),
  },
  {
    path: 'seciit-oea-registration',
    loadChildren: () =>
      import('./tramites/32608/seciit-oea-registration.module').then(
        (m) => m.SeciitOeaRegistrationModule
      ),
  },
  {
    path: 'auto-transportista',
    loadChildren: () =>
      import('./tramites/32611/auto-transportista.module').then(
        (m) => m.AutoTransportistaModule
      ),
  },
  {
    path: 'certificacion-empresas-modalidad',
    loadChildren: () =>
      import('./tramites/32617/oea-tercerizacion-logistica-registro.module').then(
        (m) => m.OeaTercerizacionLogisticaRegistroModule)
  },
  {
    path: 'aviso-comercializadora-modification-importadora',
    loadChildren: () =>
      import('./tramites/33304/Aviso-De-Ampliacion.module').then(
        (m) => m.AvisoDeAmpliacionModule)
  },
  {
    path: 'acuse',
    component: AcusePageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class AppRoutingModule { }