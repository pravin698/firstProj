import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiarypopupComponent } from './beneficiarypopup.component';

describe('BeneficiarypopupComponent', () => {
  let component: BeneficiarypopupComponent;
  let fixture: ComponentFixture<BeneficiarypopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeneficiarypopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiarypopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
