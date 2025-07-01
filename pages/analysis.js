import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '2rem' }}>
          InvestiScope™ Property Investment Suite
        </h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '4rem' }}>
          {/* Free Survey */}
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '2rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.2)' }}>
            <h2>Property Survey Tool</h2>
            <p style={{ margin: '1rem 0' }}>FREE - Basic Analysis</p>
            <ul style={{ textAlign: 'left', margin: '1rem 0' }}>
              <li>✓ 7-Section Property Survey</li>
              <li>✓ Mini PIA Grant Calculator</li>
              <li>✓ Investment Scoring</li>
              <li>✓ Basic Report</li>
            </ul>
            <Link href="/survey" style={{ display: 'inline-block', marginTop: '1rem', padding: '1rem 2rem', background: '#3b82f6', color: 'white', borderRadius: '10px', textDecoration: 'none' }}>
              Start Free Survey →
            </Link>
          </div>
          
          {/* Premium Analysis */}
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '2rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.2)' }}>
            <h2>Document Analysis</h2>
            <p style={{ margin: '1rem 0' }}>PREMIUM - AI Analysis</p>
            <ul style={{ textAlign: 'left', margin: '1rem 0' }}>
              <li>✓ AI Document Analysis</li>
              <li>✓ Data Extraction</li>
              <li>✓ Compliance Checks</li>
              <li>✓ Full Report Export</li>
            </ul>
            <Link href="/analysis" style={{ display: 'inline-block', marginTop: '1rem', padding: '1rem 2rem', background: '#8b5cf6', color: 'white', borderRadius: '10px', textDecoration: 'none' }}>
              Try Premium →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
