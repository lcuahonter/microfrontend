import { RouterModule, Routes } from '@angular/router';
import { AcusePageComponent } from '@libs/shared/data-access-user/src';
import { NgModule } from '@angular/core';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';

const ROUTES: Routes = [
  {
      path: 'solicitud',
      component: SolicitudPageComponent,
    },
    {
      path:'pasotres',
      component: PasoTresComponent
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
export class RegistroSolicitudDesistimientoRoutingModule { }
