import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiBasicAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import GetUser from '../Util/Decorator/get-user.decorator';
import UserTermsConditionsUtil from '../Util/Decorator/user-terms-conditions.util';
import AgreeTermsConditionsDto from './dto/agree-terms-conditions.dto';
import CreateTermsConditionsDto from './dto/create-terms-conditions.dto';
import ReadTermsConditionsDto from './dto/read-terms-conditions.dto';
import { TermsConditionsService } from './terms-conditions.service';

@Controller('terms-conditions')
@ApiTags('TermsConditions')
@UseGuards(JwtAuthGuard)
@ApiBasicAuth('Authorization')
export class TermsConditionsController {
  constructor(private termsConditionsService: TermsConditionsService) {}

  @Post('create')
  @ApiCreatedResponse({
    description: 'Terms and conditions created',
    type: ReadTermsConditionsDto,
  })
  @UsePipes(UserTermsConditionsUtil)
  async create(
    @Body() terms: CreateTermsConditionsDto,
    @GetUser() _user,
  ): Promise<any> {
    return await this.termsConditionsService.create(terms);
  }

  @Post('agree')
  @ApiCreatedResponse({
    description: 'Terms and conditions read',
    type: ReadTermsConditionsDto,
  })
  async agree(
    @Body() terms: AgreeTermsConditionsDto,
    @Req() req,
  ): Promise<any> {
    return await this.termsConditionsService.agree(terms, req.user);
  }
}
