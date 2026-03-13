import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BreadcrumbComponent } from '@ng-mf/data-access-user';
import { CatalogosService } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { DocumentoService } from '@ng-mf/data-access-user';
import { FooterComponent } from '@ng-mf/data-access-user';
import { HeaderComponent } from '@ng-mf/data-access-user';
import { InformacionUsuarioComponent } from "@ng-mf/data-access-user";
import { InicioSesionService } from '@ng-mf/data-access-user';
import { NavComponent } from '@ng-mf/data-access-user';
import { NgModule } from '@angular/core';
import { RfcSolicitanteComponent } from '@libs/shared/data-access-user/src';
import { SeleccionTramiteComponent } from './seleccion-tramite/seleccion-tramite.component';
import { SolicitanteService } from '@ng-mf/data-access-user';
import { SubirDocumentoService } from '@ng-mf/data-access-user';
import { TituloComponent } from '@ng-mf/data-access-user';
import { ToastrModule } from 'ngx-toastr';
import { ToastrService} from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    SeleccionTramiteComponent
  ],
  imports: [
    CommonModule,
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
    provideToastr({
      positionClass: 'toast-top-right',
    }),
    provideHttpClient(),
    SolicitanteService,
    ToastrService,
    DocumentoService,
    InicioSesionService,
    SubirDocumentoService,
    CatalogosService 
  ],
  bootstrap: [AppComponent],
})
  
export class AppAgaceModule {}
