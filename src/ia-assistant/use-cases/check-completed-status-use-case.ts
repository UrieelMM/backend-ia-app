/* eslint-disable prettier/prettier */
import OpenAI from "openai";

interface Options {
    threadId: string;
    runId: string;
}


export const checkCompletedStatusCase = async (openai: OpenAI, options: Options) => {
    const { threadId, runId } = options;

    const runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);

    if(runStatus.status == "completed"){
        return runStatus;
    };

    //Espera 1 segundo para evitar bloqueo de la API
    await new Promise(resolve => setTimeout(resolve, 1000));

    return await checkCompletedStatusCase(openai, options);
}