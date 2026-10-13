import { IRestaurantRepository } from '../../../core/repositories';
import { NotFoundError } from '../../../core/errors/AppError';
import { QrCodeService } from '../../../infrastructure/qr/QrCodeService';

export class QrUseCases {
  constructor(private restaurantRepository: IRestaurantRepository) {}

  public async getWifiQr(restaurantId: string) {
    const restaurant = await this.restaurantRepository.findById(restaurantId);
    if (!restaurant) {
      throw new NotFoundError('Restoran bulunamadı.');
    }

    if (!restaurant.wifiSsid) {
      return {
        hasWifiConfig: false,
        qrDataUrl: null,
        qrSvg: null,
        payload: null,
      };
    }

    const payload = QrCodeService.buildWifiPayload({
      ssid: restaurant.wifiSsid,
      password: restaurant.wifiPassword || undefined,
      encryption: restaurant.wifiEncryption || 'WPA',
      hidden: restaurant.wifiHidden,
    });

    const qrDataUrl = await QrCodeService.toDataUrl(payload, {
      darkColor: restaurant.primaryColor || '#0f172a',
      width: 400,
    });

    const qrSvg = await QrCodeService.toSvg(payload, {
      darkColor: restaurant.primaryColor || '#0f172a',
      width: 400,
    });

    return {
      hasWifiConfig: true,
      ssid: restaurant.wifiSsid,
      password: restaurant.wifiPassword,
      encryption: restaurant.wifiEncryption,
      payload,
      qrDataUrl,
      qrSvg,
    };
  }

  public async getGoogleReviewQr(restaurantId: string) {
    const restaurant = await this.restaurantRepository.findById(restaurantId);
    if (!restaurant) {
      throw new NotFoundError('Restoran bulunamadı.');
    }

    const url = restaurant.googleReviewUrl || restaurant.googleMapsUrl || `https://www.google.com/search?q=${encodeURIComponent(restaurant.name)}`;

    const qrDataUrl = await QrCodeService.toDataUrl(url, {
      darkColor: '#1d4ed8', // Google Blue
      width: 400,
    });

    return {
      url,
      qrDataUrl,
    };
  }

  public async getTableNfcQr(restaurantId: string, tableNumber?: string, baseUrl = 'http://localhost:4200') {
    const restaurant = await this.restaurantRepository.findById(restaurantId);
    if (!restaurant) {
      throw new NotFoundError('Restoran bulunamadı.');
    }

    const targetUrl = tableNumber
      ? `${baseUrl}/r/${restaurant.slug}?table=${encodeURIComponent(tableNumber)}`
      : `${baseUrl}/r/${restaurant.slug}`;

    const qrDataUrl = await QrCodeService.toDataUrl(targetUrl, {
      darkColor: restaurant.primaryColor || '#0f172a',
      width: 400,
    });

    return {
      restaurantName: restaurant.name,
      slug: restaurant.slug,
      tableNumber,
      targetUrl,
      qrDataUrl,
    };
  }
}
