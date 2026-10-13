import QRCode from 'qrcode';

export interface WifiQrOptions {
  ssid: string;
  password?: string;
  encryption?: 'WPA' | 'WEP' | 'nopass' | string;
  hidden?: boolean;
}

export class QrCodeService {
  /**
   * Generates a standard WiFi connection QR payload:
   * WIFI:S:SSID;T:WPA;P:PASSWORD;H:false;;
   */
  public static buildWifiPayload(options: WifiQrOptions): string {
    const enc = options.encryption || 'WPA';
    const pass = options.password ? options.password.replace(/([\\;,:"])/g, '\\$1') : '';
    const ssid = options.ssid.replace(/([\\;,:"])/g, '\\$1');
    const hidden = options.hidden ? 'true' : 'false';

    return `WIFI:S:${ssid};T:${enc};P:${pass};H:${hidden};;`;
  }

  /**
   * Generates a QR Code as Data URL (base64 image/png)
   */
  public static async toDataUrl(payload: string, options: { margin?: number; width?: number; darkColor?: string; lightColor?: string } = {}): Promise<string> {
    return QRCode.toDataURL(payload, {
      margin: options.margin ?? 2,
      width: options.width ?? 350,
      color: {
        dark: options.darkColor ?? '#0f172a',
        light: options.lightColor ?? '#ffffff',
      },
      errorCorrectionLevel: 'M',
    });
  }

  /**
   * Generates a QR Code as SVG string
   */
  public static async toSvg(payload: string, options: { margin?: number; width?: number; darkColor?: string; lightColor?: string } = {}): Promise<string> {
    return QRCode.toString(payload, {
      type: 'svg',
      margin: options.margin ?? 2,
      width: options.width ?? 350,
      color: {
        dark: options.darkColor ?? '#0f172a',
        light: options.lightColor ?? '#ffffff',
      },
      errorCorrectionLevel: 'M',
    });
  }
}
