import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const ROUTES: Routes = [
  {
    path: '', pathMatch: 'full', redirectTo: 'config'
  },
  {
    path: 'config',
    loadChildren: ()=>
      import ('./config/config-routing.module').then((m)=>m.ConfigRoutingModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
