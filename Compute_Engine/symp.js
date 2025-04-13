function quickSort(x, y, first, last) {
    let f, l;
    let middle;

    middle = x[Math.floor((first + last) / 2)];
    f = first; l = last;
    while (f < l) {
        while (x[f] < middle) f++;
        while (x[l] > middle) l--;
        if (f <= l) {
            [x[f], x[l]] = [x[l], x[f]];
            [y[f], y[l]] = [y[l], y[f]];
            f++;
            l--;
        }
    }
    if (first < l) quickSort(x, y, first, l);
    if (f < last) quickSort(x, y, f, last);
}

//////////////////////////////////////////////

 function find_coeff(s) {
  let t,subs;
  let i;

 subs="";
 for(i=0;i<s.length;i++) {
  t=s[i];
  if (t === "x" && i===0) {
      subs = "1"; break;
  }
  if(t==="x") break;
  subs+=t;
 }
 return subs;
 }

///////////////////////////////////////////

function find_degree(s) {
  let t,subs;
  let i,n;

  n=s.indexOf("x");
  subs="";
 for(i=0;i<s.length;i++) {
  t=s[n+1+i];
  if(t===" " && s[n+i]==="x") t="1";
  if(t==="(" || t==="^") continue;
  if(t==="*"  || t===")") break;
  subs=subs+t;
 }
 return subs;
 }

///////////////////////////////////////////////////////////////

function xdegree(ij) {
   let k9,i,sum,result;

   if(ij<10) return "(1+x^"+ij.toString()+"y)";
   if(ij>=10 && ij<19)  k9=1;
   if(ij>=19 && ij<28)  k9=2;
   if(ij>=28 && ij<37)  k9=3;
   if(ij>=37 && ij<46)  k9=4;
   if(ij>=46 && ij<55)  k9=5;
   if(ij>=55 && ij<64)  k9=6;
   if(ij>=64 && ij<73)  k9=7;
   if(ij>=73 && ij<82)  k9=8;
   if(ij>=82 && ij<91)  k9=9;
   if(ij>=91 && ij<100) k9=10;
   if(ij>=100 && ij<109) k9=11;
   if(ij>=109 && ij<118) k9=12;
   if(ij>=118 && ij<127) k9=13;
   if(ij>=127 && ij<136) k9=14;
   if(ij>=136 && ij<145) k9=15;

   sum=""; 
   for(i=1;i<=k9;i++) {
    sum=sum+"x^9";
   }
    result="(1+"+sum+"x^"+(ij-k9*9).toString()+"y)";
    return(result);
  }
/////////////////////////////////////////////

function print(value) {
      document.write(value+'<br>');
 }

///////////////////////////////////////////////////////

function Test() {

  const ce = new ComputeEngine.ComputeEngine();
  let m=3;
  let n=3;
  let N=m+n;
  astart=0;
  let kx =parseFloat(0.5*(N+1));
  let crit;
  let i;

  //crit="Wilcoxon";
  //crit="Ansari";
  crit="Mood";

  let z=""; 
 if (crit === "Mood") {
     for (i=1;i<=N;i++) z=z+xdegree((i-kx)*(i-kx));
    } else if (crit === "Ansari") {
        for (i=1;i<=N;i++) z=z+xdegree(Math.abs(i-kx));
        astart = 2;
    } else if (crit === "Wilcoxon") {
      for(i=1;i<=N;i++)  z=z+xdegree(i); 
    }

  if(m<10) sfilter="y^"+m.toString();
  if(m>=10) sfilter="y^("+m.toString()+")";
  if(crit==="Ansari") {
     if(n<10) sfilter="y^"+n.toString();
     if(n>=10) sfilter="y^("+n.toString()+")";
 }

   let np=0;
  
   w=ce.parse(z).expand();
   w=w.toString();
   w=w.split("+");
   k=w.length;
   for(i=0;i<k;i++) {
     w[i]=w[i].trim();
  }
  

  let wx=[];
  let wrange=[];
  let pw=[];
 
  for (i = 0; i < k; i++) {
     s=w[i];
     if (s==="1") continue;
     np=s.indexOf(sfilter);
     if (np>=0) {
         coef=find_coeff(s);
         if (coef === "") continue;
         wrange.push(parseFloat((find_degree(s))));
         wx.push(parseFloat(coef));
     }
  }

   k = wrange.length;
   quickSort(wrange,wx,0,k-1); 

    let sum = 0;
    for (i = 0; i < k; ++i) sum += wx[i];
    let ss = 0;
    for (i = 0; i < k; i++) {
        ss += wx[i];
        pw.push(ss/sum);
    }

 if(crit=="Wilcoxon") {
          astart=(m+1)*m/2;
          for ( i = 0; i < k; ++i) wrange[i]=astart+i;
    }

    if(crit=="Ansari") {
        astart = (parseInt((m + 1) / 2)) * (1 +parseInt(m / 2));
        for ( i = 0; i < k; ++i) wrange[i]=astart+i;
    }

    document.write("Criterion: ",crit,"<br>");
    document.write("Size=",k,"<br>");
    document.write("m=",m,"     n=",n,"<br>");
    for ( i = 0; i < k;i++) {
        document.write(wx[i]," ; ",wrange[i]," ; ",pw[i],"  ","<br>");
    }


}