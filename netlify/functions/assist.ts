const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export const handler = async (event: any, context: any) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    if (!OPENAI_API_KEY) {
        return { 
            statusCode: 500, 
            body: JSON.stringify({ error: 'Missing OPENAI_API_KEY environment variable' }) 
        };
    }

    let body;
    try {
        body = JSON.parse(event.body || '{}');
    } catch (e) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) };
    }

    const { intent, code, context: aiContext } = body;

    if (!code) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Missing code' }) };
    }

    try {
        const prompt = generatePrompt(intent, code, aiContext);
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: prompt.system },
                    { role: 'user', content: prompt.user }
                ],
                max_tokens: 500
            })
        });

        const data: any = await response.json();
        
        if (data.error) throw new Error(data.error.message);

        const reply = data.choices[0].message.content;
        return {
            statusCode: 200,
            body: JSON.stringify({ reply })
        };

    } catch (error: any) {
        console.error("OpenAI Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to process AI request', details: error.message })
        };
    }
};

function generatePrompt(intent: string, code: string, context: any) {
    const { topic, slug } = context || {};

    switch (intent) {
        case 'explain':
            return {
                system: `You are an expert Computer Science tutor specialized in ${topic || 'algorithms'}. 
Explain the selected code snippet clearly and concisely. 
Focus on the logic, flow, and how it relates to the ${topic || 'current'} pattern/algorithm. 
Avoid generic syntax explanations unless crucial. Use Markdown.`,
                user: `Please explain this local code snippet:\n\`\`\`typescript\n${code}\n\`\`\``
            };
            
        case 'validate':
            return {
                system: `You are a strict but helpful Code Reviewer.
Check the user's solution for the "${topic || 'current'}" algorithm/pattern.
Find logical bugs, edge cases, or inefficiencies.
If the code is correct, compliment specific good practices.
Do NOT reveal the full solution if it's broken, just guide them.
Keep it under 150 words. Use Markdown.`,
                user: `Review this solution context:\n\`\`\`typescript\n${code}\n\`\`\``
            };

        case 'hint':
            return {
                system: `You are a helper for a coding challenge.
Analyze the partial code and suggest the IMMEDIATE next logical step.
Do NOT write the code for them. Give a conceptual hint.`,
                user: `I am stuck implementing ${topic || 'this'}. Here is my code:\n\`\`\`typescript\n${code}\n\`\`\``
            };
            
        default:
            return { system: 'You are a helper.', user: code };
    }
}
