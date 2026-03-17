import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FechaDeImportacionComponent } from './fecha-de-importacion.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Tramite630104Query } from '../../estados/queries/tramite630104.query';
import { Tramite630104Store } from '../../estados/tramites/tramite630104.store';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

describe('FechaDeImportacionComponent', () => {
  let component: FechaDeImportacionComponent;
  let fixture: ComponentFixture<FechaDeImportacionComponent>;

  const mockStore = {
    setTramite630104State: jest.fn(),
    getValue: jest.fn(() => ({
      fechaLimiteRetorno: '2025-12-31',
      fechaIngreso: '2025-06-15',
    })),
  };

  const mockQuery = {
    selectTramite630104State$: of({
      fechaLimiteRetorno: '2025-12-31',
      fechaIngreso: '2025-06-15',
    }),
    selectSeccionState$: of({
      fechaLimiteRetorno: '2025-12-31',
      fechaIngreso: '2025-06-15',
    }),
  };

  const mockConsultaioQuery = {
    selectConsultaioState$: of({ readonly: false }),
  };

  const mockService = {
    setForm: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FechaDeImportacionComponent, 
        ReactiveFormsModule,
        HttpClientTestingModule,
      ],
      providers: [
        FormBuilder,
        { provide: Tramite630104Query, useValue: mockQuery },
        { provide: Tramite630104Store, useValue: mockStore },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
        { provide: 'EquipoEInstrumentosMusicalesService', useValue: mockService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FechaDeImportacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    jest.clearAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should unsubscribe on destroy', () => {
    const spyNext = jest.spyOn(component['destroyed$'], 'next');
    const spyComplete = jest.spyOn(component['destroyed$'], 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });

  it('should set fechaIngreso and fechaLimiteRetorno in store on init if not present', () => {
    mockStore.getValue.mockReturnValueOnce({
      fechaLimiteRetorno: '',
      fechaIngreso: ''
    });
    const setSpy = jest.spyOn(mockStore, 'setTramite630104State');
    component.inicializarFormularioFechaImportacion();
    expect(setSpy).toHaveBeenCalledWith('fechaIngreso', expect.any(String));
    expect(setSpy).toHaveBeenCalledWith('fechaLimiteRetorno', expect.any(String));
  });

  it('should format fechaIngreso and update fechaLimiteRetorno when establecerCambioDeValor is called', () => {
    const setSpy = jest.spyOn(mockStore, 'setTramite630104State');
    component.establecerCambioDeValor({ campo: 'fechaIngreso', valor: '2025-06-15' });
    expect(setSpy).toHaveBeenCalledWith('fechaLimiteRetorno', '15/07/2025');
    expect(setSpy).toHaveBeenCalledWith('fechaIngreso', '15/06/2025');
  });

  it('should call setForm on service when establecerCambioDeValor is called', () => {
    const serviceSpy = jest.spyOn(component['service'], 'setForm');
    component.establecerCambioDeValor({ campo: 'fechaIngreso', valor: '2025-06-15' });
    expect(serviceSpy).toHaveBeenCalled();
  });

  it('should not throw if establecerCambioDeValor is called with null event', () => {
    expect(() => component.establecerCambioDeValor(null as any)).not.toThrow();
  });

  it('should update store with value for non-fechaIngreso fields', () => {
    const setSpy = jest.spyOn(mockStore, 'setTramite630104State');
    component.establecerCambioDeValor({ campo: 'otroCampo', valor: 'valor' });
    expect(setSpy).toHaveBeenCalledWith('otroCampo', 'valor');
  });
});