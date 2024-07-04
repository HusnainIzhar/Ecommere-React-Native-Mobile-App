import { Document, Model, FilterQuery } from "mongoose";

interface MonthData {
  month: string;
  count: number;
  total: number;
}

interface IBaseDocument extends Document {
  createdAt?: Date;
  totalPrice?: number;
}

export async function generateLast12MonthsData<T extends IBaseDocument>(
  model: Model<T>
): Promise<{ last12Months: MonthData[] }> {
  const last12Months: MonthData[] = [];
  const currentDate = new Date();

  for (let i = 0; i < 12; i++) {
    const startDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i,
      1
    );
    const endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i + 1,
      0
    );

    const monthYear = startDate.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });

    const data = await model.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          total: { $sum: "$totalPrice" },
        },
      },
    ]);

    const count = data.length > 0 ? data[0].count : 0;
    const total = data.length > 0 ? data[0].total : 0;

    last12Months.unshift({ month: monthYear, count, total });
  }
  return { last12Months };
}

export async function generateTodayData<T extends IBaseDocument>(
  model: Model<T>
): Promise<MonthData> {
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);

  const data = await model.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lt: endDate,
        },
      },
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
        total: { $sum: "$totalPrice" },
      },
    },
  ]);

  const count = data.length > 0 ? data[0].count : 0;
  const total = data.length > 0 ? data[0].total : 0;

  return { month: "Today", count, total };
}

export async function generateLastWeekData<T extends IBaseDocument>(
  model: Model<T>
): Promise<MonthData[]> {
  const lastWeekData: MonthData[] = [];
  const currentDate = new Date();

  for (let i = 0; i < 7; i++) {
    const startDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - i
    );
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setHours(23, 59, 59, 999);

    const dayMonthYear = startDate.toLocaleString("default", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const data = await model.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          total: { $sum: "$totalPrice" },
        },
      },
    ]);

    const count = data.length > 0 ? data[0].count : 0;
    const total = data.length > 0 ? data[0].total : 0;

    lastWeekData.unshift({ month: dayMonthYear, count, total });
  }
  return lastWeekData;
}
