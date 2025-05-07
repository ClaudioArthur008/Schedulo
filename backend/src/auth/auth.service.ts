import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Utilisateur } from '../Utilisateur/utilisateur.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Utilisateur)
    private userRepo: Repository<Utilisateur>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepo.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.mot_passe))) {
      const { mot_passe, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Email ou mot de passe invalide');
  }

  login(user: Utilisateur): {
    access_token: string;
    user: {
      id: number;
      email: string;
      prenom: string;
      nom: string;
      role: string;
    };
  } {
    const payload = { sub: user.id_utilisateur, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id_utilisateur,
        email: user.email,
        prenom: user.prenom,
        nom: user.nom,
        role: user.role,
      },
    };
  }
}
