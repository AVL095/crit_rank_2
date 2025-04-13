from sympy import symbols,expand,Poly,Rational,product
from sympy import degree,degree_list
from sympy.abc import x, y

# Crit name input
finp=open("common.inp","r")
crit=finp.readline()
crit=crit.strip()
# Sample 1
m=int(finp.readline())
# Sample 2
n=int(finp.readline())
finp.close()

km=m    
astart=0
x,y,i=symbols('x y i')
N=m+n
kk=N
kx=Rational((N+1)/2)

#Производящие функции частот для трех критериев

if crit=="Mood":
    z=product(1+x**(i-kx)**2*y,(i,1,kk))
elif crit=="Ansari":
    z=product(1+x**abs(i-kx)*y,(i,1,kk))
    astart=3
    km=n
elif crit=="Wilcoxon":
    z=product(1+x**i*y,(i,1,kk))
    
# Коэффициенты при y^m, или y^n для критерия Ансари-Брэдли
zz=expand(z).coeff(y**km)
# Коэффициенты в числовом формате - частоты распределения
w=Poly(zz).all_coeffs()
w=[x for x in w if x != 0]
k=len(w)
pw=[]
wrange=[]
wrange=list(zz.args)

# Статистика критерия: wrange[1,k]

for i in range(k):wrange[i]=degree(wrange[i])+astart
wrange.sort()
sum=0
for i in range(k): sum=sum+w[i]

w.reverse()

# Функция распределения критерия: pw[1,k]
s=0
for i in range(k):
    s=s+w[i]
    pw.append(s*1.0/sum)

# Вывод результатов
fout=open("common.csv",'w')

print(crit,file=fout)
print("Size",";",len(w),file=fout)
print("m",";",m,";","n",";",n,file=fout)
print("Freq",";","Rang",";","Prob",";",file=fout)

for i in range(k):print(w[i],";",wrange[i],";",pw[i],file=fout)

fout.close()
