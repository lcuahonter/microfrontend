import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { AcusePageComponent } from '@libs/shared/data-access-user/src';
import { IntroPermisoComponent } from './pages/intro-permiso/intro-permiso.component';

export const ROUTES_PERMISO: Routes = [
  {
    path: 'intro-permiso',
    component: IntroPermisoComponent,
  },
  {
    path: 'acuse',
    component: AcusePageComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'intro-permiso',
  },

];

@NgModule({
  imports: [RouterModule.forChild(ROUTES_PERMISO)],
  exports: [RouterModule]
})
export class PermisoImportacionRoutingModule { }