import * as bcrypt from 'bcryptjs';
import { Exclude, Expose, plainToClass } from 'class-transformer';
import { Base } from './base';
import { Entity, Column, BeforeInsert } from 'typeorm';
import { Gender } from '../aspects/enum';

@Entity()
export class User extends Base {
	@Column({
		comment: '帐号',
		unique: true
	})
	account: string;

	@Exclude({ toPlainOnly: true })
	@Column({ comment: '密码' })
	password: string;

	@Column({ comment: '昵称', default: '' })
	nickname: string;

	@Column({ comment: '头像', default: '' })
	avatar: string;

	@Column({ comment: '性别', default: Gender.MALE })
	gender: Gender;

	@Column({ type: 'simple-json', default: {}, comment: '扩展信息' })
	ex_info: any;

	static create(target: Object) {
		return plainToClass(User, target);
	}

	@Expose()
	get avatarPath(): string {
		return Base.getFullPath(this.avatar);
	}

	@BeforeInsert()
	async beforeInsert() {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
	}
}
