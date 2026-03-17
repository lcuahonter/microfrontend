import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { DomicilloComponent } from './domicillo.component';
import { Tramite260906Store } from '../../../../estados/tramites/tramite260906.store';
import { Tramite260906Query } from '../../../../estados/queries/tramite260906.query';
import { SanitarioService } from '../../services/sanitario.service';
import { of, Subject } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { Solicitud260906State } from '../../../../estados/tramites/tramite260906.store';

describe('DomicilloComponent', () => {
  let component: DomicilloComponent;
  let fixture: ComponentFixture<DomicilloComponent>;
  let mockTramite260906Store: Partial<Tramite260906Store>;
  let mockTramite260906Query: Partial<Tramite260906Query>;
  let mockSanitarioService: Partial<SanitarioService>;

  const mockSelectSolicitud: Solicitud260906State = {
    codigoPostal: '12345',
    estado: 'Estado Test',
  } as Solicitud260906State;

  beforeEach(async () => {
    mockTramite260906Store = {
      setCodigoPostal: jest.fn(),
      setEstado: jest.fn(),
    };

    mockTramite260906Query = {
      selectSolicitud$: of(mockSelectSolicitud),
    };

    mockSanitarioService = {
      obtenerFormaFarmaceuticaList: jest.fn().mockReturnValue(of({ data: [] })),
      obtenerEstadoList: jest.fn().mockReturnValue(of({ data: [] })),
      obtenerTablaDatos: jest.fn().mockReturnValue(of({ datos: [] })),
      obtenerMercanciasDatos: jest.fn().mockReturnValue(of({ datos: [] })),
    };

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [ReactiveFormsModule, DomicilloComponent],
      providers: [ provideHttpClient(),
        { provide: Tramite260906Store, useValue: mockTramite260906Store },
        { provide: Tramite260906Query, useValue: mockTramite260906Query },
        { provide: SanitarioService, useValue: mockSanitarioService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DomicilloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the domicilio form group with default values', () => {
    expect(component.domicilio).toBeDefined();
    expect(component.domicilio.get('codigoPostal')?.value).toBe('12345');
    expect(component.domicilio.get('estado')?.value).toBe('Estado Test');
  });

  it('should call obtenerFormaFarmaceuticaList on initialization', () => {
    expect(mockSanitarioService.obtenerFormaFarmaceuticaList).toHaveBeenCalled();
  });

  it('should call obtenerEstadoList on initialization', () => {
    expect(mockSanitarioService.obtenerEstadoList).toHaveBeenCalled();
  });

  it('should call obtenerTablaDatos on initialization', () => {
    expect(mockSanitarioService.obtenerTablaDatos).toHaveBeenCalled();
  });

  it('should call obtenerMercanciasDatos on initialization', () => {
    expect(mockSanitarioService.obtenerMercanciasDatos).toHaveBeenCalled();
  });

  it('should disable the domicilio form when soloLectura is true', () => {
    component.soloLectura = true;
    component.inicializarEstadoFormulario();
    expect(component.domicilio.disabled).toBe(true);
  });

  it('should enable the domicilio form when soloLectura is false', () => {
    component.soloLectura = false;
    component.inicializarEstadoFormulario();
    expect(component.domicilio.enabled).toBe(true);
  });

  it('should call setCodigoPostal when setValoresStore is called for codigoPostal', () => {
    const form = component.domicilio;
    form.get('codigoPostal')?.setValue('54321');
    component.setValoresStore(form, 'codigoPostal', 'setCodigoPostal');
    expect(mockTramite260906Store.setCodigoPostal).toHaveBeenCalledWith('54321');
  });
});