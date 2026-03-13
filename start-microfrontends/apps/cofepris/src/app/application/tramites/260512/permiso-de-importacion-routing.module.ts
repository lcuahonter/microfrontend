import { RouterModule, Routes } from '@angular/router';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { NgModule } from '@angular/core';
import { PaginasComponent } from './pages/paginas/paginas.component';
const ROUTES: Routes = [
    {
        path: 'pantallaspage',
        component: PaginasComponent,
        canActivate: [IniciarTramiteResolver],
            data: {
              iniciarConfig: {
                procedureId: '260512'
              }
        },
    },
    {
      path: '', pathMatch: 'full', redirectTo: 'pantallaspage' 
    },
  
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class PermisoDeImportacionRoutingModule { }
