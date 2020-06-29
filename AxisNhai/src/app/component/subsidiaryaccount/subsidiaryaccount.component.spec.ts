import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubsidiaryaccountComponent } from './subsidiaryaccount.component';

describe('SubsidiaryaccountComponent', () => {
  let component: SubsidiaryaccountComponent;
  let fixture: ComponentFixture<SubsidiaryaccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubsidiaryaccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubsidiaryaccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
