import { AlertComponent, CargaDocumentoComponent, CatalogosService } from '@ng-mf/data-access-user';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule, forwardRef } from '@angular/core';
import { AnexarDocumentosComponent } from '@ng-mf/data-access-user';
import { BtnContinuarComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';
import { PasoCuatroComponent } from './pages/paso-cuatro/paso-cuatro.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { RegistroDigitalizarDocumentosRoutingModule } from './registro-digitalizar-documentos-routing.module';
import { SharedModule } from '@ng-mf/data-access-user';
import { SolicitanteComponent } from '@ng-mf/data-access-user';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';
import { TituloComponent } from '@ng-mf/data-access-user';
import { ToastrService } from 'ngx-toastr';
import { WizardComponent } from '@ng-mf/data-access-user';



@NgModule({
  declarations: [
   
    
   ],
  imports: [
    forwardRef(() => AlertComponent),
    AnexarDocumentosComponent,
    BtnContinuarComponent,
    CommonModule,
    FirmaElectronicaComponent,
    FormsModule,
    PasoUnoComponent,
    PasoDosComponent,
    PasoTresComponent,
    PasoCuatroComponent,
    ReactiveFormsModule,
    RegistroDigitalizarDocumentosRoutingModule,
    SolicitanteComponent,
    SolicitudPageComponent,
    forwardRef(() => TituloComponent),
    WizardComponent,
    SharedModule,
  ],
  providers: [ToastrService,CatalogosService],
})
export class RegistroDigitalizarDocumentosModule {}
