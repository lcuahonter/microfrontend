import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TipoDeAvisoComponent } from './tipo-de-aviso.component';
import { ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { Tramite32511Store } from '../../../../estados/tramites/tramite32511.store';
import { Tramite32511Query } from '../../../../estados/queries/tramite32511.query';
import { AvisoService } from '../../services/aviso.service';
import { TEXTOS } from '../../constantes/avisos.enum';
import { HttpClientTestingModule } from '@angular/common/http/testing';

const mockStore = {
  setEntidadFederativa: jest.fn(),
  setAlcaldiaMunicipio: jest.fn(),
  setColonia: jest.fn(),
  setFechaInicioEvento: jest.fn(),
  setFechaConclusionEvento: jest.fn(),
  setFechaDestruccion: jest.fn(),
};

const mockQuery = {
  selectSeccionState$: of({})
};

const mockService = {
  getEntidadFederativaCatalogo: jest.fn(() => of({ data: [] })),
  getAlcaldiaMunicipioCatalogo: jest.fn(() => of({ data: [] })),
  getColoniaCatalogo: jest.fn(() => of({ data: [] }))
};

describe('TipoDeAvisoComponent', () => {
  let component: TipoDeAvisoComponent;
  let fixture: ComponentFixture<TipoDeAvisoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TipoDeAvisoComponent, HttpClientTestingModule],
      declarations: [],
      providers: [
        { provide: Tramite32511Store, useValue: mockStore },
        { provide: Tramite32511Query, useValue: mockQuery },
        { provide: AvisoService, useValue: mockService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TipoDeAvisoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize catalogs on component creation', () => {    
    expect(mockService.getEntidadFederativaCatalogo).toHaveBeenCalled();
    expect(mockService.getAlcaldiaMunicipioCatalogo).toHaveBeenCalled();
    expect(mockService.getColoniaCatalogo).toHaveBeenCalled();
  });

  it('should call setEntidadFederativa', () => {
    component.avisoForm = component['fb'].group({
      datosEvento: component['fb'].group({
        entidadFederativa: ['MX']
      })
    });
    component.entidadFederativaSeleccion();
    expect(mockStore.setEntidadFederativa).toHaveBeenCalledWith('MX');
  });

  it('should call setAlcaldiaMunicipio', () => {
    component.avisoForm = component['fb'].group({
      datosEvento: component['fb'].group({
        alcaldiaMunicipio: ['CDMX']
      })
    });
    component.alcaldiaMunicipioSeleccion();
    expect(mockStore.setAlcaldiaMunicipio).toHaveBeenCalledWith('CDMX');
  });

  it('should call setColonia', () => {
    component.avisoForm = component['fb'].group({
      datosEvento: component['fb'].group({
        colonia: ['Roma']
      })
    });
    component.coloniaSeleccion();
    expect(mockStore.setColonia).toHaveBeenCalledWith('Roma');
  });

  it('should call cambioFechaInicioEvento', () => {
    const patchSpy = jest.spyOn(component['fb'].group({}), 'patchValue');
    component.avisoForm = component['fb'].group({
      datosEvento: component['fb'].group({
        fechaInicioEvento: ['']
      })
    });
    component.cambioFechaInicioEvento('2023-01-01');
    expect(mockStore.setFechaInicioEvento).toHaveBeenCalledWith('2023-01-01');
  });

  it('should call cambioFechaConclusionEvento', () => {
    component.avisoForm = component['fb'].group({
      datosEvento: component['fb'].group({
        fechaConclusionEvento: ['']
      })
    });
    component.cambioFechaConclusionEvento('2023-01-02');
    expect(mockStore.setFechaConclusionEvento).toHaveBeenCalledWith('2023-01-02');
  });

  it('should call cambioFechaDestruccion', () => {
    component.avisoForm = component['fb'].group({
      fechaDestruccion: ['']
    });
    component.cambioFechaDestruccion('2023-01-03');
    expect(mockStore.setFechaDestruccion).toHaveBeenCalledWith('2023-01-03');
  });

  it('should handle file selection in onCambioDeArchivo', () => {
    const fakeEvent = {
      target: { files: [new File([''], 'test.xlsx')] }
    } as unknown as Event;
    component.onCambioDeArchivo(fakeEvent);
    expect(component.etiquetaDeArchivo).toBe('test.xlsx');
  });

  it('should reset file label if no file is selected in onCambioDeArchivo', () => {
    const fakeEvent = {
      target: { files: [] }
    } as unknown as Event;
    component.onCambioDeArchivo(fakeEvent);
    expect(component.etiquetaDeArchivo).toBe(TEXTOS.ETIQUETA_DE_ARCHIVO);
  });

  it('should validate form and mark as touched if invalid', () => {
    component.avisoForm = component['fb'].group({});
    const result = component.validarFormulario();
    expect(result).toBe(true);
  });

  it('should return true for valid form in validarFormulario', () => {
    component.avisoForm = component['fb'].group({}, {});
    jest.spyOn(component.avisoForm, 'valid', 'get').mockReturnValue(true);
    const result = component.validarFormulario();
    expect(result).toBe(true);
  });

  it('should call the correct store method in setValoresStore', () => {
    const form = component['fb'].group({ fechaDestruccion: ['valor'] });
    const storeMethod = jest.fn();
    (mockStore as any).setFechaDestruccion = storeMethod;
    component.setValoresStore(form, 'fechaDestruccion', 'setFechaDestruccion');
    expect(storeMethod).toHaveBeenCalledWith('valor');
  });
});