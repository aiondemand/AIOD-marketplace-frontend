export enum MediaType {
  audio = 'graphic_eq',
  video = 'movie',
  image = 'image',
  unknown = 'unknown_document',
}

export class Media {
  checksum?: string;
  checksumAlgorithm?: string;
  copyright?: string;
  contentUrl?: string;
  contentSizeKb?: number;
  datePublished?: string;
  encodingFormat?: string;
  description?: string;
  name?: string;
  type: MediaType;

  constructor(data: any) {
    this.checksum = data.checksum;
    this.checksumAlgorithm = data.checksum_algorithm;
    this.contentUrl = data.content_url;
    this.copyright = data.copyright;
    this.contentSizeKb = data.content_size_kb;
    this.datePublished = data.date_published;
    this.encodingFormat = data.encoding_format;
    this.description = data.description;
    this.name = data.name;
    this.type = this.getMediaType(this.encodingFormat);
  }

  private getMediaType(encodingFormat: string | undefined): MediaType {
    if (!encodingFormat) return MediaType.unknown;
    const format = encodingFormat.toUpperCase();
    if (this.isImage(format)) return MediaType.image;
    if (this.isVideo(format)) return MediaType.video;
    if (this.isAudio(format)) return MediaType.audio;
    return MediaType.unknown;
  }

  private isImage(format: string): boolean {
    return (
      format.includes('JPEG') ||
      format.includes('PNG') ||
      format.includes('GIF') ||
      format.includes('BMP') ||
      format.includes('TIFF') ||
      format.includes('WebP') ||
      format.includes('SVG')
    );
  }
  private isVideo(format: string): boolean {
    return (
      format.includes('MP4') ||
      format.includes('AVI') ||
      format.includes('MKV') ||
      format.includes('MOV') ||
      format.includes('WMV') ||
      format.includes('FLV') ||
      format.includes('MPEG')
    );
  }
  private isAudio(format: string): boolean {
    return (
      format.includes('MP3') ||
      format.includes('WAV') ||
      format.includes('AAC') ||
      format.includes('FLAC') ||
      format.includes('OGG') ||
      format.includes('WMA') ||
      format.includes('AIFF')
    );
  }
}
