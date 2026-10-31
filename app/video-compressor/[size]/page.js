'use client';
import { useEffect, useState } from 'react';

export default function Page({ params }) {
  const raw = (params?.size || '5mb').toLowerCase();
  
  // URL se size nikalna
  const getSize = () => {
    const num = parseInt(raw.replace(/[^0-9]/g,''));
    if(!isNaN(num) && num > 0) return num;
    if(raw.includes('whatsapp')) return 16;
    if(raw.includes('instagram')) return 50;
    if(raw.includes('email')) return 25;
    return 5;
  };
  
  const displaySize = raw.toUpperCase();
  const initialSize = getSize();

  useEffect(() => {
    // Tera wala hi purana wala JS logic yaha aayega
    // Main same code daal raha hu bas selectedSize = initialSize
    const $ = (id) => document.getElementById(id);
    let selectedFile=null, selectedSize=initialSize, videoDuration=0, videoWidth=0, videoHeight=0;
    let outputBlob=null, outputURL=null, originalURL=null, busy=false;
    const formatSize = (b) => (b/1048576).toFixed(2)+" MB";
    const formatDuration = (s) => { if(!isFinite(s)) return "Unknown"; const m=Math.floor(s/60), sec=Math.floor(s%60); return `${m} min ${sec} sec`; }
    
    function loadVideo(file){
      if(busy||!file) return; selectedFile=file;
      if(originalURL) URL.revokeObjectURL(originalURL);
      originalURL=URL.createObjectURL(file);
      const v=$("originalVideo"); if(!v) return;
      v.src=originalURL; v.muted=false;
      $("fileName").textContent=file.name; $("originalSize").textContent=formatSize(file.size);
      $("fileInfo").classList.remove("hidden"); $("previewBox").classList.remove("hidden");
      v.onloadedmetadata=()=>{videoDuration=v.duration; videoWidth=v.videoWidth; videoHeight=v.videoHeight; $("durationText").textContent=formatDuration(videoDuration); $("resolutionText").textContent=videoWidth+"x"+videoHeight;};
      v.load();
    }
    
    const dropArea = $("dropArea"); if(dropArea){ dropArea.onclick=()=>$("fileInput").click(); }
    const fileInput = $("fileInput"); if(fileInput) fileInput.onchange=e=>loadVideo(e.target.files[0]);
    if(dropArea){
      ["dragenter","dragover"].forEach(ev=>{dropArea.addEventListener(ev,e=>{e.preventDefault(); dropArea.classList.add("active");});});
      ["dragleave","drop"].forEach(ev=>{dropArea.addEventListener(ev,e=>{e.preventDefault(); dropArea.classList.remove("active");});});
      dropArea.addEventListener("drop",e=>loadVideo(e.dataTransfer.files[0]));
    }
    document.querySelectorAll(".sz").forEach(b=>{
      b.onclick=()=>{
        if(busy) return; document.querySelectorAll(".sz").forEach(x=>x.classList.remove("selected"));
        b.classList.add("selected"); selectedSize=Number(b.dataset.size);
        const btn=$("compressBtn"); if(btn) btn.textContent=`⚡ Compress Video to ${selectedSize} MB`;
      };
    });
    // initial selected button
    document.querySelectorAll(".sz").forEach(b=>{ if(Number(b.dataset.size)===initialSize){ b.classList.add("selected"); } else { b.classList.remove("selected"); } });
    const compressBtn = $("compressBtn");
    if(compressBtn){
      compressBtn.textContent=`⚡ Compress Video to ${initialSize} MB`;
      compressBtn.onclick=async()=>{
        if(busy) return;
        if(!selectedFile){$("errorBox").textContent="Upload video first"; $("errorBox").classList.remove("hidden"); return;}
        if(!isFinite(videoDuration)||videoDuration<=0){$("errorBox").textContent="Wait for preview"; $("errorBox").classList.remove("hidden"); return;}
        busy=true; $("errorBox").classList.add("hidden"); $("progressBox").classList.remove("hidden"); compressBtn.disabled=true;
        compressBtn.textContent="Compressing..."; $("resultBox").classList.add("hidden");
        const v=$("originalVideo"), c=$("canvas"), ctx=c.getContext("2d");
        await new Promise(r=>{if(v.readyState>=1) r(); else v.onloadedmetadata=r;});
        const targetBytes = selectedSize * 1024 * 1024;
        const audioBps = 128000;
        let totalBps = (targetBytes * 8) / videoDuration;
        let videoBps = Math.floor((totalBps * 0.90) - audioBps);
        if(videoBps < 500000) videoBps = 500000;
        let scale = selectedSize <= 5 ? 0.75 : 0.9;
        c.width=videoWidth*scale; c.height=videoHeight*scale;
        const canvasStream=c.captureStream(30);
        const videoTrack=canvasStream.getVideoTracks()[0];
        let audioTrack=null; let audioCtx=null;
        try{
          audioCtx=new (window.AudioContext||window.webkitAudioContext)();
          const source=audioCtx.createMediaElementSource(v);
          const dest=audioCtx.createMediaStreamDestination();
          source.connect(dest); try{source.connect(audioCtx.destination);}catch(e){}
          if(dest.stream.getAudioTracks().length>0) audioTrack=dest.stream.getAudioTracks()[0];
        }catch(e){}
        const mixed=new MediaStream(); mixed.addTrack(videoTrack); if(audioTrack) mixed.addTrack(audioTrack);
        const mime=MediaRecorder.isTypeSupported('video/mp4;codecs=avc1') ? 'video/mp4;codecs=avc1' : 'video/mp4';
        const rec=new MediaRecorder(mixed,{mimeType:mime, videoBitsPerSecond:videoBps});
        let chunks=[]; rec.ondataavailable=e=>{if(e.data.size>0) chunks.push(e.data);};
        rec.onstop=()=>{
          outputBlob=new Blob(chunks,{type:"video/mp4"});
          if(outputURL) URL.revokeObjectURL(outputURL);
          outputURL=URL.createObjectURL(outputBlob);
          $("beforeSize").textContent=formatSize(selectedFile.size);
          $("afterSize").textContent=formatSize(outputBlob.size);
          $("resultMessage").textContent=`Original ${formatSize(selectedFile.size)} → ${formatSize(outputBlob.size)} | Target ${selectedSize}MB`;
          $("outputVideo").src=outputURL; $("outputVideo").classList.remove("hidden"); $("outputVideo").load();
          $("resultBox").classList.remove("hidden"); $("progressBox").classList.add("hidden");
          busy=false; compressBtn.disabled=false; compressBtn.textContent=`⚡ Compress Video to ${selectedSize} MB`;
          if(audioCtx) audioCtx.close();
        };
        v.currentTime=0; v.muted=false; v.volume=1; try{await v.play();}catch(e){}
        rec.start(100);
        const iv=setInterval(()=>{
          if(v.ended || v.paused || v.currentTime>=videoDuration){ clearInterval(iv); rec.stop(); v.pause(); return; }
          ctx.drawImage(v,0,0,c.width,c.height);
          const p=Math.round((v.currentTime/videoDuration)*100);
          $("progressBar").style.width=p+"%"; $("percentText").textContent=p+"%"; $("statusText").textContent=`Compressing to ${selectedSize}MB - ${p}%`;
        },33);
      };
    }
    const downloadBtn = $("downloadBtn");
    if(downloadBtn){
      downloadBtn.onclick=()=>{
        if(!outputBlob) return; const a=document.createElement("a"); a.href=outputURL;
        a.download=selectedFile.name.replace(/\.[^/.]+$/,"")+`-compressed-${selectedSize}MB.mp4`; a.click();
      };
    }
  }, [initialSize]);

  return (
    <div className="min-h-screen bg-[#09090b]">
      <style>{`*{box-sizing:border-box} #dropArea.active{background:#ffedd5;border-color:#f97316} .sz{border:1px solid #e5e7eb;background:#f9fafb;color:#444} .sz.selected{background:#f97316;color:white;border-color:#f97316} .badge{font-size:11px;font-weight:700;background:#dcfce7;color:#166534;padding:5px 10px;border-radius:20px}`}</style>
      <nav style={{maxWidth:'900px',margin:'auto',display:'flex',justifyContent:'space-between',padding:'14px 15px'}}><a href="/" style={{fontWeight:900,color:'white',textDecoration:'none'}}>🧮 NEXORA Tools</a><span className="badge">● 89K+ USERS • {displaySize} PAGE</span></nav>
      <div style={{textAlign:'center',padding:'10px 20px'}}>
        <h1 style={{fontSize:'28px',fontWeight:900,color:'white'}}>Video Compressor to {displaySize} - Free HD No Watermark</h1>
        <p style={{fontSize:'12px',color:'#9ca3af',marginTop:'6px'}}>Compress video to exact {displaySize} - Fast, Audio, Private - Worldwide No.1 Tool</p>
      </div>
      <div className="max-w-xl mx-auto px-3 py-4">
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-2xl">
          <div id="dropArea" className="border-2 border-dashed border-orange-400 bg-orange-50 rounded-2xl p-7 text-center cursor-pointer"><div className="text-5xl mb-3">🎬</div><h2 className="font-bold text-gray-800">Upload Your Video for {displaySize}</h2><p className="text-sm text-gray-500 mt-2">Click or drag and drop</p><input id="fileInput" type="file" accept="video/*" hidden /></div>
          <div id="fileInfo" className="hidden mt-4 bg-gray-50 rounded-xl p-3"><p id="fileName" className="font-bold text-sm break-all"></p><div className="flex justify-between text-xs text-gray-500 mt-2"><span>Original Size</span><b id="originalSize"></b></div><div className="flex justify-between text-xs text-gray-500 mt-1"><span>Duration</span><b id="durationText"></b></div><div className="flex justify-between text-xs text-gray-500 mt-1"><span>Resolution</span><b id="resolutionText"></b></div></div>
          <div id="previewBox" className="hidden mt-4"><p className="font-bold text-sm mb-2">Preview</p><video id="originalVideo" controls playsInline className="w-full rounded-xl max-h-64 bg-black"></video></div>
          <canvas id="canvas" className="hidden"></canvas>
          <div className="mt-6"><h2 className="font-bold text-lg">Choose Target Size</h2><div className="grid grid-cols-3 gap-3 mt-4">
            <button className="sz selected rounded-xl py-4 font-bold text-lg" data-size="5">5 MB</button><button className="sz rounded-xl py-4 font-bold text-lg" data-size="10">10 MB</button><button className="sz rounded-xl py-4 font-bold text-lg" data-size="20">20 MB</button><button className="sz rounded-xl py-4 font-bold text-lg" data-size="30">30 MB</button><button className="sz rounded-xl py-4 font-bold text-lg" data-size="40">40 MB</button><button className="sz rounded-xl py-4 font-bold text-lg" data-size="50">50 MB</button><button className="sz rounded-xl py-4 font-bold text-lg" data-size="75">75 MB</button><button className="sz rounded-xl py-4 font-bold text-lg" data-size="100">100 MB</button>
          </div></div>
          <div id="progressBox" className="hidden mt-6"><div className="flex justify-between text-sm mb-2"><b id="statusText">Compressing...</b><b id="percentText" className="text-orange-600">0%</b></div><div className="h-3 rounded-full bg-gray-200 overflow-hidden"><div id="progressBar" className="bg-orange-500 h-full" style={{width:'0%'}}></div></div></div>
          <button id="compressBtn" className="w-full mt-6 bg-orange-500 text-white font-bold py-4 rounded-xl text-lg">⚡ Compress Video to {initialSize} MB</button>
          <div id="resultBox" className="hidden mt-6 border border-green-200 bg-green-50 rounded-2xl p-4"><h3 className="text-green-800 font-extrabold text-xl">✓ Compression Complete!</h3><div className="grid grid-cols-2 gap-3 mt-4"><div className="bg-white rounded-xl p-3"><p className="text-xs text-gray-500">Original</p><p id="beforeSize" className="font-extrabold text-lg"></p></div><div className="bg-white rounded-xl p-3"><p className="text-xs text-gray-500">Final</p><p id="afterSize" className="font-extrabold text-lg text-green-700"></p></div></div><p id="resultMessage" className="text-sm text-green-800 mt-4"></p><video id="outputVideo" controls playsInline className="hidden w-full rounded-xl mt-4 max-h-64 bg-black"></video><button id="downloadBtn" className="w-full mt-4 bg-green-600 text-white py-4 rounded-xl font-bold">⬇ Download Compressed Video</button></div>
          <div id="errorBox" className="hidden mt-4 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm"></div>
        </div>
      </div>
    </div>
  );
}
