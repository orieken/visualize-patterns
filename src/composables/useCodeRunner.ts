import { ref } from 'vue';
import * as ts from 'typescript';

export interface TestCase {
    input: any[];
    expected: any;
}

export function useCodeRunner() {
    const isRunning = ref(false);
    const output = ref<string[]>([]);
    const testResults = ref<{ passed: boolean; details: string } | null>(null);

    const deepEqual = (a: any, b: any): boolean => {
        if (a === b) return true;
        if (Array.isArray(a) && Array.isArray(b)) {
            if (a.length !== b.length) return false;
            return a.every((val, index) => deepEqual(val, b[index]));
        }
        if (typeof a === 'object' && a !== null && typeof b === 'object' && b !== null) {
            const keysA = Object.keys(a);
            const keysB = Object.keys(b);
            if (keysA.length !== keysB.length) return false;
            return keysA.every(key => deepEqual(a[key], b[key]));
        }
        return false;
    };

    const runCode = (code: string, testCases?: TestCase[]) => {
        output.value = [];
        testResults.value = null;
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
            // We return the classes/functions defined in the code so we can test them


            // Actually, 'new Function' creates a function. Vars declared with 'class' or 'var' might be visible? 
            // 'let' and 'const' are block scoped.
            // Better approach: Regex to find the class name, then expect it to be instantiated.
            
            const run = new Function('console', js + '; return this;'); 
            // In strict mode or modules, 'this' might be undefined.
            // Let's try to just run it. If testCases are present, we append a harness.
            
            if (testCases && testCases.length > 0) {
                 // 1. Find the class name
                 const classMatch = code.match(/class\s+(\w+)/);
                 if (!classMatch) {
                     throw new Error("No class definition found. Please define a class.");
                 }
                 const className = classMatch[1];
                 
                 // 2. Transpile with harness
                 const harness = `
                    const inst = ${className}.getInstance ? ${className}.getInstance() : new ${className}();
                    const method = inst.solve || inst.execute || inst.run || (inst.someBusinessLogic ? 'singleton' : null);
                    
                    if (!method && method !== 'singleton') throw new Error("No 'solve', 'execute', or 'run' method found on " + '${className}');
                    
                    return testCases.map(t => {
                        let result;
                        if (method === 'singleton') {
                             // Singleton special check
                             const s2 = ${className}.getInstance();
                             result = (inst === s2);
                        } else {
                             result = inst[method.name || 'solve'](...t.input);
                        }
                        return result;
                    });
                 `;
                 
                 const fullScript = js + ';\n' + 'const testCases = ' + JSON.stringify(testCases) + ';\n' + harness;
                 const testRunner = new Function('console', fullScript);
                 const results = testRunner(mockConsole);
                 
                 // Compare results
                 let allPassed = true;
                 results.forEach((res: any, idx: number) => {
                     const passed = deepEqual(res, testCases[idx].expected);
                     logs.push(`Test Case ${idx + 1}: ${passed ? 'PASS ✅' : 'FAIL ❌'} (Expected: ${JSON.stringify(testCases[idx].expected)}, Got: ${JSON.stringify(res)})`);
                     if (!passed) allPassed = false;
                 });
                 
                 testResults.value = { 
                     passed: allPassed, 
                     details: allPassed ? "All tests passed!" : "Some tests failed." 
                 };
            } else {
                const run = new Function('console', js);
                run(mockConsole);
            }
            
            output.value = logs;
        } catch (e: any) {
            output.value = [...output.value, 'Runtime Error: ' + e.message];
            testResults.value = { passed: false, details: 'Runtime Error' };
        } finally {
            isRunning.value = false;
        }
    };

    return {
        runCode,
        output,
        isRunning,
        testResults
    };
}
