import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { DatosEstablecimientoComponent } from './datos-establecimiento.component';
import { Tramite260906Store } from '../../../../estados/tramites/tramite260906.store';
import { Tramite260906Query } from '../../../../estados/queries/tramite260906.query';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { of } from 'rxjs';
import { Solicitud260906State } from '../../../../estados/tramites/tramite260906.store';
import { provideHttpClient } from '@angular/common/http';

describe('DatosEstablecimientoComponent', () => {
  let component: DatosEstablecimientoComponent;
  let fixture: ComponentFixture<DatosEstablecimientoComponent>;
  let tramite260906StoreMock: Partial<Tramite260906Store>;
  let tramite260906QueryMock: Partial<Tramite260906Query>;
  let consultaioQueryMock: Partial<ConsultaioQuery>;

  const mockConsultaioState: ConsultaioState = {
    readonly: false
  } as ConsultaioState;

  const mockSelectSolicitud: Solicitud260906State = {
    tipoOperacion: 'operacion1',
    tipoOperacionJustificacion: 'justificacion',
    rfcResponsableSanitario: 'RFC123',
    denominacion: 'Empresa XYZ',
    correo: 'correo@ejemplo.com',
  } as Solicitud260906State;

  beforeEach(async () => {
    tramite260906StoreMock = {
      setTipoOperacion: jest.fn(),
    };

    tramite260906QueryMock = {
      selectSolicitud$: of(mockSelectSolicitud),
    };

    consultaioQueryMock = {
      selectConsultaioState$: of(mockConsultaioState)
    };

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [ReactiveFormsModule, DatosEstablecimientoComponent],
      providers: [ provideHttpClient(),
        { provide: Tramite260906Store, useValue: tramite260906StoreMock },
        { provide: Tramite260906Query, useValue: tramite260906QueryMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosEstablecimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form group with default values', () => {
    expect(component.forma.value).toEqual({
      tipoOperacion: 'operacion1',
      tipoOperacionJustificacion: 'justificacion',
      rfcResponsableSanitario: 'RFC123',
      denominacion: 'Empresa XYZ',
      correo: 'correo@ejemplo.com',
    });
  });

  it('should toggle the colapsable state', () => {
    expect(component.colapsable).toBe(true);
    component.mostrar_colapsable();
    expect(component.colapsable).toBe(false);
    component.mostrar_colapsable();
    expect(component.colapsable).toBe(true);
  });

  it('should disable the form in readonly mode', () => {
    component.soloLectura = true;
    component.inicializarEstadoFormulario();
    expect(component.forma.disabled).toBe(true);
  });

  it('should enable the form when not in readonly mode', () => {
    component.soloLectura = false;
    component.inicializarEstadoFormulario();
    expect(component.forma.enabled).toBe(true);
  });

  it('should call setTipoOperacion in the store when setTipoOperacion is triggered', () => {
    const evento = 'newOperation';
    component.setTipoOperacion(evento);
    expect(tramite260906StoreMock.setTipoOperacion).toHaveBeenCalledWith(evento);
  });
});