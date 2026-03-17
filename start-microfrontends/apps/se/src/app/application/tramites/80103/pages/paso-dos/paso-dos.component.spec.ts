import { PasoDosComponent } from './paso-dos.component';

import { of, Subject } from 'rxjs';
import { EventEmitter } from '@angular/core';
import { DestroyRef } from '@angular/core';
import { CatalogosService } from '@libs/shared/data-access-user/src';

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let catalogosServiceMock: jest.Mocked<CatalogosService>;

  beforeEach(() => {
    catalogosServiceMock = {
      getCatalogo: jest.fn()
    } as any;

    component = new PasoDosComponent(catalogosServiceMock);
    component.cargaArchivosEvento = new EventEmitter<void>();
    component.regresarSeccionCargarDocumentoEvento = new EventEmitter<void>();
    jest.spyOn(component.reenviarEvento, 'emit');
    jest.spyOn(component.reenviarRegresarSeccion, 'emit');
    jest.spyOn(component.reenviarCargaRealizada, 'emit');
    jest.spyOn(component.reenviarEventoCarga, 'emit');
  });

  it('debería emitir reenviarEvento al activarse cargaArchivosEvento', () => {
    component.ngOnInit();
    component.cargaArchivosEvento.emit();

    expect(component.reenviarEvento.emit).toHaveBeenCalled();
  });

  it('debería llamar getCatalogo y asignar el catálogo', () => {
    const fakeCatalog = [
      { id: 1, nombre: 'Doc A', descripcion: 'Descripción A' }
    ];

    catalogosServiceMock.getCatalogo.mockReturnValue(of(fakeCatalog));

    component.getTiposDocumentos();

    expect(catalogosServiceMock.getCatalogo).toHaveBeenCalled();
    expect(component.catalogoDocumentos).toEqual(fakeCatalog);
  });

  it('debería actualizar cargaRealizada y emitir evento en documentosCargados()', () => {
    component.documentosCargados(true);

    expect(component.cargaRealizada).toBe(true);
    expect(component.reenviarCargaRealizada.emit).toHaveBeenCalledWith(true);
  });

  it('debería emitir evento desde manejarEventoCargaDocumento()', () => {
    component.manejarEventoCargaDocumento(true);

    expect(component.reenviarEventoCarga.emit).toHaveBeenCalledWith(true);
  });

  it('debería limpiar destroyed$ al destruir el componente', () => {
    const completeSpy = jest.spyOn(component['destroyed$'], 'complete');
    const nextSpy = jest.spyOn(component['destroyed$'], 'next');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
