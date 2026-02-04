import React, {useEffect, useState} from "react";
import axios from "axios";

export default function UserDashboard(){
  const [saved, setSaved] = useState([]);
  useEffect(()=>{ (async ()=>{ const r = await axios.get('/api/users/saved?userId=anonymous'); setSaved(r.data.saved||[]); })(); },[]);
  return (<div style={{padding:20}}>
    <h2>Saved recommendations</h2>
    {saved.map((s,i)=> <div key={i} style={{padding:10,border:"1px solid #eee",marginBottom:8}}><strong>{s.careerTitle}</strong> <div style={{fontSize:12,color:"#666"}}>{new Date(s.createdAt).toLocaleString()}</div></div>)}
  </div>);
}
