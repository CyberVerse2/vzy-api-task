import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { IsEmail } from "class-validator";

@Entity()
export abstract class BaseUser {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ nullable: true })
  username!: string;

  @Column({ unique: true })
  @IsEmail()
  email!: string;
}
