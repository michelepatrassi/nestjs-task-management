import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Task } from '../tasks/task.entity';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @OneToMany(
    type => Task,
    task => task.user,
    { eager: true },
  )
  tasks: Task[];

  async validatePassword(password: string): Promise<boolean> {
    const pw = await bcrypt.hash(password, this.salt);
    return pw === this.password;
  }

  static generateMock(): User {
    const user = new User();
    user.id = 111111;
    user.username = 'username';
    user.password = 'password';
    user.salt = 'salt';
    user.tasks = [];
    return user;
  }
}
