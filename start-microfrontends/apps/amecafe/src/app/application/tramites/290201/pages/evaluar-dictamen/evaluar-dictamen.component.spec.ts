import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluarDictamenComponent } from './evaluar-dictamen.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('EvaluarDictamenComponent', () => {
  let component: EvaluarDictamenComponent;
  let fixture: ComponentFixture<EvaluarDictamenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EvaluarDictamenComponent,],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], 
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EvaluarDictamenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
