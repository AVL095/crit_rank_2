import sympy
from sympy import *

# Crit name input
finp=open("common.inp","r")
crit=finp.readline()
crit=crit.strip()
# Sample 1
m=int(finp.readline())
# Sample 2
n=int(finp.readline())
finp.close()

x,y=symbols('x y')
N=m+n
z=1
kk=N+1
kx=Rational((N+1)/2)
km=m   

#Производящие функции частот для трех критериев

if crit=="Mood":
    for i in range(1,kk):z=z*(1+x**((i-kx)*(i-kx))*y)
elif crit=="Ansari":
    for i in range(1,kk):z=z*(1+(x**(abs(i-kx)))*y)
    km=n
    a0=((m+1)//2)*(1+(m//2))
elif crit=="Wilcoxon":
    for i in range(1,kk):z=z*(1+(x**i*y))
    a0=(m+1)*m/2 


fout=open("common.csv",'w')

# Коэффициенты при y^m, или y^n для критерия Ансари-Брэдли
zz=expand(z).coeff(y**km)
poly_float=zz.evalf()
wrange=[]

#Степени полинома

deg=[(monomial.as_coeff_exponent(x)[1]) for monomial in Add.make_args(poly_float)]
deg.sort()
k=len(deg)

#Коэффициенты полинома (частотная функция)

for i in range(k):
    wrange.append(poly_float.coeff(x**deg[i]))

if(crit=="Ansari"): 
    for i in range(k):deg[i]=(a0+i)
if(crit=="Wilcoxon"): 
    for i in range(k):deg[i]=(a0+i)

sum=0
for i in range(k): sum=sum+wrange[i]
s=0
pw=[]
for i in range(k):
    s=s+wrange[i]
    pw.append(s*1.0/sum)

print(crit,file=fout)
print("Size",";",k,file=fout)
print("m",";",m,";","n",";",n,file=fout)
for i in range(k):print(deg[i],"   ",pw[i],file=fout)

fout.close()
