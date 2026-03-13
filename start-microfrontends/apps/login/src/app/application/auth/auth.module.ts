import { CatalogoSelectComponent, FirmaPageComponent, TituloComponent } from '@ng-mf/data-access-user';
import { NgModule, forwardRef } from '@angular/core';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AuthRoutingModule } from './auth-routing.module';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    forwardRef(() => CatalogoSelectComponent),
    forwardRef(() => FirmaPageComponent),
    ToastrModule.forRoot(),
    HttpClientModule,
    TituloComponent,
  ],
  providers: [
    ToastrService,
    provideHttpClient()
  ]
})
export class AppLoginModule { }
