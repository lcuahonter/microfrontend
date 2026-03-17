import {
  BreadcrumbComponent,
  FooterComponent,
  HeaderComponent,
  NavComponent,
  TituloComponent
} from '@ng-mf/data-access-user';
import { provideToastr, ToastrModule, ToastrService } from 'ngx-toastr';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AkitaNgDevtools,
    AppRoutingModule,
    CommonModule,
    BreadcrumbComponent,
    FooterComponent,
    HeaderComponent,
    NavComponent,
    TituloComponent,
    ToastrModule.forRoot(),
],
  providers: [
    ToastrService,
    provideToastr({
      positionClass: 'toast-top-right',
    }),
    provideHttpClient(),
    ToastrService
  ],
  bootstrap: [AppComponent],
})
export class AppFuncionarioModule {}
