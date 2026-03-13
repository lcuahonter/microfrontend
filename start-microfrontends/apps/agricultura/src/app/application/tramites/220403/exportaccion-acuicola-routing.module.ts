import { RouterModule, Routes } from '@angular/router';
import { AcuicolaComponent } from './pages/acuicola/acuicola.component';
import { NgModule } from '@angular/core';

const ROUTES: Routes = [
  {
      path: 'acuicola',
      component: AcuicolaComponent
    },
    {
      path: '',
      pathMatch: 'full',
      redirectTo: 'acuicola',
    },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class ExportaccionAcuicolaRoutingModule { }
