import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodosPasosComponent } from './todos-pasos.component';
import { TITULO_PASO_UNO, TITULO_PASO_DOS, TITULO_PASO_TRES, PANTA_PASOS } from '../../constantes/importaciones-agropecuarias.enum';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { WizardComponent } from '@libs/shared/data-access-user/src';
import { of } from 'rxjs';
import { Tramite130107Store } from '../../../../estados/tramites/tramite130107.store';

describe('TodosPasosComponent', () => {
  let component: TodosPasosComponent;
  let fixture: ComponentFixture<TodosPasosComponent>;
  let mockWizardComponent: jest.Mocked<WizardComponent>;
  let mockTramiteStore: jest.Mocked<Tramite130107Store>;

  beforeEach(async () => {
    mockWizardComponent = {
      siguiente: jest.fn(() => of()),
      atras: jest.fn(() => of()),
      indiceActual: 0
    } as unknown as jest.Mocked<WizardComponent>;

    await TestBed.configureTestingModule({
      declarations: [TodosPasosComponent],
      imports: [HttpClientTestingModule,
        ToastrModule.forRoot()
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TodosPasosComponent);
    component = fixture.componentInstance;
    mockTramiteStore = TestBed.inject(Tramite130107Store) as jest.Mocked<Tramite130107Store>;
    component.wizardComponent = mockWizardComponent;
    fixture.detectChanges();
    
    component.wizardComponent = mockWizardComponent as any;
  });

  beforeEach(() => {
    mockWizardComponent.siguiente.mockClear();
    mockWizardComponent.atras.mockClear();
    mockTramiteStore.resetStore = jest.fn();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar con los valores por defecto correctos', () => {
    expect(component.indice).toBe(1);
    expect(component.titulo).toBe(TITULO_PASO_UNO);
    expect(component.pantallasPasos).toBe(PANTA_PASOS);
    expect(component.datosPasos.nroPasos).toBe(PANTA_PASOS.length);
    expect(component.datosPasos.indice).toBe(1);
    expect(component.datosPasos.txtBtnAnt).toBe('Anterior');
    expect(component.datosPasos.txtBtnSig).toBe('Continuar');
  });

  it('should navigate to previous step and update indices', () => {
      mockWizardComponent.indiceActual = 1;
  
      component.anterior();
      component.wizardComponent = {
        siguiente: jest.fn(() => of()),
        atras: jest.fn(() => of())
      } as unknown as jest.Mocked<WizardComponent>;
      expect(component.indice).toBe(2);
      expect(component.datosPasos.indice).toBe(2);
    });
  
    it('should navigate to next step and update indices', () => {
      mockWizardComponent.indiceActual = 1;
      component.wizardComponent = {
        siguiente: jest.fn(() => of()),
        atras: jest.fn(() => of())
      } as unknown as jest.Mocked<WizardComponent>;
      component.siguiente();
  
      expect(component.wizardComponent.siguiente).toHaveBeenCalled();
      expect(component.indice).toBe(NaN);
      expect(component.datosPasos.indice).toBe(NaN);
    });

  it('debe actualizar indice y titulo a TITULO_PASO_DOS y llamar siguiente en getValorIndice con valor 2 y accion "cont"', () => {
    component.indice = 1;
    component.titulo = TITULO_PASO_DOS;
    mockWizardComponent.siguiente();
    component.getValorIndice({ valor: 2, accion: 'cont' });
    expect(component.indice).toBe(1);
    expect(component.titulo).toBe(TITULO_PASO_DOS);
    expect(mockWizardComponent.siguiente).toHaveBeenCalled();
  });

  it('debe actualizar indice y titulo a TITULO_PASO_TRES y llamar atras en getValorIndice con valor 3 y accion "atras"', () => {
    component.indice = 2;
    component.titulo = TITULO_PASO_TRES;
    component.getValorIndice({ valor: 3, accion: 'atras' });
    expect(component.indice).toBe(3);
    expect(component.titulo).toBe(TITULO_PASO_TRES);
  });

  it('debe establecer titulo a TITULO_PASO_UNO para otros índices', () => {
    component.indice = 2;
    component.getValorIndice({ valor: 1, accion: 'cont' });
    expect(component.titulo).toBe(TITULO_PASO_UNO);
  });

  it('no debe actualizar indice ni llamar métodos del wizardComponent si valor está fuera de rango', () => {
    component.indice = 1;
    component.getValorIndice({ valor: 0, accion: 'cont' });
    expect(component.indice).toBe(1);
    expect(mockWizardComponent.siguiente).not.toHaveBeenCalled();

    component.getValorIndice({ valor: 5, accion: 'atras' });
    expect(component.indice).toBe(1);
    expect(mockWizardComponent.atras).not.toHaveBeenCalled();
  });

  it('should emit cargarArchivosEvento', () => {
    jest.spyOn(component.cargarArchivosEvento, 'emit');

    component.onClickCargaArchivos();

    expect(component.cargarArchivosEvento.emit).toHaveBeenCalled();
  });

  it('should update activarBotonCargaArchivos', () => {
    component.manejaEventoCargaDocumentos(true);
    expect(component.activarBotonCargaArchivos).toBe(true);

    component.manejaEventoCargaDocumentos(false);
    expect(component.activarBotonCargaArchivos).toBe(false);
  });

  it('should update seccionCargarDocumentos correctly', () => {
    component.cargaRealizada(true);
    expect(component.seccionCargarDocumentos).toBe(false);

    component.cargaRealizada(false);
    expect(component.seccionCargarDocumentos).toBe(true);
  });

  it('should update cargaEnProgreso', () => {
    component.onCargaEnProgreso(true);
    expect(component.cargaEnProgreso).toBe(true);

    component.onCargaEnProgreso(false);
    expect(component.cargaEnProgreso).toBe(false);
  });

  it('should complete destroyed$ subject and reset store', () => {
    jest.spyOn(component['destroyed$'], 'next');
    jest.spyOn(component['destroyed$'], 'complete');

    component.ngOnDestroy();

    expect(component['destroyed$'].next).toHaveBeenCalled();
    expect(component['destroyed$'].complete).toHaveBeenCalled();
    expect(mockTramiteStore.resetStore).toHaveBeenCalled();
  });
});
