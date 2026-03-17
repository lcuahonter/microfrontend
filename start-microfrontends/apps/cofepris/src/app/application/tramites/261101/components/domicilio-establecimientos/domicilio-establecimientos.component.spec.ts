import { TestBed, ComponentFixture } from '@angular/core/testing';
import { DomicilioEstablecimientosComponent } from './domicilio-establecimientos.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DatosProcedureQuery } from '../../../../estados/queries/tramites261103.query';
import { DatosProcedureStore } from '../../../../estados/tramites/tramites261103.store';
import { of } from 'rxjs';
import { TablaSeleccion } from '@libs/shared/data-access-user/src/core/enums/tabla-seleccion.enum';
import { DatosSolicitudService } from '../../services/datoSolicitude.service'
import { ConsultaioQuery } from '@ng-mf/data-access-user';

describe('DomicilioEstablecimientosComponent', () => {
  let component: DomicilioEstablecimientosComponent;
  let fixture: ComponentFixture<DomicilioEstablecimientosComponent>;
  let mockStore: any;
  let mockQuery: any;
  let mockService: any;
  let mockConsultaioQuery: any;

  beforeEach(async () => {
    mockQuery = {
      selectProrroga$: of({
        codigo: '001',
        estado: 'Estado',
        municipio: 'Municipio',
        localidad: 'Localidad',
        colonia: 'Colonia',
        calle: 'Calle',
        correo: 'correo@correo.com',
        sanitario: 'Sí',
        lada: '55',
        telefono: '1234567890',
        funcionamiento: 'Operando',
        licencia: 'Lic-123',
        regimen: 'General',
      }),
    };

    mockStore = {
      establecerDatos: jest.fn(),
    };

    mockService = {
      obternerDatosData: jest.fn().mockReturnValue(of([])),
    };

    mockConsultaioQuery = {
      selectConsultaioState$: of({ readonly: false })
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, DomicilioEstablecimientosComponent],
      providers: [
        { provide: DatosProcedureQuery, useValue: mockQuery },
        { provide: DatosProcedureStore, useValue: mockStore },
        { provide: DatosSolicitudService, useValue: mockService },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DomicilioEstablecimientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar los formularios en ngOnInit', () => {
    expect(component.domicilioEstablecimiento).toBeDefined();
    expect(component.AvisodeFuncionamiento).toBeDefined();
    expect(component.domicilioEstablecimiento.get('estado')?.value).toBe('Estado');
    expect(component.AvisodeFuncionamiento.get('funcionamiento')?.value).toBe('Operando');
  });

  it('debería cargar los datos SCIAN correctamente', () => {
    component.loadScian();
    expect(mockService.obternerDatosData).toHaveBeenCalled();
    expect(component.datosData).toEqual([]);
  });

  it('debería establecer valores en el store', () => {
    component.setValoresStore(component.domicilioEstablecimiento, 'estado');
    expect(mockStore.establecerDatos).toHaveBeenCalledWith({ estado: 'Estado' });
  });

  it('debería limpiar las suscripciones en ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('debería contener la configuración de tabla correcta', () => {
    expect(component.configuracionTabla.length).toBeGreaterThan(0);
  });

  it('debería tener el tipo de selección de tabla correcto', () => {
    expect(component.TablaSeleccion).toBe(TablaSeleccion.CHECKBOX);
  });

  it('debería ejecutar guardarDatosFormulario y cargar datos correctamente', () => {
    const spyScian = jest.spyOn(component, 'loadScian');
    component.guardarDatosFormulario();
    expect(spyScian).toHaveBeenCalled();
  });

  it('debería deshabilitar los formularios si es solo lectura', () => {
    component.esFormularioSoloLectura = true;
    component.establecerdomicilioEstablecimiento();
    component.avisodeFuncionamientomiento();
    expect(component.domicilioEstablecimiento.disabled).toBe(true);
    expect(component.AvisodeFuncionamiento.disabled).toBe(true);
  });
});
