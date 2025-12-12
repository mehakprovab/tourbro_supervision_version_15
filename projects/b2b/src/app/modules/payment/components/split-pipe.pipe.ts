import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'splitPipe'
})
export class SplitPipePipe implements PipeTransform {

    transform(value: string, delimiter: string): string[] {
        if (!value) return [];
        return value.split(delimiter);
      }
}
