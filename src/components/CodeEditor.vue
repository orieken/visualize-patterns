<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

// Monaco Environment setup for Vite
self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') return new jsonWorker();
    if (label === 'css' || label === 'scss' || label === 'less') return new cssWorker();
    if (label === 'html' || label === 'handlebars' || label === 'razor') return new htmlWorker();
    if (label === 'typescript' || label === 'javascript') return new tsWorker();
    return new editorWorker();
  }
};

const props = defineProps<{
    modelValue: string;
    language?: string;
    theme?: string;
}>();

const emit = defineEmits(['update:modelValue', 'run', 'selection-change']);

const container = ref<HTMLElement | null>(null);
let editor: monaco.editor.IStandaloneCodeEditor | null = null;

onMounted(() => {
    if (container.value) {
        // Fix for type issues with monaco.languages.typescript
        const tsDefaults = (monaco.languages.typescript as any).typescriptDefaults;
        const tsLanguages = (monaco.languages.typescript as any);

        tsDefaults.setCompilerOptions({
            target: tsLanguages.ScriptTarget.ES2015,
            allowNonTsExtensions: true,
            moduleResolution: tsLanguages.ModuleResolutionKind.NodeJs,
            module: tsLanguages.ModuleKind.CommonJS,
            noEmit: true,
            typeRoots: ["node_modules/@types"]
        });

        editor = monaco.editor.create(container.value, {
            value: props.modelValue,
            language: props.language || 'typescript',
            theme: props.theme || 'vs-dark',
            automaticLayout: true,
            minimap: { enabled: false },
            fontSize: 14,
            padding: { top: 16 }
        });

        editor.onDidChangeModelContent(() => {
            emit('update:modelValue', editor?.getValue());
        });

        editor.onDidChangeCursorSelection((e) => {
            const selection = editor?.getModel()?.getValueInRange(e.selection);
            emit('selection-change', selection || '');
        });
    }
});

onBeforeUnmount(() => {
    editor?.dispose();
});

// Watch for theme changes from props or global theme state could be added here
</script>

<template>
  <div class="editor-wrapper">
    <div class="editor-container" ref="container"></div>
  </div>
</template>

<style scoped>
.editor-wrapper {
  width: 100%;
  height: 100%;
  min-height: 400px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--card-border);
}
.editor-container {
  width: 100%;
  height: 100%;
}
</style>
