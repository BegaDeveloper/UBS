import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '../services/translate.service';

@Pipe({
    name: 'translate',
})
export class TranslationPipe implements PipeTransform {
    constructor(public translateService: TranslateService) { }

    transform(value: string) {
        return this.translateService.instant(value);
    }
}