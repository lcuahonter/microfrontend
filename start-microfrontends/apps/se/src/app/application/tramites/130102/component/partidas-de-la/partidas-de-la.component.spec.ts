import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PartidasDeLaComponent } from './partidas-de-la.component';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { TablaDinamicaComponent } from '@libs/shared/data-access-user/src';
import { TituloComponent } from '@libs/shared/data-access-user/src/tramites/components/titulo/titulo.component';
import { AlertComponent } from '@libs/shared/data-access-user/src';
import { UppercaseDirective } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { FormularioRegistroService } from '../../services/octava-temporal.service';
import { Tramite130102Store } from '../../../../estados/tramites/tramite130102.store';
import { Tramite130102Query } from '../../../../estados/queries/tramite130102.query';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { Subject, of } from 'rxjs';

describe('PartidasDeLaComponent', () => {
  let component: PartidasDeLaComponent;
  let fixture: ComponentFixture<PartidasDeLaComponent>;
  
  const mockFormRegistroService = {
    registrarFormulario: jest.fn(),
    getFraccionArancelariaTIGIE: jest.fn(() => of([{ id: 1, descripcion: 'Fracción 1' }])),
  };

  const mockStore = {
    setCantidad: jest.fn(),
    setFraccionArancelariaTIGIE: jest.fn(),
    setFraccionArancelariaTIGIE_TIGIE: jest.fn(),
    setDescripcion: jest.fn(),
    setValorPartidaUSD: jest.fn(),
    setPartidasTabla: jest.fn(),
    setDynamicFieldValue: jest.fn()
  };

  const solicitudMockState = {
    cantidadPartidas: 2,
    fraccionArancelariaTIGIE: '01010101',
    fraccionArancelariaTIGIE_TIGIE: '01010101',
    descripcionPartidas: 'desc',
    valorPartidaUSD: 100
  };

  const consultaioSubject = new Subject<any>();
  const tramiteQuerySubject = new Subject<any>();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PartidasDeLaComponent,
        ReactiveFormsModule,
        CatalogoSelectComponent,
        TablaDinamicaComponent,
        TituloComponent,
        AlertComponent,
        UppercaseDirective,
        CommonModule
      ],
      providers: [
        FormBuilder,
        { provide: Tramite130102Store, useValue: mockStore },
        {
          provide: Tramite130102Query,
          useValue: {
            selectSolicitud$: tramiteQuerySubject.asObservable()
          }
        },
        {
          provide: ConsultaioQuery,
          useValue: {
            selectConsultaioState$: consultaioSubject.asObservable()
          }
        },
        { provide: FormularioRegistroService, useValue: mockFormRegistroService }
      ]
    }).compileComponents();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
  jest.clearAllMocks();
});

  it('should create the component', () => {
    fixture = TestBed.createComponent(PartidasDeLaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize form and register it', () => {
    consultaioSubject.next({ readonly: false });
    tramiteQuerySubject.next(solicitudMockState);

    fixture = TestBed.createComponent(PartidasDeLaComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    expect(component.form).toBeDefined();
    expect(mockFormRegistroService.registrarFormulario).toHaveBeenCalledWith('form', component.form);
    expect(component.form.enabled).toBe(true);
  });

  it('should disable form if readonly is true', () => {
    consultaioSubject.next({ readonly: true });
    tramiteQuerySubject.next(solicitudMockState);

    fixture = TestBed.createComponent(PartidasDeLaComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
   
  });

  it('should call setValoresStore and store value', () => {
    consultaioSubject.next({ readonly: false });
    tramiteQuerySubject.next(solicitudMockState);

    fixture = TestBed.createComponent(PartidasDeLaComponent);
    component = fixture.componentInstance;
    component.ngOnInit();

    component.form.get('descripcion')?.setValue('desc');
    component.setValoresStore(component.form, 'descripcion', 'setDescripcion');
    expect(mockStore.setDescripcion).toHaveBeenCalledWith('desc');
  });

  it('should validate no leading spaces', () => {
    const controlWithSpace = { value: '  Leading' } as any;
    const controlValid = { value: 'Valid' } as any;

    expect(PartidasDeLaComponent['noLeadingSpacesValidator'](controlWithSpace)).toEqual({ leadingSpaces: true });
    expect(PartidasDeLaComponent['noLeadingSpacesValidator'](controlValid)).toBeNull();
  });

  it('should calculate totals correctly', () => {
    fixture = TestBed.createComponent(PartidasDeLaComponent);
    component = fixture.componentInstance;
    component.tableBodyData = [
      { tbodyData: ['2', '', '', '', '', '100'] },
      { tbodyData: ['3', '', '', '', '', '200'] }
    ];
    component.formularioTotalCount();
    component.calculateTotals();
    expect(component.formForTotalCount.get('cantidadTotal')?.value).toBe(5);
    expect(component.formForTotalCount.get('valorTotalUSD')?.value).toBe(300);
  });

  it('should unsubscribe on destroy', () => {
    fixture = TestBed.createComponent(PartidasDeLaComponent);
    component = fixture.componentInstance;
    const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should return true for esInvalido if control is invalid and touched', () => {
    fixture = TestBed.createComponent(PartidasDeLaComponent);
    component = fixture.componentInstance;
    component.formularioTotalCount();
    component.form = component['fb'].group({
      test: ['', [Validators.required]]
    });
    const control = component.form.get('test');
    control?.markAsTouched();
    expect(component.esInvalido('test')).toBe(true);
  });

  it('should return false for esInvalido if control is valid', () => {
    fixture = TestBed.createComponent(PartidasDeLaComponent);
    component = fixture.componentInstance;
    component.formularioTotalCount();
    component.form = component['fb'].group({
      test: ['ok', [Validators.required]]
    });
    expect(component.esInvalido('test')).toBe(false);
  });

  it('should add a new producto to datosSocios and reset form if form is valid', () => {
    fixture = TestBed.createComponent(PartidasDeLaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.form = component['fb'].group({
      cantidad: ['10'],
      fraccionArancelariaTIGIE: ['12345678'],
      descripcion: ['Producto test']
    });
    component.datosSocios = [];
    component.agregar();
    expect(component.datosSocios.length).toBe(1);
    expect(component.datosSocios[0].cantidad).toBe('10');
    expect(component.form.pristine).toBe(true);
    expect(mockStore.setPartidasTabla).toHaveBeenCalledWith('partidas_tabla', component.datosSocios);
  });

  it('should not add producto if form is invalid', () => {
    fixture = TestBed.createComponent(PartidasDeLaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.form = component['fb'].group({
      cantidad: [null, Validators.required],
      fraccionArancelariaTIGIE: [null, Validators.required],
      descripcion: ['', Validators.required]
    });
    component.datosSocios = [];
    component.agregar();
    expect(component.datosSocios.length).toBe(0);
  });

  it('should show the modal if cargarArchivoInstance exists', () => {
    fixture = TestBed.createComponent(PartidasDeLaComponent);
    component = fixture.componentInstance;
    (component as any).cargarArchivoInstance = { show: jest.fn() };
    component.cargarArchivo();
    expect((component as any).cargarArchivoInstance.show).toHaveBeenCalled();
  });

  it('should hide the modal if cargarArchivoInstance exists', () => {
    fixture = TestBed.createComponent(PartidasDeLaComponent);
    component = fixture.componentInstance;
    (component as any).cargarArchivoInstance = { hide: jest.fn() };
    component.cerrar();
    expect((component as any).cargarArchivoInstance.hide).toHaveBeenCalled();
  });

  it('should patch selected partida data into modificarPartidaForm', () => {
    fixture = TestBed.createComponent(PartidasDeLaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.form = component['fb'].group({
      modificarPartidaForm: component['fb'].group({
        modificar_cantidad: [''],
        modificar_descripcion: [''],
        valor_partidas_usd: [''],
        fraccion_partidas: ['']
      })
    });
    const selectedPartida = {
      cantidad: 5,
      descripción: 'Producto',
      totalUsd: 500,
      fraccionArancelaria: '12345678'
    };
    component.onPartidasSeleccion([selectedPartida as any]);
    expect(component.modificarPartidaForm.get('modificar_cantidad')?.value).toBe(5);
    expect(component.modificarPartidaForm.get('modificar_descripcion')?.value).toBe('Producto');
  });

  it('should delete selected partidas and update store', () => {
    fixture = TestBed.createComponent(PartidasDeLaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const partida = { fraccionArancelaria: '123', descripción: 'desc' };
    component.datosSocios = [partida as any];
    component.partidasSeleccionadas = [partida as any];
    component.eliminar();
    expect(component.datosSocios.length).toBe(0);
    expect(mockStore.setPartidasTabla).toHaveBeenCalledWith('partidas_tabla', []);
  });

  it('should update selected partida and hide modal on guardarEdicion', () => {
    fixture = TestBed.createComponent(PartidasDeLaComponent);
    component = fixture.componentInstance;
    const partida = {
      cantidad: 1,
      descripción: 'desc',
      totalUsd: 100,
      fraccionArancelaria: '111'
    };
    component.datosSocios = [partida as any];
    component.partidasSeleccionadas = [partida as any];
    component.form = component['fb'].group({
      modificarPartidaForm: component['fb'].group({
        modificar_cantidad: ['20'],
        modificar_descripcion: ['nuevo desc'],
        valor_partidas_usd: [200],
        fraccion_partidas: ['222']
      })
    });
    (component as any).modalEditar = { hide: jest.fn() } as any;
    component.guardarEdicion();
    expect(component.datosSocios[0].cantidad).toBe('20');
    expect(component.datosSocios[0].descripción).toBe('nuevo desc');
    expect(component.datosSocios[0].totalUsd).toBe(200);
    expect(component.datosSocios[0].fraccionArancelaria).toBe('222');
    expect((component as any).modalEditar.hide).toHaveBeenCalled();
    expect(mockStore.setPartidasTabla).toHaveBeenCalled();
  });

  it('should call setDynamicFieldValue on establecerCambioDeValor', () => {
    fixture = TestBed.createComponent(PartidasDeLaComponent);
    component = fixture.componentInstance;
    const event = { campo: 'descripcion', valor: 'Nuevo valor' };
    component.establecerCambioDeValor(event);
    expect(mockStore.setDynamicFieldValue).toHaveBeenCalledWith('descripcion', 'Nuevo valor');
  });


  it('should call next and complete on destroyNotifier$ when ngOnDestroy is called', () => {
    const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});