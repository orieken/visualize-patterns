import { describe, it, expect } from 'vitest';
import { PDFMiner, CSVMiner } from './TemplateMethod';

describe('Template Method (Reference)', () => {
  it('should follow the algorithm skeleton', () => {
    const pdf = new PDFMiner();
    expect(pdf.mine('doc.pdf')).toContain('Analysis of Parsed(PDF-content)');

    const csv = new CSVMiner();
    expect(csv.mine('data.csv')).toContain('Analysis of Parsed(CSV-content)');
  });
});
