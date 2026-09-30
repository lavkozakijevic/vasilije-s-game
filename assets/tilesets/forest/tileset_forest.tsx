<?xml version="1.0" encoding="UTF-8"?>
<tileset version="1.10" tiledversion="1.10.2" name="forest" tilewidth="32" tileheight="32" spacing="0" margin="0" tilecount="56" columns="8">
 <image source="tileset_forest.png" width="256" height="224"/>
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
   <property name="name" value="ground_c_roots"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="14">
  <properties>
   <property name="name" value="ground_c_stones"/>
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
   <property name="name" value="moving_l"/>
   <property name="moving" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="23">
  <properties>
   <property name="name" value="moving_r"/>
   <property name="moving" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="24">
  <properties>
   <property name="name" value="breakable"/>
   <property name="solid" type="bool" value="true"/>
   <property name="breakable" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="25">
  <properties>
   <property name="name" value="breakable_cracked"/>
   <property name="solid" type="bool" value="true"/>
   <property name="breakable" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="26">
  <properties>
   <property name="name" value="spikes"/>
   <property name="hazard" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="27">
  <properties>
   <property name="name" value="thorns_a"/>
   <property name="hazard" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="28">
  <properties>
   <property name="name" value="thorns_b"/>
   <property name="hazard" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="29">
  <properties>
   <property name="name" value="thorns_hanging"/>
   <property name="hazard" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="30">
  <properties>
   <property name="name" value="firejet_vent"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="31">
  <properties>
   <property name="name" value="water_body"/>
   <property name="water" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="32">
  <properties>
   <property name="name" value="water_surface_0"/>
   <property name="water" type="bool" value="true"/>
  </properties>
  <animation>
   <frame tileid="32" duration="160"/>
   <frame tileid="33" duration="160"/>
   <frame tileid="34" duration="160"/>
   <frame tileid="35" duration="160"/>
  </animation>
 </tile>
 <tile id="33">
  <properties>
   <property name="name" value="water_surface_1"/>
   <property name="water" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="34">
  <properties>
   <property name="name" value="water_surface_2"/>
   <property name="water" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="35">
  <properties>
   <property name="name" value="water_surface_3"/>
   <property name="water" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="36">
  <properties>
   <property name="name" value="firejet_flame_0"/>
   <property name="hazard" type="bool" value="true"/>
  </properties>
  <animation>
   <frame tileid="36" duration="90"/>
   <frame tileid="37" duration="90"/>
   <frame tileid="38" duration="90"/>
   <frame tileid="39" duration="90"/>
  </animation>
 </tile>
 <tile id="37">
  <properties>
   <property name="name" value="firejet_flame_1"/>
   <property name="hazard" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="38">
  <properties>
   <property name="name" value="firejet_flame_2"/>
   <property name="hazard" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="39">
  <properties>
   <property name="name" value="firejet_flame_3"/>
   <property name="hazard" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="40">
  <properties>
   <property name="name" value="deco_tuft"/>
   <property name="decor" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="41">
  <properties>
   <property name="name" value="deco_fern"/>
   <property name="decor" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="42">
  <properties>
   <property name="name" value="deco_mushrooms"/>
   <property name="decor" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="43">
  <properties>
   <property name="name" value="deco_rock"/>
   <property name="decor" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="44">
  <properties>
   <property name="name" value="deco_sign"/>
   <property name="decor" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="45">
  <properties>
   <property name="name" value="deco_bush_l"/>
   <property name="decor" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="46">
  <properties>
   <property name="name" value="deco_bush_r"/>
   <property name="decor" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="47">
  <properties>
   <property name="name" value="deco_flowers"/>
   <property name="decor" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="48">
  <properties>
   <property name="name" value="deco_stump"/>
   <property name="decor" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="49">
  <properties>
   <property name="name" value="deco_lantern"/>
   <property name="decor" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="50">
  <properties>
   <property name="name" value="deco_log"/>
   <property name="decor" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="51">
  <properties>
   <property name="name" value="deco_skull"/>
   <property name="decor" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="52">
  <properties>
   <property name="name" value="deco_glowcaps"/>
   <property name="decor" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="53">
  <properties>
   <property name="name" value="deco_vines"/>
   <property name="decor" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="54">
  <properties>
   <property name="name" value="deco_runestone"/>
   <property name="decor" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="55">
  <properties>
   <property name="name" value="deco_tallgrass"/>
   <property name="decor" type="bool" value="true"/>
  </properties>
 </tile>
</tileset>
