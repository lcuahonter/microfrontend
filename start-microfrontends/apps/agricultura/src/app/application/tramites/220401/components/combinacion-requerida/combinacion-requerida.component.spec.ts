import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CombinacionRequeridaComponent } from './combinacion-requerida.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Agregar220401Store } from '../../../../estados/tramites/agregar220401.store';
import { AgregarQuery } from '../../../../estados/queries/agregar.query';
import { Pantallas220401Service } from '../pantallas220401.service';
import { ValidacionesFormularioService, ConsultaioQuery } from '@ng-mf/data-access-user';
import { of, Subject } from 'rxjs';

describe('CombinacionRequeridaComponent', () => {
  let component: CombinacionRequeridaComponent;
  let fixture: ComponentFixture<CombinacionRequeridaComponent>;
  let agregar220401StoreMock: any;
  let agregarQueryMock: any;
  let pantallas220401ServiceMock: any;
  let validacionesServiceMock: any;
  let consultaioQueryMock: any;

  beforeEach(async () => {
    agregar220401StoreMock = {
      setespecie: jest.fn(),
      setFuncionZootecnica: jest.fn(),
      setMercancia: jest.fn(),
      setPaisDestino: jest.fn(),
      setNombreEstablecimiento: jest.fn(),
      setTipoActividad: jest.fn(),
      setAduanaSalida: jest.fn(),
      setOisaSalida: jest.fn(),
      setRegimenMercancia: jest.fn(),
      setPaisOrigen: jest.fn(),
    };

    agregarQueryMock = {
      selectSolicitud$: of({
        especie: ['esp1'],
        funcionZootecnica: ['fz1'],
        mercancia: ['merc1'],
        paisDestino: ['pais1'],
        nombreEstablecimiento: ['est1'],
        tipoActividad: ['act1'],
        otro: 'otro',
        aduanaSalida: ['adu1'],
        oisaSalida: ['oisa1'],
        regimenMercancia: ['reg1'],
        paisOrigen: ['po1'],
        puntoIngreso: 'punto',
        nombreEstablecimientoCheck: true,
        numeroAutorizacionCheck: false,
        tipoActividadCheck: true,
        otroCheck: false,
        fechaArribo: '2024-01-01'
      }),
    };

    pantallas220401ServiceMock = {
      getEspecieData: jest.fn().mockReturnValue(of([{ id: 1, nombre: 'esp1' }])),
      getFuncionZootecnica: jest.fn().mockReturnValue(of([{ id: 2, nombre: 'fz1' }])),
      getMercancia: jest.fn().mockReturnValue(of([{ id: 3, nombre: 'merc1' }])),
      getlaodPaisDestino: jest.fn().mockReturnValue(of([{ id: 4, nombre: 'pais1' }])),
      getNombreEstablecimiento: jest.fn().mockReturnValue(of([{ id: 5, nombre: 'est1' }])),
      getTipoActividad: jest.fn().mockReturnValue(of([{ id: 6, nombre: 'act1' }])),
      getAduanaSalida: jest.fn().mockReturnValue(of([{ id: 7, nombre: 'adu1' }])),
      getOisaSalida: jest.fn().mockReturnValue(of([{ id: 8, nombre: 'oisa1' }])),
      getRegimenMercancia: jest.fn().mockReturnValue(of([{ id: 9, nombre: 'reg1' }])),
      getPaisOrigen: jest.fn().mockReturnValue(of([{ id: 10, nombre: 'po1' }])),
    };

    validacionesServiceMock = {
      isValid: jest.fn().mockReturnValue(true),
    };

    consultaioQueryMock = {
      selectConsultaioState$: of({ readonly: false }),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule,CombinacionRequeridaComponent],
      declarations: [],
      providers: [
        FormBuilder,
        { provide: ValidacionesFormularioService, useValue: validacionesServiceMock },
        { provide: Agregar220401Store, useValue: agregar220401StoreMock },
        { provide: AgregarQuery, useValue: agregarQueryMock },
        { provide: Pantallas220401Service, useValue: pantallas220401ServiceMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CombinacionRequeridaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario y cargar los catálogos al llamar inicializarFormulario', () => {
    const spyEspecie = jest.spyOn(pantallas220401ServiceMock, 'getEspecieData');
    const spyFuncion = jest.spyOn(pantallas220401ServiceMock, 'getFuncionZootecnica');
    const spyMercancia = jest.spyOn(pantallas220401ServiceMock, 'getMercancia');
    const spyPaisDestino = jest.spyOn(pantallas220401ServiceMock, 'getlaodPaisDestino');
    const spyEstablecimiento = jest.spyOn(pantallas220401ServiceMock, 'getNombreEstablecimiento');
    const spyTipoActividad = jest.spyOn(pantallas220401ServiceMock, 'getTipoActividad');
    const spyAduana = jest.spyOn(pantallas220401ServiceMock, 'getAduanaSalida');
    const spyOisa = jest.spyOn(pantallas220401ServiceMock, 'getOisaSalida');
    const spyRegimen = jest.spyOn(pantallas220401ServiceMock, 'getRegimenMercancia');
    const spyPaisOrigen = jest.spyOn(pantallas220401ServiceMock, 'getPaisOrigen');

    component.inicializarFormulario();

    expect(spyEspecie).toHaveBeenCalled();
    expect(spyFuncion).toHaveBeenCalled();
    expect(spyMercancia).toHaveBeenCalled();
    expect(spyPaisDestino).toHaveBeenCalled();
    expect(spyEstablecimiento).toHaveBeenCalled();
    expect(spyTipoActividad).toHaveBeenCalled();
    expect(spyAduana).toHaveBeenCalled();
    expect(spyOisa).toHaveBeenCalled();
    expect(spyRegimen).toHaveBeenCalled();
    expect(spyPaisOrigen).toHaveBeenCalled();
    expect(component.formCombinacion).toBeDefined();
  });

  it('debe deshabilitar el formulario si es solo lectura en guardarDatosFormulario', () => {
    component.esFormularioSoloLectura = true;
    component.inicializarFormulario();
    component.guardarDatosFormulario();
    expect(component.formCombinacion.disabled).toBe(true);
  });

  it('debe habilitar el formulario si no es solo lectura en guardarDatosFormulario', () => {
    component.esFormularioSoloLectura = false;
    component.inicializarFormulario();
    component.guardarDatosFormulario();
    expect(component.formCombinacion.enabled).toBe(true);
  });

  it('debe llamar al método del store correspondiente en setValoresStore', () => {
    component.inicializarFormulario();
    component.formCombinacion.get('especie')?.setValue('valorTest');
    component.setValoresStore(component.formCombinacion, 'especie', 'setespecie');
    expect(agregar220401StoreMock.setespecie).toHaveBeenCalledWith('valorTest');
  });

  it('debe retornar true en isValid si el campo es válido', () => {
    component.inicializarFormulario();
    expect(component.isValid('especie')).toBe(true);
    expect(validacionesServiceMock.isValid).toHaveBeenCalledWith(component.formCombinacion, 'especie');
  });

  it('debe cargar los catálogos correctamente', () => {
    component.loaddatEspecieData();
    expect(component.especie).toEqual([{ id: 1, nombre: 'esp1' }]);
    component.loadFuncionZootecnica();
    expect(component.funcionZootecnica).toEqual([{ id: 2, nombre: 'fz1' }]);
    component.loadMercancia();
    expect(component.mercancia).toEqual([{ id: 3, nombre: 'merc1' }]);
    component.laodPaisDestino();
    expect(component.paisDestino).toEqual([{ id: 4, nombre: 'pais1' }]);
    component.loadNombreEstablecimiento();
    expect(component.nombreEstablecimiento).toEqual([{ id: 5, nombre: 'est1' }]);
    component.loadTipoActividad();
    expect(component.tipoActividad).toEqual([{ id: 6, nombre: 'act1' }]);
    component.loadAduanaSalida();
    expect(component.aduanaSalida).toEqual([{ id: 7, nombre: 'adu1' }]);
    component.loadOisaSalida();
    expect(component.oisaSalida).toEqual([{ id: 8, nombre: 'oisa1' }]);
    component.loadRegimenMercancia();
    expect(component.regimenMercancia).toEqual([{ id: 9, nombre: 'reg1' }]);
    component.loadPaisOrigen();
    expect(component.paisOrigen).toEqual([{ id: 10, nombre: 'po1' }]);
  });

  it('ngOnInit debe llamar inicializarCombinacionFormulario', () => {
    const spy = jest.spyOn(component, 'inicializarCombinacionFormulario');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('inicializarCombinacionFormulario debe llamar guardarDatosFormulario si es solo lectura', () => {
    const spy = jest.spyOn(component, 'guardarDatosFormulario');
    component.esFormularioSoloLectura = true;
    component.inicializarCombinacionFormulario();
    expect(spy).toHaveBeenCalled();
  });

  it('inicializarCombinacionFormulario debe llamar inicializarFormulario si no es solo lectura', () => {
    const spy = jest.spyOn(component, 'inicializarFormulario');
    component.esFormularioSoloLectura = false;
    component.inicializarCombinacionFormulario();
    expect(spy).toHaveBeenCalled();
  });

  it('ngOnDestroy debe limpiar el subject destroyNotifier$', () => {
    const spyNext = jest.spyOn((component as any).destroyNotifier$, 'next');
    const spyComplete = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });
});