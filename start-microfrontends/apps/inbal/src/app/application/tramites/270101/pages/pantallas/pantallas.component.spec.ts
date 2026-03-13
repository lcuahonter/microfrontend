import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PantallasComponent } from './pantallas.component';
import {
  AccionBoton,
  AlertComponent,
  AVISO,
  BtnContinuarComponent,
  SolicitanteComponent,
  WizardComponent,
} from '@libs/shared/data-access-user/src';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { PasoTresComponent } from '../paso-tres/paso-tres.component';
import { ExportarIlustracionesService } from '../../services/exportar-ilustraciones.service';
import { By } from '@angular/platform-browser';
import { ERROR_DE_REGISTRO_ALERT, ERROR_FORMA_ALERT } from '../../constantes/exportar-ilustraciones.enum';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of } from 'rxjs';
import { AduanaDeSalida, DatosDelSolicitud } from '../../models/exportar-ilustraciones.model';

describe('PantallasComponent', () => {
  let component: PantallasComponent;
  let fixture: ComponentFixture<PantallasComponent>;
  let mockExportarIlustracionesService: ExportarIlustracionesService;
  let wizardComponent: WizardComponent;
  let mockConsultaQuery: ConsultaioQuery;

  const mockAduana: AduanaDeSalida = {
    tipo: 'Terrestre',
    ciudad: 'Ciudad de México',
    sede: 'Central',
    tipoDeTraslado: 'Carretera',
    fechaExhibicion: '2025-06-01',
    observaciones: 'Sin observaciones',
    fechoInicio: '2025-06-01',
    fechaFin: '2025-06-10',
  };

  const mockSolicitud: DatosDelSolicitud = {
    autor: 'Juan Pérez',
    titulo: 'Obra Maestra',
    tecnicaDeRealizacion: 'Óleo sobre lienzo',
    conMarco: 'Sí',
    ancho: 100,
    alto: 150,
    profundidad: 10,
    diametro: 0,
    variables: 'Variable X',
    anoDeCreacion: '2023',
    avaluo: 100000,
    moneda: 'MXN',
    propietario: 'Museo Nacional',
    fraccionArancelaria: '9701.10.01',
    descripcion: 'Pintura del siglo XXI',
  };

  beforeEach(async () => {
    mockExportarIlustracionesService = {
      aduanaArray: [],
      datosDeSolicitudArray: [],
      formsMap: new Map(),
      formValues: {},
      setAduanaArray: jest.fn(),
      setDatosDeSolicitudArray: jest.fn(),
      getFormValidity: jest.fn().mockReturnValue(true),
      getFormValues: jest.fn(),
      setFormValues: jest.fn(),
      getExportarIlustracionesData: jest.fn().mockReturnValue(of({}))
    } as unknown as ExportarIlustracionesService;

    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        AlertComponent,
        WizardComponent,
        BtnContinuarComponent,
        SolicitanteComponent
      ],
      declarations: [
        PantallasComponent,
        PasoUnoComponent,
        PasoDosComponent,
        PasoTresComponent
      ],
      providers: [
        { provide: ExportarIlustracionesService, useValue: mockExportarIlustracionesService },
        { provide: ConsultaioQuery, useValue: {
          selectConsultaioState$: of({
          readonly: false,
          update: false,
    })
        } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PantallasComponent);
    component = fixture.componentInstance;
    mockConsultaQuery = {
       selectConsultaState: jest.fn(),
    } as unknown as ConsultaioQuery;
    wizardComponent = fixture.debugElement.query(By.directive(WizardComponent)).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should not update indice if action is invalid', () => {
    const mockEvent: AccionBoton = { valor: 0, accion: 'cont' };
    component.getValorIndice(mockEvent);
    expect(component.indice).toBe(1);
  });

  it('should update selected tab index correctly', () => {
    const event = 3;
    component.pestanaCambiado(event);
    expect(component.indiceDePestanaSeleccionada).toBe(3);
  });

  it('should return true when all forms are valid', () => {
    jest.spyOn(mockExportarIlustracionesService, 'getFormValidity').mockReturnValue(true);
    expect(component.formaError).toBe(true);
  });

  it('should return false when any form is invalid', () => {
    jest.spyOn(mockExportarIlustracionesService, 'getFormValidity').mockReturnValue(false);
    expect(component.formaError).toBe(false);
  });

  it('should not change step if form is invalid', () => {
    jest.spyOn(mockExportarIlustracionesService, 'getFormValidity').mockReturnValue(false);
    const mockEvent: AccionBoton = { valor: 2, accion: 'cont' };
    component.getValorIndice(mockEvent);
    expect(component.indice).toBe(1);
  });

  it('should set itinerarioError to true if aduanaArray is empty and forma is valid', () => {
    mockExportarIlustracionesService.aduanaArray = [];
    jest.spyOn(mockExportarIlustracionesService, 'getFormValidity').mockReturnValue(true);
    component.itinerarioError = false;
    component.esElFormularioValido();
    expect(component.itinerarioError).toBe(true);
  });

  it('should set formaError to true if all forms are valid', () => {
    jest.spyOn(mockExportarIlustracionesService, 'getFormValidity').mockReturnValue(true);
    // No direct assignment to component.formaError since it's read-only
    component.esElFormularioValido();
    expect(component.formaError).toBe(true);
  });

  it('should set formaError to false if any form is invalid', () => {
    jest.spyOn(mockExportarIlustracionesService, 'getFormValidity').mockReturnValue(false);
   
    component.esElFormularioValido();
    expect(component.formaError).toBe(false);
  });

  it('should not set itinerarioError if aduanaArray has more than 1 item', () => {
    mockExportarIlustracionesService.aduanaArray = [mockAduana, mockAduana];
    jest.spyOn(mockExportarIlustracionesService, 'getFormValidity').mockReturnValue(true);
    component.itinerarioError = false;
    component.esElFormularioValido();
    expect(component.itinerarioError).toBe(false);
  });

  it('should handle getValorIndice with accion not "cont"', () => {
    const mockEvent: AccionBoton = { valor: 2, accion: 'otro' };
    component.indice = 1;
    component.getValorIndice(mockEvent);
    expect(component.indice).toBe(1);
  });

  it('should handle getValorIndice with valor 1', () => {
    const mockEvent: AccionBoton = { valor: 1, accion: 'cont' };
    mockExportarIlustracionesService.aduanaArray = [mockAduana];
    mockExportarIlustracionesService.datosDeSolicitudArray = [mockSolicitud];
    jest.spyOn(mockExportarIlustracionesService, 'getFormValidity').mockReturnValue(true);
    component.getValorIndice(mockEvent);
    expect(component.indice).toBe(1);
  });

  it('should handle pestanaCambiado with undefined', () => {
    component.indiceDePestanaSeleccionada = 2;
    component.pestanaCambiado(undefined as any);
    expect(component.indiceDePestanaSeleccionada).toBe(1);
  });

  it('should handle ngOnDestroy multiple times gracefully', () => {
    component.ngOnDestroy();
    expect(() => component.ngOnDestroy()).not.toThrow();
  });

  it('should handle getValorIndice with invalid event', () => {
    component.indice = 1;
    component.getValorIndice(undefined as any);
    expect(component.indice).toBe(1);
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const spy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should default indiceDePestanaSeleccionada to 1 if input is invalid', () => {
    component.indiceDePestanaSeleccionada = 3;
    component.pestanaCambiado(NaN);
    expect(component.indiceDePestanaSeleccionada).toBe(1);
  });

  it('should reset indiceDePestanaSeleccionada to 1 when valor is not 1', () => {
    component.indiceDePestanaSeleccionada = 3;
    mockExportarIlustracionesService.aduanaArray = [mockAduana, mockAduana];
    mockExportarIlustracionesService.datosDeSolicitudArray = [mockSolicitud];
    jest.spyOn(mockExportarIlustracionesService, 'getFormValidity').mockReturnValue(true);
    const mockEvent: AccionBoton = { valor: 2, accion: 'cont' };
    component.getValorIndice(mockEvent);
    expect(component.indiceDePestanaSeleccionada).toBe(1);
  });

});


