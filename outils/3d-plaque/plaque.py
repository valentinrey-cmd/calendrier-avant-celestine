import numpy as np, json, math
from PIL import Image, ImageDraw, ImageFont, ImageFilter
W,H=1024,428
rng=np.random.default_rng(3)
# --- carte de hauteur : plaque polie, bord biseauté, texte et cœurs gravés en creux
hm=Image.new('L',(W,H),255); d=ImageDraw.Draw(hm)
d.rounded_rectangle((26,26,W-27,H-27),radius=70,outline=150,width=7)   # filet gravé
f=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSerifCondensed-BoldItalic.ttf',122)
t='03.07.2025'; bb=d.textbbox((0,0),t,font=f); tw,th=bb[2]-bb[0],bb[3]-bb[1]
d.text(((W-tw)/2-bb[0],(H-th)/2-bb[1]-6),t,font=f,fill=40)
def coeur(cx,cy,s,fill):
    pts=[(cx+s*16*math.sin(a)**3/16, cy-s*(13*math.cos(a)-5*math.cos(2*a)-2*math.cos(3*a)-math.cos(4*a))/16) for a in np.linspace(0,2*math.pi,80)]
    d.polygon(pts,fill=fill)
coeur(84,H/2,26,70); coeur(W-84,H/2,26,70)
h=np.asarray(hm.filter(ImageFilter.GaussianBlur(2.2)),dtype=np.float32)/255
# --- normal map
gy,gx=np.gradient(h); k=5.0
n=np.dstack([-gx*k,gy*k,np.ones_like(h)]); n/=np.linalg.norm(n,axis=2,keepdims=True)
Image.fromarray(((n*0.5+0.5)*255).astype(np.uint8)).save('normal.png')
# --- couleur : or poli légèrement brossé, creux plus sombres et mats
brosse=(rng.normal(0,1,(1,W))*np.ones((H,1)))
brosse=np.asarray(Image.fromarray(((brosse*0.5+0.5)*127+64).clip(0,255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8)),dtype=np.float32)/255
or_=np.array([0.99,0.84,0.60]); fond=np.array([0.50,0.34,0.16])
m=(1-h)[...,None]**0.8
col=or_*(0.965+0.035*brosse[...,None])*(1-m)+fond*m
Image.fromarray((col.clip(0,1)*255).astype(np.uint8)).save('couleur.png')
# rugosité (canal G) : poli dehors, mat dans les creux
rough=(0.16+0.5*(1-h)).clip(0,1)
mr=np.dstack([np.zeros_like(h),rough,np.ones_like(h)])
Image.fromarray((mr*255).astype(np.uint8)).save('metal.png')
# --- géométrie (repère du bracelet) ------------------------------------------
C=np.array([-0.002,-0.009,0.002]); a=math.radians(205)
r=np.array([math.cos(a),0,math.sin(a)]); u=np.array([math.sin(a),0,-math.cos(a)]); v=-r; up=np.array([0,1,0.])
L,Hp,T,R0=0.36,0.15,0.014,0.05   # longueur, hauteur, épaisseur, rayon des coins
cen=C+r*1.075+np.array([0,-0.028,0])
def contour(n=12):
    pts=[]
    for (sx,sy,a0) in [(1,1,0),(-1,1,90),(-1,-1,180),(1,-1,270)]:
        cx,cy=sx*(L/2-R0),sy*(Hp/2-R0)
        for i in range(n+1):
            t=math.radians(a0+90*i/n); pts.append((cx+R0*math.cos(t),cy+R0*math.sin(t)))
    return pts
P=contour(); N=len(P)
pos=[];nor=[];uv=[];idx=[]
def add(p,nn,t): pos.append(list(map(float,p)));nor.append(list(map(float,nn)));uv.append([float(t[0]),float(t[1])]);return len(pos)-1
def pt(x,y,z): return cen+u*x+v*y+up*z
# dessus (texturé) et dessous
for z,nz,flip in [(T/2,1,False),(-T/2,-1,True)]:
    c0=add(pt(0,0,z),up*nz,(0.5,0.5)); ring=[add(pt(x,y,z),up*nz,(x/L+0.5,0.5-y/Hp)) for x,y in P]
    for i in range(N):
        j=(i+1)%N; tri=[c0,ring[i],ring[j]]
        idx+= tri[::-1] if flip else tri
# flancs (sur le bord de la texture : or)
for i in range(N):
    j=(i+1)%N; (x0,y0),(x1,y1)=P[i],P[j]
    nx,ny=(y1-y0),-(x1-x0); ln=math.hypot(nx,ny); nn=(u*nx+v*ny)/ln
    a_=add(pt(x0,y0,T/2),nn,(0.02,0.02));b_=add(pt(x1,y1,T/2),nn,(0.02,0.02));c_=add(pt(x1,y1,-T/2),nn,(0.02,0.02));d_=add(pt(x0,y0,-T/2),nn,(0.02,0.02))
    idx+=[a_,d_,b_,b_,d_,c_]
plaque=dict(pos=pos,nor=nor,uv=uv,idx=idx)
# anneau : tore dans le plan (r, y), qui passe autour de la chaîne et dans la plaque
pos=[];nor=[];uv=[];idx=[]
rc=C+r*0.958+np.array([0,-0.03,0]); RR,rt=0.052,0.0085; nu,nv=40,10
for i in range(nu):
    t=2*math.pi*i/nu; dirc=r*math.cos(t)+up*math.sin(t)
    for j in range(nv):
        s=2*math.pi*j/nv; nn=dirc*math.cos(s)+u*math.sin(s)
        add(rc+dirc*RR+nn*rt,nn,(0.02,0.02))
for i in range(nu):
    for j in range(nv):
        a_=i*nv+j;b_=((i+1)%nu)*nv+j;c_=((i+1)%nu)*nv+(j+1)%nv;d_=i*nv+(j+1)%nv
        idx+=[a_,b_,c_,a_,c_,d_]
anneau=dict(pos=pos,nor=nor,uv=uv,idx=idx)
json.dump(dict(plaque=plaque,anneau=anneau,centre=list(map(float,cen)),theta=(90-205)%360),open('geo.json','w'))
print('centre plaque',cen.round(3),'theta camera',(90-205)%360)
