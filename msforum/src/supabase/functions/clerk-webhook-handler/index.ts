import { createClient } from 'npm:@supabase/supabase-js@2';

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-signature'
};
Deno.serve(async (req)=>{

  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', {
      status: 405,
      headers: corsHeaders
    });
  }

  try {
    const webhookSignature = req.headers.get('x-webhook-signature');

    const webhookApiKey = Deno.env.get('WEBHOOK_API_KEY');
    const webhookSecret = Deno.env.get('CLERK_WEBHOOK_SECRET');

    const bodyText = await req.text();
    let isAuthenticated = false;

    if (webhookSignature && webhookSecret) {
      try {
        isAuthenticated = await verifyClerkWebhookSignature(webhookSignature, bodyText, webhookSecret);
        if (isAuthenticated) {
          console.log("Autenticato tramite firma webhook Clerk");
        }
      } catch (error) {
        console.error("Errore nella verifica della firma:", error);
      }
    }

    if (!isAuthenticated && webhookApiKey) {
      const authHeader = req.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        if (token === webhookApiKey) {
          isAuthenticated = true;
          console.log("Autenticato tramite chiave API");
        }
      }
    }

    if (!isAuthenticated) {
      return new Response('Unauthorized', {
        status: 401,
        headers: corsHeaders
      });
    }

    let body;
    try {
      body = JSON.parse(bodyText);
    } catch (e) {
      return new Response('Invalid JSON', {
        status: 400,
        headers: corsHeaders
      });
    }
    const { type, data } = body;

    if (type === 'user.created') {

      const supabase = createClient(Deno.env.get('SUPABASE_URL') || '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '', {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      });
      // Estrai i dati utente dall'evento Clerk
      const { id, email_addresses } = data;
      // Ottieni l'email principale
      const primaryEmail = email_addresses.find((email)=>email.id === data.primary_email_address_id)?.email_address;
      // Crea un nuovo record nella tabella userdata con solo user_id ed email
      const { data: insertedData, error } = await supabase.from('userdata').insert({
        user_id: id,
        email: primaryEmail
      });
      if (error) {
        console.error('Errore nell\'inserimento dei dati utente:', error);
        return new Response(JSON.stringify({
          success: false,
          error: error.message
        }), {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        });
      }
      return new Response(JSON.stringify({
        success: true,
        message: 'Dati utente creati con successo'
      }), {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    // Per altri tipi di eventi, conferma semplicemente la ricezione
    return new Response(JSON.stringify({
      success: true,
      message: 'Webhook ricevuto'
    }), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Errore imprevisto:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Errore interno del server'
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});
/**
 * Verifica la firma di un webhook Clerk
 * @param signature La firma dal header x-webhook-signature
 * @param body Il corpo della richiesta come stringa
 * @param secret Il segreto webhook di Clerk
 * @returns boolean Indica se la firma è valida
 */ async function verifyClerkWebhookSignature(signature, body, secret) {
  try {
    // Converti il segreto in un array di byte
    const encoder = new TextEncoder();
    const secretBytes = encoder.encode(secret);
    const secretKey = await crypto.subtle.importKey("raw", secretBytes, {
      name: "HMAC",
      hash: "SHA-256"
    }, false, [
      "verify"
    ]);

    const timestampPart = signature.split(',')[0];
    const signaturePart = signature.split(',')[1];
    if (!timestampPart || !signaturePart) {
      return false;
    }
    const timestamp = timestampPart.split('=')[1];
    const signatureValue = signaturePart.split('=')[1];
    if (!timestamp || !signatureValue) {
      return false;
    }

    const signatureBytes = hexToBytes(signatureValue);

    const payload = `${timestamp}.${body}`;
    const payloadBytes = encoder.encode(payload);

    const isValid = await crypto.subtle.verify("HMAC", secretKey, signatureBytes, payloadBytes);
    return isValid;
  } catch (error) {
    console.error("Errore nella verifica della firma:", error);
    return false;
  }
}
/**
 * Converte una stringa esadecimale in un array di byte
 */ function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for(let i = 0; i < hex.length; i += 2){
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}
