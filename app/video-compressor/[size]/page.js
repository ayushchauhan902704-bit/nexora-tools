// app/video-compressor/[size]/page.js
export async function generateStaticParams() {
  return [{size:'5mb'},{size:'10mb'},{size:'20mb'},{size:'50mb'},{size:'100mb'},{size:'whatsapp'},{size:'instagram'},{size:'email'}];
}

export async function generateMetadata({ params }) {
  const s = params.size;
  return {
    title: `Video Compressor to ${s.toUpperCase()} - Free HD No Watermark | NEXORA`,
    description: `Compress video to exact ${s} - Free, HD, audio, private, no watermark. Browser based.`,
  };
}

export default function Page({ params }) {
  // yaha tera wala pura index.html ka code aayega as component
  // shortcut: tu apna index.html ka pura code yaha return me daal de
  return (
    <div dangerouslySetInnerHTML={{ __html: `
      ${/* yaha tera index.html ka pura <head> + <body> ka code paste kar */''}
    `}} />
  );
}
