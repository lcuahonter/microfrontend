import { TestBed } from '@angular/core/testing';
import { PasoTresComponent } from './paso-tres.component';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirmaElectronicaComponent } from '@libs/shared/data-access-user/src';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let routerSpy: jest.Mocked<Router>;

  beforeEach(async () => {
    routerSpy = {
      navigateByUrl: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [PasoTresComponent, CommonModule, FirmaElectronicaComponent, HttpClientTestingModule],
      providers: [{ provide: Router, useValue: routerSpy }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    component = new PasoTresComponent(routerSpy);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to "se/reporte-anual/acuse" if FIRMA is a non-empty string', () => {
    component.obtieneFirma('firmaValida');
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
      'se/reporte-anual/acuse'
    );
  });

  it('should not navigate if FIRMA is an empty string', () => {
    component.obtieneFirma('');
    expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
  });

  it('should not navigate if FIRMA is undefined', () => {
    component.obtieneFirma(undefined as any);
    expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
  });

  it('should not navigate if FIRMA is null', () => {
    component.obtieneFirma(null as any);
    expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
  });
});
