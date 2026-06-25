import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { envs } from '../config/envs';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  private readonly transporter: Transporter | null = this.createTransporter();

  private createTransporter(): Transporter | null {
    if (!envs.MAILER_EMAIL || !envs.MAILER_PASSWORD || !envs.MAILER_SERVICE) {
      this.logger.warn(
        'Correo deshabilitado: configura MAILER_EMAIL, MAILER_PASSWORD y MAILER_SERVICE para enviar notificaciones',
      );
      return null;
    }

    return nodemailer.createTransport({
      service: envs.MAILER_SERVICE,
      auth: {
        user: envs.MAILER_EMAIL,
        pass: envs.MAILER_PASSWORD,
      },
    });
  }

  async sendNearbyLostPetsEmail(params: {
    foundPetId: string;
    foundPetNotes: string | null;
    foundLatitude: number;
    foundLongitude: number;
    nearbyLostPets: Array<{
      id: string;
      name: string;
      latitude: number;
      longitude: number;
    }>;
  }) {
    if (!this.transporter || !envs.MAILER_EMAIL) {
      this.logger.warn(
        'Notificación omitida porque el correo no está configurado',
      );
      return false;
    }

    const lostPetsHtml = params.nearbyLostPets
      .map(
        (pet) => `
          <li>
            <strong>${pet.name}</strong><br />
            ID: ${pet.id}<br />
            Ubicación perdida: ${pet.latitude}, ${pet.longitude}
          </li>
        `,
      )
      .join('');

    const html = `
      <h2>PetRadar - Mascota encontrada cerca de una perdida</h2>

      <p>Se registró una mascota encontrada cerca de una o más mascotas perdidas.</p>

      <h3>Mascota encontrada</h3>
      <p>
        <strong>ID:</strong> ${params.foundPetId}<br />
        <strong>Notas:</strong> ${params.foundPetNotes ?? 'Sin notas'}<br />
        <strong>Ubicación encontrada:</strong> ${params.foundLatitude}, ${params.foundLongitude}
      </p>

      <h3>Mascotas perdidas cercanas</h3>
      <ul>
        ${lostPetsHtml}
      </ul>
    `;

    try {
      await this.transporter.sendMail({
        from: envs.MAILER_EMAIL,
        to: envs.MAILER_EMAIL,
        subject: 'PetRadar: posible coincidencia de mascota encontrada',
        html,
      });

      this.logger.log('Correo de coincidencia enviado correctamente');
      return true;
    } catch (error) {
      this.logger.error('Error enviando correo de coincidencia', error);
      return false;
    }
  }
}
