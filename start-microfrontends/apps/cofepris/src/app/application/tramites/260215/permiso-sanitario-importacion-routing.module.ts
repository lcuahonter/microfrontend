import { RouterModule, Routes } from '@angular/router';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src/core/resolvers/iniciar-tramite.resolver';
import { NgModule } from '@angular/core';
import { SanitarioComponent } from './pages/sanitario/sanitario.component';


const ROUTES: Routes = [
   {
    path: 'sanitario',
    component: SanitarioComponent,
    canActivate: [IniciarTramiteResolver],
        data: {
          iniciarConfig: {
            procedureId: '260215'
          }
        }
      },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'sanitario',
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class PermisoSanitarioImportacionRoutingModule { }
