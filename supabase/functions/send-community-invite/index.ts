
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CommunityInviteRequest {
  email: string;
  inviteToken: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, inviteToken }: CommunityInviteRequest = await req.json();

    const inviteLink = `${Deno.env.get("SUPABASE_URL")}/auth/v1/verify?token=${inviteToken}&type=invite&redirect_to=${encodeURIComponent('https://your-app-url.com/community')}`;

    const emailResponse = await resend.emails.send({
      from: "Jardim Espiritual <noreply@resend.dev>",
      to: [email],
      subject: "Convite para a Comunidade de Fé",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #16a34a; text-align: center;">Bem-vindo à Comunidade de Fé!</h1>
          
          <p>Você foi convidado para participar da nossa comunidade espiritual, onde você pode:</p>
          
          <ul>
            <li>✨ Conectar-se com outros irmãos na fé</li>
            <li>💬 Participar de conversas edificantes</li>
            <li>🙏 Compartilhar e receber orações</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${inviteLink}" 
               style="background-color: #16a34a; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
              Aceitar Convite
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; text-align: center;">
            Este convite expira em 7 dias. Se você não solicitou este convite, pode ignorar este email.
          </p>
        </div>
      `,
    });

    console.log("Community invite email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-community-invite function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
