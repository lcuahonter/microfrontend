import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnContinuarComponent } from './btn-continuar.component';

describe('BtnContinuarComponent', () => {
  let component: BtnContinuarComponent;
  let fixture: ComponentFixture<BtnContinuarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BtnContinuarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BtnContinuarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
