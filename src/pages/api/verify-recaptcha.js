export const prerender = false;

export const POST = async ({ request }) => {
  try {
    const { token } = await request.json();
    const SECRET_KEY = import.meta.env.RECAPTCHA_SECRET_KEY;

    console.log('=== DEBUG RECAPTCHA ===');
    console.log('Token recibido:', token ? 'SÍ' : 'NO');
    console.log('SECRET_KEY existe:', SECRET_KEY ? 'SÍ' : 'NO');
    console.log('Primeros 10 chars del SECRET_KEY:', SECRET_KEY?.substring(0, 10));

    if (!token) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Token no proporcionado' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!SECRET_KEY) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'SECRET_KEY no configurada' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const params = new URLSearchParams();
    params.append('secret', SECRET_KEY);
    params.append('response', token);

    console.log('Enviando request a Google...');

    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      body: params
    });

    const data = await response.json();

    console.log('Respuesta completa de Google:', JSON.stringify(data, null, 2));

    return new Response(JSON.stringify({
      success: data.success,
      error_codes: data['error-codes'],
      debug_info: {
        has_token: !!token,
        has_secret: !!SECRET_KEY
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('ERROR CATCH:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};