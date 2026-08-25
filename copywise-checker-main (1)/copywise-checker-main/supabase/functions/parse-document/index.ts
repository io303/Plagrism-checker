import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.81.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { filePath } = await req.json();
    
    if (!filePath) {
      throw new Error('File path is required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Download the file from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('documents')
      .download(filePath);

    if (downloadError) {
      console.error('Error downloading file:', downloadError);
      throw new Error(`Failed to download file: ${downloadError.message}`);
    }

    // Convert blob to buffer
    const buffer = await fileData.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);

    let extractedText = '';
    const fileExtension = filePath.split('.').pop()?.toLowerCase();

    if (fileExtension === 'txt') {
      // Simple text file
      extractedText = new TextDecoder().decode(uint8Array);
    } else if (fileExtension === 'pdf') {
      // For PDF, we'll use a simple extraction (in production, you'd use a proper PDF library)
      // This is a simplified version - you might want to use a proper PDF parsing library
      const text = new TextDecoder().decode(uint8Array);
      // Extract visible text (this is a very basic approach)
      extractedText = text.replace(/[^\x20-\x7E\n]/g, '').trim();
      
      // If no readable text found, inform user
      if (extractedText.length < 50) {
        extractedText = "Unable to extract text from PDF. The file might be image-based or encrypted. Please try converting it to text format first.";
      }
    } else if (fileExtension === 'docx') {
      // For DOCX, we'll extract from the XML content
      // This is simplified - in production you'd use a proper DOCX parser
      const text = new TextDecoder().decode(uint8Array);
      // Try to extract text between XML tags
      const textMatches = text.match(/<w:t[^>]*>([^<]*)<\/w:t>/g);
      if (textMatches) {
        extractedText = textMatches
          .map(match => match.replace(/<[^>]*>/g, ''))
          .join(' ')
          .trim();
      }
      
      if (extractedText.length < 50) {
        extractedText = "Unable to extract text from DOCX file. Please try saving as plain text or PDF format.";
      }
    } else {
      throw new Error('Unsupported file format. Please upload PDF, DOCX, or TXT files.');
    }

    return new Response(
      JSON.stringify({ 
        text: extractedText,
        fileName: filePath.split('/').pop()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in parse-document function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        text: ''
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});