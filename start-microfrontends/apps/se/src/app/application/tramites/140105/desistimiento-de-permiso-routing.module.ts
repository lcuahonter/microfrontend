import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src/core/resolvers/iniciar-tramite.resolver';
import { IntroPermisoComponent } from './pages/intro-permiso/intro-permiso.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';


const ROUTES: Routes = [
   {
    path: 'solicitante',
    component: IntroPermisoComponent,
    canActivate: [IniciarTramiteResolver],
        data: {
          iniciarConfig: {
            procedureId: '140105'
          }
        }
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'solicitante',
  },

];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class DesistimientoDePermisoRoutingModule { }
