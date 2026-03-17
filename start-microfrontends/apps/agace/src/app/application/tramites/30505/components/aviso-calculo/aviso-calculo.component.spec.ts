import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvisoCalculoComponent } from './aviso-calculo.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Solicitud30505Store } from '../../../../estados/tramites/tramites30505.store';
import { Solicitud30505Query } from '../../../../estados/queries/tramites30505.query';
import { of } from 'rxjs';

describe('AvisoCalculoComponent', () => {
  let component: AvisoCalculoComponent;
  let fixture: ComponentFixture<AvisoCalculoComponent>;
  let storeMock: any;
  let queryMock: any;

  beforeEach(async () => {
    storeMock = {
      setCapacidadAlmacenamiento: jest.fn(),
      setTipoSolicitudPexim: jest.fn(),
      setActividadProductiva: jest.fn(),
      setTipoCaat: jest.fn(),
      setTipoProgFomExp: jest.fn(),
      setTipoTransito: jest.fn(),
      setNumeroEstablecimiento: jest.fn(),
      setMedioTransporte: jest.fn(),
      setNombreBanco: jest.fn(),
      setNomOficialAutorizado: jest.fn(),
      setObservaciones: jest.fn(),
      setEmpresaControladora: jest.fn(),
      setDescripcionLugarEmbarque: jest.fn()
    };
    queryMock = {
      selectSolicitud$: of({
        capacidadAlmacenamiento: '1',
        tipoSolicitudPexim: 'PEXIM',
        actividadProductiva: 'PROD',
        tipoCaat: 'CAAT',
        tipoProgFomExp: 'PROG',
        tipoTransito: 'TRANS',
        numeroEstablecimiento: '123',
        medioTransporte: 'CAMION',
        nombreBanco: 'BANCO',
        nomOficialAutorizado: 'OFICIAL',
        observaciones: 'OBS',
        empresaControladora: '1',
        descripcionLugarEmbarque: 'LUGAR'
      })
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule, AvisoCalculoComponent],
      providers: [
        FormBuilder,
        { provide: Solicitud30505Store, useValue: storeMock },
        { provide: Solicitud30505Query, useValue: queryMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AvisoCalculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize avisoDeCalForm on ngOnInit', () => {
    expect(component.avisoDeCalForm).toBeDefined();
    expect(component.avisoDeCalForm.get('capacidadAlmacenamiento')).toBeTruthy();
    expect(component.avisoDeCalForm.get('empresaControladora')).toBeTruthy();
  });

  it('should disable the form if soloLectura is true', () => {
    component.soloLectura = true;
    component.ngOnInit();
    expect(component.avisoDeCalForm.disabled).toBe(true);
  });

  it('should call the correct store method in setValoresStore', () => {
    const form = component.avisoDeCalForm;
    form.patchValue({ capacidadAlmacenamiento: '1' });
    storeMock.setCapacidadAlmacenamiento = jest.fn();
    component.setValoresStore(form, 'capacidadAlmacenamiento', 'setCapacidadAlmacenamiento');
    expect(storeMock.setCapacidadAlmacenamiento).toHaveBeenCalledWith('1');
  });

  it('should set montoContribuVisible and montoTotalContribucionesVisible in validaRadioCalculo', () => {
    component.avisoDeCalForm.patchValue({ capacidadAlmacenamiento: '1', empresaControladora: '1' });
    component.validaRadioCalculo();
    expect(component.montoContribuVisible).toBe(true);
    expect(component.montoTotalContribucionesVisible).toBe(true);

    component.avisoDeCalForm.patchValue({ capacidadAlmacenamiento: '0', empresaControladora: '0' });
    component.validaRadioCalculo();
    expect(component.montoContribuVisible).toBe(false);
    expect(component.montoTotalContribucionesVisible).toBe(false);
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
