import React from 'react';
import { Dashboard } from '../pages/Dashboard';
import { Quran } from '../pages/Quran';
import { Tasbih } from '../pages/Tasbih';
import { Adhkar } from '../pages/Adhkar';
import { PrayerGrid } from '../pages/PrayerGrid';
import { DashboardLayout } from '../layouts/DashboardLayout';

export const appRoutes = [
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'quran',
        element: <Quran />,
      },
      {
        path: 'tasbih',
        element: <Tasbih />,
      },
      {
        path: 'adhkar',
        element: <Adhkar />,
      },
      {
        path: 'prayer',
        element: <PrayerGrid />,
      },
    ],
  },
];
