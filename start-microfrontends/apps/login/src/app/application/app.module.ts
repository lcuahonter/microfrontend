import {
  BreadcrumbComponent,
  FirmaElectronicaComponent,
  FooterComponent,
  HeaderComponent,
  InformacionUsuarioComponent,
  NavComponent,
  TituloComponent
} from '@libs/shared/data-access-user/src';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { AppRoutingModule } from './app-routing.module';
import { AuthPageComponent } from './auth/auth-page/auth-page.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';


@NgModule({
  declarations: [
    AuthPageComponent
  ],
  imports: [
    AkitaNgDevtools,
    AppRoutingModule,
    CommonModule,
    BreadcrumbComponent,
    FooterComponent,
    HeaderComponent,
    InformacionUsuarioComponent,
    InformacionUsuarioComponent,
    NavComponent,
    TituloComponent,
    FirmaElectronicaComponent,
  ]
})
export class AppLoginModule { }
