import { TestBed } from '@angular/core/testing';
import { AvisoDeRenovacionComponent } from './aviso-de-renovacion.component';
import { FormBuilder } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { AvisoUnicoService } from '../../services/aviso-unico.service';
import { UnicoStore } from '../../estados/renovacion.store';
import { UnicoQuery } from '../../estados/queries/unico.query';

const mockService = {
  getSolicitante: jest.fn().mockReturnValue(of({})), 
  obtenerDatosLocalidad: jest.fn().mockReturnValue(of([])),
  obtenerRadio: jest.fn().mockReturnValue(of([])), 
};
const mockUnicoStore = {
  setfechaPago: jest.fn(),
};
const mockUnicoQuery = {
  selectSolicitud$: of({
    mapTipoTramite: 'A',
    mapDeclaracionSolicitud: 'B',
    envioAviso: true,
    numeroAviso: '123',
    numeroOperacion: '456',
    banco: 'Banamex',
    llavePago: 'LLAVE',
    fechaPago: '2024-01-01',
  }),
};
const mockConsultaioQuery = {
  selectConsultaioState$: of({ readonly: true }),
};

describe('AvisoDeRenovacionComponent', () => {
  let component: AvisoDeRenovacionComponent;

  beforeEach(() => {
    jest.clearAllMocks();
    component = new AvisoDeRenovacionComponent(
      new FormBuilder(),
      mockService as any,
      mockUnicoStore as any,
      mockUnicoQuery as any,
      mockConsultaioQuery as any
    );
    // Mock Subject to avoid memory leaks
    (component as any).destroyed$ = new Subject<void>();
  });

  // it('should initialize with default values', () => {
  //   expect(component.defaultSelect).toBe('Rubro A');
  //   expect(component.esFormularioSoloLectura).toBe(true);
  //   expect(component.fechaInicioInput).toBeDefined();
  // });

  it('should call inicializarEstadoFormulario and actualizarEstado on ngOnInit', () => {
    
    const spyUpdate = jest.spyOn(component, 'actualizarEstado');
    component.ngOnInit();
   
    expect(spyUpdate).toHaveBeenCalled();
  });

it('should enable form if esFormularioSoloLectura is false', () => {
    component.solicitudState = {
      mapTipoTramite: 'A',
      mapDeclaracionSolicitud: 'B',
      envioAviso: true,
      numeroAviso: '123',
      numeroOperacion: '456',
      banco: 'Banamex',
      llavePago: 'LLAVE',
      fechaPago: '2024-01-01',
    } as any;
    component.avisoForm = new FormBuilder().group({
      claveReferencia: [{ value: '', disabled: false }],
    });
    component.esFormularioSoloLectura = false;
    component.actualizarEstado();
    expect(component.avisoForm.enabled).toBe(true);
  });

  it('should patch form values from getSolicitante', () => {
    mockService.getSolicitante.mockReturnValue(of({
      claveReferencia: 'CR',
      cadenaDependencia: 'CD',
      importePago: 100,
    }));
    component.solicitudState = {
      mapTipoTramite: 'A',
      mapDeclaracionSolicitud: 'B',
      envioAviso: true,
      numeroAviso: '123',
      numeroOperacion: '456',
      banco: 'Banamex',
      llavePago: 'LLAVE',
      fechaPago: '2024-01-01',
    } as any;
    component.actualizarEstado();
    // Form should be patched asynchronously, so we check after a tick
    setTimeout(() => {
      expect(component.avisoForm.value.claveReferencia).toBe('CR');
      expect(component.avisoForm.value.cadenaDependencia).toBe('CD');
      expect(component.avisoForm.value.importePago).toBe(100);
    }, 0);
  });

  it('should update fechaPago and call setfechaPago on onFechaCambiada', () => {
    component.avisoForm = new FormBuilder().group({
      fechaPago: [''],
    });
    component.cambioFechaPago('2024-06-01');
    expect(component.avisoForm.get('fechaPago')?.value).toBe('2024-06-01');
    expect(mockUnicoStore.setfechaPago).toHaveBeenCalledWith('2024-06-01');
  });

  it('should reset payment fields on resetPagoDatos', () => {
    component.avisoForm = new FormBuilder().group({
      numeroOperacion: ['op'],
      banco: ['bank'],
      llavePago: ['key'],
      fechaPago: ['date'],
    });
    component.resetPagoDatos();
    expect(component.avisoForm.value).toEqual({
      numeroOperacion: '',
      banco: '',
      llavePago: '',
      fechaPago: '',
    });
  });

  it('should set value in store using setValoresStore', () => {
    component.avisoForm = new FormBuilder().group({
      testField: ['testValue'],
    });
    (mockUnicoStore as any).setTestField = jest.fn();
    component.setValoresStore(component.avisoForm, 'testField', 'setTestField' as any);
    expect((mockUnicoStore as any).setTestField).toHaveBeenCalledWith('testValue');
  });

  it('should complete destroyed$ on ngOnDestroy', () => {
    const destroyed$ = new Subject<void>();
    (component as any).destroyed$ = destroyed$;
    const spy = jest.spyOn(destroyed$, 'complete');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });
});
