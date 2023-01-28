import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReusableTableComponent } from './reusable-table/reusable-table.component';
import { MaterialModule } from '../../../material.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
    declarations: [ReusableTableComponent],
    imports: [CommonModule, MaterialModule, RouterModule, SharedModule],
    exports: [ReusableTableComponent],
})
export class CustomComponentsModule {}
