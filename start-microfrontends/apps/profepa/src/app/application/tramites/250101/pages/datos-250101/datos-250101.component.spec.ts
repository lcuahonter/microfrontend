import { ComponentFixture, TestBed } from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import { Datos250101Component } from './datos-250101.component';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { FloraFaunaService } from '../../services/flora-fauna.service';
import { of } from 'rxjs';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src';

describe('Datos250101Component', () => {
  let component: Datos250101Component;
  let fixture: ComponentFixture<Datos250101Component>;
  let consultaQueryMock: any;
  let floraFaunaServiceMock: any;
const mockSolicitanteService = { 
    validateTab: jest.fn().mockImplementation((tabIndex: number) => {
      return tabIndex > 0 && tabIndex <= 5; 
    }),
  };
  beforeEach(async () => {
    consultaQueryMock = {
      selectConsultaioState$: of({ update: false })
    };
    floraFaunaServiceMock = {
      getRegistroTomaMuestrasMercanciasData: jest.fn().mockReturnValue(of({ destinatarioRowData: [], agenteAduanalRowData: [] })),
      actualizarEstadoFormulario: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [Datos250101Component],
      imports:[HttpClientTestingModule,SolicitanteComponent],
      providers: [
        { provide: ConsultaioQuery, useValue: consultaQueryMock },
        { provide: FloraFaunaService, useValue: floraFaunaServiceMock },
         { provide: 'SolicitanteService', useValue: mockSolicitanteService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Datos250101Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener un valor predeterminado de indice igual a 1', () => {
    expect(component.indice).toBe(1);
  });

  it('debería actualizar el índice cuando se llama a seleccionaTab', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('debería validar el índice de la pestaña usando el servicio simulado', () => {
    const esValido = mockSolicitanteService.validateTab(3); 
    expect(esValido).toBe(true); 
  
    const esInvalido = mockSolicitanteService.validateTab(6); 
    expect(esInvalido).toBe(false); 
  });

  it('debería manejar valores negativos en seleccionaTab', () => {
    component.seleccionaTab(-1);
    expect(component.indice).toBe(-1);
  });

  it('debería manejar el valor cero en seleccionaTab', () => {
    component.seleccionaTab(0);
    expect(component.indice).toBe(0);
  });

  it('debería establecer esDatosRespuesta en true si consultaState.update es false', () => {
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('debería llamar a guardarDatosFormulario si consultaState.update es true', () => {
    consultaQueryMock.selectConsultaioState$ = of({ update: true });
    const guardarSpy = jest.spyOn(component, 'guardarDatosFormulario');
    component.ngOnInit();
    expect(guardarSpy).toHaveBeenCalled();
  });

  it('debería llamar a floraFaunaService.actualizarEstadoFormulario y establecer esDatosRespuesta en true en guardarDatosFormulario', () => {
    floraFaunaServiceMock.getRegistroTomaMuestrasMercanciasData.mockReturnValue(of({ destinatarioRowData: [], agenteAduanalRowData: [] }));
    component.esDatosRespuesta = false;
    component.guardarDatosFormulario();
    expect(floraFaunaServiceMock.actualizarEstadoFormulario).toHaveBeenCalledWith({ destinatarioRowData: [], agenteAduanalRowData: [] });
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('debería limpiar las suscripciones en ngOnDestroy', () => {
    const spyNext = jest.spyOn(component['destroyNotifier$'], 'next');
    const spyComplete = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });
});