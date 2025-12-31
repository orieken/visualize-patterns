import { describe, it, expect } from 'vitest';
import { useCodeRunner } from './useCodeRunner';

describe('useCodeRunner', () => {
    it('should execute typescript and capture output', () => {
        const { runCode, output } = useCodeRunner();
        
        const code = `
            const a: number = 10;
            const b: number = 20;
            console.log("Result:", a + b);
        `;
        
        runCode(code);
        
        expect(output.value).toContain('Result: 30');
    });

    it('should handle runtime errors', () => {
        const { runCode, output } = useCodeRunner();
        
        const code = `throw new Error("Failure");`;
        
        runCode(code);
        
        expect(output.value[0]).toContain('Runtime Error: Failure');
    });

    it('should support classes and methods', () => {
        const { runCode, output } = useCodeRunner();
        
        const code = `
            class Greeter {
                greet(name: string) { return "Hello " + name; }
            }
            console.log(new Greeter().greet("World"));
        `;
        
        runCode(code);
        
        expect(output.value).toContain('Hello World');
    });
});
