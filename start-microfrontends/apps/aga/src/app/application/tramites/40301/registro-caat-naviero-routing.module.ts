import { RouterModule, Routes } from '@angular/router';
import { AcusePageComponent } from '@libs/shared/data-access-user/src';
import { NgModule } from '@angular/core';
import { RegistroCaatNavieroPageComponent } from './pages/registro-caat-naviero-page/registro-caat-naviero-page.component';


export const ROUTES_SOLICITUDES: Routes = [  
  {
    path: 'solicitud',
    component: RegistroCaatNavieroPageComponent,    
  },
  { 
    path: 'acuse',    
    component: AcusePageComponent,
  },
  { 
    path: '',
    pathMatch: 'full',
    redirectTo: 'caat-naviero',
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES_SOLICITUDES)],
  exports: [RouterModule],
})
export class RegistroCaatNavieroRoutingModule {}
