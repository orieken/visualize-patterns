import { describe, it, expect } from 'vitest';
import { useCodeRunner } from '../../src/composables/useCodeRunner';

describe('useCodeRunner', () => {
    it('should run simple code', () => {
        const { runCode, output } = useCodeRunner();
        runCode('console.log("Hello World")');
        expect(output.value).toContain('Hello World');
    });

    it('should pass correct implementation with test cases', () => {
        const { runCode, testResults } = useCodeRunner();
        const code = `
            class Calculator {
                add(a: number, b: number) {
                    return a + b;
                }
            }
        `;
        const testCases = [
            { input: [1, 2], expected: 3 },
            { input: [5, 5], expected: 10 }
        ];

        // We need to tell the runner to call 'add'
        // But our current implementation defaults to 'solve', 'execute', 'run'.
        // So let's change the user code to use 'solve'
        const compatibleCode = `
            class Calculator {
                solve(a: number, b: number) {
                    return a + b;
                }
            }
        `;

        runCode(compatibleCode, testCases);
        expect(testResults.value).not.toBeNull();
        expect(testResults.value?.passed).toBe(true);
    });

    it('should fail incorrect implementation', () => {
        const { runCode, testResults } = useCodeRunner();
        const code = `
            class Calculator {
                solve(a: number, b: number) {
                    return a - b; // Wrong
                }
            }
        `;
        const testCases = [
            { input: [1, 2], expected: 3 }
        ];

        runCode(code, testCases);
        expect(testResults.value).not.toBeNull();
        expect(testResults.value?.passed).toBe(false);
    });

    it('should handle Singleton pattern test', () => {
         const { runCode, testResults } = useCodeRunner();
         const code = `
            class Singleton {
                private static instance: Singleton;
                constructor() {}
                static getInstance() {
                    if (!Singleton.instance) {
                        Singleton.instance = new Singleton();
                    }
                    return Singleton.instance;
                }
                someBusinessLogic() {}
            }
         `;
         const testCases = [{ input: [], expected: true }];
         
         runCode(code, testCases);
         expect(testResults.value?.passed).toBe(true);
    });

    it('should catch runtime errors', () => {
        const { runCode, output } = useCodeRunner();
        runCode('throw new Error("Boom")');
        expect(output.value.some(l => l.includes('Runtime Error'))).toBe(true);
    });
});
