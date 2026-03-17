import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudPageComponent } from './solicitud-page.component';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AccionBoton, WizardComponent } from '@ng-mf/data-access-user';

describe('SolicitudPageComponent', () => {
  let component: SolicitudPageComponent;
  let fixture: ComponentFixture<SolicitudPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudPageComponent, HttpClientTestingModule],
      providers: [{
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            params: {},
            queryParams: {}
          }
        }
      }]

    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct default values', () => {
    expect(component.tituloMensaje).toBe('Permiso sanitario de importación de medicamentos y materias primas destinados a maquila');
    expect(component.indice).toBe(1);
    expect(component.pasos).toBeDefined();
    expect(component.datosPasos).toBeDefined();
    expect(component.datosPasos.nroPasos).toBe(component.pasos.length);
    expect(component.datosPasos.indice).toBe(1);
    expect(component.datosPasos.txtBtnAnt).toBe('Anterior');
    expect(component.datosPasos.txtBtnSig).toBe('Continuar');
  });

  describe('seleccionaTab', () => {
    it('should update indice when called', () => {
      component.seleccionaTab(2);
      expect(component.indice).toBe(2);

      component.seleccionaTab(3);
      expect(component.indice).toBe(3);
    });
  });

  describe('getValorIndice', () => {
    beforeEach(() => {
      // Initialize component first
      fixture.detectChanges();
      
      // Mock the wizard component methods
      component.wizardComponent = {
        siguiente: jest.fn(),
        atras: jest.fn()
      } as any;
    });

    it('should update indice and titulo when valor is valid and accion is "cont"', () => {
      const accionBoton: AccionBoton = { valor: 2, accion: 'cont' };
      
      component.getValorIndice(accionBoton);
      
      expect(component.indice).toBe(2);
      expect(component.tituloMensaje).toBe('Anexar requisitos');
      expect(component.wizardComponent.siguiente).toHaveBeenCalled();
    });

    it('should update indice and titulo when valor is valid and accion is not "cont"', () => {
      const accionBoton: AccionBoton = { valor: 1, accion: 'prev' };
      
      component.getValorIndice(accionBoton);
      
      expect(component.indice).toBe(1);
      expect(component.tituloMensaje).toBe('Permiso sanitario de importación de medicamentos con registro sanitario');
      expect(component.wizardComponent.atras).toHaveBeenCalled();
    });

    it('should not update when valor is 0', () => {
      const initialIndice = component.indice;
      const initialTitulo = component.tituloMensaje;
      const accionBoton: AccionBoton = { valor: 0, accion: 'cont' };
      
      component.getValorIndice(accionBoton);
      
      expect(component.indice).toBe(initialIndice);
      expect(component.tituloMensaje).toBe(initialTitulo);
      expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
      expect(component.wizardComponent.atras).not.toHaveBeenCalled();
    });

    it('should not update when valor is 5 or greater', () => {
      const initialIndice = component.indice;
      const initialTitulo = component.tituloMensaje;
      const accionBoton: AccionBoton = { valor: 5, accion: 'cont' };
      
      component.getValorIndice(accionBoton);
      
      expect(component.indice).toBe(initialIndice);
      expect(component.tituloMensaje).toBe(initialTitulo);
      expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
      expect(component.wizardComponent.atras).not.toHaveBeenCalled();
    });

    it('should handle negative valores', () => {
      const initialIndice = component.indice;
      const initialTitulo = component.tituloMensaje;
      const accionBoton: AccionBoton = { valor: -1, accion: 'cont' };
      
      component.getValorIndice(accionBoton);
      
      expect(component.indice).toBe(initialIndice);
      expect(component.tituloMensaje).toBe(initialTitulo);
      expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
      expect(component.wizardComponent.atras).not.toHaveBeenCalled();
    });
  });

  describe('obtenerNombreDelTítulo', () => {
    it('should return correct title for step 1', () => {
      const title = SolicitudPageComponent.obtenerNombreDelTítulo(1);
      expect(title).toBe('Permiso sanitario de importación de medicamentos con registro sanitario');
    });

    it('should return correct title for step 2', () => {
      const title = SolicitudPageComponent.obtenerNombreDelTítulo(2);
      expect(title).toBe('Anexar requisitos');
    });

    it('should return correct title for step 3', () => {
      const title = SolicitudPageComponent.obtenerNombreDelTítulo(3);
      expect(title).toBe('Firmar solicitud');
    });

    it('should return default title for invalid step numbers', () => {
      const title1 = SolicitudPageComponent.obtenerNombreDelTítulo(0);
      const title2 = SolicitudPageComponent.obtenerNombreDelTítulo(4);
      const title3 = SolicitudPageComponent.obtenerNombreDelTítulo(-1);
      
      expect(title1).toBe('Permiso sanitario de importación de medicamentos con registro sanitario');
      expect(title2).toBe('Permiso sanitario de importación de medicamentos con registro sanitario');
      expect(title3).toBe('Permiso sanitario de importación de medicamentos con registro sanitario');
    });
  });
});
