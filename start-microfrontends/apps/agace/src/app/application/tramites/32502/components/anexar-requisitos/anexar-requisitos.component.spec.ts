// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { AnexarRequisitosComponent } from './anexar-requisitos.component';
import { AlertComponent, CatalogoSelectComponent } from '@ng-mf/data-access-user';

// ✅ Mock the JSON file used in the component
jest.mock('libs/shared/theme/assets/json/32502/anexar.json', () => ({
  default: {
    documentos: [
      {
        archivoDisponible: { descripcion: '' },
        fileUrl: ''
      }
    ]
  }
}));

describe('AnexarRequisitosComponent', () => {
  let fixture: ComponentFixture<AnexarRequisitosComponent>;
  let component: AnexarRequisitosComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AnexarRequisitosComponent,
        CommonModule,
        CatalogoSelectComponent,
        ReactiveFormsModule,
        AlertComponent
      ],
      providers: [FormBuilder],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AnexarRequisitosComponent);
    component = fixture.componentInstance;
    global.URL.createObjectURL = jest.fn(() => 'blob:http://localhost/mockfile');
  });

  afterEach(() => {
    if (component) {
      (component as any).ngOnDestroy = () => {};
    }
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should run #constructor()', () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', () => {
    component.anexarEquisitosForm = jest.fn();
    component.ngOnInit();
    expect(component.anexarEquisitosForm).toHaveBeenCalled();
  });

  it('should run #anexarEquisitosForm()', () => {
    component.documentos = ['mock-doc'];
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.anexarEquisitosForm();
    expect(component.fb.group).toHaveBeenCalled();
  });

  it('should run #cambioDeArchivo()', () => {
    component.documentos = [
      {
        archivoDisponible: { descripcion: '' },
        fileUrl: ''
      }
    ];
    component.anexarForm = { patchValue: jest.fn() } as any;

    const mockEvent = {
      target: {
        files: [new File(['test'], 'test-file.txt', { type: 'text/plain' })]
      }
    };

    component.cambioDeArchivo(mockEvent as any, 0);
    expect(component.anexarForm.patchValue).toHaveBeenCalled();
  });

  it('should run #verDocumento()', () => {
    const fileUrl = 'http://example.com/file.pdf';
    component.documentos = [{ fileUrl }];
    window.open = jest.fn();

    component.verDocumento(0);
    expect(window.open).toHaveBeenCalledWith(fileUrl, '_blank');
  });
});
