import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';

import { ConsultadDomicilios90305Component } from './consultad-domicilios-90305.component';
import { TituloComponent, ConsultaioQuery, CatalogoResponse } from '@ng-mf/data-access-user';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { ProsecModificacionServiceTsService } from '../../services/prosec-modificacion.service';
import { Tramite90305State, Tramite90305Store } from '../../estados/tramite90305.store';
import { Tramite90305Query } from '../../estados/tramite90305.query';

describe('ConsultadDomicilios90305Component', () => {
  let component: ConsultadDomicilios90305Component;
  let fixture: ComponentFixture<ConsultadDomicilios90305Component>;

  const mockProsecService = {
    getEstadoData: jest.fn(),
    registrarFormulario: jest.fn(),
  };

  const mockTramiteStore = {
    setSelectedEstado: jest.fn(),
  };

  const mockTramiteQuery = {
    selectSolicitud$: jest.fn(),
  };

  const mockConsultaioQuery = {
    selectConsultaioState$: of({ readonly: false }),
  };

  const ESTADO_DATA: CatalogoResponse[] = [
    { id: 1, descripcion: 'Estado 1' },
    { id: 2, descripcion: 'Estado 2' },
  ];
const MOCK_STATE: Tramite90305State = {
  selectedEstado: 'Estado 1',
  registroFederalContribuyentes: '',
  representacionFederal: '',
  tipoModificacion: '',
  modificacionPrograma: ''
};
  

  beforeEach(async () => {
    Object.defineProperty(mockTramiteQuery, 'selectSolicitud$', {
      get: () => of(MOCK_STATE),
    });

    Object.defineProperty(mockConsultaioQuery, 'selectConsultaioState$', {
      get: () => of({ readonly: false }),
    });

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        TituloComponent,
        CatalogoSelectComponent,
        ConsultadDomicilios90305Component,
      ],
      providers: [
        FormBuilder,
        { provide: ProsecModificacionServiceTsService, useValue: mockProsecService },
        { provide: Tramite90305Store, useValue: mockTramiteStore },
        { provide: Tramite90305Query, useValue: mockTramiteQuery },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
      ],
    }).compileComponents();

 fixture = TestBed.createComponent(ConsultadDomicilios90305Component);
  component = fixture.componentInstance;
  // Use TestBed.inject to get FormBuilder for tests
  const fb = TestBed.inject(FormBuilder);
  component.formConsulta = fb.group({
    estadoControl: ['', Validators.required]
  });
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadEstado and inicializarEstadoFormulario on ngOnInit', () => {
    const loadSpy = jest.spyOn(component, 'loadEstado');
    const initSpy = jest.spyOn(component, 'inicializarEstadoFormulario');
    mockProsecService.getEstadoData.mockReturnValue(of(ESTADO_DATA));

    fixture.detectChanges(); // triggers ngOnInit

    expect(loadSpy).toHaveBeenCalled();
    expect(initSpy).toHaveBeenCalled();
  });

  it('should initialize formConsulta with selectedEstado from state', () => {
    mockProsecService.getEstadoData.mockReturnValue(of(ESTADO_DATA));
    fixture.detectChanges();
    expect(component.formConsulta.get('estadoControl')?.value).toBe('Estado 1');
  });

  describe('guardarDatosFormulario', () => {
    it('should initialize form with selectedEstado and enable form when not readonly', () => {
      component.solicitudState = { selectedEstado: 'Estado 1' } as any;
      component.esFormularioSoloLectura = false;
      component.guardarDatosFormulario();
      expect(component.formConsulta.get('estadoControl')?.value).toBe('Estado 1');
      expect(component.formConsulta.enabled).toBe(true);
    });

    it('should initialize form with selectedEstado and disable form when readonly', () => {
      const mockStateForTest = {
        selectedEstado: 'Estado 2',
        registroFederalContribuyentes: '',
        representacionFederal: '',
        tipoModificacion: '',
        modificacionPrograma: ''
      };
      
      Object.defineProperty(mockTramiteQuery, 'selectSolicitud$', {
        get: () => of(mockStateForTest),
      });
      
      component.esFormularioSoloLectura = true;
      component.guardarDatosFormulario();
      expect(component.formConsulta.get('estadoControl')?.value).toBe('Estado 2');
      expect(component.formConsulta.disabled).toBe(true);
    });
  });

  describe('buscarDomicilios', () => {
    it('should mark form as touched and not emit if invalid', () => {
      const fb = TestBed.inject(FormBuilder);
component.formConsulta = fb.group({
  estadoControl: ['', Validators.required]
});
      const emitSpy = jest.spyOn(component.domicilioBuscado, 'emit');
      component.buscarDomicilios();
      expect(component.formConsulta.touched).toBe(true);
      expect(emitSpy).not.toHaveBeenCalled();
    });

   it('should emit selected estado if form is valid', () => {
  const fb = TestBed.inject(FormBuilder);
  component.formConsulta = fb.group({
    estadoControl: ['Estado 1', Validators.required]
  });
  const emitSpy = jest.spyOn(component.domicilioBuscado, 'emit');
  component.buscarDomicilios();
  expect(emitSpy).toHaveBeenCalledWith('Estado 1');
});
  });

  it('should set estadoCatalogo in getEstadoCatalogo()', () => {
    mockProsecService.getEstadoData.mockReturnValue(of(ESTADO_DATA));
    component.getEstadoCatalogo();
    expect(component.estadoCatalogo).toEqual(ESTADO_DATA);
  });

  it('should set estadoJson in loadEstado()', () => {
    mockProsecService.getEstadoData.mockReturnValue(of(ESTADO_DATA));
    component.loadEstado();
    expect(component.estadoJson).toEqual(ESTADO_DATA);
  });

  it('should call setSelectedEstado in getMunicipios()', () => {
    component.formConsulta.get('estadoControl')?.setValue('Estado Test');
    component.getMunicipios();
    expect(mockTramiteStore.setSelectedEstado).toHaveBeenCalledWith('Estado Test');
  });

  it('should call destroyNotifier$.next and complete on ngOnDestroy()', () => {
    const nextSpy = jest.spyOn((component as any).destroyNotifier$, 'next');
    const completeSpy = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});