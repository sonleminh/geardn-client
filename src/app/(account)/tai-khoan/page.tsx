'use client';

import { useWhoAmI } from '@/apis/auth';
import React from 'react';

export default function Profile() {
  const { data: userData } = useWhoAmI();
  return <div>Profile</div>;
}
