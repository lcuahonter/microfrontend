import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { MovilizacionComponent } from './movilizacion.component';
import {
  Solicitud221603State,
  Tramite221603Store,
} from '../../estados/tramite221603.store';
import { Tramite221603Query } from '../../estados/tramite221603.query';
import { SanidadService } from '../../service/sanidad.service';
import {
  AlertComponent,
  CatalogoSelectComponent,
  ConsultaioQuery,
  TituloComponent,
} from '@libs/shared/data-access-user/src';

const mockSolicitudState: Solicitud221603State = {
  justificacion: '',
  aduana: '',
  oficina: '',
  punto: '',
  guia: '',
  regimen: '',
  carro: '',
  medio: 'Terrestre',
  transporte: 'Camión',
  verificacion: 'Alta',
  empresa: 'GRUPO OPERADOR MULTIMODAL, SA DE CV',
  clave: '',
  dependencia: '',
  banco: '',
  llave: '',
  fecha: '',
  importe: '',
  exento: '',
};

const mockFormularioDatos = {
  transporte: 'Barco',
  empresa: 'NEW COMPANY',
};

describe('MovilizacionComponent', () => {
  let component: MovilizacionComponent;
  let fixture: ComponentFixture<MovilizacionComponent>;
  let tramite221603Store: Tramite221603Store;
  let tramite221603Query: Tramite221603Query;
  let sanidadService: SanidadService;

  const tramite221603StoreMock = {
    setMedio: jest.fn(),
    setTransporte: jest.fn(),
    setVerificacion: jest.fn(),
    setEmpresa: jest.fn(),
  };

  const tramite221603QueryMock = {
    selectSolicitud$: of(mockSolicitudState),
  };

  const sanidadServiceMock = {
    inicializaMovilizacionDatosCatalogos: jest.fn(),
    obtenerFormularioDatos: jest.fn().mockReturnValue(of(mockFormularioDatos)),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MovilizacionComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        TituloComponent,
        AlertComponent,
        CatalogoSelectComponent,
      ],
      providers: [
        FormBuilder,
        { provide: Tramite221603Store, useValue: tramite221603StoreMock },
        { provide: Tramite221603Query, useValue: tramite221603QueryMock },
        { provide: SanidadService, useValue: sanidadServiceMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MovilizacionComponent);
    component = fixture.componentInstance;
    tramite221603Store = TestBed.inject(Tramite221603Store);
    tramite221603Query = TestBed.inject(Tramite221603Query);
    sanidadService = TestBed.inject(SanidadService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with values from solicitudState and formularioDatos', () => {
    component.ngOnInit();

    expect(component.medioForm.controls['medio'].value).toBe('Terrestre');
    expect(component.medioForm.controls['transporte'].value).toBe('Barco');
    expect(component.medioForm.controls['verificacion'].value).toBe('Alta');
    expect(component.medioForm.controls['empresa'].value).toBe('NEW COMPANY');
  });

  it('should call the store method setMedio when updating the form', () => {
    component.medioForm.controls['medio'].setValue('Marítimo');
    component.setValoresStore('medio', 'setMedio');
    expect(tramite221603Store.setMedio).toHaveBeenCalledWith('Marítimo');
  });

  it('should call the store method setTransporte when updating the form', () => {
    component.medioForm.controls['transporte'].setValue('Avión');
    component.setValoresStore('transporte', 'setTransporte');
    expect(tramite221603Store.setTransporte).toHaveBeenCalledWith('Avión');
  });

  it('should call the store method setVerificacion when updating the form', () => {
    component.medioForm.controls['verificacion'].setValue('Baja');
    component.setValoresStore('verificacion', 'setVerificacion');
    expect(tramite221603Store.setVerificacion).toHaveBeenCalledWith('Baja');
  });

  it('should call the store method setEmpresa when updating the form', () => {
    component.medioForm.controls['empresa'].setValue('NEW COMPANY 2');
    component.setValoresStore('empresa', 'setEmpresa');
    expect(tramite221603Store.setEmpresa).toHaveBeenCalledWith('NEW COMPANY 2');
  });

  it('should call ngOnDestroy and clean up resources', () => {
    const destroyNotifierSpy = jest.spyOn(
      component['destroyNotifier$'],
      'next'
    );
    const destroyNotifierCompleteSpy = jest.spyOn(
      component['destroyNotifier$'],
      'complete'
    );
    component.ngOnDestroy();
    expect(destroyNotifierSpy).toHaveBeenCalled();
    expect(destroyNotifierCompleteSpy).toHaveBeenCalled();
  });

  it('should call sanidadService methods on ngOnInit', () => {
    component.ngOnInit();
    expect(
      sanidadService.inicializaMovilizacionDatosCatalogos
    ).toHaveBeenCalled();
    expect(sanidadService.obtenerFormularioDatos).toHaveBeenCalled();
  });

  it('should set esFormularioSoloLectura and call inicializarEstadoFormulario when consultaQuery emits', () => {
    const consultaQuery = TestBed.inject(ConsultaioQuery);
    const inicializarEstadoFormularioSpy = jest.spyOn(
      component,
      'inicializarEstadoFormulario'
    );
    // Simulate observable emission
    (consultaQuery.selectConsultaioState$ as any).next({ readonly: true });
    expect(component.esFormularioSoloLectura).toBe(true);
    expect(inicializarEstadoFormularioSpy).toHaveBeenCalled();
  });

  it('should disable empresa and transporte when esFormularioSoloLectura is true', () => {
    component.medioForm = component['formBuilder'].group({
      empresa: ['test'],
      transporte: ['test'],
    });
    component.esFormularioSoloLectura = true;
    component.inicializarEstadoFormulario();
    expect(component.medioForm.get('empresa')?.disabled).toBe(true);
    expect(component.medioForm.get('transporte')?.disabled).toBe(true);
  });

  it('should enable empresa and transporte when esFormularioSoloLectura is false', () => {
    component.medioForm = component['formBuilder'].group({
      empresa: ['test'],
      transporte: ['test'],
    });
    component.esFormularioSoloLectura = false;
    component.inicializarEstadoFormulario();
    expect(component.medioForm.get('empresa')?.enabled).toBe(true);
    expect(component.medioForm.get('transporte')?.enabled).toBe(true);
  });

  it('should set transporte and empresa from formularioDatos if not present in solicitudState', () => {
    component.solicitudState = {
      ...mockSolicitudState,
      transporte: '',
      empresa: '',
    };
    component.formularioDatos = {
      transporte: 'Barco',
      empresa: 'NEW COMPANY',
    } as any;
    component.medioForm = component['formBuilder'].group({
      transporte: [''],
      empresa: [''],
    });
    component.rellenarValoresPredeterminados();
    expect(component.medioForm.get('transporte')?.value).toBe('Barco');
    expect(component.medioForm.get('empresa')?.value).toBe('NEW COMPANY');
  });
});
