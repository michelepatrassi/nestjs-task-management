import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {

    constructor(@InjectRepository(TaskRepository) private taskRepository: TaskRepository) {

    }

    async getTasks(filterDto: GetTaskFilterDto): Promise<Task[]> {
        return this.taskRepository.getTasks(filterDto);
    }

    // getAllTasks(): Task[] {
    //     return this.tasks;
    // }

    // getTasksWithFilters(filterDto: GetTaskFilterDto) {
    //     let tasks = this.getAllTasks();

    //     const {status, search} = filterDto;
    //     if(status) {
    //         tasks = tasks.filter(task => task.status === status)
    //     }

    //     if (search) {
    //         tasks = tasks.filter(task => task.title.includes(search) || task.description.includes(search))
    //     }
    
    //     return tasks;
    // }

    async getTaskById(id: number): Promise<Task> {
        const task = await this.taskRepository.findOne(id)
        
        if (!task) {
            throw new NotFoundException();
        }

        return task;
    }

    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto);
    }

    async deleteTask(id: number): Promise<void> {
       const result = await this.taskRepository.delete(id);
       if (result.affected === 0) {
           throw new NotFoundException();
       }
    }

    async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
        const task = await this.getTaskById(id);
        task.status = status;
        await task.save();

        return task;
    }

    // updateTaskStatus(id: string, status: TaskStatus) {
    //     const task = this.getTaskById(id);
    //     task.status = status;

    //     return task;
    // }
}
