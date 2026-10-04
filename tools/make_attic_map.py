# Builds assets/maps/attic_l6.tmj (Level 6, Mishika in the Attic) from a column height map.
# Run: python3 tools/make_attic_map.py   (tile ids are tileset_attic.tsj ids; the .tmj stores id + 1)
import json, random, os
random.seed(11)
W, H = 64, 12
FLIP = 0x80000000
ground = [[0] * W for _ in range(H)]; decor_back = [[0] * W for _ in range(H)]; decor = [[0] * W for _ in range(H)]; fg = [[0] * W for _ in range(H)]
ents = []
def put(layer, r, c, tid, flip=False): layer[r][c] = (tid + 1) | (FLIP if flip else 0)
def ent(type_, name, x, y, w=32, h=32):
    ents.append(dict(id=len(ents) + 1, name=name, type=type_, x=x, y=y, width=w, height=h, rotation=0, visible=True))

# The attic at the kids' scale. Mita starts on the hatch (left), finds Mishika (she hides twice: beam -> wardrobe ->
# the high beam on the right), then carries her back to the hatch. Every step of the route is at most 2 rows up and
# 2 columns across, or reached with the mattress; the rope is a shortcut over the baby rats.
for c in range(W):
    put(ground, 0, c, 17)                                   # roof boards
    put(ground, 9, c, 1)
    for y in (10, 11): put(ground, y, c, 9)
put(ground, 1, 0, 18); put(ground, 1, W - 1, 19)
for c in range(6, W, 10): put(decor_back, 1, c, 71)        # cobwebs hanging from the rafters
put(decor, 1, 1, 69); put(decor, 1, W - 2, 70)
def row(r, c0, ids, layer=None):
    for i, t in enumerate(ids): put(layer or ground, r, c0 + i, t)
def beam(r, c0, c1): row(r, c0, [20] + [21] * (c1 - c0 - 1) + [22])
def skylight(c): row(1, c, [63, 64], decor_back); row(2, c, [65, 66], decor_back); row(3, c, [67, 68], fg)
def spot(name, c, r): ent('cat_spot', name, c * 32, r * 32 - 32, 32, 32)

row(9, 2, [83, 84]); ent('hatch', 'hatch', 64, 288, 64, 32); ent('hero_kid', 'player_spawn', 64, 257)
row(8, 6, [81, 82], decor); put(decor, 8, 9, 75); skylight(12); put(decor_back, 4, 8, 72)
# the first beam (Mishika's first hiding spot)
put(ground, 8, 11, 30); put(ground, 7, 12, 31); put(ground, 8, 12, 32)
beam(6, 13, 21); spot('spot1', 20, 6)
ent('enemy_rat', 'rat', 16 * 32, 257)
# creaky boards up to the second beam; the rope over the baby rats
row(6, 22, [26, 26, 26, 26]); beam(4, 26, 33); put(decor_back, 3, 24, 73)
ent('rope', 'rope', 36 * 32 + 16, 160)
for c in (35, 36, 37): ent('enemy_rat_small', 'baby_rat', c * 32, 257)
ent('enemy_rat', 'rat', 30 * 32, 257); skylight(38); put(decor_back, 3, 40, 72)
# suitcases, the rocking chair, the mattress up to the third beam
row(8, 41, [37, 38]); row(7, 41, [39, 40]); put(decor, 8, 43, 76)
row(7, 44, [54, 55]); row(8, 44, [56, 57])
put(ground, 8, 47, 58); beam(3, 46, 52); put(decor, 8, 49, 74); put(decor, 8, 51, 78)
ent('enemy_rat', 'rat', 50 * 32, 257)
# the wardrobe (second hiding spot), a stack of boxes, the high beam (third)
put(ground, 7, 53, 31); put(ground, 8, 53, 30)
row(6, 54, [41, 42]); row(7, 54, [43, 44]); row(8, 54, [45, 46]); spot('spot2', 54, 6)
for r in (5, 6, 7, 8): put(ground, r, 57, [32, 30, 31, 30][r - 5])
beam(3, 58, 62); spot('spot3', 61, 3)
put(decor, 8, 59, 79); put(decor, 8, 61, 80); ent('enemy_rat', 'rat', 60 * 32, 257)
flat = lambda layer: [v for row_ in layer for v in row_]
m = dict(compressionlevel=-1, height=H, width=W, infinite=False, orientation='orthogonal', renderorder='right-down', tilewidth=32, tileheight=32, type='map', version='1.10', tiledversion='1.10.2',
         nextlayerid=10, nextobjectid=len(ents) + 1, tilesets=[dict(firstgid=1, source='../tilesets/attic/tileset_attic.tsj')], layers=[])
for i, (n, px) in enumerate([('sky', 0), ('far', 0.2), ('mid', 0.45), ('near', 0.7)]):
    m['layers'].append(dict(id=i + 1, name='bg_' + n, type='imagelayer', image=f'../backgrounds/attic/bg_attic_{n}.png', repeatx=True, parallaxx=px, parallaxy=1, opacity=1, visible=True, x=0, y=0))
for i, (n, L) in enumerate([('decor_back', decor_back), ('ground', ground), ('decor', decor), ('foreground', fg)]):
    m['layers'].append(dict(id=5 + i, name=n, type='tilelayer', width=W, height=H, x=0, y=0, opacity=1, visible=True, data=flat(L)))
m['layers'].append(dict(id=9, name='entities', type='objectgroup', draworder='topdown', opacity=1, visible=True, x=0, y=0, objects=ents))
out = os.path.join(os.path.dirname(__file__), '..', 'assets', 'maps', 'attic_l6.tmj')
json.dump(m, open(out, 'w'), indent=1)
print('wrote', out, '| width', W)
