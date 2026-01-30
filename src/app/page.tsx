import React from 'react';

export default function Home() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1 style={{ color: '#0070f3' }}>🚀 E-Commerce Store is Running!</h1>
      <p>If you see this, your Docker container and Next.js App Router are working perfectly.</p>
      <p>Database Status: Connected (PostgreSQL)</p>
    </div>
  );
}