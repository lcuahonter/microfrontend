import { AlertComponent, CargaDocumentoComponent, CatalogoSelectComponent} from '@ng-mf/data-access-user';
import { AcuseReciboComponent } from '../../shared/components/acuse-recibo/acuse-recibo.component';
import { AnexarDocumentosComponent } from '@ng-mf/data-access-user';
import { BtnContinuarComponent } from '@ng-mf/data-access-user';
import { CarrosDeFerrocarrilComponent } from './shared/carros-de-ferrocarril/carros-de-ferrocarril.component';
import { CommonModule } from '@angular/common';
import { CrosslistComponent } from '@ng-mf/data-access-user';
import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';
import { FormsModule } from '@angular/forms';
import { HistorialInspeccionFisicaComponent } from './shared/historial-inspeccion-fisica/historial-inspeccion-fisica.component';
import { InputCheckComponent } from '@ng-mf/data-access-user';
import { InputFechaComponent } from '@ng-mf/data-access-user';
import { InputHoraComponent } from '@ng-mf/data-access-user';
import { InspeccionFisicaComponent } from './pages/inspeccion-fisica/inspeccion-fisica.component';
import { InspeccionFisicaRoutingModule } from './inspeccion-fisica-routing.module';
import { MedioTransporteComponent } from './shared/medio-transporte/medio-transporte.component';
import { NgModule } from '@angular/core';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ResponsableInspeccionEnPuntoComponent } from './shared/responsable-inspeccion-en-punto/responsable-inspeccion-en-punto.component';
import { RouterModule } from '@angular/router';
import { SelectPaisesComponent } from '@ng-mf/data-access-user';
import { SharedModule } from '@ng-mf/data-access-user';
import { SolicitanteComponent } from '@ng-mf/data-access-user';
import { SolicitudComponent } from './components/solicitud/solicitud.component';
import { SolicitudDatosComponent } from './shared/solicitud-datos/solicitud-datos.component';
import { TituloComponent } from '@ng-mf/data-access-user';
import { ToastrModule } from 'ngx-toastr';
import { ToastrService } from 'ngx-toastr';
import { WizardComponent } from '@ng-mf/data-access-user';
import { forwardRef } from '@angular/core';

@NgModule({
  declarations: [],
  imports: [
    PasoDosComponent,
    PasoTresComponent,
    PasoUnoComponent,
    CommonModule,
    RouterModule,
    FormsModule,
    WizardComponent,
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
    FirmaElectronicaComponent,
    AnexarDocumentosComponent,
    AlertComponent,
    InspeccionFisicaRoutingModule,
    SharedModule,
    SolicitudDatosComponent,
    CarrosDeFerrocarrilComponent,
    HistorialInspeccionFisicaComponent,
    SolicitudComponent,
    ResponsableInspeccionEnPuntoComponent,
    MedioTransporteComponent,
    ToastrModule.forRoot(), 
    CatalogoSelectComponent,
     forwardRef(() => CargaDocumentoComponent),
    AcuseReciboComponent


  ],
  providers:[
    ToastrService
  ]
})
export class InspeccionFisicaModule {}
