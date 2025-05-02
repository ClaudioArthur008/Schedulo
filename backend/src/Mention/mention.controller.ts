import { Controller } from "@nestjs/common";
import { MentionService } from "./module.service";

@Controller('mention')
export class MentionController{
    constructor (private mentionService : MentionService) {}
}