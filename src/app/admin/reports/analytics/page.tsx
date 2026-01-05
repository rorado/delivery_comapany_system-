"use client";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function AnalyticsPage() {
  const deliveryChartOptions: ApexOptions = {
    chart: {
      type: "line",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    colors: ["#465FFF", "#9CB9FF"],
    stroke: {
      curve: "smooth",
      width: 2,
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    yaxis: {
      title: {
        text: "Number of Deliveries",
      },
    },
    legend: {
      position: "top",
    },
    dataLabels: {
      enabled: false,
    },
  };

  const deliveryChartSeries = [
    {
      name: "Completed",
      data: [320, 380, 350, 410, 390, 420, 450, 480, 460, 500, 520, 540],
    },
    {
      name: "Failed",
      data: [20, 25, 30, 22, 28, 24, 26, 30, 28, 25, 22, 20],
    },
  ];

  const revenueChartOptions: ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    colors: ["#465FFF"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 5,
      },
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    yaxis: {
      title: {
        text: "Revenue ($)",
      },
    },
    dataLabels: {
      enabled: false,
    },
  };

  const revenueChartSeries = [
    {
      name: "Revenue",
      data: [
        12500, 14800, 13200, 15600, 14200, 16800, 17500, 18900, 17200, 19500,
        20100, 21500,
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
          Analytics Dashboard
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          View comprehensive analytics and insights for your delivery
          operations.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Deliveries
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">
            4,872
          </p>
          <p className="mt-1 text-xs text-green-600 dark:text-green-400">
            +12.5% from last month
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Success Rate
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">
            95.2%
          </p>
          <p className="mt-1 text-xs text-green-600 dark:text-green-400">
            +2.1% from last month
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Revenue
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">
            $198.5K
          </p>
          <p className="mt-1 text-xs text-green-600 dark:text-green-400">
            +18.3% from last month
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Avg. Delivery Time
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">
            2.3 hrs
          </p>
          <p className="mt-1 text-xs text-green-600 dark:text-green-400">
            -0.2 hrs from last month
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
            Delivery Performance
          </h2>
          <ReactApexChart
            options={deliveryChartOptions}
            series={deliveryChartSeries}
            type="line"
            height={350}
          />
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
            Revenu mensuel
          </h2>
          <ReactApexChart
            options={revenueChartOptions}
            series={revenueChartSeries}
            type="bar"
            height={350}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 className="mb-4 font-semibold text-gray-800 dark:text-white/90">
            Top chauffeurs
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-theme-sm dark:text-gray-400">
                Omar El Fassi
              </span>
              <span className="font-medium text-gray-800 dark:text-white/90">
                245 deliveries
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-theme-sm dark:text-gray-400">
                Sara Aït Lahcen
              </span>
              <span className="font-medium text-gray-800 dark:text-white/90">
                189 deliveries
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-theme-sm dark:text-gray-400">
                Hicham Berrada
              </span>
              <span className="font-medium text-gray-800 dark:text-white/90">
                312 deliveries
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 className="mb-4 font-semibold text-gray-800 dark:text-white/90">
            Itinéraires principaux
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-theme-sm dark:text-gray-400">
                Casablanca → Rabat
              </span>
              <span className="font-medium text-gray-800 dark:text-white/90">
                156 trips
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-theme-sm dark:text-gray-400">
                Tanger → Fès
              </span>
              <span className="font-medium text-gray-800 dark:text-white/90">
                98 trips
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-theme-sm dark:text-gray-400">
                Marrakech → Agadir
              </span>
              <span className="font-medium text-gray-800 dark:text-white/90">
                87 trips
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 className="mb-4 font-semibold text-gray-800 dark:text-white/90">
            Utilisation des véhicules
          </h3>
          <div className="space-y-3">
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-gray-500 text-theme-sm dark:text-gray-400">
                  Active
                </span>
                <span className="font-medium text-gray-800 dark:text-white/90">
                  85%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                <div className="h-full w-[85%] bg-brand-500" />
              </div>
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-gray-500 text-theme-sm dark:text-gray-400">
                  In Use
                </span>
                <span className="font-medium text-gray-800 dark:text-white/90">
                  72%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                <div className="h-full w-[72%] bg-success-500" />
              </div>
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-gray-500 text-theme-sm dark:text-gray-400">
                  Available
                </span>
                <span className="font-medium text-gray-800 dark:text-white/90">
                  15%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                <div className="h-full w-[15%] bg-info-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
