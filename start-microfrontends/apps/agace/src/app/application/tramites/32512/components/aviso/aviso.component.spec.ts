import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AvisoComponent } from './aviso.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SolicitudService } from '../../services/solicitud.service';
import { Solicitud32512Store } from '../../estados/solicitud32512.store';
import { Solicitud32512Query } from '../../estados/solicitud32512.query';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AlertComponent,
  CatalogoSelectComponent,
  InputFechaComponent,
  NotificacionesComponent,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AvisoComponent', () => {
  let component: AvisoComponent;
  let fixture: ComponentFixture<AvisoComponent>;
  let mockSolicitudService: any;
  let mockStore: any;
  let mockQuery: any;

  beforeEach(async () => {
    mockSolicitudService = {
      conseguirEntidadFederativa: jest.fn().mockReturnValue(of([])),
      conseguirMunicipioAlcaldia: jest.fn().mockReturnValue(of([])),
      conseguirColonia: jest.fn().mockReturnValue(of([])),
    };

    mockStore = {
      actualizarEntidadFederativa: jest.fn(),
      actualizarMunicipio: jest.fn(),
      actualizarColonia: jest.fn(),
      actualizarNombreComercial: jest.fn(),
      actualizarCalle: jest.fn(),
      actualizarNumeroExterior: jest.fn(),
      actualizarNumeroInterior: jest.fn(),
      actualizarCodigoPostal: jest.fn(),
      actualizarLugarEntidadFederativa: jest.fn(),
      actualizarLugarMunicipioAlcaldia: jest.fn(),
      actualizarLugarColonia: jest.fn(),
      actualizarLugarCalle: jest.fn(),
      actualizarLugarNumeroExterior: jest.fn(),
      actualizarLugarNumeroInterior: jest.fn(),
      actualizarLugarCodigoPostal: jest.fn(),
      actualizarGenerico1: jest.fn(),
      actualizarGenerico2: jest.fn(),
      actualizarArchivoDestruccion: jest.fn(),
    };

    mockQuery = {
      selectSolicitud$: of({
        nombreComercial: '',
        entidadFederativa: '',
        municipio: '',
        colonia: '',
        calle: '',
        numeroExterior: '',
        numeroInterior: '',
        codigoPostal: '',
        lugarEntidadFederativa: '',
        lugarMunicipioAlcaldia: '',
        lugarColonia: '',
        lugarCalle: '',
        lugarNumeroExterior: '',
        lugarNumeroInterior: '',
        lugarCodigoPostal: '',
        generico1: '',
        generico2: '',
        archivoDestruccion: '',
      }),
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        AvisoComponent,
        CommonModule,
        TituloComponent,
        ReactiveFormsModule,
        CatalogoSelectComponent,
        AlertComponent,
        InputFechaComponent,
        NotificacionesComponent,
        HttpClientTestingModule,
      ],
      declarations: [],
      providers: [
        FormBuilder,
        { provide: SolicitudService, useValue: mockSolicitudService },
        { provide: Solicitud32512Store, useValue: mockStore },
        { provide: Solicitud32512Query, useValue: mockQuery },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AvisoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form in ngOnInit', () => {
    expect(component.aviosForm).toBeDefined();
    expect(component.aviosForm.controls['nombreComercial']).toBeDefined();
  });

  it('should call actualizarNombreComercial and update store', () => {
    const event = { target: { value: 'Test Name' } } as any;
    component.actualizarNombreComercial(event);
    expect(mockStore.actualizarNombreComercial).toHaveBeenCalledWith(
      'Test Name'
    );
  });

  it('should update municipio when actualizarEntidadFederativa is called with valid id', () => {
    const catalogo = { id: 1 };
    component.actualizarEntidadFederativa(catalogo as any);
    expect(mockStore.actualizarEntidadFederativa).toHaveBeenCalledWith(1);
  });

  it('should validate form correctly', () => {
    component.aviosForm.markAllAsTouched();
    expect(component.validarFormulario()).toBe(false);
  });

  it('should clean up subscriptions on ngOnDestroy', () => {
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should add pedimento on cargaArchivoProcesos', () => {
    const initialLength = component.pedimentos.length;
    component.cargaArchivoProcesos();
    expect(component.pedimentos.length).toBe(initialLength + 1);
  });

  it('should delete pedimento on eliminarPedimento', () => {
    component.pedimentos = [{ pedimento: 1 } as any];
    component.elementoParaEliminar = 0;
    component.eliminarPedimento(true);
    expect(component.pedimentos.length).toBe(0);
  });

  it('should populate colonia.catalogos from conseguirColonia', () => {
    const mockResponse = [{ id: 1, descripcion: 'Colonia 1' }];
    mockSolicitudService.conseguirColonia.mockReturnValue(of(mockResponse));
    component.colonia = {
      labelNombre: '',
      required: true,
      primerOpcion: '',
      catalogos: [
        {
          id: 1,
          descripcion: '',
        },
      ],
    };

    component.conseguirColonia();

    expect(mockSolicitudService.conseguirColonia).toHaveBeenCalled();
    expect(component.colonia.catalogos).toEqual(mockResponse);
  });

  it('should populate lugarMunicipioAlcaldia.catalogos from conseguirLugarMunicipioAlcaldia', () => {
    const mockResponse = [{ id: 2, descripcion: 'Municipio 1' }];
    mockSolicitudService.conseguirMunicipioAlcaldia.mockReturnValue(
      of(mockResponse)
    );
    component.lugarMunicipioAlcaldia = {
      labelNombre: '',
      required: true,
      primerOpcion: '',
      catalogos: [
        {
          id: 1,
          descripcion: '',
        },
      ],
    };

    component.conseguirLugarMunicipioAlcaldia();

    expect(mockSolicitudService.conseguirMunicipioAlcaldia).toHaveBeenCalled();
    expect(component.lugarMunicipioAlcaldia.catalogos).toEqual(mockResponse);
  });

  it('should populate lugarColonia.catalogos from conseguirLugarColonia', () => {
    const mockResponse = [{ id: 3, descripcion: 'Lugar Colonia 1' }];
    mockSolicitudService.conseguirColonia.mockReturnValue(of(mockResponse));
    component.lugarColonia = {
      labelNombre: '',
      required: true,
      primerOpcion: '',
      catalogos: [
        {
          id: 1,
          descripcion: '',
        },
      ],
    };

    component.conseguirLugarColonia();

    expect(mockSolicitudService.conseguirColonia).toHaveBeenCalled();
    expect(component.lugarColonia.catalogos).toEqual(mockResponse);
  });

  it('should call conseguirColonia and actualizarMunicipio when actualizarMunicipioAlcaldia is called with valid id', () => {
    const spy = jest.spyOn(component, 'conseguirColonia');
    const evento = { id: 1 } as any;

    component.actualizarMunicipioAlcaldia(evento);

    expect(spy).toHaveBeenCalled();
    expect(mockStore.actualizarMunicipio).toHaveBeenCalledWith(1);
  });

  it('should call actualizarColonia with correct id', () => {
    const evento = { id: 5 } as any;

    component.actualizarColonia(evento);

    expect(mockStore.actualizarColonia).toHaveBeenCalledWith(5);
  });

  it('should call conseguirLugarMunicipioAlcaldia and actualizarLugarEntidadFederativa when id is valid', () => {
    const spy = jest.spyOn(component, 'conseguirLugarMunicipioAlcaldia');
    const evento = { id: 2 } as any;

    component.actualizarLugarEntidadFederativa(evento);

    expect(spy).toHaveBeenCalled();
    expect(mockStore.actualizarLugarEntidadFederativa).toHaveBeenCalledWith(2);
  });

  it('should call conseguirLugarColonia and actualizarLugarMunicipioAlcaldia when id is valid', () => {
    const spy = jest.spyOn(component, 'conseguirLugarColonia');
    const evento = { id: 3 } as any;

    component.actualizarLugarMunicipioAlcaldia(evento);

    expect(spy).toHaveBeenCalled();
    expect(mockStore.actualizarLugarMunicipioAlcaldia).toHaveBeenCalledWith(3);
  });

  it('should call actualizarLugarColonia with correct id', () => {
    const evento = { id: 7 } as any;

    component.actualizarLugarColonia(evento);

    expect(mockStore.actualizarLugarColonia).toHaveBeenCalledWith(7);
  });

  it('should call actualizarCalle with correct value', () => {
    const event = { target: { value: 'Some Street' } } as any;
    component.actualizarCalle(event);
    expect(mockStore.actualizarCalle).toHaveBeenCalledWith('Some Street');
  });

  it('should call actualizarNumeroExterior with correct value', () => {
    const event = { target: { value: '101' } } as any;
    component.actualizarNumeroExterior(event);
    expect(mockStore.actualizarNumeroExterior).toHaveBeenCalledWith('101');
  });

  it('should sanitize and patch numeroExterior in selectNumeroExterior', () => {
    const event = { target: { value: '10A @' } } as any;
    component.aviosForm.patchValue = jest.fn();
    component.selectNumeroExterior(event);
    expect(component.aviosForm.patchValue).toHaveBeenCalledWith({
      numeroExterior: expect.any(String),
    });
  });

  it('should call actualizarNumeroInterior with correct value', () => {
    const event = { target: { value: '201B' } } as any;
    component.actualizarNumeroInterior(event);
    expect(mockStore.actualizarNumeroInterior).toHaveBeenCalledWith('201B');
  });

  it('should sanitize and patch numeroInterior in selectNumeroInterior', () => {
    const event = { target: { value: 'INT#3' } } as any;
    component.aviosForm.patchValue = jest.fn();
    component.selectNumeroInterior(event);
    expect(component.aviosForm.patchValue).toHaveBeenCalledWith({
      numeroInterior: expect.any(String),
    });
  });

  it('should call actualizarCodigoPostal with correct value', () => {
    const event = { target: { value: '12345' } } as any;
    component.actualizarCodigoPostal(event);
    expect(mockStore.actualizarCodigoPostal).toHaveBeenCalledWith('12345');
  });

  it('should sanitize and patch codigoPostal in selectCodigoPostal', () => {
    const event = { target: { value: '12A34' } } as any;
    component.aviosForm.patchValue = jest.fn();
    component.selectCodigoPostal(event);
    expect(component.aviosForm.patchValue).toHaveBeenCalledWith({
      codigoPostal: expect.any(String),
    });
  });

  it('should call actualizarLugarCalle with correct value', () => {
    const event = { target: { value: 'Main St' } } as any;
    component.actualizarLugarCalle(event);
    expect(mockStore.actualizarLugarCalle).toHaveBeenCalledWith('Main St');
  });

  it('should call actualizarLugarNumeroExterior with correct value', () => {
    const event = { target: { value: '7B' } } as any;
    component.actualizarLugarNumeroExterior(event);
    expect(mockStore.actualizarLugarNumeroExterior).toHaveBeenCalledWith('7B');
  });

  it('should sanitize and patch lugarNumeroExterior in selectLugarNumeroExterior', () => {
    const event = { target: { value: 'APT #23' } } as any;
    component.aviosForm.patchValue = jest.fn();
    component.selectLugarNumeroExterior(event);
    expect(component.aviosForm.patchValue).toHaveBeenCalledWith({
      lugarNumeroExterior: expect.any(String),
    });
  });

  it('should call actualizarLugarNumeroInterior with correct value', () => {
    const event = { target: { value: 'INT-9' } } as any;
    component.actualizarLugarNumeroInterior(event);
    expect(mockStore.actualizarLugarNumeroInterior).toHaveBeenCalledWith(
      'INT-9'
    );
  });

  it('should sanitize and patch lugarNumeroInterior in selectLugarNumeroInterior', () => {
    const event = { target: { value: 'Level 2!' } } as any;
    component.aviosForm.patchValue = jest.fn();
    component.selectLugarNumeroInterior(event);
    expect(component.aviosForm.patchValue).toHaveBeenCalledWith({
      lugarNumeroInterior: expect.any(String),
    });
  });

  it('should call actualizarLugarCodigoPostal with correct value', () => {
    const event = { target: { value: '56001' } } as any;
    component.actualizarLugarCodigoPostal(event);
    expect(mockStore.actualizarLugarCodigoPostal).toHaveBeenCalledWith('56001');
  });

  it('should sanitize and patch lugarCodigoPostal in selectLugarCodigoPostal', () => {
    const event = { target: { value: '56A00' } } as any;
    component.aviosForm.patchValue = jest.fn();
    component.selectLugarCodigoPostal(event);
    expect(component.aviosForm.patchValue).toHaveBeenCalledWith({
      lugarCodigoPostal: expect.any(String),
    });
  });

  it('should call actualizarGenerico1 with correct string', () => {
    component.actualizarGenerico1('Some Value');
    expect(mockStore.actualizarGenerico1).toHaveBeenCalledWith('Some Value');
  });

  it('should call actualizarGenerico2 with correct value', () => {
    const event = { target: { value: 'ABC123' } } as any;
    component.actualizarGenerico2(event);
    expect(mockStore.actualizarGenerico2).toHaveBeenCalledWith('ABC123');
  });

  it('should sanitize and patch generico2 in selectGenerico2', () => {
    const event = { target: { value: '12A34' } } as any;
    component.aviosForm.patchValue = jest.fn();
    component.selectGenerico2(event);
    expect(component.aviosForm.patchValue).toHaveBeenCalledWith({
      generico2: expect.any(String),
    });
  });

  it('should disable form if esFormularioSoloLectura is true', () => {
    component.esFormularioSoloLectura = true;
    component.guardarDatosFormulario();
    expect(component.aviosForm.disabled).toBe(true);
  });

  it('should enable form if esFormularioSoloLectura is false', () => {
    component.esFormularioSoloLectura = false;
    component.guardarDatosFormulario();
    expect(component.aviosForm.enabled).toBe(true);
  });

  it('should call actualizarArchivoDestruccion when file is selected', () => {
    const file = new File(['dummy content'], 'test.pdf', {
      type: 'application/pdf',
    });
    const event = {
      target: {
        files: [file],
      },
    } as any;

    component.actualizarArchivoDestruccion(event);
    expect(mockStore.actualizarArchivoDestruccion).toHaveBeenCalledWith(file);
  });

  it('should not call actualizarArchivoDestruccion when no file is selected', () => {
    const event = {
      target: {
        files: [],
      },
    } as any;

    component.actualizarArchivoDestruccion(event);
    expect(mockStore.actualizarArchivoDestruccion).not.toHaveBeenCalled();
  });
});
