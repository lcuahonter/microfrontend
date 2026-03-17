import { RouterModule, Routes } from '@angular/router';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src/core/resolvers/iniciar-tramite.resolver';
import { ModificacionPermisoImportacionComponent } from './pages/modificacion-permiso-importacion/modificacion-permiso-importacion.component';
import { NgModule } from '@angular/core';

const ROUTES: Routes = [
   {
        path: 'modificacion-permiso',
        component: ModificacionPermisoImportacionComponent,
        canActivate: [IniciarTramiteResolver],
        data: {
          iniciarConfig: {
            procedureId: '260917'
          }
        }
        
    
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'modificacion-permiso',
      }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class PermisoImportacionRoutingModule { }
