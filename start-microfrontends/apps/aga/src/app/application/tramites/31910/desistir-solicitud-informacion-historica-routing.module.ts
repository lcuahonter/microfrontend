import { RouterModule, Routes } from '@angular/router';
import { AcusePageComponent } from '@libs/shared/data-access-user/src';
import { DesistirSolicitudInformacionHistoricaComponent } from './pages/desistir-solicitud-informacion-historica/desistir-solicitud-informacion-historica.component';
import { NgModule } from '@angular/core';

const ROUTES: Routes = [
  /**
   * Rutas del módulo 31910 - Desistir Solicitud de Información Histórica
   * Se usa el parametro por url para pruebas y desarrollo.
   * Se debe remover una vez implementado akita.
   */
  {
    path: '',
    component: DesistirSolicitudInformacionHistoricaComponent,
  },
  {
    path: 'acuse',
    component: AcusePageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class DesistirSolicitudInformacionHistoricaRoutingModule {}
