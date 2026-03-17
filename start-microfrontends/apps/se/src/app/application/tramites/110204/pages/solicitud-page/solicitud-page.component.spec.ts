// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Input } from '@angular/core';
import { SolicitudPageComponent } from './solicitud-page.component';
import { SeccionLibStore } from '@ng-mf/data-access-user';
import { of as observableOf } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';



describe('SolicitudPageComponent', () => {
  let component: SolicitudPageComponent;
  let fixture: ComponentFixture<SolicitudPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule,HttpClientTestingModule],
      declarations: [
        SolicitudPageComponent,
      ],
      providers: [SeccionLibStore],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should run #seleccionaTab()', () => {
    const tab = { id: 'tab1' };
    component.seleccionaTab(tab);
  });

  it('should run #getValorIndice() and call wizard methods', () => {
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn()
    };

    component.getValorIndice({ valor: 1, accion: 'siguiente' });
    component.getValorIndice({ valor: 0, accion: 'atras' });
  });
});
