import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { CertificadosComponent } from './certificados.component';
import { CertificadosService } from '../../services/certificados.service';
import { get } from 'http';

describe('CertificadosComponent', () => {
  let component: CertificadosComponent;
  let fixture: ComponentFixture<CertificadosComponent>;
  let certificadosServiceMock: any;

  beforeEach(async () => {
    certificadosServiceMock = {
      getFitosanitoriosEncabezadoDeTabla: jest.fn().mockReturnValue(of({ columns: ['Fito1', 'Fito2'] })),
      getPermisoCertificadosDeTabla: jest.fn().mockReturnValue(of({ columns: ['Permiso1', 'Permiso2'] })),
      getCertificadosDeTabla: jest.fn().mockReturnValue(of({ columns: ['Cert1', 'Cert2'] })),
      getCertificadosFilaDeTabla: jest.fn().mockReturnValue(of({ data:{row: 1 }})),
      getCertificadosFitoFilaDeTabla: jest.fn().mockReturnValue(of({ data: {fito: 2 }})),
      getPermisoCertificadosFilaDeTabla: jest.fn().mockReturnValue(of({ data: {permiso : 3} })),
    };

    await TestBed.configureTestingModule({
      imports:[CertificadosComponent],
      declarations: [],
      providers: [{ provide: CertificadosService, useValue: certificadosServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(CertificadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería obtener datos y establecer los datos de la tabla en ngOnInit', () => {
    expect(certificadosServiceMock.getFitosanitoriosEncabezadoDeTabla).toHaveBeenCalled();
    expect(certificadosServiceMock.getPermisoCertificadosDeTabla).toHaveBeenCalled();
    expect(certificadosServiceMock.getCertificadosDeTabla).toHaveBeenCalled();
    expect(certificadosServiceMock.getCertificadosFilaDeTabla).toHaveBeenCalled();
    expect(certificadosServiceMock.getCertificadosFitoFilaDeTabla).toHaveBeenCalled
    expect(certificadosServiceMock.getPermisoCertificadosFilaDeTabla).toHaveBeenCalled();

    expect(component.tablaFitosanitoriosData).toEqual(['Fito1', 'Fito2']);
    expect(component.tablaPermisoCertificadosData).toEqual(['Permiso1', 'Permiso2']);
    expect(component.tablaCertificadosData).toEqual(['Cert1', 'Cert2']);
    expect(component.tablaCertificadosFilaDatos).toEqual([{ row: 1 }]);
    expect(component.tablaFitosanitoriosFilaDatos).toEqual([{ fito: 2 }]);
    expect(component.tablaPermisoCertificadosFilaDatos).toEqual([{permiso:3}]);
  });

  it('debería establecer esFormularioSoloLectura en true cuando consultaioQuery emite readonly true', () => {
  const certificadosServiceMock = {
  getFitosanitoriosEncabezadoDeTabla: jest.fn().mockReturnValue(of({ columns: [] })),
  getPermisoCertificadosDeTabla: jest.fn().mockReturnValue(of({ columns: [] })),
  getCertificadosDeTabla: jest.fn().mockReturnValue(of({ columns: [] })),
  getCertificadosFilaDeTabla: jest.fn().mockReturnValue(of({ data: {} })),
  getCertificadosFitoFilaDeTabla: jest.fn().mockReturnValue(of({ data: {} })),
  getPermisoCertificadosFilaDeTabla: jest.fn().mockReturnValue(of({ data: {} })),
};
  const consultaioQueryMock = {
    selectConsultaioState$: {
      pipe: () => ({
        subscribe: (cb: any) => cb({ readonly: true })
      })
    }
  };

  const component = new CertificadosComponent(certificadosServiceMock as any, consultaioQueryMock as any);
  component.ngOnInit();

  expect(component.esFormularioSoloLectura).toBe(true);
});

  it('debería alternar showTableDiv y showFitosanitariosModal cuando se llama cambiarCertificadosFitosanitarios', () => {
    component.showTableDiv = true;
    component.showFitosanitariosModal = false;

    component.cambiarCertificadosFitosanitarios();

    expect(component.showTableDiv).toBe(false);
    expect(component.showFitosanitariosModal).toBe(true);
  });

  it('debería alternar showTableDiv y showAutorizacionesModal cuando se llama cambiarCertificadosAutorizaciones', () => {
    component.showTableDiv = true;
    component.showAutorizacionesModal = false;

    component.cambiarCertificadosAutorizaciones();

    expect(component.showTableDiv).toBe(false);
    expect(component.showAutorizacionesModal).toBe(true);
  });

    it('debería asignar tablaCertificadosData desde getCertificadosDeTabla', () => {
    expect(component.tablaCertificadosData).toEqual(['Cert1', 'Cert2']);
  });

  it('debería asignar tablaCertificadosFilaDatos desde getCertificadosFilaDeTabla', () => {
    expect(component.tablaCertificadosFilaDatos).toEqual([{ row: 1 }]);
  });

  it('debería asignar tablaFitosanitoriosFilaDatos desde getCertificadosFitoFilaDeTabla', () => {
    expect(component.tablaFitosanitoriosFilaDatos).toEqual([{ fito: 2 }]);
  });

  it('debería asignar tablaPermisoCertificadosFilaDatos desde getPermisoCertificadosFilaDeTabla', () => {
    expect(component.tablaPermisoCertificadosFilaDatos).toEqual([{ permiso: 3 }]);
  });

  it('debería asignar tablaPermisoCertificadosData desde getPermisoCertificadosDeTabla', () => {
    expect(component.tablaPermisoCertificadosData).toEqual(['Permiso1', 'Permiso2']);
  });

  it('debería alternar showFitosanitariosModal cuando se llama cambiarCertificadosFitosanitarios', () => {
    component.showFitosanitariosModal = false;
    component.cambiarCertificadosFitosanitarios();
    expect(component.showFitosanitariosModal).toBe(true);
    component.cambiarCertificadosFitosanitarios();
    expect(component.showFitosanitariosModal).toBe(false);
  });

  it('debería alternar showAutorizacionesModal cuando se llama cambiarCertificadosAutorizaciones', () => {
    component.showAutorizacionesModal = false;
    component.cambiarCertificadosAutorizaciones();
    expect(component.showAutorizacionesModal).toBe(true);
    component.cambiarCertificadosAutorizaciones();
    expect(component.showAutorizacionesModal).toBe(false);
  });

   it('debería limpiar las suscripciones en ngOnDestroy', () => {
    const destroySpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
  
});
