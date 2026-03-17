import { RouterModule, Routes } from '@angular/router';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src/core/resolvers/iniciar-tramite.resolver';
import { NgModule } from '@angular/core';
import { PlaguicidasComponent } from './pages/plaguicidas/plaguicidas.component';
const ROUTES: Routes = [
  //  {
  //     path: 'plaguicidas',
  //     component: PlaguicidasComponent,
  //   },
    {
    path: 'plaguicidas',
    component: PlaguicidasComponent,
    canActivate: [IniciarTramiteResolver],
        data: {
          iniciarConfig: {
            procedureId: '260513'
          }
        }
  },
    {
      path: '',
      pathMatch: 'full',
      redirectTo: 'plaguicidas',
    },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class MuestrasDeToxicosRoutingModule { }
