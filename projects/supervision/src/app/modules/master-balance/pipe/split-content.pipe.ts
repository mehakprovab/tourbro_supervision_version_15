import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'splitContent'
})
export class SplitContentPipe implements PipeTransform {
 
    transform(value: string, delimiter: string): string[] {
        if (!value) return [];
        return value.split(delimiter);
      }
}
