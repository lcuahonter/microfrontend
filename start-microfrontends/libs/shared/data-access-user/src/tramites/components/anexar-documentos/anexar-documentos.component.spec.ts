import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnexarDocumentosComponent } from './anexar-documentos.component';
import { CatalogoDocumento } from '../../../core/models/shared/catalogos.model';
import { EventEmitter, ChangeDetectorRef } from '@angular/core';
import { SubirDocumentoService } from '../../../core/services/shared/subir-documento/subir-documento.service';
import { DocumentosQuery } from '../../../core/queries/documentos.query';
import { DocumentosStore } from '../../../core/estados/documentos.store';

describe('AnexarDocumentosComponent', () => {
  let component: AnexarDocumentosComponent;
  let fixture: ComponentFixture<AnexarDocumentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnexarDocumentosComponent],
      providers: [
        { provide: DocumentosQuery, useValue: {} },
        { provide: DocumentosStore, useValue: {} },
        { provide: SubirDocumentoService, useValue: { subirDocumento: jest.fn(() => ({ pipe: () => ({ subscribe: jest.fn() }) })) } },
        { provide: ChangeDetectorRef, useValue: { detectChanges: jest.fn() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AnexarDocumentosComponent);
    component = fixture.componentInstance;
    component.token = 'test-token';
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar y suscribirse a eventos', () => {
    component.cargaArchivosEvento = new EventEmitter<void>();
    component.regresarSeccionCargarDocumentoEvento = new EventEmitter<void>();
    jest.spyOn(component.cargaArchivosEvento, 'pipe');
    jest.spyOn(component.regresarSeccionCargarDocumentoEvento, 'pipe');
    component.ngOnInit();
    expect(component.cargaArchivosEvento.pipe).toHaveBeenCalled();
    expect(component.regresarSeccionCargarDocumentoEvento.pipe).toHaveBeenCalled();
  });

  it('debe agregar un documento opcional correctamente', () => {
    component.catalogoDocumentosOpcionales = [{ id: 1, descripcion: 'Doc', tam: '1000', dpi: '300', adicionales: [] }];
    component.listDocOpcionalesAgregar = [1];
    component.agregarOpcionales();
    expect(component.documentosOpcionalesSeleccionados.length).toBe(1);
    expect(component.listDocOpcionalesAgregar.length).toBe(0);
  });

  it('debe limpiar un archivo correctamente', () => {
    const doc: CatalogoDocumento = { id: 1, descripcion: 'Doc', tam: '1000', dpi: '300', adicionales: [] };
    component.listadoArchivos = [{ id: 1, name: 'file.pdf', ruta: '', cargado: false, tipo: 'obligatorio', mensaje: '', estatus: 'Pendiente' }];
    document.body.innerHTML = `<input id="formFile1" value="file.pdf">`;
    component.limpiarFile(doc, 'obligatorios');
    expect(component.listadoArchivos.length).toBe(0);
  });

  it('debe eliminar un documento opcional correctamente', () => {
    const doc: CatalogoDocumento = { id: 2, descripcion: 'Opcional', tam: '1000', dpi: '300', adicionales: [] };
    component.documentosOpcionalesSeleccionados = [doc];
    component.listadoArchivos = [{ id: 2, name: 'file.pdf', ruta: '', cargado: false, tipo: 'opcional', mensaje: '', estatus: 'Pendiente' }];
    component.eliminarOpcional(doc);
    expect(component.documentosOpcionalesSeleccionados.length).toBe(0);
    expect(component.listadoArchivos.length).toBe(0);
  });

  it('debe verificar si existe preview de archivo', () => {
    component.listadoArchivos = [{ id: 3, name: 'file.pdf', ruta: '', cargado: false, tipo: 'obligatorio', mensaje: '', estatus: 'Pendiente' }];
    expect(component.existePreview(3)).toBe(true);
    expect(component.existePreview(99)).toBe(false);
  });

  it('debe obtener el nombre del archivo', () => {
    component.listadoArchivos = [{ id: 4, name: 'archivo.pdf', ruta: '', cargado: false, tipo: 'obligatorio', mensaje: '', estatus: 'Pendiente' }];
    expect(component.obtenerNombreArchivo(4)).toBe('archivo.pdf');
    expect(component.obtenerNombreArchivo(99)).toBe('No hay archivo seleccionado');
  });

  it('debe limpiar la notificación', () => {
    component.nuevaNotificacion = { tipoNotificacion: 'alert', categoria: '', modo: '', titulo: '', mensaje: '', cerrar: false, txtBtnAceptar: '', txtBtnCancelar: '', tamanioModal: '' };
    component.limpiarNotificacion();
    expect(component.nuevaNotificacion.tipoNotificacion).toBe('');
  });

  it('debe convertir kilobytes a megabytes', () => {
    expect(component.convertirKilobytesAMegabytes(2048)).toBe(2);
  });

  it('debe convertir kb a mb como string', () => {
    expect(component.convertKbToMb('2000')).toBe('2.00');
    expect(component.convertKbToMb(undefined)).toBe('0');
  });

  it('debe convertir kb a bytes como static', () => {
    expect(AnexarDocumentosComponent.convertirKbaBytes('2')).toBe(2000);
    expect(AnexarDocumentosComponent.convertirKbaBytes(undefined)).toBe(0);
  });

  it('debe mostrar sección de carga de archivos y emitir eventos', () => {
    const activarSpy = jest.spyOn(component.activarBotonCargaArchivos, 'emit');
    const cargaSpy = jest.spyOn(component.cargaRealizada, 'emit');
    component.listadoArchivos = [{ id: 1, name: 'file.pdf', ruta: '', cargado: true, tipo: 'obligatorio', mensaje: '', estatus: 'Pendiente' }];
    component.mostrarSeccionCargaArchivosAccion();
    expect(activarSpy).toHaveBeenCalled();
    expect(cargaSpy).toHaveBeenCalledWith(false);
  });

  it('debe limpiar correctamente en ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});