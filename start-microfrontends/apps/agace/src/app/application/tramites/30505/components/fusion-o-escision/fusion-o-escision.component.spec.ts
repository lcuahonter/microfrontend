import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FusionOEscisionComponent } from './fusion-o-escision.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Solicitud30505Store } from '../../../../estados/tramites/tramites30505.store';
import { Solicitud30505Query } from '../../../../estados/queries/tramites30505.query';
import { TercerosRelacionadosService } from '../../services/terceros-relacionados.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FusionOEscisionComponent', () => {
  let component: FusionOEscisionComponent;
  let fixture: ComponentFixture<FusionOEscisionComponent>;
  let routerMock: any;
  let routeMock: any;
  let tercerosServiceMock: any;
  let tramiteStoreMock: any;
  let tramiteQueryMock: any;

  beforeEach(async () => {
    routerMock = { navigate: jest.fn() };
    routeMock = {};
    tercerosServiceMock = {
      obtenerDatosPersona: jest.fn().mockReturnValue(of({
        razonSocial: 'Empresa',
        numFolioTramite: 'FOLIO',
        fechaInicioVigencia: '2023-01-01',
        fechaFinVigencia: '2023-12-31'
      })),
      setFusionada: jest.fn()
    };
    tramiteStoreMock = {
      setAvisoDatos: jest.fn(),
      removeFusionadoDato: jest.fn()
    };
    tramiteQueryMock = {
      selectSolicitud$: of({
        capacidadAlmacenamiento2: '10',
        numeroTotalCarros: '1',
        cantidadBienes: '1',
        fechaInspeccion: '2023-01-01',
        descripcionClobGenerica2: 'desc',
        rfcIdc: 'RFC',
        razonSocial: 'Empresa',
        razonSocialSC: 'EmpresaSC',
        numFolioTramite: 'FOLIO',
        fechaInicioVigencia: '2023-01-01',
        fechafinVigencia2: '2023-12-31',
        fusionEscisionData: [{ id: 1 }]
      })
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule, FusionOEscisionComponent,HttpClientTestingModule],
      providers: [
        FormBuilder,
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: routeMock },
        { provide: TercerosRelacionadosService, useValue: tercerosServiceMock },
        { provide: Solicitud30505Store, useValue: tramiteStoreMock },
        { provide: Solicitud30505Query, useValue: tramiteQueryMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FusionOEscisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize formulario and set visibility flags on ngOnInit', () => {
    expect(component.formulario).toBeDefined();
    expect(component.divCompletoVisible).toBe(true);
    expect(component.conCertificacionPrincipalVisible).toBe(true);
    expect(component.gridFusionEscisionData).toEqual([{ id: 1 }]);
  });

  it('should disable the form if soloLectura is true', () => {
    component.soloLectura = true;
    component.ngOnInit();
    expect(component.formulario.disabled).toBe(true);
  });

  it('should call setAvisoDatos with correct value in mostrarFusionada', () => {
    component.formulario.patchValue({ capacidadAlmacenamiento: '20' });
    component.mostrarFusionada();
    expect(tramiteStoreMock.setAvisoDatos).toHaveBeenCalledWith('capacidadAlmacenamiento2', '20');
  });

  it('should set divCompletoVisible and reset fields in mostrarFusionOEscision when value is 1', () => {
    component.formulario.patchValue({ numeroTotalCarros: '1' });
    component.mostrarFusionOEscision();
    expect(component.divCompletoVisible).toBe(true);
    expect(component.formulario.get('rfc')?.value).toBeNull();
  });

  it('should set divCompletoVisible to false in mostrarFusionOEscision when value is not 1 or 0', () => {
    component.formulario.patchValue({ numeroTotalCarros: '2' });
    component.mostrarFusionOEscision();
    expect(component.divCompletoVisible).toBe(false);
  });

  it('should set visibility flags and reset fields in mostrarCertificacionFusionada', () => {
    component.formulario.patchValue({ cantidadBienes: '0' });
    component.mostrarCertificacionFusionada();
    expect(component.conCertificacionPrincipalVisible).toBe(false);
    expect(component.sinCertificacionPrincipalVisible).toBe(true);
    expect(component.formulario.get('razonSocial')?.value).toBeNull();
  });

  it('should set dvMessageVisible to true if RFC is not present in cargarDatosPersonaFusion', () => {
    component.formulario.patchValue({ rfc: '' });
    component.dvMessageVisible = false;
    component.cargarDatosPersonaFusion();
    expect(component.dvMessageVisible).toBe(true);
  });

  it('should call setAvisoDatos with correct value in cambioFechaInspeccion', () => {
    component.formulario.patchValue({ fechaInspeccion: '2023-02-01' });
    component.cambioFechaInspeccion();
    expect(tramiteStoreMock.setAvisoDatos).toHaveBeenCalledWith('fechaInspeccion', '2023-02-01');
  });

  it('should navigate to agregar-fusion-escision on abrirModalFusionEscision', () => {
    component.abrirModalFusionEscision();
    expect(routerMock.navigate).toHaveBeenCalledWith(['../agregar-fusion-escision'], { relativeTo: routeMock });
  });

  it('should call setAvisoDatos with correct value in cambioRFC', () => {
    component.formulario.patchValue({ rfc: 'RFC2' });
    component.cambioRFC();
    expect(tramiteStoreMock.setAvisoDatos).toHaveBeenCalledWith('rfc', 'RFC2');
  });

  it('should call setAvisoDatos with correct value in cambioRazonSocialSC', () => {
    component.formulario.patchValue({ razonSocialSC: 'EmpresaSC2' });
    component.cambioRazonSocialSC();
    expect(tramiteStoreMock.setAvisoDatos).toHaveBeenCalledWith('razonSocialSC', 'EmpresaSC2');
  });

  it('should call setAvisoDatos with correct value in cambioDescClob', () => {
    component.formulario.patchValue({ descripcionClobGenerica2: 'desc2' });
    component.cambioDescClob();
    expect(tramiteStoreMock.setAvisoDatos).toHaveBeenCalledWith('descripcionClobGenerica2', 'desc2');
  });

  it('should call setAvisoDatos with correct value in cambioFechaInicio', () => {
    component.formulario.patchValue({ fechaInicioVigencia: '2023-03-01' });
    component.cambioFechaInicio();
    expect(tramiteStoreMock.setAvisoDatos).toHaveBeenCalledWith('fechaInicioVigencia', '2023-03-01');
  });

  it('should call setAvisoDatos with correct value in cambioFechaFin', () => {
    component.formulario.patchValue({ fechaFinVigencia: '2023-04-01' });
    component.cambioFechaFin();
    expect(tramiteStoreMock.setAvisoDatos).toHaveBeenCalledWith('fechaFinVigencia', '2023-04-01');
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
