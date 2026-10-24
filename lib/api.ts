const BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
export function getToken(){ if(typeof window==='undefined')return ''; return localStorage.getItem('dt_token')||''; }
export async function api(path:string, options:RequestInit={}){
 const headers:Record<string,string>={'Content-Type':'application/json',...((options.headers||{}) as Record<string,string>)};
 const token=getToken();if(token)headers.Authorization=`Bearer ${token}`;
 const response=await fetch(`${BASE}${path}`,{...options,headers,cache:'no-store'});
 const data=await response.json().catch(()=>({message:'Unexpected server response'}));
 if(!response.ok){if(response.status===401&&typeof window!=='undefined'&&!path.startsWith('/auth/login')){localStorage.removeItem('dt_token');localStorage.removeItem('dt_user');window.location.href='/login';}throw new Error(data.message||'Request failed');}
 return data;
}
