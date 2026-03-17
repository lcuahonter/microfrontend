import { AlertComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';

import { BtnContinuarComponent,SolicitanteComponent, TituloComponent, WizardComponent } from '@ng-mf/data-access-user';
import { RegistroTransportistaComponent } from './pages/registro-transportista/registro-transportista.component';

import { DatosDelTramiteComponent } from './components/datos-del-tramite/datos-del-tramite.component';
import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';
import { ToastrService } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';

import { RegistroTransportistaRoutingModule } from './registro-transportista-routing.module';

import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';

import { NgModule } from '@angular/core';


import { InicioSesionService } from '@libs/shared/data-access-user/src/core/services/shared/inicio-sesion/inicio-sesion.service';
import { SubirDocumentoService } from '@libs/shared/data-access-user/src/core/services/shared/subir-documento/subir-documento.service';


@NgModule({
    declarations: [RegistroTransportistaComponent,PasoUnoComponent,PasoTresComponent,],
    imports: [
        CommonModule,
        BtnContinuarComponent,
        TituloComponent,
        WizardComponent,
        SolicitanteComponent,
        DatosDelTramiteComponent,
        RegistroTransportistaRoutingModule,
        AlertComponent,
        FirmaElectronicaComponent,
    ],
    providers: [
        provideHttpClient(),
        InicioSesionService,
        SubirDocumentoService,
        ToastrService,
    ],
})
export class RegistroTransportistaModule { }