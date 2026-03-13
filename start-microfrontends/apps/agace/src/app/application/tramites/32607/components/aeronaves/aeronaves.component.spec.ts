import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AeronavesComponent } from './aeronaves.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { SolicitudService } from '../../services/solicitud.service';
import { Solicitud32607Store } from '../../estados/solicitud32607.store';
import { Solicitud32607Query } from '../../estados/solicitud32607.query';
import {
  ConsultaioQuery,
  InputFechaComponent,
  InputRadioComponent,
  TablaDinamicaComponent,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgregarTransportistasComponent } from '../agregar-transportistas/agregar-transportistas.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AeronavesComponent', () => {
  let component: AeronavesComponent;
  let fixture: ComponentFixture<AeronavesComponent>;
  let solicitudServiceMock: any;
  let solicitud32607StoreMock: any;
  let solicitud32607QueryMock: any;
  let consultaioQueryMock: any;

  beforeEach(async () => {
    solicitudServiceMock = {
      conseguirOpcionDeRadio: jest.fn().mockReturnValue(
        of({
          requisitos: { label: 'Sí/No' },
          reconocimientoMutuo: { label: 'Mutuo' },
          clasificacionInformacion: { label: 'Clasificación' },
        })
      ),
      conseguirTransportistasLista: jest
        .fn()
        .mockReturnValue(of([{ id: 1, nombre: 'Transportista 1' }])),
    };

    solicitud32607StoreMock = {
      actualizar2042: jest.fn(),
      actualizar2043: jest.fn(),
      actualizar2044: jest.fn(),
      actualizarFechaInicioComercio: jest.fn(),
      actualizarFechaPago: jest.fn(),
      actualizarMonto: jest.fn(),
      actualizarOperacionesBancarias: jest.fn(),
      actualizarLlavePago: jest.fn(),
      actualizar301: jest.fn(),
      actualizarNumeroIMMEX: jest.fn(),
      actualizarModalidadIMMEX: jest.fn(),
      actualizar302: jest.fn(),
      actualizarRubroCertificacion: jest.fn(),
      actualizarFechaFinVigenciaRubro: jest.fn(),
      actualizarNumeroOficio: jest.fn(),
      actualizar306: jest.fn(),
      actualizar307: jest.fn(),
      actualizar308: jest.fn(),
    };

    solicitud32607QueryMock = {
      selectSolicitud$: of({
        2042: 'A',
        2043: 'B',
        2044: 'C',
        301: 'D',
        302: 'E',
        306: 'F',
        307: 'G',
        308: 'H',
        numeroIMMEX: 'IMMEX',
        modalidadIMMEX: 'MOD',
        rubroCertificacion: 'RC',
        fechaFinVigenciaRubro: '2024-01-01',
        numeroOficio: 'OF123',
        fechaInicioComercio: '2024-01-02',
        fechaPago: '2024-01-03',
        monto: '1000',
        operacionesBancarias: 'OPB',
        llavePago: 'LLAVE',
      }),
    };

    consultaioQueryMock = {
      selectConsultaioState$: of({ readonly: false }),
    };

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        InputRadioComponent,
        InputFechaComponent,
        TituloComponent,
        TablaDinamicaComponent,
        AgregarTransportistasComponent,
        AeronavesComponent,
        HttpClientTestingModule,
      ],
      declarations: [],
      providers: [
        FormBuilder,
        { provide: SolicitudService, useValue: solicitudServiceMock },
        { provide: Solicitud32607Store, useValue: solicitud32607StoreMock },
        { provide: Solicitud32607Query, useValue: solicitud32607QueryMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AeronavesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize transportistasLista from service', () => {
    expect(component.transportistasLista.length).toBe(0);
  });

  it('should call actualizar2042 and set validaComercioExterior', () => {
    component.actualizar2042('nuevo');
    expect(solicitud32607StoreMock.actualizar2042).toHaveBeenCalledWith(
      'nuevo'
    );
    expect(component.validaComercioExterior).toBe('nuevo');
  });

  it('should call actualizar2043', () => {
    component.actualizar2043('valor');
    expect(solicitud32607StoreMock.actualizar2043).toHaveBeenCalledWith(
      'valor'
    );
  });

  it('should call actualizar2044', () => {
    component.actualizar2044('valor');
    expect(solicitud32607StoreMock.actualizar2044).toHaveBeenCalledWith(
      'valor'
    );
  });

  it('should call actualizarFechaInicioComercio', () => {
    component.actualizarFechaInicioComercio('2024-01-01');
    expect(
      solicitud32607StoreMock.actualizarFechaInicioComercio
    ).toHaveBeenCalledWith('2024-01-01');
  });

  it('should call actualizarFechaPago', () => {
    component.actualizarFechaPago('2024-01-01');
    expect(solicitud32607StoreMock.actualizarFechaPago).toHaveBeenCalledWith(
      '2024-01-01'
    );
  });

  it('should call actualizarMonto', () => {
    component.actualizarMonto('500');
    expect(solicitud32607StoreMock.actualizarMonto).toHaveBeenCalledWith('500');
  });

  it('should call actualizarOperacionesBancarias', () => {
    component.actualizarOperacionesBancarias('opb');
    expect(
      solicitud32607StoreMock.actualizarOperacionesBancarias
    ).toHaveBeenCalledWith('opb');
  });

  it('should call actualizarLlavePago', () => {
    component.actualizarLlavePago('llave');
    expect(solicitud32607StoreMock.actualizarLlavePago).toHaveBeenCalledWith(
      'llave'
    );
  });

  it('should add transportista to transportistasLista', () => {
    const transportista = { id: 2, nombre: 'Transportista 2' };
    component.transportistasDatos(transportista as any);
  });

  it('should call actualizar301', () => {
    component.actualizar301('301');
    expect(solicitud32607StoreMock.actualizar301).toHaveBeenCalledWith('301');
  });

  it('should call actualizarNumeroIMMEX', () => {
    const event = { target: { value: 'IMMEX123' } } as any;
    component.actualizarNumeroIMMEX(event);
    expect(solicitud32607StoreMock.actualizarNumeroIMMEX).toHaveBeenCalledWith(
      'IMMEX123'
    );
  });

  it('should call actualizarModalidadIMMEX', () => {
    const event = { target: { value: 'MOD123' } } as any;
    component.actualizarModalidadIMMEX(event);
    expect(
      solicitud32607StoreMock.actualizarModalidadIMMEX
    ).toHaveBeenCalledWith('MOD123');
  });

  it('should call actualizar302', () => {
    component.actualizar302('302');
    expect(solicitud32607StoreMock.actualizar302).toHaveBeenCalledWith('302');
  });

  it('should call actualizarRubroCertificacion', () => {
    const event = { target: { value: 'RC' } } as any;
    component.actualizarRubroCertificacion(event);
    expect(
      solicitud32607StoreMock.actualizarRubroCertificacion
    ).toHaveBeenCalledWith('RC');
  });

  it('should call actualizarFechaFinVigenciaRubro', () => {
    const event = { target: { value: '2024-01-01' } } as any;
    component.actualizarFechaFinVigenciaRubro(event);
    expect(
      solicitud32607StoreMock.actualizarFechaFinVigenciaRubro
    ).toHaveBeenCalledWith('2024-01-01');
  });

  it('should call actualizarNumeroOficio', () => {
    const event = { target: { value: 'OF123' } } as any;
    component.actualizarNumeroOficio(event);
    expect(solicitud32607StoreMock.actualizarNumeroOficio).toHaveBeenCalledWith(
      'OF123'
    );
  });

  it('should call actualizar306', () => {
    component.actualizar306('306');
    expect(solicitud32607StoreMock.actualizar306).toHaveBeenCalledWith('306');
  });

  it('should call actualizar307', () => {
    component.actualizar307('307');
    expect(solicitud32607StoreMock.actualizar307).toHaveBeenCalledWith('307');
  });

  it('should call actualizar308', () => {
    component.actualizar308('308');
    expect(solicitud32607StoreMock.actualizar308).toHaveBeenCalledWith('308');
  });

  it('should disable form if esFormularioSoloLectura is true', () => {
    component.esFormularioSoloLectura = true;
    component.guardarDatosFormulario();
    expect(component.aeronavesForm.disabled).toBe(true);
  });

  it('should enable form if esFormularioSoloLectura is false', () => {
    component.esFormularioSoloLectura = false;
    component.guardarDatosFormulario();
    expect(component.aeronavesForm.enabled).toBe(true);
  });

  it('should clean up destroy$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn((component as any).destroy$, 'next');
    const completeSpy = jest.spyOn((component as any).destroy$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
