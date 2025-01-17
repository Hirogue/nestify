import * as _ from 'lodash';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransformClassToPlain } from 'class-transformer';
import { BaseService } from './base.service';
import { User } from '../entities/user.entity';


@Injectable()
export class UserService extends BaseService<User> {
	constructor(
		private readonly jwtService: JwtService,
		@InjectRepository(User) private readonly userRepository: Repository<User>
	) {
		super(userRepository);
	}

	@TransformClassToPlain()
	async findOneById(id) {
		return await this.userRepository.findOne({ id });
	}

	async login(account, password) {
		const user = await this.userRepository.findOne({ account });

		if (!user) throw new BadRequestException('用户不存在');

		if (!await bcrypt.compare(password, user.password)) throw new BadRequestException('密码错误');

		return await this.jwtService.sign(_.toPlainObject(user));
	}

	async changePassword(id, dto) {
		const user = await this.userRepository.findOne({ id });

		if (!await bcrypt.compare(dto.oldPassword, user.password)) throw new BadRequestException('旧密码错误');

		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(dto.password, salt);

		return await this.userRepository.save(user);
	}

	@TransformClassToPlain()
	async save(payload: any) {
		const user = User.create(payload) as User;

		return await this.userRepository.save(user);
	}
}
