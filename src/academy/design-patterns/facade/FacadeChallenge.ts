export class VideoFile {
  constructor(public filename: string) {}
}

export class OggCompressionCodec {
  type = 'ogg';
}

export class BitrateReader {
  static read(buffer: VideoFile, codec: OggCompressionCodec) {
    return "buffer...";
  }
}

/**
 * CHALLENGE: Create a simple ConverterFacade.
 */
export class ConverterFacade {
  convert(filename: string, format: string): string {
    // TODO: Use subsystem classes (VideoFile, Codec, Reader)
    // to simulate conversion
    
    return ""; // <-- FIX THIS
  }
}
