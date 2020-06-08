import { TasksService } from './tasks.service';
import { Test } from '@nestjs/testing';
import { TaskRepository } from './task.repository';
import { User } from '../auth/user.entity';

const mockTaskRepository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn()
})

const mockUser = User.generateMock()

describe('TasksService', () => {
    let tasksService: TasksService;
    let taskRepository: TaskRepository

    beforeEach(async() => {
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                {provide: TaskRepository, useFactory: mockTaskRepository}
            ]
        }).compile();

        tasksService = module.get(TasksService)
        taskRepository = module.get(TaskRepository)
    })

    describe('getTasks', () => {
        it('gets all tasks from the repository', async () => {
            (taskRepository.getTasks as jest.Mock).mockResolvedValue('someValue');
            expect(taskRepository.getTasks).not.toHaveBeenCalled()

            const result = await tasksService.getTasks({},mockUser)

            expect(taskRepository.getTasks).toHaveBeenCalled()
            expect(result).toEqual('someValue')
        })
        
    });

    describe('getTaskById', () => {
        it('calls taskRepository.findOne() and successfully retrieve and return the task', async () => {
            const mockTask = {title: 'foo'};
            (taskRepository.findOne as jest.Mock).mockResolvedValue(mockTask)
            expect(taskRepository.findOne).not.toHaveBeenCalled();

            const result = await tasksService.getTaskById(1, mockUser)

            expect(result).toEqual(mockTask)
            expect(taskRepository.findOne).toHaveBeenCalledWith();
        })

        // it.todo('throws an error as task is not found', async () => {
            
        // });
        
    })
    
});