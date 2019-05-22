import { Controller, Req, Res, Param, Query, Get, Post } from '@nestjs/common';
import { CommonService } from '../../common/services/common.service';

@Controller()
export class IndexController {
	constructor(private readonly commonService: CommonService) {}

	@Get()
	async index(@Req() req, @Res() res, @Param() params, @Query() query) {
		const siteInfo = await this.commonService.getSiteInfo();

		return res.render('/', { siteInfo });
	}

	@Get('introduction')
	async introduction(@Req() req, @Res() res, @Param() params, @Query() query) {
		const siteInfo = await this.commonService.getSiteInfo();

		return res.render('/introduction', { siteInfo });
	}

	@Get('characteristic')
	async characteristic(@Req() req, @Res() res, @Param() params, @Query() query) {
		const siteInfo = await this.commonService.getSiteInfo();

		return res.render('/characteristic', { siteInfo });
	}

	@Get('error')
	async error() {
		throw new Error('服务器错误');
	}
}
