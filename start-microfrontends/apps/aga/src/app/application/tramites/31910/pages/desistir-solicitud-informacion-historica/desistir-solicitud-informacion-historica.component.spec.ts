import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DesistirSolicitudInformacionHistoricaComponent } from './desistir-solicitud-informacion-historica.component';
import { AlertComponent, BtnContinuarComponent, SolicitanteComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { PasoTresComponent } from '../paso-dos/paso-tres.component';
import { HttpClientModule } from '@angular/common/http';

describe('DesistirSolicitudInformacionHistoricaComponent', () => {
  let component: DesistirSolicitudInformacionHistoricaComponent;
  let fixture: ComponentFixture<DesistirSolicitudInformacionHistoricaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WizardComponent, BtnContinuarComponent, SolicitanteComponent, AlertComponent,PasoTresComponent,HttpClientModule],
      declarations: [DesistirSolicitudInformacionHistoricaComponent,PasoUnoComponent],
    
    }).compileComponents();

    fixture = TestBed.createComponent(
      DesistirSolicitudInformacionHistoricaComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });
});
