/* eslint-disable prettier/prettier */

import OpenAI from "openai";

interface OrthographyCheck {
    prompt: string;
}

export const orthographyCheck = async (openai: OpenAI, options: OrthographyCheck) => {
    const { prompt } = options;

    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `
                Soy un corrector ortográfico y gramatical del español. Tengo que corregir los acentos, las tildes y los signos de puntuación de un texto en español.
                
                Debo responder en formato JSON.
                
                Si no encuentro errores gramaticales ni ortográficos, debo responder con un mensaje de felicitación.
                
                Ejemplo de salida:
                {
                  "userScore": number,
                  "errors": ["error -> solución"],
                  "message": "Utiliza emojis y texto para felicitar al usuario."
                }
                `
            },
            {
                role: 'user',
                content: prompt,
            }
        ],
        model: "gpt-4",
        temperature: 0.2,
        max_tokens: 150,
        response_format: {
            type: 'json_object'
        }
    });

    const jsonResp = JSON.parse(completion.choices[0].message.content);

    return jsonResp;
}