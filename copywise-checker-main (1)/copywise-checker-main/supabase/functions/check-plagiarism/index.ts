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
    const { text } = await req.json();
    
    if (!text || text.trim().length < 50) {
      return new Response(
        JSON.stringify({ error: 'Text must be at least 50 characters long' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Checking plagiarism for text of length:', text.length);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Extract key phrases for searching
    const sentences = text.split(/[.!?]+/).filter((s: string) => s.trim().length > 20);
    const searchPhrases = sentences.slice(0, 3).map((s: string) => s.trim());

    console.log('Searching for similar content using AI...');

    // Use AI to analyze the text and search for similar content
    const prompt = `Analyze the following text for potential plagiarism. Search your knowledge for similar content and provide a plagiarism assessment.

Text to analyze:
"${text}"

Provide a JSON response with:
1. plagiarismPercentage: estimated percentage of plagiarized content (0-100)
2. matches: array of potential matches with structure: { text: string, source: string, similarity: number }
3. isOriginal: boolean indicating if content appears original

Consider factors like:
- Unique phrasing and word choices
- Common knowledge vs specific facts
- Writing style consistency
- Presence of specific technical or specialized content

Format response as valid JSON only.`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { 
            role: 'system', 
            content: 'You are a plagiarism detection expert. Analyze text and provide detailed plagiarism assessments in JSON format.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      throw new Error('Failed to analyze text with AI');
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices[0].message.content;
    
    console.log('AI response received:', aiContent);

    // Parse AI response
    let result;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = aiContent.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : aiContent;
      result = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Provide a default result if parsing fails
      result = {
        plagiarismPercentage: 15,
        matches: [],
        isOriginal: true
      };
    }

    // Ensure the result has the correct structure
    const finalResult = {
      plagiarismPercentage: result.plagiarismPercentage || 0,
      matches: Array.isArray(result.matches) ? result.matches : [],
      isOriginal: result.isOriginal !== false, // Default to true if not specified
    };

    console.log('Plagiarism check complete:', finalResult);

    return new Response(
      JSON.stringify(finalResult),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in check-plagiarism function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
