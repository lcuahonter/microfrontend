jest.mock('@libs/shared/theme/assets/json/110101/mercancia.json', () => ({
  __esModule: true,
  default: {
    fraccionArancelaria: '99998888',
    descripcion: 'Descripción Mock',
    valorTransaccion: '2000'
  }
}));

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosMercanciaComponent } from './datos-mercancia.component';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { ValidacionesFormularioService } from '@ng-mf/data-access-user';
import { Tramite110101Store } from '../../estados/tramites/solicitante110101.store';
import { Solicitante110101Query } from '../../estados/queries/solicitante110101.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import mercanciaMock from '@libs/shared/theme/assets/json/110101/mercancia.json';
import { Solicitante110101State } from '../../estados/tramites/solicitante110101.store';
import { Modal } from 'bootstrap';
import { ElementRef } from '@angular/core';
import { InsumosTabla } from '../../models/panallas110101.model';


describe('DatosMercanciaComponent', () => {
  let component: DatosMercanciaComponent;
  let fixture: ComponentFixture<DatosMercanciaComponent>;
  let mockConsultaioQuery: Partial<ConsultaioQuery>;
  let mockSolicitanteQuery: Partial<Solicitante110101Query>;

  const destroy$ = new Subject<void>();

  const SOLICITANTE_STATE: Solicitante110101State = {
    rfc: 'RFC123',
    denominacion: 'Empresa SA',
    actividadEconomica: 'Exportación',
    correoElectronico: 'correo@test.com',
    pais: 'México',
    tratado: 'TLC',
    origen: 'México',
    nombreComercial: 'Mock Producto',
    nombreIngles: 'Mock Product',
    fraccionArancelaria: '12345678',
    descripcion: 'Descripción del producto',
    valorTransaccion: '1000',
    entidad: 'CDMX',
    representacion: 'Representante',
    metodoSeparacion: false,
    exportadorAutorizado: false,
    informacionRadios: ''
  };

let mockTramiteStore: Partial<Tramite110101Store>;

beforeEach(async () => {
  mockTramiteStore = {
    setNombreComercial: jest.fn(),
    setNombreIngles: jest.fn(),
    setFraccionArancelaria: jest.fn(),
    setDescripcion: jest.fn(),
    setValorTransaccion: jest.fn()
  };

  await TestBed.configureTestingModule({
    imports: [
      ReactiveFormsModule,
      DatosMercanciaComponent // because it's standalone
    ],
    providers: [
      { provide: Tramite110101Store, useValue: mockTramiteStore },
      {
        provide: ValidacionesFormularioService,
        useValue: { isValid: jest.fn().mockReturnValue(true) }
      },
      {
        provide: Solicitante110101Query,
        useValue: {
          selectSolicitante$: of({
            // minimal mock state
            nombreComercial: 'Mock Producto',
            nombreIngles: 'Mock Product',
            fraccionArancelaria: '12345678',
            descripcion: 'Descripción',
            valorTransaccion: '1000'
          })
        }
      },
      {
        provide: ConsultaioQuery,
        useValue: {
          selectConsultaioState$: of({ readonly: false })
        }
      }
    ]
  }).compileComponents();

  fixture = TestBed.createComponent(DatosMercanciaComponent);
  component = fixture.componentInstance;
  
  // Reset component arrays to ensure clean state for each test
  component.insumosTablaDatos = [];
  component['listaSeleccionadasInsumos'] = [];
  component['listaSeleccionadasEnvases'] = [];
  
  fixture.detectChanges();
});


it('debe crear el componente', () => {
  expect(component).toBeTruthy();
});

it('debe inicializar el formulario con los valores del estado', () => {
  const form = component.formMercancia;
  expect(form).toBeDefined();
  expect(form.get('nombreComercial')?.value).toBe(SOLICITANTE_STATE.nombreComercial);
  expect(form.get('nombreIngles')?.value).toBe(SOLICITANTE_STATE.nombreIngles);
  expect(form.get('fraccionArancelaria')?.value).toBe(mercanciaMock.fraccionArancelaria);
  expect(form.get('descripcion')?.value).toBe(mercanciaMock.descripcion);
  expect(form.get('valorTransaccion')?.value).toBe(mercanciaMock.valorTransaccion);
});

it('debe deshabilitar el formulario cuando esFormularioSoloLectura es true', () => {
  component.esFormularioSoloLectura = true;
  component.guardarDatosFormulario();
  expect(component.formMercancia.disabled).toBe(true);
});

it('debe habilitar el formulario cuando esFormularioSoloLectura es false', () => {
  component.esFormularioSoloLectura = false;
  component.guardarDatosFormulario();
  expect(component.formMercancia.enabled).toBe(true);
});

it('debe llamar al método del store cuando se llama setValoresStore', () => {
  const dummyForm = component.formMercancia;
  dummyForm.get('nombreComercial')?.setValue('Nuevo Nombre');
  component.setValoresStore(dummyForm, 'nombreComercial', 'setNombreComercial');
  expect(mockTramiteStore.setNombreComercial).toHaveBeenCalledWith('Nuevo Nombre');
});

it('debe llamar destroy$ en ngOnDestroy', () => {
  const spy = jest.spyOn(component['destroy$'], 'next');
  const spyComplete = jest.spyOn(component['destroy$'], 'complete');

  component.ngOnDestroy();

  expect(spy).toHaveBeenCalled();
  expect(spyComplete).toHaveBeenCalled();
});

it('debe validar el control del formulario con el método isValid', () => {
  const result = component.isValid('nombreComercial');
  expect(result).toBe(true);
});

it('should add a new insumo when no item is selected and form is valid', () => {
  // Ensure clean state
  component.insumosTablaDatos = [];
  component['listaSeleccionadasInsumos'] = [];
  
  component.modal = 'Insumo';
  const form = new FormGroup({
    nombreTecnico: new FormControl('Producto 1', Validators.required),
    proveedor: new FormControl('Proveedor X', Validators.required),
    fabricanteProductor: new FormControl('Fabricante Y', Validators.required),
    fraccionArancelaria: new FormControl('99998888', Validators.required),
    valorDolares: new FormControl('500')
  });
  component.forma.setControl('ninoFormGroup', form);
  component.formMercancia = new FormGroup({
    valorTransaccion: new FormControl('1500')
  });
  
  const initialLength = component.insumosTablaDatos.length;
  component.agregar();
  
  expect(component.insumosTablaDatos.length).toBe(initialLength + 1);
  expect(component.insumosTablaDatos[component.insumosTablaDatos.length - 1].nombreTecnico).toBe('Producto 1');
});


it('should add a new insumo even when similar items exist in the table', () => {
  // Ensure clean state and setup specific test data
  component.modal = 'Insumo';
  const existingInsumo = {
    nombreTecnico: 'Prod X',
    proveedor: 'Old Prov',
    fabricanteOProductor: 'Old Fab',
    fraccionArancelaria: '11110000',
    rfc: 'RFC1',
    valorDeTransaccion: 1000
  };
  
  // Set clean arrays with only test data
  component.insumosTablaDatos = [existingInsumo];
  component['listaSeleccionadasInsumos'] = [existingInsumo];
  
  const form = new FormGroup({
    nombreTecnico: new FormControl('Prod X', Validators.required),
    proveedor: new FormControl('Nuevo Prov', Validators.required),
    fabricanteProductor: new FormControl('Nuevo Fab', Validators.required),
    fraccionArancelaria: new FormControl('22220000', Validators.required),
    valorDolares: new FormControl('3000')
  });
  component.forma.setControl('ninoFormGroup', form);
  component.formMercancia = new FormGroup({
    valorTransaccion: new FormControl('3000')
  });
  
  component.agregar();
  
  expect(component.insumosTablaDatos.length).toBe(2); // Should be 2 since agregar() adds new items
  expect(component.insumosTablaDatos[1].proveedor).toBe('Nuevo Prov');
  expect(component.insumosTablaDatos[1].valorDeTransaccion).toBe('3000');
});


it('should patch form with selected insumo data when modifying', () => {
  component.modal = 'Insumo';
  const selected = {
    nombreTecnico: 'Producto Test',
    proveedor: 'Proveedor Test',
    fabricanteOProductor: 'Fab Test',
    fraccionArancelaria: '12121212',
    rfc: '',
    valorDeTransaccion: 1200
  };
  component['listaSeleccionadasInsumos'] = [selected];
  component.modificar('Insumo');
  expect(component.ninoFormGroup.get('nombreTecnico')?.value).toBe('Producto Test');
});

it('should show confirm modal when modifying insumo with no selection', () => {
  component.modal = 'Insumo';
  component['listaSeleccionadasInsumos'] = [];
  const mockElement = document.createElement('div');
  document.body.appendChild(mockElement);
  component.modalConfirmacion = { nativeElement: mockElement } as ElementRef;
  const modalShowSpy = jest.spyOn(Modal.prototype, 'show').mockImplementation(() => {});
  component.modificar('Insumo');
  expect(modalShowSpy).toHaveBeenCalled();
  document.body.removeChild(mockElement);
  modalShowSpy.mockRestore();
});


it('should remove selected insumo from the list', () => {
  const item = {
    nombreTecnico: 'Eliminar Esto',
    proveedor: '',
    fabricanteOProductor: '',
    fraccionArancelaria: '',
    rfc: '',
    valorDeTransaccion: 0
  };
  
  // Ensure clean state with only test data
  component.insumosTablaDatos = [item];
  component['listaSeleccionadasInsumos'] = [item];
  
  component.eliminar('Insumo');
  expect(component.insumosTablaDatos.length).toBe(0);
});

it('should hide the modal when cerrarDialogo is called', () => {
  const hideSpy = jest.fn();
  component['modalInstance'] = { hide: hideSpy } as unknown as Modal;
  component.cerrarDialogo();
  expect(hideSpy).toHaveBeenCalled();
});

it('should show the modal when abrirDialogo is called', () => {
  const mockElement = document.createElement('div');
  document.body.appendChild(mockElement);
  component.modalElement = { nativeElement: mockElement } as ElementRef;
  const modalShowSpy = jest.spyOn(Modal.prototype, 'show').mockImplementation(() => {});
  component.abrirDialogo('Insumo');
  expect(component.modal).toBe('Insumo');
  expect(modalShowSpy).toHaveBeenCalled();
  document.body.removeChild(mockElement);
  modalShowSpy.mockRestore();
});

it('should disable formMercancia in readonly mode', () => {
  component['esFormularioSoloLectura'] = true;
  component.solicitudeState = {
    rfc: '',
    denominacion: '',
    actividadEconomica: '',
    correoElectronico: '',
    pais: '',
    tratado: '',
    origen: '',
    nombreComercial: '',
    nombreIngles: '',
    fraccionArancelaria: '',
    descripcion: '',
    valorTransaccion: '',
    entidad: '',
    representacion: '',
    metodoSeparacion: false,
    exportadorAutorizado: false,
    informacionRadios: ''
  };
  component.createFormMercancia();
  expect(component.formMercancia.disabled).toBe(true);
});

it('should enable formMercancia in editable mode', () => {
  component['esFormularioSoloLectura'] = false;
  component.solicitudeState = {
    rfc: '',
    denominacion: '',
    actividadEconomica: '',
    correoElectronico: '',
    pais: '',
    tratado: '',
    origen: '',
    nombreComercial: '',
    nombreIngles: '',
    fraccionArancelaria: '',
    descripcion: '',
    valorTransaccion: '',
    entidad: '',
    representacion: '',
    metodoSeparacion: false,
    exportadorAutorizado: false,
    informacionRadios: ''
  };
  component.createFormMercancia();
  expect(component.formMercancia.enabled).toBe(true);
});

it('should return false if control is invalid and touched', () => {
  const control = new FormControl('', [Validators.required]);
  control.markAsTouched();
  const group = new FormGroup({ testField: control });
  const result = component.esInvalido(group, 'testField');
  expect(result).toBe(true);
});

it('should delete selected insumo from list', () => {
  // Ensure clean state with only test data
  component.insumosTablaDatos = [{ nombreTecnico: 'X' } as InsumosTabla];
  component['listaSeleccionadasInsumos'] = [{ nombreTecnico: 'X' } as InsumosTabla];
  
  component.eliminar('Insumo');
  expect(component.insumosTablaDatos.length).toBe(0);
});

it('should patch values and open modal for modifying selected insumo', () => {
  component['modalElement'] = { nativeElement: document.createElement('div') } as ElementRef;
  component['listaSeleccionadasInsumos'] = [{
    nombreTecnico: 'Item1', proveedor: 'Prov', fabricanteOProductor: 'Fab', fraccionArancelaria: '111', rfc: '', valorDeTransaccion: 100
  }];
  component.ninoFormGroup.setControl('nombreTecnico', new FormControl(''));
  component.ninoFormGroup.setControl('fraccionArancelaria', new FormControl(''));
  component.ninoFormGroup.setControl('proveedor', new FormControl(''));
  component.ninoFormGroup.setControl('fabricanteProductor', new FormControl(''));
  component.ninoFormGroup.setControl('valorDolares', new FormControl(''));
  const modalSpy = jest.spyOn(Modal.prototype, 'show').mockImplementation(() => {});
  component.modificar('Insumo');
  expect(component.ninoFormGroup.get('nombreTecnico')?.value).toBe('Item1');
  expect(modalSpy).toHaveBeenCalled();
});

it('should not call cerrarDialogo if form is invalid', () => {
  const closeSpy = jest.spyOn(component, 'cerrarDialogo');
  component.ninoFormGroup.setControl('nombreTecnico', new FormControl('', Validators.required));
  component.agregar();
  expect(closeSpy).not.toHaveBeenCalled();
});

it('should call corresponding store method with form value', () => {
  const mockStore = {
    setNombreComercial: jest.fn()
  };
  const fb = new FormBuilder();
  const form = fb.group({ nombreComercial: ['Test'] });
  (component as any)['tramite110101Store'] = mockStore;
  component.setValoresStore(form, 'nombreComercial', 'setNombreComercial');
  expect(mockStore.setNombreComercial).toHaveBeenCalledWith('Test');
});

it('should update form with mock JSON values from getFormDatosDeMercancia', () => {
    component.getFormDatosDeMercancia();
    expect(component.formMercancia.get('fraccionArancelaria')?.value).toBe(component.apiDatosDeRespuesta.fraccionArancelaria);
  });

  it('should return true if campo is invalid and touched', () => {
    const campo = 'nombreComercial';
    component.formMercancia.get(campo)?.markAsTouched();
    component.formMercancia.get(campo)?.setValue('');
    expect(component.esInvalido(component.formMercancia, campo)).toBe(true);
  });

  it('should add insumo when agregar is called and valid', () => {
    component.modal = 'Insumo';
    const fb = new FormBuilder();
    component.ninoFormGroup.setControl('nombreTecnico', fb.control('A'));
    component.ninoFormGroup.setControl('proveedor', fb.control('B'));
    component.ninoFormGroup.setControl('fabricanteProductor', fb.control('C'));
    component.ninoFormGroup.setControl('fraccionArancelaria', fb.control('12345678'));
    jest.spyOn(component.ninoFormGroup, 'valid', 'get').mockReturnValue(true);
    component.formMercancia.get('valorTransaccion')?.setValue('500');
    component.agregar();
    expect(component.insumosTablaDatos.length).toBeGreaterThan(0);
  });

  it('should reset the forma form group when limpiarDialogo is called', () => {
  const resetSpy = jest.spyOn(component.forma, 'reset');
  component.limpiarDialogo();
  expect(resetSpy).toHaveBeenCalled();
});

it('should show the archivo modal when cargaArchivo is called', () => {
  const mockElement = document.createElement('div');
  document.body.appendChild(mockElement);
  component.modalArchivo = { nativeElement: mockElement } as ElementRef;
  const modalShowSpy = jest.spyOn(Modal.prototype, 'show').mockImplementation(() => {});
  component.cargaArchivo();
  expect(modalShowSpy).toHaveBeenCalled();
  document.body.removeChild(mockElement);
  modalShowSpy.mockRestore();
});

it('should update listaSeleccionadasInsumos when listaDeFilaSeleccionadaInsumos is called', () => {
  const mockInsumos = [
    { nombreTecnico: 'Insumo A', proveedor: '', fabricanteOProductor: '', fraccionArancelaria: '', rfc: '', valorDeTransaccion: 0 }
  ];
  component.listaDeFilaSeleccionadaInsumos(mockInsumos);
  expect(component['listaSeleccionadasInsumos']).toEqual(mockInsumos);
});

it('should update listaSeleccionadasEnvases when listaDeFilaSeleccionadaEnvases is called', () => {
  const mockEnvases = [
    { nombreTecnico: 'Envase A', proveedor: '', fabricanteOProductor: '', fraccionArancelaria: '', paisDeOrigen: '', valorEnDolares: 100 }
  ];
  component.listaDeFilaSeleccionadaEnvases(mockEnvases);
  expect(component['listaSeleccionadasEnvases']).toEqual(mockEnvases);
});


});
