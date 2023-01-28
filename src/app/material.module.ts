import { NgModule } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule, MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { MatBadgeModule } from '@angular/material/badge';

@NgModule({
    imports: [
        MatSelectModule,
        MatDatepickerModule,
        MatInputModule,
        MatFormFieldModule,
        MatNativeDateModule,
        MatTableModule,
        MatMenuModule,
        MatExpansionModule,
        MatButtonModule,
        MatDialogModule,
        MatSnackBarModule,
        MatPaginatorModule,
        MatCheckboxModule,
        MatCardModule,
        MatChipsModule,
        MatIconModule,
        MatRadioModule,
        MatBadgeModule,
    ],
    exports: [
        MatSelectModule,
        MatDatepickerModule,
        MatInputModule,
        MatFormFieldModule,
        MatNativeDateModule,
        MatTableModule,
        MatMenuModule,
        MatExpansionModule,
        MatButtonModule,
        MatDialogModule,
        MatSnackBarModule,
        MatPaginatorModule,
        MatCheckboxModule,
        MatCardModule,
        MatChipsModule,
        MatIconModule,
        MatRadioModule,
        MatBadgeModule,
    ],
    providers: [
        { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } },
        { provide: MAT_DATE_LOCALE, useValue: 'sr-Latn' },
        { provide: MAT_RADIO_DEFAULT_OPTIONS, useValue: { color: 'primary' } },
    ],
})
export class MaterialModule {}
