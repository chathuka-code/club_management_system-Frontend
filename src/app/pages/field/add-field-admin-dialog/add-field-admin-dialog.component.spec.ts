import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFieldAdminDialogComponent } from './add-field-admin-dialog.component';

describe('AddFieldAdminDialogComponent', () => {
  let component: AddFieldAdminDialogComponent;
  let fixture: ComponentFixture<AddFieldAdminDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddFieldAdminDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFieldAdminDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
