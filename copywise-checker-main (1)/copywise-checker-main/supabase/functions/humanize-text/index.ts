import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, originalityLevel = 70 } = await req.json();

    if (!text || text.trim().length < 50) {
      throw new Error('Text must be at least 50 characters long');
    }

    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Adjust prompt based on originality level
    let intensityInstruction = '';
    if (originalityLevel < 30) {
      intensityInstruction = 'Make minimal changes, only rephrase key sentences slightly while keeping most of the original structure.';
    } else if (originalityLevel < 60) {
      intensityInstruction = 'Make moderate changes, rephrase sentences and restructure paragraphs while keeping the core meaning.';
    } else if (originalityLevel < 90) {
      intensityInstruction = 'Make significant changes, completely rephrase all sentences, restructure content, and use different vocabulary.';
    } else {
      intensityInstruction = 'Transform completely - rewrite from scratch with different structure, vocabulary, and sentence patterns while preserving the key information.';
    }

    const prompt = `You are an expert content rewriter. Your task is to rewrite the following text to make it more original and unique while preserving its meaning and key information.

Originality Level: ${originalityLevel}% (0-100 scale)
${intensityInstruction}

Guidelines:
- Preserve all factual information and key points
- Use natural, fluent language
- Vary sentence structure and length
- Replace words with appropriate synonyms
- Reorganize paragraphs if needed (for high originality levels)
- Maintain the same tone and style
- Do NOT add any explanations or meta-commentary
- Return ONLY the rewritten text

Original Text:
${text}

Rewritten Text:`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are an expert content rewriter. You rewrite text to make it more original while preserving meaning. You ONLY return the rewritten text, nothing else.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.9,
        max_tokens: 4000
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      }
      if (response.status === 402) {
        throw new Error('AI credits depleted. Please add credits to continue.');
      }
      
      throw new Error(`AI service error: ${response.status}`);
    }

    const data = await response.json();
    const humanizedText = data.choices[0]?.message?.content?.trim() || '';

    if (!humanizedText) {
      throw new Error('Failed to generate humanized text');
    }

    return new Response(
      JSON.stringify({ humanizedText }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in humanize-text function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});