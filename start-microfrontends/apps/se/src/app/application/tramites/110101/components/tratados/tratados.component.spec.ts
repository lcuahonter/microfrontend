/**
 * @jest-environment jsdom
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TratadosComponent } from './tratados.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { Tramite110101Store } from '../../estados/tramites/solicitante110101.store';
import { Solicitante110101Query } from '../../estados/queries/solicitante110101.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { PantallasSvcService } from '../../services/pantallas-svc.service';
import { MENSAJE_ALERTA_TRATADOS } from '@ng-mf/data-access-user';

// Mock the JSON import for tratadosTable with proper structure
jest.mock('@libs/shared/theme/assets/json/110101/tratados-table.json', () => ({
  __esModule: true,
  default: {
    tableHeader: ['Pais o bloque', 'Tratado o Acuerdo', 'Criterio de origen'],
    tableBody: [
      ['Mexico', 'T-MEC', 'Nacional']
    ]
  }
}));

// Suppress punycode deprecation warnings
const originalConsoleWarn = console.warn;
beforeAll(() => {
  console.warn = (message: string, ...args: any[]) => {
    if (typeof message === 'string' && message.includes('punycode')) {
      return;
    }
    originalConsoleWarn(message, ...args);
  };
});

afterAll(() => {
  console.warn = originalConsoleWarn;
});

describe('TratadosComponent', () => {
  let component: TratadosComponent;
  let fixture: ComponentFixture<TratadosComponent>;

  const mockStore = {
    setPais: jest.fn(),
    setTratado: jest.fn(),
    setOrigen: jest.fn(),
  } as unknown as Tramite110101Store;

  const mockPantallaSvc = {
    getCatalogoDatos: jest.fn(),
  };

  const solicitanteState = { pais: '1', tratado: '2', origen: '3' };
  const mockSolicitanteQuery = {
    selectSolicitante$: of(solicitanteState),
  } as unknown as Solicitante110101Query;

  const mockConsultaioQuery = {
    selectConsultaioState$: of({ readonly: false }),
  } as unknown as ConsultaioQuery;

  beforeEach(async () => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Set up default mock responses
    (mockPantallaSvc.getCatalogoDatos as jest.Mock).mockReturnValue(of({
      pais: [{ id: 1, descripcion: 'MX' }],
      tratado: [{ id: 2, descripcion: 'TMEC' }],
      origen: [{ id: 3, descripcion: 'Nacional' }]
    }));

    await TestBed.configureTestingModule({
      imports: [TratadosComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: Tramite110101Store, useValue: mockStore },
        { provide: PantallasSvcService, useValue: mockPantallaSvc },
        { provide: Solicitante110101Query, useValue: mockSolicitanteQuery },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TratadosComponent);
    component = fixture.componentInstance;
    
    // Initialize component state properly
    component.solicitudeState = solicitanteState as any;
    component.inicializarFormulario();
    
    // Ensure catalogs are loaded
    component.getCatalogoList();
    
    fixture.detectChanges();
  });

  it('should create and initialize', () => {
    expect(component).toBeTruthy();
    
    // Wait for component to be properly initialized
    fixture.detectChanges();
    
    expect(component.encabezadosComunesTabla).toBeDefined();
    expect(component.encabezadosComunesTabla).toEqual(['Pais o bloque', 'Tratado o Acuerdo', 'Criterio de origen']);
    expect(component.formularioTratados).toBeDefined();
    expect(component.registroDeSolicitudesTablaDatos).toBeDefined();
    expect(component.selectedRows).toEqual([]);
    expect(component.isEditMode).toBe(false);
  });

  it('should setup form with initial solicitante values', () => {
    // Wait for component initialization
    fixture.detectChanges();
    
    // Form should already be initialized in beforeEach
    const f = component.formularioTratados;
    expect(f).toBeDefined();
    expect(f.get('pais')?.value).toBe('1');
    expect(f.get('tratado')?.value).toBe('2');
    expect(f.get('origen')?.value).toBe('3');
  });

  it('should load catalogs correctly', () => {
    const fake = {
      pais: [{ id: 1, descripcion: 'MX' }],
      tratado: [{ id: 2, descripcion: 'TMEC' }],
      origen: [{ id: 3, descripcion: 'Nacional' }]
    };
    
    // Reset catalogs
    component.paisCatalogo = [];
    component.tratadoCatalogo = [];
    component.origenCatalogo = [];
    
    // Mock the service call
    (mockPantallaSvc.getCatalogoDatos as jest.Mock).mockReturnValue(of(fake));
    
    // Call the method
    component.getCatalogoList();
    
    // Wait for async operations
    fixture.detectChanges();
    
    expect(component.paisCatalogo).toEqual(fake.pais);
    expect(component.tratadoCatalogo).toEqual(fake.tratado);
    expect(component.origenCatalogo).toEqual(fake.origen);
  });

  it('should add a tratado row and emit event', () => {
    // Setup catalogs
    component.paisCatalogo = [{ id: 1, descripcion: 'MX' }];
    component.tratadoCatalogo = [{ id: 2, descripcion: 'TMEC' }];
    component.origenCatalogo = [{ id: 3, descripcion: 'Nacional' }];

    // Form should already be initialized, just set values
    component.formularioTratados.patchValue({ pais: '1', tratado: '2', origen: '3' });
    
    const spy = jest.spyOn(component.habilitarPestana, 'emit');
    const before = component.registroDeSolicitudesTablaDatos.length;

    component.agregarTratado();

    expect(component.registroDeSolicitudesTablaDatos.length).toBe(before + 1);
    expect(spy).toHaveBeenCalled();
  });

  it('should handle edit flow correctly', () => {
    // Prepare initial catalogs
    component.paisCatalogo = [{ id: 1, descripcion: 'MX' }];
    component.tratadoCatalogo = [{ id: 2, descripcion: 'TMEC' }];
    component.origenCatalogo = [{ id: 3, descripcion: 'Nacional' }];

    // Ensure we have data in the table (use default data or add one)
    if (component.registroDeSolicitudesTablaDatos.length === 0) {
      component.registroDeSolicitudesTablaDatos.push({
        pais: 'MX',
        tratado: 'TMEC', 
        origen: 'Nacional'
      });
    }

    component.selectedRowIndex = 0;
    component.selectedRows = [component.registroDeSolicitudesTablaDatos[0]];
    
    component.modificarTratado();
    expect(component.isEditMode).toBe(true);

    // Set form values for edit (form already initialized)
    component.formularioTratados.patchValue({ pais: '1', tratado: '2', origen: '3' });
    component.agregarTratado();
    
    expect(component.isEditMode).toBe(false);
    expect(component.selectedRows.length).toBe(0);
  });

  it('should open modal when modify without selection', () => {
    const spy = jest.spyOn(component, 'abrirModal');
    component.selectedRows = [];
    component.selectedRowIndex = null;
    component.modificarTratado();
    expect(spy).toHaveBeenCalled();
  });

  it('should delete selected row', () => {
    // Ensure we have data to delete
    if (component.registroDeSolicitudesTablaDatos.length === 0) {
      component.registroDeSolicitudesTablaDatos.push({
        pais: 'MX',
        tratado: 'TMEC',
        origen: 'Nacional'
      });
    }
    
    component.selectedRows = [component.registroDeSolicitudesTablaDatos[0]];
    const before = component.registroDeSolicitudesTablaDatos.length;
    component.eliminarTratado();
    expect(component.registroDeSolicitudesTablaDatos.length).toBe(before - 1);
  });

  it('should open modal when delete with no selection', () => {
    const spy = jest.spyOn(component, 'abrirModal');
    component.selectedRows = [];
    component.eliminarTratado();
    expect(spy).toHaveBeenCalled();
  });

  it('should get label to tableData correctly', () => {
    // Form should already be initialized, just set values
    component.formularioTratados.patchValue({ pais: '1', tratado: '2', origen: '3' });
    component.paisCatalogo = [{ id: 1, descripcion: 'MX' }];
    
    component.getLabelFromCatalogData(component.paisCatalogo, 'pais');
    expect(component.talbleData.pais).toBe('MX');
  });

  it('should disable form when readonly', () => {
    // Form should already be initialized
    component.esFormularioSoloLectura = true;
    component.guardarDatosFormulario();
    expect(component.formularioTratados.disabled).toBe(true);
  });

  it('should select and deselect rows', () => {
    // Ensure we have data to select
    if (component.registroDeSolicitudesTablaDatos.length === 0) {
      component.registroDeSolicitudesTablaDatos.push({
        pais: 'Mexico',
        tratado: 'T-MEC',
        origen: 'Nacional'
      });
    }
    
    const row = component.registroDeSolicitudesTablaDatos[0];
    component.onSeleccionChange([row]);
    expect(component.selectedRowIndex).toBe(0);
    expect(component.selectedRows.length).toBe(1);
    
    // Test multiple selection (should clear selection)
    component.onSeleccionChange([row, { pais: 'x', tratado: '', origen: '' } as any]);
    expect(component.selectedRows.length).toBe(0);
    expect(component.selectedRowIndex).toBeNull();
  });

  it('should remove pedimento', () => {
    component.pedimentos = [{ pedimento: 'a' } as any];
    component.elementoParaEliminar = 0;
    component.eliminarPedimento(true);
    expect(component.pedimentos.length).toBe(0);
  });

  it('should clean up subscriptions on destroy', () => {
    const destroySpy = jest.spyOn((component as any).destroy$, 'next');
    const completeSpy = jest.spyOn((component as any).destroy$, 'complete');
    
    component.ngOnDestroy();
    
    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

});
