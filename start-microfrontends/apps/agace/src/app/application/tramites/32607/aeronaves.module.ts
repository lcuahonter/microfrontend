import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, CatalogoSelectComponent, CatalogosService, CrosslistComponent, FirmaElectronicaComponent, InputCheckComponent, InputFechaComponent, InputHoraComponent, InputRadioComponent, SelectPaisesComponent, SharedModule, SolicitanteComponent, TablaDinamicaComponent, TituloComponent, TramiteFolioService, WizardComponent } from '@ng-mf/data-access-user';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { ToastrModule, ToastrService } from 'ngx-toastr'; 
import { AeronavesRoutingModule } from './aeronaves-routing.module'; 
import { CommonModule } from '@angular/common'; 
import { HttpClientModule } from '@angular/common/http'; 
import { NgModule } from '@angular/core'; 
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component'; 
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component'; 
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component'; 
import { RouterModule } from '@angular/router'; 
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component'; 


@NgModule({
  declarations: [],
  imports: [
    FirmaElectronicaComponent,
    CommonModule,
    RouterModule,
    FormsModule,
    HttpClientModule,
    WizardComponent,
    AeronavesRoutingModule,
    SharedModule,
    SolicitanteComponent,
    BtnContinuarComponent,
    InputCheckComponent,
    InputFechaComponent,
    InputHoraComponent,
    CrosslistComponent,
    ReactiveFormsModule,
    TituloComponent,
    SelectPaisesComponent,
    AnexarDocumentosComponent,
    AlertComponent,
    CatalogoSelectComponent,
    InputRadioComponent,
    TablaDinamicaComponent,
    ToastrModule.forRoot(),
    PasoUnoComponent,
    SolicitudPageComponent,
    PasoDosComponent,
    PasoTresComponent,
  ],
  exports: [],
  providers: [
    ToastrService,
    CatalogosService,
    TramiteFolioService,
  ],
})
export class AeronavesModule {}
