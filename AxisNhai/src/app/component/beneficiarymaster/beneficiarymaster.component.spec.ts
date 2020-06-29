import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiarymasterComponent } from './beneficiarymaster.component';

describe('BeneficiarymasterComponent', () => {
  let component: BeneficiarymasterComponent;
  let fixture: ComponentFixture<BeneficiarymasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeneficiarymasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiarymasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
