import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CapturarElTextoLibreComponent } from './capturar-el-texto-libre.component';
import {
  AlertComponent,
  TEXTOS,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CapturarElTextoLibre } from '../../models/datos-tramite.model';
import { AutoridadService } from '../../services/autoridad.service';
import { of } from 'rxjs';

describe('CapturarElTextoLibreComponent', () => {
  let component: CapturarElTextoLibreComponent;
  let routerSpy: jest.Mocked<Router>;
  let autoridadServiceMock: any;

  beforeEach(() => {
    const spy = {
      navigate: jest.fn(),
      events: jest.fn() as any,
    } as unknown as jest.Mocked<Router>;
      autoridadServiceMock = {
        agregarCapturarElTextoLibre: jest.fn().mockReturnValue(of({})),
        };

    TestBed.configureTestingModule({
      imports: [
        CapturarElTextoLibreComponent,
        TituloComponent,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AlertComponent,
      ],
      providers: [
        { provide: AutoridadService, useValue: autoridadServiceMock },
        { provide: Router, useValue: spy },
      ],
    });

    const fixture = TestBed.createComponent(CapturarElTextoLibreComponent);
    component = fixture.componentInstance;
    routerSpy = TestBed.inject(Router) as jest.Mocked<Router>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have TEXTOS defined', () => {
    expect(component.TEXTOS).toBe(TEXTOS);
  });

  it('should have infoAlert set to "alert-info"', () => {
    expect(component.infoAlert).toBe('alert-info');
  });

  it('should navigate to the correct route on guardarYFirmar', () => {
    component.guardarYFirmar();
    expect(routerSpy.navigate).toHaveBeenCalledWith([
      '/agace/manifiesto-aereo/firmar',
    ]);
  });
  it('should call agregarCapturarElTextoLibre and update capturarElTextoLibre', () => {
    const mockResponse: CapturarElTextoLibre = {
      detalles_de_administracion_1:
        'Administración General de Auditoría de Comercio Exterior',
      detalles_de_administracion_2:
        'Administración central de Certificacion y Asintos Internacionales de Auditoria de',
      detalles_de_administracion_3:
        ' Administración de Certificacion y Asintos Internacionales de Auditoria de Camerdo',
      exterior: "Exterior '2'",
      officio: 'Officio',
      ciudad_de_mexico: 'Ciudad de Mexico, a',
      direccion_1: 'HOTEL Y RESAURANT RITZ DE TAB SA DE CV',
      direccion_2:
        'CALZADA DE MARISOLES LT1 47, COL.FRACC. INDUSTRVANERA, CP. 76900, CORREGIDORA, QUERÉTARO',
      identificacion: 'COR8002198KA',
    } as CapturarElTextoLibre;
    const autoridadServiceSpy = jest
      .spyOn(component.autoridadService, 'agregarCapturarElTextoLibre')
      .mockReturnValue({
        pipe: jest.fn().mockReturnValue({
          subscribe: jest.fn((callback) => callback.next(mockResponse)),
        }),
      } as any);

    component.agregarCapturarElTextoLibre();

    expect(autoridadServiceSpy).toHaveBeenCalled();
    expect(component.capturarElTextoLibre).toBe(mockResponse);
  });
});
