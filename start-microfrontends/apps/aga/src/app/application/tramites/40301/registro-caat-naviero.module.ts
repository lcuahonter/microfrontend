import { BtnContinuarComponent, CatalogoSelectComponent, FirmaElectronicaComponent, NotificacionesComponent, SolicitanteComponent, TituloComponent, WizardComponent } from '@ng-mf/data-access-user';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CapturarComponent } from './components/capturar/capturar.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoFirmaComponent } from '@libs/shared/data-access-user/src';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { RegistroCaatNavieroPageComponent } from './pages/registro-caat-naviero-page/registro-caat-naviero-page.component';
import { RegistroCaatNavieroRoutingModule } from './registro-caat-naviero-routing.module';
import { RouterModule } from '@angular/router';
import { ServiciosExtraordinariosService } from './services/servicios-extraordinarios.service';

@NgModule({
  declarations: [
    RegistroCaatNavieroPageComponent,
    PasoUnoComponent,
    PasoDosComponent,
    CapturarComponent
  ],
  imports: [
    BtnContinuarComponent,
    CatalogoSelectComponent,
    CommonModule,    
    FirmaElectronicaComponent,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,    
    RegistroCaatNavieroRoutingModule,
    SolicitanteComponent,
    TituloComponent,
    WizardComponent,
    PasoFirmaComponent,
    NotificacionesComponent,
    ToastrModule.forRoot()
  ],
  exports: [],
  providers: [
    ToastrService,
    ServiciosExtraordinariosService
  ]
})
export class RegistroCaatNavieroModule {}
