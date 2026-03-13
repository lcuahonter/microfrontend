import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DerechosComponent } from './derechos.component';
import { ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { Sanitario260906Store } from '../../../../estados/tramites/sanitario260906.store';
import { Permiso260906Query } from '../../../../estados/queries/permiso260906.query';
import { SanitarioService } from '../../services/sanitario.service';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Catalogo } from '@ng-mf/data-access-user';
import { Solicitud260906State } from '../../../../estados/tramites/sanitario260906.store';
import { provideHttpClient } from '@angular/common/http';

describe('DerechosComponent', () => {
  let component: DerechosComponent;
  let fixture: ComponentFixture<DerechosComponent>;
  let sanitario260906StoreMock: Partial<Sanitario260906Store>;
  let permiso260906QueryMock: Partial<Permiso260906Query>;
  let consultaioQueryMock: Partial<ConsultaioQuery>;

    const mockConsultaioState: ConsultaioState = {
      readonly: false
    } as ConsultaioState;
  
      const mockSelectSolicitud: Solicitud260906State = {
        referencia: 'REF123',
        cadenaDependencia: 'CADENA123',
        llave: 'LLAVE123',
        banco: 'BANCO123',
        tipoFetch: '2025-06-26',
        importe: '1000',
      } as Solicitud260906State;

  beforeEach(async () => {
    sanitario260906StoreMock = {
      setreferencia: jest.fn(),
      setcadenaDependencia: jest.fn(),
      setbanco: jest.fn(),
      setLlave: jest.fn(),
      setimporte: jest.fn(),
    };

    permiso260906QueryMock = {
      selectSolicitud$: of(mockSelectSolicitud),
    };

    consultaioQueryMock = {
      selectConsultaioState$: of(mockConsultaioState),
    };

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [ReactiveFormsModule, DerechosComponent],
      providers: [ provideHttpClient(),
        { provide: Sanitario260906Store, useValue: sanitario260906StoreMock },
        { provide: Permiso260906Query, useValue: permiso260906QueryMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DerechosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.derechosForm.value).toEqual({
      referencia: 'REF123',
      cadenaDependencia: 'CADENA123',
      llave: 'LLAVE123',
      banco: 'BANCO123',
      tipoFetch: '2025-06-26',
      importe: '1000',
    });
  });

  it('should call setreferencia in the store when setValoresStore is triggered for referencia', () => {
    const referenciaControl = component.derechosForm.get('referencia');
    referenciaControl?.setValue('NEW_REF');
    component.setValoresStore(component.derechosForm, 'referencia', 'setreferencia');
    expect(sanitario260906StoreMock.setreferencia).toHaveBeenCalledWith('NEW_REF');
  });

  it('should disable the form in readonly mode', () => {
    component.soloLectura = true;
    component.inicializarEstadoFormulario();
    expect(component.derechosForm.disabled).toBe(true);
  });

  it('should enable the form when not in readonly mode', () => {
    component.soloLectura = false;
    component.inicializarEstadoFormulario();
    expect(component.derechosForm.enabled).toBe(true);
  });

  it('should update the tipoFetch field when onFechaCambiada is called', () => {
    component.onFechaCambiada('2025-07-01');
    expect(component.derechosForm.get('tipoFetch')?.value).toBe('2025-07-01');
  });

  it('should clean up subscriptions on component destroy', () => {
    const destroySpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});