import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
  FooterComponent,
  SolicitanteService,
  TituloComponent,
} from '@ng-mf/data-access-user';
import { ToastrModule, ToastrService, provideToastr } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from '@ng-mf/data-access-user';
import { SeleccionTramiteComponent } from './seleccion-tramite/seleccion-tramite.component';
import { provideHttpClient } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent, SeleccionTramiteComponent],
  imports: [
    CommonModule,
    AppRoutingModule,
    FooterComponent,
    HeaderComponent,
    TituloComponent,
    ToastrModule.forRoot(),
  ],
  providers: [
    provideToastr({
      positionClass: 'toast-top-right',
    }),
    provideHttpClient(),
    ToastrService,
    SolicitanteService,
  ],
  bootstrap: [AppComponent],
})
export class AppSedenaModule {}
