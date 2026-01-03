import { getCodeSuggestions as heuristicCheck } from '../utils/validation';

export type AIIntent = 'explain' | 'validate' | 'hint';

export interface AIRequest {
    intent: AIIntent;
    code: string;
    context: {
        slug: string;
        topic: string;
        language?: string;
    };
}

export interface AIResponse {
    content: string; // The explanation, hint, or validation feedback
    status: 'success' | 'error';
}

const USE_REAL_AI = import.meta.env.VITE_USE_REAL_AI === 'true';

/**
 * Main AI Service Entry Point
 * Routes requests to either Real Backend or Local Mock
 */
export const askAI = async (request: AIRequest): Promise<AIResponse> => {
    if (USE_REAL_AI) {
        return await callRealAI(request);
    } else {
        return await callMockAI(request);
    }
};

/**
 * Call the Real LLM Backend Proxy
 */
async function callRealAI(request: AIRequest): Promise<AIResponse> {
    try {
        const res = await fetch('/api/assist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request)
        });
        
        if (!res.ok) throw new Error('API request failed');
        
        const data = await res.json();
        return {
            content: data.reply,
            status: 'success'
        };
    } catch (e) {
        console.error("AI Service Error:", e);
        return {
            content: "Sorry, I couldn't connect to the AI brain. Please try again later.",
            status: 'error'
        };
    }
}

/**
 * Local Mock Fallback (Offline Mode)
 */
async function callMockAI(request: AIRequest): Promise<AIResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1000));

    const { intent, code, context } = request;

    if (intent === 'validate') {
        const issues = heuristicCheck(context.slug, code);
        if (issues.length === 0) {
            return {
                content: "✅ Excellent work! Your solution looks correct and follows the expected pattern structure.",
                status: 'success'
            };
        }
        return {
            content: `⚠️ I found a few things to check:\n\n${issues.map(i => `- ${i}`).join('\n')}`,
            status: 'success'
        };
    }

    if (intent === 'explain') {
        if (!code || code.trim().length === 0) {
            return { content: "Please select some code first so I can explain it!", status: 'error' };
        }
        return {
            content: `🤖 **Analysis of ${context.topic}**:
            
This code block appears to be implementing part of the **${context.topic}** logic.
Based on the syntax, it handles state management or algorithmic flow relevant to this pattern.

*(Note: This is a placeholder. Enable Real AI to get specific line-by-line analysis.)*`,
            status: 'success'
        };
    }

    if (intent === 'hint') {
        return {
            content: "💡 **Hint**: Try breaking the problem down into smaller steps. Check your loop conditions and base cases.",
            status: 'success'
        };
    }

    return { content: "Unknown intent", status: 'error' };
}
