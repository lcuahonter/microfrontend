import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudTabComponentsComponent } from './solicitud-tab-components.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('SolicitudTabComponentsComponent', () => {
  let component: SolicitudTabComponentsComponent;
  let fixture: ComponentFixture<SolicitudTabComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
      
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudTabComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});