import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Injectable } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of as observableOf, Subject, throwError } from 'rxjs';

import { SolicitudDeReporteComponent } from './solicitud-de-reporte.component';
import { InformeAnualProgramaService } from '../../services/informe-anual-programa.service';
import { Solicitud150103Store, Solicitud150103State } from '../../estados/solicitud150103.store';
import { Solicitud150103Query } from '../../estados/solicitud150103.query';
import { provideHttpClient } from '@angular/common/http';
import { JSONResponse } from '@libs/shared/data-access-user/src';

const mockSolicitudState: Solicitud150103State = {
  idSolicitud: 0,
  inicio: '01-2024',
  fin: '12-2024',
  folioPrograma: 'test-folio',
  modalidad: 'test-modalidad',
  tipoPrograma: 'test-tipo',
  estatus: 'Vigente',
  ventasTotales: '1000',
  totalExportaciones: '500',
  totalImportaciones: '300',
  saldo: '200',
  porcentajeExportacion: '50',
  indiceDeRegistroDelPrograma: 0
};

// Mock Services
@Injectable()
class MockInformeAnualProgramaService {
  getAllState = jest.fn().mockReturnValue(observableOf(mockSolicitudState));
  buildDatosReporte = jest.fn().mockReturnValue({ 
    fecha_inicio: '01-2024',
    fecha_fin: '12-2024',
    folio_programa: 'test-folio'
  });
  guardarDatosPost = jest.fn().mockReturnValue(observableOf({
    id: 12345,
    descripcion: 'Success',
    codigo: '200',
    datos: { idSolicitud: 12345, id_solicitud: 12345 }
  }));
}

@Injectable()
class MockSolicitud150103Store {
  setIdSolicitud = jest.fn();
}

@Injectable()
class MockSolicitud150103Query {
  seleccionarSolicitud$ = observableOf(mockSolicitudState);
}

describe('SolicitudDeReporteComponent', () => {
  let component: SolicitudDeReporteComponent;
  let fixture: ComponentFixture<SolicitudDeReporteComponent>;
  let mockInformeAnualService: MockInformeAnualProgramaService;
  let mockStore: MockSolicitud150103Store;
  let mockQuery: MockSolicitud150103Query;

  const setupWizardMock = () => {
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn()
    } as any;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [SolicitudDeReporteComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        provideHttpClient(),
        { provide: InformeAnualProgramaService, useClass: MockInformeAnualProgramaService },
        { provide: Solicitud150103Store, useClass: MockSolicitud150103Store },
        { provide: Solicitud150103Query, useClass: MockSolicitud150103Query }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudDeReporteComponent);
    component = fixture.componentInstance;
    mockInformeAnualService = TestBed.inject(InformeAnualProgramaService) as any;
    mockStore = TestBed.inject(Solicitud150103Store) as any;
    mockQuery = TestBed.inject(Solicitud150103Query) as any;
    
    // Mock wizard component
    setupWizardMock();

    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component properties correctly', () => {
    expect(component.indice).toBe(1);
    expect(component.pantallasPasos).toBeDefined();
    expect(component.pasos).toBeDefined();
    expect(component.datosPasos).toEqual({
      nroPasos: component.pantallasPasos.length,
      indice: 1,
      txtBtnAnt: 'Anterior',
      txtBtnSig: 'Continuar'
    });
    expect(component.infoAlert).toBe('alert-info');
  });

  it('should initialize solicitudState from query', () => {
    expect(component.solicitudState).toEqual(mockSolicitudState);
  });

  describe('getValorIndice', () => {
    it('should call obtenerDatosDelStore when indice is 1 and action is cont', () => {
      component.indice = 1;
      jest.spyOn(component, 'obtenerDatosDelStore').mockImplementation(() => {});

      component.getValorIndice({ accion: 'cont', valor: 1 });

      expect(component.obtenerDatosDelStore).toHaveBeenCalled();
      expect(component.datosPasos.indice).toBe(1);
    });

    it('should call pasoNavegarPor when valor is valid and not step 1 with cont', () => {
      component.indice = 2;
      jest.spyOn(component, 'pasoNavegarPor').mockImplementation(() => {});

      component.getValorIndice({ accion: 'atras', valor: 1 });

      expect(component.pasoNavegarPor).toHaveBeenCalledWith({ accion: 'atras', valor: 1 });
    });    
    
    it('should not execute any action when valor is invalid', () => {
      component.indice = 2; 
      const obtenerSpy = jest.spyOn(component, 'obtenerDatosDelStore').mockImplementation(() => {});
      const navegarSpy = jest.spyOn(component, 'pasoNavegarPor').mockImplementation(() => {});

      component.getValorIndice({ accion: 'cont', valor: 0 });
      
      const maxValor = component.pantallasPasos.length + 1;
      component.getValorIndice({ accion: 'cont', valor: maxValor });

      expect(obtenerSpy).not.toHaveBeenCalled();
      expect(navegarSpy).not.toHaveBeenCalled();
    });
  });

  describe('obtenerDatosDelStore', () => {
    it('should call getAllState and then guardar', () => {
      jest.spyOn(component, 'guardar').mockResolvedValue({} as JSONResponse);

      component.obtenerDatosDelStore();

      expect(mockInformeAnualService.getAllState).toHaveBeenCalled();
    });
  });

  describe('guardar', () => {
    it('should build payload and call guardarDatosPost successfully', async () => {
      jest.spyOn(component, 'pasoNavegarPor').mockImplementation(() => {});

      const result = await component.guardar(mockSolicitudState);

      expect(mockInformeAnualService.buildDatosReporte).toHaveBeenCalledWith(mockSolicitudState);
      expect(mockInformeAnualService.guardarDatosPost).toHaveBeenCalled();
      expect(mockStore.setIdSolicitud).toHaveBeenCalledWith(12345);
      expect(component.pasoNavegarPor).toHaveBeenCalledWith({ accion: 'cont', valor: 2 });
    });    it('should handle API response without valid idSolicitud', async () => {

      mockInformeAnualService.guardarDatosPost = jest.fn().mockReturnValue(observableOf({
        id: 0,
        descripcion: 'No ID', 
        codigo: '400',
        datos: { otherField: 'value' } // datos exists but no idSolicitud field
      }));

      jest.spyOn(component, 'pasoNavegarPor').mockImplementation(() => {});

      const result = await component.guardar(mockSolicitudState);

      expect(mockStore.setIdSolicitud).toHaveBeenCalledWith(0);
      expect(result).toEqual({
        id: 0,
        descripcion: 'No ID',
        codigo: '400',
        data: { otherField: 'value' }
      });
    });

    it('should handle API error', async () => {
      const errorResponse = new Error('API Error');
      mockInformeAnualService.guardarDatosPost = jest.fn().mockReturnValue(throwError(() => errorResponse));

      await expect(component.guardar(mockSolicitudState)).rejects.toThrow('API Error');
    });
  });
  describe('pasoNavegarPor', () => {
    beforeEach(() => {
      // Asegúrese de que cada prueba incluya un nuevo simulacro de asistente.
      setupWizardMock();
    });    it('should navigate to next step when action is cont', () => {
      const accionBoton = { accion: 'cont', valor: 2 };

      component.pasoNavegarPor(accionBoton);

      expect(component.indice).toBe(2);
      expect(component.datosPasos.indice).toBe(2);
      expect(component.wizardComponent.siguiente).toHaveBeenCalled();
    });    
    
    it('should navigate to previous step when action is atras', () => {
      const accionBoton = { accion: 'atras', valor: 1 };

      component.pasoNavegarPor(accionBoton);

      expect(component.indice).toBe(1);
      expect(component.datosPasos.indice).toBe(1);
      expect(component.wizardComponent.atras).toHaveBeenCalled();
    });

    it('should not call wizard methods when valor is out of range', () => {
      const accionBoton1 = { accion: 'cont', valor: 0 };
      const accionBoton2 = { accion: 'cont', valor: 5 };
      
      component.pasoNavegarPor(accionBoton1);
      component.pasoNavegarPor(accionBoton2);

      expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
      expect(component.wizardComponent.atras).not.toHaveBeenCalled();
    });
  });

  describe('Integration Tests', () => {
    it('should complete full flow from getValorIndice to guardar', async () => {
      component.indice = 1;
      jest.spyOn(component, 'pasoNavegarPor').mockImplementation(() => {});
      jest.spyOn(component, 'guardar').mockResolvedValue({} as JSONResponse);

      component.getValorIndice({ accion: 'cont', valor: 1 });

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(mockInformeAnualService.getAllState).toHaveBeenCalled();
    });
  });

});