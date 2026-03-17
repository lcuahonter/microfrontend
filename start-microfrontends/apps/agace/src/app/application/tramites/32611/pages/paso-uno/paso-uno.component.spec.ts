import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { BtnContinuarComponent, SolicitanteComponent } from '@libs/shared/data-access-user/src';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PasoUnoComponent
      ],
      imports: [
        CommonModule,
        SolicitanteComponent,
        BtnContinuarComponent,
        HttpClientTestingModule
        
      ],
      schemas:[NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default indice value as 1', () => {
    expect(component.indice).toBe(1);
  });

  it('should update indice when seleccionaTab is called', () => {
    component.indice = 1;
    expect(component.indice).toBe(1);

    component.seleccionaTab(2);
    expect(component.indice).toBe(2);

    component.seleccionaTab(3);
    expect(component.indice).toBe(3);

    component.seleccionaTab(4);
    expect(component.indice).toBe(4);
  });

});
