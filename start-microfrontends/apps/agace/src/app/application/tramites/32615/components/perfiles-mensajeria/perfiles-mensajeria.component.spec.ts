import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PerfilesMensajeriaComponent } from './perfiles-mensajeria.component';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of, Subject } from 'rxjs';
import { Tramite32615PerfilesMensajeriaStore } from '../../../../estados/tramites/tramite32615_perfilesMensajeria.store';
import { Tramite32615PerfilesMensajeriaQuery } from '../../../../estados/queries/tramite32615_perfilesMensajeria.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { OPCIONES_DE_BOTON_DE_RADIO, VIGENCIA } from '@libs/shared/data-access-user/src/tramites/constantes/32615/datos-comunes.enum';
import { FECHA_DE_PAGO } from '../../constantes/perfiles.enum';
import { TEXTOS_ESTATICOS_MENSAJERIA } from '../../constantes/texto-estatico.enum';

describe('PerfilesMensajeriaComponent', () => {
  let component: PerfilesMensajeriaComponent;
  let fixture: ComponentFixture<PerfilesMensajeriaComponent>;
  let mockStore: jest.Mocked<Tramite32615PerfilesMensajeriaStore>;
  let mockQuery: jest.Mocked<Tramite32615PerfilesMensajeriaQuery>;
  let mockConsultaioQuery: jest.Mocked<ConsultaioQuery>;

  beforeEach(async () => {
    mockStore = {
      setDomicilio: jest.fn(),
      setAntiguedad: jest.fn(),
      setActividad: jest.fn(),
      setProductos: jest.fn(),
      setEmbarquesExp: jest.fn(),
      setEmbarquesImp: jest.fn(),
      setEmpleados: jest.fn(),
      setSuperficie: jest.fn(),
      setVigencia: jest.fn(),
      setVigenciaDos: jest.fn(),
      setVigenciaTres: jest.fn(),
      setPip: jest.fn(),
      setNumeroRegistro: jest.fn(),
      setOea: jest.fn(),
      setNumeroPrograma: jest.fn(),
      setNumeroRegistroOEA: jest.fn(),
      setOtrosProgramas: jest.fn(),
      setNumeroProgramaOtros: jest.fn(),
      setNumeroRegistroOtros: jest.fn(),
      setFechaVigenciaProfile: jest.fn(),
      setNombre: jest.fn(),
      setCategoria: jest.fn(),
      setNombre2: jest.fn(),
      setCategoria2: jest.fn(),
      setNombre3: jest.fn(),
      setCategoria3: jest.fn(),
    } as unknown as jest.Mocked<Tramite32615PerfilesMensajeriaStore>;

    mockQuery = {
      selectSolicitud$: of({
        domicilio: '',
        antiguedad: '',
        actividad: '',
        productos: '',
        embarquesExp: '',
        embarquesImp: '',
        empleados: '',
        superficie: '',
        nombre: '',
        categoria: '',
        vigencia: '',
        nombre2: '',
        categoria2: '',
        vigencia2: '',
        nombre3: '',
        categoria3: '',
        vigencia3: '',
        pip: '',
        numeroRegistroOEA: '',
        oea: '',
        numeroPrograma: '',
        otrosProgramas: '',
        numeroProgramaOtros: '',
        numeroRegistroOtros: '',
        fechaVigenciaProfile: '',
        numeroRegistro: ''
      })
    } as unknown as jest.Mocked<Tramite32615PerfilesMensajeriaQuery>;

    mockConsultaioQuery = {
      selectConsultaioState$: of({ readonly: false })
    } as unknown as jest.Mocked<ConsultaioQuery>;

    await TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule, FormsModule, PerfilesMensajeriaComponent],
      declarations: [],
      providers: [
        FormBuilder,
        { provide: Tramite32615PerfilesMensajeriaStore, useValue: mockStore },
        { provide: Tramite32615PerfilesMensajeriaQuery, useValue: mockQuery },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilesMensajeriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario con valores por defecto', () => {
    expect(component.profileForm).toBeDefined();
    expect(component.profileForm.controls['domicilio'].value).toBe('');
    expect(component.profileForm.controls['antiguedad'].value).toBe('');
  });

  it('debería alternar la visibilidad de la sección', () => {
    component.alternarContenido();
    expect(component.mostrarContenido).toBe(true);
    component.alternarContenido();
    expect(component.mostrarContenido).toBe(false);
  });

  it('debería alternar mostrarSeguridad cuando se llama a alternarSeguridad', () => {
    expect(component.mostrarSeguridad).toBe(false);
    component.alternarSeguridad();
    expect(component.mostrarSeguridad).toBe(true);
    component.alternarSeguridad();
    expect(component.mostrarSeguridad).toBe(false);
  });

  it('debería alternar mostrarAccesoFisico cuando se llama a alternarAccesoFisico', () => {
    expect(component.mostrarAccesoFisico).toBe(false);
    component.alternarAccesoFisico();
    expect(component.mostrarAccesoFisico).toBe(true);
    component.alternarAccesoFisico();
    expect(component.mostrarAccesoFisico).toBe(false);
  });

  it('debería alternar mostrarSociosComerciales cuando se llama a alternarSociosComerciales', () => {
    expect(component.mostrarSociosComeciales).toBe(false);
    component.alternarSociosComerciales();
    expect(component.mostrarSociosComeciales).toBe(true);
    component.alternarSociosComerciales();
    expect(component.mostrarSociosComeciales).toBe(false);
  });

  it('debería alternar mostrarSeguridadProcesos cuando se llama a alternarSeguridadProcesos', () => {
    expect(component.mostrarSeguridadProcesos).toBe(false);
    component.alternarSeguridadProcesos();
    expect(component.mostrarSeguridadProcesos).toBe(true);
    component.alternarSeguridadProcesos();
    expect(component.mostrarSeguridadProcesos).toBe(false);
  });

  it('debería alternar mostrarGestionAduanera cuando se llama a alternarGestionAduanera', () => {
    expect(component.mostrarGestionAduanera).toBe(false);
    component.alternarGestionAduanera();
    expect(component.mostrarGestionAduanera).toBe(true);
    component.alternarGestionAduanera();
    expect(component.mostrarGestionAduanera).toBe(false);
  });

  it('debería alternar mostrarSeguridadPersonal cuando se llama a alternarSeguridadPersonal', () => {
    expect(component.mostrarSeguridadPersonal).toBe(false);
    component.alternarSeguridadPersonal();
    expect(component.mostrarSeguridadPersonal).toBe(true);
    component.alternarSeguridadPersonal();
    expect(component.mostrarSeguridadPersonal).toBe(false);
  });

  it('debería alternar mostrarSeguridadVehiculos cuando se llama a alternarSeguridadVehiculos', () => {
    expect(component.mostrarSeguridadVehiculos).toBe(false);
    component.alternarSeguridadVehiculos();
    expect(component.mostrarSeguridadVehiculos).toBe(true);
    component.alternarSeguridadVehiculos();
    expect(component.mostrarSeguridadVehiculos).toBe(false);
  });

  it('debería alternar mostrarSeguridadInformacion cuando se llama a alternarSeguridadInformacion', () => {
    expect(component.mostrarSeguridadInformacion).toBe(false);
    component.alternarSeguridadInformacion();
    expect(component.mostrarSeguridadInformacion).toBe(true);
    component.alternarSeguridadInformacion();
    expect(component.mostrarSeguridadInformacion).toBe(false);
  });

  it('debería alternar mostrarCapacitacionSeguridad cuando se llama a alternarCapacitacionSeguridad', () => {
    expect(component.mostrarCapacitacionSeguridad).toBe(false);
    component.alternarCapacitacionSeguridad();
    expect(component.mostrarCapacitacionSeguridad).toBe(true);
    component.alternarCapacitacionSeguridad();
    expect(component.mostrarCapacitacionSeguridad).toBe(false);
  });

  it('debería actualizar valores en el store cuando cambia el formulario', () => {
    const testValue = 'Valor de prueba';
    component.profileForm.controls['domicilio'].setValue(testValue);
    component.setValoresStore(component.profileForm, 'domicilio', 'setDomicilio');
    expect(mockStore.setDomicilio).toHaveBeenCalledWith(testValue);
  });

  it('debería manejar cambios de fecha', () => {
    const testDate = '2023-01-01';
    component.cambioFechaInicio(testDate, component.profileForm, 'fechaVigenciaProfile', 'setFechaVigenciaProfile');
    expect(component.profileForm.controls['fechaVigenciaProfile'].value).toBe(testDate);
    expect(mockStore.setFechaVigenciaProfile).toHaveBeenCalledWith(testDate);
  });

  it('debería actualizar campos numéricos en el store', () => {
    const testNumber = '5';
    component.profileForm.controls['antiguedad'].setValue(testNumber);
    component.actualizarAntiguedad();
    expect(mockStore.setAntiguedad).toHaveBeenCalledWith(testNumber);
  });

  it('debería inicializar con formulario de solo lectura cuando consultaioQuery devuelve readonly true', fakeAsync(() => {
    mockConsultaioQuery.selectConsultaioState$ = of({
      readonly: true,
    } as any);
    const newFixture = TestBed.createComponent(PerfilesMensajeriaComponent);
    const newComponent = newFixture.componentInstance;
    newFixture.detectChanges();
    tick();
    
    expect(newComponent.esFormularioSoloLectura).toBe(true);
    expect(newComponent.profileForm.disabled).toBeFalsy();
    expect(newComponent.profileForm.controls['domicilio'].disabled).toBe(true);
  }));

  it('debería tener textos estáticos inicializados', () => {
    expect(component.textos).toEqual(TEXTOS_ESTATICOS_MENSAJERIA);
  });

  it('debería tener opciones de radio inicializadas', () => {
    expect(component.opcionDeBotonDeRadio).toEqual(OPCIONES_DE_BOTON_DE_RADIO);
  });

  it('debería tener configuraciones de entrada de fecha inicializadas', () => {
    expect(component.fechaInicioInput).toEqual(FECHA_DE_PAGO);
    expect(component.fechaVigenciaInput).toEqual(VIGENCIA);
  });

  it('debería limpiar suscripciones al destruir el componente', () => {
    const destroySpy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    
    component.ngOnDestroy();
    
    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});