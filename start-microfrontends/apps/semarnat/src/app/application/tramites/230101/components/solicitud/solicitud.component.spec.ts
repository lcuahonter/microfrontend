
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, of, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { SolicitudComponent } from './solicitud.component';
import { FormBuilder } from '@angular/forms';
import { SolicitudPantallasService } from '../../services/solicitud-pantallas.service';
import { Solicitud230101Store } from '../../estados/tramites/tramites230101.store';
import { Solicitud230101Query } from '../../estados/queries/tramites230101.query';
import { MediodetransporteService } from '../../services/medio-de-transporte.service';
import { ValidacionesFormularioService, ConsultaioQuery, BtnContinuarComponent, WizardComponent } from '@ng-mf/data-access-user';
import { ToastrService } from 'ngx-toastr';
@Injectable()
class MockSolicitudPantallasService {
  getData = jest.fn().mockReturnValue(observableOf({})); 

}

@Injectable()
class MockSolicitud230101Store {
  setSelectedOptions = jest.fn();
  metodoNombre = jest.fn(); 

}

@Injectable()
class MockSolicitud230101Query {}

@Injectable()
class MockMediodetransporteService {
  getMedioDeTransporte = jest.fn().mockReturnValue(of([])); 

}

describe('SolicitudComponent', () => {
  let fixture: ComponentFixture<SolicitudComponent>;
  let component: { ngOnDestroy: () => void; FormSolicitud: { get?: any; disable?: any; enable?: any; }; tipoRegimen: { get?: any; }; aduanasSalida: { get?: any; }; selectedOptions: { controls?: any; }; mercancia: any; detalle: any; manifiestosForm: any; inicializaCatalogos: jest.Mock<any, any, any> | (() => void); solicitud230101Query: { selectSolicitud$?: any; }; crearFormulario: jest.Mock<any, any, any> | (() => void); consultaioQuery: { selectConsultaioState$?: any; }; inicializarEstadoFormulario: jest.Mock<any, any, any> | (() => void); ngOnInit: () => void; mediodetransporteService: { getMedioDeTransporte?: any; }; fb: { group?: any; array?: any; }; solicitudState: { regimen?: any; tipoProducto?: any; paisProcedencia?: any; selectedOptions?: any; clasificacionMercancia?: any; fraccionArancelaria?: any; descFraccionArancelaria?: any; cantidad?: any; cantidadLetra?: any; genero?: any; especie?: any; nombreComun?: any; descripcionProducto?: any; cantidadUMC?: any; manifiestosYdesc?: any; }; setValoresStore: jest.Mock<any, any, any> | ((arg0: { get: () => { value: {}; }; }, arg1: {}, arg2: {}) => void); cambiar: (arg0: { target: { checked: {}; }; }, arg1: {}) => void; solicitudService: { getData?: any; }; cargarDatosIniciales: () => void; disponsibleAduanaCheckboxes: {}; cambiarTipoRegimen: () => void; solicitud230101Store: {
    setSelectedOptions(setSelectedOptions: any): unknown; metodoNombre?: any; 
}; validacionesService: { isValid?: any; }; isValid: (arg0: {}, arg1: {}) => void; destroyNotifier$: { next?: any; complete?: any; }; };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule,BtnContinuarComponent,WizardComponent],
      declarations: [
        SolicitudComponent,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: SolicitudPantallasService, useClass: MockSolicitudPantallasService },
        { provide: Solicitud230101Store, useClass: MockSolicitud230101Store },
        { provide: Solicitud230101Query, useClass: MockSolicitud230101Query },
        { provide: MediodetransporteService, useClass: MockMediodetransporteService },
        ValidacionesFormularioService,
        {
          provide: ConsultaioQuery,
          useValue: {
            selectConsultaioState$: of({ readonly: false }), 
          },
        },
        {
          provide: Solicitud230101Query,
          useValue: {
            selectSolicitud$: of({ claveDeReferencia: '', cadenaPagoDependencia: '', banco: '', llaveDePago: '', fecPago: '', impPago: '' }), // Mock observable
          },
        },
        ConsultaioQuery,
        ToastrService,
        MockSolicitudPantallasService,
      ],
    }).overrideComponent(SolicitudComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(SolicitudComponent);
    component = fixture.debugElement.componentInstance;
    component.FormSolicitud = new FormBuilder().group({
      aduanasSalida: new FormGroup({
        selectedOptions: new FormArray([]), 
      }),
      tipoRegimen: new FormGroup({
        regimen: new FormControl(''),
      }),
    });
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run GetterDeclaration #tipoRegimen', async () => {
    component.FormSolicitud = component.FormSolicitud || {};
    component.FormSolicitud.get = jest.fn();
    const tipoRegimen = component.tipoRegimen;
     expect(component.FormSolicitud.get).toHaveBeenCalled();
  });

  it('should run GetterDeclaration #aduanasSalida', async () => {
    component.FormSolicitud = component.FormSolicitud || {};
    component.FormSolicitud.get = jest.fn();
    const aduanasSalida = component.aduanasSalida;
     expect(component.FormSolicitud.get).toHaveBeenCalled();
  });

  it('should clean up resources on destroy', () => {
  
    const destroyNotifierCompleteSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
  it('should run GetterDeclaration #selectedOptions', async () => {
    const mockFormGroup = new FormGroup({
      selectedOptions: new FormArray([]),
    });
  
    component.FormSolicitud = new FormBuilder().group({
      aduanasSalida: mockFormGroup, 
    });
  
    const getSpy = jest.spyOn(mockFormGroup, 'get');
  
    const selectedOptions = component.selectedOptions;
  
    expect(getSpy).toHaveBeenCalledWith('selectedOptions');
    expect(selectedOptions.controls).toEqual([]);
  });

  it('should run GetterDeclaration #mercancia', async () => {
    component.FormSolicitud = component.FormSolicitud || {};
    component.FormSolicitud.get = jest.fn();
    const mercancia = component.mercancia;
     expect(component.FormSolicitud.get).toHaveBeenCalled();
  });

  it('should run GetterDeclaration #detalle', async () => {
    component.FormSolicitud = component.FormSolicitud || {};
    component.FormSolicitud.get = jest.fn();
    const detalle = component.detalle;
     expect(component.FormSolicitud.get).toHaveBeenCalled();
  });

  it('should run GetterDeclaration #manifiestosForm', async () => {
    component.FormSolicitud = component.FormSolicitud || {};
    component.FormSolicitud.get = jest.fn();
    const manifiestosForm = component.manifiestosForm;
     expect(component.FormSolicitud.get).toHaveBeenCalled();
  });
 

  it('should run #inicializaCatalogos()', async () => {
    component.mediodetransporteService = component.mediodetransporteService || {};
    component.mediodetransporteService.getMedioDeTransporte = jest.fn().mockReturnValue(observableOf({}));
    component.inicializaCatalogos();
     expect(component.mediodetransporteService.getMedioDeTransporte).toHaveBeenCalled();
  });

  it('should run #crearFormulario()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.fb.array = jest.fn();
    component.solicitudState = component.solicitudState || {};
    component.solicitudState.regimen = 'regimen';
    component.solicitudState.tipoProducto = 'tipoProducto';
    component.solicitudState.paisProcedencia = 'paisProcedencia';
    component.solicitudState.selectedOptions = 'selectedOptions';
    component.solicitudState.clasificacionMercancia = 'clasificacionMercancia';
    component.solicitudState.fraccionArancelaria = 'fraccionArancelaria';
    component.solicitudState.descFraccionArancelaria = 'descFraccionArancelaria';
    component.solicitudState.cantidad = 'cantidad';
    component.solicitudState.cantidadLetra = 'cantidadLetra';
    component.solicitudState.genero = 'genero';
    component.solicitudState.especie = 'especie';
    component.solicitudState.nombreComun = 'nombreComun';
    component.solicitudState.descripcionProducto = 'descripcionProducto';
    component.solicitudState.cantidadUMC = 'cantidadUMC';
    component.solicitudState.manifiestosYdesc = 'manifiestosYdesc';
    component.crearFormulario();
     expect(component.fb.group).toHaveBeenCalled();
     expect(component.fb.array).toHaveBeenCalled();
  });

 
  it('should run #cargarDatosIniciales()', async () => {
    component.solicitudService = component.solicitudService || {};
    component.solicitudService.getData = jest.fn().mockReturnValue(observableOf({}));
    component.cargarDatosIniciales();
     expect(component.solicitudService.getData).toHaveBeenCalled();
  });

  it('should run #cambiarTipoRegimen()', async () => {
    component.FormSolicitud = new FormBuilder().group({
      tipoRegimen: new FormGroup({
        regimen: new FormControl('definitivos'), 
      }),
    });
  
    component.disponsibleAduanaCheckboxes = [
      { hide: true },
      { hide: true }, 
    ] as { hide: boolean }[];
  
    component.cambiarTipoRegimen();
  
    
  });

  it('should run #setValoresStore()', () => {
    const mockForm = {
      get: jest.fn().mockReturnValue({ value: 'mockValue' }), 
    } as unknown as FormGroup;
  
    component.solicitud230101Store = new MockSolicitud230101Store() as unknown as Solicitud230101Store;
  
    const selectedOptionsControl = mockForm.get('selectedOptions');
    if (selectedOptionsControl) {
      component.setValoresStore({ get: () => ({ value: selectedOptionsControl.value }) }, 'selectedOptions', 'setSelectedOptions');
    }
  
    expect(mockForm.get).toHaveBeenCalledWith('selectedOptions');
    expect(component.solicitud230101Store.setSelectedOptions).toHaveBeenCalledWith('mockValue');
  });
  it('should run #isValid()', async () => {
    component.validacionesService = {
      isValid: jest.fn().mockReturnValue(true), 
    };
  

    const result = component.isValid(new FormGroup({}), 'fieldName');
  
    expect(component.validacionesService.isValid).toHaveBeenCalledWith(expect.any(FormGroup), 'fieldName');
    expect(result).toBe(true);
  });

  it('should clean up destroyNotifier$ on component destroy', () => {
 
    component.destroyNotifier$ = {
      next: jest.fn(),
      complete: jest.fn(),
    };
  
    component.ngOnDestroy();

    
    expect(destroyNotifierCompleteSpy).toHaveBeenCalled();
    expect(component.destroyNotifier$.next).toHaveBeenCalled();
    expect(component.destroyNotifier$.complete).toHaveBeenCalled();
  });
})
})