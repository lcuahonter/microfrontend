// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { of as observableOf } from 'rxjs';

import { PasoDosComponent } from './paso-dos.component';
import { CatalogosService } from '@ng-mf/data-access-user';

// ✅ Mock JSON import para documentos seleccionados
jest.mock('@libs/shared/theme/assets/json/32502/document-list.json', () => ({
  default: {
    documentosSeleccionados: [{ id: 1, descripcion: 'Documento Mock' }]
  }
}));

// ✅ Directiva ficticia para evitar errores de plantilla
@Directive({ selector: '[myCustom]' })
class MyCustomDirective {
  @Input() myCustom: any;
}

// ✅ Pipes ficticios usados en el HTML del componente
@Pipe({ name: 'translate' })
class TranslatePipe implements PipeTransform {
  transform(value: any): any {
    return value;
  }
}

@Pipe({ name: 'phoneNumber' })
class PhoneNumberPipe implements PipeTransform {
  transform(value: any): any {
    return value;
  }
}

@Pipe({ name: 'safeHtml' })
class SafeHtmlPipe implements PipeTransform {
  transform(value: any): any {
    return value;
  }
}

describe('PasoDosComponent', () => {
  let fixture: ComponentFixture<PasoDosComponent>;
  let component: PasoDosComponent;
  let catalogosServiceMock: Partial<CatalogosService>;

  beforeEach(async () => {
    // ✅ Mockea el método getCatalogo para que devuelva un observable válido
    catalogosServiceMock = {
      getCatalogo: jest.fn().mockReturnValue(observableOf([
        { id: 1, descripcion: 'Tipo A' },
        { id: 2, descripcion: 'Tipo B' }
      ]))
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, HttpClientModule],
      declarations: [
        PasoDosComponent,
        TranslatePipe,
        PhoneNumberPipe,
        SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: CatalogosService, useValue: catalogosServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoDosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // 🔥 Aquí se llama automáticamente a ngOnInit
  });

  afterEach(() => {
    component.ngOnDestroy();
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getTiposDocumentos on ngOnInit', () => {
    const spy = jest.spyOn(component, 'getTiposDocumentos');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should clean up destroy$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should set catalogoDocumentos from service response', () => {
    const expectedCatalog = [
      { id: 1, descripcion: 'Tipo A' },
      { id: 2, descripcion: 'Tipo B' }
    ];
    component.getTiposDocumentos();
    expect(component.catalogoDocumentos).toEqual(expectedCatalog);
  });

  it('should initialize documentosSeleccionados from mock JSON', () => {
    expect(component.documentosSeleccionados).toEqual([{ id: 1, descripcion: 'Documento Mock' }]);
  });
});
