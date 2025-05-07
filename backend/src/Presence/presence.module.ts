import { Module } from "@nestjs/common";
import { PresenceController } from "./presence.controller";
import { PresenceService } from "./presence.service";
import { Presence } from "./presence.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [TypeOrmModule.forFeature([Presence])],
    controllers: [PresenceController],
    providers: [PresenceService],
})
export class PresenceModule {}