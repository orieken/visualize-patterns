export abstract class DataMiner {
  mine(path: string): string {
    const file = this.openFile(path);
    const rawData = this.extractData(file);
    const data = this.parseData(rawData);
    const analysis = this.analyzeData(data);
    this.sendReport(analysis);
    this.closeFile(file);
    return analysis;
  }

  protected openFile(path: string) { return `File(${path})`; }
  protected abstract extractData(file: any): string;
  protected abstract parseData(raw: string): string;
  protected analyzeData(data: string) { return `Analysis of ${data}`; }
  protected sendReport(analysis: string) { /* send */ }
  protected closeFile(file: any) { /* close */ }
}

export class PDFMiner extends DataMiner {
  protected extractData(file: any): string { return 'PDF-content'; }
  protected parseData(raw: string): string { return `Parsed(${raw})`; }
}

export class CSVMiner extends DataMiner {
  protected extractData(file: any): string { return 'CSV-content'; }
  protected parseData(raw: string): string { return `Parsed(${raw})`; }
}
