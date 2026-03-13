import { RouterModule, Routes } from '@angular/router';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src/core/resolvers/iniciar-tramite.resolver';
import { NgModule } from '@angular/core';
import { ProsecComponent } from './pages/prosec/prosec.component';

const ROUTES: Routes = [
  // {
  //   path: 'prosec',
  //   component: ProsecComponent,
  // },

    {
      path: 'prosec',
      component: ProsecComponent,
      canActivate: [IniciarTramiteResolver],
          data: {
            iniciarConfig: {
              procedureId: '90202'
            }
          }
    },
  {
    path: '',
    redirectTo: 'prosec',
    pathMatch: 'full'
  }
]; 
@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class AmpliacionProsecProductorRoutingModule {

 }
