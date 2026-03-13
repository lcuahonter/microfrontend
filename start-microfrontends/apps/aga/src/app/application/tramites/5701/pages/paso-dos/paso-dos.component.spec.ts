import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter } from '@angular/core';
import { PasoDosComponent } from './paso-dos.component';
import { TEXTOS } from '@ng-mf/data-access-user';

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let fixture: ComponentFixture<PasoDosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Como el componente no es standalone, se coloca en declarations.
      declarations: [PasoDosComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoDosComponent);
    component = fixture.componentInstance;

    // Asignamos los EventEmitter de entrada para evitar undefined en ngOnInit.
    component.cargaArchivosEvento = new EventEmitter<void>();
    component.regresarSeccionCargarDocumentoEvento = new EventEmitter<void>();

    // Configuramos espías sobre los métodos emit de los EventEmitter de salida.
    jest.spyOn(component.reenviarEvento, 'emit');
    jest.spyOn(component.reenviarRegresarSeccion, 'emit');
    jest.spyOn(component.reenviarEventoCarga, 'emit');
    jest.spyOn(component.reenviarCargaRealizada, 'emit');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize alertaNotificacion with correct values', () => {
    expect(component.alertaNotificacion).toEqual({
      tipoNotificacion: 'banner',
      categoria: 'warning',
      modo: 'action',
      titulo: '',
      mensaje: TEXTOS.INSTRUCCIONES,
      cerrar: true,
      txtBtnAceptar: '',
      txtBtnCancelar: '',
    });
  });

  it('should emit reenviarEvento when cargaArchivosEvento emits', () => {
    // Emitir el evento de entrada dispara la emisión en reenviarEvento.
    component.cargaArchivosEvento.emit();
    expect(component.reenviarEvento.emit).toHaveBeenCalled();
  });

  it('should emit reenviarRegresarSeccion when regresarSeccionCargarDocumentoEvento emits', () => {
    component.regresarSeccionCargarDocumentoEvento.emit();
    expect(component.reenviarRegresarSeccion.emit).toHaveBeenCalled();
  });

  it('documentosCargados should update cargaRealizada and emit reenviarCargaRealizada', () => {
    // Simulamos true.
    component.documentosCargados(true);
    expect(component.cargaRealizada).toBe(true);
    expect(component.reenviarCargaRealizada.emit).toHaveBeenCalledWith(true);

    // Y luego false.
    component.documentosCargados(false);
    expect(component.cargaRealizada).toBe(false);
    expect(component.reenviarCargaRealizada.emit).toHaveBeenCalledWith(false);
  });

  it('manejarEventoCargaDocumento should emit reenviarEventoCarga with correct value', () => {
    component.manejarEventoCargaDocumento(true);
    expect(component.reenviarEventoCarga.emit).toHaveBeenCalledWith(true);

    component.manejarEventoCargaDocumento(false);
    expect(component.reenviarEventoCarga.emit).toHaveBeenCalledWith(false);
  });
});
