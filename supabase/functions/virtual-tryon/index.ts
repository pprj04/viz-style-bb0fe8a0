import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { personImage, outfitImage } = await req.json();
    console.log("Received request with personImage length:", personImage?.length, "outfitImage length:", outfitImage?.length);

    if (!personImage || !outfitImage) {
      return new Response(
        JSON.stringify({ error: "Both person and outfit images are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }
    
    console.log("Calling AI gateway for virtual try-on...");

    // Use Gemini's image generation model for virtual try-on
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-pro-image-preview",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `You are an expert fashion AI. Create a photorealistic virtual try-on result by:
1. Taking the person from the first image and preserving their exact face, body pose, skin tone, and proportions
2. Replacing their current clothing with the outfit from the second image
3. Ensuring the clothing fits naturally to their body shape and pose
4. Maintaining realistic lighting, shadows, and fabric textures
5. The result should look like a professional fashion photograph with seamless blending
6. Preserve all facial features, hair, and accessories from the original person
7. Apply proper cloth warping based on the body pose

Create a single cohesive image showing the person wearing the new outfit.`,
              },
              {
                type: "image_url",
                image_url: {
                  url: personImage,
                },
              },
              {
                type: "image_url",
                image_url: {
                  url: outfitImage,
                },
              },
            ],
          },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Usage limit reached. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI processing failed: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract the generated image from the response
    const generatedImage = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    const textResponse = data.choices?.[0]?.message?.content;

    if (!generatedImage) {
      console.error("No image generated. Response:", JSON.stringify(data));
      return new Response(
        JSON.stringify({ 
          error: "Could not generate try-on image. The AI may need clearer images.",
          details: textResponse 
        }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ 
        resultImage: generatedImage,
        message: textResponse || "Virtual try-on completed successfully!"
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Virtual try-on error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
