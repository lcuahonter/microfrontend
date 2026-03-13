import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InicioComponent } from './inicio/inicio.component';
import { NgModule } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

import { 
  BreadcrumbComponent, 
  FooterComponent, 
  HeaderComponent, 
  InformacionUsuarioComponent, 
  NavComponent, 
  RfcSolicitanteComponent, 
  SolicitanteService
} from '@ng-mf/data-access-user';

@NgModule({
  declarations: [
    AppComponent, 
    InicioComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AkitaNgDevtools,
    AppRoutingModule,
    BreadcrumbComponent,
    FooterComponent,
    HeaderComponent,
    InformacionUsuarioComponent,
    NavComponent,
    ToastrModule.forRoot(),
    RfcSolicitanteComponent
  ],
  providers: [ToastrService, provideHttpClient(), SolicitanteService],
  bootstrap: [AppComponent],
})
export class AppTramitesModule { }
