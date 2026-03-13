import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoDosComponent } from './paso-dos.component';
import { Router } from '@angular/router';
import { ServiciosPantallaService } from '@libs/shared/data-access-user/src/core/services/31601/servicios-pantalla.service';
import { TramiteStore } from '@libs/shared/data-access-user/src/core/estados/tramite.store';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { FirmaElectronicaComponent } from '@libs/shared/data-access-user/src';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrService } from 'ngx-toastr';
import {NO_ERRORS_SCHEMA } from '@angular/core';

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let fixture: ComponentFixture<PasoDosComponent>;
  let mockRouter: jest.Mocked<Router>;
  let mockServiciosService: jest.Mocked<ServiciosPantallaService>;
  let mockTramiteStore: jest.Mocked<TramiteStore>;

  beforeEach(async () => {
    mockRouter = {
      navigate: jest.fn()
    } as any;

    mockServiciosService = {
      obtenerTramite: jest.fn()
    } as any;

    mockTramiteStore = {
      establecerTramite: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      declarations: [PasoDosComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ServiciosPantallaService, useValue: mockServiciosService },
        { provide: TramiteStore, useValue: mockTramiteStore },
        { provide: ToastrService, useValue: { success: jest.fn(), error: jest.fn() } }
      ],
      imports: [FirmaElectronicaComponent,HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoDosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('obtieneFirma', () => {
    const mockFirma = 'test-firma';

    it('should not call services when firma is empty', () => {
      component.obtieneFirma('');

      expect(mockServiciosService.obtenerTramite).not.toHaveBeenCalled();
      expect(mockTramiteStore.establecerTramite).not.toHaveBeenCalled();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should complete destroyed$ subject', () => {
      const nextSpy = jest.spyOn(component.destroyed$, 'next');
      const completeSpy = jest.spyOn(component.destroyed$, 'complete');

      component.ngOnDestroy();

      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });
});