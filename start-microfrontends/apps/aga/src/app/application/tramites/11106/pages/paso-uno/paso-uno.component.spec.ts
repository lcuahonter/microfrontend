import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { EventEmitter } from '@angular/core';
import { WizardComponent } from '@ng-mf/data-access-user';
import { PASOS } from '@libs/shared/data-access-user/src/tramites/constantes/11106/pasos.enum';
import { CancelacionDonacionesService } from '../../services/cancelacion-donaciones.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let mockCancelacionDonacionesService: jest.Mocked<CancelacionDonacionesService>;
  let mockConsultaioQuery: jest.Mocked<ConsultaioQuery>;

  beforeEach(() => {
    mockCancelacionDonacionesService = {
      obtenerCancelacionDonaciones: jest.fn().mockReturnValue(of({})),
      actualizarInformacionCancelacionDonaciones: jest.fn().mockReturnValue(of({})),
      getRegistroTomaMuestrasMercanciasData: jest.fn().mockReturnValue(of({ laAutorizacionEsNula: false })),
      actualizarEstadoFormulario: jest.fn()
    } as any;

    mockConsultaioQuery = {
      selectConsultaioState$: of({
        update: false,
        readonly: false
      })
    } as any;

    TestBed.configureTestingModule({
      imports: [PasoUnoComponent, HttpClientTestingModule],
      declarations: [],
      providers: [
        { provide: CancelacionDonacionesService, useValue: mockCancelacionDonacionesService },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery }
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializarse con valores predeterminados', () => {
    expect(component.indice).toBe(1);
    expect(component.pasos).toBe(PASOS);
    expect(component.datosPasos.nroPasos).toBe(PASOS.length);
    expect(component.datosPasos.indice).toBe(1);
    expect(component.datosPasos.txtBtnAnt).toBe('Anterior');
    expect(component.datosPasos.txtBtnSig).toBe('Continuar');
  });

  it('debería emitir continuarEvento cuando se llame a continuar', () => {
    const emitSpy = jest.spyOn(component.continuarEvento, 'emit');
    component.continuar();
    expect(emitSpy).toHaveBeenCalledWith('');
  });

  it('debería actualizar el índice cuando se llame a seleccionaTab', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('debería actualizar el índice y llamar a wizardComponent.siguiente cuando se llame a getValorIndice con "cont"', () => {
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as unknown as WizardComponent;

    const wizardSpy = jest.spyOn(component.wizardComponent, 'siguiente');
    component.getValorIndice({ accion: 'cont', valor: 2 });

    expect(component.indice).toBe(2);
    expect(wizardSpy).toHaveBeenCalled();
  });

  it('debería actualizar el índice y llamar a wizardComponent.atras cuando se llame a getValorIndice con "ant"', () => {
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as unknown as WizardComponent;

    const wizardSpy = jest.spyOn(component.wizardComponent, 'atras');
    component.getValorIndice({ accion: 'ant', valor: 2 });

    expect(component.indice).toBe(2);
    expect(wizardSpy).toHaveBeenCalled();
  });

  it('no debería actualizar el índice ni llamar a los métodos de wizardComponent si el valor está fuera de rango', () => {
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as unknown as WizardComponent;

    const siguienteSpy = jest.spyOn(component.wizardComponent, 'siguiente');
    const atrasSpy = jest.spyOn(component.wizardComponent, 'atras');

    component.getValorIndice({ accion: 'cont', valor: 0 });
    expect(component.indice).toBe(1);
    expect(siguienteSpy).not.toHaveBeenCalled();
    expect(atrasSpy).not.toHaveBeenCalled();

    component.getValorIndice({ accion: 'ant', valor: 6 });
    expect(component.indice).toBe(1);
    expect(siguienteSpy).not.toHaveBeenCalled();
    expect(atrasSpy).not.toHaveBeenCalled();
  });

  it('debería llamar a guardarDatosFormulario cuando consultaState.update es true', () => {
    // Test the guardarDatosFormulario method directly
    const serviceSpy = jest.spyOn(mockCancelacionDonacionesService, 'getRegistroTomaMuestrasMercanciasData');
    
    component.guardarDatosFormulario();
    
    expect(serviceSpy).toHaveBeenCalled();
  });

  it('debería establecer esDatosRespuesta como true en guardarDatosFormulario', () => {
    // Test that esDatosRespuesta is set to true when response is received
    component.guardarDatosFormulario();
    
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('debería llamar a actualizarEstadoFormulario cuando resp existe en guardarDatosFormulario', () => {
    const actualizarSpy = jest.spyOn(mockCancelacionDonacionesService, 'actualizarEstadoFormulario');
    
    component.guardarDatosFormulario();
    
    expect(actualizarSpy).toHaveBeenCalledWith({ laAutorizacionEsNula: false });
  });

  it('debería establecer esDatosRespuesta como true cuando update es false en ngOnInit', () => {
    component.ngOnInit();
    
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('debería establecer esDatosRespuesta como true cuando consultaState.update es false en ngOnInit', () => {
    component.ngOnInit();
    
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('debería llamar al servicio y actualizar estado cuando se ejecuta guardarDatosFormulario con respuesta válida', () => {
    const mockResponse = { laAutorizacionEsNula: true };
    mockCancelacionDonacionesService.getRegistroTomaMuestrasMercanciasData.mockReturnValue(of(mockResponse));
    const actualizarEstadoSpy = jest.spyOn(mockCancelacionDonacionesService, 'actualizarEstadoFormulario');
    
    component.guardarDatosFormulario();
    
    expect(mockCancelacionDonacionesService.getRegistroTomaMuestrasMercanciasData).toHaveBeenCalled();
    expect(component.esDatosRespuesta).toBe(true);
    expect(actualizarEstadoSpy).toHaveBeenCalledWith(mockResponse);
  });

  it('no debería actualizar estado cuando se ejecuta guardarDatosFormulario con respuesta null/undefined', () => {
    mockCancelacionDonacionesService.getRegistroTomaMuestrasMercanciasData.mockReturnValue(of(null as any));
    const actualizarEstadoSpy = jest.spyOn(mockCancelacionDonacionesService, 'actualizarEstadoFormulario');
    
    component.guardarDatosFormulario();
    
    expect(mockCancelacionDonacionesService.getRegistroTomaMuestrasMercanciasData).toHaveBeenCalled();
    expect(actualizarEstadoSpy).not.toHaveBeenCalled();
  });

  it('debería limpiar recursos en ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    
    component.ngOnDestroy();
    
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
