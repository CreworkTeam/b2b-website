import { defineAction } from 'astro:actions';
import { sendMail } from './send-mail';
import { z } from 'astro:content';

export const server = {
  contact: defineAction({
    accept: 'form',
    input: z.object({
      name: z.string().min(2).max(50),
      email: z.string().email(),
      phone: z.string(),
      message: z.string().max(500),
    }),
    handler: async ({ name, email, phone, message }) => {
      sendMail({
        to: 'labs@crework.in',
        subject: 'New Enquiry Crework Labs',
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
      });

      return { success: true };
    },
  }),
};
