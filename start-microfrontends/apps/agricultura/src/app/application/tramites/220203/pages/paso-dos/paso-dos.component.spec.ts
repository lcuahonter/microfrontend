// @ts-nocheck
import { TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasoDosComponent } from './paso-dos.component';
import { CatalogosService } from '@ng-mf/data-access-user';
import { HttpClientModule } from '@angular/common/http';
import { of as observableOf } from 'rxjs';

describe('PasoDosComponent', () => {
  let fixture;
  let componente;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, HttpClientModule ],
      declarations: [
        PasoDosComponent,
      ],
      providers: [
        CatalogosService
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(PasoDosComponent);
    componente = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    componente.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('debería ejecutar el constructor', async () => {
    expect(componente).toBeTruthy();
  });

  it('debería ejecutar ngOnInit', async () => {
    componente.getTiposDocumentos = jest.fn();
    componente.ngOnInit();
  });

  it('debería ejecutar getTiposDocumentos', async () => {
    componente.catalogosServices = componente.catalogosServices || {};
    componente.catalogosServices.getCatalogo = jest.fn().mockReturnValue(observableOf({}));
    componente.getTiposDocumentos();
  });

  it('debería ejecutar ngOnDestroy', async () => {
    componente.destroyNotifier$ = componente.destroyNotifier$ || {};
    componente.destroyNotifier$.next = jest.fn();
    componente.destroyNotifier$.complete = jest.fn();
    componente.ngOnDestroy();
  });

});
