import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DomiciliosDePlantasComponent } from './domicilios-de-plantas.component';
import { FormBuilder } from '@angular/forms';
import { ProsecService } from '../../services/prosec.service';
import { AutorizacionProsecStore, ProsecState } from '../../estados/autorizacion-prosec.store';
import { AUtorizacionProsecQuery } from '../../estados/autorizacion-prosec.query';
import { SeccionLibStore } from '@ng-mf/data-access-user';
import { SeccionLibQuery } from '@ng-mf/data-access-user';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

// Mock Data
const mockCatalogos = [{ id: 1, nombre: 'Mock' }];

// Mocks
const mockProsecService = {
  obtenerMenuDesplegable: jest.fn(),
  obtenerTablaDatos: jest.fn(),
  formValida: jest.fn(),
};

const mockAutorizacionProsecStore = {
  setDomiciliosFormaValida: jest.fn(),
  setEstado: jest.fn(),
  setRepresentacionFederal: jest.fn(),
  setActividadProductiva: jest.fn(),
};

const mockSeccionLibStore = {
  establecerFormaValida: jest.fn(),
};

const mockAUtorizacionProsecQuery = {
  selectProsec$: of<ProsecState>({
    modalidad: 'Importación',
    Estado: [
      { id: 1, descripcion: 'Jalisco', clave: 'JAL' }
    ],
    RepresentacionFederal: [
      { id: 10, descripcion: 'SAT', clave: 'SAT' }
    ],
    ActividadProductiva: [
      { id: 100, descripcion: 'Manufactura', clave: 'MAN' }
    ],
    Sector: [],
    Fraccion_arancelaria: '',
    contribuyentes: '',
    domiciliosFormaValida: false,
    productorFromValida: false,
    sectoresFromValida: false,
    sectorDatos: [],
    producirDatos: [],
    plantasDatos: [],
    productorDatos: [],
    prosecDatos: []
  })
};

const mockSeccionLibQuery = {
  selectSeccionState$: of({})
};

const mockConsultaioQuery = {};

describe('DomiciliosDePlantasComponent', () => {
  let component: DomiciliosDePlantasComponent;
  let fixture: ComponentFixture<DomiciliosDePlantasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DomiciliosDePlantasComponent],
      providers: [
        FormBuilder,
        { provide: ProsecService, useValue: mockProsecService },
        { provide: AutorizacionProsecStore, useValue: mockAutorizacionProsecStore },
        { provide: AUtorizacionProsecQuery, useValue: mockAUtorizacionProsecQuery },
        { provide: SeccionLibStore, useValue: mockSeccionLibStore },
        { provide: SeccionLibQuery, useValue: mockSeccionLibQuery }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DomiciliosDePlantasComponent);
    component = fixture.componentInstance;
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form and subscriptions on ngOnInit', fakeAsync(() => {
    mockProsecService.obtenerMenuDesplegable.mockReturnValue(of(mockCatalogos));
    mockProsecService.obtenerTablaDatos.mockReturnValue(of([]));
    mockProsecService.formValida.mockReturnValue(true);
    component.formularioDeshabilitado = false;
    component.ngOnInit();
    component.forma.patchValue({
      modalidad: 'A',
      Estado: 'B',
      RepresentacionFederal: 'C',
      ActividadProductiva: 'D'
    });
    component.forma.updateValueAndValidity();
    tick(20);
  }));

  it('should handle error in obtenerListaEstado', () => {
    mockProsecService.obtenerMenuDesplegable.mockReturnValueOnce(throwError(() => new Error('fail')));
    component.obtenerListaEstado();
    expect(component.estadoSeleccionar).toEqual([]);
  });

  it('should handle error in obtenerListaFederal', () => {
    mockProsecService.obtenerMenuDesplegable.mockReturnValueOnce(throwError(() => new Error('fail')));
    component.obtenerListaFederal();
    expect(component.RepresentacionFederal).toEqual([]);
  });

  it('should handle error in obtenerListaActividad', () => {
    mockProsecService.obtenerMenuDesplegable.mockReturnValueOnce(throwError(() => new Error('fail')));
    component.obtenerListaActividad();
    expect(component.ActividadProductiva).toEqual([]);
  });
});
