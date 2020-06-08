import { Task } from './task.entity';
import { Repository, EntityRepository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { User } from '../auth/user.entity';
import { Logger, InternalServerErrorException } from '@nestjs/common';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('TaskRepository');

  async getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const qb = this.createQueryBuilder('task');

    qb.where('task.userId = :userId', { userId: user.id });

    if (status) {
      qb.andWhere('task.status = :status', { status });
    }

    if (search) {
      qb.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    try {
      const tasks = await qb.getMany();

      return tasks;
    } catch (e) {
      this.logger.error(
        `Failed to get tasks for user ${user.id}. Filters ${JSON.stringify(
          filterDto,
          null,
          2,
        )}`,
        e.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;
    try {
      await task.save();

      delete task.user;

      return task;
    } catch (e) {
      this.logger.error(
        `Failed to create task for user ${user.id}. Filters ${JSON.stringify(
          createTaskDto,
          null,
          2,
        )}`,
        e.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
