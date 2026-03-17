import {
  AlertComponent,
  AnexarDocumentosComponent,
  BtnContinuarComponent,
  CatalogoSelectComponent,
  FirmaElectronicaComponent,
  PasoCargaDocumentoComponent,
  SharedModule,
  SolicitanteComponent,
  TituloComponent,
  WizardComponent,
} from '@ng-mf/data-access-user';
import { AggregarComplimentosComponent } from './component/aggregar-complimentos/aggregar-complimentos.component';
import { AnexoVistaDosYTresComponent } from './component/anexo-vista-dos-y-tres/anexo-vista-dos-y-tres.component';
import { AnexoVistaUnoComponent } from './component/anexo-vista-uno/anexo-vista-uno.component';
import { CommonModule } from '@angular/common';
import { EmpleadosComponent } from '../../shared/components/empleados/empleados.component';
import { EmpresasSubfabricanteComponent } from './component/empresas-subfabricante/empresas-subfabricante.component';
import { NgModule } from '@angular/core';

import { CapacidadInstaladaComponent } from '../../shared/components/capacidad-instalada/capacidad-instalada.component';
import { ComplementarPlantaComponent } from '../../shared/components/complementar-planta/complementar-planta.component';
import { FederatariosYPlantasComponent } from '../../shared/components/federatarios-y-plantas/federatarios-y-plantas.component';
import { FederatariosYPlantasVistaComponent } from './component/federatarios-y-plantas-vista/federatarios-y-plantas-vista.component';
import { MontosDeInversionComponent } from '../../shared/components/montos-de-inversion/montos-de-inversion.component';
import { NuevoProgramaIndustrialRoutingModule } from './nuevo-programa-industrial-routing.module';
import { PasoCapturarSolicitudComponent } from './pages/paso-capturar-solicitud/paso-capturar-solicitud.component';
import { PasoFirmaComponent } from '@libs/shared/data-access-user/src';
import { PasoFirmarSolicitudComponent } from './pages/paso-firmar-solicitud/paso-firmar-solicitud.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoCsComponent } from './pages/paso-uno-cs/paso-uno-cs.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PasoCapturarSolicitudComponent,
    PasoFirmarSolicitudComponent,
    PasoTresComponent,
    PasoUnoCsComponent,
    
  ],
  imports: [
    CommonModule,
    NuevoProgramaIndustrialRoutingModule,
    AlertComponent,
    AnexarDocumentosComponent,
    BtnContinuarComponent,
    CatalogoSelectComponent,
    FirmaElectronicaComponent,
    ReactiveFormsModule,
    SharedModule,
    SolicitanteComponent,
    TituloComponent,
    WizardComponent,
    AnexoVistaDosYTresComponent,
    FederatariosYPlantasComponent,
    AnexoVistaUnoComponent,
    FederatariosYPlantasVistaComponent,
    ComplementarPlantaComponent,
    MontosDeInversionComponent,
    EmpleadosComponent,
    CapacidadInstaladaComponent,
    AggregarComplimentosComponent,
    EmpresasSubfabricanteComponent,
    PasoFirmaComponent,
    PasoCargaDocumentoComponent
  ],
})
export class NuevoProgramaIndustrialModule {}
