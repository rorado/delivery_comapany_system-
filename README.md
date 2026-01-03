# Delivery Company Management System

A comprehensive delivery company management system built on **Next.js and Tailwind CSS** providing everything you need to manage deliveries, drivers, vehicles, routes, and customers.

![Delivery Company System](./banner.png)

This delivery management system provides all the necessary features for running a delivery company, including shipment tracking, driver management, vehicle management, route optimization, and comprehensive analytics.

The system utilizes the powerful features of **Next.js 16** and common features of Next.js such as server-side rendering (SSR), static site generation (SSG), and seamless API route integration. Combined with the advancements of **React 19** and the robustness of **TypeScript**, this is the perfect solution for delivery company operations.

## Overview

This delivery management system provides essential features for managing a delivery company. It's built on:

* Next.js 16.x
* React 19
* TypeScript
* Tailwind CSS V4

## Features

* **Dashboard Overview** - Real-time metrics and delivery statistics
* **Shipment Management** - Track and manage all deliveries
* **Driver Management** - Manage delivery drivers and their schedules
* **Vehicle Management** - Track vehicles, maintenance, and assignments
* **Route Optimization** - Plan and optimize delivery routes
* **Customer Management** - Manage customer information and history
* **Real-time Tracking** - Track shipments in real-time
* **Analytics & Reports** - Comprehensive delivery reports and analytics
* **Calendar Integration** - Schedule and manage deliveries

## Installation

### Prerequisites

To get started with TailAdmin, ensure you have the following prerequisites installed and set up:

* Node.js 18.x or later (recommended to use Node.js 20.x or later)

### Cloning the Repository

Clone the repository using the following command:

```bash
git clone https://github.com/TailAdmin/free-nextjs-admin-dashboard.git
```

> Windows Users: place the repository near the root of your drive if you face issues while cloning.

1. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

   > Use `--legacy-peer-deps` flag if you face peer-dependency error during installation.

2. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Components

The delivery management system includes:

* **Delivery Dashboard** - Overview with key metrics and statistics
* **Shipment Tracking** - Real-time tracking of all deliveries
* **Driver Management** - Driver profiles, schedules, and performance
* **Vehicle Management** - Vehicle tracking and maintenance
* **Route Planning** - Interactive route optimization
* **Customer Portal** - Customer management and history
* **Analytics Dashboard** - Comprehensive delivery analytics
* **Calendar Integration** - Schedule management
* **Data Visualization** - Charts and graphs for delivery metrics
* **Dark Mode Support** 🕶️

All components are built with React and styled using Tailwind CSS for easy customization.

## Changelog

### Version 2.2.2 - [December 30, 2025]

* Fixed date picker positioning and functionality in Statistics Chart.


### Version 2.1.0 - [November 15, 2025]

* Updated to Next.js 16.x
* Fixed all reported minor bugs

### Version 2.0.2 - [March 25, 2025]

* Upgraded to Next.js 16.x for [CVE-2025-29927](https://nextjs.org/blog/cve-2025-29927) concerns
* Included overrides vectormap for packages to prevent peer dependency errors during installation.
* Migrated from react-flatpickr to flatpickr package for React 19 support

### Version 2.0.1 - [February 27, 2025]

#### Update Overview

* Upgraded to Tailwind CSS v4 for better performance and efficiency.
* Updated class usage to match the latest syntax and features.
* Replaced deprecated class and optimized styles.

#### Next Steps

* Run npm install or yarn install to update dependencies.
* Check for any style changes or compatibility issues.
* Refer to the Tailwind CSS v4 [Migration Guide](https://tailwindcss.com/docs/upgrade-guide) on this release. if needed.
* This update keeps the project up to date with the latest Tailwind improvements. 🚀

### v2.0.0 (February 2025)

A major update focused on Next.js 16 implementation and comprehensive redesign.

#### Major Improvements

* Complete redesign using Next.js 16 App Router and React Server Components
* Enhanced user interface with Next.js-optimized components
* Improved responsiveness and accessibility
* New features including collapsible sidebar, chat screens, and calendar
* Redesigned authentication using Next.js App Router and server actions
* Updated data visualization using ApexCharts for React

#### Breaking Changes

* Migrated from Next.js 14 to Next.js 16
* Chart components now use ApexCharts for React
* Authentication flow updated to use Server Actions and middleware

[Read more](https://tailadmin.com/docs/update-logs/nextjs) on this release.

### v1.3.4 (July 01, 2024)

* Fixed JSvectormap rendering issues

### v1.3.3 (June 20, 2024)

* Fixed build error related to Loader component

### v1.3.2 (June 19, 2024)

* Added ClickOutside component for dropdown menus
* Refactored sidebar components
* Updated Jsvectormap package

### v1.3.1 (Feb 12, 2024)

* Fixed layout naming consistency
* Updated styles

### v1.3.0 (Feb 05, 2024)

* Upgraded to Next.js 14
* Added Flatpickr integration
* Improved form elements
* Enhanced multiselect functionality
* Added default layout component

## License

TailAdmin Next.js Free Version is released under the MIT License.

## Support
If you find this project helpful, please consider giving it a star on GitHub. Your support helps us continue developing and maintaining this template.
