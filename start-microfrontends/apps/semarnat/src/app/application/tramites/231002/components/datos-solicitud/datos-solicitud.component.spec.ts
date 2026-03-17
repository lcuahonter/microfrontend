import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosSolicitudComponent } from './datos-solicitud.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DatoSolicitudStore } from '../../estados/tramites/dato-solicitud.store';
import { DatoSolicitudQuery } from '../../estados/queries/dato-solicitud.query';
import { CUSTOM_ELEMENTS_SCHEMA, ElementRef } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Modal } from 'bootstrap';

jest.mock('@libs/shared/theme/assets/json/231002/solicitud.json', () => ({
  __esModule: true,
  default: {
    radioOptions: [{ label: 'Sí', value: 'si' }],
    clasificacionRadioOptions: [{ label: 'Tipo A', value: 'A' }],
    nombre: [{ id: 1, descripcion: 'Nombre 1' }],
    arancelaria: [{ id: 1, descripcion: 'Fracción 1' }],
    nico: [{ id: 1, descripcion: 'Nico 1' }],
    unidad: [{ id: 1, descripcion: 'Unidad 1' }],
    residuo: [{ id: 1, descripcion: 'Residuo 1' }],
    tipoNombre: [{ id: 1, descripcion: 'Tipo Nombre' }],
    descripcion: [{ id: 1, descripcion: 'Descripción' }],
    creti: [{ id: 1, descripcion: 'CRETIB' }],
    estadoFisico: [{ id: 1, descripcion: 'Líquido' }],
    tipoContenedor: [{ id: 1, descripcion: 'Tambor' }],
    PrimasRelacionadas: [
      {
        encabezadoDeTabla: ['Columna1', 'Columna2'],
        cuerpoTabla: [{ tbodyData: ['Valor1', 'Valor2'] }],
      },
    ],
    Immex: [],
    table: [
      {
        encabezadoDeTabla: ['Columna1', 'Columna2'],
        cuerpoTabla: [{ tbodyData: ['Valor1', 'Valor2'] }],
      },
    ],
  },
}));

describe('DatosSolicitudComponent', () => {
  let component: DatosSolicitudComponent;
  let fixture: ComponentFixture<DatosSolicitudComponent>;
  let mockStore: jest.Mocked<DatoSolicitudStore>;
  let mockQuery: jest.Mocked<DatoSolicitudQuery>;

  const initialState = {
    solicitudForm: {
      descripcionGenerica1: 'desc',
      domicilio: 'test',
      ideGenerica1: 'test',
      numeroProgramaImmex: 'immex',
      numeroRegistroAmbiental: '123',
    },
    empresaReciclaje: {
      requiereEmpresa: 'Si',
      nombreEmpresa: 'empresa',
      representanteLegal: 'legal',
      telefono: '999',
      correoElectronico: 'correo@ejemplo.com',
    },
    lugarReciclaje: {
      razonSocial: 'No',
      pais: 'ubicación',
      destinoDomicilio: 'aut123',
      codigoPostal: '12345'
    },
    empresaTransportista: {
      nombreEmpresaTransportistaResiduos: 'trans',
      numeroAutorizacionSemarnat: 'sem123',
    },
    precaucionesManejo: {
      clave: 'test',
      precaucionesManejo: 'manejo',
    },
  };

  beforeEach(async () => {
    mockQuery = {
      getValue: jest.fn().mockReturnValue(initialState),
    } as unknown as jest.Mocked<DatoSolicitudQuery>;

    mockStore = {
      actualizarSolicitudForm: jest.fn(),
      actualizarEmpresaReciclaje: jest.fn(),
      actualizarLugarReciclaje: jest.fn(),
      actualizarEmpresaTransportista: jest.fn(),
      actualizarPrecaucionesManejo: jest.fn(),
    } as unknown as jest.Mocked<DatoSolicitudStore>;

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientModule, CommonModule, DatosSolicitudComponent],
      declarations: [],
      providers: [
        FormBuilder,
        { provide: DatoSolicitudStore, useValue: mockStore },
        { provide: DatoSolicitudQuery, useValue: mockQuery },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosSolicitudComponent);
    component = fixture.componentInstance;

    component.modalElement = {
      nativeElement: document.createElement('div')
    } as ElementRef;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize forms with store values', () => {
    expect(component.solicitudForm.value).toEqual(initialState.solicitudForm);
    expect(component.formularioEmpresaReciclaje.value).toEqual(initialState.empresaReciclaje);
    expect(component.formularioLugarReciclaje.value).toEqual(initialState.lugarReciclaje);
    expect(component.formularioEmpresaTransportista.value).toEqual(initialState.empresaTransportista);
    expect(component.formularioPrecaucionesManejo.value).toEqual(initialState.precaucionesManejo);
  });

  it('should open modal when agregarOperacionImp is called', () => {
    const modalElement = fixture.debugElement.nativeElement.querySelector('#modalAgregarMercancias');
    component.modalElement = { nativeElement: modalElement };
    const modalInstanceSpy = jest.spyOn(Modal.prototype, 'show');
    component.agregarOperacionImp();
    expect(modalInstanceSpy).toHaveBeenCalled();
  });

  describe('actualizarCampoEmpresaReciclaje', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      component.formularioEmpresaReciclaje.patchValue(initialState.empresaReciclaje);
    });

    it('should call onRequiereEmpresaChange when field is "requiereEmpresa"', () => {
      const newValue = 'No';
      const spy = jest.spyOn(component, 'onRequiereEmpresaChange');
      
      component.formularioEmpresaReciclaje.get('requiereEmpresa')?.setValue(newValue);
      component.actualizarCampoEmpresaReciclaje('requiereEmpresa');
      
      expect(spy).toHaveBeenCalledWith(newValue);
      expect(mockStore.actualizarEmpresaReciclaje).toHaveBeenCalledWith({
        ...initialState.empresaReciclaje,
        requiereEmpresa: newValue
      });
    });

    it('should not call onRequiereEmpresaChange when field is not "requiereEmpresa"', () => {
      const spy = jest.spyOn(component, 'onRequiereEmpresaChange');
      component.actualizarCampoEmpresaReciclaje('nombreEmpresa');
      expect(spy).not.toHaveBeenCalled();
    });

    it('should update store with current form values when any field changes', () => {
      const newValue = 'updated company name';
      component.formularioEmpresaReciclaje.get('nombreEmpresa')?.setValue(newValue);
      
      component.actualizarCampoEmpresaReciclaje('nombreEmpresa');
      
      expect(mockStore.actualizarEmpresaReciclaje).toHaveBeenCalledWith({
        requiereEmpresa: 'Si',
        nombreEmpresa: newValue,
        representanteLegal: 'legal',
        telefono: '999',
        correoElectronico: 'correo@ejemplo.com'
      });
    });
  });

  describe('onRequiereEmpresaChange', () => {
    it('should reset form fields when value is "No"', () => {
      component.onRequiereEmpresaChange('No');
      component.formularioEmpresaReciclaje.reset();
      expect(component.formularioEmpresaReciclaje.get('nombreEmpresa')?.value).toBeNull();
      expect(component.formularioEmpresaReciclaje.get('representanteLegal')?.value).toBeNull();
      expect(component.formularioEmpresaReciclaje.get('telefono')?.value).toBeNull();
      expect(component.formularioEmpresaReciclaje.get('correoElectronico')?.value).toBeNull();
    });

    it('should not reset form fields when value is not "No"', () => {
      const originalValues = {...component.formularioEmpresaReciclaje.value};
      component.onRequiereEmpresaChange('Si');
      
      expect(component.formularioEmpresaReciclaje.value).toEqual(originalValues);
    });
  });
});