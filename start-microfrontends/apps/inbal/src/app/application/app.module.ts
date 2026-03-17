import { ToastrModule, provideToastr } from 'ngx-toastr';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FooterComponent, SolicitanteService } from '@ng-mf/data-access-user';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from '@ng-mf/data-access-user';
import { provideHttpClient } from '@angular/common/http';

import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { BreadcrumbComponent } from '@ng-mf/data-access-user';
import { InformacionUsuarioComponent } from "@ng-mf/data-access-user";
import { NavComponent } from '@ng-mf/data-access-user';
import { TituloComponent } from "@ng-mf/data-access-user";

import { SeleccionTramiteComponent } from './seleccion-tramite/seleccion-tramite.component';





@NgModule({
  declarations: [AppComponent, SeleccionTramiteComponent],
  imports: [
    CommonModule,
    AppRoutingModule,
    FooterComponent,
    HeaderComponent,
    AkitaNgDevtools,
    BreadcrumbComponent,
    InformacionUsuarioComponent,
    NavComponent,
    TituloComponent,
    ToastrModule.forRoot(),
  ],
  providers: [
    provideToastr({
      positionClass: 'toast-top-right',
    }),
    provideHttpClient(),
    SolicitanteService
  ],
  bootstrap: [AppComponent],
})
export class AppInbalModule { }
