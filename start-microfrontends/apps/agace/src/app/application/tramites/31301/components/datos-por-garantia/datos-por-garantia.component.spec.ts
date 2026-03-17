import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosPorGarantiaComponent } from './datos-por-garantia.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SolicitudService } from '../../services/solicitud.service';
import { Solicitud31301Store } from '../../estados/solicitud31301.store';
import { Solicitud31301Query } from '../../estados/solicitud31301.query';
import { of, Subject } from 'rxjs';
import { DatosPorGarantia } from '../../models/solicitud.model';
import {
  Catalogo,
  CatalogoSelectComponent,
  CatalogosSelect,
  InputFechaComponent,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DatosPorGarantiaComponent', () => {
  let component: DatosPorGarantiaComponent;
  let fixture: ComponentFixture<DatosPorGarantiaComponent>;
  let solicitudServiceMock: any;
  let solicitud31301StoreMock: any;
  let solicitud31301QueryMock: any;

  beforeEach(async () => {
    solicitudServiceMock = {
      conseguirNombreInstitucionCatalogo: jest.fn(() =>
        of({
          labelNombre: 'Datos de la póliza de fianza actual',
          required: false,
          primerOpcion: 'Seleccione un valor',
          catalogos: [
            {
              id: 1,
              descripcion: 'DORAMA, INSTITUCION DE GARANTIAS SA',
            },
            {
              id: 2,
              descripcion: 'DORAMA, INSTITUCION DE GARANTIAS SA - 1',
            },
          ],
        })
      ),
      conseguirDatosPorGarantia: jest.fn(() =>
        of({
          polizaDeFianzaActual: 1,
          numeroFolio: '645456546',
          rfcInstitucion: 'FDO9411098R8',
          fechaExpedicion: '30/09/2024',
          fechaInicioVigenciaNo: '30/09/2024',
          fechaFinVigenciaNo: '30/09/2024',
          fechaInicioVigencia: '30/09/2024',
          fechaFinVigencia: '30/09/2024',
          importeTotal: '3213',
        })
      ),
    };

    solicitud31301StoreMock = {
      actualizarpolizaDeFianza: jest.fn(()=>of()),
      actualizarPolizaDeFianzaActual: jest.fn(()=>of()),
      actualizarNumeroFolio: jest.fn(()=>of()),
      actualizarRfcInstitucion: jest.fn(()=>of()),
      actualizarFechaExpedicion: jest.fn(()=>of()),
      actualizarFechaInicioVigenciaNo: jest.fn(()=>of()),
      actualizarFechaFinVigenciaNo: jest.fn(()=>of()),
      actualizarFechaInicioVigencia: jest.fn(()=>of()),
      actualizarFechaFinVigencia: jest.fn(()=>of()),
      actualizarImporteTotal: jest.fn(()=>of()),
    };

    solicitud31301QueryMock = {
      selectSolicitud$: of({
        polizaDeFianzaActual: 1,
        numeroFolio: '12345',
        rfcInstitucion: 'RFC123',
        fechaExpedicion: '01/01/2023',
        fechaInicioVigenciaNo: '01/02/2023',
        fechaFinVigenciaNo: '01/03/2023',
        fechaInicioVigencia: '01/04/2023',
        fechaFinVigencia: '01/05/2023',
        importeTotal: '1000',
      }),
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        DatosPorGarantiaComponent,
        CommonModule,
        TituloComponent,
        CatalogoSelectComponent,
        InputFechaComponent,
        HttpClientTestingModule,
      ],
      declarations: [],
      providers: [
        FormBuilder,
        { provide: SolicitudService, useValue: solicitudServiceMock },
        { provide: Solicitud31301Store, useValue: solicitud31301StoreMock },
        { provide: Solicitud31301Query, useValue: solicitud31301QueryMock },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(DatosPorGarantiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit', () => {
    component.ngOnInit();
    expect(component.polizaDeFianzaForm).toBeDefined();
    expect(component.polizaDeFianzaForm.controls['numeroFolio']).toBeDefined();
  });

  it('should call conseguirNombreInstitucionCatalogo on initialization', () => {
    const spy = jest.spyOn(component, 'conseguirNombreInstitucionCatalogo');
    component.conseguirNombreInstitucionCatalogo();
    expect(spy).toHaveBeenCalled();
  });

  it('should call conseguirDatosPorGarantia on initialization', () => {
    const spy = jest.spyOn(component, 'conseguirDatosPorGarantia');
    component.conseguirDatosPorGarantia();
    expect(spy).toHaveBeenCalled();
  });

  it('should call actualizarPolizaDeFianzaActual when seleccionaNombreInstitucion is triggered', () => {
    const mockCatalogo = { id: 1, descripcion: 'test' } as Catalogo;
    component.seleccionaNombreInstitucion(mockCatalogo);
  });

  it('should set nombreInstitucionCatalogo after conseguirNombreInstitucionCatalogo is called', () => {
    component.nombreInstitucionCatalogo = {
      labelNombre: 'Datos de la póliza de fianza actual',
      required: false,
      primerOpcion: 'Seleccione un valor',
      catalogos: [
        { id: 1, descripcion: 'DORAMA, INSTITUCION DE GARANTIAS SA' },
        { id: 2, descripcion: 'DORAMA, INSTITUCION DE GARANTIAS SA - 1' },
      ],
    } as any;
    component.conseguirNombreInstitucionCatalogo();
    expect(component.nombreInstitucionCatalogo).toEqual({
      labelNombre: 'Datos de la póliza de fianza actual',
      required: false,
      primerOpcion: 'Seleccione un valor',
      catalogos: [
        { id: 1, descripcion: 'DORAMA, INSTITUCION DE GARANTIAS SA' },
        { id: 2, descripcion: 'DORAMA, INSTITUCION DE GARANTIAS SA - 1' },
      ],
    });
  });

  it('should disable the form if esFormularioSoloLectura is true in guardarDatosFormulario', () => {
    component.inicializarFormulario = jest.fn();
    component.polizaDeFianzaForm = new FormBuilder().group({ test: [''] });
    const disableSpy = jest.spyOn(component.polizaDeFianzaForm, 'disable');
    component.esFormularioSoloLectura = true;
    component.guardarDatosFormulario();
    expect(disableSpy).toHaveBeenCalled();
  });

  it('should enable the form if esFormularioSoloLectura is false in guardarDatosFormulario', () => {
    component.inicializarFormulario = jest.fn();
    component.polizaDeFianzaForm = new FormBuilder().group({ test: [''] });
    const enableSpy = jest.spyOn(component.polizaDeFianzaForm, 'enable');
    component.esFormularioSoloLectura = false;
    component.guardarDatosFormulario();
    expect(enableSpy).toHaveBeenCalled();
  });

 it('should complete destroy$ on ngOnDestroy', () => {
    const destroySpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
