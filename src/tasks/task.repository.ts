import { Task } from './task.entity';
import { Repository, EntityRepository } from "typeorm";
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { User } from '../auth/user.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
    async getTasks(filterDto: GetTaskFilterDto): Promise<Task[]> {
        const {status, search} = filterDto;
        const qb = this.createQueryBuilder('task');

        if (status) {
            qb.andWhere('task.status = :status', {status})
        }

        if (search) {
            qb.andWhere('(task.title LIKE :search OR task.description LIKE :search)', {search: `%${search}%`})
        }

        const tasks = await qb.getMany();

        return tasks;
    }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const {title, description} = createTaskDto;

        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        task.user = user;
        await task.save();

        delete task.user;

        return task;
    }
}