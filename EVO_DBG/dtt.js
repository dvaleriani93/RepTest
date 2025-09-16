// ************************************
// Pro Gamma Instant Developer
// DTT javascript library
// (c) 1999-2003 Pro Gamma Srl
// all rights reserved
// www.progamma.com
// ***********************************
var ItemsCount=0;
var LastIdx=-1;       // Indice dell'ultimo oggetto trovato
var LastObj="";       // Ultimo oggetto cercato (se cambia azzero l'indice dell'ultimo oggetto trovato)
var LastDiv;          // Ultimo div colorato
var LastDiv2;         // Ultimo div colorato
var SessionName = "";
var snpos = window.location.search.indexOf("SESSNAME=");
if (snpos != -1)
{
  var snend = window.location.search.indexOf("&", snpos);
  if (snend == -1)
    SessionName = window.location.search.substring(snpos + "SESSNAME=".length);
  else
    SessionName = window.location.search.substring(snpos + "SESSNAME=".length, snend);
}


function dt(objstr) 
{
  dtttoggle(objstr);
}

function dtttoggle(objstr) 
{
  var obj,img, st;
  try
  {
    obj = parent.ReqRef.document.all[objstr];
    img = parent.ReqRef.document.all["t"+objstr];
    if (obj.style.display!="block")
    {
      st=1;
      obj.style.display="block";
      img.src="dttimg/cmp.gif";
    }
    else
    {
      st=2;
      obj.style.display="none";
      img.src="dttimg/exp.gif";
    }
   } 
   catch (e) {}
   try 
   {
     obj = parent.ReqChk.document.all[objstr+"chk"];
     img = parent.ReqChk.document.all["t"+objstr+"chk"];
     if (obj.style.display!="block")
     {
       obj.style.display="block";
       img.src="dttimg/cmp.gif";
     }
     else
     {
       obj.style.display="none";
       img.src="dttimg/exp.gif";
     }
   } catch (e) {}
   return st;
}


function de(objstr) 
{
  var st = dtttoggle(objstr);
  if (event.ctrlKey)
  {
    // Ripeto anche su tutti i blocchi interni...
    var i,z;
    try
    {
      var c = parent.ReqRef.document.all[objstr].getElementsByTagName('*');
      z=c.length;
      for (i=0;i<z;i++)
      {
        var o=c[i];
        if (o.id.substr(0,3)=="blk")
          o.style.display=(st==1)?"block":"none";
        if (o.id.substr(0,4)=="tblk")
          o.src=(st==1)?"dttimg/cmp.gif":"dttimg/exp.gif";
      }
    } catch(ex) { }
    try
    {
      var c = parent.ReqChk.document.all[objstr].getElementsByTagName('*');
      z=c.length;
      for (i=0;i<z;i++)
      {
        var o=c[i];
        if (o.id.substr(0,3)=="blk")
          o.style.display=(st==1)?"block":"none";
        if (o.id.substr(0,4)=="tblk")
          o.src=(st==1)?"dttimg/cmp.gif":"dttimg/exp.gif";
      }
    } catch(ex) { }
  }
}

function showall(status)
{
  var i;
  for (i = 1; i<=ItemsCount; i++) 
  {
    try { parent.ReqRef.document.all['it'+i].style.display=status; } catch (e) {}
    try { parent.ReqChk.document.all['it'+i+'chk'].style.display=status; } catch (e) {}
  }
}

function expall(st)
{
  var i,z;
  try
  {
    var c = parent.ReqRef.document.getElementsByTagName('*');
    z=c.length;
    for (i=0;i<z;i++)
    {
      var o=c[i];
      if (o.id.substr(0,3)=="blk")
        o.style.display=(st)?"block":"none";
      if (o.id.substr(0,4)=="tblk")
        o.src=(st)?"dttimg/cmp.gif":"dttimg/exp.gif";
    }
  } catch (e) {}
  //
  try
  {
    var c = parent.ReqChk.document.getElementsByTagName('*');
    z=c.length;
    for (i=0;i<z;i++)
    {
      var o=c[i];
      if (o.id.substr(0,3)=="blk")
        o.style.display=(st)?"block":"none";
      if (o.id.substr(0,4)=="tblk")
        o.src=(st)?"dttimg/cmp.gif":"dttimg/exp.gif";
    }
  } catch (e) {}
}

function refreshdetails()
{
  try { parent.ReqRef.window.location.reload(true); } catch (e) {}
  try { parent.ReqChk.window.location.reload(true); } catch (e) {}
}


function findit(obj)
{
  try 
  {
    var c = parent.ReqRef.document.getElementsByName(obj);
    //
    try
    {
      if (LastDiv!=undefined)
        LastDiv.style.backgroundColor = '';
      if (LastDiv2!=undefined)
        LastDiv2.style.backgroundColor = '';
    }
    catch(ex) {}
    //
    if (obj!=LastObj)
      LastIdx = -1;   // Se l'oggetto da cercare non è più quello di prima... riparto dall'inizio
    LastObj = obj;    // Memorizzo l'ultimo oggetto cercato
    LastIdx++;
    if (LastIdx<c.length)
    {
      o = c[LastIdx];
      if (o) 
      {
        while (o.tagName!='DIV') 
          o = o.parentNode;
        //
        // ora o è un DIV, ma devo controllare che tutti i div fino alla radice siano espansi
        var z = o;
        while (z!=null && z.tagName!="BODY")
        {
          if (z.id.substring(o,3)=="blk" && z.style.display=="none")
            dtttoggle(z.id);
          z=z.parentNode;
        }
        //
        o.scrollIntoView(false);
        if (parent.ReqRef.document.body.scrollTop>0) //parent.ReqRef.document.body.clientHeight/2)
          parent.ReqRef.document.body.scrollTop = parent.ReqRef.document.body.scrollTop + parent.ReqRef.document.body.clientHeight/2;
        if (obj=='stop')
        {
          o.style.backgroundColor = '#fbcccc';
          LastDiv = o;
        }
        if (obj=='warn')
        {
          o.style.backgroundColor = 'yellow';
          LastDiv = o;
        }
        if (obj.substring(0,4)=="proc")
        {
          o.style.backgroundColor = 'lightgreen';
          LastDiv = o;
          //
          LastDiv2 = parent.ReqRef.document.getElementById(o.id.substr(1));
          if (LastDiv2!=undefined)
          {
            LastDiv2.style.backgroundColor = '#E8FFE8';
          }
        }
        return;
       }
    }
    alert('Not found');
    LastIdx = -1;
  } 
  catch (ex) { alert(ex); }
}


function gf(af, nome)
{
  var fr = null;
  if (document.all)
    fr = af[nome];
  else
  {
    for ( i = 0; i< af.length; i++ ) 
    {
      var s=af[i].name;
      if (s.indexOf(nome)!=-1) 
      {
        fr = af[i];
        break;
      }
    }
  }
  //
  return (fr) ? fr : window;
}

var lastreq = "";  // Richiesta selezionata
function showreq(objstr, skipdet)
{
  var obj = document.getElementById("R"+objstr);
  var i;
  for (i=1; i<=ReqsNum; i++)
  {
    try
    {
      document.getElementById("R"+i).style.fontWeight = "normal";
    }
    catch (e) {}
  } 
  lastreq = objstr;
  obj.style.fontWeight = "bold";
  if (!skipdet)
    gf(window.parent.frames, "Detail").location.href = "?WCI=IWDTT&WCE=" + objstr + (SessionName ? "&SESSNAME=" + SessionName : "");
}

function showprof()
{ 
  document.location.href = "?WCI=IWDTT&WCE=TIMER" + (SessionName ? "&SESSNAME=" + SessionName : "");
  if (lastreq != '') 
  {
    var cmd = 'gf(window.parent.frames, "ItemList").showreq(' + lastreq + ')';
    gf(window.parent.frames, "CmdForm").setTimeout(cmd, 200);
  }
}

function refreshreqlist() 
{
  var wassel = 0;
  for (var i=1; i<=ReqsNum && wassel==0; i++)
  {
    var o = document.getElementById("R"+i);
    if (o && o.style.fontWeight == "bold")
      wassel = i;
  }
  //
  var reqlist;
  var req = new XMLHttpRequest();
  req.open("GET", window.location.href, true);
  req.onreadystatechange = function() {
    if (req.readyState == 4 && req.status == 200) {
      var html = req.responseText;
      var jsToExecute = "";
      //
      if (document.getElementById("reqlist").scrollTop)
        jsToExecute += "document.getElementById(\"reqlist\").scrollTop = " + document.getElementById("reqlist").scrollTop + "; ";
      //
      if (wassel)
        jsToExecute += "showreq(" + wassel + ",true); ";
      //
      if (jsToExecute)
        html = html.replace("</html>", "<script language=\"javascript\" type=\"text/javascript\">" + jsToExecute + "</script></html>");
      //
      gf(window.parent.frames, "ItemList").document.open();
      gf(window.parent.frames, "ItemList").document.write(html);
      gf(window.parent.frames, "ItemList").document.close();
    }
  };
  req.send();
};
