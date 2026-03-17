import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarAgenteComponent } from './agregar-agente.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { Solicitud30505Store } from '../../../../estados/tramites/tramites30505.store';
import { Solicitud30505Query } from '../../../../estados/queries/tramites30505.query';
import { of, Subject } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';

describe('AgregarAgenteComponent', () => {
  let component: AgregarAgenteComponent;
  let fixture: ComponentFixture<AgregarAgenteComponent>;
  let storeMock: any;
  let queryMock: any;
  let locationMock: any;

  beforeEach(async () => {
    storeMock = {
      updateAgenteDatos: jest.fn(),
      setNumeroEstablecimiento: jest.fn(),
      setDescClobGenerica: jest.fn(),
      setActividadProductiva: jest.fn(),
      setFechaInicioVigencia: jest.fn(),
      setFechaFinVigencia: jest.fn(),
      setCheckboxDatos: jest.fn(),
      setFolioAcuse: jest.fn(),
      setTipoSolicitudPexim: jest.fn(),
      setCapacidadAlmacenamiento: jest.fn(),
      setTipoCaat: jest.fn(),
      setTipoProgFomExp: jest.fn(),
      setTipoTransito: jest.fn(),
      setMedioTransporte: jest.fn(),
      setNombreBanco: jest.fn(),
      setNomOficialAutorizado: jest.fn(),
      setObservaciones: jest.fn(),
      setEmpresaControladora: jest.fn(),
      setDescripcionLugarEmbarque: jest.fn()
    };
    queryMock = {
      selectSolicitud$: of({
        tipoFigura: '1',
        patenteModificada: 'PM',
        numPatenteModal: '1234',
        rfcModal: 'RFC1234567890',
        obligFisc: true,
        autPantente: true,
        nombre: 'Juan',
        apellidoPaterno: 'Pérez',
        apellidoMaterno: 'García',
        razonSocialAgente: 'Empresa S.A.',
        patente2: 'PATENTE2',
        razonAgencia: 'Agencia S.A.'
      })
    };
    locationMock = { back: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule, AgregarAgenteComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        { provide: Solicitud30505Store, useValue: storeMock },
        { provide: Solicitud30505Query, useValue: queryMock },
        { provide: Location, useValue: locationMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarAgenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize datosTramite form on ngOnInit', () => {
    expect(component.datosTramite).toBeDefined();
    expect(component.datosTramite.get('tipoFigura')).toBeTruthy();
    expect(component.datosTramite.get('nombre')).toBeTruthy();
  });

  it('should show agente and hide agencia when onSelectFigura is called with 1', () => {
    const event = { target: { value: '1' } } as any;
    component.onSelectFigura(event);
    expect(component.mostrarAgente).toBe(true);
    expect(component.mostrarAgencia).toBe(false);
  });

  it('should show agencia and hide agente when onSelectFigura is called with other value', () => {
    const event = { target: { value: '3' } } as any;
    component.onSelectFigura(event);
    expect(component.mostrarAgente).toBe(false);
    expect(component.mostrarAgencia).toBe(true);
  });

  it('should reset form and hide sections on limpiarSociedadesScc', () => {
    component.mostrarAgente = true;
    component.mostrarAgencia = true;
    component.datosTramite.patchValue({ tipoFigura: '1' });
    component.limpiarSociedadesScc();
    expect(component.datosTramite.pristine).toBe(false);
    expect(component.mostrarAgente).toBe(false);
    expect(component.mostrarAgencia).toBe(false);
  });

  it('should reset form and call location.back on cerrarDialogoSociedadesScc', () => {
    component.datosTramite.patchValue({ tipoFigura: '1' });
    component.cerrarDialogoSociedadesScc();
    expect(component.datosTramite.pristine).toBe(false);
    expect(locationMock.back).toHaveBeenCalled();
  });

  it('should call updateAgenteDatos and reset form and call location.back on aceptarSociedadesScc', () => {
    component.datosTramite.patchValue({
      tipoFigura: '1',
      patenteModificada: 'PM',
      numPatenteModal: '1234',
      rfcModal: 'RFC1234567890',
      obligFisc: true,
      autPantente: true,
      nombre: 'Juan',
      apellidoPaterno: 'Pérez',
      apellidoMaterno: 'García',
      razonSocial: 'Empresa S.A.',
      patente2: 'PATENTE2',
      razonAgencia: 'Agencia S.A.'
    });
    component.agenteDatos = [];
    component.aceptarSociedadesScc();
    expect(component.agenteDatos.length).toBe(1);
    expect(storeMock.updateAgenteDatos).toHaveBeenCalledWith(component.agenteDatos);
    expect(component.datosTramite.pristine).toBe(false);
    expect(locationMock.back).toHaveBeenCalled();
  });

  it('should call the correct store method in setValoresStore', () => {
    const form = component.datosTramite;
    form.patchValue({ tipoFigura: '1' });
    storeMock.setTipoFigura = jest.fn();
    component.setValoresStore(form, 'tipoFigura', 'setTipoFigura');
    expect(storeMock.setTipoFigura).toHaveBeenCalledWith('1');
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
