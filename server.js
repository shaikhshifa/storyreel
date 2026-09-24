const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');

const port=Number(process.env.PORT||3000);
const root=__dirname;
const promptFor=(idea,genre)=>`Write a short ${genre} story in 6 scenes for a narrated animated video, based on this idea: "${idea}". Return ONLY valid JSON: {"title": string, "scenes": [{"narration": 1-2 sentences, under 30 words, "setting": one of forest|city|ocean|space|desert|mountains|hills, "time": one of day|dusk|night, "colors": [sky top hex, horizon hex], "cast": 1-3 emoji, "camera": one of in|out|left|right}]}. Match colors to the mood and give the story a clear beginning, middle and end.`;

function send(response,status,body,type='application/json'){
  response.writeHead(status,{'Content-Type':type,'Access-Control-Allow-Origin':'*'});
  response.end(type==='application/json'?JSON.stringify(body):body);
}

async function makeStory(request,response){
  if(!process.env.ANTHROPIC_API_KEY){send(response,503,{error:'ANTHROPIC_API_KEY is not configured'});return}
  let body='';
  request.on('data',chunk=>{body+=chunk;if(body.length>10000)request.destroy()});
  request.on('end',async()=>{
    try{
      const input=JSON.parse(body),idea=String(input.idea||'').trim(),genre=String(input.genre||'Fantasy');
      if(!idea||idea.length>2000)throw new Error('invalid_input');
      const result=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json','x-api-key':process.env.,'anthropic-version':'2023-06-01'},body:JSON.stringify({model:process.env.ANTHROPIC_MODEL||'claude-3-5-haiku-latest',max_tokens:1200,messages:[{role:'user',content:promptFor(idea,genre)}]})});
      if(!result.ok)throw new Error('anthropic_request_failed');
      const data=await result.json(),text=data.content?.find(item=>item.type==='text')?.text||'';
      send(response,200,JSON.parse(text));
    }catch(error){send(response,500,{error:error.message==='invalid_input'?'Invalid story idea':'Could not generate story'});}
  });
}

const server=http.createServer((request,response)=>{
  if(request.method==='OPTIONS'){send(response,204,'');return}
  if(request.method==='POST'&&request.url==='/api/story'){makeStory(request,response);return}
  if(request.method==='GET'&&(request.url==='/'||request.url==='/index.html')){
    send(response,200,fs.readFileSync(path.join(root,'index.html'),'utf8'),'text/html; charset=utf-8');return;
  }
  send(response,404,{error:'Not found'});
});

server.listen(port,()=>console.log(`Storyreel running at http://localhost:${port}`));