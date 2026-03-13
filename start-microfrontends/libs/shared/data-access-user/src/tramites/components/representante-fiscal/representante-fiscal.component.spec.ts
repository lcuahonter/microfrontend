import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepresentanteFiscalComponent } from './representante-fiscal.component';

describe('RepresentanteFiscalComponent', () => {
  let component: RepresentanteFiscalComponent;
  let fixture: ComponentFixture<RepresentanteFiscalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepresentanteFiscalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RepresentanteFiscalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
