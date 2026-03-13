import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitanteDatosTabsComponent } from './solicitante-datos-tabs.component';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SolicitanteDatosTabsComponent', () => {
  let component: SolicitanteDatosTabsComponent;
  let fixture: ComponentFixture<SolicitanteDatosTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SolicitanteDatosTabsComponent],
      imports: [HttpClientModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SolicitanteDatosTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial indice value as 1', () => {
    expect(component.indice).toBe(1);
  });

  it('should update indice value when seleccionaTab is called', () => {
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
  });

  it('should update indice value to 0', () => {
    component.seleccionaTab(0);
    expect(component.indice).toBe(0);
  });

  it('should not update indice value if the same tab is selected', () => {
    component.seleccionaTab(1);
    expect(component.indice).toBe(1);
  });
});