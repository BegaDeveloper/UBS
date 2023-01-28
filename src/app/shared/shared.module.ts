import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TranslationPipe } from '../pipes/translation.pipe';
import { TranslateService } from '../services/translate.service';

@NgModule({
    declarations: [TranslationPipe],
    exports: [TranslationPipe],
    imports: [CommonModule],
    providers: [TranslateService]
})
export class SharedModule { }