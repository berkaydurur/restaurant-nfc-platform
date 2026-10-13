import { prisma } from '../database/prisma';
import { IAnalyticsRepository } from '../../core/repositories';
import { AnalyticsEventEntity } from '../../core/entities';

export class PrismaAnalyticsRepository implements IAnalyticsRepository {
  public async recordEvent(data: Omit<AnalyticsEventEntity, 'id' | 'createdAt'>): Promise<AnalyticsEventEntity> {
    const event = await prisma.analyticsEvent.create({
      data: {
        restaurantId: data.restaurantId,
        eventType: data.eventType,
        tableNumber: data.tableNumber,
        metadata: data.metadata,
      },
    });

    return event as AnalyticsEventEntity;
  }

  public async getStats(restaurantId: string, days = 30): Promise<{
    totalNfcTaps: number;
    totalMenuViews: number;
    totalWifiConnects: number;
    totalGoogleReviews: number;
    totalWaiterCalls: number;
    recentEvents: AnalyticsEventEntity[];
    eventsByDate: { date: string; nfcTaps: number; menuViews: number; wifiConnects: number; reviews: number }[];
  }> {
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days);

    const events = await prisma.analyticsEvent.findMany({
      where: {
        restaurantId,
        createdAt: { gte: sinceDate },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalNfcTaps = events.filter((e) => e.eventType === 'NFC_TAP').length;
    const totalMenuViews = events.filter((e) => e.eventType === 'MENU_VIEW').length;
    const totalWifiConnects = events.filter((e) => e.eventType === 'WIFI_CONNECT').length;
    const totalGoogleReviews = events.filter((e) => e.eventType === 'GOOGLE_REVIEW').length;
    const totalWaiterCalls = events.filter((e) => e.eventType === 'WAITER_CALL').length;

    // Group by day for charts
    const dateMap: { [dateStr: string]: { nfcTaps: number; menuViews: number; wifiConnects: number; reviews: number } } = {};

    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const key = d.toISOString().split('T')[0];
      dateMap[key] = { nfcTaps: 0, menuViews: 0, wifiConnects: 0, reviews: 0 };
    }

    events.forEach((ev) => {
      const dateKey = ev.createdAt.toISOString().split('T')[0];
      if (dateMap[dateKey]) {
        if (ev.eventType === 'NFC_TAP') dateMap[dateKey].nfcTaps++;
        else if (ev.eventType === 'MENU_VIEW') dateMap[dateKey].menuViews++;
        else if (ev.eventType === 'WIFI_CONNECT') dateMap[dateKey].wifiConnects++;
        else if (ev.eventType === 'GOOGLE_REVIEW') dateMap[dateKey].reviews++;
      }
    });

    const eventsByDate = Object.entries(dateMap).map(([date, counts]) => ({
      date,
      ...counts,
    }));

    return {
      totalNfcTaps,
      totalMenuViews,
      totalWifiConnects,
      totalGoogleReviews,
      totalWaiterCalls,
      recentEvents: events.slice(0, 20) as AnalyticsEventEntity[],
      eventsByDate,
    };
  }
}
