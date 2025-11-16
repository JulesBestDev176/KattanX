// Supabase Edge Function pour envoyer des messages WhatsApp
// Déployer avec: supabase functions deploy send-whatsapp

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Configuration Green API
const WHATSAPP_API_URL = Deno.env.get('WHATSAPP_API_URL') || 'https://7107.api.green-api.com';
const WHATSAPP_API_KEY = Deno.env.get('WHATSAPP_API_KEY') || 'b6e8d8fdc3c3462882c3e52f3033f29909e1404556f94ee996';
const WHATSAPP_INSTANCE_ID = Deno.env.get('WHATSAPP_INSTANCE_ID') || '7107382500';

serve(async (req) => {
  try {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    };

    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders });
    }

    const { to, message, otp } = await req.json();

    if (!to || !message) {
      return new Response(
        JSON.stringify({ error: 'Numéro de téléphone et message requis' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Option 1: Utiliser Green API (service WhatsApp populaire)
    if (WHATSAPP_API_KEY && WHATSAPP_INSTANCE_ID) {
      // Format de l'URL Green API: https://{apiUrl}/waInstance{idInstance}/sendMessage/{apiTokenInstance}
      const greenApiUrl = `${WHATSAPP_API_URL}/waInstance${WHATSAPP_INSTANCE_ID}/sendMessage/${WHATSAPP_API_KEY}`;
      
      // Formater le numéro de téléphone pour WhatsApp (enlever le + et ajouter @c.us)
      const whatsappNumber = to.replace(/\+/g, '').replace(/\s+/g, '');
      
      const response = await fetch(greenApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId: `${whatsappNumber}@c.us`,
          message: message,
        }),
      });

      const responseData = await response.json();

      if (response.ok && responseData.idMessage) {
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'Message WhatsApp envoyé avec succès',
            messageId: responseData.idMessage 
          }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      } else {
        // Si l'instance n'est pas autorisée ou autre erreur
        const errorMsg = responseData?.text || responseData?.message || 'Erreur lors de l\'envoi WhatsApp';
        console.error('Green API Error:', errorMsg, responseData);
        
        // Si l'instance n'est pas autorisée, retourner une erreur spécifique
        if (errorMsg.includes('Unauthorized') || errorMsg.includes('not authorized')) {
          return new Response(
            JSON.stringify({ 
              error: 'Instance WhatsApp non autorisée. Veuillez scanner le QR code pour autoriser l\'instance.',
              demo: true,
              otp: otp 
            }),
            {
              status: 401,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }
        
        throw new Error(errorMsg);
      }
    }

    // Option 2: Utiliser Twilio WhatsApp API
    // Vous devez avoir un compte Twilio avec WhatsApp activé
    const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID');
    const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN');
    const TWILIO_WHATSAPP_FROM = Deno.env.get('TWILIO_WHATSAPP_FROM') || 'whatsapp:+14155238886';

    if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
      const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
      
      const formData = new URLSearchParams();
      formData.append('From', TWILIO_WHATSAPP_FROM);
      formData.append('To', `whatsapp:${to}`);
      formData.append('Body', message);

      const response = await fetch(twilioUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      if (response.ok) {
        return new Response(
          JSON.stringify({ success: true, message: 'Message WhatsApp envoyé via Twilio' }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    // Si aucune API n'est configurée, retourner une erreur
    return new Response(
      JSON.stringify({ 
        error: 'Service WhatsApp non configuré. Veuillez configurer Green API ou Twilio.',
        demo: true,
        otp: otp // Retourner l'OTP en mode démo
      }),
      {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Erreur lors de l\'envoi WhatsApp' }),
      {
        status: 500,
        headers: { 
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json' 
        },
      }
    );
  }
});


