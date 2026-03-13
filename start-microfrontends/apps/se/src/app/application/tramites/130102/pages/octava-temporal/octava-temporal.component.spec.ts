import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OctavaTemporalComponent } from './octava-temporal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AlertComponent, BtnContinuarComponent, WizardComponent, WizardService } from '@libs/shared/data-access-user/src';
import { DatosComponent } from '../datos/datos.component';
import { PasoTresComponent } from '../../component/paso-tres/paso-tres.component';
import { SolicitanteOctavaTemporalComponent } from '../../component/solicitante-octava-temporal/solicitante-octava-temporal.component';
import { ConsultaioQuery, ConsultaioState} from '@ng-mf/data-access-user';
import { FormularioRegistroService } from '../../services/octava-temporal.service';
import { of } from 'rxjs';

describe('OctavaTemporalComponent', () => {
  let component: OctavaTemporalComponent;
  let fixture: ComponentFixture<OctavaTemporalComponent>;
  let consultaQuery: jest.Mocked<ConsultaioQuery>;
  let formularioService: jest.Mocked<FormularioRegistroService>;
  let wizardService: jest.Mocked<WizardService>;
  
  beforeEach(async () => {
   const mockConsultaioQuery = {
    selectConsultaioState$: of({ readonly: false })
  };

    const formularioServiceMock: Partial<jest.Mocked<FormularioRegistroService>> = {
      validarTodosFormularios: jest.fn().mockReturnValue(true),
    };

    const wizardServiceMock: Partial<jest.Mocked<WizardService>> = {
      cambio_indice: jest.fn(),
    };
    await TestBed.configureTestingModule({
      declarations: [OctavaTemporalComponent, DatosComponent,],
      imports: [HttpClientTestingModule, WizardComponent, AlertComponent, BtnContinuarComponent, PasoTresComponent, SolicitanteOctavaTemporalComponent],
      providers: [
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
        { provide: FormularioRegistroService, useValue: formularioServiceMock },
        { provide: WizardService, useValue: wizardServiceMock },
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OctavaTemporalComponent);
    component = fixture.componentInstance;
    
    consultaQuery = TestBed.inject(ConsultaioQuery) as jest.Mocked<ConsultaioQuery>;
    formularioService = TestBed.inject(FormularioRegistroService) as jest.Mocked<FormularioRegistroService>;
    wizardService = TestBed.inject(WizardService) as jest.Mocked<WizardService>;

    fixture.detectChanges();

     component['wizardComponent'] = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set consultaState on ngOnInit', () => {
    component.ngOnInit();
    expect(component.consultaState).toEqual({ readonly: false });
  });

  it('should advance to next step when form is valid and action is cont', () => {
    component.consultaState = { readonly: false } as any;
    const e = { accion: 'cont', valor: 2 };
    component.getValorIndice(e);
    expect(component.indice).toBe(3);
    expect(component.datosPasos.indice).toBe(3);
    expect(wizardService.cambio_indice).toHaveBeenCalledWith(3);
    expect(component['wizardComponent'].siguiente).toHaveBeenCalled();
  });

  it('should go back one step when action is ant and form is valid', () => {
    component.consultaState = { readonly: false } as any;
    const e = { accion: 'ant', valor: 2 };
    component.getValorIndice(e);
    expect(component.indice).toBe(1);
    expect(component['wizardComponent'].atras).toHaveBeenCalled();
  });



  it('should set mostrarErrorFormularios to true when form is invalid', () => {
    formularioService.validarTodosFormularios.mockReturnValue(false);
    component.consultaState = { readonly: false } as any;
    const e = { accion: 'cont', valor: 2 };
    component.getValorIndice(e);
    expect(component.mostrarErrorFormularios).toBe(true);
    expect(component.indice).toBe(1);
  });

});
