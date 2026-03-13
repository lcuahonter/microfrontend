import { RouterModule, Routes } from "@angular/router";
import { AcusePageComponent } from "@libs/shared/data-access-user/src";
import { FirmaPageComponent } from "./firma-page/firma-page.component";
import { NgModule } from "@angular/core";
import { NotificacionPageComponent } from "./notificacion-page/notificacion-page.component";

const ROUTES: Routes = [
  {
    path: '',
    component: NotificacionPageComponent
  },
  {
    path: 'firmar',
    component: FirmaPageComponent,
  },
  {
    path: 'acuse',
    component: AcusePageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class NotificacionesRoutingModule { }
