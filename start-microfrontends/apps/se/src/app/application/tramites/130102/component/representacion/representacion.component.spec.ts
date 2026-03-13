import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RepresentacionComponent } from './representacion.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TituloComponent } from 'libs/shared/data-access-user/src/tramites/components/titulo/titulo.component';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { Tramite130102Store } from '../../../../estados/tramites/tramite130102.store';
import { Tramite130102Query } from '../../../../estados/queries/tramite130102.query';
import { FormularioRegistroService } from '../../services/octava-temporal.service';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { of, Subject } from 'rxjs';
import { CommonModule } from '@angular/common';

describe('RepresentacionComponent (Jest)', () => {
  let component: RepresentacionComponent;
  let fixture: ComponentFixture<RepresentacionComponent>;

  const mockStore = {
    setEntidad: jest.fn(),
    setRepresentacion: jest.fn()
  };

  const mockQuery = {
  selectSolicitud$: of({ entidad: 5, representacion: 3 })
};

  const mockFormService = {
    registrarFormulario: jest.fn()
  };

  const mockConsultaioQuery = {
    selectConsultaioState$: of({ readonly: false })
  };

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      declarations: [
      ],
      imports: [
        RepresentacionComponent,
        TituloComponent,
        CatalogoSelectComponent,
        CommonModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: Tramite130102Store, useValue: mockStore },
        { provide: Tramite130102Query, useValue: mockQuery },
        { provide: FormularioRegistroService, useValue: mockFormService },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepresentacionComponent);
    component = fixture.componentInstance;
  
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should assign selected entidad federativa', () => {
    const entidad = { id: 2, descripcion: 'Jalisco' };
    component.entidadFederativaSeleccion(entidad);
    expect(component.seleccionadaEntidadFederativa).toEqual(entidad);
  });

  it('should assign selected representacion federal', () => {
    const representacion = { id: 4, descripcion: 'SAT' };
    component.representacionFederalSeleccion(representacion);
    expect(component.seleccionadaRepresentacionFederal).toEqual(representacion);
  });

  it('should fetchRepresentacionFederal assign to seleccionadaRepresentacionFederal', () => {
    const representacion = { id: 6, descripcion: 'SHCP' };
    component.fetchRepresentacionFederal(representacion);
    expect(component.seleccionadaRepresentacionFederal).toEqual(representacion);
  });

  it('should initialize the form with state values', () => {
    component.inicializarFormulario();
    expect(component.frmRepresentacion).toBeDefined();
    expect(component.frmRepresentacion.get('entidad')?.value).toBe(5);
    expect(component.frmRepresentacion.get('representacion')?.value).toBe(3);
  });

  it('should disable form when esFormularioSoloLectura is true', () => {
    component.esFormularioSoloLectura = true;
    component.guardarDatosFormulario();
    expect(component.frmRepresentacion.disabled).toBe(true);
  });

  it('should enable form when esFormularioSoloLectura is false', () => {
    component.esFormularioSoloLectura = false;
    component.guardarDatosFormulario();
    expect(component.frmRepresentacion.enabled).toBe(true);
  });

  it('should call next and complete on destroyNotifier$ when ngOnDestroy is called', () => {
    const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
 
});
