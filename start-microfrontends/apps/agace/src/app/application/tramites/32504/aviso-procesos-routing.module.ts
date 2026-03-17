import { RouterModule, Routes } from '@angular/router';
import { AcusePageComponent } from '@libs/shared/data-access-user/src';
import { IntroAvisoComponent } from './pages/intro-aviso/intro-aviso.component';
import { NgModule } from '@angular/core';

export const ROUTES_AVISO: Routes = [
  {
    path: 'solicitud',
    component: IntroAvisoComponent,
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
  imports: [RouterModule.forChild(ROUTES_AVISO)],
  exports: [RouterModule],
})
export class AvisoProcesosRoutingModule {}
