import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of, Subject } from 'rxjs';
import { RepresentacionFederalComponent } from './representacion-federal.component';
import { CatalogoSelectComponent, TituloComponent } from '@ng-mf/data-access-user';
import { DatosDeLaSolicitudService } from '../../services/datos-de-la-solicitud/datos-de-la-solicitud.service';
import { Tramite130119Query } from '../../estados/queries/tramite130119.query';
import { Tramite130119Store } from '../../estados/store/tramite130119.store';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RepresentacionFederalComponent', () => {
  let component: RepresentacionFederalComponent;
  let fixture: ComponentFixture<RepresentacionFederalComponent>;
  let datosDeLaSolicitudService: DatosDeLaSolicitudService;
  let tramite130119Query: Tramite130119Query;
  let tramite130119Store: Tramite130119Store;

  beforeEach(async () => {
    const datosDeLaSolicitudServiceMock = {
      getEstado: jest.fn().mockReturnValue(of([
        { id: '1', nombre: 'Estado 1' },
        { id: '2', nombre: 'Estado 2' }
      ])),
      getRepresentacionfederal: jest.fn().mockReturnValue(of([
        { id: '1', descripcion: 'Representación 1' },
        { id: '2', descripcion: 'Representación 2' }
      ]))
    };

    const tramite130119QueryMock = {
      selectTramite130119$: of({
        estado: 'Estado 1', 
        representacionFederal: 'Representación 1'
      })
    };
    

    const tramite130119StoreMock = {
      establecerDatos: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
          CommonModule,
          RepresentacionFederalComponent, 
          ReactiveFormsModule, 
          HttpClientTestingModule, 
          TituloComponent, 
          CatalogoSelectComponent],
      providers: [
        { provide: DatosDeLaSolicitudService, useValue: datosDeLaSolicitudServiceMock },
        { provide: Tramite130119Query, useValue: tramite130119QueryMock },
        { provide: Tramite130119Store, useValue: tramite130119StoreMock }
      ]
    }).compileComponents();

    datosDeLaSolicitudService = TestBed.inject(DatosDeLaSolicitudService);
    tramite130119Query = TestBed.inject(Tramite130119Query);
    tramite130119Store = TestBed.inject(Tramite130119Store);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepresentacionFederalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario con valores predeterminados', () => {
    expect(component.formularioRepresentacionFederalForm).toBeDefined();
    expect(component.formularioRepresentacionFederalForm.get('estado')?.value).toBe('Estado 1'); 
    expect(component.formularioRepresentacionFederalForm.get('representacionFederal')?.value).toBe('Representación 1'); 
  });
  

  it('Debería obtener y configurar las opciones de estado al iniciar', () => {
    component.ngOnInit();
    expect(datosDeLaSolicitudService.getEstado).toHaveBeenCalled();
    expect(component.opcionesEstado.length).toBe(2);
    expect(component.opcionesEstado).toEqual([
      { id: '1', nombre: 'Estado 1' },
      { id: '2', nombre: 'Estado 2' }
    ]);
  });

  it('Debe obtener y establecer las opciones de representación federal al iniciar', () => {
    component.ngOnInit();
    expect(component.opcionesRepresentacionFederal.length).toBe(0);
    expect(component.opcionesRepresentacionFederal).toEqual([]);
  });

  it('Debe obtener y establecer valores de formulario desde la tienda al iniciar', () => {
    component.ngOnInit();
    expect(component.formularioRepresentacionFederalForm.get('estado')?.value).toBe('Estado 1');
    expect(component.formularioRepresentacionFederalForm.get('representacionFederal')?.value).toBe('Representación 1');
  });

  it('Debe establecer valores en la tienda cuando se llama a setValoresStore', () => {
    component.formularioRepresentacionFederalForm.patchValue({ estado: 'Estado 1' });
    component.setValoresStore(component.formularioRepresentacionFederalForm, 'estado');
    expect(tramite130119Store.establecerDatos).toHaveBeenCalledWith({ estado: 'Estado 1' });
  });

  it('Debería completar el tema destruido$ en destruir', () => {
    const nextSpy = jest.spyOn(component['destroyed$'], 'next');
    const completeSpy = jest.spyOn(component['destroyed$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
