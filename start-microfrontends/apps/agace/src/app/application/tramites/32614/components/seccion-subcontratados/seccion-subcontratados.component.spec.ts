import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { SeccionSubcontratadosComponent } from './seccion-subcontratados.component';
import { SolicitudService } from '../../services/solicitud.service';
import { Solicitud32614Store } from '../../estados/solicitud32614.store';
import { Solicitud32614Query } from '../../estados/solicitud32614.query';
import {
  Catalogo,
  CatalogoSelectComponent,
  TituloComponent,
  ConsultaioQuery,
} from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SolicitudCatologoSelectLista, SeccionSubcontratados } from '../../models/solicitud.model';

describe('SeccionSubcontratadosComponent', () => {
  let component: SeccionSubcontratadosComponent;
  let fixture: ComponentFixture<SeccionSubcontratadosComponent>;
  let solicitudServiceMock: any;
  let solicitud32614StoreMock: any;
  let solicitud32614QueryMock: any;
  let consultaioQueryMock: any;

  const mockBimestreData = {
    catalogos: [
      { id: 1, descripcion: 'Primer Bimestre' },
      { id: 2, descripcion: 'Segundo Bimestre' },
    ],
    labelNombre: 'Bimestre',
    primerOpcion: 'Seleccione un bimestre',
    required: true,
  };

  const mockSolicitudState = {
    subcontrataRFCBusqueda: 'TEST123456',
    subcontrataRFC: 'TEST123456ABC',
    subcontrataRazonSocial: 'Empresa Test S.A. de C.V.',
    subcontrataEmpleados: '25',
    subcontrataBimestre: '1',
  };

  beforeEach(async () => {
    solicitudServiceMock = {
      conseguirSolicitudCatologoSelectLista: jest.fn().mockReturnValue(
        of({
          bimestre: mockBimestreData,
        } as SolicitudCatologoSelectLista)
      ),
      conseguirSeccionSubcontratados: jest.fn().mockReturnValue(
        of({
          subcontrataRFC: 'TEST123456ABC',
          subcontrataRazonSocial: 'Empresa Test S.A. de C.V.',
        } as SeccionSubcontratados)
      ),
    };

    solicitud32614StoreMock = {
      actualizarSubcontrataRFCBusqueda: jest.fn(),
      actualizarSubcontrataRFC: jest.fn(),
      actualizarSubcontrataRazonSocial: jest.fn(),
      actualizarSubcontrataEmpleados: jest.fn(),
      actualizarSubcontrataBimestre: jest.fn(),
    };

    solicitud32614QueryMock = {
      selectSolicitud$: of(mockSolicitudState),
    };

    consultaioQueryMock = {
      selectConsultaioState$: of({
        readonly: false,
      }),
    };

    await TestBed.configureTestingModule({
      imports: [
        SeccionSubcontratadosComponent,
        CommonModule,
        ReactiveFormsModule,
        CatalogoSelectComponent,
        TituloComponent,
        HttpClientTestingModule,
      ],
      declarations: [],
      providers: [
        FormBuilder,
        { provide: SolicitudService, useValue: solicitudServiceMock },
        { provide: Solicitud32614Store, useValue: solicitud32614StoreMock },
        { provide: Solicitud32614Query, useValue: solicitud32614QueryMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeccionSubcontratadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Creation and Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.subcontratadosForm).toBeDefined();
      expect(component.esFormularioSoloLectura).toBe(false);
      expect(component.bimestre).toBeDefined();
    });

    it('should initialize the form with all required controls', () => {
      expect(component.subcontratadosForm.get('subcontrataRFCBusqueda')).toBeDefined();
      expect(component.subcontratadosForm.get('subcontrataRFC')).toBeDefined();
      expect(component.subcontratadosForm.get('subcontrataRazonSocial')).toBeDefined();
      expect(component.subcontratadosForm.get('subcontrataEmpleados')).toBeDefined();
      expect(component.subcontratadosForm.get('subcontrataBimestre')).toBeDefined();
    });

    it('should disable RFC and Razon Social fields by default', () => {
      expect(component.subcontratadosForm.get('subcontrataRFC')?.disabled).toBe(true);
      expect(component.subcontratadosForm.get('subcontrataRazonSocial')?.disabled).toBe(true);
    });

    it('should load catalog data on initialization', () => {
      expect(solicitudServiceMock.conseguirSolicitudCatologoSelectLista).toHaveBeenCalled();
      expect(component.bimestre).toEqual(mockBimestreData);
    });
  });

  describe('Form State Management', () => {
    it('should patch form values from state', () => {
      const formValues = component.subcontratadosForm.getRawValue();
      expect(formValues.subcontrataRFCBusqueda).toBe(mockSolicitudState.subcontrataRFCBusqueda);
      expect(formValues.subcontrataRFC).toBe(mockSolicitudState.subcontrataRFC);
      expect(formValues.subcontrataRazonSocial).toBe(mockSolicitudState.subcontrataRazonSocial);
      expect(formValues.subcontrataEmpleados).toBe(mockSolicitudState.subcontrataEmpleados);
      expect(formValues.subcontrataBimestre).toBe(mockSolicitudState.subcontrataBimestre);
    });

    it('should handle readonly state from ConsultaioQuery', () => {
      consultaioQueryMock.selectConsultaioState$ = of({ readonly: true });
      
      const newComponent = TestBed.createComponent(SeccionSubcontratadosComponent);
      newComponent.detectChanges();
      
      expect(newComponent.componentInstance.esFormularioSoloLectura).toBe(true);
    });

    it('should disable form when in readonly mode', () => {
      component.esFormularioSoloLectura = true;
      component.guardarDatosFormulario();
      
      expect(component.subcontratadosForm.disabled).toBe(true);
    });

    it('should enable form when not in readonly mode', () => {
      component.esFormularioSoloLectura = false;
      component.guardarDatosFormulario();
      
      expect(component.subcontratadosForm.enabled).toBe(true);
    });
  });

  describe('Form Validation', () => {
    it('should validate required fields', () => {
      component.subcontratadosForm.patchValue({
        subcontrataRFCBusqueda: '',
        subcontrataEmpleados: '',
        subcontrataBimestre: '',
      });

      expect(component.subcontratadosForm.get('subcontrataRFCBusqueda')?.invalid).toBe(true);
      expect(component.subcontratadosForm.get('subcontrataEmpleados')?.invalid).toBe(true);
      expect(component.subcontratadosForm.get('subcontrataBimestre')?.invalid).toBe(true);
    });

    it('should validate RFC max length', () => {
      const longRFC = 'A'.repeat(14); // Exceeds 13 character limit
      component.subcontratadosForm.patchValue({
        subcontrataRFCBusqueda: longRFC,
      });

      expect(component.subcontratadosForm.get('subcontrataRFCBusqueda')?.hasError('maxlength')).toBe(true);
    });

    it('should validate employees number max length', () => {
      const longNumber = '123456'; // Exceeds 5 character limit
      component.subcontratadosForm.patchValue({
        subcontrataEmpleados: longNumber,
      });

      expect(component.subcontratadosForm.get('subcontrataEmpleados')?.hasError('maxlength')).toBe(true);
    });
  });

  describe('Store Update Methods', () => {
    it('should update RFC busqueda in store', () => {
      const event = { target: { value: 'NEW123456' } } as unknown as Event;
      component.actualizarSubcontrataRFCBusqueda(event);
      
      expect(solicitud32614StoreMock.actualizarSubcontrataRFCBusqueda).toHaveBeenCalledWith('NEW123456');
    });

    it('should update RFC in store', () => {
      const event = { target: { value: 'NEW123456ABC' } } as unknown as Event;
      component.actualizarSubcontrataRFC(event);
      
      expect(solicitud32614StoreMock.actualizarSubcontrataRFC).toHaveBeenCalledWith('NEW123456ABC');
    });

    it('should update razon social in store', () => {
      const event = { target: { value: 'Nueva Empresa S.A.' } } as unknown as Event;
      component.actualizarSubcontrataRazonSocial(event);
      
      expect(solicitud32614StoreMock.actualizarSubcontrataRazonSocial).toHaveBeenCalledWith('Nueva Empresa S.A.');
    });

    it('should update employees number in store', () => {
      const event = { target: { value: '50' } } as unknown as Event;
      component.actualizarSubcontrataEmpleados(event);
      
      expect(solicitud32614StoreMock.actualizarSubcontrataEmpleados).toHaveBeenCalledWith('50');
    });

    it('should update bimestre in store', () => {
      const catalogo: Catalogo = { 
        id: 2, 
        descripcion: 'Segundo Bimestre'
      } as Catalogo;
      component.actualizarSubcontrataBimestre(catalogo);
      
      expect(solicitud32614StoreMock.actualizarSubcontrataBimestre).toHaveBeenCalledWith(2);
    });
  });

  describe('RFC Search Functionality', () => {
    it('should call service to search RFC data', () => {
      component.buscarRFC();
      
      expect(solicitudServiceMock.conseguirSeccionSubcontratados).toHaveBeenCalled();
    });

    it('should update store with searched RFC data', () => {
      component.buscarRFC();
      
      expect(solicitud32614StoreMock.actualizarSubcontrataRFC).toHaveBeenCalledWith('TEST123456ABC');
      expect(solicitud32614StoreMock.actualizarSubcontrataRazonSocial).toHaveBeenCalledWith('Empresa Test S.A. de C.V.');
    });

    it('should handle service errors gracefully', () => {
      solicitudServiceMock.conseguirSeccionSubcontratados.mockReturnValue(
        new Subject().asObservable() // Observable that never emits
      );
      
      expect(() => component.buscarRFC()).not.toThrow();
    });
  });

  describe('Modal Actions', () => {
    it('should emit correct data on cerrarModal', () => {
      jest.spyOn(component.seccionSubcontratados, 'emit');
      
      component.subcontratadosForm.patchValue({
        subcontrataRFC: 'TEST123',
        subcontrataRazonSocial: 'Test Company',
        subcontrataEmpleados: '15',
        subcontrataBimestre: '2',
      });
      
      component.cerrarModal();
      
      expect(component.seccionSubcontratados.emit).toHaveBeenCalledWith({
        denominacion: 'Test Company',
        RFC: 'TEST123',
        numeroDeEmpleados: '15',
        bimestre: '2',
      });
    });

    it('should emit empty values when form is empty', () => {
      jest.spyOn(component.seccionSubcontratados, 'emit');
      
      component.subcontratadosForm.patchValue({
        subcontrataRFC: '',
        subcontrataRazonSocial: '',
        subcontrataEmpleados: '',
        subcontrataBimestre: '',
      });
      
      component.cerrarModal();
      
      expect(component.seccionSubcontratados.emit).toHaveBeenCalledWith({
        denominacion: '',
        RFC: '',
        numeroDeEmpleados: '',
        bimestre: '',
      });
    });
  });

  describe('Component Lifecycle', () => {
    it('should call inicializarEstadoFormulario on ngOnInit', () => {
      jest.spyOn(component, 'inicializarEstadoFormulario');
      
      component.ngOnInit();
      
      expect(component.inicializarEstadoFormulario).toHaveBeenCalled();
    });

    it('should complete destroy$ subject on ngOnDestroy', () => {
      const nextSpy = jest.spyOn(component['destroy$'], 'next');
      const completeSpy = jest.spyOn(component['destroy$'], 'complete');
      
      component.ngOnDestroy();
      
      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });

    it('should unsubscribe from observables on destroy', () => {
      const subscription = component['destroy$'];
      jest.spyOn(subscription, 'next');
      
      component.ngOnDestroy();
      
      expect(subscription.next).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle service errors when loading catalogs', () => {
      solicitudServiceMock.conseguirSolicitudCatologoSelectLista.mockReturnValue(
        new Subject().asObservable()
      );
      
      expect(() => component.conseguirSolicitudCatologoSelectLista()).not.toThrow();
    });

    it('should handle null/undefined values in form events', () => {
      const nullEvent = { target: null } as unknown as Event;
      
      expect(() => component.actualizarSubcontrataRFCBusqueda(nullEvent)).toThrow();
    });
  });

  describe('Form State Initialization', () => {
    it('should call guardarDatosFormulario when readonly is true', () => {
      jest.spyOn(component, 'guardarDatosFormulario');
      component.esFormularioSoloLectura = true;
      
      component.inicializarEstadoFormulario();
      
      expect(component.guardarDatosFormulario).toHaveBeenCalled();
    });

    it('should call inicializarFormulario when readonly is false', () => {
      jest.spyOn(component, 'inicializarFormulario');
      component.esFormularioSoloLectura = false;
      
      component.inicializarEstadoFormulario();
      
      expect(component.inicializarFormulario).toHaveBeenCalled();
    });
  });
});
