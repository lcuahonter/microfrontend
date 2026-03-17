import { AcusePageComponent } from '@libs/shared/data-access-user/src';
import { RouterModule, Routes } from '@angular/router';
import { AvisoModifyIvaEIepsComponent} from './pages/aviso-modify-iva-eieps/aviso-modify-iva-eieps.component';
import { NgModule } from '@angular/core';

export const ROUTES_AVISO_MODIFY_IVAELEPS: Routes = [
  {
    path: 'aviso-modificacion',
     component: AvisoModifyIvaEIepsComponent,
  },
   {
    path: 'acuse',
    component: AcusePageComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'aviso-modificacion',
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES_AVISO_MODIFY_IVAELEPS)],
  exports: [RouterModule]
})
export class AvisoModifyIvaEIepsAgaceRoutingModule { }
