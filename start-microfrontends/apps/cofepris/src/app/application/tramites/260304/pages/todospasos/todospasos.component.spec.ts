import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodospasosComponent } from './todospasos.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CatalogosService } from '@libs/shared/data-access-user/src/core/services/shared/catalogos/catalogos.service';
import { of, throwError } from 'rxjs';
import { Catalogo } from '@libs/shared/data-access-user/src/core/models/shared/catalogos.model';
import { PASO_UNO, PASO_DOS, PASO_TRES } from '../../constantes/certificados-licencias-permisos.enum';
import { WizardComponent } from '@libs/shared/data-access-user/src/tramites/components/wizard/wizard.component';
import { AccionBoton } from '@libs/shared/data-access-user/src/core/models/301/servicios-pantallas.model';

jest.mock('@libs/shared/data-access-user/src/core/services/shared/catalogos/catalogos.service');

describe('TodospasosComponent', () => {
  let component: TodospasosComponent;
  let fixture: ComponentFixture<TodospasosComponent>;
  let mockCatalogosService: jest.Mocked<CatalogosService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodospasosComponent, require('@angular/common/http/testing').HttpClientTestingModule],
      providers: [
        {
          provide: CatalogosService,
          useValue: {
            getCatalogo: jest.fn()
          }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TodospasosComponent);
    component = fixture.componentInstance;
    mockCatalogosService = TestBed.inject(CatalogosService) as jest.Mocked<CatalogosService>;
    fixture.detectChanges();
  });

  it('debería crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería establecer el título correctamente cuando índice es 1', () => {
    component.indice = 1;
    component.getHeaderDatos();
    expect(component.titulo).toBe(PASO_DOS);
  });

  it('debería establecer el título correctamente cuando índice es 2', () => {
    component.indice = 2;
    component.getHeaderDatos();
    expect(component.titulo).toBe(PASO_TRES);
  });

  it('debería establecer el título como PASO_UNO para otros valores de índice', () => {
    component.indice = 99;
    component.getHeaderDatos();
    expect(component.titulo).toBe(PASO_UNO);
  });

  it('debería actualizar el índice y avanzar si acción es "cont"', () => {
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn()
    } as unknown as WizardComponent;

    const accion: AccionBoton = { valor: 2, accion: 'cont' };
    component.getValorIndice(accion);
    expect(component.indice).toBe(2);
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
  });

  it('debería actualizar el índice y retroceder si acción es distinta de "cont"', () => {
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn()
    } as unknown as WizardComponent;

    const accion: AccionBoton = { valor: 3, accion: 'otro' };
    component.getValorIndice(accion);
    expect(component.indice).toBe(3);
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  it('no debería hacer nada si valor no está entre 1 y 4', () => {
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn()
    } as unknown as WizardComponent;

    const accion: AccionBoton = { valor: 6, accion: 'cont' };
    component.getValorIndice(accion);
    expect(component.indice).not.toBe(6);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
  });

  it('debería llenar el catálogo de documentos cuando la respuesta tiene elementos', () => {
    const mockCatalogo: Catalogo[] = [{ id: 1, descripcion: 'Doc' }] as Catalogo[];
    mockCatalogosService.getCatalogo.mockReturnValue(of(mockCatalogo));
    component.getTiposDocumentos();
    expect(component.catalogoDocumentos).toEqual(mockCatalogo);
  });

  it('no debería modificar catalogoDocumentos si la respuesta está vacía', () => {
    mockCatalogosService.getCatalogo.mockReturnValue(of([]));
    component.catalogoDocumentos = [{ id: 2, descripcion: 'Existente' }] as Catalogo[];
    component.getTiposDocumentos();
    expect(component.catalogoDocumentos).toEqual([{ id: 2, descripcion: 'Existente' }]);
  });

  it('debería manejar errores al obtener el catálogo', () => {
    mockCatalogosService.getCatalogo.mockReturnValue(throwError(() => new Error('error')));
    expect(() => component.getTiposDocumentos()).not.toThrow();
  });

  it('debería completar el observable al destruir el componente', () => {
    const spy = jest.spyOn(component['destroyed$'], 'next');
    const completeSpy = jest.spyOn(component['destroyed$'], 'complete');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
