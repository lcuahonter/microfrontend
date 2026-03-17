import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PasoDosComponent } from './paso-dos.component';
import { Router } from '@angular/router';
import { RegistroCuentasBancariasService } from '../../services/registro-cuentas-bancarias.service';
import { of, throwError, Subscription } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let fixture: ComponentFixture<PasoDosComponent>;
  let mockRouter: jest.Mocked<Router>;
  let mockRegistroService: jest.Mocked<RegistroCuentasBancariasService>;

  beforeEach(async () => {
    // Create mock services
    mockRouter = {
      navigate: jest.fn()
    } as any;

    mockRegistroService = {
      obtenerTramite: jest.fn().mockReturnValue(of({}))
    } as any;

    await TestBed.configureTestingModule({
      declarations: [PasoDosComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: RegistroCuentasBancariasService, useValue: mockRegistroService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoDosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('obtieneFirma', () => {
    it('should navigate to acuse when signature is provided', fakeAsync(() => {
      const testSignature = 'test-signature';
      
      component.obtieneFirma(testSignature);
      tick();
      
      expect(mockRegistroService.obtenerTramite).toHaveBeenCalledWith(19);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['servicios-extraordinarios/acuse']);
    }));

    it('should not call obtenerTramite when signature is empty', () => {
      component.obtieneFirma('');
      
      expect(mockRegistroService.obtenerTramite).not.toHaveBeenCalled();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from all subscriptions', () => {
      // Create a mock subscription
      const mockSubscription = {
        unsubscribe: jest.fn()
      };
      component['subscription'] = mockSubscription as unknown as Subscription;
      
      component.ngOnDestroy();
      
      expect(mockSubscription.unsubscribe).toHaveBeenCalled();
    });

  });

  describe('constructor', () => {
    it('should initialize with empty subscription', () => {
      expect(component['subscription']).toBeInstanceOf(Subscription);
      expect(component['subscription'].closed).toBe(false);
    });
  });
});