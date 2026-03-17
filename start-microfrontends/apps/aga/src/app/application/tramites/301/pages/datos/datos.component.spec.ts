import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosComponent } from './datos.component';
import { ConsultaioQuery, SolicitanteComponent } from '@libs/shared/data-access-user/src';
import { RegistroParaLaComponent } from '../../components/registro-para-la/registro-para-la.component';
import { DeLaMuestraComponent } from '../../components/de-la-muestra/de-la-muestra.component';
import { InformacionDeLaComponent } from '../../components/informacion-de-la/informacion-de-la.component';
import { PagoDeDerechosComponent } from '../../components/pago-de-derechos/pago-de-derechos.component';
import { of } from 'rxjs';
import { Pantallas301Service } from '../../services/pantallas301.service';
import { Solocitud301Service } from '../../services/service301.service';

describe('DatosComponent', () => {
  let component: DatosComponent;
  let fixture: ComponentFixture<DatosComponent>;
  const mockPantallas301Service = {};
  const mockSolocitud301Service = {
    getRegistroTomaMuestrasMercanciasData: jest.fn(),
    actualizarEstadoFormulario: jest.fn()
  };
  const mockConsultaQuery = {
    selectConsultaioState$: of({ readonly: false, update: false })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatosComponent],
      imports: [HttpClientTestingModule, SolicitanteComponent, RegistroParaLaComponent, DeLaMuestraComponent, InformacionDeLaComponent, PagoDeDerechosComponent], // Add necessary imports here if needed
      providers: [
        { provide: Pantallas301Service, useValue: mockPantallas301Service },
        { provide: Solocitud301Service, useValue: mockSolocitud301Service },
        { provide: ConsultaioQuery, useValue: mockConsultaQuery }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set esDatosRespuesta to true when update is false', () => {
    component.ngOnInit();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should call actualizarEstadoFormulario when guardarDatosFormulario is called with response', () => {
    const mockResponse = { anyData: true };
    mockSolocitud301Service.getRegistroTomaMuestrasMercanciasData.mockReturnValue(of(mockResponse));
    component.guardarDatosFormulario();
    expect(mockSolocitud301Service.actualizarEstadoFormulario).toHaveBeenCalledWith(mockResponse);
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should call destroyNotifier on ngOnDestroy', () => {
    const spyNext = jest.spyOn(component['destroyNotifier$'], 'next');
    const spyComplete = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });
});
