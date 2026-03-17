import { RouterModule, Routes } from '@angular/router';
import { AcusePageComponent } from '@libs/shared/data-access-user/src';
import { NgModule } from '@angular/core';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';

const ROUTES: Routes = [
  {
        path: 'solicitud',
        component: SolicitudPageComponent,
      },
     {
        path: 'acuse',
        component: AcusePageComponent,
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'solicitud',
      },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class EconomicoRoutingModule { }
