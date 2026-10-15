import glob, os, sys, numpy as np
from PIL import Image, ImageFilter, ImageOps
import os as _o
BLUE=np.array([int(_o.environ.get("BLUE","34528f")[i:i+2],16) for i in (0,2,4)]); RED=np.array([0x8f,0x4a,0x42]); PAPER=np.array([0xf1,0xec,0xe2])  # RED: muted brick vermilion (header seal stays #c8102e)
S=1024; P=34.0  # line period at 1024px  (~8.5px at 256)
y,x=np.mgrid[0:S,0:S].astype(float)
def screen(dark, phase):
    f=(phase/P)%1.0; d=np.abs(f-0.5)*2          # 0 at line centre .. 1 between lines
    return (d > 1-np.clip(dark,0,1)).astype(float) # ink where within half-width
# face lines: gently wavy horizontals; background: two crossing guilloche families
face_phase = y + 6*np.sin(x/57.0) + 3*np.sin(x/23.0)
r=np.hypot(x-S/2,y-S/2)
bgA = (x*0.7 + y*0.7)*1.6 + 14*np.sin(r/40.0)
bgB = (x*0.7 - y*0.7)*1.6 + 14*np.sin(r/40.0+1.3)
# Figure grading: (desaturation, warm paper multiply, ink tint, highlight ceiling)
GRADES={'subtle':(0.25,0.18,0.06,0.94),'medium':(0.45,0.30,0.12,0.88)}
grade=sys.argv[1] if len(sys.argv)>1 else 'medium'
outdir=sys.argv[2] if len(sys.argv)>2 else 'avatars/engraved/'
os.makedirs(outdir,exist_ok=True)
DS,WM,IT,HC=GRADES[grade]
WARM=np.array([0xe8,0xd9,0xc0])/255.0
from scipy import ndimage as ndi
GRAY=np.array([0x8a,0x8a,0x8a])
BGMODE=sys.argv[3] if len(sys.argv)>3 else 'guilloche'
HAIRFIX={'default-female.jpg','female-20-30.jpg','female-30-40.jpg','female-1-5.jpg'}
def figure_mask(fn):
    """Segment the figure at 256px: flood the background from the border, then
    clean the mask (fill holes, drop islands, morphological close)."""
    a=np.array(Image.open(fn).convert('RGB').filter(ImageFilter.MedianFilter(3))).astype(float)
    n=a.shape[0]
    border=np.concatenate([a[0],a[-1],a[:,0],a[:,-1]]); bgc=np.median(border,0)
    d=np.linalg.norm(a-bgc,axis=2)
    # background = light, smooth area reachable from the border (it has a soft vignette,
    # so match on smoothness + lightness rather than one colour); outlines block the flood
    g=a.mean(2); grad=np.hypot(ndi.sobel(g,0),ndi.sobel(g,1))/8
    cand=((d<45)&(g>185)&(grad<6))|(d<14)
    cand=ndi.binary_opening(cand,iterations=1)
    lab,nl=ndi.label(cand)
    # seed only from top and upper sides: the shirt touches the bottom edge and must not be flooded
    edge=set(np.unique(np.concatenate([lab[0],lab[:int(n*0.6),0],lab[:int(n*0.6),-1]])))-{0}
    bg=np.isin(lab,list(edge))
    yy,xx=np.mgrid[0:n,0:n]
    head=(((xx-n*0.5)/(n*0.24))**2+((yy-n*0.38)/(n*0.30))**2<1)|((xx>n*0.32)&(xx<n*0.68))  # pockets only at the sides
    # enclosed pockets of true background (e.g. between arm and body): clearly bg-coloured, outside the head
    for k in range(1,nl+1):
        if k in edge: continue
        comp=lab==k
        if comp.sum()>=12 and d[comp].mean()<20 and cand[comp].mean()>0.7 and head[comp].mean()<0.3: bg|=comp
    # grow background into light, unoutlined fringe next to hair (dark outlines block it)
    lightfringe=(g>195)&(d<40)
    for _ in range(4): bg|=ndi.binary_dilation(bg)&lightfringe
    fig=~bg
    fig=ndi.binary_closing(fig,iterations=2)
    # remove small figure islands (keep the main body + anything sizeable)
    lab,nl=ndi.label(fig); sizes=ndi.sum(fig,lab,range(1,nl+1))
    if nl: fig=np.isin(lab,[k+1 for k,sz in enumerate(sizes) if sz>=max(150,0.02*sizes.max())])
    # fill holes in the figure, except confirmed background pockets kept above
    holes=ndi.binary_fill_holes(fig)&~fig
    lab,nl=ndi.label(holes)
    for k in range(1,nl+1):
        comp=lab==k
        if not (comp.sum()>=12 and d[comp].mean()<20 and cand[comp].mean()>0.7 and head[comp].mean()<0.3): fig|=comp
    # background showing between thin hair strands at the sides: small, clearly bg-coloured gaps
    lab,nl=ndi.label(fig&(d<18)&(g>200))
    for k in range(1,nl+1):
        comp=lab==k
        if comp.sum()<3 or head[comp].mean()>=0.3: continue
        ring=ndi.binary_dilation(comp,iterations=2)&~comp
        if g[ring].mean()<140: fig&=~comp   # only gaps framed by dark strands (not inside white hair)
    return fig
VARIANTS=[('', None), ('gray/', GRAY)]
for fn in sorted(glob.glob('avatars/*.jpg')):
  name=os.path.basename(fn); gender_ink = RED if name.startswith('female') or name=='default-female.jpg' else BLUE
  im=Image.open(fn).convert('RGB').resize((S,S),Image.LANCZOS)
  a=np.array(im).astype(float)
  fig256=figure_mask(fn)
  figS=np.array(Image.fromarray(fig256.astype('uint8')*255).resize((S,S),Image.BILINEAR))>127
  # soft key for pale gaps beside dark hair: alpha from distance to the old bg colour,
  # then un-premultiply so no light background stays in the edge pixels
  bgc=np.median(np.concatenate([a[0],a[:S//2,0],a[:S//2,-1]]),0)
  dd=np.linalg.norm(a-bgc,axis=2); gg=a.mean(2)
  yy,xx=np.mgrid[0:S,0:S]
  nearbg=ndi.distance_transform_edt(figS)<S*0.05
  zone=nearbg&((xx<S*0.30)|(xx>S*0.70))&(yy>S*0.2)&(yy<S*0.78)
  darkfrac=ndi.uniform_filter((gg<100).astype(float),size=S//16)
  sel=zone&(darkfrac>0.15)&(gg>110)
  ka=np.where(sel,np.clip((dd-14)/40,0,1),1.0)
  a=np.where(sel[...,None],np.clip((a-(1-ka[...,None])*bgc)/np.maximum(ka[...,None],0.25),0,255),a)
  for sub,override in VARIANTS:
    ink = gender_ink if override is None else override
    tint = gender_ink   # spouses keep their gender's figure tint; only the background changes
    os.makedirs(outdir+sub,exist_ok=True)
    TINT=0.22  # bg = ring ink at reduced opacity over white
    base=255*(1-TINT)+ink*TINT
    if override is not None: base=np.array([int(os.environ.get("SPOUSE_BG","e2dcd5")[i:i+2],16) for i in (0,2,4)],float)  # spouse: figure on the page colour (no bg tint)
    if BGMODE=='guilloche':
        back=np.maximum(screen(np.full((S,S),0.5),bgA), screen(np.full((S,S),0.4),bgB))
        back=np.array(Image.fromarray((back*255).astype('uint8')).filter(ImageFilter.GaussianBlur(1.5))).astype(float)/255
        bgimg=base*(1-0.10*back[...,None])+ink*0.10*back[...,None]
    else:
        bgimg=np.broadcast_to(base,(S,S,3)).astype(float)
    # graded colour figure
    c=a/255.0
    lum=(c@np.array([0.299,0.587,0.114]))[...,None]
    c=c*(1-DS)+lum*DS                                  # desaturate
    c=c*((1-WM)+WM*WARM)                               # warm paper multiply
    c=c*(1-IT)+(c*(tint/255.0))*IT*1.6                  # multiply tint toward gender ink
    c=np.minimum(c, HC-(HC-c)*0)*1.0                   # soften highlights (ceiling)
    c=np.where(c>0.75, 0.75+(c-0.75)*(HC-0.75)/0.25, c)
    fig=np.clip(c,0,1)*255
    if name in HAIRFIX:
        # colour decontamination: in a band at the figure edge, replace pale pixels with local dark-hair colour
        edge=(ndi.distance_transform_edt(figS)<S*0.025)&figS
        L=fig.mean(2); pale=edge&(L>150)&(darkfrac>0.15)
        w=(L<120).astype(float); k=S//40
        num=np.stack([ndi.uniform_filter(fig[...,i]*w,k) for i in range(3)],2); den=ndi.uniform_filter(w,k)[...,None]
        loc=np.where(den>0.02,num/np.maximum(den,1e-3),fig)
        fig=np.where(pale[...,None]&(den>0.02),loc,fig)
    # crisp edge: shrink figure mask 2px (at 1024) so no light halo, then 1px AA
    fm=Image.fromarray(figS.astype('uint8')*255).filter(ImageFilter.MinFilter(9 if name in HAIRFIX else 5)).filter(ImageFilter.GaussianBlur(1.0))
    fm=np.array(fm).astype(float)/255*ka
    fm=fm[...,None]
    out=fig*fm+bgimg*(1-fm)
    Image.fromarray(out.astype('uint8')).resize((256,256),Image.LANCZOS).save(outdir+sub+name,quality=90)
print('ok')
