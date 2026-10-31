export default function Page({ params }) {
  const size = params?.size || '5mb';
  return (
    <div style={{background:'#09090b',minHeight:'100vh',color:'white',padding:'20px',textAlign:'center'}}>
      <h1 style={{fontSize:'32px',fontWeight:900}}>Video Compressor to {size.toUpperCase()} - LIVE ✅</h1>
      <a href="/video-compressor" style={{color:'#f97316',fontWeight:700}}>Back to Main</a>
    </div>
  );
}
