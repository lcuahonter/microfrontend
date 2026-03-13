import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { RegistroFiguraComponent } from './registro-figura.component';
import { Tramite303StoreService } from '../../../../core/estados/tramites/tramite303.store';
import { Tramite303Query } from '../../../../core/queries/tramite303.query';
import { TipoFiguraService } from '../../../../core/services/303/tipo-figura.service';
import { AgenteAduanal } from '../../../../core/models/303/agente-aduanal.model';

describe('RegistroFiguraComponent', () => {
  let component: RegistroFiguraComponent;
  let fixture: ComponentFixture<RegistroFiguraComponent>;
  let mockTramite303State: any;
  let mockTramite303Query: any;
  let mockFiguraService: any;
  let mockRouter: any;

  const mockAgenteAduanal: AgenteAduanal = {
    patente: '123456',
    nombreAgente: 'Juan',
    apellidoPaternoAgente: 'Pérez',
    apellidoMaternoAgente: 'García',
    rfcModal: 'PEGJ850615HDF',
    razonSocial: ''
  };

  const mockTramiteConsultado = {
    tipoFigura: '1',
    listaFiguras: [] as AgenteAduanal[]
  };

  beforeEach(async () => {
    mockTramite303State = {
      setListaFiguras: jest.fn()
    };
    
    mockTramite303Query = {
      selectSolicitud$: of(mockTramiteConsultado)
    };
    
    mockFiguraService = {
      consultaAgenteAduanal: jest.fn(),
      consultaApoderadoAduanal: jest.fn()
    };
    
    mockRouter = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [
        RegistroFiguraComponent,
        CommonModule,
        ReactiveFormsModule
      ],
      providers: [
        FormBuilder,
        { provide: Tramite303StoreService, useValue: mockTramite303State },
        { provide: Tramite303Query, useValue: mockTramite303Query },
        { provide: TipoFiguraService, useValue: mockFiguraService },
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroFiguraComponent);
    component = fixture.componentInstance;
    mockTramite303State = TestBed.inject(Tramite303StoreService);
    mockTramite303Query = TestBed.inject(Tramite303Query);
    mockFiguraService = TestBed.inject(TipoFiguraService);
    mockRouter = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize component with tramite data and create form', () => {
      // Act
      component.ngOnInit();

      // Assert
      expect(component.tramiteConsultado).toEqual(mockTramiteConsultado);
      expect(component.tipoFiguraSeleccionada).toBe('1');
      expect(component.FormFigura).toBeDefined();
    });

    it('should handle empty tramite data', () => {
      // Arrange
      const emptyTramite = { tipoFigura: '', listaFiguras: [] };
      mockTramite303Query.selectSolicitud$ = of(emptyTramite);

      // Act
      component.ngOnInit();

      // Assert
      expect(component.tipoFiguraSeleccionada).toBe('');
      expect(component.FormFigura).toBeDefined();
    });
  });

  describe('crearFormFigura', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should create form with required validators', () => {
      // Act
      component.crearFormFigura();

      // Assert
      const form = component.FormFigura;
      expect(form).toBeDefined();
      expect(form.get('idNumPatenteModal')?.hasError('required')).toBe(true);
      expect(form.get('rfcModal')?.hasError('pattern')).toBe(false);
    });

    it('should create form with disabled fields', () => {
      // Act
      component.crearFormFigura();

      // Assert
      const form = component.FormFigura;
      expect(form.get('nombreAgente')?.disabled).toBe(true);
      expect(form.get('apellidoPaternoAgente')?.disabled).toBe(true);
      expect(form.get('apellidoMaternoAgente')?.disabled).toBe(true);
      expect(form.get('patente')?.disabled).toBe(true);
    });

    it('should validate RFC pattern', () => {
      // Act
      component.crearFormFigura();
      const rfcControl = component.FormFigura.get('rfcModal');

      // Test invalid RFC
      rfcControl?.setValue('INVALID_RFC');
      expect(rfcControl?.hasError('pattern')).toBe(true);

      // Test valid RFC
      rfcControl?.setValue('PEGJ850615HDF');
      expect(rfcControl?.hasError('pattern')).toBe(false);
    });
  });

  describe('buscarFigura', () => {
    beforeEach(() => {
      component.ngOnInit();
      component.tipoFiguraSeleccionada = '1';
    });

    it('should show notification when patente is empty', () => {
      // Arrange
      component.FormFigura.patchValue({
        idNumPatenteModal: '',
        rfcModal: 'PEGJ850615HDF'
      });

      // Act
      component.buscarFigura();

      // Assert
      expect(component.nuevaNotificacion).toEqual({
        tipoNotificacion: 'alert',
        categoria: 'info',
        modo: 'action',
        titulo: '',
        mensaje: 'Debe ingresar el número de patente.',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      });
    });

    it('should search agente aduanal when tipo figura is 1', () => {
      // Arrange
      component.tipoFiguraSeleccionada = '1';
      component.FormFigura.patchValue({
        idNumPatenteModal: '123456',
        rfcModal: 'PEGJ850615HDF'
      });
      mockFiguraService.consultaAgenteAduanal.mockReturnValue(of(mockAgenteAduanal));

      // Act
      component.buscarFigura();

      // Assert
      expect(mockFiguraService.consultaAgenteAduanal).toHaveBeenCalledWith('123456', 'PEGJ850615HDF');
      expect(component.FormFigura.get('nombreAgente')?.value).toBe('Juan');
      expect(component.FormFigura.get('apellidoPaternoAgente')?.value).toBe('Pérez');
    });

    it('should search apoderado aduanal when tipo figura is 2', () => {
      // Arrange
      component.tipoFiguraSeleccionada = '2';
      component.FormFigura.patchValue({
        idNumPatenteModal: '123456',
        rfcModal: 'PEGJ850615HDF'
      });
      mockFiguraService.consultaApoderadoAduanal.mockReturnValue(of(mockAgenteAduanal));

      // Act
      component.buscarFigura();

      // Assert
      expect(mockFiguraService.consultaApoderadoAduanal).toHaveBeenCalledWith('123456', 'PEGJ850615HDF');
    });

    it('should show warning when agente aduanal is not found', () => {
      // Arrange
      component.tipoFiguraSeleccionada = '1';
      component.FormFigura.patchValue({
        idNumPatenteModal: '123456',
        rfcModal: 'PEGJ850615HDF'
      });
      mockFiguraService.consultaAgenteAduanal.mockReturnValue(of(null));

      // Act
      component.buscarFigura();

      // Assert
      expect(component.nuevaNotificacion.mensaje).toBe('No se encontró el agente aduanal con los datos proporcionados.');
      expect(component.nuevaNotificacion.categoria).toBe('warning');
    });

    it('should show warning when apoderado aduanal is not found', () => {
      // Arrange
      component.tipoFiguraSeleccionada = '2';
      component.FormFigura.patchValue({
        idNumPatenteModal: '123456',
        rfcModal: 'PEGJ850615HDF'
      });
      mockFiguraService.consultaApoderadoAduanal.mockReturnValue(of(null));

      // Act
      component.buscarFigura();

      // Assert
      expect(component.nuevaNotificacion.mensaje).toBe('No se encontró la patente.');
      expect(component.nuevaNotificacion.categoria).toBe('warning');
    });
  });

  describe('limpiarFigura', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should reset form and recreate it', () => {
      // Arrange
      component.FormFigura.patchValue({
        idNumPatenteModal: '123456',
        nombreAgente: 'Juan'
      });
      const crearFormSpy = jest.spyOn(component, 'crearFormFigura');

      // Act
      component.limpiarFigura();

      // Assert
      expect(crearFormSpy).toHaveBeenCalled();
      expect(component.FormFigura.get('idNumPatenteModal')?.value).toBe('');
      
      crearFormSpy.mockRestore();
    });
  });

  describe('agregarFigura', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should show alert when required fields are missing for agente aduanal', () => {
      // Arrange
      component.tipoFiguraSeleccionada = '1';
      component.FormFigura.patchValue({
        nombreAgente: '',
        apellidoPaternoAgente: 'Pérez',
        apellidoMaternoAgente: 'García',
        patente: '123456'
      });
      const notificacionSpy = jest.spyOn(component, 'notificacionAlert');

      // Act
      component.agregarFigura();

      // Assert
      expect(notificacionSpy).toHaveBeenCalled();
      
      notificacionSpy.mockRestore();
    });

    it('should show alert when required fields are missing for agencia aduanal', () => {
      // Arrange
      component.tipoFiguraSeleccionada = '3';
      component.FormFigura.patchValue({
        razonSocial: '',
        idNumPatenteModal: '123456'
      });
      const notificacionSpy = jest.spyOn(component, 'notificacionAlert');

      // Act
      component.agregarFigura();

      // Assert
      expect(notificacionSpy).toHaveBeenCalled();
      
      notificacionSpy.mockRestore();
    });

    it('should show warning when patente already exists', () => {
      // Arrange
      component.tipoFiguraSeleccionada = '3';
      component.FormFigura.patchValue({
        razonSocial: 'Agencia Test',
        idNumPatenteModal: '123456'
      });
      component['listaFiguras'] = [{ ...mockAgenteAduanal, patente: '123456' }];

      // Act
      component.agregarFigura();

      // Assert
      expect(component.nuevaNotificacion.mensaje).toBe('Esta patente/autorización ya fué capturada.');
    });

    it('should successfully add figura and navigate when all data is valid', () => {
      // Arrange
      component.tipoFiguraSeleccionada = '1';
      component.FormFigura.patchValue({
        nombreAgente: 'Juan',
        apellidoPaternoAgente: 'Pérez',
        apellidoMaternoAgente: 'García',
        patente: '123456',
        rfcModal: 'PEGJ850615HDF'
      });
      component['listaFiguras'] = [];
      const crearFormSpy = jest.spyOn(component, 'crearFormFigura');

      // Act
      component.agregarFigura();

      // Assert
      expect(component['listaFiguras']).toHaveLength(1);
      expect(mockTramite303State.setListaFiguras).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['aga/despacho-mercancias/registro']);
      expect(crearFormSpy).toHaveBeenCalled();
      
      crearFormSpy.mockRestore();
    });

    it('should handle agencia aduanal type correctly', () => {
      // Arrange
      component.tipoFiguraSeleccionada = '3';
      component.FormFigura.patchValue({
        razonSocial: 'Agencia Test',
        idNumPatenteModal: '789012'
      });
      component['listaFiguras'] = [];

      // Act
      component.agregarFigura();

      // Assert
      expect(component['listaFiguras']).toHaveLength(1);
      expect(component['listaFiguras'][0].razonSocial).toBe('Agencia Test');
      expect(component['listaFiguras'][0].patente).toBe('789012');
    });
  });

  describe('notificacionAlert', () => {
    it('should set correct notification for alert', () => {
      // Act
      component.notificacionAlert();

      // Assert
      expect(component.nuevaNotificacion).toEqual({
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'action',
        titulo: '',
        mensaje: 'No hay información para guardar',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      });
    });
  });

  describe('cancelarFigura', () => {
    it('should navigate to registro page', () => {
      // Act
      component.cancelarFigura();

      // Assert
      expect(mockRouter.navigate).toHaveBeenCalledWith(['aga/despacho-mercancias/registro']);
    });
  });

  describe('ngOnDestroy', () => {
    it('should complete destroy notifier', () => {
      // Arrange
      const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
      const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');

      // Act
      component.ngOnDestroy();

      // Assert
      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
      
      nextSpy.mockRestore();
      completeSpy.mockRestore();
    });
  });

  describe('Edge Cases', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should handle service errors gracefully', () => {
      // Arrange
      component.tipoFiguraSeleccionada = '1';
      component.FormFigura.patchValue({
        idNumPatenteModal: '123456',
        rfcModal: 'PEGJ850615HDF'
      });
      mockFiguraService.consultaAgenteAduanal.mockReturnValue(throwError('Service error'));

      // Act & Assert
      expect(() => component.buscarFigura()).not.toThrow();
    });

    it('should handle whitespace in form values', () => {
      // Arrange
      component.tipoFiguraSeleccionada = '1';
      component.FormFigura.patchValue({
        nombreAgente: '  Juan  ',
        apellidoPaternoAgente: '  Pérez  ',
        apellidoMaternoAgente: '  García  ',
        patente: '  123456  '
      });
      component['listaFiguras'] = [];

      // Act
      component.agregarFigura();

      // Assert
      expect(component['listaFiguras'][0].patente).toBe('123456');
    });

    it('should initialize empty listaFiguras when length is 0', () => {
      // Arrange
      component.tipoFiguraSeleccionada = '1';
      component.FormFigura.patchValue({
        nombreAgente: 'Juan',
        apellidoPaternoAgente: 'Pérez',
        apellidoMaternoAgente: 'García',
        patente: '123456'
      });
      component['listaFiguras'] = [];

      // Act
      component.agregarFigura();

      // Assert
      expect(Array.isArray(component['listaFiguras'])).toBe(true);
      expect(component['listaFiguras']).toHaveLength(1);
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should validate RFC format correctly', () => {
      // Arrange
      const rfcControl = component.FormFigura.get('rfcModal');

      // Test valid RFC formats
      const validRFCs = ['PEGJ850615HDF', 'XAXX010101000', 'GODE561231GR8'];
      validRFCs.forEach(rfc => {
        rfcControl?.setValue(rfc);
        expect(rfcControl?.hasError('pattern')).toBe(false);
      });

      // Test invalid RFC formats
      const invalidRFCs = ['INVALID', '123456789012', 'PEGJ85061', 'PEGJ850615HDFX'];
      invalidRFCs.forEach(rfc => {
        rfcControl?.setValue(rfc);
        expect(rfcControl?.hasError('pattern')).toBe(true);
      });
    });

    it('should require patente field', () => {
      // Arrange
      const patenteControl = component.FormFigura.get('idNumPatenteModal');

      // Test empty value
      patenteControl?.setValue('');
      expect(patenteControl?.hasError('required')).toBe(true);

      // Test with value
      patenteControl?.setValue('123456');
      expect(patenteControl?.hasError('required')).toBe(false);
    });
  });
});
