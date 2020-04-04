import { PipeTransform, BadRequestException } from "@nestjs/common";
import { TaskStatus } from '../task-status.enum';

export class TaskStatusValidationPipe implements PipeTransform {
    readonly allowedValues = [
        TaskStatus.OPEN,
        TaskStatus.IN_PROGRESS,
        TaskStatus.DONE,
    ]
    transform(value: string) {
        const upperCaseValue = value.toUpperCase();
        if (!this.isStatusValid(upperCaseValue)) {
            throw new BadRequestException(`"${value}" is not a valid status`)
        }
        return value;
    }

    private isStatusValid(value: any): boolean {
        const index =  this.allowedValues.indexOf(value);
        return index !== -1;
    }
}