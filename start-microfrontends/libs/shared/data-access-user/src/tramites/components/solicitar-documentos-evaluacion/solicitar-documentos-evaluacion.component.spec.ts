import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitarDocumentosEvaluacionComponent } from './solicitar-documentos-evaluacion.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SolicitudDocumentosStore } from '../../../core/estados/solicitud-documentos.store';
import { SolicitudDocumentosQuery } from '../../../core/queries/solicitud-documentos.query';
import { of } from 'rxjs';

describe('SolicitarDocumentosEvaluacionComponent', () => {
  let component: SolicitarDocumentosEvaluacionComponent;
  let fixture: ComponentFixture<SolicitarDocumentosEvaluacionComponent>;
  let mockStore: any;
  let mockQuery: any;

  beforeEach(async () => {
    mockStore = {
      setSolicitudDocumentos: jasmine.createSpy('setSolicitudDocumentos'),
    };
    mockQuery = {
      selectSolicitud$: of({
        listaDocumentos: [],
      }),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, SolicitarDocumentosEvaluacionComponent],
      providers: [
        FormBuilder,
        { provide: SolicitudDocumentosStore, useValue: mockStore },
        { provide: SolicitudDocumentosQuery, useValue: mockQuery },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitarDocumentosEvaluacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario y los datos en ngOnInit', () => {
    component.ngOnInit();
    expect(component.formSolicitudDocumentos).toBeDefined();
    expect(component.catTipoDocumento.length).toBeGreaterThan(0);
    expect(component.exampleDocumentosRequeridos.length).toBeGreaterThan(0);
  });

  it('debe marcar el formulario como tocado y mostrar notificación si el formulario es inválido al agregar documento', () => {
    component.ngOnInit();
    component.formSolicitudDocumentos.setValue({ tipoDocumento: '' });
    component.agregarDocumento();
    expect(component.nuevaNotificacion).toBeDefined();
    expect(component.nuevaNotificacion.mensaje).toBe('Debe seleccionar al menos una opción.');
  });

  it('debe mostrar notificación si el tipoDocumentoId es inválido al agregar documento', () => {
    component.ngOnInit();
    component.formSolicitudDocumentos.setValue({ tipoDocumento: 'abc' });
    component.agregarDocumento();
    expect(component.nuevaNotificacion).toBeDefined();
    expect(component.nuevaNotificacion.mensaje).toBe('Debe seleccionar al menos una opción.');
  });

  it('debe agregar un documento correctamente', () => {
    component.ngOnInit();
    const tipoDocumentoValido = component.catTipoDocumento[0].id;
    component.formSolicitudDocumentos.setValue({ tipoDocumento: tipoDocumentoValido });
    component.listadoDocumentos = [];
    component.agregarDocumento();
    expect(component.listadoDocumentos.length).toBe(1);
    expect(component.listadoDocumentos[0].id).toBe(tipoDocumentoValido);
    expect(mockStore.setSolicitudDocumentos).toHaveBeenCalled();
  });

  it('debe limpiar el formulario después de agregar un documento', () => {
    component.ngOnInit();
    const tipoDocumentoValido = component.catTipoDocumento[0].id;
    component.formSolicitudDocumentos.setValue({ tipoDocumento: tipoDocumentoValido });
    component.agregarDocumento();
    expect(component.formSolicitudDocumentos.get('tipoDocumento')?.value).toBe('');
  });

  it('debe mostrar notificación si no hay documentos para eliminar', () => {
    component.documentosSeleccionados = [];
    component.eliminarDocumento();
    expect(component.nuevaNotificacion).toBeDefined();
    expect(component.nuevaNotificacion.mensaje).toBe('No hay documentos para eliminar.');
  });

  it('debe eliminar documentos seleccionados correctamente', () => {
    component.listadoDocumentos = [
      { id: 1, description: 'Doc 1' },
      { id: 2, description: 'Doc 2' },
    ];
    component.documentosSeleccionados = [{ id: 1, description: 'Doc 1' }];
    component.eliminarDocumento();
    expect(component.listadoDocumentos.length).toBe(1);
    expect(component.listadoDocumentos[0].id).toBe(2);
    expect(mockStore.setSolicitudDocumentos).toHaveBeenCalled();
    expect(component.documentosSeleccionados.length).toBe(0);
  });

  it('debe establecer valores en el store correctamente', () => {
    component.ngOnInit();
    const spy = jasmine.createSpy('metodoStore');
    mockStore['metodoTest'] = spy;
    component.formSolicitudDocumentos.get('tipoDocumento')?.setValue('valorTest');
    component.setValoresStore(component.formSolicitudDocumentos, 'tipoDocumento', 'metodoTest' as any);
    expect(spy).toHaveBeenCalledWith('valorTest');
  });
});