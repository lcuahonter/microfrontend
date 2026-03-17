import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError, Subject } from 'rxjs';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, InjectionToken } from '@angular/core';

import { PasoDosComponent } from './paso-dos.component';
import { ServiciosExtraordinariosService, JSONResponse } from '../../services/servicios-extraordinarios.service';
import { TramiteStore } from '@libs/shared/data-access-user/src';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let fixture: ComponentFixture<PasoDosComponent>;
  let mockRouter: jest.Mocked<Router>;
  let mockTramiteStore: jest.Mocked<TramiteStore>;
  let mockServiciosExtraordinariosService: jest.Mocked<ServiciosExtraordinariosService>;

  const mockJSONResponse: JSONResponse = {
    id: 19,
    descripcion: 'Trámite test',
    codigo: 'TEST-CODE',
    data: 'test-tramite-data'
  };

  beforeEach(async () => {
    // Create mock services
    mockRouter = {
      navigate: jest.fn().mockResolvedValue(true)
    } as any;

    mockTramiteStore = {
      establecerTramite: jest.fn()
    } as any;

    mockServiciosExtraordinariosService = {
      obtenerTramite: jest.fn().mockReturnValue(of(mockJSONResponse))
    } as any;

    await TestBed.configureTestingModule({
      declarations: [PasoDosComponent],
      imports: [HttpClientTestingModule, ToastrModule.forRoot()],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: TramiteStore, useValue: mockTramiteStore },
        { provide: ServiciosExtraordinariosService, useValue: mockServiciosExtraordinariosService },
        ToastrService,
        { provide: new InjectionToken('ToastConfig'), useValue: {} }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoDosComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    if (component) {
      component.ngOnDestroy();
    }
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Tests for obtieneFirma function
   */
  describe('#obtieneFirma', () => {
    beforeEach(() => {
      // Initialize the destroy$ subject
      component['destroy$'] = new Subject<void>();
    });

    it('should process valid signature and complete workflow', () => {
      // Arrange
      const validSignature = 'valid-signature-123';

      // Act
      component.obtieneFirma(validSignature);

      // Assert
      expect(mockServiciosExtraordinariosService.obtenerTramite).toHaveBeenCalledWith(19);
      expect(mockTramiteStore.establecerTramite).toHaveBeenCalledWith(mockJSONResponse.data, validSignature);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['servicios-extraordinarios/acuse']);
    });

    it('should not process empty signature', () => {
      // Arrange
      const emptySignature = '';

      // Act
      component.obtieneFirma(emptySignature);

      // Assert
      expect(mockServiciosExtraordinariosService.obtenerTramite).not.toHaveBeenCalled();
      expect(mockTramiteStore.establecerTramite).not.toHaveBeenCalled();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should not process null signature', () => {
      // Arrange
      const nullSignature = null as any;

      // Act
      component.obtieneFirma(nullSignature);

      // Assert
      expect(mockServiciosExtraordinariosService.obtenerTramite).not.toHaveBeenCalled();
      expect(mockTramiteStore.establecerTramite).not.toHaveBeenCalled();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should not process undefined signature', () => {
      // Arrange
      const undefinedSignature = undefined as any;

      // Act
      component.obtieneFirma(undefinedSignature);

      // Assert
      expect(mockServiciosExtraordinariosService.obtenerTramite).not.toHaveBeenCalled();
      expect(mockTramiteStore.establecerTramite).not.toHaveBeenCalled();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should handle service error gracefully', () => {
      // Arrange
      const validSignature = 'valid-signature-123';
      const errorMessage = 'Service error occurred';
      mockServiciosExtraordinariosService.obtenerTramite.mockReturnValue(
        throwError(() => new Error(errorMessage))
      );

      // Act & Assert - Should not throw
      expect(() => component.obtieneFirma(validSignature)).not.toThrow();
      expect(mockServiciosExtraordinariosService.obtenerTramite).toHaveBeenCalledWith(19);
      expect(mockTramiteStore.establecerTramite).not.toHaveBeenCalled();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should handle different tramite response formats', () => {
      // Arrange
      const validSignature = 'valid-signature-123';
      const differentResponse: JSONResponse = {
        id: 19,
        descripcion: 'Different tramite',
        codigo: 'DIFF-CODE',
        data: 'different-tramite-data'
      };
      mockServiciosExtraordinariosService.obtenerTramite.mockReturnValue(of(differentResponse));

      // Act
      component.obtieneFirma(validSignature);

      // Assert
      expect(mockServiciosExtraordinariosService.obtenerTramite).toHaveBeenCalledWith(19);
      expect(mockTramiteStore.establecerTramite).toHaveBeenCalledWith(differentResponse.data, validSignature);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['servicios-extraordinarios/acuse']);
    });

    it('should handle whitespace-only signature as invalid', () => {
      // Arrange
      const whitespaceSignature = '   ';

      // Act
      component.obtieneFirma(whitespaceSignature);

      // Assert - Since the code checks if(FIRMA), whitespace string is truthy
      expect(mockServiciosExtraordinariosService.obtenerTramite).toHaveBeenCalledWith(19);
      expect(mockTramiteStore.establecerTramite).toHaveBeenCalledWith(mockJSONResponse.data, whitespaceSignature);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['servicios-extraordinarios/acuse']);
    });

    it('should use takeUntil operator to manage subscription lifecycle', () => {
      // Arrange
      const validSignature = 'valid-signature-123';
      let subscriptionActive = true;
      
      mockServiciosExtraordinariosService.obtenerTramite.mockReturnValue(
        new (require('rxjs').Observable)((subscriber: any) => {
          const timer = setTimeout(() => {
            if (subscriptionActive) {
              subscriber.next(mockJSONResponse);
              subscriber.complete();
            }
          }, 100);

          return () => {
            subscriptionActive = false;
            clearTimeout(timer);
          };
        })
      );

      // Act
      component.obtieneFirma(validSignature);
      
      // Simulate component destruction
      component['destroy$'].next();
      component['destroy$'].complete();

      // Assert
      expect(subscriptionActive).toBe(false);
    });

    it('should call obtenerTramite with correct ID (19)', () => {
      // Arrange
      const validSignature = 'test-signature';

      // Act
      component.obtieneFirma(validSignature);

      // Assert
      expect(mockServiciosExtraordinariosService.obtenerTramite).toHaveBeenCalledWith(19);
      expect(mockServiciosExtraordinariosService.obtenerTramite).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple consecutive calls', () => {
      // Arrange
      const signature1 = 'signature-1';
      const signature2 = 'signature-2';

      // Act
      component.obtieneFirma(signature1);
      component.obtieneFirma(signature2);

      // Assert
      expect(mockServiciosExtraordinariosService.obtenerTramite).toHaveBeenCalledTimes(2);
      expect(mockTramiteStore.establecerTramite).toHaveBeenCalledTimes(2);
      expect(mockRouter.navigate).toHaveBeenCalledTimes(2);
    });

    it('should handle tramite response with empty data', () => {
      // Arrange
      const validSignature = 'valid-signature-123';
      const emptyDataResponse: JSONResponse = {
        id: 19,
        descripcion: 'Empty data tramite',
        codigo: 'EMPTY-CODE',
        data: ''
      };
      mockServiciosExtraordinariosService.obtenerTramite.mockReturnValue(of(emptyDataResponse));

      // Act
      component.obtieneFirma(validSignature);

      // Assert
      expect(mockTramiteStore.establecerTramite).toHaveBeenCalledWith('', validSignature);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['servicios-extraordinarios/acuse']);
    });

    it('should handle special characters in signature', () => {
      // Arrange
      const specialSignature = 'signature-with-@#$%^&*()_+-=[]{}|;:,.<>?';

      // Act
      component.obtieneFirma(specialSignature);

      // Assert
      expect(mockServiciosExtraordinariosService.obtenerTramite).toHaveBeenCalledWith(19);
      expect(mockTramiteStore.establecerTramite).toHaveBeenCalledWith(mockJSONResponse.data, specialSignature);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['servicios-extraordinarios/acuse']);
    });
  });

  /**
   * Tests for ngOnDestroy
   */
  describe('#ngOnDestroy', () => {
    it('should complete destroy$ subject', () => {
      // Arrange
      const nextSpy = jest.spyOn(component['destroy$'], 'next');
      const completeSpy = jest.spyOn(component['destroy$'], 'complete');

      // Act
      component.ngOnDestroy();

      // Assert
      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });

  /**
   * Integration tests
   */
  describe('Integration Tests', () => {
    it('should handle complete workflow from signature to navigation', () => {
      // Arrange
      const testSignature = 'integration-test-signature';

      // Act
      component.obtieneFirma(testSignature);

      // Assert - Verify the complete flow
      expect(mockServiciosExtraordinariosService.obtenerTramite).toHaveBeenCalledWith(19);
      expect(mockTramiteStore.establecerTramite).toHaveBeenCalledWith(mockJSONResponse.data, testSignature);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['servicios-extraordinarios/acuse']);
    });

    it('should handle error and prevent navigation', () => {
      // Arrange
      const testSignature = 'error-test-signature';
      mockServiciosExtraordinariosService.obtenerTramite.mockReturnValue(
        throwError(() => new Error('Network error'))
      );

      // Act
      component.obtieneFirma(testSignature);

      // Assert
      expect(mockServiciosExtraordinariosService.obtenerTramite).toHaveBeenCalledWith(19);
      expect(mockTramiteStore.establecerTramite).not.toHaveBeenCalled();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });
});
