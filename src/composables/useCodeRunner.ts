import { ref } from 'vue';
import * as ts from 'typescript';

export function useCodeRunner() {
    const isRunning = ref(false);
    const output = ref<string[]>([]);

    const runCode = (code: string) => {
        output.value = [];
        isRunning.value = true;
        
        try {
            // Simple Transpile (Client Side)
            const js = ts.transpile(code);
            
            // Mock console.log to capture output
            const logs: string[] = [];
            const mockConsole = {
                log: (...args: any[]) => {
                    logs.push(args.map(a => String(a)).join(' '));
                },
                warn: (...args: any[]) => logs.push('WARN: ' + args.join(' ')),
                error: (...args: any[]) => logs.push('ERROR: ' + args.join(' '))
            };

            // Execute function
            const run = new Function('console', js);
            run(mockConsole);
            
            output.value = logs;
        } catch (e: any) {
            output.value = ['Runtime Error: ' + e.message];
        } finally {
            isRunning.value = false;
        }
    };

    return {
        runCode,
        output,
        isRunning
    };
}
