import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TipoPropietarioComponent } from './tipo-propietario.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { EquipoEInstrumentosMusicalesService } from '../../services/equipo-e-instrumentos-musicales.service';
import { Tramite630104Store } from '../../estados/tramites/tramite630104.store';
import { Tramite630104Query } from '../../estados/queries/tramite630104.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { FORMULARIO_DATOS_PROPIETARIO_DIRECCION, FORMULARIO_DATOS_PROPIETARIO_NOMBRE } from '../../enums/retorno-importacion-temporal.enum';
import { HttpClientTestingModule } from '@angular/common/http/testing';


describe('TipoPropietarioComponent', () => {
  let component: TipoPropietarioComponent;
  let fixture: ComponentFixture<TipoPropietarioComponent>;

  const mockEquipoService = {
    getPropietario: jest.fn().mockReturnValue(of([{ id: '1', descripcion: 'Persona' }])),
    getTipoDePropietario: jest.fn().mockReturnValue(of([{ id: '2', descripcion: 'Moral' }])),
    getPais: jest.fn().mockReturnValue(of([{ id: 'MX', descripcion: 'México' }])),
  };

  const mockStore = {
    setTramite630104State: jest.fn(),
  };

  const mockQuery = {
    selectSeccionState$: of({ propietario: '1', tipoDePropietario: '1' }),
    selectTramite630104State$: of({ propietario: '1', tipoDePropietario: '1' }),
  };

  const mockConsultaioQuery = {
    selectConsultaioState$: of({ readonly: false }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule, TipoPropietarioComponent],
      providers: [
        FormBuilder,
      { provide: EquipoEInstrumentosMusicalesService, useValue: mockEquipoService },
      { provide: Tramite630104Store, useValue: mockStore },
      { provide: Tramite630104Query, useValue: mockQuery },
      { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TipoPropietarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    component.inicializarFormulario();
    expect(component.tipoPropietarioFormulario).toBeDefined();
    expect(component.tipoPropietarioFormulario.get('propietario')?.value).toBe('1');
    expect(component.tipoPropietarioFormulario.get('tipoDePropietario')?.value).toBe('1');
  });

  it('should call getPropietario and populate propietarioOpciones', () => {
    component.getPropietario();
    expect(mockEquipoService.getPropietario).toHaveBeenCalled();
  });

  it('should call getTipoDePropietario and populate tipoDePropietarioOpciones', () => {
    component.getTipoDePropietario();
    expect(mockEquipoService.getTipoDePropietario).toHaveBeenCalled();
  });

  it('should set pais options in formularioDatosPropietarioDireccion', () => {
    const campo = FORMULARIO_DATOS_PROPIETARIO_DIRECCION.find((c) => c.id === 'pais');
    component.formularioDatosPropietarioDireccion = [...FORMULARIO_DATOS_PROPIETARIO_DIRECCION];
    component.getPais();
    expect(mockEquipoService.getPais).toHaveBeenCalled();
  });

  it('should enable form if not readonly', () => {
    component.esFormularioSoloLectura = false;
    component.inicializarFormulario();
    component.guardarDatosFormulario();
    expect(component.tipoPropietarioFormulario.enabled).toBe(true);
  });

  it('should disable form if readonly', () => {
    component.esFormularioSoloLectura = true;
    component.inicializarFormulario();
    component.guardarDatosFormulario();
    expect(component.tipoPropietarioFormulario.disabled).toBe(true);
  });

  it('should show/hide fields based on tipoDePropietario value', () => {
    component.inicializarFormulario();
    component.tipoPropietarioFormulario.get('tipoDePropietario')?.setValue('1');
    component.cambiarTipoPropietario();
    const nombre = FORMULARIO_DATOS_PROPIETARIO_NOMBRE.find((f) => f.id === 'nombre');
    expect(nombre).toBeDefined();
  });

  it('should update store with establecerCambioDeValor', () => {
    const mockEvent = { campo: 'propietario', valor: { id: '2' } };
    component.establecerCambioDeValor(mockEvent);
    expect(mockStore.setTramite630104State).toHaveBeenCalledWith('propietario', '2');
  });

  it('should unsubscribe on destroy', () => {
    const nextSpy = jest.spyOn(component['destroyed$'], 'next');
    const completeSpy = jest.spyOn(component['destroyed$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

});
