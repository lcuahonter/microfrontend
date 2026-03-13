import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoDosComponent } from './paso-dos.component';
import { CatalogosService } from '@ng-mf/data-access-user';
import { provideHttpClient } from '@angular/common/http';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { AlertComponent } from '@libs/shared/data-access-user/src';
import { ToastrModule } from 'ngx-toastr';
import { ToastrService } from 'ngx-toastr';
import { Component } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-anexar-documentos',
  template: '',
})
class MockAnexarDocumentosComponent {}

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let fixture: ComponentFixture<PasoDosComponent>;
  let catalogosServiceMock: any;

  beforeEach(async () => {
    catalogosServiceMock = {
      getCatalogo: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [
        PasoDosComponent,
        MockAnexarDocumentosComponent,
      ],
      imports: [TituloComponent, AlertComponent, ToastrModule.forRoot()],
      providers: [provideHttpClient(), CatalogosService, ToastrService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasoDosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize TEXTOS', () => {
    expect(component.TEXTOS).toBeDefined();
  });

});
