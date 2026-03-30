import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('attendances')
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  employee_id: number;

  @Column({ type: 'date' })
  attendance_date: string;

  @Column({ type: 'datetime' })
  check_in_time: Date;

  @Column({ nullable: true })
  photo_path?: string;

  @Column({ nullable: true })
  note?: string;
}