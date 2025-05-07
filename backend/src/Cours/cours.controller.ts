import { Controller } from '@nestjs/common';
import { CoursService } from './cours.service';

@Controller('cours')
export class CoursController {
  constructor(private coursService: CoursService) {}
}
