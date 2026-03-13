import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { ManiobrasMercanciasComponent } from './maniobras-mercancias.component';
import { PrestadoresServicioService } from '../../services/prestadores-servicio/prestadores-servicio.service';
import { ManiobrasMercancias202State, Tramite202Store } from '../../../../core/estados/tramites/tramite202.store';
import { Tramite202Query } from '../../../../core/queries/tramite202.query';

describe('ManiobrasMercanciasComponent', () => {
  let component: ManiobrasMercanciasComponent;
  let fixture: ComponentFixture<ManiobrasMercanciasComponent>;
  let prestadoresServicioServiceMock: Partial<PrestadoresServicioService>;
  let tramite202StoreMock: Partial<Tramite202Store>;
  let tramite202QueryMock: Partial<Tramite202Query>;

  beforeEach(async () => {
    prestadoresServicioServiceMock = {
      getAduana: jest.fn().mockReturnValue(of({ data: [{ id: 1, descripcion: 'Aduana 1' }] })),
      getManifiestos: jest.fn().mockReturnValue(of({ data: [{ id: 1, descripcion: 'Manifiesto 1' }] })),
    };

    tramite202StoreMock = {
      setAduana: jest.fn(),
      setSeleccionadaManifiesto: jest.fn(),
    };

    tramite202QueryMock = {
      select: jest.fn().mockReturnValue(of({})),
      selectSeccionState$: of({
        seleccionadaManifiesto: [],
        aduana: null
      } as unknown as ManiobrasMercancias202State)
    };

    prestadoresServicioServiceMock = {
      getAduana: jest.fn().mockReturnValue(of({ data: [{ id: 1, descripcion: 'Aduana 1' }] })),
      getManifiestos: jest.fn().mockReturnValue(of({
        data: [
          {
            declaracion: {
              clave: 'clave1',
              descripcion: 'Se manifiesta bajo protesta de decir verdad, que el solicitante cuenta con un capital social fijo pagado de $300,000 00 y que en su objeto social se encuentra la prestacíon de los servicios de carga, descarga y maniobras de mercancías'
            },
            manifiestoDeclaracion: true
          }
        ]
      })),
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        ManiobrasMercanciasComponent
      ],
      providers: [
        FormBuilder,
        { provide: PrestadoresServicioService, useValue: prestadoresServicioServiceMock },
        { provide: Tramite202Store, useValue: tramite202StoreMock },
        { provide: Tramite202Query, useValue: tramite202QueryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ManiobrasMercanciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit', () => {
    expect(component.maniobrasMercanciasForm).toBeDefined();
    expect(component.maniobrasMercanciasForm.get('aduana')).toBeDefined();
    expect(component.maniobrasMercanciasForm.get('seleccionadaManifiesto')).toBeDefined();
  });

  it('should call getAduana and initialize aduana on inicializaCatalogos', () => {
    component.inicializaCatalogos();
    expect(prestadoresServicioServiceMock.getAduana).toHaveBeenCalled();
    expect(component.aduana).toEqual([{ id: 1, descripcion: 'Aduana 1' }]);
  });

  it('should call getManifiestos and initialize manifiestos on obtenerManifiestos', () => {
    component.obtenerManifiestos();
    expect(prestadoresServicioServiceMock.getManifiestos).toHaveBeenCalled();
    expect(component.manifiestos).toEqual(
      [
        {
            "declaracion": {
                "clave": "clave1",
                "descripcion": "Se manifiesta bajo protesta de decir verdad, que el solicitante cuenta con un capital social fijo pagado de $300,000 00 y que en su objeto social se encuentra la prestacíon de los servicios de carga, descarga y maniobras de mercancías"
            },
            "manifiestoDeclaracion": true
        }
    ]
    );
  });
  
  it('should call setAduana on aduanaSeleccion', () => {
    component.maniobrasMercanciasForm.patchValue({ aduana: 'Aduana 1' });
    component.aduanaSeleccion();
    expect(tramite202StoreMock.setAduana).toHaveBeenCalledWith('Aduana 1');
  });

  it('should update seleccionadaManifiesto on onManifiestoCheckboxCambiar', () => {
    component.maniobrasMercanciasForm.setControl('seleccionadaManifiesto', component.fb.array([false]));
    const event = { target: { checked: true } } as unknown as Event;
    component.onManifiestoCheckboxCambiar(event, 0);
    expect(component.seleccionadaManifiesto.at(0).value).toBe(true);
    expect(tramite202StoreMock.setSeleccionadaManifiesto).toHaveBeenCalledWith([true]);
  });

  it('should call setValoresStore with correct arguments', () => {
    const spy = jest.spyOn(component, 'setValoresStore');
    component.setValoresStore(component.maniobrasMercanciasForm, 'aduana', 'setAduana');
    expect(spy).toHaveBeenCalledWith(component.maniobrasMercanciasForm, 'aduana', 'setAduana');
  });

  it('should unsubscribe destruirNotificador$ on ngOnDestroy', () => {
    const spy = jest.spyOn(component['destruirNotificador$'], 'next');
    const completeSpy = jest.spyOn(component['destruirNotificador$'], 'complete');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});