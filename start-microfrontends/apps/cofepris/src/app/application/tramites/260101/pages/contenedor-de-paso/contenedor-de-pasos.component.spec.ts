import { TestBed } from '@angular/core/testing';
import { ContenedorDePasosComponent } from './contenedor-de-pasos.component';
import { WizardComponent } from '@ng-mf/data-access-user';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { DatosDeLaSolicitudComponent } from '../../../../shared/components/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { PagoDeDerechosComponent } from '../../../../shared/components/pago-de-derechos-new/pago-de-derechos.component';
import { CommonModule } from '@angular/common';
import {
  BtnContinuarComponent,
  NotificacionesComponent,
  AlertComponent,
} from '@ng-mf/data-access-user';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { PasoTresComponent } from '../paso-tres/paso-tres.component';
import {
  MENSAJE_DE_VALIDACION,
  PASOS,
  TITULOMENSAJE,
} from '../../constants/medicos-uso.enum';
import { AVISO_CONTRNIDO } from '@ng-mf/data-access-user';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('ContenedorDePasosComponent', () => {
  let component: ContenedorDePasosComponent;
  let fixture: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ContenedorDePasosComponent,
        CommonModule,
        WizardComponent,
        PasoUnoComponent,
        PasoDosComponent,
        PasoTresComponent,
        BtnContinuarComponent,
        NotificacionesComponent,
        DatosDeLaSolicitudComponent,
        PagoDeDerechosComponent,
        AlertComponent,
        HttpClientTestingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContenedorDePasosComponent);
    component = fixture.componentInstance;

    component.pasoUnoComponent = {
      validarPasoUno: jest.fn().mockReturnValue(true),
    } as any;
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as any;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize avisoContrnido with AVISO_CONTRNIDO.aviso', () => {
    expect(component.avisoContrnido).toBe(AVISO_CONTRNIDO.aviso);
  });

  it('should initialize tituloMensaje with TITULOMENSAJE', () => {
    expect(component.tituloMensaje).toBe(TITULOMENSAJE);
  });

  it('should initialize pasos with PASOS', () => {
    expect(component.pasos).toBe(PASOS);
  });

  it('should set indice when seleccionaTab is called', () => {
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
  });

  it('should advance step if accion is "cont" and pasoUnoComponent is valid', () => {
    component.indice = 1;
    component.wizardComponent = {
      siguiente: jest.fn(() => of()),
      atras: jest.fn(() => of()),
    } as any;
    component.getValorIndice({ accion: 'cont', valor: 2 });
    expect(component.indice).toBe(1);
    expect(component.datosPasos.indice).toBe(1);
  });

  it('should show alert and not advance if accion is "cont" and pasoUnoComponent is invalid', () => {
    component.indice = 1;
    component.wizardComponent = {
      siguiente: jest.fn(() => of()),
      atras: jest.fn(() => of()),
    } as any;
    component.getValorIndice({ accion: 'cont', valor: 2 });
    expect(component.mostrarAlerta).toBe(true);
    expect(component.MENSAJE_DE_ERROR).toBe(MENSAJE_DE_VALIDACION);
    expect(component.seleccionarFilaNotificacion.mensaje).toBe(
      MENSAJE_DE_VALIDACION
    );
    expect(component.indice).toBe(1);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
  });

  it('should go back if accion is not "cont"', () => {
    component.indice = 2;
    component.wizardComponent = {
      siguiente: jest.fn(() => of()),
      atras: jest.fn(() => of()),
    } as any;
    component.getValorIndice({ accion: 'ant', valor: 1 });
    expect(component.indice).toBe(1);
    expect(component.datosPasos.indice).toBe(1);
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  it('should return TITULOMENSAJE for step 1', () => {
    expect(ContenedorDePasosComponent.obtenerNombreDelTítulo(1)).toBe(
      TITULOMENSAJE
    );
  });
  it('should return "Cargar archivos" for step 2', () => {
    expect(ContenedorDePasosComponent.obtenerNombreDelTítulo(2)).toBe(
      'Cargar archivos'
    );
  });
  it('should return "Firmar" for step 3', () => {
    expect(ContenedorDePasosComponent.obtenerNombreDelTítulo(3)).toBe('Firmar');
  });
  it('should return TITULOMENSAJE for unknown step', () => {
    expect(ContenedorDePasosComponent.obtenerNombreDelTítulo(99)).toBe(
      TITULOMENSAJE
    );
  });
});
