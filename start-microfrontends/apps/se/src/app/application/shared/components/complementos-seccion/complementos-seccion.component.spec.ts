import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComplementosSeccionComponent } from './complementos-seccion.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { ComplementosSeccionService } from '../../services/complementos-seccion.service';
import { ComplementosSeccionStore } from '../../../estados/tramites/complementos-seccion.store';
import { ComplementosSeccionQuery } from '../../../estados/queries/complementos-seccion.query';

describe('ComplementosSeccionComponent (Jest)', () => {
  let component: ComplementosSeccionComponent;
  let fixture: ComponentFixture<ComplementosSeccionComponent>;

  const mockService = {
    getTipoPersonaData: jest.fn(),
    getNacionalidadMaxicanaData: jest.fn(),
    getEstado: jest.fn(),
    getPaiseData: jest.fn(),
  };

  const mockStore = {
    setDynamicFieldValue: jest.fn(),
  };

  const mockQuery = {
    selectExportarIlustraciones$: of({}),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule,ComplementosSeccionComponent],
      declarations: [],
      providers: [
        FormBuilder,
        { provide: ComplementosSeccionService, useValue: mockService },
        { provide: ComplementosSeccionStore, useValue: mockStore },
        { provide: ComplementosSeccionQuery, useValue: mockQuery },
      ],
    }).compileComponents();
    
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplementosSeccionComponent);
    component = fixture.componentInstance;

    mockService.getTipoPersonaData.mockReturnValue(of([{ id: 1, descripcion: 'Persona Moral' }]));
    mockService.getNacionalidadMaxicanaData.mockReturnValue(of([{ id: 1, descripcion: 'No' }]));
    mockService.getEstado.mockReturnValue(of({ code: 200, data: [{ id: 1, descripcion: 'EstadoX' }] }));
    mockService.getPaiseData.mockReturnValue(of({ code: 200, data: [{ id: 1, descripcion: 'PaísX' }] }));

    fixture.detectChanges(); // triggers ngOnInit
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize forms and fetch radio options', () => {
    expect(component.formaAccionistas).toBeTruthy();
    expect(component.accionistasRadio.length).toBeGreaterThan(0);
    expect(component.tipoPersonaRadio.length).toBeGreaterThan(0);
  });

  it('should evaluate activeTab in onRadioChange()', () => {
    component.formaAccionistas.setValue({
      nacionalidadMexicana: 'No',
      tipoDePersona: 'Persona fisica',
      certificada: '',
      fechaInicio: '',
      fechaVigencia: '',
      taxId: '', 
      razonSocial: '', 
      pais: '', 
      codigoPostal: '', 
      estado: '', 
      correoElectronico: '', 
    });
    component.onRadioChange();
    expect(component.activeTab).toBe('No - Persona fisica');
  });

  it('should set field value using establecerCambioDeValor()', () => {
    const mockEvent = { campo: 'testCampo', valor: { id: 5 } };
    component.establecerCambioDeValor(mockEvent);
    expect(mockStore.setDynamicFieldValue).toHaveBeenCalledWith('testCampo', 5);
  });

  it('should call establecerCambioDeValor with non-object value', () => {
    mockStore.setDynamicFieldValue.mockClear(); // Clear previous calls
    component.establecerCambioDeValor({ campo: 'campoX', valor: { value: 'stringValue' } });
    expect(mockStore.setDynamicFieldValue).toHaveBeenCalledTimes(1);
    expect(mockStore.setDynamicFieldValue).toHaveBeenCalledWith('campoX', { value: 'stringValue' });
  });



  it('should remove accionistas extranjeros', () => {
    const accionista = { id: 1, descripcion: 'acc' } as any;
    component.datosSocioAccionistasExtrenjeros = [accionista];
    component.accionistasExtranjerosSeleccionados = [accionista];
    component.eliminarAccionistasExtrenjeros();
    expect(component.datosSocioAccionistasExtrenjeros.length).toBe(0);
    expect(component.accionistasExtranjerosSeleccionados.length).toBe(0);
  });

  it('should clean up on destroy', () => {
    const spy = jest.spyOn(component['destroy$'], 'next');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });
});
