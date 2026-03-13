import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudComponent } from './solicitud.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SolicitudService } from '../../services/solicitud/solicitud.service';
import { Solicitud6101Store } from '../../estados/solicitud6101.store';
import { Solicitud6101Query } from '../../estados/solicitud6101.query';
import { of, Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  AlertComponent,
  AnexarDocumentosComponent,
  BtnContinuarComponent,
  CatalogoSelectComponent,
  FirmaElectronicaComponent,
  InputFechaComponent,
  SolicitanteComponent,
  TablaDinamicaComponent,
  TableComponent,
  TituloComponent,
  WizardComponent,
} from '@libs/shared/data-access-user/src';

describe('SolicitudComponent', () => {
  let component: SolicitudComponent;
  let fixture: ComponentFixture<SolicitudComponent>;
  let solicitudServiceMock: Partial<SolicitudService>;
  let solicitud6101StoreMock: Partial<Solicitud6101Store>;
  let solicitud6101QueryMock: Partial<Solicitud6101Query>;

  beforeEach(async () => {
    solicitudServiceMock = {
      conseguirSolicitudCatologo: jest.fn().mockReturnValue(
        of({
          aduana: { id: 1, nombre: 'Aduana 1' },
          juntaTecnicaDerivada: { id: 2, nombre: 'Junta Técnica 1' },
        })
      ),
    };

    solicitud6101StoreMock = {
      actualizarAduanaAux: jest.fn(()=> of()),
      actualizarJuntaTecnicaDerivada: jest.fn(()=> of()),
      actualizarNumeroPedimento: jest.fn(()=> of()),
      actualizarNombreComercialMercancia: jest.fn(()=> of()),
      actualizarDescDetalladaMercancia: jest.fn(()=> of()),
      actualizarFraccionI: jest.fn(()=> of()),
      actualizarCapitulo: jest.fn(()=> of()),
      actualizarPartida: jest.fn(()=> of()),
      actualizarSubpartida: jest.fn(()=> of()),
      actualizarSubdivision: jest.fn(()=> of()),
      actualizarManifiestosSeleccionados: jest.fn(()=> of()),
      actualizarFraccionII: jest.fn(()=> of()),
      actualizarCapituloII: jest.fn(()=> of()),
      actualizarPartidaII: jest.fn(()=> of()),
      actualizarSubpartidaII: jest.fn(()=> of()),
      actualizarSubdivisionII: jest.fn(()=> of()),
      actualizarFraccionIII: jest.fn(()=> of()),
      actualizarCapituloIII: jest.fn(()=> of()),
      actualizarPartidaIII: jest.fn(()=> of()),
      actualizarSubpartidaIII: jest.fn(()=> of()),
      actualizarSubdivisionIII: jest.fn(()=> of()),
    };

    solicitud6101QueryMock = {
      seleccionarSolicitud$: of({
        aduanaAux: 'Aduana 1',
        juntaTecnicaDerivada: 'Junta Técnica 1',
        numeroPedimento: '123456',
        nombreComercialMercancia: 'Mercancía 1',
        descDetalladaMercancia: 'Descripción detallada',
        fraccionI: '1234567890',
        capitulo: '12',
        partida: '1234',
        subpartida: '123456',
        subdivision: '90',
        manifiestosSeleccionados: false,
      }),
    } as Partial<Solicitud6101Query>;

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        CommonModule,
        CommonModule,
        ReactiveFormsModule,
        WizardComponent,
        BtnContinuarComponent,
        SolicitanteComponent,
        FirmaElectronicaComponent,
        TituloComponent,
        FormsModule,
        TableComponent,
        AlertComponent,
        AnexarDocumentosComponent,
        CatalogoSelectComponent,
        InputFechaComponent,
        TablaDinamicaComponent,
      ],
      declarations: [SolicitudComponent],
      providers: [
        FormBuilder,
        { provide: SolicitudService, useValue: solicitudServiceMock },
        { provide: Solicitud6101Store, useValue: solicitud6101StoreMock },
        { provide: Solicitud6101Query, useValue: solicitud6101QueryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudComponent);
    component = fixture.componentInstance;
    component.guardarDatosFormulario = jest.fn();
    component.inicializarFormulario = jest.fn();
    component.inicializarFormulario = jest.fn();
    jest.spyOn(component.solicitudForm, 'disable');
    jest.spyOn(component.solicitudForm, 'enable');
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit', () => {
    expect(component.solicitudForm).toBeDefined();
    expect(component.solicitudForm.get('aduanaAux')?.value).toBe('Aduana 1');
    expect(component.solicitudForm.get('juntaTecnicaDerivada')?.value).toBe(
      'Junta Técnica 1'
    );
  });

  it('should call conseguirSolicitudCatologo on initialization', () => {
    expect(solicitudServiceMock.conseguirSolicitudCatologo).toHaveBeenCalled();
    expect(component.opcionAduanaAux).toEqual({ id: 1, nombre: 'Aduana 1' });
    expect(component.opcionJuntaTecnicaDerivada).toEqual({
      id: 2,
      nombre: 'Junta Técnica 1',
    });
  });

  it('should update aduanaAux on seleccionarAduana', () => {
    const mockCatalogo = { id: 3, descripcion: 'Aduana 3' };
    component.seleccionarAduana(mockCatalogo);
    expect(solicitud6101StoreMock.actualizarAduanaAux).toHaveBeenCalledWith(3);
  });

  it('should update juntaTecnicaDerivada on seleccionarJuntaTecnicaDerivada', () => {
    const mockCatalogo = { id: 4, descripcion: 'Junta Técnica 4' };
    component.seleccionarJuntaTecnicaDerivada(mockCatalogo);
    expect(
      solicitud6101StoreMock.actualizarJuntaTecnicaDerivada
    ).toHaveBeenCalledWith(4);
  });

  it('should sanitize and update numeroPedimento on onNumeroPedimento', () => {
    const mockEvent = { target: { value: '123abc456' } } as unknown as Event;
    component.onNumeroPedimento(mockEvent);
    expect(
      solicitud6101StoreMock.actualizarNumeroPedimento
    ).toHaveBeenCalledWith('123456');
  });

  it('should update nombreComercialMercancia on onNombreComercialMercancia', () => {
    const mockEvent = { target: { value: 'New Name' } } as unknown as Event;
    component.onNombreComercialMercancia(mockEvent);
    expect(
      solicitud6101StoreMock.actualizarNombreComercialMercancia
    ).toHaveBeenCalledWith('New Name');
  });

  it('should update descDetalladaMercancia on onDescDetalladaMercancia', () => {
    const mockEvent = {
      target: { value: 'New Description' },
    } as unknown as Event;
    component.onDescDetalladaMercancia(mockEvent);
    expect(
      solicitud6101StoreMock.actualizarDescDetalladaMercancia
    ).toHaveBeenCalledWith('New Description');
  });

  it('should process and update fraccionI on onFraccionI', () => {
    const mockEvent = { target: { value: '1234567890' } } as unknown as Event;
    component.onFraccionI(mockEvent);
    expect(solicitud6101StoreMock.actualizarFraccionI).toHaveBeenCalledWith(
      '1234567890'
    );
    expect(solicitud6101StoreMock.actualizarCapitulo).toHaveBeenCalledWith(
      '12'
    );
    expect(solicitud6101StoreMock.actualizarPartida).toHaveBeenCalledWith(
      '1234'
    );
    expect(solicitud6101StoreMock.actualizarSubpartida).toHaveBeenCalledWith(
      '123456'
    );
    expect(solicitud6101StoreMock.actualizarSubdivision).toHaveBeenCalledWith(
      '90'
    );
  });

  it('should process and update fraccionII on onFraccionII', () => {
    const mockEvent = { target: { value: '1234567890' } } as unknown as Event;
    component.onFraccionII(mockEvent);

    expect(solicitud6101StoreMock.actualizarFraccionII).toHaveBeenCalledWith(
      '1234567890'
    );
    expect(solicitud6101StoreMock.actualizarCapituloII).toHaveBeenCalledWith(
      '12'
    );
    expect(solicitud6101StoreMock.actualizarPartidaII).toHaveBeenCalledWith(
      '1234'
    );
    expect(solicitud6101StoreMock.actualizarSubpartidaII).toHaveBeenCalledWith(
      '123456'
    );
    expect(solicitud6101StoreMock.actualizarSubdivisionII).toHaveBeenCalledWith(
      '90'
    );
  });

  it('should process and update fraccionIII on onFraccionIII', () => {
    const mockEvent = { target: { value: '9876543210' } } as unknown as Event;
    component.onFraccionIII(mockEvent);

    expect(solicitud6101StoreMock.actualizarFraccionIII).toHaveBeenCalledWith(
      '9876543210'
    );
    expect(solicitud6101StoreMock.actualizarCapituloIII).toHaveBeenCalledWith(
      '98'
    );
    expect(solicitud6101StoreMock.actualizarPartidaIII).toHaveBeenCalledWith(
      '9876'
    );
    expect(solicitud6101StoreMock.actualizarSubpartidaIII).toHaveBeenCalledWith(
      '987654'
    );
    expect(
      solicitud6101StoreMock.actualizarSubdivisionIII
    ).toHaveBeenCalledWith('10');
  });

  it('should update manifiestosSeleccionados on onManifiesto', () => {
    const mockEvent = { target: { checked: true } } as unknown as Event;
    component.onManifiesto(mockEvent);

    expect(
      solicitud6101StoreMock.actualizarManifiestosSeleccionados
    ).toHaveBeenCalledWith(true);
  });

  it('should call guardarDatosFormulario if esFormularioSoloLectura is true', () => {
    component.esFormularioSoloLectura = true;
    component.inicializarEstadoFormulario();
    expect(component.guardarDatosFormulario).toHaveBeenCalled();
  });

  it('should call inicializarFormulario if esFormularioSoloLectura is false', () => {
    component.esFormularioSoloLectura = false;
    component.inicializarEstadoFormulario();
    expect(component.inicializarFormulario).toHaveBeenCalled();
    expect(component.guardarDatosFormulario).not.toHaveBeenCalled();
  });

  it('should call inicializarFormulario and disable the form if esFormularioSoloLectura is true', () => {
    component.esFormularioSoloLectura = true;
    component.guardarDatosFormulario();
    expect(component.inicializarFormulario).toHaveBeenCalled();
    expect(component.solicitudForm.enable).not.toHaveBeenCalled();
  });

  it('should call inicializarFormulario and enable the form if esFormularioSoloLectura is false', () => {
    component.esFormularioSoloLectura = false;
    component.guardarDatosFormulario();
    expect(component.inicializarFormulario).toHaveBeenCalled();
    expect(component.solicitudForm.disable).not.toHaveBeenCalled();
  });

  it('should call inicializarFormulario and not enable/disable if esFormularioSoloLectura is neither true nor false', () => {
    component.guardarDatosFormulario();
    expect(component.inicializarFormulario).toHaveBeenCalled();
    expect(component.solicitudForm.enable).not.toHaveBeenCalled();
    expect(component.solicitudForm.disable).not.toHaveBeenCalled();
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const destroyNotifierSpy = jest.spyOn(
      component['destroyNotifier$'],
      'complete'
    );
    component.ngOnDestroy();
    expect(destroyNotifierSpy).toHaveBeenCalled();
  });
});
