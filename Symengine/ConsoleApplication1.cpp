#include <fstream>
#include <vector>
#include <cmath>
#include <numeric>
#include <algorithm>
#include <string.h>
#include <sstream>
#include <iomanip>

#include <symengine/simplify.h>


using namespace std;
using namespace SymEngine;


 string find_degree(string s);
 string find_coeff(string s);
 void quickSort(vector <double> &x, vector<double>&y, int first, int last);



 ///////////////////////////////////////////////////////////
 
 void quickSort(vector <double> &x,vector<double>&y,int first,int last) {
     int  f,l;
     double middle;

     middle = x[(first + last) / 2];
     f = first; l = last;
     while (f < l) {
         while (x[f] < middle) f++;
         while (x[l] > middle) l--;
         if (f <= l) {
             swap(x[f], x[l]);
             swap(y[f], y[l]);
             f++;
             l--;
         }
     }
     if (first < l) quickSort(x,y, first, l);
     if (f < last) quickSort(x,y, f, last);
 }


 
//////////////////////////////////////////////

 string find_coeff(string s) {
  string t,subs;
  int i;

 subs="";
 for(i=0;i<s.length();i++) {
  t=s.substr(i,1);
  if(t=="*") break;
  if (t == "x") {
      subs = "1";
      break;
  }

  subs+=t;
 }
 return subs;
 }

///////////////////////////////////////////

string find_degree(string s) {
  string t,subs;
  int i,n;

  n=s.find("x");
  subs="";
 for(i=0;i<s.length();i++) {
  t=s.substr(n+3+i,1);
  if(t=="y") break;
  subs+=t;
 }
 subs=subs.substr(0,subs.length()-1);
 return subs;
 }

/////////////////////////////////////////////////


int main() {

    int k, i,km,astart,kk,m,n,np;
    long int N;
    string s, coef, degree, sfilter, t,crit;
    double kx;
    vector <double> wrange;
    vector <double> w;
    vector <double> pw;
    RCP<const Basic> x = symbol("x");
    RCP<const Basic> y = symbol("y");
    RCP<const Basic> z_expr = integer(1);
    vector<RCP<const Basic>> coeff;
    RCP<const Basic> zz;

    ifstream finp("common.inp");
    getline(finp, crit);
    crit.erase(remove(crit.begin(), crit.end(), '\n'), crit.end());

    // Sample 1
     finp >> m;
    // Sample 2
     finp >> n;
    finp.close();


    km = m;
    astart = 0;
     N = m + n;
    kk = N + 1;
    kx =double(0.5*(N+1));
   

    ofstream fout("common.csv");

    if (crit == "Mood") {
        for (int i = 1; i < kk; i++) {
            z_expr = z_expr * (1 + y*pow(x,(1.0*i-kx)*(1.0*i-kx)));
        }
    } else if (crit == "Ansari") {
        for (int i = 1; i < kk; i++) {
            z_expr = z_expr * (1 + pow(x,abs(1.0*i-kx))*y);
        }
        astart = 2;
    } else if (crit == "Wilcoxon") {
        for (int i = 1; i < kk; i++) {
            z_expr = z_expr * (1 + pow(x, i) * y);
        }
    }

    zz =expand(z_expr);
    coeff=zz->get_args(); //->coeff(y, km);

    k = coeff.size();
    
    sfilter = "y**"+to_string(m);
    if(crit=="Ansari") sfilter = "y**" + to_string(n); 

    for (i = 0; i < k; i++) {
        np=0;
        s = coeff[i]->__str__();
        if (s == "1") continue;
        np=s.find(sfilter);
        if (np!=-1) {
            coef = find_coeff(s);
            if (coef == "") continue;
            wrange.push_back(stod(find_degree(s)));
            w.push_back(stod(coef));
        }
    }

    k = wrange.size();
    quickSort(wrange,w,0,wrange.size()-1);


    double sum = 0;
    for (i = 0; i < k; ++i) {
        sum += w[i];
    }

    //reverse(w.begin(), w.end());

    double ss = 0;
    for (i = 0; i < k; i++) {
        ss += w[i];
        pw.push_back(ss/sum);
    }

    if(crit=="Wilcoxon") {
          astart=(m+1)*m/2;
          for ( i = 0; i < k; ++i) wrange[i]=astart+i;
    }

    if(crit=="Ansari") {
        astart = (int((m + 1) / 2)) * (1 + int(m / 2));
        for ( i = 0; i < k; ++i) wrange[i]=astart+i;
    }

    fout << crit << endl;
    fout << "Size; " << w.size() << endl;
    fout << "m; " << m << "; n; " << n << endl;
    fout << "Freq; Rang; Prob;" << endl;

    for ( i = 0; i < k; i++) {
        fout << w[i] << "; " << wrange[i] << "; " <<setprecision(12)<<fixed<< pw[i] << endl;
    }

       fout.close();
       wrange.clear(); w.clear();  coeff.clear(); pw.clear();

    return 0;
}