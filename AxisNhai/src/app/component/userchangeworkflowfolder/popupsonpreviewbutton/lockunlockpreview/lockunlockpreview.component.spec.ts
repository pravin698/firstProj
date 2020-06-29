import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LockunlockpreviewComponent } from './lockunlockpreview.component';

describe('LockunlockpreviewComponent', () => {
  let component: LockunlockpreviewComponent;
  let fixture: ComponentFixture<LockunlockpreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LockunlockpreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LockunlockpreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
