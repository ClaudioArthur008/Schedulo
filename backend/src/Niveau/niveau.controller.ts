import { Controller } from '@nestjs/common';
import { NiveauService } from './niveau.service';

@Controller('niveau')
export class NiveauController {
  constructor(private niveauService: NiveauService) {}
}
