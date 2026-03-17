import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, Subject } from 'rxjs';
import { RegistroCuentasBancariasService } from '../../services/registro-cuentas-bancarias.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let mockRegistroService: jest.Mocked<RegistroCuentasBancariasService>;
  let mockConsultaQuery: { selectConsultaioState$: Subject<any> };

  beforeEach(async () => {
    // Create mock services with Jest
    mockRegistroService = {
      componenteActual: of('DatosGenerales'),
      getConsultaFormularioDatos: jest.fn(),
      actualizarEstadoFormulario: jest.fn()
    } as any;

    mockConsultaQuery = {
      selectConsultaioState$: new Subject()
    };

    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: RegistroCuentasBancariasService, useValue: mockRegistroService },
        { provide: ConsultaioQuery, useValue: mockConsultaQuery }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;

  });

  afterEach(() => {
    jest.clearAllMocks();
    component.ngOnDestroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should subscribe to selectConsultaioState$ and update consultaState', fakeAsync(() => {
      const testState = { update: false, readonly: true };
      
      component.ngOnInit();
      mockConsultaQuery.selectConsultaioState$.next(testState);
      tick();
      
      expect(component.consultaState).toEqual(testState);
      expect(mockRegistroService.getConsultaFormularioDatos).not.toHaveBeenCalled();
    }));
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from all subscriptions', () => {
      // Set up subscriptions
      component.ngOnInit();
      
      // Spy on internal properties
      const subscriptionSpy = jest.spyOn(component['subscription'], 'unsubscribe');
      const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
      const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
      
      component.ngOnDestroy();
      
      expect(subscriptionSpy).toHaveBeenCalled();
      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });

  describe('component behavior', () => {
    it('should initialize with default componenteActual', () => {
      expect(component.componenteActual).toBe('DatosGenerales');
    });

  });
});