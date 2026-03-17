import { RouterModule, Routes } from '@angular/router';
import { AceptaAccionesUsoComponent } from './acepta-acciones-uso/acepta-acciones-uso.component';
import { AuthPageComponent } from './auth-page/auth-page.component';
import { CambioContrasenaComponent } from './cambio-contrasena/cambio-contrasena.component';
import { ConsultaAccionistaExtranjeroFisicaComponent } from './consulta-accionista-extranjero-fisica/consulta-accionista-extranjero-fisica.component';
import { ConsultaAccionistaExtranjeroMoralComponent } from './consulta-accionista-extranjero-moral/consulta-accionista-extranjero-moral.component';
import { CondicionesUsoComponent } from './condiciones-uso/condiciones-uso.component';
import { ConsultaCapturistaPrivadoComponent } from './consulta-capturista-privado/consulta-capturista-privado.component';
import { ConsultaPersonaNotificacionesComponent } from './consulta-persona-notificaciones/consulta-persona-notificaciones.component';
import { ConsultaSocioAccionistaComponent } from './consulta-socio-accionista/consulta-socio-accionista.component';
import { FirmaPageComponent } from '@libs/shared/data-access-user/src';
import { MantenimientoCuentaComponent } from './mantenimiento-cuenta/mantenimiento-cuenta.component';
import { MenuUsuarioComponent } from './menu-usuario/menu-usuario.component';
import { ModificarCorreoElectronicoComponent } from './modificar-correo-electronico/modificar-correo-electronico.component';
import { NgModule } from '@angular/core';
import { RegistroCapturistaPrivadoComponent } from './registro-capturista-privado/registro-capturista-privado.component';
import { RegistroPersonaNotificacionesComponent } from './registro-persona-notificaciones/registro-persona-notificaciones.component';
import { RegistroSocioAccionistaComponent } from './registro-socio-accionista/registro-socio-accionista.component';
import { RegistroUsuarioSinfielComponent } from './registro-usuario-sinfiel/registro-usuario-sinfiel.component';

export const ROUTES_AUTH: Routes = [
  {
    path: '',
    component: AuthPageComponent
  },
  {
    path: 'cambio-contrasena',
    component: CambioContrasenaComponent
  },
  {
    path: 'registro-notificadores',
    component: RegistroPersonaNotificacionesComponent
  },
  {
    path: 'consulta-registro-notificador',
    component: ConsultaPersonaNotificacionesComponent
  },
  {
    path: 'firma-electronica',
    component: FirmaPageComponent
  },
  {
    path: 'registro-capturista-privado',
    component: RegistroCapturistaPrivadoComponent
  },
  {
    path: 'consulta-capturista',
    component: ConsultaCapturistaPrivadoComponent
  },
  {
    path: 'registro-socio-accionista',
    component: RegistroSocioAccionistaComponent
  },
  {
    path: 'consulta-socio-accionista',
    component: ConsultaSocioAccionistaComponent
  },
  {
    path: 'consulta-accionista-extranjero-fisica',
    component: ConsultaAccionistaExtranjeroFisicaComponent
  },
  {
    path: 'consulta-accionista-extranjero-moral',
    component: ConsultaAccionistaExtranjeroMoralComponent
  },
  {
    path: 'menu-usuario',
    component: MenuUsuarioComponent
  },
  {
    path: 'registro_sinFiel',
    component: RegistroUsuarioSinfielComponent
  },
  {
    path: 'mantenimiento-cuenta',
    component: MantenimientoCuentaComponent
  },
  {
    path: 'condiciones-uso',
    component: CondicionesUsoComponent
  },
  {
    path: 'acepta-condiciones',
    component: AceptaAccionesUsoComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(ROUTES_AUTH)],
  exports: [RouterModule]
})

export class AuthRoutingModule { }
