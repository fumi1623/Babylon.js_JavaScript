//表示場所の確保
var canvas = document.getElementById("renderCanvas");

// エンジン生成
var engine = new BABYLON.Engine(canvas);

const createScene = function()  {

  const scene = new BABYLON.Scene(engine);

  const camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", -Math.PI / 2, Math.PI / 2.2, 10, new BABYLON.Vector3(0, 0, 0), scene);
  camera.attachControl(canvas, true);
  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

  const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 25, height: 25});
  ground.material = new BABYLON.GridMaterial("groundMat", scene);
  ground.material.backFaceCulling = false;

  const particleSystem = new BABYLON.ParticleSystem("particles", 2000);
  particleSystem.particleTexture = new BABYLON.Texture("texture/flare.png");
  //パーティクルが放出される位置
  particleSystem.emitter = new BABYLON.Vector3(0, 0.5, 0);
  particleSystem.start();
  //lifetime
  particleSystem.minLifeTime = 2;
  particleSystem.maxLifeTime = 2;
  //出てくる量
  particleSystem.emitRate = 5;

  // //パーティクルの大きさ
  // particleSystem.minScaleX = 0.5;
  // particleSystem.maxScaleX = 0.5;

  // //Translation Pivot
  // particleSystem.minAngularSpeed = 2.8;
  // particleSystem.maxAngularSpeed = 3.2;
  // particleSystem.translationPivot = new BABYLON.Vector2(2, 2);

  // //direction
  // particleSystem.direction1 = new BABYLON.Vector3(-7, 4, 3).normalize();
  // particleSystem.direction2 = new BABYLON.Vector3(7, 4, -3).normalize();

  //gravity
  particleSystem.minLifeTime = 12;
  particleSystem.maxLifeTime = 12;

  particleSystem.direction1 = new BABYLON.Vector3(1, 1.5, 0);
  particleSystem.direction2 = new BABYLON.Vector3(-1, 1.5, 0);

  particleSystem.gravity = new BABYLON.Vector3(0, -0.5, 0);

  return scene;
}

//（定義したsceneを変数（定数でもいい）で定義）
var scene = createScene();

//定義した変数を実行する関数を定義
engine.runRenderLoop(function() {
  //表示の実行
  scene.render();
});