import { AbstractControl } from '@angular/forms';
import * as dayjs from 'dayjs';

export class DateValidator {
    static dateValidator(AC: AbstractControl) {
        if (AC.value) {
            const date = dayjs(AC.value);
            if (date && !dayjs(date, 'DD.MM.YYYY', true).isValid()) {
                return { dateValidator: true };
            }
        }
        return null;
    }
}