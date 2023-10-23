import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMediaComponent } from './manage-media.component';

describe('ManageMediaComponent', () => {
  let component: ManageMediaComponent;
  let fixture: ComponentFixture<ManageMediaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageMediaComponent]
    });
    fixture = TestBed.createComponent(ManageMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
