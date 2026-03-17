import { RouterModule, Routes } from '@angular/router';

import { CafeExportadoresComponent } from './pages/cafe-exportadores/cafe-exportadores.component';
import { NgModule } from '@angular/core';

const ROUTES: Routes = [
  {
      path: 'cafe-exportadores',
      component: CafeExportadoresComponent,
    },
    
    {
      path: 'cafe-de-exportadores',
      component: CafeExportadoresComponent,
    },
  {
    path:'cafeExportadores',
    component: CafeExportadoresComponent
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class NacionalRegistroDelCafeExportadoresRoutingModule { }
