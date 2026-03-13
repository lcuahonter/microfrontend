import { By } from '@angular/platform-browser';
import { Catalogo } from '@ng-mf/data-access-user';
import { CatalogoSelectComponent } from '@ng-mf/data-access-user';
import { Component } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { ControlContainer } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ResponsableInspeccionEnPuntoComponent } from './responsable-inspeccion-en-punto.component';
import { TestBed } from '@angular/core/testing';
import { TituloComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Component({
  selector: 'app-test-host',
  standalone: true,
  imports: [
    ResponsableInspeccionEnPuntoComponent,
    ReactiveFormsModule,
    CommonModule,
  ],
  template: `<form [formGroup]="form">
    <app-responsable-inspeccion-en-punto
      [claveDeControl]="'testControl'"
    ></app-responsable-inspeccion-en-punto>
  </form>`,
})
class TestHostComponent {
  form: FormGroup;

  constructor() {
    this.form = new FormGroup({});
  }
}

describe('ResponsableInspeccionEnPuntoComponent', () => {
  let component: ResponsableInspeccionEnPuntoComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        TestHostComponent,
        ReactiveFormsModule,
        ResponsableInspeccionEnPuntoComponent,
        TituloComponent,
        CatalogoSelectComponent,
        HttpClientTestingModule,
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: ControlContainer,
          useValue: {
            control: new FormGroup({}),
          },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    component = fixture.debugElement.children[0].componentInstance;
    component = fixture.debugElement.query(
      By.directive(ResponsableInspeccionEnPuntoComponent)
    )?.componentInstance;

    expect(component).toBeTruthy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form controls on ngOnInit', () => {
    component.ngOnInit();
    const FORMGROUP = component.grupoFormularioPadre.get(
      component.claveDeControl
    ) as FormGroup;
    expect(FORMGROUP).toBeTruthy();
    expect(FORMGROUP.get('nombre')).toBeTruthy();
    expect(FORMGROUP.get('primerapellido')).toBeTruthy();
    expect(FORMGROUP.get('segundoapellido')).toBeTruthy();
    expect(FORMGROUP.get('mercancia')).toBeTruthy();
    expect(FORMGROUP.get('tipocontenedor')).toBeTruthy();
  });

  it('should remove control on ngOnDestroy', () => {
    component.ngOnInit();
    expect(
      component.grupoFormularioPadre.contains(component.claveDeControl)
    ).toBe(true);
    component.ngOnDestroy();
    expect(
      component.grupoFormularioPadre.contains(component.claveDeControl)
    ).toBe(false);
  });

  it('should handle catalog selection correctly', () => {
    component.ngOnInit();
    const CATALOGO: Catalogo = {
      id: 1,
      descripcion: 'Tipo contenedor 1',
    };
    component.tipoContenedorSeleccion(CATALOGO);
    const FORMGROUP = component.grupoFormularioPadre.get(
      component.claveDeControl
    ) as FormGroup;
    expect(FORMGROUP.get('tipocontenedor')?.value).toBe('Tipo contenedor 1');
  });

  it('should call cargarDatosIniciales on inicializarFormulario', () => {
    const spy = jest.spyOn(component, 'cargarDatosIniciales');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should set tipoContenedor when cargarDatosIniciales is called', () => {
    const mockTipoContenedor = {
      tipoContenedor: {
        catalogos: [],
        labelNombre: 'Tipo contenedor',
        primerOpcion: 'Selecciona una opción',
        required: false,
      },
    };
    const solicitudService = component['solicitudService'];
    jest.spyOn(solicitudService, 'getDataResponsableInspeccion');
    component.cargarDatosIniciales();
    expect(component.tipoContenedor).toEqual(mockTipoContenedor.tipoContenedor);
  });

  it('should call setNombre on store when setNombre is triggered', () => {
    component['solicitud220502Store'] = { setNombre: jest.fn() } as any;
    const event = { target: { value: 'Juan' } } as unknown as Event;
    component.setNombre(event);
    expect(component['solicitud220502Store'].setNombre).toHaveBeenCalledWith(
      'Juan'
    );
  });

  it('should call setPrimerapellido on store when setPrimerapellido is triggered', () => {
    component['solicitud220502Store'] = { setPrimerapellido: jest.fn() } as any;
    const event = { target: { value: 'Perez' } } as unknown as Event;
    component.setPrimerapellido(event);
    expect(
      component['solicitud220502Store'].setPrimerapellido
    ).toHaveBeenCalledWith('Perez');
  });

  it('should call setSegundoapellido on store when setSegundoapellido is triggered', () => {
    component['solicitud220502Store'] = {
      setSegundoapellido: jest.fn(),
    } as any;
    const event = { target: { value: 'Gomez' } } as unknown as Event;
    component.setSegundoapellido(event);
    expect(
      component['solicitud220502Store'].setSegundoapellido
    ).toHaveBeenCalledWith('Gomez');
  });

  it('should call setMercancia on store when setMercancia is triggered', () => {
    component['solicitud220502Store'] = { setMercancia: jest.fn() } as any;
    const event = { target: { value: 'Maíz' } } as unknown as Event;
    component.setMercancia(event);
    expect(component['solicitud220502Store'].setMercancia).toHaveBeenCalledWith(
      'Maíz'
    );
  });

  it('should call setTipocontenedor on store when setTipoContenedor is triggered', () => {
    component['solicitud220502Store'] = { setTipocontenedor: jest.fn() } as any;
    const catalogo: Catalogo = { id: 5, descripcion: 'Caja' };
    component.setTipoContenedor(catalogo);
    expect(
      component['solicitud220502Store'].setTipocontenedor
    ).toHaveBeenCalledWith(5);
  });
});
