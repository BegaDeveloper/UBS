import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainRoutingModule, routingLinks } from './main-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/material.module';
import { DelayedInputDirective } from 'src/app/directives/delayed-input.directive';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { CurrencyPipe } from '@angular/common';
import { TruncatePipe } from 'src/app/pipes/truncate-text.pipe';
import { NextActionDateStatusPipe } from 'src/app/pipes/next-action-date.pipe';
import { NextActionDateStatusService } from 'src/app/services/next-action-date.service';
import { CustomComponentsModule } from './reusable-components/custom-components.module';
import { ApiKeyComponent } from './components/application/app-action/api-key/api-key.component';
import { DigitOnlyDirective } from 'src/app/directives/onlyDigits.directive';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
    declarations: [
        SideMenuComponent,
        DelayedInputDirective,
        TruncatePipe,
        NextActionDateStatusPipe,
        routingLinks,
        ApiKeyComponent,
        DigitOnlyDirective,
    ],

    imports: [
        CommonModule,
        MainRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MaterialModule,
        SharedModule,
        CustomComponentsModule,
        AngularEditorModule,
    ],
    exports: [DelayedInputDirective, TruncatePipe],
    providers: [CurrencyPipe, NextActionDateStatusService],
})
export class MainModule {}
