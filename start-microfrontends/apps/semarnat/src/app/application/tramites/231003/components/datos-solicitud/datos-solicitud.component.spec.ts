import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosSolicitudComponent } from './datos-solicitud.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DatoSolicitudStore } from '../../estados/tramites/dato-solicitud.store';
import { DatoSolicitudQuery } from '../../estados/queries/dato-solicitud.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { CUSTOM_ELEMENTS_SCHEMA, ElementRef } from '@angular/core';
import { of, Subject } from 'rxjs';

jest.mock('bootstrap', () => ({
  Modal: jest.fn().mockImplementation(() => ({
    show: jest.fn(),
  })),
}));

jest.mock('@libs/shared/theme/assets/json/231003/solicitud.json', () => ({
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
  let mockConsultaioQuery: jest.Mocked<ConsultaioQuery>;
  let destroy$: Subject<void>;

  const initialState = {
    solicitudForm: {
      numeroRegistroAmbiental: '123',
      descripcionGenerica1: 'desc',
      numeroProgramaImmex: 'immex',
    },
    empresaReciclaje: {
      requiereEmpresa: 'Si',
      nombreEmpresa: 'empresa',
      representanteLegal: 'legal',
      telefono: '999',
      correoElectronico: 'correo@ejemplo.com',
    },
    lugarReciclaje: {
      reciclajeInstalaciones: 'No',
      lugarReciclaje: 'ubicación',
      numeroAutorizacionEmpresaReciclaje: 'aut123',
    },
    empresaTransportista: {
      nombreEmpresaTransportistaResiduos: 'trans',
      numeroAutorizacionSemarnat: 'sem123',
    },
    precaucionesManejo: {
      precaucionesManejo: 'manejo',
    },
  };

  const READONLY_STATE_TRUE = {
    readonly: true,
    create: true,
    update: false,
    procedureId: '',
    parameter: '',
    department: '',
    folioTramite: '',
    tipoDeTramite: '',
    estadoDeTramite: '',
    consultaioSolicitante: null,
  };

  const READONLY_STATE_FALSE = {
    ...READONLY_STATE_TRUE,
    readonly: false,
    create: true,
  };

  beforeEach(async () => {
    destroy$ = new Subject<void>();

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

    mockConsultaioQuery = {
      selectConsultaioState$: jest.fn().mockReturnValue(of(READONLY_STATE_FALSE)),
    } as unknown as jest.Mocked<ConsultaioQuery>;

    await TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule, DatosSolicitudComponent],
      providers: [
        FormBuilder,
        { provide: DatoSolicitudStore, useValue: mockStore },
        { provide: DatoSolicitudQuery, useValue: mockQuery },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosSolicitudComponent);
    component = fixture.componentInstance;

    component.modalElement = {
      nativeElement: document.createElement('div'),
    } as ElementRef;

    component['destroy$'] = destroy$;

    fixture.detectChanges();
  });

  afterEach(() => {
    destroy$.next();
    destroy$.complete();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar los formularios con los valores del store', () => {
    expect(component.solicitudForm.value).toEqual(initialState.solicitudForm);
    expect(component.formularioEmpresaReciclaje.value).toEqual(initialState.empresaReciclaje);
    expect(component.formularioLugarReciclaje.value).toEqual(initialState.lugarReciclaje);
    expect(component.formularioEmpresaTransportista.value).toEqual(initialState.empresaTransportista);
    expect(component.formularioPrecaucionesManejo.value).toEqual(initialState.precaucionesManejo);
  });

  it('debería deshabilitar campos si se selecciona "No" en reciclajeInstalaciones', () => {
    component.formularioLugarReciclaje.get('reciclajeInstalaciones')?.setValue('No');
    component.actualizarCampoLugarReciclaje('reciclajeInstalaciones');

    expect(component.formularioLugarReciclaje.get('lugarReciclaje')?.disabled).toBe(true);
    expect(component.formularioLugarReciclaje.get('numeroAutorizacionEmpresaReciclaje')?.disabled).toBe(true);
  });

  it('debería abrir el modal correctamente al llamar agregarOperacionImp', () => {
    const { Modal } = jest.requireMock('bootstrap');
    const mockShow = jest.fn();

    (Modal as jest.Mock).mockImplementation(() => ({ show: mockShow }));

    component.modalElement = {
      nativeElement: document.createElement('div'),
    } as ElementRef;

    component.agregarOperacionImp();

    expect(Modal).toHaveBeenCalledWith(component.modalElement.nativeElement);
    expect(mockShow).toHaveBeenCalled();
  });

  describe('actualizarCampo...()', () => {
    const NUEVO_VALOR = 'nuevo valor';

    beforeEach(() => {
      component.solicitudForm.get('numeroRegistroAmbiental')?.setValue(NUEVO_VALOR);
      component.formularioEmpresaReciclaje.get('nombreEmpresa')?.setValue(NUEVO_VALOR);
      component.formularioLugarReciclaje.get('lugarReciclaje')?.setValue(NUEVO_VALOR);
      component.formularioEmpresaTransportista.get('nombreEmpresaTransportistaResiduos')?.setValue(NUEVO_VALOR);
      component.formularioPrecaucionesManejo.get('precaucionesManejo')?.setValue(NUEVO_VALOR);
    });

    it('debería actualizar el campo del formulario de solicitud en el store', () => {
      component.actualizarCampoSolicitudForm('numeroRegistroAmbiental');
      expect(mockStore.actualizarSolicitudForm).toHaveBeenCalledWith(
        expect.objectContaining({ numeroRegistroAmbiental: NUEVO_VALOR })
      );
    });

    it('debería actualizar el campo del formulario de empresa reciclaje en el store', () => {
      component.actualizarCampoEmpresaReciclaje('nombreEmpresa');
      expect(mockStore.actualizarEmpresaReciclaje).toHaveBeenCalledWith(
        expect.objectContaining({ nombreEmpresa: NUEVO_VALOR })
      );
    });

    it('debería actualizar el campo del formulario de lugar de reciclaje en el store', () => {
      component.actualizarCampoLugarReciclaje('lugarReciclaje');
      expect(mockStore.actualizarLugarReciclaje).toHaveBeenCalledWith(
        expect.objectContaining({ lugarReciclaje: NUEVO_VALOR })
      );
    });

    it('debería actualizar el campo del formulario de empresa transportista en el store', () => {
      component.actualizarCampoEmpresaTransportista('nombreEmpresaTransportistaResiduos');
      expect(mockStore.actualizarEmpresaTransportista).toHaveBeenCalledWith(
        expect.objectContaining({ nombreEmpresaTransportistaResiduos: NUEVO_VALOR })
      );
    });

    it('debería actualizar el campo del formulario de precauciones de manejo en el store', () => {
      component.actualizarCampoPrecaucionesManejo('precaucionesManejo');
      expect(mockStore.actualizarPrecaucionesManejo).toHaveBeenCalledWith(
        expect.objectContaining({ precaucionesManejo: NUEVO_VALOR })
      );
    });
  });

  describe('deshabilitarFormularios()', () => {
    it('debería deshabilitar todos los formularios si readonly es true', () => {
      component.consultaState = READONLY_STATE_TRUE;

      component.deshabilitarFormularios();

      expect(component.solicitudForm.disabled).toBe(true);
      expect(component.formularioEmpresaReciclaje.disabled).toBe(true);
      expect(component.formularioLugarReciclaje.disabled).toBe(true);
      expect(component.formularioEmpresaTransportista.disabled).toBe(true);
      expect(component.formularioPrecaucionesManejo.disabled).toBe(true);
    });

    it('debería habilitar todos los formularios si readonly es false', () => {
      component.consultaState = READONLY_STATE_FALSE;

      component.deshabilitarFormularios();

      expect(component.solicitudForm.enabled).toBe(true);
      expect(component.formularioEmpresaReciclaje.enabled).toBe(true);
      expect(component.formularioLugarReciclaje.enabled).toBe(true);
      expect(component.formularioEmpresaTransportista.enabled).toBe(true);
      expect(component.formularioPrecaucionesManejo.enabled).toBe(true);
    });
  });
});
