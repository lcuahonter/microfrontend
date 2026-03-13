import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const ROUTES: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./auth/auth.module').then(
        (m) => m.AppLoginModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
