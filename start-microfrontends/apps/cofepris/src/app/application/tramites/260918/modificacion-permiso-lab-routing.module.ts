import { RouterModule, Routes } from '@angular/router';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { ModificacionPermisoLabComponent } from './pages/modificacion-permiso-lab/modificacion-permiso-lab.component';
import { NgModule } from '@angular/core';


const ROUTES: Routes = [
  // {
  //   path:'modificacion-permiso-lab',
  //   component:ModificacionPermisoLabComponent
  // }

    {
        path: 'modificacion-permiso-lab',
        component: ModificacionPermisoLabComponent,
        canActivate: [IniciarTramiteResolver],
        resolve: { iniciarResolverData: IniciarTramiteResolver },
        data: {
        iniciarConfig: {
          procedureId: '260918'
        }
        }
      },
]; 

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class ModificacionPermisoLabRoutingModule { }
