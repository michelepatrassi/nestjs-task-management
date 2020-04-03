import { Task, TaskStatus } from './task.model';
import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid/v1';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTasks(): Task[] {
        return this.tasks;
    }
    
    createTask(title: string, description: string): Task {
        const task: Task = {
            title,
            description,
            status: TaskStatus.OPEN,
            id: uuid()
        }

        this.tasks.push(task);

        return task;
    }
}
