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

    // Vérifier si l'utilisateur existe avant de tenter de comparer les mots de passe
    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe invalide');
    }

    // Vérifier si le mot de passe est défini
    if (!user.mot_passe) {
      throw new UnauthorizedException(
        "Erreur avec les informations d'authentification",
      );
    }

    // Vérifier si l'utilisateur est approuvé
    if (!user.approuve) {
      throw new UnauthorizedException(
        `Votre compte n'a pas encore été approuvé par un administrateur.`,
      );
    }

    // Maintenant on peut comparer en toute sécurité
    const isPasswordValid = await bcrypt.compare(password, user.mot_passe);

    if (isPasswordValid) {
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
      role: string;
    };
  } {
    const payload = { sub: user.id_utilisateur, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id_utilisateur,
        email: user.email,
        role: user.role,
      },
    };
  }
}
