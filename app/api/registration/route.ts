const ENDPOINT='https://script.google.com/macros/s/AKfycbyMkCv0wyJI-xdUlTyYpNQib2JCMLhXC7TDGBI0MWRYflAH3NwcjleRLjRyHlImOBZk/exec';
export async function POST(request:Request){
 if(request.headers.get('origin')!==new URL(request.url).origin)return Response.json({ok:false},{status:403});
 let data:Record<string,string>;try{const raw=await request.text();if(raw.length>7000)return Response.json({ok:false},{status:413});data=JSON.parse(raw)}catch{return Response.json({ok:false},{status:400})}
 if(data.website)return Response.json({ok:false},{status:400});
 if(!['nome','email','whatsapp','crm','especialidade'].every(k=>typeof data[k]==='string'&&data[k].trim().length>0&&data[k].length<=200)||!/^\S+@\S+\.\S+$/.test(data.email)||!['Summit 360','Summit VIP'].includes(data.ingresso))return Response.json({ok:false},{status:400});
 const allowed=['nome','email','whatsapp','crm','especialidade','ingresso','pagina','referrer','utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','fbclid'];const payload=Object.fromEntries(allowed.map(k=>[k,String(data[k]||'').slice(0,500)]));
 try{const r=await fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload),signal:AbortSignal.timeout(20000)});const text=await r.text();let result:Record<string,unknown>={};try{result=JSON.parse(text)}catch{}const confirmed=r.ok&&(result.success===true||result.ok===true||result.status==='success'||result.result==='success');if(confirmed)return Response.json({ok:true});return Response.json({ok:false,uncertain:true},{status:502})}catch{return Response.json({ok:false,uncertain:true},{status:502})}
}
