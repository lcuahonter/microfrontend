import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosDelNombreComponent } from './datos-del-nombre.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { Tramite630104Store } from '../../estados/tramites/tramite630104.store';
import { Tramite630104Query } from '../../estados/queries/tramite630104.query';
import { EquipoEInstrumentosMusicalesService } from '../../services/equipo-e-instrumentos-musicales.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

describe('DatosDelNombreComponent', () => {
  let component: DatosDelNombreComponent;
  let fixture: ComponentFixture<DatosDelNombreComponent>;

  const mockStore = {
    setTramite630104State: jest.fn(),
  };

  const mockQuery = {
    selectSeccionState$: of({ esConsultaRep: '1', datosRepresentante: '1', rfc: 'ABC123' }),
    selectTramite630104State$: of({ esConsultaRep: '1', datosRepresentante: '1', rfc: 'ABC123' }),
  };

  const mockConsultaioQuery = {
    selectConsultaioState$: of({ readonly: false }),
  };

  const mockService = {
    getconsultarPorRFC: jest.fn().mockReturnValue(of([{ id: '1', descripcion: 'RFC1' }])),
    getTipoDeRepresentante: jest.fn().mockReturnValue(of([{ id: '1', descripcion: 'Tipo1' }])),
    getPais: jest.fn().mockReturnValue(of([{ id: 'MX', descripcion: 'México' }])),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosDelNombreComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: Tramite630104Store, useValue: mockStore },
        { provide: Tramite630104Query, useValue: mockQuery },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
        { provide: EquipoEInstrumentosMusicalesService, useValue: mockService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosDelNombreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with values from store', () => {
    expect(component.datisDelNombre.value).toEqual({
      esConsultaRep: '1',
      datosRepresentante: '1',
      rfc: 'ABC123',
    });
  });

  it('should call getconsultarPorRFC on init', () => {
    expect(mockService.getconsultarPorRFC).toHaveBeenCalled();
    expect(component.consultarPorRFC.length).toBeGreaterThan(0);
  });

  it('should call getTipoDeRepresentante on init', () => {
    expect(mockService.getTipoDeRepresentante).toHaveBeenCalled();
    expect(component.tipoDeRepresentanteOpciones.length).toBeGreaterThan(0);
  });

  it('should call getPais and assign to direccion form config', () => {
    const paisField = component.formularioDatosPropietarioDireccion.find(f => f.id === 'pais');
    expect(paisField?.opciones).toEqual([{ id: 'MX', descripcion: 'México' }]);
  });

  it('should disable form when in readonly mode', () => {
    component.esFormularioSoloLectura = true;
    component.guardarDatosFormulario();
    expect(component.datisDelNombre.disabled).toBe(true);
  });

  it('should enable form when not in readonly mode', () => {
    component.esFormularioSoloLectura = false;
    component.guardarDatosFormulario();
    expect(component.datisDelNombre.enabled).toBe(true);
  });

  it('should update store with primitive value', () => {
    component.establecerCambioDeValor({ campo: 'rfc', valor: 'XYZ' });
    expect(mockStore.setTramite630104State).toHaveBeenCalledWith('rfc', 'XYZ');
  });

  it('should update store with object containing id', () => {
    component.establecerCambioDeValor({ campo: 'rfc', valor: { id: 123 } });
    expect(mockStore.setTramite630104State).toHaveBeenCalledWith('rfc', '123');
  });

  it('should set consultarPorRFCOpcionseleccionada to true on continuar', () => {
    component.datisDelNombre.get('esConsultaRep')?.setValue('1');
    component.continuar();
    expect(component.consultarPorRFCOpcionseleccionada).toBe(true);
  });

  it('should set consultarPorRFCOpcionseleccionada to false on continuar', () => {
    component.datisDelNombre.get('esConsultaRep')?.setValue('2');
    component.continuar();
    expect(component.consultarPorRFCOpcionseleccionada).toBe(false);
  });

  it('should toggle fields visibility based on tipo representante', () => {
    component.datisDelNombre.get('datosRepresentante')?.setValue('1');
    component.cambiarTipoPropietario();
    const visibleFields = component.formularioDatosPropietarioNombre.filter(c => c.mostrar === true);
    expect(visibleFields.length).toBeGreaterThan(0);
  });

  it('should unsubscribe on destroy', () => {
    const spyNext = jest.spyOn(component['destroyed$'], 'next');
    const spyComplete = jest.spyOn(component['destroyed$'], 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });
});
