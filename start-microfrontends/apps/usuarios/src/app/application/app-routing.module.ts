import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const ROUTES: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./usuarios-angular/usuarios-angular.routes').then(
        (m) => m.USUARIOS_ANGULAR_ROUTES
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class AppRoutingModule {}