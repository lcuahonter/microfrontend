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
    path: 'pantallas-extraordinarios',
    loadChildren: () =>
      import('./tramites/220401/pantallas.module').then(
        (m) => m.PantallasModule
      ),
  },
  {
    path: 'certificado-zoosanitario',
    loadChildren: () =>
      import('./tramites/220201/certificado-zoosanitario.module').then(
        (m) => m.CertificadoZoosanitarioModule
      ),
  },
  {
    path: 'certificado-fitosanitario',
    loadChildren: () =>
      import('./tramites/220202/fitosanitario.module').then(
        (m) => m.FitosanitarioModule
      ),
  },
  {
    path: 'sagarpa',
    loadChildren: () =>
      import('./tramites/220501/sagarpa.module').then((m) => m.SagarpaModule),
  },
  {
    path: 'inspeccion-fisica',
    loadChildren: () =>
      import('./tramites/220502/inspeccion-fisica.module').then(
        (m) => m.InspeccionFisicaModule
      ),
  },
  {
    path: 'importacion-acuacultura',
    loadChildren: () =>
      import('./tramites/220203/importacion-de-acuicultura.module').then(
        (m) => m.ImportacionDeAcuiculturaModule
      ),
  },
  {
    path: 'pantallas-captura',
    loadChildren: () =>
      import('./tramites/220402/pantallas-captura.module').then(
        (m) => m.PantallasCapturaModule
      ),
  },
  {
    path: 'desistimiento',
    loadChildren: () =>
      import('./tramites/220404/desistimiento.module').then(
        (m) => m.DesistimientoModule
      ),
  },
  {
    path: 'inspeccion-fisica',
    loadChildren: () =>
      import('./tramites/220701/inspeccion-fisica-zoosanitario.module').then(
        (m) => m.InspeccionFisicaZoosanitarioModule
      ),
  },
  {
    path: 'peticion-requisitos-fitosanitarios',
    loadChildren: () =>
      import('./tramites/220102/fitosanitario.module').then(
        (m) => m.FitosanitarioModule
      ),
  },
  {
    path: 'inspeccion-fitosanitario',
    loadChildren: () =>
      import('./tramites/220702/inspeccion-fitosanitario.module').then(
        (m) => m.InspeccionFitosanitarioModule
      ),
  },
  {
    path: 'certificado-exportacion',
    loadChildren: () =>
      import('./tramites/220403/exportaccion-acuicola.module').then(
        (m) => m.ExportaccionAcuicolaModule
      ),
  },
  {
    path: 'acuicola-fisica',
    loadChildren: () =>
      import('./tramites/220703/acuicola-fisica.module').then(
        (m) => m.AcuicolaFisicaModule
      ),
  },
  {
    path: 'fitosanitario',
    loadChildren: () =>
      import('./tramites/221602/fitosanitario.module').then(
        (m) => m.FitosanitarioModule
      ),
  },
  { path: 'sanidad',
    loadChildren: () =>
      import('./tramites/221603/sanidad.module').then(
        (m) => m.SanidadModule
      ),
  },  
  {
    path: 'zoosanitario',
    loadChildren: () =>
      import('./tramites/221601/zoosanitario-para-importacion.module').then(
        (m) => m.ZoosanitarioParaImportacionModule
      ),
  },
  {
    path: 'sanidadacuicola',
    loadChildren: () =>
      import('./tramites/220503/sanidad-acuicola.module').then(
        (m) => m.SanidadAcuicolaModule
      ),
  },
  {
    path:'sanidad-acuicola-importacion',
    loadChildren: () =>
      import('./tramites/220103/sanidad-acuicola-importacion.module').then(
        (m) => m.SanidadAcuicolaImportacionModule
      ),
  },
  {
    path: 'evaluar',
    loadComponent: () =>
      import('./evaluar/evaluar.component').then((m) => m.EvaluarComponent
      ),
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
    path: 'confirmar-notificacion',
    loadComponent: () =>
      import('./confirmar-notificacion/confirmar-notificacion.component').then((m) => m.ConfirmarNotificacionComponent),
  },
  {
    path: 'autorizar-requerimiento',
    loadComponent: () =>
      import('./autorizar-requerimiento/autorizar-requerimiento.component').then(
        (m) => m.AutorizarRequerimientoComponent
      ),
  },
  {
    path: 'autorizar-dictamen',
    loadComponent: () =>
      import('./autorizar-dictamen/autorizar-dictamen.component').then((m) => m.AutorizarDictamenComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
