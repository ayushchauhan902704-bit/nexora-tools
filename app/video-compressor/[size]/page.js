export default function Page({ params }) {
  const size = params?.size || '5mb';
  return (
    <div style={{background:'#09090b',minHeight:'100vh',color:'white',padding:'30px',textAlign:'center'}}>
      <h1 style={{fontSize:'36px',fontWeight:900}}>Video Compressor to {size.toUpperCase()} - LIVE ✅</h1>
      <p>Finally 404 khatam!</p>
    </div>
  )
}
