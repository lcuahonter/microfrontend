import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CatalogoSelectComponent } from '@ng-mf/data-access-user';
import { DomiciliosDePlantasComponent } from './domicilios-de-plantas.component';
import { of, throwError } from 'rxjs';
import { ProsecService } from '../../services/prosec.service';
import { TituloComponent } from '@ng-mf/data-access-user';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

describe('DomiciliosDePlantasComponent', () => {
  let component: DomiciliosDePlantasComponent;
  let fixture: ComponentFixture<DomiciliosDePlantasComponent>;
  let prosecServiceMock: any;

  beforeEach(async () => {
    prosecServiceMock = {
      obtenerMenuDesplegable: jest.fn().mockReturnValue(of([])),
      obtenerTablaDatos: jest.fn().mockReturnValue(of({ plantasDatos: [] })),
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        TituloComponent,
        CatalogoSelectComponent,
        DomiciliosDePlantasComponent,
      ], // Import the custom component
      providers: [{ provide: ProsecService, useValue: prosecServiceMock }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA], // Add this to allow any custom elements
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DomiciliosDePlantasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe ser creado', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario en ngOnInit', () => {
    component.ngOnInit();
    expect(component.forma).toBeDefined();
    expect(component.forma.controls['modalidad']).toBeDefined();
    expect(component.forma.controls['Estado']).toBeDefined();
    expect(component.forma.controls['RepresentacionFederal']).toBeDefined();
    expect(component.forma.controls['ActividadProductiva']).toBeDefined();
  });

  it('debe llamar a obtenserListaEstado y establecer estadoSeleccionar', () => {
    const MOCKDATA = [{ id: 1, nombre: 'Estado 1' }];
    prosecServiceMock.obtenerMenuDesplegable.mockReturnValue(of(MOCKDATA));

    component.obtenerListaEstado();

    expect(prosecServiceMock.obtenerMenuDesplegable).toHaveBeenCalledWith(
      'estado.json'
    );
    expect(component.estadoSeleccionar).toEqual(MOCKDATA);
  });

  it('debe llamar a obtenserListaFederal y establecer RepresentacionFederal', () => {
    const MOCKDATA = [{ id: 1, nombre: 'Federal 1' }];
    prosecServiceMock.obtenerMenuDesplegable.mockReturnValue(of(MOCKDATA));

    component.obtenerListaFederal();

    expect(prosecServiceMock.obtenerMenuDesplegable).toHaveBeenCalledWith(
      'federal.json'
    );
    expect(component.RepresentacionFederal).toEqual(MOCKDATA);
  });

  it('debe llamar a obtenserListaActividad y establecer ActividadProductiva', () => {
    const MOCKDATA = [{ id: 1, nombre: 'Actividad 1' }];
    prosecServiceMock.obtenerMenuDesplegable.mockReturnValue(of(MOCKDATA));

    component.obtenerListaActividad();

    expect(prosecServiceMock.obtenerMenuDesplegable).toHaveBeenCalledWith(
      'actividad_productiva.json'
    );
    expect(component.ActividadProductiva).toEqual(MOCKDATA);
  });

  it('debe llamar a obtenerLista y llamar a obtenserListaFederal y obtenserListaActividad', () => {
    jest.spyOn(component, 'obtenerListaFederal');
    jest.spyOn(component, 'obtenerListaActividad');

    component.obtenerLista();

    expect(component.obtenerListaFederal).toHaveBeenCalled();
    expect(component.obtenerListaActividad).toHaveBeenCalled();
  });

  it('debe poblar plantasDatos en respuesta válida', () => {
    const mockPlantas = [
      {
        calle: 'Calle 1',
        numeroExterior: '10',
        municipioOAlcaldia: 'X',
        razonSocial: 'Empresa',
      },
    ];
    prosecServiceMock.obtenerTablaDatos.mockReturnValue(
      of({ plantasDatos: mockPlantas })
    );
    component.recuperarDatos();
    expect(component.plantasDatos).toEqual(mockPlantas);
  });

  it('debe establecer plantasDatos como un array vacío cuando la respuesta no contiene plantasDatos', () => {
    prosecServiceMock.obtenerTablaDatos.mockReturnValue(of({}));
    component.recuperarDatos();
    expect(component.plantasDatos).toEqual([]);
  });

  it('debe inicializar el formulario con los valores de domiciliosState', () => {
    (component as any).domiciliosState = {
      modalidad: 'A',
      Estado: 'CDMX',
      RepresentacionFederal: 'Sí',
      ActividadProductiva: 'Industria',
    };
    component.initActionFormBuild();
    expect(component.forma.value).toEqual({
      modalidad: 'A',
      Estado: 'CDMX',
      RepresentacionFederal: 'Sí',
      ActividadProductiva: 'Industria',
    });
  });

  it('debe deshabilitar el formulario cuando esFormularioSoloLectura es true', () => {
    component.forma = new FormBuilder().group({ Estado: [''] });
    component.esFormularioSoloLectura = true;
    component.guardarDatosFormulario();
    expect(component.forma.disabled).toBe(true);
  });

  it('debe habilitar el formulario cuando esFormularioSoloLectura es false', () => {
    component.forma = new FormBuilder().group({ Estado: [''] });
    component.esFormularioSoloLectura = false;
    component.guardarDatosFormulario();
    expect(component.forma.enabled).toBe(true);
  });

  it('debe habilitar el formulario cuando esFormularioSoloLectura es false', () => {
    component.forma = new FormBuilder().group({ Estado: [''] });
    component.esFormularioSoloLectura = false;
    component.guardarDatosFormulario();
    expect(component.forma.enabled).toBe(true);
  });

  it('debe llamar a guardarDatosFormulario si esFormularioSoloLectura es true', () => {
    component['esFormularioSoloLectura'] = true;
    const spy = jest.spyOn(component, 'guardarDatosFormulario');
    component.inicializarEstadoFormulario();
    expect(spy).toHaveBeenCalled();
  });

  it('debe llamar a inicializarFormulario si esFormularioSoloLectura es false', () => {
    component['esFormularioSoloLectura'] = false;
    const spy = jest.spyOn(component, 'inicializarFormulario');
    component.inicializarEstadoFormulario();
    expect(spy).toHaveBeenCalled();
  });

  it('debe establecer estadoSeleccionar como [] en caso de error', () => {
  prosecServiceMock.obtenerMenuDesplegable.mockImplementationOnce(() => {
    return throwError(() => new Error('fail'));
  });

  component.estadoSeleccionar = [{ id: 1, descripcion: 'test' }];
  component.obtenerListaEstado();

  expect(component.estadoSeleccionar).toEqual([]);
});

it('debe establecer RepresentacionFederal como [] en caso de error', () => {
  prosecServiceMock.obtenerMenuDesplegable.mockImplementationOnce(() => {
    return throwError(() => new Error('fail'));
  });

  component.RepresentacionFederal = [{ id: 1, descripcion: 'test' }];
  component.obtenerListaFederal();

  expect(component.RepresentacionFederal).toEqual([]);
});

it('debe establecer ActividadProductiva como [] en caso de error', () => {
  prosecServiceMock.obtenerMenuDesplegable.mockImplementationOnce(() => {
    return throwError(() => new Error('fail'));
  });

  component.ActividadProductiva = [{ id: 1, descripcion: 'test' }];
  component.obtenerListaActividad();

  expect(component.ActividadProductiva).toEqual([]);
});

  it('debe limpiar destroyNotifier$ en ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
