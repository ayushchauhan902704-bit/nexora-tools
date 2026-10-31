export default function Page({ params }) {
  const size = params?.size || '5mb';
  const title = size.toUpperCase();
  return (
    <div style={{background:'#09090b',minHeight:'100vh',color:'white',fontFamily:'system-ui'}}>
      <div style={{maxWidth:'900px',margin:'auto',padding:'20px'}}>
        <a href="/" style={{fontWeight:900,color:'white',textDecoration:'none'}}>🧮 NEXORA Tools</a>
        <h1 style={{fontSize:'32px',fontWeight:900,marginTop:'40px',textAlign:'center'}}>Video Compressor to {title} - Free</h1>
        <p style={{textAlign:'center',color:'#9ca3af',marginTop:'10px'}}>Ye {title} wala page LIVE hai! ✅</p>
        
        <div style={{background:'white',borderRadius:'20px',padding:'10px',marginTop:'30px'}}>
          <iframe src="/video-compressor" style={{width:'100%',height:'800px',border:'none',borderRadius:'15px'}} title="video compressor"></iframe>
        </div>

        <div style={{textAlign:'center',marginTop:'20px'}}>
          <a href="/video-compressor" style={{color:'#f97316',fontWeight:700}}>← Back to Main Compressor</a>
        </div>
      </div>
    </div>
  );
}
