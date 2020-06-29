import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AfterVerifypasswordComponent } from './after-verifypassword.component';

describe('AfterVerifypasswordComponent', () => {
  let component: AfterVerifypasswordComponent;
  let fixture: ComponentFixture<AfterVerifypasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AfterVerifypasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AfterVerifypasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
