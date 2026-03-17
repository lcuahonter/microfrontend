
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AlertComponent } from '@libs/shared/data-access-user/src';
import { CertificadoZoosanitario } from './certificado-zoosanitario-routing.module';
import { DatosDeLaSolicitudComponent } from './components/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { DatosParaMovilizacionNacionalComponent } from './components/datos-para-movilizacion-nacional/datos-para-movilizacion-nacional.component';
import { NgModule } from '@angular/core';
import { PagoDeDerechosComponent } from './components/pago-de-derechos/pago-de-derechos.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TercerospageComponent } from './components/tercerospage/tercerospage.component';
import { ZoosanitarioPageComponent } from './pages/zoosanitario-page/zoosanitario-page.component';

@NgModule({
  declarations: [
  ],
  imports: [
    AlertComponent,
    CertificadoZoosanitario,
    ReactiveFormsModule,
    PagoDeDerechosComponent,
    ToastrModule.forRoot(),
    DatosDeLaSolicitudComponent,
    DatosParaMovilizacionNacionalComponent,
    PasoDosComponent,
    PasoUnoComponent,
    ZoosanitarioPageComponent,
    TercerospageComponent
  ],
  providers: [
    ToastrService
  ]
})
export class CertificadoZoosanitarioModule { }