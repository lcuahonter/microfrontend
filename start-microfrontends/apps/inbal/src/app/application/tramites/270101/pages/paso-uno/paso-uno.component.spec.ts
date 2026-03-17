import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { HttpClientModule } from '@angular/common/http';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src';
import { DatosDeLaSolicitudComponent } from '../../components/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { PeriodoEnElExtranjeroComponent } from '../../components/periodo-en-el-extranjero/periodo-en-el-extranjero.component';
import { MotivoDeLaExportacionComponent } from '../../components/motivo-de-la-exportacion/motivo-de-la-exportacion.component';
import { LugarDeDestinoComponent } from '../../components/lugar-de-destino/lugar-de-destino.component';
import { AduanaComponent } from '../../components/aduana/aduana.component';
import { PagoDeDerechosComponent } from '../../components/pago-de-derechos/pago-de-derechos.component';
import { of } from 'rxjs';
import { ExportarIlustracionesService } from '../../services/exportar-ilustraciones.service';
import { FormControl, FormGroup } from '@angular/forms';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let mockService: jest.Mocked<ExportarIlustracionesService>;

  beforeEach(async () => {
    mockService = {
      getExportarIlustracionesData: jest.fn().mockReturnValue(of({})),
      actualizarEstadoFormulario: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent],
      imports: [
        HttpClientModule,
        SolicitanteComponent,
        DatosDeLaSolicitudComponent,
        PeriodoEnElExtranjeroComponent,
        MotivoDeLaExportacionComponent,
        LugarDeDestinoComponent,
        AduanaComponent,
        PagoDeDerechosComponent,
      ],
      providers: [
        { provide: ExportarIlustracionesService, useValue: mockService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call guardarDatosFormulario when consultaState.update is true', () => {
    component.consultaState = { update: true } as any;
    const guardarDatosFormularioSpy = jest.spyOn(component, 'guardarDatosFormulario');
    component.ngOnInit();
    expect(guardarDatosFormularioSpy).toHaveBeenCalled();
  });

  it('should set esDatosRespuesta to true when consultaState.update is false', () => {
    component.consultaState = { update: false } as any;
    component.ngOnInit();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should call actualizarEstadoFormulario for each key-value pair in the response', () => {
    const responseMock = { moneda: 'USD', pais: 'MX' };
    mockService.getExportarIlustracionesData.mockReturnValue(of(responseMock));
    component.guardarDatosFormulario();
    expect(component.esDatosRespuesta).toBe(true);
    expect(mockService.actualizarEstadoFormulario).toHaveBeenCalledWith('moneda', 'USD');
    expect(mockService.actualizarEstadoFormulario).toHaveBeenCalledWith('pais', 'MX');
  });

  it('should set desactivarPestana true when extentoPago is true', () => {
    const form = new FormGroup({ extentoPago: new FormControl(true) });
    component.formularioEventoEmitir(form);
    expect(component.desactivarPestana).toBe(true);
  });

  it('should set desactivarPestana false when extentoPago is false', () => {
    const form = new FormGroup({ extentoPago: new FormControl(false) });
    component.formularioEventoEmitir(form);
    expect(component.desactivarPestana).toBe(false);
  });

  it('should complete destroyNotifier$', () => {
    const nextSpy = jest.spyOn((component as any).destroyNotifier$, 'next');
    const completeSpy = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
