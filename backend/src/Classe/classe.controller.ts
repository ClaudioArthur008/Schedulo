import { Controller } from '@nestjs/common';
import { ClasseService } from './classe.service';

@Controller('classe')
export class ClasseController {
  constructor(private classeService: ClasseService) {}
}
