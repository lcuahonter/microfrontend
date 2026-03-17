import { CatalogoSelectComponent, CatalogosService, FirmaPageComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { forwardRef, NgModule } from '@angular/core';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FuncionarioRoutingModule } from './funcionario-routing.module';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FuncionarioRoutingModule,
    forwardRef(() => CatalogoSelectComponent),
    forwardRef(() => FirmaPageComponent),
    ToastrModule.forRoot(),
    HttpClientModule,
    TituloComponent,
  ],
  providers: [
    ToastrService,
    CatalogosService
  ]
})
export class FuncionarioModule { }
