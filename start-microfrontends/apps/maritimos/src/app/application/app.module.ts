import { ToastrModule, ToastrService, provideToastr } from 'ngx-toastr';

import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { APPINJECT } from '../app.inject';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BreadcrumbComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { ENVIRONMENT } from '../environments/environment';
import { FooterComponent } from '@ng-mf/data-access-user';
import { HeaderComponent } from '@ng-mf/data-access-user';
import { InformacionUsuarioComponent } from "@ng-mf/data-access-user";
import { NavComponent } from '@ng-mf/data-access-user';
import { NgModule } from '@angular/core';
import { RfcSolicitanteComponent } from '@libs/shared/data-access-user/src';
import { SolicitanteService } from '@ng-mf/data-access-user';
import { TituloComponent } from "@ng-mf/data-access-user";
import { provideHttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AkitaNgDevtools,
    AppRoutingModule,
    CommonModule,
    BreadcrumbComponent,
    FooterComponent,
    HeaderComponent,
    InformacionUsuarioComponent,
    NavComponent,
    TituloComponent,
    ToastrModule.forRoot(),
    RfcSolicitanteComponent
],
  providers: [
    { provide: APPINJECT, useValue: ENVIRONMENT },
    ToastrService,
    provideToastr({
      positionClass: 'toast-top-right',
    }),
    provideHttpClient(),
    SolicitanteService
  ],
  bootstrap: [AppComponent],
})
export class AppMaritimosModule {}
