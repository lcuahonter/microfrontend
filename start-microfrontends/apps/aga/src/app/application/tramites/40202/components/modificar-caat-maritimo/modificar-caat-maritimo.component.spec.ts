import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ModificarCaatMaritimoComponent } from './modificar-caat-maritimo.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ModificacionTransportacionMaritimaService } from '../../services/modificacion-transportacion-maritima/modificacion-transportacion-maritima.service';
import { Tramite40202Store } from '../../../../core/estados/tramites/tramite40202.store';
import { Tramite40202Query } from '../../../../core/queries/tramite40202.query';
import { Modal } from 'bootstrap';

describe('ModificarCaatMaritimoComponent', () => {
  let component: ModificarCaatMaritimoComponent;
  let fixture: ComponentFixture<ModificarCaatMaritimoComponent>;
  let modificacionTransportacionMaritimaServiceMock: Partial<ModificacionTransportacionMaritimaService>;
  let tramite40202StoreMock: Partial<Tramite40202Store>;
  let tramite40202QueryMock: Partial<Tramite40202Query>;

  beforeEach(async () => {
    modificacionTransportacionMaritimaServiceMock = {
      getPaisCatalogo: jest.fn().mockReturnValue(of({ data: [{ id: 1, descripcion: 'Mexico' }] })),
      obtenerBuscarEmpresaCaat: jest.fn().mockReturnValue(of({ data: [] })),
    };

    tramite40202StoreMock = {
      setCaatRegistradoEmpresaTabla: jest.fn(),
      setCandidatoModificarCaatTabla: jest.fn(),
      setPaisPFE: jest.fn(),
      setNombrePFE: jest.fn(),
      setApellidoPaternoPFE: jest.fn(),
      setApellidoMaternoPFE: jest.fn(),
      setSeguroNumero: jest.fn(),
      setCorreoPFE: jest.fn(),
      setCodigoPostalPFE: jest.fn(),
      setCiudadPFE: jest.fn(),
      setEstadoPFE: jest.fn(),
      setCallePFE: jest.fn(),
      setNumeroExteriorPFE: jest.fn(),
      setNumeroInteriorPFE: jest.fn(),
      setBuscarPorDenominacionEx: jest.fn(),
      setFolioCaatBusquedaEx: jest.fn(),
      setBuscarPorRFCNa: jest.fn(),
      setBuscarPorDenominacionNa: jest.fn(),
      setFolioCaatBusquedaNa: jest.fn(),
      setMostrarAgregarSeleccionado: jest.fn()
    };

    tramite40202QueryMock = {
      selectSeccionState$: of({
        caatRegistradoEmpresaTabla: [],
        candidatoModificarCaatTabla: [],
        tipoDeEmpresaOpcion: 'Nacional',
      }),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule, ModificarCaatMaritimoComponent],
      providers: [
        FormBuilder,
        { provide: ModificacionTransportacionMaritimaService, useValue: modificacionTransportacionMaritimaServiceMock },
        { provide: Tramite40202Store, useValue: tramite40202StoreMock },
        { provide: Tramite40202Query, useValue: tramite40202QueryMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ModificarCaatMaritimoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize catalogos on init', () => {
    expect(modificacionTransportacionMaritimaServiceMock.getPaisCatalogo).toHaveBeenCalled();
    expect(component.pais).toEqual([{ id: 1, descripcion: 'Mexico' }]);
  });

  it('should initialize the reactive forms on init', () => {
    expect(component.buscarEmpresaForm).toBeDefined();
    expect(component.personaFisicaExtranjeraForm).toBeDefined();
  });

  it('should call setCaatRegistradoEmpresaTabla when limpiarCampos is called', () => {
    component.limpiarCampos();
    expect(tramite40202StoreMock.setCaatRegistradoEmpresaTabla).toHaveBeenCalledWith([]);
    expect(tramite40202StoreMock.setCandidatoModificarCaatTabla).toHaveBeenCalledWith([]);
  });

  it('should call obtenerBuscarEmpresaCaat when buscarEmpresa is called with 2', () => {
    const spy = jest.spyOn(component, 'obtenerBuscarEmpresaCaat');
    component.buscarEmpresa(2);
    expect(spy).toHaveBeenCalled();
  });

  it('should not call obtenerBuscarEmpresaCaat when buscarEmpresa is called with a value other than 2', () => {
    const spy = jest.spyOn(component, 'obtenerBuscarEmpresaCaat');
    component.buscarEmpresa(1);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should call setPaisPFE when paisSeleccion is called', () => {
    component.personaFisicaExtranjeraForm.patchValue({ paisPFE: 'Mexico' });
    component.paisSeleccion();
    expect(tramite40202StoreMock.setPaisPFE).toHaveBeenCalledWith('Mexico');
  });

  it('should show modal when mostrarModal is called', () => {
    const modalElemento = document.createElement('div');
    modalElemento.id = 'testModal';
    document.body.appendChild(modalElemento);

    const spy = jest.spyOn(document, 'getElementById').mockReturnValue(modalElemento);
    const modalShowSpy = jest.fn();
    jest.spyOn(Modal.prototype, 'show').mockImplementation(modalShowSpy);

    component.mostrarModal('testModal');
    expect(spy).toHaveBeenCalledWith('testModal');
    expect(modalShowSpy).toHaveBeenCalled();

    document.body.removeChild(modalElemento);
  });

  it('should call setCandidatoModificarCaatTabla when agregarPFE is called', () => {
    const personaFisicaExtranjeraFormDatos = {
      nombrePFE: 'John',
      apellidoPaternoPFE: 'Doe',
      apellidoMaternoPFE: 'Smith',
      seguroNumero: '123456789',
      correoPFE: 'john.doe@example.com',
      paisPFE: '1',
      codigoPostalPFE: '12345',
      ciudadPFE: 'Mexico City',
      estadoPFE: 'CDMX',
      callePFE: 'Main Street',
      numeroExteriorPFE: '123',
      numeroInteriorPFE: 'A',
      nombreDG: 'Director General',
    };

    component.pais = [{ id: 1, descripcion: 'Mexico' }];
    component.agregarPFE(personaFisicaExtranjeraFormDatos as any);

    expect(tramite40202StoreMock.setCandidatoModificarCaatTabla).toHaveBeenCalled();
    expect(component.candidatoModificarCaatTabla.length).toBe(1);
  });

  it('should reset personaFisicaExtranjeraForm when limpiarDatosPFE is called', () => {
    const spy = jest.spyOn(component.personaFisicaExtranjeraForm, 'reset');
    component.limpiarDatosPFE();
    expect(spy).toHaveBeenCalled();
  });

  it('should unsubscribe destruirNotificador$ on destroy', () => {
    const spy = jest.spyOn(component['destruirNotificador$'], 'next');
    const completeSpy = jest.spyOn(component['destruirNotificador$'], 'complete');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});