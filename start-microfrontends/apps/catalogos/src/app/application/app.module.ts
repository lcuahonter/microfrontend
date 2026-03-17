import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BreadcrumbComponent } from '@ng-mf/data-access-user';
import { FooterComponent } from '@ng-mf/data-access-user';
import { HeaderComponent } from '@ng-mf/data-access-user';
import { InformacionUsuarioComponent } from '@ng-mf/data-access-user';
import { NavComponent } from '@ng-mf/data-access-user';
import { NgModule } from '@angular/core';
import { RfcSolicitanteComponent } from '@libs/shared/data-access-user/src';
import { InicioComponent } from './inicio/inicio.component';
import { SolicitanteService } from '@ng-mf/data-access-user';
import { TituloComponent } from "@ng-mf/data-access-user";
import { provideHttpClient } from '@angular/common/http';


@NgModule({
  declarations: [AppComponent, InicioComponent],
  imports: [
    AkitaNgDevtools,
    AppRoutingModule,
    BreadcrumbComponent,
    FooterComponent,
    HeaderComponent,
    InformacionUsuarioComponent,
    InformacionUsuarioComponent,
    NavComponent,
    TituloComponent,
    ToastrModule.forRoot(),
    RfcSolicitanteComponent
  ],
  providers: [ToastrService, provideHttpClient(), SolicitanteService],
  bootstrap: [AppComponent],
})
export class AppCatalogosModule { }
