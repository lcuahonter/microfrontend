import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarFusionEscisionComponent } from './agregar-fusion-escision.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { Solicitud30505Store } from '../../../../estados/tramites/tramites30505.store';
import { Solicitud30505Query } from '../../../../estados/queries/tramites30505.query';
import { TercerosRelacionadosService } from '../../services/terceros-relacionados.service';
import { of, Subject } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AgregarFusionEscisionComponent', () => {
  let component: AgregarFusionEscisionComponent;
  let fixture: ComponentFixture<AgregarFusionEscisionComponent>;
  let storeMock: any;
  let queryMock: any;
  let tercerosServiceMock: any;
  let locationMock: any;

  beforeEach(async () => {
    jest.useFakeTimers();
    locationMock = { back: jest.fn() }; 

    storeMock = {
      setAvisoDatos: jest.fn(),
      updateFusionDatos: jest.fn()
    };
    queryMock = {
      selectSolicitud$: of({
        certificacionModal: '1',
        rfcBusquedaModal: 'RFC123',
        razonSocialFusionante: 'Empresa Fusionante',
        folioVucemFusionante: 'FOLIO123',
        fechaInicioVigenciaFusionante: '2023-01-01',
        fechaFinVigenciaFusionante: '2023-12-31',
        rfcBusquedaModalSC: 'RFCSC',
        razonSocialFusionanteSC: 'Empresa SC'
      })
    };
    tercerosServiceMock = {
      obtenerDatosPersona: jest.fn().mockReturnValue(of({
        razonSocial: 'Empresa Fusionada',
        numFolioTramite: 'FOLIO999',
        fechaInicioVigencia: '2022-01-01',
        fechaFinVigencia: '2022-12-31'
      }))
    };
    await TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule, AgregarFusionEscisionComponent,HttpClientTestingModule],
      providers: [
        FormBuilder,
        { provide: Solicitud30505Store, useValue: storeMock },
        { provide: Solicitud30505Query, useValue: queryMock },
        { provide: TercerosRelacionadosService, useValue: tercerosServiceMock },
        { provide: Location, useValue: locationMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarFusionEscisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize fusionEscisionForm on ngOnInit', () => {
    expect(component.fusionEscisionForm).toBeDefined();
    expect(component.fusionEscisionForm.get('certificacionModal')).toBeTruthy();
    expect(component.fusionEscisionForm.get('rfcBusquedaModal')).toBeTruthy();
  });

  it('should call setAvisoDatos and disable/enable fields in mostrarCertificacion', () => {
    component.fusionEscisionForm.patchValue({ certificacionModal: '1' });
    component.mostrarCertificacion();
    expect(storeMock.setAvisoDatos).toHaveBeenCalledWith('certificacionModal', '1');
    expect(component.fusionEscisionForm.get('razonSocialFusionante')?.disabled).toBe(true);
    expect(component.fusionEscisionForm.get('razonSocialFusionanteSC')?.disabled).toBe(true);

    component.fusionEscisionForm.patchValue({ certificacionModal: '0' });
    component.mostrarCertificacion();
    expect(component.fusionEscisionForm.get('razonSocialFusionanteSC')?.enabled).toBe(true);
  });
  it('should add fusionEscisionData, update store, reset form, and call location.back on agregarFusionEscision', () => {
    component.fusionEscisionForm.patchValue({
      certificacionModal: '1',
      rfcBusquedaModal: 'RFC123',
      razonSocialFusionante: 'Empresa Fusionante',
      folioVucemFusionante: 'FOLIO123',
      fechaInicioVigenciaFusionante: '2023-01-01',
      fechaFinVigenciaFusionante: '2023-12-31',
      rfcBusquedaModalSC: 'RFCSC',
      razonSocialFusionanteSC: 'Empresa SC',
    });
  
    component.agregarFusionEscision();
  
    expect(component.fusionEscisionData.length).toBe(1);
  
    expect(storeMock.updateFusionDatos).toHaveBeenCalledWith(component.fusionEscisionData);
      expect(component.fusionEscisionForm.pristine).toBe(true);
  
    jest.advanceTimersByTime(2000); 
    expect(locationMock.back).toHaveBeenCalled();
  });
  it('should call location.back on cerrarDialogoFusionEscision', () => {
    component.cerrarDialogoFusionEscision();
    expect(locationMock.back).toHaveBeenCalled();
  });

  it('should call setAvisoDatos with RFC on cambioRFC', () => {
    component.fusionEscisionForm.patchValue({ rfcBusquedaModal: 'RFC123' });
    component.cambioRFC();
    expect(storeMock.setAvisoDatos).toHaveBeenCalledWith('rfcBusquedaModal', 'RFC123');
  });

  it('should call setAvisoDatos with rfcBusquedaModalSC on cambioRfcSC', () => {
    component.fusionEscisionForm.patchValue({ rfcBusquedaModalSC: 'RFCSC' });
    component.cambioRfcSC();
    expect(storeMock.setAvisoDatos).toHaveBeenCalledWith('rfcBusquedaModalSC', 'RFCSC');
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
