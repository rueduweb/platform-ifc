import {
  email,
  maxLength,
  minLength,
  pattern,
  required,
  schema,
} from '@angular/forms/signals';


/* ======================
   DOMAIN MODEL
======================= */

export type Partner = {
  id: number;
  name: string;
  description: string;
  email: string;
  phone: string | null;
  logo: string | null;
  video: string | null;
  activity: string;
  address: string;
  contact: string | null;
  socialMedia: string | null;
};


/* ======================
   STATE
======================= */

export type PartnersState = {
  partners: Partner[];
  loading: boolean;
  error: string | null;
};


/* ======================
   FORM MODEL
======================= */

/*
 * Le modèle utilisé par Signal Forms.
 *
 * Les propriétés nullable du modèle Partner
 * deviennent des strings dans le formulaire.
 *
 * socialMedia est volontairement un tableau
 * afin de permettre plusieurs URLs dans l'UI.
 */
export type PartnerFormModel = {
  name: string;
  description: string;
  email: string;
  phone: string;
  logo: string;
  video: string;
  activity: string;
  address: string;
  contact: string;
  socialMedia: string[];
};


/* ======================
   EMPTY FORM
======================= */

export const partnerFormEmpty: PartnerFormModel = {
  name: '',
  description: '',
  email: '',
  phone: '',
  logo: '',
  video: '',
  activity: '',
  address: '',
  contact: '',
  socialMedia: [],
};


/* ======================
   FORM SCHEMA
======================= */

export const partnerFormSchema =
  schema<PartnerFormModel>((path) => {

    /* NAME */

    required(path.name, {
      message: 'Le nom est obligatoire.',
    });

    minLength(path.name, 2, {
      message:
        'Le nom doit contenir au moins 2 caractères.',
    });

    maxLength(path.name, 100, {
      message:
        'Le nom ne peut pas dépasser 100 caractères.',
    });


    /* DESCRIPTION */

    required(path.description, {
      message:
        'La description est obligatoire.',
    });

    minLength(path.description, 10, {
      message:
        'La description doit contenir au moins 10 caractères.',
    });

    maxLength(path.description, 1000, {
      message:
        'La description ne peut pas dépasser 1000 caractères.',
    });


    /* EMAIL */

    required(path.email, {
      message: 'L\'email est obligatoire.',
    });

    email(path.email, {
      message:
        'Veuillez saisir une adresse email valide.',
    });


    /* PHONE */

    pattern(path.phone, /^\+?[0-9\s().-]{7,20}$/,
      {
        message:
          'Le numéro de téléphone n\'est pas valide.',
      },
    );


    /* ACTIVITY */

    required(path.activity, {
      message:
        'L\'activité est obligatoire.',
    });

    minLength(path.activity, 2, {
      message:
        'L\'activité doit contenir au moins 2 caractères.',
    });

    maxLength(path.activity, 150, {
      message:
        'L\'activité ne peut pas dépasser 150 caractères.',
    });


    /* ADDRESS */

    required(path.address, {
      message:
        'L\'adresse est obligatoire.',
    });

    minLength(path.address, 5, {
      message:
        'L\'adresse doit contenir au moins 5 caractères.',
    });

    maxLength(path.address, 300, {
      message:
        'L\'adresse ne peut pas dépasser 300 caractères.',
    });


    /* LOGO */

    pattern(path.logo, /^$|^https?:\/\/.+$/i,
      {
        message:
          'Le logo doit être une URL valide.',
      },
    );


    /* VIDEO */

    pattern(path.video, /^$|^https?:\/\/.+$/i,
      {
        message:
          'La vidéo doit être une URL valide.',
      },
    );


    /* CONTACT */

    maxLength(path.contact, 150, {
      message:
        'Le contact ne peut pas dépasser 150 caractères.',
    });


    /*
     * SOCIAL MEDIA
     *
     * Ici socialMedia est un string[].
     *
     * La conversion vers string se fera uniquement
     * au moment de construire le DTO.
     */
  });
