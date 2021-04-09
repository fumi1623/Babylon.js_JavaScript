//表示場所の確保
var canvas = document.getElementById("renderCanvas");

// エンジン生成
var engine = new BABYLON.Engine(canvas);


//表示の中身（sceneの定義）
const createScene = function() {
  const scene = new BABYLON.Scene(engine);

  const light1 = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(0, -1, 1));
  const light2 = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 1, 0));
  light1.intensity = 0.25;
  light2.intensity = 0.5;

  var frameRate = 20;

  var camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 3, -30), scene);

  //door
  var door = BABYLON.MeshBuilder.CreateBox("door", {width:2, height:4, depth:0.1}, scene);
  var hinge = BABYLON.MeshBuilder.CreateBox("hinge", {}, scene);
  hinge.isVisible = false;
  door.parent = hinge;
  hinge.position.y = 2;
  door.position.x = -1;
  //light
  var sphereLight = BABYLON.MeshBuilder.CreateSphere("Sphere", {diameter: 0.2}, scene);
  sphereLight.material = new BABYLON.StandardMaterial("", scene);
  sphereLight.material.emissiveColor = new BABYLON.Color3(1, 1, 1);
  sphereLight.position.x = 2;
  sphereLight.position.y = 3;
  sphereLight.position.z = 0.1;

  sphereLights = [sphereLight];
  lightPositions = [-2, 3, 6.9];

  for(var i = 0; i < 1; i++) {
    sphereLights.push(sphereLight.clone(""));
    sphereLights[i + 1].position = new BABYLON.Vector3(lightPositions[3*i], lightPositions[3*i + 1], lightPositions[3*i + 2]);

    var spotLights = [];
    var lightDirections = [-0.5, -0.25, 1, 0, 0, -1]
    for(var i = 0; i < sphereLights.length; i++) {
      spotLights[i] = new BABYLON.SpotLight("spotlight" + i, sphereLights[i].position, new BABYLON.Vector3(lightDirections[3*i], lightDirections[3*i + i], lightDirections[3*i + 2]), Math.PI / 8, 5, scene);
      spotLights[i].diffuse = new BABYLON.Color3(1, 1, 1);
      spotLights[i].specular = new BABYLON.Color3(0.5, 0.5, 0.5);
      spotLights[i].intensity = 0;
    }
  }

  //animation
  //camera一周
  var rotate = new BABYLON.Animation("rotate", "rotation.y", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
  var rotate_keys = [];
  rotate_keys.push({frame: 0, value: 0});
  rotate_keys.push({frame: 9 * frameRate, value: 0});
  rotate_keys.push({frame: 14 * frameRate, value: Math. PI});
  rotate.setKeys(rotate_keys);
  //前に動く
  var movein = new BABYLON.Animation("movein", "position", frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
  var movein_keys = [];
  movein_keys.push({frame: 0, value: new BABYLON.Vector3(0, 5, -30)});
  movein_keys.push({frame: 3 * frameRate, value: new BABYLON.Vector3(0, 2, -10)});
  movein_keys.push({frame: 5 * frameRate, value: new BABYLON.Vector3(0, 2, -10)});
  movein_keys.push({frame: 8 * frameRate, value: new BABYLON.Vector3(-2, 2, 3)});
  movein.setKeys(movein_keys);
  //door open and close
  var sweep = new BABYLON.Animation("sweep", "rotation.y", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
  var sweep_keys = [];
  sweep_keys.push({frame: 0, value: 0});
  sweep_keys.push({frame: 3 * frameRate, value: 0});
  sweep_keys.push({frame: 5 * frameRate, value: Math.PI/3});
  sweep_keys.push({frame: 13 * frameRate, value: Math.PI/3});
  sweep_keys.push({frame: 15 * frameRate, value: 0});
  sweep.setKeys(sweep_keys);
  //光を明るくしたり暗くしたり
  var lightDimmer = new BABYLON.Animation("dimmer", "intensity", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
  var light_keys = [];
  light_keys.push({frame: 0, value: 0});
  light_keys.push({frame: 7 * frameRate, value: 0});
  light_keys.push({frame: 10 * frameRate, value: 1});
  light_keys.push({frame: 14 * frameRate, value: 1});
  light_keys.push({frame: 15 * frameRate, value: 0});
  lightDimmer.setKeys(light_keys);

  //animation実行
  scene.beginDirectAnimation(camera, [movein, rotate], 0, 25 * frameRate, false);
  scene.beginDirectAnimation(hinge, [sweep], 0, 25 * frameRate, false);
  scene.beginDirectAnimation(spotLights[0], [lightDimmer], 0, 25 * frameRate, false);
  scene.beginDirectAnimation(spotLights[1], [lightDimmer.clone()], 0, 25 * frameRate, false);

  //地面と壁
  var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 50, height: 50}, scene);

  var wall1 =BABYLON.MeshBuilder.CreateBox("door", {width:8, height:6, depth:0.1}, scene);
  wall1.position.x = -6;
  wall1.position.y = 3;
  var wall2 =BABYLON.MeshBuilder.CreateBox("door", {width:4, height:6, depth:0.1}, scene);
  wall2.position.x = 2;
  wall2.position.y = 3;
  var wall3 =BABYLON.MeshBuilder.CreateBox("door", {width:2, height:2, depth:0.1}, scene);
  wall3.position.x = -1;
  wall3.position.y = 5;
  var wall4 =BABYLON.MeshBuilder.CreateBox("door", {width:14, height:6, depth:0.1}, scene);
  wall4.position.x = -3;
  wall4.position.y = 3;
  wall4.position.z = 7;
  var wall5 =BABYLON.MeshBuilder.CreateBox("door", {width:7, height:6, depth:0.1}, scene);
  wall5.rotation.y = Math.PI/2;
  wall5.position.x = -6;
  wall5.position.y = 3;
  wall5.position.z = 3.5;
  var wall6 =BABYLON.MeshBuilder.CreateBox("door", {width:7, height:6, depth:0.1}, scene);
  wall6.rotation.y = Math.PI/2;
  wall6.position.x = 4;
  wall6.position.y = 3;
  wall6.position.z = 3.5;
  var roof = BABYLON.MeshBuilder.CreateBox("door", {width:14, height:7, depth:0.1}, scene);
  roof.rotation.x = Math.PI/2;
  roof.position.x = -3;
  roof.position.y = 6;
  roof.position.z = 3.5;


  return scene;
}

//（定義したsceneを変数（定数でもいい）で定義）
var scene = createScene();

//定義した変数を実行する関数を定義
engine.runRenderLoop(function() {
  //表示の実行
  scene.render();
});

