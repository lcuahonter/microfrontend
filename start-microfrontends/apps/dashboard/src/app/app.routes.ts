import { BandejaDeSolicitudesComponent } from './bandeja-de-solicitudes/bandeja-de-solicitudes.component';
import { BandejaDeTareasPendientesComponent } from './bandeja-de-tareas-pendientes/bandeja-de-tareas-pendientes.component';
import { ConfirmarNotificacionComponent } from './confirmar-notificacion/confirmar-notificacion.component';
import { ENVIRONMENT } from './environments/environment';
import { MenuConsultaTramiteComponent } from './consulta-tramite/menu-consulta-tramite.component';
import { Route } from '@angular/router';
import { SeleccionTramiteDesdePanelComponent } from './seleccion-tramite-desde-panel/seleccion-tramite-desde-panel.component';
import { SubsecuentesComponent } from './subsecuentes/subsecuentes.component';
import { loadRemoteModule } from '@angular-architects/module-federation';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const appRoutes: Route[] = [
  {
    path: 'login',
    loadChildren: () =>
      loadRemoteModule({
        remoteEntry: `${ENVIRONMENT.REMOTE_APPS.login}/remoteAppEntry.js`,
        remoteName: 'login',
        exposedModule: './Module',
      }).then((m) => m.AppLoginModule),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'seleccion-tramite',
    component: SeleccionTramiteDesdePanelComponent,
  },
  {
    path: 'aga',
    loadChildren: () =>
      loadRemoteModule({
        remoteEntry: `${ENVIRONMENT.REMOTE_APPS.aga}/remoteAppEntry.js`,
        remoteName: 'aga',
        exposedModule: './Module',
      }).then((m) => m.AppAgaModule),
  },
  {
    path: 'agace',
    loadChildren: () =>
      loadRemoteModule({
        remoteEntry: `${ENVIRONMENT.REMOTE_APPS.agace}/remoteAppEntry.js`,
        remoteName: 'agace',
        exposedModule: './Module',
      }).then((m) => m.AppAgaceModule),
  },
  {
    path: 'agricultura',
    loadChildren: () =>
      loadRemoteModule({
        remoteEntry: `${ENVIRONMENT.REMOTE_APPS.agricultura}/remoteAppEntry.js`,
        remoteName: 'agricultura',
        exposedModule: './Module',
      }).then((m) => m.AppAgriculturaModule),
  },
  {
    path: 'se',
    loadChildren: () =>
      loadRemoteModule({
        remoteEntry: `${ENVIRONMENT.REMOTE_APPS.se}/remoteAppEntry.js`,
        remoteName: 'se',
        exposedModule: './Module',
      }).then((m) => m.AppSEModule),
  },
  {
    path: 'semarnat',
    loadChildren: () =>
      loadRemoteModule({
        remoteEntry: `${ENVIRONMENT.REMOTE_APPS.semarnat}/remoteAppEntry.js`,
        remoteName: 'semarnat',
        exposedModule: './Module',
      }).then((m) => m.AppSemarnatModule),
  },
  {
    path: 'sener',
    loadChildren: () =>
      loadRemoteModule({
        remoteEntry: `${ENVIRONMENT.REMOTE_APPS.sener}/remoteAppEntry.js`,
        remoteName: 'sener',
        exposedModule: './Module',
      }).then((m) => m.AppSenerModule),
  },
  {
    path: 'funcionario',
    loadChildren: () =>
      loadRemoteModule({
        remoteEntry: `${ENVIRONMENT.REMOTE_APPS.funcionario}/remoteAppEntry.js`,
        remoteName: 'funcionario',
        exposedModule: './Module',
      }).then((m) => m.AppFuncionarioModule),
  },
  {
    path: 'amecafe',
    loadChildren: () =>
      loadRemoteModule({
        remoteEntry: `${ENVIRONMENT.REMOTE_APPS.amecafe}/remoteAppEntry.js`,
        remoteName: 'amecafe',
        exposedModule: './Module',
      }).then((m) => m.AppAmecafeModule),
  },
  {
    path: 'sedena',
    loadChildren: () =>
      loadRemoteModule({
        remoteEntry: `${ENVIRONMENT.REMOTE_APPS.sedena}/remoteAppEntry.js`,
        remoteName: 'sedena',
        exposedModule: './Module',
      }).then((m) => m.AppSedenaModule),
  },
  {
    path: 'inbal',
    loadChildren: () =>
      loadRemoteModule({
        remoteEntry: `${ENVIRONMENT.REMOTE_APPS.inbal}/remoteAppEntry.js`,
        remoteName: 'inbal',
        exposedModule: './Module',
      }).then((m) => m.AppInbalModule),
  },
  {
    path: 'cofepris',
    loadChildren: () =>
      loadRemoteModule({
        remoteEntry: `${ENVIRONMENT.REMOTE_APPS.cofepris}/remoteAppEntry.js`,
        remoteName: 'cofepris',
        exposedModule: './Module',
      }).then((m) => m.AppCofeprisModule),
  },
  {
    path: 'profepa',
    loadChildren: () =>
      loadRemoteModule({
        remoteEntry: `${ENVIRONMENT.REMOTE_APPS.profepa}/remoteAppEntry.js`,
        remoteName: 'profepa',
        exposedModule: './Module',
      }).then((m) => m.AppProfepaModule),
  },
  {
    path: 'inah',
    loadChildren: () =>
      loadRemoteModule({
        remoteEntry: `${ENVIRONMENT.REMOTE_APPS.inah}/remoteAppEntry.js`,
        remoteName: 'inah',
        exposedModule: './Module',
      }).then((m) => m.AppINAHModule),
  },
  {
    path: 'crt',
    loadChildren: () =>
      loadRemoteModule({
        remoteEntry: `${ENVIRONMENT.REMOTE_APPS.crt}/remoteAppEntry.js`,
        remoteName: 'crt',
        exposedModule: './Module',
      }).then((m) => m.AppCrtModule),
  },
  {
    path: 'stps',
    loadChildren: () =>
      loadRemoteModule({
        remoteEntry: `${ENVIRONMENT.REMOTE_APPS.stps}/remoteAppEntry.js`,
        remoteName: 'stps',
        exposedModule: './Module',
      }).then((m) => m.AppStpsModule),
  },
  {
    path: 'privados',
    loadChildren: () =>
      loadRemoteModule({
        remoteEntry: `${ENVIRONMENT.REMOTE_APPS.privados}/remoteAppEntry.js`,
        remoteName: 'privados',
        exposedModule: './Module',
      }).then((m) => m.AppPrivadosModule),
  },
  {
    path: 'consultas',
    loadChildren: () =>
      loadRemoteModule({
        remoteEntry: `${ENVIRONMENT.REMOTE_APPS.consultas}/remoteAppEntry.js`,
        remoteName: 'consultas',
        exposedModule: './Module',
      }).then((m) => m.AppConsultasModule),
  },
  {
    path: 'catalogos',
    loadChildren: () =>
      loadRemoteModule({
        remoteEntry: `${ENVIRONMENT.REMOTE_APPS.catalogos}/remoteAppEntry.js`,
        remoteName: 'catalogos',
        exposedModule: './Module',
      }).then((m) => m.AppCatalogosModule),
  },
  {
    path: 'configuracion',
    loadChildren: () =>
      loadRemoteModule({
        remoteEntry: `${ENVIRONMENT.REMOTE_APPS.configuracion}/remoteAppEntry.js`,
        remoteName: 'configuracion',
        exposedModule: './Module',
      }).then((m) => m.AppConfiguracionModule),
  },
  {
    path: 'tareas',
    loadChildren: () =>
      loadRemoteModule({
        remoteEntry: `${ENVIRONMENT.REMOTE_APPS.tareas}/remoteAppEntry.js`,
        remoteName: 'tareas',
        exposedModule: './Module',
      }).then((m) => m.AppTareasModule),
  },
  // {
  //   path: 'tramites',
  //   loadChildren: () =>
  //     loadRemoteModule({
  //       remoteEntry: `${ENVIRONMENT.REMOTE_APPS.tramites}/remoteAppEntry.js`,
  //       remoteName: 'tramites',
  //       exposedModule: './Module',
  //     }).then((m) => m.AppTramitesModule),
  // },
  {
    path: 'usuarios',
    loadChildren: () =>
      loadRemoteModule({
        remoteEntry: `${ENVIRONMENT.REMOTE_APPS.usuarios}/remoteAppEntry.js`,
        remoteName: 'usuarios',
        exposedModule: './Module',
      }).then((m) => m.AppUsuariosModule),
  },
  {
    path: 'maritimos',
    loadChildren: () =>
      loadRemoteModule({
        remoteEntry: `${ENVIRONMENT.REMOTE_APPS.maritimos}/remoteAppEntry.js`,
        remoteName: 'maritimos',
        exposedModule: './Module',
      }).then((m) => m.AppMaritimosModule),
  },
  {
    path: 'ferroviarios',
    loadChildren: () =>
      loadRemoteModule({
        remoteEntry: `${ENVIRONMENT.REMOTE_APPS.ferroviarios}/remoteAppEntry.js`,
        remoteName: 'ferroviarios',
        exposedModule: './Module',
      }).then((m) => m.AppFerroviariosModule),
  },
  {
    path: 'bandeja-de-solicitudes',
    component: BandejaDeSolicitudesComponent,
  },
  {
    path: 'bandeja-de-tareas-pendientes',
    component: BandejaDeTareasPendientesComponent,
  },
  {
    path: 'confirmar-notificacion',
    component: ConfirmarNotificacionComponent,
  },
  {
    path: 'confirmar-resolucion',
    component: ConfirmarNotificacionComponent,
  },
  {
    path: 'subsecuentes',
    component: SubsecuentesComponent,
  },
  {
    path: 'consulta-tramite',
    component: MenuConsultaTramiteComponent,
  },  
];
