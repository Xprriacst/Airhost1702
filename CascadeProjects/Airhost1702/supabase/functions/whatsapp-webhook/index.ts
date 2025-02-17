// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Cette ligne est importante pour CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Gestion de la vérification du webhook (GET)
    if (req.method === 'GET') {
      const url = new URL(req.url)
      const mode = url.searchParams.get('hub.mode')
      const token = url.searchParams.get('hub.verify_token')
      const challenge = url.searchParams.get('hub.challenge')

      if (mode === 'subscribe' && token === 'Airhost123') {
        console.log('Webhook vérifié!')
        return new Response(challenge, { 
          headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
          status: 200 
        })
      }
      
      return new Response('Vérification échouée', { 
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
        status: 403 
      })
    }

    // Gestion des messages entrants (POST)
    if (req.method === 'POST') {
      const body = await req.json()
      
      console.log('Message reçu:', JSON.stringify(body, null, 2))

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      })
    }

    return new Response('Méthode non supportée', { 
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
      status: 405 
    })

  } catch (error) {
    console.error('Erreur:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }
})
