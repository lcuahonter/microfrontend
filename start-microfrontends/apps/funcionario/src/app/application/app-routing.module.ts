import { AcusePageComponent, FirmaPageComponent } from '@libs/shared/data-access-user/src';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';


const ROUTES: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./components/funcionario.module').then(
        (m) => m.FuncionarioModule
      ),
  },
  {
    path: 'notificaciones',
    loadChildren: () =>
      import('./notificaciones/notificaciones.module').then(
        (m) => m.NotificacionesModule
      ),
  },
  { path: 'firma-electronica',
    component: FirmaPageComponent
  },
  { path: 'acuse', 
    component: AcusePageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
