import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PasoDosComponent } from './paso-dos.component';
import { AlertComponent, AnexarDocumentosComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { ToastrModule } from 'ngx-toastr';

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let fixture: ComponentFixture<PasoDosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasoDosComponent],
      imports: [
        HttpClientTestingModule,
        TituloComponent,
        AlertComponent,
        AnexarDocumentosComponent,
        ToastrModule.forRoot()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PasoDosComponent);
    component = fixture.componentInstance;

    component.tiposDocumentos = [
      { id: 1, descripcion: 'INE' },
      { id: 2, descripcion: 'Pasaporte' }
    ];

    component.documentosSeleccionados = [
      {
        id: 1,
        descripcion: 'Documentos que ampare el valor de la mercancía'
      },
      {
        id: 2,
        descripcion: 'Documentos del medio de transporte (Guías, BL o carta porte según corresponda)'
      }
    ];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add document with matching ID to documentosSeleccionados', () => {
    component.agregarDocumento(2);

    expect(component.documentosSeleccionados.length).toBe(3);
    expect(component.documentosSeleccionados[0]).toEqual({ id: 1, descripcion: 'Documentos que ampare el valor de la mercancía' });
  });

  it('should not add any document if ID does not match', () => {
    component.agregarDocumento(3);

    expect(component.documentosSeleccionados.length).toBe(2);
  });
});
