//表示場所の確保
var canvas = document.getElementById("renderCanvas");

// エンジン生成
var engine = new BABYLON.Engine(canvas);


//表示の中身（sceneの定義）
const createScene = function() {
  const scene = new BABYLON.Scene(engine);

  //カメラ設定
  const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, new BABYLON.Vector3(0, 0, 0));
  camera.attachControl(canvas, true);
  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));

  const car = buildCar();
  car.rotation.x = -Math.PI / 2;
  //car animation
  const animCar = new BABYLON.Animation("carAnimation", "position.x", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
  const carKeys = [];
  carKeys.push({frame: 0, value: -4});
  carKeys.push({frame: 150, value: 4});
  animCar.setKeys(carKeys);
  car.animations = [];
  car.animations.push(animCar);
  scene.beginAnimation(car, 0, 150, true);

  //車輪
  //見た目設定
  const wheelUV = [];
  wheelUV[0] = new BABYLON.Vector4(0, 0, 1, 1);
  wheelUV[1] = new BABYLON.Vector4(0, 0.5, 0, 0.5);
  wheelUV[2] = new BABYLON.Vector4(0, 0, 1, 1);
  const wheelMat = new BABYLON.StandardMaterial("wheelMat");
  wheelMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/wheel.png");

  //車輪設定
  const wheelRB = BABYLON.MeshBuilder.CreateCylinder("wheelRB", {diameter: 0.125, height: 0.05, faceUV: wheelUV});
  wheelRB.material = wheelMat;  //見た目適応
  wheelRB.parent = car;  //carとくっ付ける
  wheelRB.position.z = -0.1;
  wheelRB.position.x = -0.2;
  wheelRB.position.y = 0.035;

  wheelRF = wheelRB.clone("wheelRF");
  wheelRF.position.x = 0.1;

  wheelLB = wheelRB.clone("wheelLB");
  wheelLB.position.y = -0.2 - 0.035;

  wheelLF = wheelRF.clone("wheelLF");
  wheelLF.position.y = -0.2 - 0.035;

  //Animate the Wheels
  const animWheel = new BABYLON.Animation("wheelAnimation", "rotation.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

  const wheelKeys = []; 

  //At the animation key 0, the value of rotation.y is 0
  wheelKeys.push({
      frame: 0,
      value: 0
  });

  //At the animation key 30, (after 1 sec since animation fps = 30) the value of rotation.y is 2PI for a complete rotation
  wheelKeys.push({
      frame: 30,
      value: 2 * Math.PI
  });

  //set the keys
  animWheel.setKeys(wheelKeys);

  //Link this animation to a wheel
  wheelRB.animations = [];
  wheelRB.animations.push(animWheel);
  wheelRF.animations = [];
  wheelRF.animations.push(animWheel);
  wheelLB.animations = [];
  wheelLB.animations.push(animWheel);
  wheelLF.animations = [];
  wheelLF.animations.push(animWheel);

  scene.beginAnimation(wheelRB, 0, 30, true);
  scene.beginAnimation(wheelRF, 0, 30, true);
  scene.beginAnimation(wheelLB, 0, 30, true);
  scene.beginAnimation(wheelLF, 0, 30, true);

  return scene;
}


const buildCar = function() {
  //ベース
  const outline = [
    new BABYLON.Vector3(-0.3, 0, -0.1),
    new BABYLON.Vector3(0.2, 0, -0.1),
  ]

  //カーブ
  for (let i = 0; i < 20; i++) {
    outline.push(new BABYLON.Vector3(0.2 * Math.cos(i * Math.PI / 40), 0, 0.2 * Math.sin(i * Math.PI / 40) - 0.1));
  }

  //上側
  outline.push(new BABYLON.Vector3(0, 0, 0.1));
  outline.push(new BABYLON.Vector3(-0.3, 0, 0.1));

  //見た目
  const faceUV = [];
  faceUV[0] = new BABYLON.Vector4(0, 0.5, 0.38, 1);
  faceUV[1] = new BABYLON.Vector4(0, 0, 1, 0.5);
  faceUV[2] = new BABYLON.Vector4(0.38, 1, 0, 0.5);

  const carMat = new BABYLON.StandardMaterial("carMat");
  carMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/car.png");

  //carの定義
  const car = BABYLON.MeshBuilder.ExtrudePolygon("car", {shape: outline, depth: 0.2, faceUV: faceUV, wrap: true});
  car.material = carMat;

  return car;
}

//（定義したsceneを変数（定数でもいい）で定義）
var scene = createScene();

//定義した変数を実行する関数を定義
engine.runRenderLoop(function() {
  //表示の実行
  scene.render();
});

