/* eslint-disable prettier/prettier */

import OpenAI from "openai";

interface Translate {
    prompt: string;
    lang: string;
}

export const translateCase = async (openai: OpenAI, options: Translate) => {
    const { prompt, lang } = options;

    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `
                    Traduce el siguiente texto al idioma ${lang}: ${prompt}
                `
            },
        ],
        model: "gpt-3.5-turbo-1106",
        temperature: 0.2,
        // max_tokens: 150,
    });

    return {message: completion.choices[0].message.content};
}