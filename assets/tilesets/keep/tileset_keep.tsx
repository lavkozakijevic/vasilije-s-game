<?xml version="1.0" encoding="UTF-8"?>
<tileset version="1.10" tiledversion="1.10.2" name="keep" tilewidth="32" tileheight="32" tilecount="72" columns="8">
 <image source="tileset_keep.png" width="256" height="288"/>
 <tile id="0">
  <properties>
   <property name="name" value="ground_tl"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="1">
  <properties>
   <property name="name" value="ground_t"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="2">
  <properties>
   <property name="name" value="ground_tr"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="3">
  <properties>
   <property name="name" value="inner_nw"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="4">
  <properties>
   <property name="name" value="inner_ne"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="5">
  <properties>
   <property name="name" value="slope_up"/>
   <property name="solid" type="bool" value="true"/>
   <property name="slope" type="bool" value="true"/>
   <property name="slope_dir" value="up"/>
  </properties>
 </tile>
 <tile id="6">
  <properties>
   <property name="name" value="slope_down"/>
   <property name="solid" type="bool" value="true"/>
   <property name="slope" type="bool" value="true"/>
   <property name="slope_dir" value="down"/>
  </properties>
 </tile>
 <tile id="7">
  <properties>
   <property name="name" value="ground_single"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="8">
  <properties>
   <property name="name" value="ground_l"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="9">
  <properties>
   <property name="name" value="ground_c"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="10">
  <properties>
   <property name="name" value="ground_r"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="11">
  <properties>
   <property name="name" value="inner_sw"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="12">
  <properties>
   <property name="name" value="inner_se"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="13">
  <properties>
   <property name="name" value="ground_c_cracked"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="14">
  <properties>
   <property name="name" value="ground_c_banner"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="15">
  <properties>
   <property name="name" value="ground_pillar"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="16">
  <properties>
   <property name="name" value="ground_bl"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="17">
  <properties>
   <property name="name" value="ground_b"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="18">
  <properties>
   <property name="name" value="ground_br"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="19">
  <properties>
   <property name="name" value="oneway_l"/>
   <property name="oneway" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="20">
  <properties>
   <property name="name" value="oneway_m"/>
   <property name="oneway" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="21">
  <properties>
   <property name="name" value="oneway_r"/>
   <property name="oneway" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="22">
  <properties>
   <property name="name" value="scaffold_l"/>
   <property name="oneway" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="23">
  <properties>
   <property name="name" value="scaffold_m"/>
   <property name="oneway" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="24">
  <properties>
   <property name="name" value="scaffold_r"/>
   <property name="oneway" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="25">
  <properties>
   <property name="name" value="crumble_0"/>
   <property name="oneway" type="bool" value="true"/>
   <property name="crumble" type="bool" value="true"/>
   <property name="crumble_frame" type="int" value="0"/>
   <property name="crumble_delay_ms" type="int" value="450"/>
  </properties>
 </tile>
 <tile id="26">
  <properties>
   <property name="name" value="crumble_1"/>
   <property name="oneway" type="bool" value="true"/>
   <property name="crumble" type="bool" value="true"/>
   <property name="crumble_frame" type="int" value="1"/>
   <property name="crumble_delay_ms" type="int" value="450"/>
  </properties>
 </tile>
 <tile id="27">
  <properties>
   <property name="name" value="crumble_2"/>
   <property name="oneway" type="bool" value="true"/>
   <property name="crumble" type="bool" value="true"/>
   <property name="crumble_frame" type="int" value="2"/>
   <property name="crumble_delay_ms" type="int" value="450"/>
  </properties>
 </tile>
 <tile id="28">
  <properties>
   <property name="name" value="crumble_3"/>
   <property name="crumble" type="bool" value="true"/>
   <property name="crumble_frame" type="int" value="3"/>
   <property name="crumble_delay_ms" type="int" value="450"/>
  </properties>
 </tile>
 <tile id="29">
  <properties>
   <property name="name" value="shadow_bridge_0_faint"/>
   <property name="shadow_bridge" type="bool" value="true"/>
   <property name="bridge_frame" type="int" value="0"/>
   <property name="bridge_state" value="faint"/>
   <property name="bridge_note" value="shows 0 (faint) until Konstantin's light touches it: 1 (100ms) -> 2 (solid while lit + 1.5s) -> 3 (200ms) -> 0. Solid (oneway) only on frame 2."/>
  </properties>
 </tile>
 <tile id="30">
  <properties>
   <property name="name" value="shadow_bridge_1_appearing"/>
   <property name="shadow_bridge" type="bool" value="true"/>
   <property name="bridge_frame" type="int" value="1"/>
   <property name="bridge_state" value="appearing"/>
   <property name="bridge_note" value="shows 0 (faint) until Konstantin's light touches it: 1 (100ms) -> 2 (solid while lit + 1.5s) -> 3 (200ms) -> 0. Solid (oneway) only on frame 2."/>
  </properties>
 </tile>
 <tile id="31">
  <properties>
   <property name="name" value="shadow_bridge_2_solid"/>
   <property name="oneway" type="bool" value="true"/>
   <property name="shadow_bridge" type="bool" value="true"/>
   <property name="bridge_frame" type="int" value="2"/>
   <property name="bridge_state" value="solid"/>
   <property name="bridge_note" value="shows 0 (faint) until Konstantin's light touches it: 1 (100ms) -> 2 (solid while lit + 1.5s) -> 3 (200ms) -> 0. Solid (oneway) only on frame 2."/>
  </properties>
 </tile>
 <tile id="32">
  <properties>
   <property name="name" value="shadow_bridge_3_fading"/>
   <property name="shadow_bridge" type="bool" value="true"/>
   <property name="bridge_frame" type="int" value="3"/>
   <property name="bridge_state" value="fading"/>
   <property name="bridge_note" value="shows 0 (faint) until Konstantin's light touches it: 1 (100ms) -> 2 (solid while lit + 1.5s) -> 3 (200ms) -> 0. Solid (oneway) only on frame 2."/>
  </properties>
 </tile>
 <tile id="33">
  <properties>
   <property name="name" value="hidden_ledge_hidden"/>
   <property name="hidden_ledge" type="bool" value="true"/>
   <property name="ledge_state" value="hidden"/>
   <property name="ledge_note" value="no collision while hidden; swap to 34 (oneway) when fx_eagle_mark lands on it"/>
  </properties>
 </tile>
 <tile id="34">
  <properties>
   <property name="name" value="hidden_ledge_revealed"/>
   <property name="oneway" type="bool" value="true"/>
   <property name="hidden_ledge" type="bool" value="true"/>
   <property name="ledge_state" value="revealed"/>
   <property name="ledge_note" value="no collision while hidden; swap to 34 (oneway) when fx_eagle_mark lands on it"/>
  </properties>
 </tile>
 <tile id="35">
  <properties>
   <property name="name" value="abyss_body"/>
   <property name="hazard" type="bool" value="true"/>
   <property name="abyss" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="36">
  <properties>
   <property name="name" value="abyss_surface_0"/>
   <property name="hazard" type="bool" value="true"/>
   <property name="abyss" type="bool" value="true"/>
  </properties>
  <animation>
   <frame tileid="36" duration="180"/>
   <frame tileid="37" duration="180"/>
   <frame tileid="38" duration="180"/>
   <frame tileid="39" duration="180"/>
  </animation>
 </tile>
 <tile id="37">
  <properties>
   <property name="name" value="abyss_surface_1"/>
   <property name="hazard" type="bool" value="true"/>
   <property name="abyss" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="38">
  <properties>
   <property name="name" value="abyss_surface_2"/>
   <property name="hazard" type="bool" value="true"/>
   <property name="abyss" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="39">
  <properties>
   <property name="name" value="abyss_surface_3"/>
   <property name="hazard" type="bool" value="true"/>
   <property name="abyss" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="40">
  <properties>
   <property name="name" value="iron_spikes"/>
   <property name="hazard" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="41">
  <properties>
   <property name="name" value="deco_cold_torch"/>
   <property name="decor" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="42">
  <properties>
   <property name="name" value="tendrils_0"/>
   <property name="hazard" type="bool" value="true"/>
  </properties>
  <animation>
   <frame tileid="42" duration="130"/>
   <frame tileid="43" duration="130"/>
   <frame tileid="44" duration="130"/>
   <frame tileid="45" duration="130"/>
  </animation>
 </tile>
 <tile id="43">
  <properties>
   <property name="name" value="tendrils_1"/>
   <property name="hazard" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="44">
  <properties>
   <property name="name" value="tendrils_2"/>
   <property name="hazard" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="45">
  <properties>
   <property name="name" value="tendrils_3"/>
   <property name="hazard" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="46">
  <properties>
   <property name="name" value="bounce_idle"/>
   <property name="bounce" type="bool" value="true"/>
   <property name="bounce_multiplier" type="float" value="2.2"/>
  </properties>
 </tile>
 <tile id="47">
  <properties>
   <property name="name" value="bounce_0"/>
   <property name="bounce" type="bool" value="true"/>
   <property name="bounce_multiplier" type="float" value="2.2"/>
  </properties>
 </tile>
 <tile id="48">
  <properties>
   <property name="name" value="bounce_1"/>
   <property name="bounce" type="bool" value="true"/>
   <property name="bounce_multiplier" type="float" value="2.2"/>
  </properties>
 </tile>
 <tile id="49">
  <properties>
   <property name="name" value="bounce_2"/>
   <property name="bounce" type="bool" value="true"/>
   <property name="bounce_multiplier" type="float" value="2.2"/>
  </properties>
 </tile>
 <tile id="50">
  <properties>
   <property name="name" value="bounce_3"/>
   <property name="bounce" type="bool" value="true"/>
   <property name="bounce_multiplier" type="float" value="2.2"/>
  </properties>
 </tile>
 <tile id="51">
  <properties>
   <property name="name" value="library_end_top"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="52">
  <properties>
   <property name="name" value="library_top"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="53">
  <properties>
   <property name="name" value="library_interior"/>
   <property name="hidden_room" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="54">
  <properties>
   <property name="name" value="library_bottom"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="55">
  <properties>
   <property name="name" value="library_end_mid"/>
  </properties>
 </tile>
 <tile id="56">
  <properties>
   <property name="name" value="library_end_bottom"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="57">
  <properties>
   <property name="name" value="library_interior_fireplace"/>
   <property name="hidden_room" type="bool" value="true"/>
   <property name="note" value="warm fireplace; animate by nothing, or add a flicker in-engine"/>
  </properties>
 </tile>
 <tile id="58">
  <properties>
   <property name="name" value="library_facade"/>
   <property name="foreground" type="bool" value="true"/>
   <property name="fade_when_behind" type="bool" value="true"/>
   <property name="cover_for" value="hidden_room"/>
  </properties>
 </tile>
 <tile id="59">
  <properties>
   <property name="name" value="chains_l"/>
   <property name="foreground" type="bool" value="true"/>
   <property name="fade_when_behind" type="bool" value="true"/>
   <property name="fade_alpha_note" value="engine fades whole layer to ~35% while hero overlaps"/>
  </properties>
 </tile>
 <tile id="60">
  <properties>
   <property name="name" value="chains_m"/>
   <property name="foreground" type="bool" value="true"/>
   <property name="fade_when_behind" type="bool" value="true"/>
   <property name="fade_alpha_note" value="engine fades whole layer to ~35% while hero overlaps"/>
  </properties>
 </tile>
 <tile id="61">
  <properties>
   <property name="name" value="chains_r"/>
   <property name="foreground" type="bool" value="true"/>
   <property name="fade_when_behind" type="bool" value="true"/>
   <property name="fade_alpha_note" value="engine fades whole layer to ~35% while hero overlaps"/>
  </properties>
 </tile>
 <tile id="62">
  <properties>
   <property name="name" value="chains_fringe"/>
   <property name="foreground" type="bool" value="true"/>
   <property name="fade_when_behind" type="bool" value="true"/>
   <property name="fade_alpha_note" value="engine fades whole layer to ~35% while hero overlaps"/>
  </properties>
 </tile>
 <tile id="63">
  <properties>
   <property name="name" value="chains_fill"/>
   <property name="foreground" type="bool" value="true"/>
   <property name="fade_when_behind" type="bool" value="true"/>
   <property name="fade_alpha_note" value="engine fades whole layer to ~35% while hero overlaps"/>
  </properties>
 </tile>
 <tile id="64">
  <properties>
   <property name="name" value="deco_chair"/>
   <property name="decor" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="65">
  <properties>
   <property name="name" value="deco_table_l"/>
   <property name="decor" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="66">
  <properties>
   <property name="name" value="deco_table_r"/>
   <property name="decor" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="67">
  <properties>
   <property name="name" value="deco_candles"/>
   <property name="decor" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="68">
  <properties>
   <property name="name" value="deco_armour"/>
   <property name="decor" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="69">
  <properties>
   <property name="name" value="deco_cobweb"/>
   <property name="decor" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="70">
  <properties>
   <property name="name" value="deco_mrak_portrait"/>
   <property name="decor" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="71">
  <properties>
   <property name="name" value="deco_yarn_door"/>
   <property name="decor" type="bool" value="true"/>
  </properties>
 </tile>
</tileset>
