import { Pipe, PipeTransform } from '@angular/core';
import { NextActionDateStatusService } from '../services/next-action-date.service';

@Pipe({
    name: 'nextActionDateStatus',
})
export class NextActionDateStatusPipe implements PipeTransform {
    constructor(public nextActionDateStatusService: NextActionDateStatusService) { }

    transform(date: string): string {
        return this.nextActionDateStatusService.checkDateStatus(date);
    }
}
