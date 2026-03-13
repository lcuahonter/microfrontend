import { RouterModule, Routes } from '@angular/router';
import { AcusePageComponent } from '@libs/shared/data-access-user/src';
import { AvisoReciclajeComponent } from './pages/aviso-reciclaje/aviso-reciclaje.component';
import { NgModule } from '@angular/core';

const ROUTES: Routes = [
  {
    path: 'datos',
    component: AvisoReciclajeComponent,
  },
  {
    path: 'acuse',
    component: AcusePageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class AvisoDeReciclajeRoutingModule {}
