import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterDataUploadComponent } from './master-data-upload.component';

describe('MasterDataUploadComponent', () => {
  let component: MasterDataUploadComponent;
  let fixture: ComponentFixture<MasterDataUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterDataUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterDataUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
