const sgMail = require('@sendgrid/mail');
const twilio = require('twilio');
const db = require('../config/db');

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Initialize Twilio
let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

/**
 * Send email via SendGrid
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - Email body (HTML)
 */
const sendEmail = async (to, subject, html) => {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      console.warn('⚠️  SENDGRID_API_KEY not configured, skipping email');
      return false;
    }

    if (!to) {
      console.warn('⚠️  No email address provided for notification');
      return false;
    }

    const msg = {
      to,
      from: process.env.FROM_EMAIL || 'noreply@hackttrain.com',
      subject,
      html,
    };

    await sgMail.send(msg);
    console.log(`✓ Email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('✗ Error sending email:', error.message);
    return false;
  }
};

/**
 * Send SMS via Twilio
 * @param {string} to - Recipient phone (E.164 format, e.g., +261234567890)
 * @param {string} body - SMS message body
 */
const sendSMS = async (to, body) => {
  try {
    if (!twilioClient || !process.env.TWILIO_FROM_NUMBER) {
      console.warn('⚠️  Twilio not configured, skipping SMS');
      return false;
    }

    if (!to) {
      console.warn('⚠️  No phone number provided for SMS notification');
      return false;
    }

    await twilioClient.messages.create({
      from: process.env.TWILIO_FROM_NUMBER,
      to,
      body,
    });

    console.log(`✓ SMS sent to ${to}`);
    return true;
  } catch (error) {
    console.error('✗ Error sending SMS:', error.message);
    return false;
  }
};

/**
 * Get user by command ID (user owns the command)
 */
const getUserByCommandId = async (idCommand) => {
  try {
    const result = await db.query(
      'SELECT u.id_users, u.email, u.phone FROM users u JOIN command c ON u.id_users = c.id_users WHERE c.id_command = $1',
      [idCommand]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching user by command:', error.message);
    return null;
  }
};

/**
 * Notify on livraison (delivery) status change
 */
const notifyLivraisonStatusChange = async (idLivraison, idCommand, oldStatus, newStatus) => {
  try {
    const user = await getUserByCommandId(idCommand);
    if (!user) {
      console.warn(`⚠️  User not found for command ${idCommand}`);
      return;
    }

    let subject, emailHtml, smsBody;

    // Determine message content based on status change
    if (newStatus === 'en cours') {
      subject = 'Votre commande est en cours de livraison';
      emailHtml = `<p>Bonjour,</p><p>Votre livraison #${idLivraison} est maintenant en cours de préparation et de livraison.</p><p>Merci de votre patience!</p>`;
      smsBody = `Livraison #${idLivraison}: En cours de livraison`;
    } else if (newStatus === 'livré') {
      subject = 'Votre commande a été livrée !';
      emailHtml = `<p>Bonjour,</p><p>Votre livraison #${idLivraison} a été livrée avec succès!</p><p>Merci de votre achat.</p>`;
      smsBody = `Livraison #${idLivraison}: Livrée avec succès !`;
    } else if (newStatus === 'annulé') {
      subject = 'Votre livraison a été annulée';
      emailHtml = `<p>Bonjour,</p><p>Votre livraison #${idLivraison} a été annulée.</p><p>Veuillez contacter le support pour plus d'informations.</p>`;
      smsBody = `Livraison #${idLivraison}: Annulée`;
    } else {
      return; // No notification for other statuses
    }

    // Send email and SMS in parallel
    await Promise.all([
      sendEmail(user.email, subject, emailHtml),
      sendSMS(user.phone, smsBody),
    ]);
  } catch (error) {
    console.error('Error notifying livraison status change:', error.message);
  }
};

/**
 * Notify on payment webhook status change
 */
const notifyPaymentStatusChange = async (idCommand, status, amount = null) => {
  try {
    const user = await getUserByCommandId(idCommand);
    if (!user) {
      console.warn(`⚠️  User not found for command ${idCommand}`);
      return;
    }

    let subject, emailHtml, smsBody;

    if (status === 'success') {
      const amountText = amount ? `${amount} Ar` : 'confirmation reçue';
      subject = 'Paiement confirmé';
      emailHtml = `<p>Bonjour,</p><p>Votre paiement de ${amountText} a été accepté avec succès.</p><p>Merci!</p>`;
      smsBody = `Paiement de ${amountText} confirmé`;
    } else if (status === 'failed') {
      subject = 'Echec du paiement';
      emailHtml = `<p>Bonjour,</p><p>Votre paiement a échoué.</p><p>Veuillez réessayer ou contacter le support.</p>`;
      smsBody = `Votre paiement a échoué. Réessayez SVP.`;
    } else if (status === 'processing') {
      subject = 'Paiement en cours de traitement';
      emailHtml = `<p>Bonjour,</p><p>Votre paiement est en cours de traitement. Nous vous confirmerons le résultat sous peu.</p>`;
      smsBody = `Paiement en cours de traitement...`;
    } else {
      return; // No notification for pending or other statuses
    }

    await Promise.all([
      sendEmail(user.email, subject, emailHtml),
      sendSMS(user.phone, smsBody),
    ]);
  } catch (error) {
    console.error('Error notifying payment status change:', error.message);
  }
};

/**
 * Notify on wishlist event (add or remove)
 */
const notifyWishlistEvent = async (user, event, productName = 'Produit') => {
  try {
    if (!user || !user.email) {
      console.warn('⚠️  User not provided or user has no email for wishlist notification');
      return;
    }

    let subject, emailHtml, smsBody;

    if (event === 'added') {
      subject = 'Produit ajouté à votre wishlist';
      emailHtml = `<p>Bonjour,</p><p>"${productName}" a été ajouté à votre liste de souhaits.</p><p>Continuez vos achats!</p>`;
      smsBody = `"${productName}" ajouté à votre wishlist`;
    } else if (event === 'removed') {
      subject = 'Produit retiré de votre wishlist';
      emailHtml = `<p>Bonjour,</p><p>"${productName}" a été retiré de votre liste de souhaits.</p>`;
      smsBody = `"${productName}" retiré de votre wishlist`;
    } else {
      return;
    }

    await Promise.all([
      sendEmail(user.email, subject, emailHtml),
      sendSMS(user.phone, smsBody),
    ]);
  } catch (error) {
    console.error('Error notifying wishlist event:', error.message);
  }
};

module.exports = {
  sendEmail,
  sendSMS,
  notifyLivraisonStatusChange,
  notifyPaymentStatusChange,
  notifyWishlistEvent,
};
